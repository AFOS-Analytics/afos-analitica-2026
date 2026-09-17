/**
 * rede-afos.mjs — o veredito da rede, puro, para o detector e para o teste.
 *
 * Entrada: o resultado da conexão TLS verificada a cada nome.
 *   { canonico: { ok, emissor, erro }, alias: { ok, emissor, erro } }
 */

export function vereditoDeRede({ canonico, alias }) {
  if (!canonico || !alias) throw new Error('vereditoDeRede exige canonico e alias')
  if (canonico.ok) return { veredito: 'LIMPA', codigo: 0, base: null }
  if (alias.ok) {
    return {
      veredito: 'DOMINIO_INTERCEPTADO',
      codigo: 2,
      base: 'https://afos-analitica-2026.vercel.app',
    }
  }
  return { veredito: 'SEM_ACESSO', codigo: 1, base: null }
}
