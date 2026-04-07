export function Footer() {
  return (
    <footer className="bg-primary text-white py-4 px-4 sm:px-8 text-center text-xs" role="contentinfo">
      <p>AFOS Analytics — Plataforma Global de Inteligência Eleitoral | Dados: Polymarket, +17 Institutos de Pesquisa, Google News, Firecrawl AI | Atualizado a cada 2h | Este conteúdo não constitui orientação política</p>
      <p className="mt-1 text-white/70">Dados e probabilidades obtidos da <a href="https://polymarket.com/politics/brazil" target="_blank" rel="noopener noreferrer" className="underline hover:text-white" aria-label="Polymarket (abre em nova aba)">Polymarket (polymarket.com)</a> — Este site não é afiliado à Polymarket. Os dados são atualizados automaticamente via API pública.</p>
    </footer>
  );
}
