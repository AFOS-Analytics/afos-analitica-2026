/**
 * 🧭 ESTADO DOS PAINÉIS, um lugar só. Criado 12/Nov/2026 (decisão do André).
 *
 * Regra: painel AO VIVO fica em primeiro plano; painel ENCERRADO, com relatório
 * final publicado, fica em segundo plano, visível e clicável, com selo e link do
 * relatório. O botão genérico "Dashboard" (cabeçalho, rodapé, página inicial e o
 * endereço /[idioma]/dashboard) abre o PRIMEIRO painel ao vivo desta lista; sem
 * nenhum ao vivo, abre o encerrado mais recente.
 *
 * Links com CONTEXTO não passam por aqui: a Daily é do Brasil e aponta para
 * /dashboard/br; o arquivo do Tradeoff aponta para o painel do próprio país.
 *
 * Encerrar um painel = mudar `estado` para 'encerrado', preencher `encerradoEm`
 * e `relatorio`, e publicar. Nada mais.
 *
 * ⚠️ .mjs de propósito: o `next.config.mjs` (redirecionamento de /dashboard) lê
 * o mesmo registro que os componentes TypeScript. Duas cópias da regra
 * divergiriam.
 */

/** @typedef {'br' | 'us' | 'fr'} CodigoPainel */
/**
 * @typedef {{
 *   code: CodigoPainel,
 *   estado: 'ao-vivo' | 'encerrado',
 *   encerradoEm?: string,
 *   relatorio?: string,
 *   label: { 'pt-BR': string, en: string, es: string },
 * }} Painel
 */

/** @type {Painel[]} Ordem de entrada; a ordem de EXIBIÇÃO sai de `paineisOrdenados()`. */
export const PAINEIS = [
  // 🇫🇷 Publicado em 08/Nov/2026. 1º turno em 18/Abr/2027, 2º em 02/Mai/2027.
  { code: 'fr', estado: 'ao-vivo', label: { 'pt-BR': 'França', en: 'France', es: 'Francia' } },
  // 🇺🇸 Janela até a urna fechou em 03/Nov/2026; relatório final em 06/Nov. Segundo
  // plano desde 12/Nov (André), embora a coleta siga até a última projeção da AP.
  { code: 'us', estado: 'encerrado', encerradoEm: '2026-11-06', relatorio: 'usa-2026', label: { 'pt-BR': 'Estados Unidos', en: 'United States', es: 'Estados Unidos' } },
  // 🇧🇷 Congelado em 02/Nov/2026; relatório final em 01/Nov.
  { code: 'br', estado: 'encerrado', encerradoEm: '2026-11-01', relatorio: 'brazil-2026', label: { 'pt-BR': 'Brasil', en: 'Brazil', es: 'Brasil' } },
]

/** Ao vivo primeiro (na ordem do registro); depois os encerrados, do mais recente ao mais antigo. */
export function paineisOrdenados() {
  const vivos = PAINEIS.filter((p) => p.estado === 'ao-vivo')
  const encerrados = PAINEIS.filter((p) => p.estado === 'encerrado')
    .slice()
    .sort((a, b) => String(b.encerradoEm ?? '').localeCompare(String(a.encerradoEm ?? '')))
  return [...vivos, ...encerrados]
}

/** País que o botão genérico "Dashboard" abre. */
export function paisPadrao() {
  const p = paineisOrdenados()[0]
  if (!p) throw new Error('lib/paineis.mjs: registro de painéis vazio')
  return p.code
}

/** Caminho do botão genérico "Dashboard" num idioma. */
export function caminhoDashboard(locale) {
  return `/${locale}/dashboard/${paisPadrao()}`
}
