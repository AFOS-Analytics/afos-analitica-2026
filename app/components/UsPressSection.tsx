'use client'

import { useState } from 'react'
import { useTranslation } from '../i18n/context'
import { SectionTitle, Card } from './ui'
import type { UsPressData } from '../../lib/dashboard/us-press-data'

/**
 * Imprensa das midterms.
 *
 * ⚠️ A REGRA QUE O LEITOR PRECISA VER, e por isso ela abre a seção: aqui o AFOS
 * NÃO resume e NÃO interpreta. Ele lista o que veículos de uma lista fixa
 * publicaram, com link para a matéria. A leitura é do veículo, não da casa.
 * Sem esse aviso, manchete dentro de um painel de dado passa a parecer
 * apuração do painel.
 *
 * A LISTA FICA VISÍVEL, num detalhe expansível com a inclinação declarada de
 * cada veículo. Escolher veículo é juízo editorial, e juízo editorial escondido
 * é o que o AFOS não faz. Quem discordar da curadoria discorda de uma lista à
 * vista, não de um critério secreto.
 */

const T = {
  'pt-BR': {
    titulo: 'Imprensa',
    regra: 'O AFOS não resume nem interpreta estas matérias. Elas entram automaticamente, apenas de veículos de uma lista fixa, e o link leva à matéria do veículo. A leitura é de quem publicou.',
    verLista: 'A lista de veículos, e por que ela é equilibrada',
    listaNota: 'Escolher veículo é juízo editorial. Uma lista torta faria este painel ter opinião sem declarar que tem, então ela reúne agência, jornal de referência, imprensa especializada em Congresso, televisão e opinião declarada dos dois lados. A inclinação de cada um está escrita.',
    colCasa: 'Veículo',
    colTipo: 'Papel',
    colInclinacao: 'Inclinação',
    semDado: 'Sem matéria disponível nesta captura.',
    rodape: (pub: number, lidos: number, fora: number, casas: number, teto: number) =>
      `${pub} matérias de ${casas} veículos, no máximo ${teto} por veículo. De ${lidos} itens lidos, ${fora} eram de veículos fora da lista e ficaram de fora. Páginas de acompanhamento, como "últimas pesquisas" e "resultados ao vivo", são descartadas: mudam sozinhas e não são notícia do dia.`,
    atualizado: (d: string) => `Coletado em ${d}`,
  },
  en: {
    titulo: 'Press',
    regra: 'AFOS does not summarize or interpret these stories. They enter automatically, only from outlets on a fixed list, and the link goes to the outlet’s own article. The reading belongs to whoever published it.',
    verLista: 'The outlet list, and why it is balanced',
    listaNota: 'Choosing outlets is an editorial judgement. A skewed list would give this panel an opinion without declaring one, so it gathers wire services, newspapers of record, congressional trade press, broadcast, and declared opinion from both sides. Each leaning is written down.',
    colCasa: 'Outlet',
    colTipo: 'Role',
    colInclinacao: 'Leaning',
    semDado: 'No stories available in this capture.',
    rodape: (pub: number, lidos: number, fora: number, casas: number, teto: number) =>
      `${pub} stories from ${casas} outlets, at most ${teto} per outlet. Of ${lidos} items read, ${fora} came from outlets off the list and were dropped. Tracker pages such as "latest polls" and "live results" are discarded: they change on their own and are not news of the day.`,
    atualizado: (d: string) => `Collected on ${d}`,
  },
  es: {
    titulo: 'Prensa',
    regra: 'El AFOS no resume ni interpreta estas notas. Entran automáticamente, solo de medios de una lista fija, y el enlace lleva a la nota del medio. La lectura es de quien publicó.',
    verLista: 'La lista de medios, y por qué está equilibrada',
    listaNota: 'Elegir medios es un juicio editorial. Una lista torcida haría que este panel tuviera opinión sin declararlo, así que reúne agencias, diarios de referencia, prensa especializada en el Congreso, televisión y opinión declarada de ambos lados. La inclinación de cada uno está escrita.',
    colCasa: 'Medio',
    colTipo: 'Papel',
    colInclinacao: 'Inclinación',
    semDado: 'Sin notas disponibles en esta captura.',
    rodape: (pub: number, lidos: number, fora: number, casas: number, teto: number) =>
      `${pub} notas de ${casas} medios, como máximo ${teto} por medio. De ${lidos} ítems leídos, ${fora} eran de medios fuera de la lista y quedaron afuera. Las páginas de seguimiento, como "últimas encuestas" y "resultados en vivo", se descartan: cambian solas y no son noticia del día.`,
    atualizado: (d: string) => `Recolectado el ${d}`,
  },
}

