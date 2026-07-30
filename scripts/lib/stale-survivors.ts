import { execSync } from 'child_process'
import { parseNumeric } from './numeric'

/**
 * Detector de valor obsoleto sobrevivente a rebaseline.
 *
 * MODO DE FALHA QUE ELE PEGA
 * Quando o snapshot é refeito no meio do dia, o pipeline reescreve os campos
 * numéricos estruturados e a prosa que os cita. Se uma ocorrência na prosa
 * escapar, o arquivo fica com dois números diferentes para a mesma coisa, e o
 * validador de shape não vê nada de errado.
 *
 * Aconteceu em 24/Jul/2026: o rebaseline das 17h31 trocou o preço de Renan de
 * 11,95% para 11,75% em 22 pontos dos 4 arquivos, e uma frase ficou para trás
 * dizendo "Aos 11,95%, o preço segue acima". Foi para produção e ficou no ar.
 *
 * COMO DECIDE
 * Compara o valor atual de cada candidato com o da revisão anterior do arquivo.
 * Se mudou, procura o valor ANTIGO dentro da prosa daquele mesmo candidato.
 * Achou em tempo presente, é resíduo.
 *
 * O QUE NÃO ACUSA (e por que isso importa)
 * Citar o preço de ontem é legítimo e frequente neste produto: "depois de três
 * pregões travado em 60,50%" é comparação histórica correta. Por isso a busca
 * ignora ocorrências precedidas de marcador de passado. Sem esse filtro a
 * checagem viraria ruído e seria desligada na primeira semana.
 */

const MARCADOR_PASSADO =
  /\b(depois de|antes de|vinha|estava|desde|ontem|na v[ée]spera|era|fechou|marcou|abriu|partiu|voltou|saiu de|no dia|em \d{1,2}\/\w{3}|de\s+[\d.,]+%\s+para|contra os|ante os|frente aos)\b/i

export interface Residuo {
  candidato: string
  campo: string
  valorObsoleto: string
  valorAtual: string
  trecho: string
}

function lerRevisaoAnterior(arquivo: string, baselineRef?: string): any | null {
  if (baselineRef) {
    try {
      return JSON.parse(execSync(`git show ${baselineRef}:${arquivo}`, { encoding: 'utf-8', maxBuffer: 1e8 }))
    } catch { return null }
  }
  try {
    const refs = execSync(`git log --format=%H -5 -- ${arquivo}`, { encoding: 'utf-8' })
      .trim().split('\n').filter(Boolean)
    // refs[0] é o commit atual do arquivo; queremos o anterior a ele.
    for (const ref of refs.slice(1)) {
      try {
        return JSON.parse(execSync(`git show ${ref}:${arquivo}`, { encoding: 'utf-8', maxBuffer: 1e8 }))
      } catch { /* revisão ilegível, tenta a próxima */ }
    }
  } catch { /* fora de repo git ou arquivo novo */ }
  return null
}

/** Formata como a prosa em pt-BR escreve: vírgula decimal, 2 casas. */
function comoNaProsa(pct: number): string {
  return pct.toFixed(2).replace('.', ',') + '%'
}

/**
 * Construções em que a prosa atribui o preço AO PRÓPRIO candidato. Só entram
 * padrões de alta confiança: se a frase diz isso, o número tem obrigatoriamente
 * que ser o preço atual dele.
 *
 * Ficam DE FORA de propósito as construções de comparação ("de 70,50% para
 * 74,00%", "contra os 9% da Real Time", "acima dos 9%"), que citam legitimamente
 * outros valores e outros mercados.
 */
