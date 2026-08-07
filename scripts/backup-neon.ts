/**
 * Backup do Neon PARA O REPOSITÓRIO.
 *
 * POR QUE EXISTE
 * Os JSON editoriais e as dailies vivem em três lugares (repo, Vercel, Neon) e
 * sobrevivem à perda de qualquer um. A série de preços do Polymarket NÃO: ela é
 * acumulada em capturas de meia em meia hora desde 14/Abr/2026 e, se o banco
 * sumir, não há como reconstruí-la. Em 25/Jul/2026 eram 38.235 pontos, e foi
 * essa série que sustentou a conferência do recorde de gap de +39,65pp.
 *
 * ⚠️ O REPOSITÓRIO É PÚBLICO. Logo, dado pessoal NÃO PODE entrar aqui. E-mail de
 * assinante, token de descadastro, hash de IP e conversa de chatbot ficam de
 * fora por decisão explícita, não por esquecimento.
 *
 * A TRAVA QUE IMPORTA
 * Toda tabela precisa estar classificada em PUBLICAVEL ou PESSOAL. Se aparecer
 * uma tabela nova que não esteja em nenhuma das duas listas, o script FALHA em
 * vez de adivinhar. Sem isso, o dia em que alguém criar uma tabela com dado de
 * pessoa, ela entraria calada num repositório aberto, ou uma tabela importante
 * ficaria calada fora do backup. Adivinhar é o único desfecho inaceitável.
 *
 * FORMATO
 * Toda tabela que tem carimbo de tempo é particionada por MÊS
 * (backup/neon/<tabela>/YYYY-MM.csv.gz). Essas tabelas são append-only, então
 * mês fechado nunca mais muda e o git guarda o arquivo uma vez só.
 *
 * Sem isso o backup se autodestrói: na primeira versão deste script, medida em
 * 25/Jul/2026, analysisReport sozinho dava 1,7 MB e researchFinding 555 KB,
 * reescritos INTEIROS a cada rodada. Rodando diariamente, seriam ~2,2 MB de
 * blob novo por dia, cerca de 800 MB por ano de histórico no git, para guardar
 * um punhado de linhas novas. Particionado, só o mês corrente muda.
 *
 * Uso:  npx tsx scripts/backup-neon.ts
 *       npx tsx scripts/backup-neon.ts --verificar   (só confere o manifesto)
 */
import { config } from 'dotenv'
config({ path: '.env.local' })
config({ path: '.env' })

import { writeFileSync, mkdirSync, existsSync, readFileSync, readdirSync } from 'fs'
import { gzipSync, gunzipSync } from 'zlib'
import { createHash } from 'crypto'
import { join } from 'path'
// @ts-expect-error primitivo em .mjs, compartilhado com o redator do Hugging Face
import { redigirCpf } from './lib/cpf.mjs'

const RAIZ = 'backup/neon'

/**
 * 🛡️ CPF SAI DO BACKUP, por MINIMIZAÇÃO (política do André de 04/Ago/2026).
 *
 * O TSE publica `methodology`, `sampling_plan` e `control_system` como texto
 * livre, e o estatístico responsável às vezes DIGITA o próprio CPF ali dentro. O
 * dado é público na origem por obrigação da Lei 9.504/1997, e coletar segue
 * correto; o que não se faz é republicá-lo em massa num repositório aberto sem
 * necessidade, porque nada aqui é cruzado por CPF.
 *
 * A régua vive em scripts/lib/cpf.mjs e é a MESMA do redator do Hugging Face.
 * Ela exige dígito verificador e fronteira de palavra: medido em 07/Ago/2026,
 * sem isso a varredura acusava 884 trechos de `marketPrice` que eram pedaços de
 * ID hexadecimal, e teria corrompido a série de preços, que é justamente o dado
 * insubstituível que este backup existe para proteger.
 *
 * ⚠️ Isto vale do presente para a frente. Os backups JÁ COMMITADOS continuam
 * com o que tinham, e o que fazer com eles é decisão do André, não deste script.
 */
let cpfRedigidos = 0

/**
 * Tabelas que PODEM ir para um repositório público. Cada uma listada com o
 * motivo de ser insubstituível ou de valer o espaço.
 */
