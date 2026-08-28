/**
 * Leitura da imprensa das midterms, gravada pelo cron `/api/cron/refresh-us-press`.
 *
 * ⚠️ MUDOU EM 03/Ago/2026. Antes daqui não havia arquivo de piso, e o comentário
 * dizia que era de propósito: "notícia velha não é piso, é ruído". A preocupação
 * continua certa e o desenho que a atendia estava errado.
 *
 * O que aconteceu: a página `/dashboard/us` é ISR (`revalidate = 7200`), então ela
 * é pré-renderizada no build. Uma leitura que devolvesse `null` na hora do build
 * assava o HTML vazio e servia "Sem matéria disponível nesta captura" por até duas
 * horas, com 22 veículos e 7 matérias íntegros no banco. Some da tela o que existe.
 *
 * E não dava para saber por quê, porque o `catch` engolia o erro: banco fora do ar
 * e coleta sem resultado produziam a MESMA tela.
 *
 * O desenho agora separa as duas coisas, que é o que faltava:
 *   - `ok`            → tem matéria, e a origem vai declarada (banco ou arquivo)
 *   - `vazio`         → a coleta RODOU e não achou nada. É informação, não falha
 *   - `indisponivel`  → não foi possível ler. É falha, e a tela diz isso
 *
 * O piso de arquivo é permitido porque a data da coleta **nunca fica escondida**: o
 * rodapé da seção imprime "Coletado em DD/MM" em toda rodada, venha do banco ou do
 * disco. Notícia velha exibida como atual continua proibida; com a data à vista é
 * honesta, e é melhor que apagar a seção.
 *
 * 📌 Houve uma tarja âmbar avisando "exibindo a última coleta arquivada", e ela saiu
 * no mesmo dia, por decisão do André: dizia ao leitor o que o rodapé já dizia. A
 * origem da leitura segue no log do servidor, que é onde ela serve para depurar.
 */
import { existsSync, readFileSync } from 'fs'
import { join } from 'path'

export interface UsPressItem {
  titulo: string
  url: string
  casa: string
  publicadoEm: string
  consulta: string
  /**
   * Por qual porta a matéria entrou, a partir de 16/Ago/2026.
   * `disputa` é cobertura da corrida, `metodo` é cobertura sobre o INSTRUMENTO
   * (pesquisa e mercado de previsão como assunto). Opcional porque as coletas
   * anteriores a 16/Ago não têm o campo, e data encerrada não se reescreve.
   */
  trilho?: 'disputa' | 'metodo'
}

export interface UsPressVeiculo {
  casa: string
  tipo: string
}

export interface UsPressData {
  lastUpdate: string
  fetchedAt: string
  /** Só no arquivo/dataset. NÃO vai para a página: ver `semRegra()`. */
  regra?: string
  veiculos: UsPressVeiculo[]
  qualidade: {
    lidos: number
    naLista: number
    foraDaLista: number
    publicados: number
    descartadosPorAcompanhamento: number
    veiculosRepresentados: number
    tetoPorVeiculo: number
    consultasComFalha: string[]
    /** Contadores do trilho, a partir de 16/Ago/2026. Ver `UsPressItem.trilho`. */
    publicadosPorDisputa?: number
    publicadosPorMetodo?: number
  }
  itens: UsPressItem[]
}

/**
 * Tira o `regra` antes de mandar para a tela.
 *
 * A tarja que imprimia essa frase saiu em 03/Ago/2026, mas o campo continuava
 * sendo serializado no payload da página: invisível para quem olha, visível para
 * quem abre o código-fonte e para qualquer robô ou modelo que leia a página.
 * Campo removido por decisão editorial tem TRÊS lugares, e este é o segundo.
 * O terceiro, o registro gravado, FICA: lá a regra é procedência do dataset.
 */
function semRegra(d: UsPressData): UsPressData {
  const { regra: _regra, ...resto } = d
  return resto as UsPressData
}

export type UsPressEstado = 'ok' | 'vazio' | 'indisponivel'

export interface UsPressLeitura {
  estado: UsPressEstado
  data: UsPressData | null
  /** De onde veio o que está na tela. `arquivo` obriga a rotular a data da coleta. */
  origem: 'banco' | 'arquivo' | null
}

/** Forma mínima para o payload não derrubar a seção nem a página. */
function formaValida(d: unknown): d is UsPressData {
  const x = d as UsPressData
  return !!x && Array.isArray(x.itens) && Array.isArray(x.veiculos)
}

/**
 * Piso de arquivo, atualizado por `scripts/snapshot-us-press.ts` junto da rodada
 * dos EUA. O cron NÃO escreve aqui: em serverless o disco é efêmero, e fingir que
 * grava seria pior que não ter piso.
 */
function lerArquivo(): UsPressData | null {
  try {
    const p = join(process.cwd(), 'public', 'us-press-data.json')
    if (!existsSync(p)) return null
    const d = JSON.parse(readFileSync(p, 'utf-8'))
    return formaValida(d) ? d : null
  } catch (e) {
    console.error('[us-press] piso de arquivo ilegível:', e)
    return null
  }
}

export async function loadUsPressData(): Promise<UsPressLeitura> {
  let doBanco: UsPressData | null = null
  let falhou = false

  try {
    const { getPrisma } = await import('../db')
    const prisma = getPrisma()
    if (!prisma) {
      falhou = true
    } else {
      const reg = await prisma.analysisReport.findFirst({
        where: { slug: { startsWith: 'us-press-' } },
        orderBy: { publishedAt: 'desc' },
        select: { bodyMarkdown: true },
      })
      if (!reg?.bodyMarkdown) falhou = true
      else {
        const d = JSON.parse(reg.bodyMarkdown)
        if (formaValida(d)) doBanco = d
        else falhou = true
      }
    }
  } catch (e) {
    // ⚠️ NUNCA silenciar. Foi o `catch {}` vazio que impediu de saber a causa em
    // 02/Ago, quando a seção apareceu vazia com o dado íntegro no banco.
    console.error('[us-press] leitura do banco falhou:', e)
    falhou = true
  }

  if (doBanco && doBanco.itens.length > 0) return { estado: 'ok', data: semRegra(doBanco), origem: 'banco' }

  // Banco respondeu e a coleta estava vazia de verdade: isso é informação.
  if (doBanco && !falhou) return { estado: 'vazio', data: semRegra(doBanco), origem: 'banco' }

  // Não deu para ler. O piso entra, e a tela vai declarar a data da coleta.
  const doArquivo = lerArquivo()
  if (doArquivo && doArquivo.itens.length > 0) {
    console.warn('[us-press] servindo piso de arquivo, coleta de', doArquivo.lastUpdate)
    return { estado: 'ok', data: semRegra(doArquivo), origem: 'arquivo' }
  }

  return { estado: 'indisponivel', data: null, origem: null }
}
