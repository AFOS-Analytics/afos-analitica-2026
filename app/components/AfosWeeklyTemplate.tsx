import type { AfosWeeklyData } from '../../lib/afos-weekly/loader'
import { WeeklyMarkdown } from './WeeklyMarkdown'

/**
 * Template do AFOS Weekly.
 *
 * ⚠️ AS SETE SEÇÕES SÃO FIXAS E ESTA É A ORDEM, aprovada pelo André em
 * 01/Ago/2026. O cruzamento é a ESPINHA, não um apêndice no fim:
 *
 *   1 TL;DR · 2 O dinheiro · 3 As pesquisas · 4 A cobertura
 *   5 O CRUZAMENTO · 6 Como ler o número · 7 Fontes
 *
 * 📌 Seção que não tem conteúdo NÃO É RENDERIZADA. Numa semana americana com
 * mercado parado, seção vazia é pior que seção inexistente: ela promete algo
 * que a semana não deu.
 *
 * ⛔ ESTE TEMPLATE NÃO É O DO DAILY. As 8 seções do Daily foram desenhadas para
 * um dia com muita notícia e candidatos com trajetória. Do Daily herda-se o
 * MÉTODO (link por alegação, teto de palavras, data explícita, tom
 * observacional), não a forma.
 */

const T = {
  en: {
    tldr: 'TL;DR',
    money: 'What the money did',
    polls: 'What the polls did',
    coverage: 'What the press reported',
    crossing: 'The crossing of the week',
    howToRead: 'How to read this number',
    sources: 'Sources',
    methodology: 'Method',
    issue: 'Issue',
    week: 'Week of',
    updated: 'Reading of',
    high: 'Widest',
    low: 'Narrowest',
    amplitude: 'Spread between institutes',
    noDivergence: 'No checkable divergence in this window. Outlets on the fixed list covered the race without contradicting each other on any claim this brief could verify against its own series. That is reported rather than replaced by a weaker comparison.',
    ourReading: 'Our measurement',
    servedInOrigin: 'This edition is not yet available in your language, so you are reading the English original.',
  },
  'pt-BR': {
    tldr: 'TL;DR',
    money: 'O que o dinheiro fez',
    polls: 'O que as pesquisas fizeram',
    coverage: 'O que a imprensa contou',
    crossing: 'O cruzamento da semana',
    howToRead: 'Como ler este número',
    sources: 'Fontes',
    methodology: 'Método',
    issue: 'Edição',
    week: 'Semana de',
    updated: 'Leitura de',
    high: 'Maior',
    low: 'Menor',
    amplitude: 'Distância entre institutos',
    noDivergence: 'Não houve divergência conferível nesta janela. Os veículos da lista fixa cobriram a disputa sem se contradizerem em nenhuma afirmação que este brief pudesse checar contra a própria série. Isso é relatado, em vez de substituído por uma comparação mais fraca.',
    ourReading: 'A nossa medição',
    servedInOrigin: 'Esta edição ainda não tem versão no seu idioma, então você está lendo o original em inglês.',
  },
  es: {
    tldr: 'TL;DR',
    money: 'Lo que hizo el dinero',
    polls: 'Lo que hicieron las encuestas',
    coverage: 'Lo que informó la prensa',
    crossing: 'El cruce de la semana',
    howToRead: 'Cómo leer este número',
    sources: 'Fuentes',
    methodology: 'Método',
    issue: 'Edición',
    week: 'Semana del',
    updated: 'Lectura del',
    high: 'Mayor',
    low: 'Menor',
    amplitude: 'Distancia entre institutos',
    noDivergence: 'No hubo divergencia verificable en esta ventana. Los medios de la lista fija cubrieron la contienda sin contradecirse en ninguna afirmación que este brief pudiera comprobar contra su propia serie. Eso se informa, en lugar de sustituirlo por una comparación más débil.',
    ourReading: 'Nuestra medición',
    servedInOrigin: 'Esta edición aún no tiene versión en su idioma, así que está leyendo el original en inglés.',
  },
}

function seta(d?: string): string {
  return d === 'up' ? '↑' : d === 'down' ? '↓' : '→'
}

function corDelta(d?: string): string {
  return d === 'up' ? 'text-emerald-700' : d === 'down' ? 'text-rose-700' : 'text-gray-500'
}

