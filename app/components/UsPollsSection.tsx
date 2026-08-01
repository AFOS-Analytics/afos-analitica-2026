'use client'

import { useState } from 'react'
import { useTranslation } from '../i18n/context'
import { SectionTitle, Card } from './ui'
import type { UsPollsData } from '../../lib/dashboard/us-static-data'

/**
 * Generic ballot dos EUA no painel.
 *
 * ⚠️ REGRA QUE GOVERNA ESTA SEÇÃO, e ela é de desenho, não de estilo: o mercado
 * dá PROBABILIDADE de um partido controlar a Câmara e a pesquisa dá VANTAGEM EM
 * PONTOS de voto. São grandezas diferentes e subtrair uma da outra produz número
 * sem significado. Em 2012 os democratas tiveram mais votos e menos cadeiras: a
 * diferença pode ser inteiramente geografia.
 *
 * Consequências no componente:
 *  1. Esta seção NÃO exibe nenhum número de mercado, e não calcula divergência.
 *  2. Ela fica EMPILHADA abaixo da de mercado, nunca ao lado. "Lado a lado" era o
 *     conceito de não subtrair; na tela, dois números grandes na mesma linha
 *     fazem o olho subtrair sozinho mesmo com o aviso escrito.
 *  3. A ressalva vem ANTES do número, porque é o instante em que o leitor vê o
 *     segundo número do painel.
 *
 * A média é da casa: aritmética simples, sem ponderação e sem exclusão de
 * instituto. Os agregadores americanos (Decision Desk HQ, RCP, FiftyPlusOne,
 * Silver Bulletin, VoteHub) NÃO entram: aquilo é modelo de terceiro.
 */

