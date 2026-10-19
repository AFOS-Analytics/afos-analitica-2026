/**
 * 🏷️ O RÓTULO do partido na tela dos EUA, por idioma.
 *
 * ─── O DEFEITO QUE ELE CONSERTA ─────────────────────────────────────────────
 *
 * 🔴 Medido em 19/Out/2026, despejando o texto renderizado das três telas de
 *    `/dashboard/us`: os cartões de controle imprimiam `Democratas` e
 *    `Republicanos` **em português no inglês e no espanhol**, ao lado de rótulos
 *    corretamente traduzidos (`House`, `Cámara`, `Democratic margin`).
 *
 * 🔑 E o mecanismo NÃO é herança de tradução quebrada. Aqui não havia tradução
 *    nenhuma a herdar: o rótulo é o **nome do desfecho como o banco o guarda**,
 *    vindo da coleta do Polymarket, e a tela o imprimia cru. Não foi um mapa que
 *    falhou, foi um campo que nunca entrou em mapa nenhum.
 *    → memory/feedback_a_heranca_de_traducao_congela_o_erro_e_o_mapa_nao_alcanca.md
 *
 * ⚠️ Por que ninguém viu: o `conferir-tela.mjs` conferia NÚMERO, e o número
 *    estava certo nos três idiomas. Foi o portão de ETIQUETA, de 19/Out, que
 *    obrigou a olhar o texto em volta.
 *
 * ─── AS TRADUÇÕES NÃO SÃO NOVAS, e isso é o ponto ───────────────────────────
 *
 * ⛔ Elas JÁ EXISTIAM no repositório, inline no `UsDashboardClient.tsx`, onde a
 *    seção do cruzamento já imprimia `Democrats` e `Demócratas` corretamente.
 *    Então a tela se contradizia: o mesmo partido saía traduzido num bloco e em
 *    português noutro, na MESMA página.
 *
 * ✅ Este módulo é a cópia ÚNICA, e os dois consumidores passaram a importá-lo.
 *    Redigitar as traduções aqui e deixar as de lá teria criado a terceira.
 *
 * ─── A TRAVA ANTI-SILÊNCIO ──────────────────────────────────────────────────
 *
 * 🔑 Nome que NÃO está no mapa passa INTEIRO, nunca vira vazio nem "?".
 *    A razão é concreta: o mesmo componente desenha as FAIXAS de cadeiras
 *    (`< 190 cad.`, `≤ 47 cad.`) com a mesma função de rótulo, e um mapa que
 *    engolisse o desconhecido apagaria a tabela inteira de distribuição.
 *    ⛔ E desfecho novo do Polymarket apareceria em branco, que é pior que
 *    aparecer em português: um erro de idioma se lê, um rótulo vazio não.
 */

/**
 * Os desfechos que a coleta guarda, com o rótulo de cada idioma.
 *
 * 📌 A CHAVE é o nome como está no banco, e ele NÃO se traduz lá: mexer no dado
 * mudaria a procedência da série. O que se traduz é a apresentação.
 */
export const PARTIDO_US: Record<string, { 'pt-BR': string; en: string; es: string }> = {
  Democratas: { 'pt-BR': 'Democratas', en: 'Democrats', es: 'Demócratas' },
  Republicanos: { 'pt-BR': 'Republicanos', en: 'Republicans', es: 'Republicanos' },
}

/**
 * O rótulo de exibição. Nome fora do mapa volta INTEIRO.
 *
 * @param nome   o nome do desfecho como o banco o guarda
 * @param locale `pt-BR`, `en` ou `es`; qualquer outro cai em `pt-BR`
 */
export function rotuloDePartido(nome: string, locale: string): string {
  const entrada = PARTIDO_US[nome]
  if (!entrada) return nome
  const k = locale === 'en' || locale === 'es' ? locale : 'pt-BR'
  // ⛔ Entrada declarada sem o idioma também volta inteira, em vez de vazio.
  return entrada[k] || nome
}
