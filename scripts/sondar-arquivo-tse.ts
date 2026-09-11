/**
 * sondar-arquivo-tse.ts — a SONDA do registro do TSE: várias leituras antes de
 * concluir qualquer coisa sobre o arquivo.
 *
 * 🔴 POR QUE ISTO EXISTE. Em 10/Set/2026 a MESMA URL do TSE devolveu 851 e 863
 * presidenciais alternando. Eu afirmei uma retirada como fato, depois
 * "corrigi" desafirmando, e as duas vezes com UMA leitura. A primeira estava
 * certa e a correção estava errada, e nenhuma das duas se justificava na hora,
 * porque acertar por acaso e errar por acaso têm o mesmo método.
 * → memory/feedback_sumico_numa_leitura_so_nao_e_retirada_o_cdn_serve_dois_retratos.md
 *
 * 🔑 A RÉGUA É A DA TRAVA DE CAPTURA, e ela não é do mercado, é de toda origem:
 * duas leituras que concordam são um preço, duas que discordam são um livro em
 * trânsito. Aqui: leituras que concordam são UM arquivo, leituras que discordam
 * são o CDN servindo dois retratos, e nesse caso não se conclui, se espera.
 *
 * ⭐ O QUE TORNA A REPETIÇÃO BARATA, medido em 11/Set/2026 daqui, mesmo IP e
 * mesmo cliente, na mesma URL:
 *
 *   | método                    | resposta |
 *   |---------------------------|----------|
 *   | HEAD                      | 403      |
 *   | GET                       | 200, ZIP inteiro (3,8 MB) |
 *   | GET com Range: bytes=0-0  | 206, com `content-range` e `etag` |
 *
 * Ou seja, o corte da borda é também por MÉTODO, não só por origem de rede: o
 * HEAD apanha de onde o GET passa. E o Range custa UM BYTE e devolve os dois
 * campos que identificam o retrato, porque o ETag do Apache codifica tamanho e
 * mtime. Foi isso que transformou "ler 11 vezes" de exagero em rotina.
 *
 * ⛔ NÃO É CONTORNO DE BLOQUEIO. Mesma URL, mesmo cliente do cron, sem forjar
 * user-agent, sem trocar rota e sem insistir depois de um 403. Se a borda
 * recusar, a sonda para e relata. → memory/reference_tse_bloqueio_antirrobo_2026.md
 *
 * ⚠️ O QUE ELA NÃO PROVA. Leituras seguidas podem cair no mesmo nó da Akamai e
 * na mesma conexão, então concordância é EVIDÊNCIA de um retrato só, não prova.
 * É por isso que ela espaça as leituras e imprime cada uma: o que decide é a
 * tabela, não o veredito. E é por isso que `--baixar` existe.
 *
 * Uso:
 *   npx tsx scripts/sondar-arquivo-tse.ts                  # 5 leituras de 1 byte
 *   npx tsx scripts/sondar-arquivo-tse.ts --leituras=11
 *   npx tsx scripts/sondar-arquivo-tse.ts --baixar         # + 1 ZIP inteiro, sha256 e contagem
 *   npx tsx scripts/sondar-arquivo-tse.ts --baixar --guardar=caminho.zip
 *   npx tsx scripts/sondar-arquivo-tse.ts --comparar-com-ultima   # e com a sonda anterior
 *
 * Saída 0 = as leituras CONCORDAM. 2 = discordam, arquivo em trânsito.
 * 1 = a borda recusou ou a rede falhou, que não é o mesmo que discordar.
 */

import { createHash } from 'crypto'
import { writeFileSync, appendFileSync, mkdirSync, readFileSync, existsSync } from 'fs'
import { dirname } from 'path'
import { urlZipTSE, parseTSEZipBytes } from '../lib/tse/ingest'

const ANO = 2026
export const CAMINHO_SONDAS = 'data/tse/sondas.jsonl'

interface Leitura {
  n: number
  status: number
  tamanho: number | null
  etag: string | null
  modificado: string | null
  ms: number
  erro?: string
}

/** O retrato: o par que identifica a versão servida. `null` só quando a leitura falhou. */
const retrato = (l: Leitura) => (l.tamanho === null && l.etag === null ? null : `${l.etag ?? '?'}|${l.tamanho ?? '?'}`)

async function lerUmByte(url: string, n: number): Promise<Leitura> {
  const t = Date.now()
  try {
    const res = await fetch(url, { headers: { Range: 'bytes=0-0' }, signal: AbortSignal.timeout(30000) })
    const cr = res.headers.get('content-range')
    // `content-range: bytes 0-0/3866082` — o total está depois da barra. Sem
    // Range aceito (200 em vez de 206) o total vem no content-length.
    const total = cr?.includes('/') ? Number(cr.split('/')[1]) : Number(res.headers.get('content-length'))
    return {
      n,
      status: res.status,
      tamanho: Number.isFinite(total) && total > 0 ? total : null,
      etag: res.headers.get('etag'),
      modificado: res.headers.get('last-modified'),
      ms: Date.now() - t,
    }
  } catch (err) {
    return { n, status: 0, tamanho: null, etag: null, modificado: null, ms: Date.now() - t, erro: err instanceof Error ? err.message : String(err) }
  }
}