const PUBLICAVEL: Record<string, string> = {
  marketPrice: 'série de preços do Polymarket, acumulada a cada 30 min, INSUBSTITUÍVEL',
  marketOutcome: 'nomes dos contratos, necessário para ler a série',
  market: 'mercados acompanhados, necessário para ler a série',
  marketEvent: 'eventos de mercado',
  source: 'fontes de notícia, sem dado de pessoa',
  researchRun: 'execuções de coleta, sem dado de pessoa',
  // ⚠️ A classificação dizia "sem dado de pessoa" e isso era FALSO desde que o
  // ingest do TSE passou a gravar aqui: o texto livre da pesquisa carrega o CPF
  // do estatístico. Entra no backup com o CPF REDIGIDO, nunca cru.
  researchFinding: 'achados de notícia e registro do TSE; texto livre entra com CPF redigido',
  analysisReport: 'relatórios editoriais, conteúdo já público no site',
  crossSignalLink: 'ligações entre sinais',
  forecastSnapshot: 'snapshots de previsão',
}

/**
 * Tabelas com DADO DE PESSOA. Nunca entram. O motivo fica escrito para que
 * ninguém precise deduzir depois.
 */
const PESSOAL: Record<string, string> = {
  user: 'e-mail e nome',
  userPreference: 'preferência ligada a pessoa',
  userConsent: 'e-mail, hash de IP e de user-agent',
  lead: 'e-mail do assinante e token de descadastro',
  contactEvent: 'contato ligado a pessoa',
  visitorState: 'estado de visitante, rastreável',
  auditLog: 'hash de IP e de user-agent',
  deletionRequest: 'e-mail de quem pediu exclusão',
  chatConversation: 'conversa de usuário',
  chatMessage: 'texto escrito por usuário',
  llmRun: 'pode conter prompt com dado de usuário',
  modelOutput: 'pode conter resposta sobre dado de usuário',
}

function sha256(b: Buffer | string): string {
  return createHash('sha256').update(b).digest('hex').slice(0, 16)
}

/** CSV com aspas duplicadas, quebra de linha preservada e null distinto de vazio. */
function paraCsv(linhas: Array<Record<string, unknown>>): string {
  if (linhas.length === 0) return ''
  const cols = Object.keys(linhas[0])
  const celula = (v: unknown): string => {
    if (v === null || v === undefined) return ''
    if (v instanceof Date) return v.toISOString()
    const bruto = typeof v === 'object' ? JSON.stringify(v) : String(v)
    // A redação vem ANTES do escape de CSV: depois dele a pontuação do CPF
    // continuaria intacta, mas o texto já teria aspas duplicadas no meio e a
    // fronteira de palavra passaria a depender do escape, não do dado.
    const { saida, n } = redigirCpf(bruto)
    cpfRedigidos += n
    const s = saida
    return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s
  }
  return [cols.join(','), ...linhas.map((l) => cols.map((c) => celula(l[c])).join(','))].join('\n') + '\n'
}

function gravar(caminhoRel: string, conteudo: string, manifesto: any[]): void {
  const abs = join(RAIZ, caminhoRel)
  mkdirSync(join(abs, '..'), { recursive: true })
  const gz = gzipSync(Buffer.from(conteudo, 'utf-8'), { level: 9 })
  // Só reescreve se mudou, para o git não registrar commit vazio.
  if (existsSync(abs)) {
    const atual = readFileSync(abs)
    if (sha256(gunzipSync(atual)) === sha256(conteudo)) {
      manifesto.push({ arquivo: caminhoRel, linhas: conteudo ? conteudo.trim().split('\n').length - 1 : 0, sha256: sha256(conteudo), bytesGz: atual.length, alterado: false })
      return
    }
  }
  writeFileSync(abs, gz)
  manifesto.push({ arquivo: caminhoRel, linhas: conteudo ? conteudo.trim().split('\n').length - 1 : 0, sha256: sha256(conteudo), bytesGz: gz.length, alterado: true })
}

