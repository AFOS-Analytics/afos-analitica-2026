'use client'

import { useState } from 'react'
import { useTranslation } from '../../i18n/context'
import { SectionTitle, Card } from '../ui'
import type { FrPressData } from '../../../lib/fr/painel'

/**
 * Imprensa do painel da FRANÇA. Mesmas regras da seção dos EUA: lista fixa,
 * aprovada pelo André em 08/Nov/2026, sem rótulo de inclinação; manchete no
 * francês original, com link para o veículo; o AFOS não resume nem interpreta.
 */

const T = {
  'pt-BR': {
    titulo: 'Imprensa francesa',
    verLista: 'A lista de veículos',
    listaNota: 'Escolher veículo é juízo editorial, então a lista é fixa e vale igual em todas as rodadas: jornais nacionais e regional, televisão e rádio públicas e privadas, revistas, nativos digitais e imprensa especializada. O AFOS não classifica veículo por inclinação política. As manchetes ficam no francês original.',
    colCasa: 'Veículo',
    colTipo: 'Papel',
    metodo: 'sobre a medição',
    semColeta: 'A coleta rodou e não encontrou matéria de veículo da lista nesta janela.',
    indisponivel: 'Não foi possível ler a coleta de imprensa agora. Isto é falha de leitura, não ausência de notícia.',
    rodape: (pub: number, casas: number, teto: number, fora: number) => `${pub} matérias de ${casas} veículos, no máximo ${teto} por veículo. ${fora} itens de veículos fora da lista ficaram de fora. Diretos ao vivo são descartados.`,
    atualizado: (d: string) => `Coletado em ${d}`,
  },
  en: {
    titulo: 'French press',
    verLista: 'The outlet list',
    listaNota: 'Choosing outlets is an editorial judgement, so the list is fixed and applies identically on every run: national and regional newspapers, public and private broadcast, weeklies, digital natives and specialist press. AFOS does not classify outlets by political leaning. Headlines stay in the original French.',
    colCasa: 'Outlet',
    colTipo: 'Role',
    metodo: 'about measurement',
    semColeta: 'The collection ran and found no story from a listed outlet in this window.',
    indisponivel: 'The press collection could not be read right now. This is a read failure, not an absence of news.',
    rodape: (pub: number, casas: number, teto: number, fora: number) => `${pub} stories from ${casas} outlets, at most ${teto} per outlet. ${fora} items from outlets off the list were dropped. Live blogs are discarded.`,
    atualizado: (d: string) => `Collected on ${d}`,
  },
  es: {
    titulo: 'Prensa francesa',
    verLista: 'La lista de medios',
    listaNota: 'Elegir medios es un juicio editorial, así que la lista es fija y rige igual en todas las rondas: diarios nacionales y regional, radio y televisión públicas y privadas, semanarios, nativos digitales y prensa especializada. El AFOS no clasifica a los medios por inclinación política. Los titulares quedan en el francés original.',
    colCasa: 'Medio',
    colTipo: 'Papel',
    metodo: 'sobre la medición',
    semColeta: 'La recolección se ejecutó y no encontró notas de medios de la lista en esta ventana.',
    indisponivel: 'No fue posible leer la recolección de prensa ahora. Es una falla de lectura, no ausencia de noticias.',
    rodape: (pub: number, casas: number, teto: number, fora: number) => `${pub} notas de ${casas} medios, como máximo ${teto} por medio. ${fora} ítems de medios fuera de la lista quedaron afuera. Las transmisiones en vivo se descartan.`,
    atualizado: (d: string) => `Recolectado el ${d}`,
  },
}

/** Papel do veículo, nos três idiomas. Fato sobre o que a organização é. */
const TIPOS: Record<string, { 'pt-BR': string; en: string; es: string }> = {
  jornal: { 'pt-BR': 'jornal', en: 'newspaper', es: 'diario' },
  regional: { 'pt-BR': 'jornal regional', en: 'regional newspaper', es: 'diario regional' },
  'tv/rádio': { 'pt-BR': 'TV e rádio', en: 'TV and radio', es: 'TV y radio' },
  revista: { 'pt-BR': 'revista', en: 'weekly', es: 'semanario' },
  digital: { 'pt-BR': 'nativo digital', en: 'digital native', es: 'nativo digital' },
  especializada: { 'pt-BR': 'especializada', en: 'specialist', es: 'especializada' },
}

function dm(iso: string, locale: string): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  const dia = String(d.getUTCDate()).padStart(2, '0')
  const mes = String(d.getUTCMonth() + 1).padStart(2, '0')
  return locale === 'en' ? `${mes}/${dia}` : `${dia}/${mes}`
}

export function FrPressSection({ estado, data }: { estado: 'ok' | 'vazio' | 'indisponivel'; data: FrPressData | null }) {
  const { locale } = useTranslation()
  const k = (locale === 'en' || locale === 'es' ? locale : 'pt-BR') as keyof typeof T
  const t = T[k]
  const [verLista, setVerLista] = useState(false)

  if (estado !== 'ok' || !data) {
    return (
      <section>
        <SectionTitle>{t.titulo}</SectionTitle>
        <Card><p className="text-sm text-gray-600">{estado === 'vazio' ? t.semColeta : t.indisponivel}</p></Card>
      </section>
    )
  }
  const q = data.qualidade

  return (
    <section>
      <SectionTitle>{t.titulo}</SectionTitle>
      <Card>
        {data.itens.length === 0 ? (
          <p className="text-sm text-gray-600">{t.semColeta}</p>
        ) : (
          <ul className="divide-y divide-light-border">
            {data.itens.map((i) => (
              <li key={i.url} className="py-2.5 first:pt-0 last:pb-0">
                <a href={i.url} target="_blank" rel="noopener noreferrer" lang="fr" className="text-sm font-medium leading-snug text-dark hover:text-primary hover:underline">
                  {i.titulo}
                </a>
                <div className="mt-0.5 text-[11px] text-gray-500">
                  {i.casa} · {dm(i.publicadoEm, locale)}{i.trilho === 'metodo' ? ` · ${t.metodo}` : ''}
                </div>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-4 border-t border-light-border pt-3 text-[11px] leading-snug text-gray-500">
          {t.rodape(q.publicados, q.veiculosRepresentados, q.tetoPorVeiculo, q.foraDaLista)} {t.atualizado(dm(data.fetchedAt, locale))}.
        </p>

        <button type="button" onClick={() => setVerLista((v) => !v)} className="mt-2 text-[11px] font-semibold text-primary hover:underline" aria-expanded={verLista}>
          {t.verLista} {verLista ? '▴' : '▾'}
        </button>
        {verLista && (
          <div className="mt-2">
            <p className="mb-2 text-[11px] leading-snug text-gray-500">{t.listaNota}</p>
            <table className="w-full text-[12px]">
              <thead>
                <tr className="text-left text-gray-500"><th className="py-0.5 pr-3 font-semibold">{t.colCasa}</th><th className="py-0.5 font-semibold">{t.colTipo}</th></tr>
              </thead>
              <tbody>
                {data.veiculos.map((v) => (
                  <tr key={v.casa}><td className="py-0.5 pr-3 text-dark">{v.casa}</td><td className="py-0.5 text-gray-600">{TIPOS[v.tipo]?.[k] ?? v.tipo}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </section>
  )
}
