'use client'

// Aviso no topo de um painel ENCERRADO (regra de 12/Nov/2026: painel encerrado,
// com relatório final publicado, fica em segundo plano e diz isso na própria tela;
// estado em `lib/paineis.mjs`).
//
// Brasil: congelado em 02/Nov/2026; a cobertura terminou em 01/Nov, os textos
// ficam como estavam na noite da apuração (com o resultado final do TSE) e o
// preço é uma leitura única.
//
// EUA: cobertura editorial encerrada em 09/Nov/2026 (última edição do Tradeoff;
// relatório final em 06/Nov), mas o painel AINDA NÃO está congelado: por decisão
// do André (10/Nov), o congelamento espera a última disputa projetada pela AP, o
// 2º turno da Louisiana em 12/Dez. O texto abaixo diz exatamente isso. Ao
// congelar, trocar o texto dos EUA (o pacote está pronto, sem commit, em
// C:/temp/afos-congela-us, com a MESMA interface `pais` + `semContainer`).
import { useTranslation } from '../i18n/context'

type Pais = 'br' | 'us'

const HARVARD_DOI_URL: Record<Pais, string> = {
  br: 'https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/2D0UK7',
  us: 'https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/XRUT8U',
}

const RELATORIO: Record<Pais, string> = { br: 'brazil-2026', us: 'usa-2026' }

const T: Record<Pais, Record<'pt-BR' | 'en' | 'es', { titulo: string; texto: string; relatorio: string; dados: string }>> = {
  br: {
    'pt-BR': {
      titulo: 'Cobertura encerrada em 01/11/2026.',
      texto: 'Este painel está congelado. Os textos são os da noite da apuração, 25/10, com o resultado final do TSE, e os preços do Polymarket são a leitura de 02/11.',
      relatorio: 'Ler o relatório final',
      dados: 'Dados no Harvard Dataverse',
    },
    en: {
      titulo: 'Coverage closed on Nov 1, 2026.',
      texto: 'This panel is frozen. The texts are those of election night, Oct 25, with the TSE final result, and the Polymarket prices are the Nov 2 reading.',
      relatorio: 'Read the final report',
      dados: 'Data on Harvard Dataverse',
    },
    es: {
      titulo: 'Cobertura cerrada el 01/11/2026.',
      texto: 'Este panel está congelado. Los textos son los de la noche del escrutinio, 25/10, con el resultado final del TSE, y los precios de Polymarket son la lectura del 02/11.',
      relatorio: 'Leer el informe final',
      dados: 'Datos en Harvard Dataverse',
    },
  },
  us: {
    'pt-BR': {
      titulo: 'Cobertura encerrada em 09/11/2026.',
      texto: 'A eleição foi em 03/11, o relatório final saiu em 06/11 e a última edição do AFOS Tradeoff em 09/11. O painel segue no ar até a última disputa projetada pela AP, o 2º turno da Louisiana em 12/12, e depois será congelado.',
      relatorio: 'Ler o relatório final',
      dados: 'Dados no Harvard Dataverse',
    },
    en: {
      titulo: 'Coverage closed on Nov 9, 2026.',
      texto: 'The election was held on Nov 3, the final report came out on Nov 6 and the last AFOS Tradeoff edition on Nov 9. The panel stays online until the last race projected by the AP, the Louisiana runoff on Dec 12, and will then be frozen.',
      relatorio: 'Read the final report',
      dados: 'Data on Harvard Dataverse',
    },
    es: {
      titulo: 'Cobertura cerrada el 09/11/2026.',
      texto: 'La elección fue el 03/11, el informe final salió el 06/11 y la última edición de AFOS Tradeoff el 09/11. El panel sigue en línea hasta la última contienda proyectada por la AP, la segunda vuelta de Luisiana el 12/12, y después quedará congelado.',
      relatorio: 'Leer el informe final',
      dados: 'Datos en Harvard Dataverse',
    },
  },
}

export function CoberturaEncerradaBanner({ pais = 'br', semContainer = false }: { pais?: Pais; semContainer?: boolean }) {
  const { locale } = useTranslation()
  const tKey = (locale === 'en' || locale === 'es' ? locale : 'pt-BR') as 'pt-BR' | 'en' | 'es'
  const t = T[pais][tKey]

  const aviso = (
    <div role="status" className="border border-primary/20 bg-primary/5 rounded-xl px-4 py-3 md:px-5 text-sm text-dark leading-relaxed">
      <span className="font-bold text-primary">{t.titulo}</span>{' '}
      <span>{t.texto}</span>{' '}
      <span className="inline-flex flex-wrap gap-x-3 gap-y-1">
        <a href={`/${tKey}/report/${RELATORIO[pais]}`} className="font-semibold text-primary underline underline-offset-2 hover:no-underline">{t.relatorio}</a>
        <a href={HARVARD_DOI_URL[pais]} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline underline-offset-2 hover:no-underline">{t.dados}</a>
      </span>
    </div>
  )

  if (semContainer) return aviso
  return <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 md:px-8 mt-5 sm:mt-6">{aviso}</div>
}
