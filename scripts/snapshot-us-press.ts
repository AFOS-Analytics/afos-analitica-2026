/**
 * Arquiva a coleta de imprensa dos EUA em disco, a partir do que está no Neon.
 *
 * POR QUE EXISTE
 * Duas necessidades diferentes, atendidas pelo mesmo passo:
 *
 * 1. **Dataset.** A coleta de imprensa é sinal do AFOS como as pesquisas e o
 *    mercado, e até 03/Ago/2026 ela só existia em linha de banco. Linha de banco
 *    é sobrescrita pelo upsert do dia e não dá diff. O arquivo datado dá.
 *
 * 2. **Piso de leitura.** `lib/dashboard/us-press-data.ts` cai para
 *    `public/us-press-data.json` quando não consegue ler o banco, em vez de
 *    apagar a seção do painel. Sem este script aquele piso nunca existiria.
 *
 * CONTRATO, igual ao do dataset do Hugging Face
 * O arquivo da data **corrente** pode ser regerado no dia, porque a coleta roda
 * mais de uma vez. **Data encerrada nunca é reescrita.** Erro em data passada se
 * corrige por errata, não por reescrita, senão a série deixa de ser auditável.
 *
 * ⏳ E A DATA CORRENTE SÓ NASCE DEPOIS DO ÚLTIMO CRON DO DIA, desde 15/Set/2026.
 * Criada antes, ela congela a coleta parcial quando o dia UTC vira. A regra, e
 * por que ela lê a agenda do vercel.json, está em lib/us-press/data-corrente.mjs.
 *
 * Uso:
 *   npx tsx scripts/snapshot-us-press.ts                  # ensaio, não escreve
 *   npx tsx scripts/snapshot-us-press.ts --apply
 *   npx tsx scripts/snapshot-us-press.ts --apply --dia-corrente   # cria a data de hoje mesmo cedo
 *   npx tsx scripts/snapshot-us-press.ts --apply --regerar-encerradas  # reescreve data encerrada que DIFERE, com ERRATA.json
 */
import { config } from 'dotenv'
config({ path: '.env.local' })
config({ path: '.env' })

import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync } from 'fs'
import { join } from 'path'
import { pathToFileURL } from 'url'
import { agendaDaRota, decidirDataCorrente, ultimoCronDoDia, ACOES } from '../lib/us-press/data-corrente.mjs'

const APLICAR = process.argv.includes('--apply')
const FORCAR_DIA_CORRENTE = process.argv.includes('--dia-corrente')

/**
 * 🔴 `--regerar-encerradas`: reescreve data ENCERRADA cujo conteúdo em disco
 * DIFERE do banco, e REGISTRA cada reescrita em `ERRATA.json`.
 *
 * ⚖️ Decisão do André em 05/Out/2026, depois de eu apresentar a escolha errada.
 * O contrato no topo deste arquivo diz que erro em data passada se corrige por
 * ERRATA e não por reescrita, porque reescrita silenciosa tira a auditabilidade
 * da série. A decisão foi fazer as DUAS coisas: regerar e registrar.
 *
 * 📊 O passivo que a criou: em 05/Out, 29 das 68 datas guardavam a coleta do
 * MEIO do dia. O arquivador rodava antes do último cron, gravava a coleta
 * parcial, o cron das 19:20Z depois atualizava o banco com a final, e na passada
 * seguinte a data já estava encerrada. Testado sobre as 68: 68 de 68 sem
 * exceção, toda data que difere foi arquivada antes de 19:20Z.
 *
 * ⛔ Não é padrão e nunca será: sem a flag, data encerrada segue intocada.
 * ⛔ Só toca data que DIFERE: idêntica não é reescrita.
 * ⛔ Não inventa conteúdo: entra o registro do banco, nunca uma releitura.
 * ⛔ Sem `--apply` não escreve nada, nem o arquivo nem a errata.
 */
const REGERAR_ENCERRADAS = process.argv.includes('--regerar-encerradas')
const DIR_ARQUIVO = join(process.cwd(), 'public', 'us-press-archive')
const PISO = join(process.cwd(), 'public', 'us-press-data.json')

/** `us-press-02-08-2026` → `2026-08-02`, para o arquivo ordenar sozinho. */
/**
 * `us-press-04-09-2026` -> `2026-09-04`. O slug do Neon é DD-MM-AAAA e o
 * arquivo é ISO; a conversão vive AQUI e é exportada, para quem precisar dela
 * não redigitar a regra. Quem lê o arquivo e compara com o banco usa esta.
 */
export function isoDoSlug(slug: string): string | null {
  const m = slug.match(/^us-press-(\d{2})-(\d{2})-(\d{4})$/)
  return m ? `${m[3]}-${m[2]}-${m[1]}` : null
}

