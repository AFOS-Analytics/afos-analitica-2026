'use client';

export function Footer() {
  return (
    <footer className="bg-primary text-white py-4 px-4 sm:px-8 text-center text-xs" role="contentinfo">
      <p>AFOS Analytics — Plataforma Global de Inteligência Eleitoral | Dados: Polymarket, +17 Institutos de Pesquisa, Google News, Firecrawl AI | Atualizado a cada 2h | Este conteúdo não constitui orientação política</p>
      <p className="mt-1 text-white/70">Dados e probabilidades obtidos da <a href="https://polymarket.com/politics/brazil" target="_blank" rel="noopener noreferrer" className="underline hover:text-white" aria-label="Polymarket (abre em nova aba)">Polymarket (polymarket.com)</a> — Este site não é afiliado à Polymarket. Os dados são atualizados automaticamente via API pública.</p>
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-white/30 text-white/80 hover:text-white hover:bg-white/10 transition-all text-xs font-medium"
        aria-label="Voltar ao topo"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M7 12V2M7 2L2.5 6.5M7 2L11.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Voltar ao topo
      </button>
    </footer>
  );
}