const ATRIBUI_PRECO: RegExp[] = [
  /\bAos (\d+[.,]\d+)\s*%/gi,                    // "Aos 11,75%, o preço segue"
  /\bvale (\d+[.,]\d+)\s*%/gi,                   // "vale 1,75% no book de vencedor"
  /\bpara (\d+[.,]\d+)\s*%\s*\(vol/gi,           // "SOBE 1,00pp para 61,50% (vol USD"
]

/**
 * Auto-consistência: a prosa do candidato cita um preço atribuído a ele que não
 * é o preço atual dele. Não depende do git, então pega também o caso em que
 * alguém edita a prosa à mão sem tocar no campo estruturado.
 */
function checkSelfConsistency(atual: any): string[] {
  const erros: string[] = []
  const CAMPOS = ['tendenciaPolymarket', 'tendenciaPesquisa'] as const

  for (const c of atual?.polymarketComparison?.candidates ?? []) {
    const preco = parseNumeric(String(c?.polymarket ?? '').replace('%', ''), 'pt')
    if (preco === null) continue

    for (const campo of CAMPOS) {
      const txt = c?.[campo]
      if (typeof txt !== 'string') continue
      for (const re of ATRIBUI_PRECO) {
        re.lastIndex = 0
        let m: RegExpExecArray | null
        while ((m = re.exec(txt)) !== null) {
          const citado = parseNumeric(m[1], 'pt')
          if (citado === null || Math.abs(citado - preco) < 0.005) continue
          erros.push(
            `INCONSISTENTE ${c.name}.${campo}: a frase atribui ${comoNaProsa(citado)} ao ` +
            `próprio candidato, mas o preço dele é ${comoNaProsa(preco)}. ` +
            `Trecho: "${txt.slice(Math.max(0, m.index - 40), m.index + 40).trim()}"`
          )
        }
      }
    }
  }
  return erros
}

/**
 * O MESMO preço aparece em TRÊS campos de cada candidato: `polymarket` (string
 * exibida, vírgula decimal), `odds` (número) e `value` (número). Nada conferia
 * se os três concordam, e cada consumidor lê um campo diferente:
 *
 *   - o dashboard lê `polymarket`
 *   - o grafo de divergência lê `percentage` x `odds`
 *   - o EXPORTADOR DO HUGGING FACE lê `c.value ?? c.polymarket ?? c.odds`,
 *     ou seja, `value` tem PRIORIDADE
 *
 * Consequência real, achada em 30/Jul/2026: atualizei `polymarket` e `odds` e
 * NÃO atualizei `value`, e o dataset acadêmico publicado no HF saiu com o preço
 * do dia anterior em 5 dos 7 candidatos, enquanto o site mostrava o correto.
 * O mesmo tipo de desencontro já tinha escapado em 29/Jul, com Renan em
 * `polymarket="8,70%"` e `odds=8.6`.
 *
 * Campo que alimenta consumidor externo e que ninguém confere vira dado errado
 * publicado em silêncio. Esta checagem existe para isso não se repetir.
 */
function checkPrecoTriplo(atual: any): string[] {
  const erros: string[] = []
  for (const c of atual?.polymarketComparison?.candidates ?? []) {
    const str = parseNumeric(String(c?.polymarket ?? '').replace('%', ''), 'pt')
    if (str === null) continue
    for (const campo of ['odds', 'value'] as const) {
      if (c?.[campo] == null) continue
      const n = Number(c[campo])
      if (!Number.isFinite(n)) { erros.push(`INCONSISTENTE ${c.name}.${campo}: não é número (${c[campo]})`); continue }
      if (Math.abs(n - str) >= 0.005) {
        erros.push(
          `INCONSISTENTE ${c.name}: polymarket="${c.polymarket}" mas ${campo}=${n}. ` +
          `Os três campos do mesmo preço têm de concordar; \`value\` é o que o exportador do Hugging Face lê primeiro.`
        )
      }
    }
  }
  return erros
}

export function checkStaleSurvivors(
  atual: any,
  arquivo = 'public/polls-data.json',
  baselineRef?: string,
): string[] {
  // Roda sempre, mesmo sem git: é a rede mais confiável das duas.
  const erros: string[] = [...checkSelfConsistency(atual), ...checkPrecoTriplo(atual)]

  const anterior = lerRevisaoAnterior(arquivo, baselineRef)
  if (!anterior) return erros

  const precoAnterior = new Map<string, number>()
  for (const c of anterior?.polymarketComparison?.candidates ?? []) {
    const v = parseNumeric(String(c?.polymarket ?? '').replace('%', ''), 'pt')
    if (c?.name && v !== null) precoAnterior.set(c.name, v)
  }

  const CAMPOS = ['tendenciaPolymarket', 'tendenciaPesquisa'] as const

  for (const c of atual?.polymarketComparison?.candidates ?? []) {
    const velho = precoAnterior.get(c?.name)
    const agora = parseNumeric(String(c?.polymarket ?? '').replace('%', ''), 'pt')
    if (velho === undefined || agora === null) continue
    if (Math.abs(velho - agora) < 0.005) continue   // não mudou, nada a procurar

    const agulha = comoNaProsa(velho)

    for (const campo of CAMPOS) {
      const txt = c?.[campo]
      if (typeof txt !== 'string') continue
      let i = -1
      while ((i = txt.indexOf(agulha, i + 1)) >= 0) {
        const antes = txt.slice(Math.max(0, i - 45), i)
        if (MARCADOR_PASSADO.test(antes)) continue   // referência histórica legítima
        erros.push(
          `RESÍDUO ${c.name}.${campo}: cita ${agulha} em tempo presente, mas esse era o ` +
          `valor da publicação anterior. O preço atual é ${comoNaProsa(agora)}. ` +
          `Trecho: "${txt.slice(Math.max(0, i - 55), i + 30).trim()}"`
        )
      }
    }
  }
  return erros
}
