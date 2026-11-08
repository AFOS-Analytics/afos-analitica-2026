import type { Metadata } from 'next'
import { existsSync, readFileSync } from 'fs'
import { join } from 'path'
import { FrDashboardClient } from './FrDashboardClient'
import { SUPPORTED_LOCALES } from '../../../../lib/afos-daily/loader'
import { buildMetadata } from '../../../../lib/seo/metadata'
import type { Locale } from '../../../../lib/i18n/config'
import {
  carregarImprensaFr,
  carregarPesquisasFr,
  carregarProntidaoKalshi,
  duelosSegundoTurno,
  listaPrincipalPorInstituto,
  mediaPorCandidato,
  rodadaDe,
} from '../../../../lib/fr/painel'
import { emSilencioEleitoral } from '../../../../lib/fr/silencio-eleitoral'
import type { FrAnalise } from '../../../components/fr/FrAnaliseSection'
import type { FrPollsView } from '../../../components/fr/FrPollsSection'
// WGI e WDI vêm do caso validado França 2024: indicador é do PAÍS, não da eleição,
// e duas cópias só criariam chance de divergirem (mesma decisão dos EUA).
import franceCase from '../../../../lib/country-data/france.json'
import type { CountryContext } from '../../../../lib/country-data'

/**
 * Painel da FRANÇA, presidencial 2027. Criado 08/Nov/2026.
 *
 * 🚧 NÃO PUBLICADO. As 5 chaves dos EUA continuam DESLIGADAS de propósito:
 * `robots` noindex aqui, fora do `sitemap.ts`, fora do `llms-txt.ts`, sem
 * IndexNow e oculto no `CountrySelector`. A página existe para o André revisar
 * pelo endereço direto. Publicar = virar as 5 no mesmo commit.
 *
 * O canônico é declarado aqui com 'dashboard/fr' (o layout embrulha os países e
 * não pode fixar caminho).
 */

const DIAS_PRINCIPAL = 45
const DIAS_MEDIA = 30

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const loc = (locale === 'en' || locale === 'es' ? locale : 'pt-BR') as Locale
  const SEO: Record<Locale, { title: string; description: string }> = {
    'pt-BR': {
      title: 'Painel França, AFOS Analytics | Presidencial 2027',
      description: 'Painel da eleição presidencial francesa de 2027: dois mercados de previsão lado a lado, pesquisas conferidas com a ficha oficial e a imprensa francesa.',
    },
    en: {
      title: 'France panel, AFOS Analytics | 2027 Presidential',
      description: 'Panel for the 2027 French presidential election: two prediction markets side by side, polls checked against the official notice, and the French press.',
    },
    es: {
      title: 'Panel Francia, AFOS Analytics | Presidencial 2027',
      description: 'Panel de la elección presidencial francesa de 2027: dos mercados de predicción lado a lado, encuestas cotejadas con la ficha oficial y la prensa francesa.',
    },
  }
  return {
    ...buildMetadata({ ...SEO[loc], path: 'dashboard/fr' }, loc),
    // 🚧 Fora dos buscadores até o André publicar (ver o comentário do topo).
    robots: { index: false, follow: false },
  }
}

// 30 min: o mesmo ritmo das coletas de pesquisa e de imprensa basta.
export const revalidate = 1800

function lerAnalise(locale: string): FrAnalise | null {
  const loc = locale === 'en' || locale === 'es' ? locale : 'pt-BR'
  for (const l of [loc, 'pt-BR']) {
    try {
      const p = join(process.cwd(), 'public', 'fr', `analise.${l}.json`)
      if (existsSync(p)) return JSON.parse(readFileSync(p, 'utf-8')) as FrAnalise
    } catch (e) {
      console.error('[fr] análise ilegível:', e)
    }
  }
  return null
}

export default async function FrDashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const agora = new Date()
  const silencio = emSilencioEleitoral(agora).silencio

  const [pesq, press, prontidao] = await Promise.all([carregarPesquisasFr(), carregarImprensaFr(), carregarProntidaoKalshi(agora)])

  const vazio: FrPollsView = {
    estado: pesq.estado, principais: [], medias: [], diasDaMedia: DIAS_MEDIA, rodadasDaMedia: 0, duelos: [],
    publicaveis: 0, total: 0, divergencias: [], pendentes: [], fetchedAt: null,
  }
  let polls = vazio
  // 🔇 Em silêncio eleitoral os números de pesquisa nem saem do servidor.
  if (pesq.estado === 'ok' && !silencio) {
    const d = pesq.data
    const corte = new Date(agora.getTime() - DIAS_PRINCIPAL * 864e5).toISOString().slice(0, 10)
    polls = {
      estado: 'ok',
      principais: listaPrincipalPorInstituto(d.pesquisas, agora, DIAS_PRINCIPAL),
      medias: mediaPorCandidato(d.pesquisas, agora, DIAS_MEDIA),
      diasDaMedia: DIAS_MEDIA,
      rodadasDaMedia: new Set(
        d.pesquisas
          .filter((p) => p.publicavel && p.turno === 1 && p.campo.fim >= new Date(agora.getTime() - DIAS_MEDIA * 864e5).toISOString().slice(0, 10))
          .map((p) => rodadaDe(p.pollId)),
      ).size,
      duelos: duelosSegundoTurno(d.pesquisas, agora, DIAS_PRINCIPAL),
      publicaveis: d.qualidade.publicaveis,
      total: d.qualidade.pesquisas,
      // Só a divergência de verdade (ficha de OUTRA pesquisa) e só da janela.
      divergencias: d.pesquisas
        .filter((p) => p.ficha.status === 'diverge' && p.campo.fim >= corte)
        .map((p) => ({ instituto: p.instituto, fim: p.campo.fim, numero: p.ficha.numero })),
      pendentes: d.pendentes,
      fetchedAt: d.fetchedAt,
    }
  }

  return (
    <FrDashboardClient
      analise={lerAnalise(locale)}
      polls={polls}
      press={press}
      kalshiPronto={prontidao.pronto}
      kalshiProntoEm={prontidao.prontoEm ? prontidao.prontoEm.toISOString() : null}
      context={((franceCase as { context?: unknown }).context as CountryContext | undefined) ?? null}
    />
  )
}
