import { getCountryDivergence } from '../../../lib/country-data'
import { CountryGraph } from '../../components/CountryGraph'

export const dynamic = 'force-static'

// PREVIEW (não indexado): grafo estilo Obsidian do cruzamento AFOS, caso EUA 2024.
// noindex explícito: página herda index:true do root layout se não sobrescrever.
export const metadata = { robots: { index: false, follow: false } }
// Textos por idioma. O pt-BR é cópia BYTE A BYTE do que já estava na página:
// esta correção só para de servir a versão portuguesa a quem pediu /en e /es.
const T: Record<string, { eyebrow: string; h1: string; corpo: string; rotulo: string; semDados: string; rodape: string }> = {
  'pt-BR': {
    eyebrow: 'AFOS · Preview',
    h1: 'Grafo do cruzamento, EUA 2024',
    corpo: 'Visualização estilo Obsidian do dado AFOS para um país: a eleição no centro, as camadas (mercados de previsão, pesquisas, imprensa, contexto estrutural) e os itens em volta. A estrela é a divergência: a linha entre o mercado e cada candidato vem colorida pela magnitude (vermelho = divergência alta, verde = convergência) com o Δpp em destaque sobre a própria linha. No caso dos EUA 2024, os dois mercados que discordaram aparecem lado a lado: o colégio eleitoral (acertou) e o voto popular (errou).',
    rotulo: 'EUA 2024',
    semDados: 'Sem dados.',
    rodape: 'Preview interno. Em produção, o grafo aparece na página de cada país validado (e no dashboard, no caso do Brasil), com dados do Neon e tema claro/Sapphire.',
  },
  en: {
    eyebrow: 'AFOS · Preview',
    h1: 'Cross-reference graph, US 2024',
    corpo: 'Obsidian-style visualization of AFOS data for one country: the election at the center, the layers (prediction markets, polls, press, structural context) and the items around them. Divergence is the point: the line between the market and each candidate is colored by magnitude (red = high divergence, green = convergence) with the Δpp highlighted on the line itself. For the US in 2024, the two markets that disagreed appear side by side: the electoral college (right) and the popular vote (wrong).',
    rotulo: 'US 2024',
    semDados: 'No data.',
    rodape: 'Internal preview. In production the graph appears on each validated country page (and on the dashboard, for Brazil), with data from Neon and the light/Sapphire theme.',
  },
  es: {
    eyebrow: 'AFOS · Preview',
    h1: 'Grafo del cruce, EE. UU. 2024',
    corpo: 'Visualización estilo Obsidian del dato AFOS para un país: la elección en el centro, las capas (mercados de predicción, encuestas, prensa, contexto estructural) y los elementos alrededor. La divergencia es lo central: la línea entre el mercado y cada candidato viene coloreada por magnitud (rojo = divergencia alta, verde = convergencia) con el Δpp destacado sobre la propia línea. En el caso de EE. UU. 2024, los dos mercados que discreparon aparecen uno al lado del otro: el colegio electoral (acertó) y el voto popular (erró).',
    rotulo: 'EE. UU. 2024',
    semDados: 'Sin datos.',
    rodape: 'Preview interno. En producción, el grafo aparece en la página de cada país validado (y en el panel, en el caso de Brasil), con datos de Neon y tema claro/Sapphire.',
  },
}

export default async function GraphPreviewPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const c = T[locale] ?? T['pt-BR']
  const data = getCountryDivergence('USA')
  return (
    <div className="min-h-screen bg-light-bg">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">{c.eyebrow}</p>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-dark mb-2">{c.h1}</h1>
        <p className="text-sm text-gray-600 mb-6 max-w-2xl">
          {c.corpo}
        </p>
        {data ? <CountryGraph data={data} electionLabel={c.rotulo} /> : <p>{c.semDados}</p>}
        <p className="text-xs text-gray-400 mt-4">{c.rodape}</p>
      </div>
    </div>
  )
}