function fmtData(iso: string, locale: string): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  const dia = String(d.getUTCDate()).padStart(2, '0')
  const mes = String(d.getUTCMonth() + 1).padStart(2, '0')
  return locale === 'en' ? `${mes}/${dia}` : `${dia}/${mes}`
}

export function UsPressSection({ data }: { data: UsPressData | null }) {
  const { locale } = useTranslation()
  const k = (locale === 'en' || locale === 'es' ? locale : 'pt-BR') as keyof typeof T
  const t = T[k]
  const [verLista, setVerLista] = useState(false)

  if (!data || data.itens.length === 0) {
    return (
      <section>
        <SectionTitle icon="📰">{t.titulo}</SectionTitle>
        <Card>
          <p className="text-sm text-gray-600">{t.semDado}</p>
        </Card>
      </section>
    )
  }

  const q = data.qualidade

  return (
    <section>
      <SectionTitle icon="📰">{t.titulo}</SectionTitle>

      {/* A regra vem antes das manchetes, pelo mesmo motivo da ressalva nas
          pesquisas: é o instante em que o leitor vê texto de terceiro dentro de
          uma página de dado. */}
      <div className="mb-4 rounded-xl border-l-4 border-slate-400 bg-slate-50 p-4">
        <p className="text-sm leading-snug text-slate-800">{t.regra}</p>
      </div>

      <Card>
        <ul className="divide-y divide-light-border">
          {data.itens.map((i) => (
            <li key={i.url} className="py-2.5 first:pt-0 last:pb-0">
              <a
                href={i.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium leading-snug text-dark hover:text-primary hover:underline"
              >
                {i.titulo}
              </a>
              <div className="mt-0.5 text-[11px] text-gray-500">
                {i.casa} · {fmtData(i.publicadoEm, locale)}
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-4 border-t border-light-border pt-3 text-[11px] leading-snug text-gray-500">
          {t.rodape(q.publicados, q.lidos, q.foraDaLista, q.veiculosRepresentados, q.tetoPorVeiculo)}{' '}
          {t.atualizado(fmtData(data.fetchedAt, locale))}.
        </p>

        <button
          type="button"
          onClick={() => setVerLista((v) => !v)}
          className="mt-2 text-xs font-semibold text-primary hover:underline"
          aria-expanded={verLista}
        >
          {verLista ? '▾' : '▸'} {t.verLista}
        </button>

        {verLista && (
          <div className="mt-2">
            <p className="mb-2 text-xs leading-snug text-gray-700">{t.listaNota}</p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-[10px] uppercase tracking-wider text-gray-500">
                    <th className="py-1 pr-3 font-semibold">{t.colCasa}</th>
                    <th className="py-1 pr-3 font-semibold">{t.colTipo}</th>
                    <th className="py-1 font-semibold">{t.colInclinacao}</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {data.veiculos.map((v) => (
                    <tr key={v.casa} className="border-t border-light-border">
                      <td className="py-1 pr-3">{v.casa}</td>
                      <td className="py-1 pr-3 text-gray-500">{v.tipo}</td>
                      <td className="py-1 text-gray-500">{v.inclinacao}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Card>
    </section>
  )
}