const T = {
  'pt-BR': {
    titulo: 'Pesquisas: voto para a Câmara',
    ressalvaTitulo: 'Antes do número, a ressalva',
    ressalva:
      'O mercado precifica a PROBABILIDADE de um partido controlar a Câmara. A pesquisa mede a VANTAGEM EM PONTOS de voto. São grandezas diferentes, e este painel não subtrai uma da outra: o resultado não teria significado. Em 2012 os democratas tiveram mais votos e menos cadeiras, porque a diferença pode ser inteiramente geografia. O que se cruza aqui é DIREÇÃO e MOVIMENTO, nunca nível.',
    mediaTitulo: 'Média AFOS · intenção de voto para a Câmara',
    janela: (d: number, desde: string) => `últimos ${d} dias, desde ${desde}`,
    base: (p: number, i: number) => `${p} pesquisas de ${i} institutos`,
    vantagem: 'Vantagem democrata',
    deQueE: 'Estes dois números são a intenção de voto nacional para a CÂMARA. A pergunta feita ao eleitor é em quem ele votaria para o Congresso no distrito dele, e a resposta é lida como voto nacional para a Câmara. Não é Senado, e não é a soma dos dois.',
    semSenado: 'Não existe equivalente para o Senado. Cada assento é disputado estado a estado e pesquisado assim, então uma média nacional de Senado seria invenção. Por isso o mercado aqui mostra Câmara e Senado, e as pesquisas mostram só a Câmara.',
    metodoTitulo: 'Como esta média é calculada',
    recentes: 'Pesquisas mais recentes',
    colInstituto: 'Instituto',
    colCampo: 'Campo',
    colAmostra: 'Amostra',
    colMargem: 'Margem',
    colDem: 'Dem',
    colRep: 'Rep',
    colVantagem: 'Vant.',
    colFonte: 'Fonte',
    verFonte: 'abrir',
    procedenciaTitulo: 'Procedência e limitações',
    semDado: 'Dado de pesquisa indisponível nesta captura.',
    atualizado: (d: string) => `Índice lido em ${d}`,
    total: (n: number, desc: number) =>
      `${n} pesquisas no arquivo${desc > 0 ? `, ${desc} linha(s) descartada(s) na leitura da origem` : ''}`,
    tipos: 'LV = provável votante · RV = eleitor registrado · A = adultos',
  },
  en: {
    titulo: 'Polling: House vote',
    ressalvaTitulo: 'The caveat comes before the number',
    ressalva:
      'The market prices the PROBABILITY of a party controlling the House. Polling measures a VOTE MARGIN in points. These are different quantities, and this panel does not subtract one from the other: the result would have no meaning. In 2012 Democrats won more votes and fewer seats, because the gap can be entirely geography. What is cross-read here is DIRECTION and MOVEMENT, never level.',
    mediaTitulo: 'AFOS average · House vote intention',
    janela: (d: number, desde: string) => `last ${d} days, since ${desde}`,
    base: (p: number, i: number) => `${p} polls from ${i} institutes`,
    vantagem: 'Democratic margin',
    deQueE: 'These two numbers are the national vote intention for the HOUSE. Voters are asked whom they would back for Congress in their own district, and the answer is read as the national House vote. It is not the Senate, and it is not the two added together.',
    semSenado: 'There is no equivalent for the Senate. Each seat is contested state by state and polled that way, so a national Senate average would be an invention. That is why the market here shows House and Senate, while the polls show only the House.',
    metodoTitulo: 'How this average is calculated',
    recentes: 'Most recent polls',
    colInstituto: 'Institute',
    colCampo: 'Fieldwork',
    colAmostra: 'Sample',
    colMargem: 'MoE',
    colDem: 'Dem',
    colRep: 'Rep',
    colVantagem: 'Margin',
    colFonte: 'Source',
    verFonte: 'open',
    procedenciaTitulo: 'Provenance and limitations',
    semDado: 'Polling data unavailable in this capture.',
    atualizado: (d: string) => `Index read on ${d}`,
    total: (n: number, desc: number) =>
      `${n} polls on file${desc > 0 ? `, ${desc} row(s) discarded while reading the source` : ''}`,
    tipos: 'LV = likely voter · RV = registered voter · A = adults',
  },
  es: {
    titulo: 'Encuestas: voto para la Cámara',
    ressalvaTitulo: 'Antes del número, la salvedad',
    ressalva:
      'El mercado descuenta la PROBABILIDAD de que un partido controle la Cámara. La encuesta mide una VENTAJA EN PUNTOS de voto. Son magnitudes distintas, y este panel no resta una de la otra: el resultado no tendría significado. En 2012 los demócratas tuvieron más votos y menos escaños, porque la diferencia puede ser enteramente geografía. Lo que se cruza aquí es DIRECCIÓN y MOVIMIENTO, nunca nivel.',
    mediaTitulo: 'Promedio AFOS · intención de voto para la Cámara',
    janela: (d: number, desde: string) => `últimos ${d} días, desde ${desde}`,
    base: (p: number, i: number) => `${p} encuestas de ${i} institutos`,
    vantagem: 'Ventaja demócrata',
    deQueE: 'Estos dos números son la intención de voto nacional para la CÁMARA. Se le pregunta al votante a quién apoyaría para el Congreso en su propio distrito, y la respuesta se lee como voto nacional para la Cámara. No es el Senado, y no es la suma de los dos.',
    semSenado: 'No existe equivalente para el Senado. Cada escaño se disputa estado por estado y se encuesta así, de modo que un promedio nacional de Senado sería una invención. Por eso el mercado aquí muestra Cámara y Senado, mientras que las encuestas muestran solo la Cámara.',
    metodoTitulo: 'Cómo se calcula este promedio',
    recentes: 'Encuestas más recientes',
    colInstituto: 'Instituto',
    colCampo: 'Campo',
    colAmostra: 'Muestra',
    colMargem: 'Margen',
    colDem: 'Dem',
    colRep: 'Rep',
    colVantagem: 'Vent.',
    colFonte: 'Fuente',
    verFonte: 'abrir',
    procedenciaTitulo: 'Procedencia y limitaciones',
    semDado: 'Dato de encuesta no disponible en esta captura.',
    atualizado: (d: string) => `Índice leído el ${d}`,
    total: (n: number, desc: number) =>
      `${n} encuestas en el archivo${desc > 0 ? `, ${desc} línea(s) descartada(s) en la lectura del origen` : ''}`,
    tipos: 'LV = votante probable · RV = elector registrado · A = adultos',
  },
}

