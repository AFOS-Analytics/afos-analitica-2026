import { getCountryDivergence } from '../../../lib/country-data'
import { CountryGraph } from '../../components/CountryGraph'

export const dynamic = 'force-static'

// PREVIEW (não indexado): grafo estilo Obsidian do cruzamento AFOS, caso EUA 2024.
export default function GraphPreviewPage() {
  const data = getCountryDivergence('USA')
  return (
    <div className="min-h-screen bg-light-bg">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">AFOS · Preview</p>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-dark mb-2">Grafo do cruzamento, EUA 2024</h1>
        <p className="text-sm text-gray-600 mb-6 max-w-2xl">
          Visualização estilo Obsidian do dado AFOS para um país: a eleição no centro, as camadas (mercados de previsão, pesquisas, imprensa, contexto estrutural) e os itens em volta. A estrela é a divergência: a linha entre o mercado e cada candidato vem colorida pela magnitude (vermelho = divergência alta, verde = convergência) com o Δpp em destaque sobre a própria linha. No caso dos EUA 2024, os dois mercados que discordaram aparecem lado a lado: o colégio eleitoral (acertou) e o voto popular (errou).
        </p>
        {data ? <CountryGraph data={data} electionLabel="EUA 2024" /> : <p>Sem dados.</p>}
        <p className="text-xs text-gray-400 mt-4">Preview interno. Em produção, o grafo aparece na página de cada país validado (e no dashboard, no caso do Brasil), com dados do Neon e tema claro/Sapphire.</p>
      </div>
    </div>
  )
}
