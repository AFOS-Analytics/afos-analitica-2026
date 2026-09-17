/**
 * base-afos.mjs — de onde os scripts LOCAIS leem a API do próprio AFOS.
 *
 * 🔴 POR QUE ISTO EXISTE, medido em 17/Set/2026. Numa rede externa com inspeção
 * de TLS (FortiGate `FG200ETK18908819`), o certificado de www.afos-analytics.com
 * chegava reassinado e todo leitor local caía com UNABLE_TO_VERIFY_LEAF_SIGNATURE,
 * enquanto Vercel, GitHub, HF, Neon, Resend, TSE e Polymarket passavam. O
 * endereço `afos-analitica-2026.vercel.app` aponta para o MESMO deployment de
 * produção (conferido por `vercel inspect` nos dois nomes: mesmo dpl_ id,
 * target production) e chega com cadeia válida.
 *
 * ⛔ Isto troca o HOST, nunca a verificação de certificado. Desligar TLS aceitaria
 * qualquer interceptação, inclusive ao publicar.
 *
 * ⛔ Só para LEITURA. Link público (email, feed, sitemap, llms.txt, SEO) e
 * User-Agent continuam no domínio canônico, e por isso este módulo não é usado
 * em `lib/`, que roda na Vercel.
 *
 * 🔒 LISTA FECHADA de hosts. URL de preview serve código que não é o de
 * produção, e ler preço ou calendário dali certificaria dado de outra versão.
 * Host fora da lista LANÇA, nunca cai calado para o canônico: fallback
 * silencioso é o defeito que entrega o outro país. → memory/feedback_pais_nao_se_mistura_e_fallback_silencioso_entrega_o_outro.md
 */

export const DOMINIO_CANONICO = 'https://www.afos-analytics.com'
export const ALIAS_PRODUCAO = 'https://afos-analitica-2026.vercel.app'
export const HOSTS_PERMITIDOS = ['www.afos-analytics.com', 'afos-analytics.com', 'afos-analitica-2026.vercel.app']

/** Valida e normaliza uma base. Lança em host fora da lista ou esquema que não é https. */
export function normalizarBase(valor) {
  const bruto = String(valor ?? '').trim()
  if (!bruto) return DOMINIO_CANONICO
  let u
  try {
    u = new URL(bruto)
  } catch {
    throw new Error(`AFOS_BASE inválida: "${bruto}" não é URL`)
  }
  if (u.protocol !== 'https:') throw new Error(`AFOS_BASE precisa ser https, veio ${u.protocol}`)
  if (!HOSTS_PERMITIDOS.includes(u.hostname)) {
    throw new Error(`AFOS_BASE com host fora da lista (${u.hostname}). Permitidos: ${HOSTS_PERMITIDOS.join(', ')}. Preview não serve a produção.`)
  }
  if (u.pathname !== '/' || u.search || u.hash) throw new Error(`AFOS_BASE deve ser só a origem, sem caminho: ${bruto}`)
  return `${u.protocol}//${u.hostname}`
}

let avisado = false

/**
 * A base de leitura desta execução: `AFOS_BASE` se definida, senão o domínio
 * canônico. Quando não é o canônico, avisa UMA vez no stderr, para a troca nunca
 * ser silenciosa num relatório.
 */
export function baseDeLeitura(env = process.env) {
  const base = normalizarBase(env.AFOS_BASE)
  if (base !== DOMINIO_CANONICO && !avisado && env === process.env) {
    avisado = true
    console.error(`🌐 leitura por ${base} (AFOS_BASE), não pelo domínio canônico: mesma produção, outro nome`)
  }
  return base
}