/** A última sonda anotada, ou null. Linha quebrada aborta, nunca vira null silencioso. */
function ultimaSonda() {
  if (!existsSync(CAMINHO_SONDAS)) return null
  const linhas = readFileSync(CAMINHO_SONDAS, 'utf8').split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
  if (!linhas.length) return null
  try {
    return JSON.parse(linhas[linhas.length - 1])
  } catch {
    throw new Error(`${CAMINHO_SONDAS}: última linha não é JSON. Não adivinhar, conferir à mão.`)
  }
}

async function main() {
  const argv = process.argv.slice(2)
  const pegar = (chave: string, padrao: number) => {
    const a = argv.find((x) => x.startsWith(`--${chave}=`))
    const v = a ? Number(a.split('=')[1]) : NaN
    return Number.isFinite(v) && v > 0 ? v : padrao
  }
  const leituras = pegar('leituras', 5)
  const intervalo = pegar('intervalo', 1500)
  const baixar = argv.includes('--baixar')
  const compararComUltima = argv.includes('--comparar-com-ultima')
  const guardar = argv.find((a) => a.startsWith('--guardar='))?.split('=')[1]

  // 🔑 Lido ANTES de anotar a desta rodada, senão a comparação seria contra ela
  // mesma. O `--comparar-com-ultima` existe para o caso que derrubou 10/Set: a
  // troca de retrato acontecendo ENTRE duas chamadas da mesma rodada, e não
  // dentro de uma rajada de leituras.
  const anterior = compararComUltima ? ultimaSonda() : null

  const url = urlZipTSE(ANO)
  console.log('')
  console.log(`🔍 SONDA DO ARQUIVO DO TSE · ${new Date().toISOString()}`)
  console.log(`   ${url}`)
  console.log(`   ${leituras} leitura(s) de 1 byte, ${intervalo}ms entre elas`)
  console.log('')

  const resultados: Leitura[] = []
  for (let i = 1; i <= leituras; i++) {
    const l = await lerUmByte(url, i)
    resultados.push(l)
    const marca = l.erro ? '❌' : l.status === 206 || l.status === 200 ? '  ' : '⚠️ '
    console.log(
      `   ${marca} ${String(i).padStart(2)}  ${String(l.status).padStart(3)}  ` +
        `${l.tamanho === null ? '        ?' : String(l.tamanho).padStart(9)} bytes  ` +
        `${(l.etag ?? '-').padEnd(26)}  ${l.modificado ?? '-'}  ${String(l.ms).padStart(5)}ms` +
        (l.erro ? `  ${l.erro}` : '')
    )
    if (i < leituras) await new Promise((r) => setTimeout(r, intervalo))
  }

  const boas = resultados.filter((l) => (l.status === 200 || l.status === 206) && retrato(l))
  console.log('')

  // A borda recusando não é o mesmo que a fonte estar em trânsito, e os dois
  // desfechos pedem ações opostas: um manda ir ao modo ARQUIVO, o outro manda
  // esperar. Não colapsar os dois num código de saída só.
  if (boas.length === 0) {
    const status = [...new Set(resultados.map((l) => l.erro ?? String(l.status)))].join(', ')
    console.log(`❌ NENHUMA leitura válida (${status}).`)
    console.log('   Isto é a BORDA recusando, não o arquivo em trânsito. Não insistir:')
    console.log('   baixar o ZIP à mão pelo Portal de Dados Abertos e usar o modo ARQUIVO.')
    process.exit(1)
  }
  if (boas.length < resultados.length) {
    console.log(`⚠️  ${resultados.length - boas.length} de ${resultados.length} leitura(s) falharam e foram excluídas do veredito.`)
  }

  const retratos = new Map<string, number>()
  for (const l of boas) retratos.set(retrato(l)!, (retratos.get(retrato(l)!) ?? 0) + 1)
  const concordam = retratos.size === 1
  const consenso = [...retratos.entries()].sort((a, b) => b[1] - a[1])[0][0]
  const tamanhoConsenso = boas.find((l) => retrato(l) === consenso)!.tamanho
  const etagConsenso = boas.find((l) => retrato(l) === consenso)!.etag

  if (concordam) {
    console.log(`✅ CONCORDAM: ${boas.length} de ${boas.length} leituras servem o MESMO retrato.`)
    console.log(`   ${etagConsenso}  ${tamanhoConsenso} bytes`)
    console.log('   ⚠️ Isto é evidência de um arquivo só, não prova: leituras seguidas podem')
    console.log('      cair no mesmo nó. Concordância em n leituras vale n vezes mais que n=1.')
  } else {
    console.log(`🔴 DISCORDAM: ${retratos.size} retratos diferentes na MESMA URL.`)
    for (const [r, c] of [...retratos.entries()].sort((a, b) => b[1] - a[1])) {
      console.log(`   ${String(c).padStart(2)}x  ${r}`)
    }
    console.log('')
    console.log('   🔑 Arquivo EM TRÂNSITO. Nenhuma leitura sozinha diz qual é o corrente,')
    console.log('      e foi exatamente aqui que 851 e 863 alternaram em 10/Set/2026.')
    console.log('      NÃO concluir sobre retirada, crescimento ou calendário agora.')
    console.log('      Esperar e sondar de novo, ou repetir com --leituras=11.')
  }

  let sha: string | null = null
  let presidenciais: number | null = null
  let tamanhoBaixado: number | null = null

  if (baixar) {
    console.log('')
    console.log('⬇️  Baixando o ZIP inteiro uma vez, para casar o que foi sondado com o que existe…')
    const res = await fetch(url, { signal: AbortSignal.timeout(60000) })
    if (!res.ok) {
      console.log(`❌ O download completo devolveu ${res.status}, mesmo com a sonda passando.`)
      process.exit(1)
    }
    const bytes = Buffer.from(await res.arrayBuffer())
    tamanhoBaixado = bytes.length
    sha = createHash('sha256').update(bytes).digest('hex')
    presidenciais = (await parseTSEZipBytes(bytes, ANO)).length
    console.log(`   ${tamanhoBaixado} bytes  sha256 ${sha}`)
    console.log(`   presidenciais no arquivo: ${presidenciais}  (mesmo parser da ingestão)`)
    if (guardar) {
      mkdirSync(dirname(guardar), { recursive: true })
      writeFileSync(guardar, bytes)
      console.log(`   💾 guardado em ${guardar}`)
    }
    // 🔑 O ponto do --baixar: o retrato que a sonda mediu com 1 byte e o retrato
    // que o download inteiro trouxe podem ser DIFERENTES, porque cada requisição
    // pode cair num nó diferente. É a única conferência que fala dos bytes que
    // realmente entram, em vez de falar de um cabeçalho.
    if (tamanhoConsenso !== null && tamanhoBaixado !== tamanhoConsenso) {
      console.log('')
      console.log(`🔴 O DOWNLOAD NÃO É O RETRATO SONDADO: ${tamanhoBaixado} bytes contra ${tamanhoConsenso} do consenso.`)
      console.log('   A borda serviu dois objetos na mesma URL DENTRO desta rodada.')
      console.log('   Tratar como EM TRÂNSITO: não gravar e não concluir.')
      anotar()
      process.exit(2)
    }
    if (tamanhoBaixado === tamanhoConsenso) {
      console.log(`   ✅ o download casa com o retrato sondado, byte a byte no tamanho.`)
    }
  }

  let trocouDesdeAnterior = false
  if (compararComUltima) {
    console.log('')
    if (!anterior) {
      console.log('📓 Não há sonda anterior no histórico: nada com que comparar.')
    } else if (anterior.etag === etagConsenso && anterior.tamanho === tamanhoConsenso) {
      console.log(`✅ MESMO retrato da sonda de ${anterior.quando}: a fonte não trocou no intervalo.`)
    } else {
      trocouDesdeAnterior = true
      console.log(`🔴 A FONTE TROCOU desde a sonda de ${anterior.quando}:`)
      console.log(`   antes:  ${anterior.etag ?? '-'}  ${anterior.tamanho ?? '-'} bytes`)
      console.log(`   agora:  ${etagConsenso ?? '-'}  ${tamanhoConsenso ?? '-'} bytes`)
      console.log('')
      console.log('   🔑 Quem baixou NO MEIO deste intervalo pode ter lido qualquer um dos dois.')
      console.log('      Se houve ingestão entre as duas sondas, a contagem dela não decide nada')
      console.log('      sozinha. Sondar de novo até estabilizar antes de publicar contagem.')
    }
  }

  anotar()
  process.exit(concordam && !trocouDesdeAnterior ? 0 : 2)

  function anotar() {
    const registro = {
      quando: new Date().toISOString(),
      url,
      leituras: resultados.length,
      validas: boas.length,
      concordam,
      retratos: [...retratos.entries()].map(([r, c]) => ({ retrato: r, vezes: c })),
      etag: etagConsenso,
      tamanho: tamanhoConsenso,
      modificado: boas.find((l) => retrato(l) === consenso)?.modificado ?? null,
      sha256: sha,
      tamanhoBaixado,
      presidenciais,
    }
    mkdirSync(dirname(CAMINHO_SONDAS), { recursive: true })
    // Linha quebrada em JSONL aborta a leitura de todo o histórico, então a
    // sonda confere que o que ela vai escrever volta a ser JSON.
    const linha = JSON.stringify(registro)
    JSON.parse(linha)
    appendFileSync(CAMINHO_SONDAS, linha + '\n')
    console.log('')
    console.log(`   📓 sonda anotada em ${CAMINHO_SONDAS}`)
    if (existsSync(CAMINHO_SONDAS)) {
      const n = readFileSync(CAMINHO_SONDAS, 'utf8').split('\n').filter(Boolean).length
      console.log(`      ${n} sonda(s) no histórico`)
    }
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