async function main() {
  const apenasVerificar = process.argv.includes('--verificar')
  const { prisma } = await import('../lib/db')
  if (!prisma) { console.error('❌ SEM BANCO: DATABASE_URL ausente ou inválida'); process.exit(1) }

  const modelos = Object.keys(prisma).filter(
    (k) => !k.startsWith('$') && !k.startsWith('_') && typeof (prisma as any)[k]?.count === 'function',
  )

  // A TRAVA. Tabela não classificada aborta o backup.
  const naoClassificadas = modelos.filter((m) => !(m in PUBLICAVEL) && !(m in PESSOAL))
  if (naoClassificadas.length > 0) {
    console.error('❌ Tabela(s) sem classificação:', naoClassificadas.join(', '))
    console.error('')
    console.error('   O repositório é PÚBLICO. Classifique cada uma em scripts/backup-neon.ts:')
    console.error('   - PUBLICAVEL, se não contém dado de pessoa e vale guardar;')
    console.error('   - PESSOAL, se contém e-mail, IP, nome, token ou texto escrito por usuário.')
    console.error('   O script não adivinha: adivinhar aqui vaza dado ou perde backup em silêncio.')
    process.exit(1)
  }

  if (apenasVerificar) {
    const mPath = join(RAIZ, 'MANIFEST.json')
    if (!existsSync(mPath)) { console.error('❌ MANIFEST.json não existe. Rode o backup antes.'); process.exit(1) }
    const man = JSON.parse(readFileSync(mPath, 'utf-8'))
    let ruim = 0
    for (const a of man.arquivos) {
      const abs = join(RAIZ, a.arquivo)
      if (!existsSync(abs)) { console.error(`  ❌ FALTA ${a.arquivo}`); ruim++; continue }
      const conteudo = gunzipSync(readFileSync(abs)).toString('utf-8')
      if (sha256(conteudo) !== a.sha256) { console.error(`  ❌ CHECKSUM DIVERGE ${a.arquivo}`); ruim++; continue }
      console.log(`  ✅ ${a.arquivo.padEnd(42)} ${String(a.linhas).padStart(7)} linhas`)
    }
    console.log(ruim === 0 ? `\n✅ ${man.arquivos.length} arquivo(s) íntegros.` : `\n❌ ${ruim} problema(s).`)
    await prisma.$disconnect()
    process.exit(ruim === 0 ? 0 : 1)
  }

  console.log('💾 Backup do Neon para o repositório\n')
  console.log(`   Tabelas publicáveis: ${Object.keys(PUBLICAVEL).length}`)
  console.log(`   Tabelas com dado de pessoa, EXCLUÍDAS: ${Object.keys(PESSOAL).length}\n`)

  const manifesto: any[] = []
  let maisRecente: Date | null = null

  for (const modelo of Object.keys(PUBLICAVEL)) {
    const linhas: any[] = await (prisma as any)[modelo].findMany()

    // Coluna de tempo, na ordem de preferência. Se existir, particiona por mês.
    const col = ['snapshotAt', 'createdAt', 'startedAt', 'publishedAt'].find(
      (c) => linhas.length > 0 && linhas[0][c] instanceof Date,
    )

    if (!col) {
      gravar(`${modelo}.csv.gz`, paraCsv(linhas), manifesto)
      console.log(`   ${modelo.padEnd(18)} ${String(linhas.length).padStart(6)} linhas  (sem carimbo de tempo, dump único)`)
      continue
    }

    const porMes = new Map<string, any[]>()
    for (const l of linhas) {
      const d: Date = l[col]
      if (!maisRecente || d > maisRecente) maisRecente = d
      const mes = d.toISOString().slice(0, 7)
      if (!porMes.has(mes)) porMes.set(mes, [])
      porMes.get(mes)!.push(l)
    }
    for (const [mes, doMes] of [...porMes.entries()].sort()) {
      doMes.sort((a, b) => a[col] - b[col])
      gravar(`${modelo}/${mes}.csv.gz`, paraCsv(doMes), manifesto)
    }
    console.log(`   ${modelo.padEnd(18)} ${String(linhas.length).padStart(6)} linhas em ${porMes.size} mês(es)  [${col}]`)
  }

  const totalGz = manifesto.reduce((s, a) => s + a.bytesGz, 0)
  const alterados = manifesto.filter((a) => a.alterado).length

  writeFileSync(join(RAIZ, 'MANIFEST.json'), JSON.stringify({
    geradoEm: maisRecente ? maisRecente.toISOString() : null,
    observacao: 'geradoEm usa o registro mais recente do banco, nao o relogio da maquina, para o backup ser reproduzivel e o diff ficar vazio quando nada mudou',
    repositorioPublico: true,
    tabelasExcluidasPorConterDadoPessoal: PESSOAL,
    totalLinhas: manifesto.reduce((s, a) => s + a.linhas, 0),
    totalBytesComprimidos: totalGz,
    arquivos: manifesto.map(({ alterado, ...r }) => r),
  }, null, 2) + '\n', 'utf-8')

  console.log(`\n   ${manifesto.length} arquivo(s), ${(totalGz / 1024).toFixed(0)} KB comprimidos, ${alterados} alterado(s) nesta rodada`)
  console.log(`   CPF removidos do texto livre do TSE: ${cpfRedigidos}`)
  console.log('\n✅ Backup gravado em backup/neon/. Confira com: npx tsx scripts/backup-neon.ts --verificar')
  await prisma.$disconnect()
}

main().catch((e) => { console.error('ERRO:', (e as Error).message.slice(0, 400)); process.exit(1) })