function hojeUtc(): string {
  return new Date().toISOString().slice(0, 10)
}

async function main() {
  const { getPrisma } = await import('../lib/db')
  const prisma = getPrisma()
  if (!prisma) { console.error('SEM BANCO: DATABASE_URL ausente ou inválida'); process.exit(1) }

  const rows = await prisma.analysisReport.findMany({
    where: { slug: { startsWith: 'us-press-' } },
    select: { slug: true, bodyMarkdown: true, publishedAt: true },
    orderBy: { slug: 'asc' },
  })

  console.log(`\n${APLICAR ? '✍️  APLICANDO' : '🧪 ENSAIO'} — ${rows.length} coletas no Neon\n`)
  if (!rows.length) { console.log('nada a arquivar'); await prisma.$disconnect(); return }

  if (APLICAR && !existsSync(DIR_ARQUIVO)) mkdirSync(DIR_ARQUIVO, { recursive: true })

  const hoje = hojeUtc()
  let ultimoCron: { hora: number; minuto: number } | null = null
  try {
    ultimoCron = ultimoCronDoDia(agendaDaRota(JSON.parse(readFileSync('vercel.json', 'utf-8')), '/api/cron/refresh-us-press'))
  } catch {
    ultimoCron = null
  }
  let novos = 0, regerados = 0, preservados = 0, invalidos = 0, adiados = 0, regeradasEncerradas = 0
  const errata: Record<string, unknown>[] = []
  let maisRecente: { iso: string; payload: unknown } | null = null

  for (const r of rows) {
    const iso = isoDoSlug(r.slug)
    if (!iso) { console.log(`  ⏭️  ${r.slug}  slug fora do padrão`); continue }

    let payload: Record<string, unknown>
    try {
      payload = JSON.parse(r.bodyMarkdown ?? '{}')
    } catch {
      console.log(`  ⛔ ${iso}  bodyMarkdown ilegível`); invalidos++; continue
    }
    const itens = Array.isArray(payload.itens) ? payload.itens.length : -1
    const veics = Array.isArray(payload.veiculos) ? payload.veiculos.length : -1
    if (itens < 0 || veics < 0) { console.log(`  ⛔ ${iso}  forma inválida`); invalidos++; continue }

    if (!maisRecente || iso > maisRecente.iso) maisRecente = { iso, payload }

    const destino = join(DIR_ARQUIVO, `${iso}.json`)
    const jaExiste = existsSync(destino)

    if (jaExiste && iso !== hoje) {
      // Data encerrada. Não se reescreve, nem que o conteúdo tenha mudado,
      // EXCETO sob `--regerar-encerradas`, e aí a reescrita vai para a ERRATA.
      const atual = readFileSync(destino, 'utf-8')
      const novo = JSON.stringify(payload, null, 2) + '\n'
      const igual = atual === novo

      if (!igual && REGERAR_ENCERRADAS) {
        // 🔑 O que mudou se diz em COISAS, nunca em bytes. O comparador acima é
        // igualdade de string do JSON inteiro, e dizer só "DIFERE" fez 29 datas
        // passarem semanas sendo lidas como ruído: ele não distingue matéria
        // trocada de carimbo trocado. Aqui as duas pontas saem nomeadas, e o
        // MESMO cálculo alimenta a errata, para não existir segunda cópia dele.
        const antes = JSON.parse(atual) as Record<string, unknown>
        const urls = (x: unknown) =>
          ((x as { itens?: { url?: string }[] })?.itens ?? []).map((i) => i.url ?? '')
        const urlsAntes = urls(antes)
        const urlsDepois = urls(payload)
        const soAntes = urlsAntes.filter((u) => !urlsDepois.includes(u))
        const soDepois = urlsDepois.filter((u) => !urlsAntes.includes(u))
        const carimbo = (x: unknown) => String((x as { fetchedAt?: string }).fetchedAt ?? '?')
        errata.push({
          data: iso,
          regeradaEm: new Date().toISOString(),
          motivo:
            'O arquivo em disco guardava a coleta de um cron ANTERIOR ao ultimo do dia, e a regra de data encerrada congelou a versao parcial. O conteudo novo e o registro do Neon, que e a coleta final daquele dia.',
          fetchedAtAntes: carimbo(antes),
          fetchedAtDepois: carimbo(payload),
          itensAntes: urlsAntes.length,
          itensDepois: urlsDepois.length,
          materiasTrocadas: soAntes.length,
          urlsRemovidas: soAntes,
          urlsAcrescentadas: soDepois,
        })
        console.log(
          `  \u267B\uFE0F  ${iso}  ${String(itens).padStart(3)} itens  REGERADA do banco \u00B7 carimbo ${carimbo(antes).slice(11, 16)}Z -> ${carimbo(payload).slice(11, 16)}Z \u00B7 ${soAntes.length} mat\u00E9ria(s) trocada(s)`,
        )
        if (APLICAR) writeFileSync(destino, novo, 'utf-8')
        regeradasEncerradas++
        continue
      }

      const marca = igual ? 'idêntico' : '⚠️  DIFERE do banco, preservado'
      console.log(`  🔒 ${iso}  ${String(itens).padStart(3)} itens  data encerrada, ${marca}`)
      preservados++
      continue
    }

    if (iso === hoje) {
      const d = decidirDataCorrente({ jaExiste, agora: new Date(), ultimoCron, forcar: FORCAR_DIA_CORRENTE })
      if (d.acao === ACOES.ADIAR) {
        console.log(`  ⏳ ${iso}  ${String(itens).padStart(3)} itens  data corrente ADIADA: ${d.motivo}`)
        adiados++
        continue
      }
    }

    const acao = jaExiste ? 'regerado (data corrente)' : 'NOVO'
    console.log(`  ${jaExiste ? '♻️ ' : '✅'} ${iso}  ${String(itens).padStart(3)} itens · ${veics} veículos  ${acao}`)
    if (APLICAR) writeFileSync(destino, JSON.stringify(payload, null, 2) + '\n', 'utf-8')
    if (jaExiste) regerados++; else novos++
  }

  if (maisRecente) {
    console.log(`\npiso de leitura: public/us-press-data.json ← coleta de ${maisRecente.iso}`)
    if (APLICAR) writeFileSync(PISO, JSON.stringify(maisRecente.payload, null, 2) + '\n', 'utf-8')
  }

  console.log(`\n${novos} novos · ${regerados} regerados · ${preservados} preservados · ${adiados} adiados · ${invalidos} inválidos`)
  if (errata.length) {
    // A errata ACUMULA: reescrita antiga não desaparece porque houve outra.
    const caminho = join(DIR_ARQUIVO, 'ERRATA.json')
    const anterior = existsSync(caminho)
      ? (JSON.parse(readFileSync(caminho, 'utf-8')) as { reescritas?: Record<string, unknown>[] })
      : {}
    const corpo = {
      regra:
        'Data encerrada normalmente NUNCA e reescrita, e erro em data passada se corrige por errata. Cada entrada aqui e uma reescrita que ACONTECEU, com o carimbo de coleta de antes e de depois e as materias trocadas, para a serie seguir auditavel.',
      reescritas: [...(anterior.reescritas ?? []), ...errata],
    }
    console.log(`\n\u267B\uFE0F  ${regeradasEncerradas} data(s) ENCERRADA(S) regerada(s) do banco por --regerar-encerradas.`)
    console.log(`\u{1F9FE} errata: ${corpo.reescritas.length} reescrita(s) registrada(s) em ${caminho}`)
    if (APLICAR) writeFileSync(caminho, JSON.stringify(corpo, null, 2) + '\n', 'utf-8')
  }
  if (adiados) {
    console.log('⏳ a data adiada nasce completa na próxima passada depois do último cron, a partir do registro do Neon. Nada se perde.')
  }
  if (APLICAR) {
    // 🔑 Por FORMA DE DATA, nunca por `.json`. ⚠️ Esta era a QUINTA ocorrência do
    // mesmo filtro largo, achada em 06/Out/2026: em 05/Out eu consertei quatro
    // leitores da pasta e deixei de fora a contagem que este script IMPRIME, que
    // passou a dizer "70 coletas" para 69 datas mais a ERRATA.json. Varrer por
    // um dos nomes achou quatro; varrer pela FORMA da conta acha as cinco.
    const total = readdirSync(DIR_ARQUIVO).filter(f => /^\d{4}-\d{2}-\d{2}\.json$/.test(f)).length
    console.log(`arquivo em disco: ${total} coletas`)
  } else {
    console.log('\nrodar de novo com --apply para gravar\n')
  }

  await prisma.$disconnect()
}

/**
 * 🔴 GUARDA DE IMPORT. Sem esta linha, `main()` roda no simples `import` deste
 * arquivo, e com `--apply` na linha de comando de quem importou ele ESCREVE.
 * É o defeito de 02/Ago/2026, quando um ensaio gravou no banco por importar um
 * módulo que executa no carregamento. Só roda quando é o arquivo chamado.
 */
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(e => { console.error('ERRO:', (e as Error).message.slice(0, 400)); process.exit(1) })
}
