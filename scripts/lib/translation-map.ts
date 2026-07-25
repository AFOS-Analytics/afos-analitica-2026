/**
 * Aplicador de mapa de tradução para os JSON editoriais do dashboard.
 *
 * POR QUE ASSIM, e não redigitando o arquivo
 * Os três JSON somam dezenas de KB, quase tudo número e metadado. Redigitar o
 * arquivo inteiro para traduzir algumas dezenas de campos cria risco de alterar
 * número sem necessidade. Aqui o código copia TUDO byte a byte e troca só os
 * caminhos do mapa, abortando se algum caminho não existir na origem, o que
 * pega renomeação de chave em vez de deixar passar campo não traduzido.
 *
 * A escrita só acontece se o gate numérico passar. Se divergir, o arquivo do
 * idioma NÃO é escrito e o readLocalized devolve o pt-BR: melhor servir
 * português do que publicar número traduzido errado.
 */
import { compararNumeros } from './json-number-gate'

export type MapaTraducao = Record<string, string>

function lerCaminho(raiz: unknown, caminho: string): { achou: boolean; valor?: unknown } {
  const partes = caminho.match(/[^.[\]]+/g) ?? []
  let atual: unknown = raiz
  for (const p of partes) {
    if (atual == null || typeof atual !== 'object') return { achou: false }
    const obj = atual as Record<string, unknown>
    if (!(p in obj)) return { achou: false }
    atual = obj[p]
  }
  return { achou: true, valor: atual }
}

function escreverCaminho(raiz: unknown, caminho: string, valor: string): void {
  const partes = caminho.match(/[^.[\]]+/g) ?? []
  let atual = raiz as Record<string, unknown>
  for (let i = 0; i < partes.length - 1; i++) atual = atual[partes[i]] as Record<string, unknown>
  atual[partes[partes.length - 1]] = valor
}

/** Todo caminho de string do objeto, para conferir cobertura do mapa. */
export function caminhosDeString(o: unknown, base = '', fora: RegExp[] = []): string[] {
  const out: string[] = []
  const anda = (v: unknown, cam: string) => {
    if (typeof v === 'string') {
      if (!fora.some(re => re.test(cam))) out.push(cam)
      return
    }
    if (Array.isArray(v)) return v.forEach((x, i) => anda(x, `${cam}[${i}]`))
    if (v && typeof v === 'object') {
      for (const [k, x] of Object.entries(v as Record<string, unknown>)) {
        anda(x, cam ? `${cam}.${k}` : k)
      }
    }
  }
  anda(o, base)
  return out
}

export interface ResultadoTraducao {
  ok: boolean
  traduzido: unknown
  divergencias: ReturnType<typeof compararNumeros>
  faltando: string[]
}

/**
 * @param origem       objeto pt-BR já parseado
 * @param mapa         caminho -> texto traduzido
 * @param locale       'en' | 'es', usado pelo gate numérico
 */
export function aplicarMapa(
  origem: unknown,
  mapa: MapaTraducao,
  locale: 'en' | 'es',
): ResultadoTraducao {
  const traduzido = JSON.parse(JSON.stringify(origem))

  // Caminho do mapa que não existe na origem é erro DURO: sinaliza chave
  // renomeada, e seguir em frente publicaria o campo em português calado.
  const faltando = Object.keys(mapa).filter(c => !lerCaminho(origem, c).achou)
  if (faltando.length > 0) return { ok: false, traduzido, divergencias: [], faltando }

  for (const [caminho, texto] of Object.entries(mapa)) escreverCaminho(traduzido, caminho, texto)

  const divergencias = compararNumeros(origem, traduzido, locale)
  return { ok: divergencias.length === 0, traduzido, divergencias, faltando: [] }
}
