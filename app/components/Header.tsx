'use client';

interface HeaderProps {
  fetchedAt?: string;
  onShowSobre: () => void;
  onShowMetas: () => void;
  onShowGlobal: () => void;
}

export function Header({ fetchedAt, onShowSobre, onShowMetas, onShowGlobal }: HeaderProps) {
  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded" aria-label="Pular para conteúdo principal">Pular para conteúdo principal</a>
      <header className="bg-primary text-white py-6 px-4 md:px-8" role="banner">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">AFOS Analytics</h1>
              <p className="text-blue-200 mt-1 text-sm md:text-base">Plataforma Mundial de Inteligência em Cruzamentos de Risco Político Eleitoral</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
              <button onClick={onShowSobre} aria-label="Abrir informações sobre o AFOS Analytics" className="border border-white/30 hover:bg-white/10 focus:outline-2 focus:outline-offset-2 focus:outline-white text-white text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-lg transition-all duration-200">
                Sobre
              </button>
              <button onClick={onShowMetas} aria-label="Abrir metas do AFOS Analytics" className="border border-white/30 hover:bg-white/10 focus:outline-2 focus:outline-offset-2 focus:outline-white text-white text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-lg transition-all duration-200">
                Metas
              </button>
              <button onClick={onShowGlobal} aria-label="Abrir eleições globais" className="border border-white/30 hover:bg-white/10 focus:outline-2 focus:outline-offset-2 focus:outline-white text-white text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-lg transition-all duration-200">
                Global
              </button>
            </div>
          </div>
          <p className="text-blue-300 text-xs mt-2">
            Atualizado: {fetchedAt ? new Date(fetchedAt).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }) : new Date().toLocaleString('pt-BR')}
          </p>
        </div>
      </header>
    </>
  );
}