/** Separador decimal por idioma: en usa ponto, pt-BR e es usam vírgula. */
function fmt(n: number | null | undefined, locale: string, casas = 1): string {
  if (n === null || n === undefined) return '—'
  const s = n.toFixed(casas)
  return locale === 'en' ? s : s.replace('.', ',')
}

function fmtData(iso: string | null, locale: string): string {
  if (!iso) return '—'
  const [a, m, d] = iso.split('-')
  return locale === 'en' ? `${m}/${d}` : `${d}/${m}`
}

export function UsPollsSection({ data }: { data: UsPollsData | null }) {
  const { locale } = useTranslation()
  const k = (locale === 'en' || locale === 'es' ? locale : 'pt-BR') as keyof typeof T
  const t = T[k]
  const [verTodas, setVerTodas] = useState(false)

  if (!data || !Array.isArray(data.polls) || data.polls.length === 0) {
    return (
      <section>
        <SectionTitle>{t.titulo}</SectionTitle>
        <Card>
          <p className="text-sm text-gray-600">{t.semDado}</p>
        </Card>
      </section>
    )
  }

  const m = data.mediaAfos
  const mostradas = verTodas ? data.polls.slice(0, 60) : data.polls.slice(0, 12)

  return (
    <section>
      <SectionTitle>{t.titulo}</SectionTitle>

      {/* A ressalva vem ANTES do número, de propósito. */}
      <div className="mb-4 rounded-xl border-l-4 border-amber-400 bg-amber-50 p-4">
        <p className="text-[11px] font-bold uppercase tracking-wider text-amber-800 mb-1">
          {t.ressalvaTitulo}
        </p>
        <p className="text-sm leading-snug text-amber-900">{t.ressalva}</p>
      </div>

      {m && (
        <Card>
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
            <h3 className="text-sm font-bold text-dark">{t.mediaTitulo}</h3>
            <span className="text-xs text-gray-500">
              {t.janela(m.janelaDias, fmtData(m.desde, locale))} · {t.base(m.nPesquisas, m.nInstitutos)}
            </span>
          </div>

          {/* Empilhado, nunca lado a lado com número de mercado. */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="rounded-lg bg-blue-50 p-3">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-blue-700">
                {t.colDem}
              </div>
              <div className="text-2xl font-bold text-blue-800">{fmt(m.dem, locale, 2)}%</div>
            </div>
            <div className="rounded-lg bg-red-50 p-3">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-red-700">
                {t.colRep}
              </div>
              <div className="text-2xl font-bold text-red-800">{fmt(m.rep, locale, 2)}%</div>
            </div>
          </div>

          <p className="mt-3 text-sm text-dark">
            <strong>{t.vantagem}: D+{fmt(m.vantagemDem, locale, 2)}</strong>
          </p>

          {/* ⚠️ O André achou isto revisando em 31/Jul: o número estava certo e
              a etiqueta não dizia de que ele era. "Dem 47,90% x Rep 42,33%" de
              quê? Câmara, Senado, os dois somados? Sem esta linha, o leitor
              tinha de adivinhar. */}
          <p className="mt-3 rounded-lg bg-slate-50 p-3 text-xs leading-snug text-slate-700">
            {t.deQueE}
          </p>
          <p className="mt-2 text-xs leading-snug text-gray-600">{t.semSenado}</p>

          <details className="mt-3">
            <summary className="cursor-pointer text-xs font-semibold text-primary">
              {t.metodoTitulo}
            </summary>
            <p className="mt-2 text-xs leading-snug text-gray-700">{m.metodo}</p>
            <p className="mt-2 text-xs leading-snug text-gray-700">
              {data.procedencia.regra}
            </p>
            <p className="mt-2 text-xs leading-snug text-gray-700">
              {data.procedencia.agregadoresIgnorados.join(' · ')}: {data.procedencia.motivoIgnorar}.
            </p>
          </details>
        </Card>
      )}

      <Card className="mt-4">
        <h3 className="text-sm font-bold text-dark mb-3">{t.recentes}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-light-border text-left text-gray-500">
                <th className="py-2 pr-3 font-semibold">{t.colInstituto}</th>
                <th className="py-2 pr-3 font-semibold whitespace-nowrap">{t.colCampo}</th>
                <th className="py-2 pr-3 font-semibold text-right">{t.colAmostra}</th>
                <th className="py-2 pr-3 font-semibold text-right">{t.colMargem}</th>
                <th className="py-2 pr-3 font-semibold text-right">{t.colDem}</th>
                <th className="py-2 pr-3 font-semibold text-right">{t.colRep}</th>
                <th className="py-2 pr-3 font-semibold text-right">{t.colVantagem}</th>
                <th className="py-2 font-semibold">{t.colFonte}</th>
              </tr>
            </thead>
            <tbody>
              {mostradas.map((p, i) => (
                <tr key={`${p.instituto}-${p.campoFim}-${i}`} className="border-b border-light-border/60">
                  <td className="py-2 pr-3 text-dark">{p.instituto}</td>
                  <td className="py-2 pr-3 whitespace-nowrap text-gray-600">
                    {fmtData(p.campoInicio, locale)}–{fmtData(p.campoFim, locale)}
                  </td>
                  <td className="py-2 pr-3 text-right text-gray-600 whitespace-nowrap">
                    {p.amostra ? p.amostra.toLocaleString(locale === 'en' ? 'en-US' : 'pt-BR') : '—'}
                    {p.amostraTipo ? ` ${p.amostraTipo}` : ''}
                  </td>
                  <td className="py-2 pr-3 text-right text-gray-600">
                    {p.margemErro !== null ? `±${fmt(p.margemErro, locale)}` : '—'}
                  </td>
                  <td className="py-2 pr-3 text-right font-semibold text-blue-800">{fmt(p.dem, locale, 0)}</td>
                  <td className="py-2 pr-3 text-right font-semibold text-red-800">{fmt(p.rep, locale, 0)}</td>
                  <td className="py-2 pr-3 text-right text-dark">
                    {p.vantagemDem >= 0 ? 'D+' : 'R+'}
                    {fmt(Math.abs(p.vantagemDem), locale, 0)}
                  </td>
                  <td className="py-2">
                    {p.fontePrimaria ? (
                      <a
                        href={p.fontePrimaria}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline"
                      >
                        {t.verFonte}
                      </a>
                    ) : (
                      '—'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-[11px] text-gray-500">{t.tipos}</p>
          {data.polls.length > 12 && (
            <button
              type="button"
              onClick={() => setVerTodas((v) => !v)}
              className="text-xs font-semibold text-primary underline"
            >
              {verTodas ? '−' : '+'} {data.polls.length > 60 && !verTodas ? 60 : data.polls.length}
            </button>
          )}
        </div>
      </Card>

      <Card className="mt-4">
        <h3 className="text-sm font-bold text-dark mb-2">{t.procedenciaTitulo}</h3>
        <ul className="list-disc pl-5 space-y-1 text-xs leading-snug text-gray-700">
          {data.ressalvas.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
        <p className="mt-3 text-[11px] text-gray-500">
          {t.atualizado(fmtData(data.lastUpdate, locale))} ·{' '}
          {/* `descartadas` é o TOTAL dos dois portões, forma e valor. O `??`
              cobre registro do Neon gravado antes de 01/Ago/2026, que só tem o
              de forma: sem ele a linha ficaria vazia em vez de declarar algo. */}
          {t.total(data.qualidade.publicadas, data.qualidade.descartadas ?? data.qualidade.descartadasPorForma)} ·{' '}
          <a
            href={data.procedencia.indice}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            {data.procedencia.indice.replace('https://', '')}
          </a>{' '}
          ({data.procedencia.licencaIndice})
        </p>
      </Card>
    </section>
  )
}
