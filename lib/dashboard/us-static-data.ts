/**
 * Leitura SERVER-SIDE do generic ballot dos EUA, gerado por
 * `scripts/parse-us-generic-ballot.mjs`.
 *
 * Mesma guarda de forma do `static-data.ts` do Brasil: devolve `null` em arquivo
 * ausente, JSON inválido ou forma errada, e a seção trata o null mostrando que o
 * dado não está disponível, em vez de quebrar a página.
 *
 * ⚠️ NÃO tem variante por idioma, e isso é de propósito. O arquivo é dado
 * medido, não prosa: nome de instituto, data de campo, amostra e percentual não
 * se traduzem. O texto ao redor é que muda de idioma, e ele vive no componente.
 */
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

export interface UsPoll {
  instituto: string
  campoInicio: string | null
  campoFim: string | null
  amostra: number | null
  amostraTipo: string | null
  margemErro: number | null
  dem: number
  rep: number
  outros: number | null
  vantagemDem: number
  fontePrimaria: string | null
}

export interface UsMediaAfos {
  janelaDias: number
  desde: string
  nPesquisas: number
  nInstitutos: number
  dem: number
  rep: number
  vantagemDem: number
  metodo: string
  institutos: string[]
}

export interface UsPollsData {
  lastUpdate: string
  fetchedAt: string
  eleicao: { pais: string; data: string; cargo: string }
  procedencia: {
    indice: string
    licencaIndice: string
    regra: string
    agregadoresIgnorados: string[]
    motivoIgnorar: string
  }
  ressalvas: string[]
  mediaAfos: UsMediaAfos | null
  qualidade: {
    linhasLidas: number
    publicadas: number
    descartadasPorForma: number
    // ⚠️ OPCIONAIS de propósito. Chegaram em 01/Ago/2026 com o portão de valor,
    // e o Neon pode ter registro gravado ANTES disso. Marcar como obrigatórios
    // faria a tela confiar num campo que o registro antigo não tem.
    descartadasPorValor?: number
    descartadas?: number
    motivoDescarte: string
    semFontePrimaria: number
  }
  polls: UsPoll[]
}

/**
 * Leitura VIVA: prefere o que o cron gravou no Neon e cai para o arquivo
 * versionado quando o banco não responde ou ainda não tem registro.
 *
 * ⚠️ A ordem importa e não é arbitrária. O arquivo só muda quando alguém roda o
 * script e publica, então ele envelhece entre deploys; o Neon é atualizado
 * todo dia pelo cron. Mas o arquivo é o PISO: se o Neon cair, o painel mostra
 * dado velho em vez de mostrar nada, e a data que ele exibe é a do próprio
 * dado, então o leitor vê que está velho.
 *
 * ⛔ Nunca devolver o registro do Neon sem conferir a forma. Registro truncado
 * ou de um tipo errado derrubaria a seção inteira, e o arquivo continuaria ali,
 * bom, sem ser usado.
 */
export async function loadUsPollsDataFresh(): Promise<UsPollsData | null> {
  const doArquivo = loadUsPollsData()
  try {
    const { getPrisma } = await import('../db')
    const prisma = getPrisma()
    if (!prisma) return doArquivo
    const reg = await prisma.analysisReport.findFirst({
      where: { slug: { startsWith: 'us-generic-ballot-' } },
      orderBy: { publishedAt: 'desc' },
      select: { bodyMarkdown: true },
    })
    if (!reg?.bodyMarkdown) return doArquivo
    const d = JSON.parse(reg.bodyMarkdown) as UsPollsData
    if (!Array.isArray(d?.polls) || d.polls.length === 0) return doArquivo
    // Se o arquivo for MAIS novo que o Neon (acabou de ser publicado à mão),
    // ele vence. Senão uma publicação manual apareceria como se não tivesse
    // acontecido.
    if (doArquivo?.lastUpdate && d.lastUpdate && doArquivo.lastUpdate > d.lastUpdate) return doArquivo
    return d
  } catch {
    return doArquivo
  }
}

export function loadUsPollsData(): UsPollsData | null {
  try {
    const p = join(process.cwd(), 'public', 'us-polls-data.json')
    if (!existsSync(p)) return null
    const d = JSON.parse(readFileSync(p, 'utf-8')) as UsPollsData
    if (!Array.isArray(d?.polls)) return null
    return d
  } catch {
    return null
  }
}