export function AfosWeeklyTemplate({ data, locale }: { data: AfosWeeklyData; locale: string }) {
  const k = (locale === 'pt-BR' || locale === 'es' ? locale : 'en') as keyof typeof T
  const t = T[k]
  const caiuParaOrigem = data.servedLocale !== locale

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      {/* Cabeçalho */}
      <header className="mb-8 border-b border-light-border pb-6">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
          AFOS Weekly · {t.issue} {data.issueNumber}
        </p>
        <h1 className="text-2xl font-bold leading-tight text-dark sm:text-3xl">{data.title}</h1>
        <p className="mt-3 text-xs text-gray-500">
          {data.weekStart && data.weekEnd && <>{t.week} {data.weekStart} — {data.weekEnd} · </>}
          {t.updated} {data.updatedAt}
        </p>
        {/* 🔴 O leitor precisa saber que caiu para o idioma de origem. Servir
            inglês sem avisar seria tratar a falta de tradução como se fosse o
            desenho. */}
        {caiuParaOrigem && (
          <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs leading-snug text-amber-900">
            {t.servedInOrigin}
          </p>
        )}
      </header>

      {/* 1. TL;DR */}
      {data.tldr.length > 0 && (
        <aside className="mb-8 rounded-xl border-l-4 border-primary bg-primary/5 p-4">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-primary">📌 {t.tldr}</p>
          <ul className="space-y-2">
            {data.tldr.map((b, i) => (
              <li key={i} className="text-sm leading-snug text-dark">
                <WeeklyMarkdown text={b} />
              </li>
            ))}
          </ul>
        </aside>
      )}

      {/* 2. O que o dinheiro fez */}
      {(data.moneyIntro || data.cards.length > 0) && (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-bold text-dark">{t.money}</h2>
          {data.moneyIntro && (
            <p className="mb-4 text-sm leading-relaxed text-gray-700">
              <WeeklyMarkdown text={data.moneyIntro} />
            </p>
          )}
          <div className="grid gap-3 sm:grid-cols-3">
            {data.cards.map((c) => (
              <div key={c.label} className="rounded-xl border border-light-border bg-white p-4">
                <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-gray-500">{c.label}</p>
                <p className="text-2xl font-bold leading-none text-dark">
                  {c.headline}
                  {c.unit && <span className="text-base font-semibold">{c.unit}</span>}
                </p>
                {c.delta && (
                  <p className={`mt-1 text-xs font-medium ${corDelta(c.deltaDirection)}`}>
                    {seta(c.deltaDirection)} {c.delta}
                  </p>
                )}
                {c.desc && <p className="mt-2 text-xs leading-snug text-gray-600">{c.desc}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. O que as pesquisas fizeram */}
      {(data.pollsIntro || data.dispersion) && (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-bold text-dark">{t.polls}</h2>
          {data.pollsIntro && (
            <p className="mb-4 text-sm leading-relaxed text-gray-700">
              <WeeklyMarkdown text={data.pollsIntro} />
            </p>
          )}
          {data.dispersion && (
            <div className="rounded-xl border border-light-border bg-light-bg p-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-gray-500">{t.high}</p>
                  <p className="text-sm font-semibold text-dark">{data.dispersion.high}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-gray-500">{t.low}</p>
                  <p className="text-sm font-semibold text-dark">{data.dispersion.low}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-gray-500">{t.amplitude}</p>
                  <p className="text-sm font-semibold text-primary">{data.dispersion.amplitude}</p>
                </div>
              </div>
              {data.dispersion.note && (
                <p className="mt-3 border-t border-light-border pt-3 text-xs leading-snug text-gray-600">
                  <WeeklyMarkdown text={data.dispersion.note} />
                </p>
              )}
            </div>
          )}
        </section>
      )}

      {/* 4. O que a imprensa contou */}
      {data.coverage && (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-bold text-dark">{t.coverage}</h2>
          {data.coverage.noDivergence ? (
            <div className="rounded-xl border border-light-border bg-light-bg p-4">
              <p className="text-sm leading-snug text-gray-700">{t.noDivergence}</p>
            </div>
          ) : (
            <div className="rounded-xl border border-light-border bg-white p-4">
              <p className="mb-3 text-sm font-semibold text-dark">{data.coverage.subject}</p>
              <ul className="mb-3 space-y-2">
                {data.coverage.claims.map((c, i) => (
                  <li key={i} className="border-l-2 border-light-border pl-3 text-sm leading-snug text-gray-700">
                    <span className="font-semibold text-dark">{c.outlet}:</span>{' '}
                    {c.link ? (
                      <a href={c.link} target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline">
                        {c.claim}
                      </a>
                    ) : (
                      c.claim
                    )}
                  </li>
                ))}
              </ul>
              {/* A medição da casa ao lado das afirmações. É ela que substitui o
                  rótulo de viés que este produto NÃO usa. */}
              <p className="rounded-lg bg-primary/5 px-3 py-2 text-sm text-dark">
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary">{t.ourReading}: </span>
                <WeeklyMarkdown text={data.coverage.measurement} />
              </p>
            </div>
          )}
        </section>
      )}

      {/* 5. O CRUZAMENTO — a espinha */}
      {data.crossings.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-bold text-dark">{t.crossing}</h2>
          <div className="space-y-3">
            {data.crossings.map((c, i) => (
              <blockquote key={i} className="rounded-xl border-l-4 border-amber-400 bg-amber-50 p-4">
                <p className="mb-1 text-sm font-bold text-amber-900">{c.label}</p>
                <p className="text-sm leading-relaxed text-amber-900">
                  <WeeklyMarkdown text={c.text} />
                </p>
              </blockquote>
            ))}
          </div>
        </section>
      )}

      {/* 6. Como ler este número */}
      {data.howToRead && (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-bold text-dark">{t.howToRead}</h2>
          <div className="rounded-xl border border-light-border bg-white p-4">
            <p className="mb-2 text-sm font-semibold text-dark">{data.howToRead.title}</p>
            <p className="text-sm leading-relaxed text-gray-700">
              <WeeklyMarkdown text={data.howToRead.text} />
            </p>
          </div>
        </section>
      )}

      {/* 7. Fontes + método */}
      {data.sources.length > 0 && (
        <section className="mb-8 border-t border-light-border pt-6">
          <h2 className="mb-3 text-lg font-bold text-dark">{t.sources}</h2>
          {data.sources.map((bloco) => (
            <div key={bloco.label} className="mb-4">
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500">{bloco.label}</p>
              <ul className="space-y-1.5">
                {bloco.items.map((it) => (
                  <li key={it.link} className="text-xs leading-snug text-gray-700">
                    <a href={it.link} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
                      {it.source}
                    </a>
                    {it.description && <span className="text-gray-600"> · {it.description}</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {data.methodology && (
        <section className="rounded-xl bg-light-bg p-4">
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500">{t.methodology}</p>
          <p className="text-xs leading-relaxed text-gray-600">
            <WeeklyMarkdown text={data.methodology} />
          </p>
        </section>
      )}
    </article>
  )
}
