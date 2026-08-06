'use client'

import { useEffect, useState } from 'react'
import type { AfosWeeklyData } from '../../lib/afos-weekly/loader'
import { WeeklyMarkdown } from './WeeklyMarkdown'
import { InlineSubscribe } from './InlineSubscribe'

/**
 * Template do AFOS Weekly.
 *
 * ⚠️ AS SETE SEÇÕES SÃO FIXAS E ESTA É A ORDEM, aprovada pelo André em
 * 01/Ago/2026. O cruzamento é a ESPINHA, não um apêndice no fim:
 *
 *   1 TL;DR · 2 O mercado de previsão · 3 As pesquisas · 4 A cobertura
 *   5 O CRUZAMENTO · 6 Como ler o número · 7 Fontes
 *
 * 📌 Seção que não tem conteúdo NÃO É RENDERIZADA. Numa semana americana com
 * mercado de previsão parado, seção vazia é pior que seção inexistente: ela promete algo
 * que a semana não deu.
 *
 * 🔴 EXCEÇÃO, decidida pelo André em 03/Ago/2026: a SEÇÃO 4 sempre tem conteúdo.
 * Ela não depende de haver divergência, porque a coleta monitora 22 veículos e
 * sempre há o que contar. Até 03/Ago o campo `noDivergence` funcionava como
 * interruptor: quando ligado, o template trocava a seção inteira por um
 * parágrafo dizendo que não houve divergência conferível. Com matéria coletada
 * no banco, o leitor recebia uma desculpa. Agora `coverage.narrative` é
 * obrigatório e a divergência é bloco EXTRA, no modelo da Seção 3 do Daily.
 *
 * ⛔ ESTE TEMPLATE NÃO É O DO DAILY. As 8 seções do Daily foram desenhadas para
 * um dia com muita notícia e candidatos com trajetória. Do Daily herda-se o
 * MÉTODO (link por alegação, teto de palavras, data explícita, tom
 * observacional), não a forma.
 */

const T = {
  en: {
    tldr: 'TL;DR',
    subline: 'Real-time political pricing · Prediction market × polls × press · no smoothed averages',
    published: 'published thursday 07:00 BRT',
    money: 'What the prediction market did',
    polls: 'What the polls did',
    coverage: 'What the press reported',
    crossing: 'The crossing of the week',
    howToRead: 'How to read this number',
    sources: 'Sources',
    methodology: 'Method',
    issue: 'Issue',
    week: 'Week of',
    weekTo: 'to',
    high: 'Widest',
    low: 'Narrowest',
    amplitude: 'Spread between institutes',
    ourReading: 'Our measurement',
    signatureTitle: 'Global Political Risk Intelligence · GLOBAL BY DESIGN',
    navArchive: 'All editions',
    previewBanner: 'PREVIEW · draft edition, not published',
    themeAria: 'Colour theme',
    lightAria: 'Light theme',
    blueAria: 'Blue theme',
    servedInOrigin: 'This edition is not yet available in your language, so you are reading the English original.',
  },
  'pt-BR': {
    tldr: 'TL;DR',
    subline: 'Pricing político em tempo real · Mercado de previsão × pesquisas × imprensa · sem médias suavizadas',
    published: 'publicada quinta 07:00 BRT',
    money: 'O que o mercado de previsão fez',
    polls: 'O que as pesquisas fizeram',
    coverage: 'O que a imprensa contou',
    crossing: 'O cruzamento da semana',
    howToRead: 'Como ler este número',
    sources: 'Fontes',
    methodology: 'Método',
    issue: 'Edição',
    week: 'Semana de',
    weekTo: 'a',
    high: 'Maior',
    low: 'Menor',
    amplitude: 'Distância entre institutos',
    ourReading: 'A nossa medição',
    signatureTitle: 'Global Political Risk Intelligence · GLOBAL POR DESIGN',
    navArchive: 'Todas as edições',
    previewBanner: 'PREVIEW · edição em rascunho, não publicada',
    themeAria: 'Tema de cor',
    lightAria: 'Tema claro',
    blueAria: 'Tema azul',
    servedInOrigin: 'Esta edição ainda não tem versão no seu idioma, então você está lendo o original em inglês.',
  },
  es: {
    tldr: 'TL;DR',
    subline: 'Pricing político en tiempo real · Mercado de predicción × encuestas × prensa · sin promedios suavizados',
    published: 'publicada jueves 07:00 BRT',
    money: 'Lo que hizo el mercado de predicción',
    polls: 'Lo que hicieron las encuestas',
    coverage: 'Lo que informó la prensa',
    crossing: 'El cruce de la semana',
    howToRead: 'Cómo leer este número',
    sources: 'Fuentes',
    methodology: 'Método',
    issue: 'Edición',
    week: 'Semana del',
    weekTo: 'al',
    high: 'Mayor',
    low: 'Menor',
    amplitude: 'Distancia entre institutos',
    ourReading: 'Nuestra medición',
    signatureTitle: 'Global Political Risk Intelligence · GLOBAL POR DISEÑO',
    navArchive: 'Todas las ediciones',
    previewBanner: 'PREVIEW · edición en borrador, no publicada',
    themeAria: 'Tema de color',
    lightAria: 'Tema claro',
    blueAria: 'Tema azul',
    servedInOrigin: 'Esta edición aún no tiene versión en su idioma, así que está leyendo el original en inglés.',
  },
}

function seta(d?: string): string {
  return d === 'up' ? '↑' : d === 'down' ? '↓' : '→'
}

function corDelta(d?: string): string {
  // Sobre o azul do card, amarelo para movimento e azul claro para estável.
  return d === 'flat' ? 'text-blue-200' : 'text-yellow-300'
}


type Theme = 'light' | 'blue'
const THEME_KEY = 'afos-weekly-theme'

/**
 * Seletor de tema. Markup duplicado do Tradeoff de propósito, como o resto deste
 * template: o widget já existe em 8 arquivos da casa e cada superfície mantém o
 * seu, para que mexer numa não derrube as outras.
 */
function ThemeToggle({ theme, onChoose, labels }: { theme: Theme; onChoose: (t: Theme) => void; labels: { group: string; light: string; blue: string } }) {
  const isBlue = theme === 'blue'
  const baseStyle = 'w-6 h-6 rounded border-2 transition-all'
  return (
    <div
      className={`absolute right-3 top-3 flex items-center gap-2 rounded-lg p-1.5 md:right-5 md:top-5 ${isBlue ? 'border border-blue-400/30 bg-blue-900/40' : 'border border-gray-200 bg-white'}`}
      role="radiogroup"
      aria-label={labels.group}
    >
      <button
        type="button"
        role="radio"
        aria-checked={theme === 'light'}
        aria-label={labels.light}
        onClick={() => onChoose('light')}
        className={`${baseStyle} bg-slate-50 ${theme === 'light' ? 'scale-110 border-primary' : 'border-gray-300 hover:border-gray-400'}`}
      />
      <button
        type="button"
        role="radio"
        aria-checked={theme === 'blue'}
        aria-label={labels.blue}
        onClick={() => onChoose('blue')}
        className={`${baseStyle} bg-[#0a3d8f] ${theme === 'blue' ? 'scale-110 border-white' : 'border-blue-700 hover:border-blue-500'}`}
      />
    </div>
  )
}

/**
 * Masthead espelhado do Tradeoff, por pedido do André em 03/Ago/2026: mesma
 * estrutura (eyebrow, assinatura, subline em 3 linhas, pílula do Harvard, linha
 * de meta com bandeira), trocando o nome do produto.
 *
 * ⚠️ Markup DUPLICADO de propósito, não importado do `AfosTradeoffTemplate`.
 * A regra de módulo isolado deste produto vale também para a camada visual: o
 * Tradeoff está no ar em dois países e não pode passar a depender de um produto
 * em piloto. O custo é manter dois mastheads parecidos; o risco evitado é
 * derrubar o Tradeoff ao mexer no Weekly.
 */
const PAIS_EYEBROW: Record<string, string> = {
  us: 'AFOS Weekly · USA-2026 midterms Political Risk Weekly',
}

const PAIS_ROTULO: Record<string, Record<string, string>> = {
  us: { 'pt-BR': 'Estados Unidos', en: 'United States', es: 'Estados Unidos' },
}

/**
 * 🏛️ Aponta para a COLEÇÃO do AFOS, não para um DOI específico.
 *
 * A pílula nasceu copiada do Tradeoff com o DOI `10.7910/DVN/2D0UK7`, que é o do
 * dataset do BRASIL. Um produto sobre as midterms americanas exibindo a base
 * brasileira como lastro acadêmico é o tipo de detalhe que derruba a confiança
 * de quem for conferir. O dataset das midterms ainda não foi depositado, e o
 * rótulo diz "collection" sem prometer prazo: escrever "em breve" seria assumir
 * uma data que ninguém assumiu.
 *
 * 📌 QUANDO O DOI DAS MIDTERMS EXISTIR, ele substitui esta constante e o rótulo
 * passa a exibi-lo, como o do Brasil já faz no Tradeoff.
 */
const HARVARD_COLECAO_URL = 'https://dataverse.harvard.edu/dataverse/afos-analytics'

export function AfosWeeklyTemplate({ data, locale, country = 'us' }: { data: AfosWeeklyData; locale: string; country?: string }) {
  const k = (locale === 'pt-BR' || locale === 'es' ? locale : 'en') as keyof typeof T
  const t = T[k]
  const caiuParaOrigem = data.servedLocale !== locale
  // ⚠️ O separador do intervalo vem do bloco T. Ele estava cravado como ' a ',
  // que é português, e na página EM INGLÊS saía "Week of 2026-07-30 a 2026-08-06".
  // Defeito de idioma que nenhum gate numérico pega, porque não é número.
  const semanaIntervalo = data.weekStart && data.weekEnd ? `${data.weekStart} ${t.weekTo} ${data.weekEnd}` : data.updatedAt

  const [theme, setTheme] = useState<Theme>('light')
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem(THEME_KEY) : null
    if (saved === 'blue' || saved === 'light') setTheme(saved)
  }, [])
  function chooseTheme(next: Theme) {
    setTheme(next)
    if (typeof window !== 'undefined') window.localStorage.setItem(THEME_KEY, next)
  }

  const isBlue = theme === 'blue'
  // Paleta única do arquivo. Toda cor da página sai daqui, senão o tema azul
  // fica pela metade e aparece card claro sobre fundo escuro.
  const pageBg = isBlue ? 'bg-[#0a3d8f]' : 'bg-white'
  const ctaBg = isBlue ? 'bg-white text-primary hover:bg-blue-50' : 'bg-primary text-white hover:opacity-90'
  const titulo = isBlue ? 'text-white' : 'text-dark'
  const corpo = isBlue ? 'text-blue-50' : 'text-gray-700'
  const secundario = isBlue ? 'text-blue-100' : 'text-gray-600'
  const rotulo = isBlue ? 'text-blue-200' : 'text-gray-500'
  const acento = isBlue ? 'text-blue-200' : 'text-primary'
  const borda = isBlue ? 'border-blue-400/30' : 'border-light-border'
  const superficie = isBlue ? 'bg-blue-950/40' : 'bg-white'
  const superficieAlt = isBlue ? 'bg-blue-950/40' : 'bg-light-bg'
  const harvardPill = isBlue
    ? 'bg-white/15 text-white hover:bg-white/25 border-white/20'
    : 'bg-primary/10 text-primary hover:bg-primary/20 border-primary/15'
  const isDraft = data.status !== 'published'

  return (
    <div data-theme={theme} className={`min-h-screen ${pageBg} transition-colors`}>
      {isDraft && (
        <div className="border-y border-amber-400 bg-[#fef3c7] px-4 py-2.5 text-center text-xs font-semibold tracking-wide text-amber-900">
          {t.previewBanner}
        </div>
      )}

      <article className="relative mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        <ThemeToggle theme={theme} onChoose={chooseTheme} labels={{ group: t.themeAria, light: t.lightAria, blue: t.blueAria }} />

        <nav className="mb-7 flex flex-wrap items-center justify-between gap-3 pr-20 text-sm">
          <a href={`/${locale}/dashboard/${country}`} className={`inline-flex items-center rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${ctaBg}`}>
            Dashboard
          </a>
          <div className="flex items-center gap-2 text-xs font-semibold">
            {(['pt-BR', 'en', 'es'] as const).map((l, i) => (
              <span key={l} className="flex items-center gap-2">
                {i > 0 && <span className={isBlue ? 'text-blue-400/50' : 'text-gray-300'}>·</span>}
                <a
                  href={`/${l}/weekly/${country}/${data.date}`}
                  className={l === locale ? (isBlue ? 'font-bold text-white' : 'font-bold text-primary') : (isBlue ? 'text-blue-200 hover:text-white' : 'text-gray-500 hover:text-primary')}
                >
                  {l === 'pt-BR' ? 'PT' : l.toUpperCase()}
                </a>
              </span>
            ))}
          </div>
        </nav>

        {/* Masthead */}
        <header className={`mb-7 border-b-[3px] pb-6 text-center ${isBlue ? 'border-blue-300' : 'border-primary'}`}>
          <div className={`mb-3.5 text-[11px] font-extrabold uppercase tracking-[4px] ${isBlue ? 'text-blue-200' : 'text-primary'}`}>
            {PAIS_EYEBROW[country] ?? 'AFOS Weekly'}
          </div>
          <h1 className={`mb-3.5 text-[32px] font-extrabold leading-none tracking-tight md:text-[44px] ${isBlue ? 'text-white' : 'text-primary'}`}>
            <a href={`/${locale}`} className="transition-opacity hover:opacity-90">AFOS Analytics</a>
          </h1>
          <p className={`mx-auto mb-3.5 max-w-[540px] text-[15px] font-medium ${isBlue ? 'text-blue-100' : 'text-slate-600'}`}>
            {t.subline.split(' · ').map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
          </p>
          <div className="mb-3.5 flex justify-center">
            <a
              href={HARVARD_COLECAO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${harvardPill}`}
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" fill="currentColor" aria-hidden="true">
                <path d="M4 10 H7 V17 H4 Z M10 10 H13 V17 H10 Z M16 10 H19 V17 H16 Z M2 19 H21 V22 H2 Z M11.5 1 L2 6 V8 H21 V6 Z" />
              </svg>
              Harvard Dataverse · collection
            </a>
          </div>
          <div className={`flex flex-wrap items-center justify-center gap-2.5 text-xs uppercase tracking-wide ${isBlue ? 'text-blue-300/80' : 'text-slate-400'}`}>
            <span className="inline-flex items-center gap-1.5 font-semibold">
              <img
                src={`/flags/${country}.svg`}
                alt=""
                aria-hidden="true"
                width={20}
                height={14}
                className="inline-block h-[14px] w-[20px] rounded-[2px] object-cover align-[-2px] shadow-sm"
              />
              {PAIS_ROTULO[country]?.[k] ?? country.toUpperCase()}
            </span>
            <span>·</span>
            <span className="font-semibold">{t.issue} №{data.issueNumber}</span>
            <span>·</span>
            <span className="font-semibold">{t.week} {semanaIntervalo}</span>
            <span>·</span>
            {/* 🔴 QUINTA, não segunda. A cadência do Weekly é diferente da do
                Tradeoff, e copiar o rótulo do outro produto publicaria um horário
                falso. */}
            <span className="font-semibold">{t.published}</span>
          </div>
        </header>

        {/* ⛔ SEM título repetido e SEM linha de "Leitura de", retirados pelo André
            em 03/Ago/2026. O masthead acima já diz o produto, a edição e a semana,
            e o `title` do frontmatter continua servindo para a aba do navegador, o
            RSS e o compartilhamento. */}
        {/* 🔴 O leitor precisa saber que caiu para o idioma de origem. Servir
            inglês sem avisar seria tratar a falta de tradução como se fosse o
            desenho. Fica âmbar nos dois temas, porque é aviso, não conteúdo. */}
        {caiuParaOrigem && (
          <p className="mb-8 rounded-lg bg-amber-50 px-3 py-2 text-xs leading-snug text-amber-900">
            {t.servedInOrigin}
          </p>
        )}

        {/* 1. TL;DR */}
        {data.tldr.length > 0 && (
          <aside className={`mb-8 rounded-xl border-l-4 p-4 ${isBlue ? 'border-blue-300 bg-blue-900/40' : 'border-primary bg-primary/5'}`}>
            <p className={`mb-2 text-[11px] font-bold uppercase tracking-wider ${acento}`}>📌 {t.tldr}</p>
            <ul className="space-y-2">
              {data.tldr.map((b, i) => (
                <li key={i} className={`text-sm leading-snug ${isBlue ? 'text-blue-50' : 'text-dark'}`}>
                  <WeeklyMarkdown text={b} />
                </li>
              ))}
            </ul>
          </aside>
        )}

        {/* 2. O que o mercado de previsão fez */}
        {(data.moneyIntro || data.cards.length > 0) && (
          <section className="mb-8">
            <h2 className={`mb-3 text-lg font-bold ${titulo}`}>{t.money}</h2>
            {data.moneyIntro && (
              <p className={`mb-4 text-sm leading-relaxed ${corpo}`}>
                <WeeklyMarkdown text={data.moneyIntro} />
              </p>
            )}
            {/* Cards SEMPRE em Sapphire Blue com letra branca, iguais aos do
                Tradeoff (decisão de 24/Mai). Eles NÃO mudam com o tema: no tema
                azul ganham só uma borda clara para não sumirem no fundo. O delta
                vai em AMARELO, que destaca o movimento sem dizer se ele é bom. */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {data.cards.map((c) => (
                <div key={c.label} className={`rounded-lg border bg-primary p-4 ${isBlue ? 'border-blue-300/40' : 'border-primary'}`}>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-blue-200">{c.label}</p>
                  <p className="text-2xl font-bold leading-none text-white">
                    {c.headline}
                    {c.unit && <span className="text-base font-semibold">{c.unit}</span>}
                  </p>
                  {c.delta && (
                    <p className={`mt-1 text-xs font-semibold ${corDelta(c.deltaDirection)}`}>
                      {seta(c.deltaDirection)} {c.delta}
                    </p>
                  )}
                  {/* ⚠️ Passa pelo WeeklyMarkdown como todo campo de prosa deste
                      template. Antes saía como texto puro, então um `**USD 0,31M**`
                      escrito no arquivo aparecia com os asteriscos à vista no card.
                      Pego pelo André no preview de 06/Ago/2026. */}
                  {c.desc && (
                    <p className="mt-2 text-xs leading-snug text-blue-100">
                      <WeeklyMarkdown text={c.desc} />
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Preço publicado que não merece card próprio entra aqui, em pílula,
                abaixo da grade. Decisão do André em 06/Ago/2026: o contrato de
                calendário quase não se move e um quinto card quebrava a simetria
                da grade sem acrescentar leitura. A informação continua na página. */}
            {data.moneyFootnote && (
              <p className={`mt-3 rounded-lg px-3 py-2 text-xs leading-snug ${isBlue ? 'bg-blue-900/50 text-blue-50' : 'bg-primary/5 text-dark'}`}>
                <WeeklyMarkdown text={data.moneyFootnote} />
              </p>
            )}
          </section>
        )}

        {/* 3. O que as pesquisas fizeram */}
        {(data.pollsIntro || data.dispersion) && (
          <section className="mb-8">
            <h2 className={`mb-3 text-lg font-bold ${titulo}`}>{t.polls}</h2>
            {data.pollsIntro && (
              <p className={`mb-4 text-sm leading-relaxed ${corpo}`}>
                <WeeklyMarkdown text={data.pollsIntro} />
              </p>
            )}
            {data.dispersion && (
              <div className={`rounded-xl border p-4 ${borda} ${superficieAlt}`}>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <p className={`text-[11px] uppercase tracking-wider ${rotulo}`}>{t.high}</p>
                    <p className={`text-sm font-semibold ${titulo}`}>{data.dispersion.high}</p>
                  </div>
                  <div>
                    <p className={`text-[11px] uppercase tracking-wider ${rotulo}`}>{t.low}</p>
                    <p className={`text-sm font-semibold ${titulo}`}>{data.dispersion.low}</p>
                  </div>
                  <div>
                    <p className={`text-[11px] uppercase tracking-wider ${rotulo}`}>{t.amplitude}</p>
                    <p className={`text-sm font-semibold ${acento}`}>{data.dispersion.amplitude}</p>
                  </div>
                </div>
                {data.dispersion.note && (
                  <p className={`mt-3 border-t pt-3 text-xs leading-snug ${borda} ${secundario}`}>
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
            <h2 className={`mb-3 text-lg font-bold ${titulo}`}>{t.coverage}</h2>

            {/* A NARRATIVA SEMPRE APARECE. Não existe mais o caminho em que a
                seção some porque não houve divergência: com 22 veículos
                monitorados, seção vazia nunca é resultado aceitável. */}
            <div className={`rounded-xl border p-4 ${borda} ${superficie}`}>
              <p className={`mb-3 text-sm font-semibold ${titulo}`}>{data.coverage.subject}</p>
              <div className="space-y-3">
                {data.coverage.narrative.map((p, i) => (
                  <p key={i} className={`text-sm leading-relaxed ${corpo}`}>
                    <WeeklyMarkdown text={p} />
                  </p>
                ))}
              </div>
            </div>

            {/* A divergência é o bloco EXTRA, e só entra quando existe afirmação
                conferível. Sem ela, nada é impresso: a narrativa acima já cumpriu
                a seção. */}
            {data.coverage.claims.length > 0 && (
              <div className={`mt-3 rounded-xl border p-4 ${borda} ${superficieAlt}`}>
                <ul className="mb-3 space-y-2">
                  {data.coverage.claims.map((c, i) => (
                    <li key={i} className={`border-l-2 pl-3 text-sm leading-snug ${borda} ${corpo}`}>
                      <span className={`font-semibold ${titulo}`}>{c.outlet}:</span>{' '}
                      {c.link ? (
                        <a href={c.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
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
                {data.coverage.measurement && (
                  <p className={`rounded-lg px-3 py-2 text-sm ${isBlue ? 'bg-blue-900/50 text-blue-50' : 'bg-primary/5 text-dark'}`}>
                    <span className={`text-[11px] font-bold uppercase tracking-wider ${acento}`}>{t.ourReading}: </span>
                    <WeeklyMarkdown text={data.coverage.measurement} />
                  </p>
                )}
              </div>
            )}
          </section>
        )}

        {/* 5. O CRUZAMENTO, a espinha */}
        {data.crossings.length > 0 && (
          <section className="mb-8">
            <h2 className={`mb-3 text-lg font-bold ${titulo}`}>{t.crossing}</h2>
            <div className="space-y-3">
              {data.crossings.map((c, i) => (
                <blockquote key={i} className={`rounded-xl border-l-4 p-4 ${isBlue ? 'border-yellow-300 bg-blue-900/50' : 'border-amber-400 bg-amber-50'}`}>
                  <p className={`mb-1 text-sm font-bold ${isBlue ? 'text-yellow-200' : 'text-amber-900'}`}>{c.label}</p>
                  <p className={`text-sm leading-relaxed ${isBlue ? 'text-blue-50' : 'text-amber-900'}`}>
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
            <h2 className={`mb-3 text-lg font-bold ${titulo}`}>{t.howToRead}</h2>
            <div className={`rounded-xl border p-4 ${borda} ${superficie}`}>
              <p className={`mb-2 text-sm font-semibold ${titulo}`}>{data.howToRead.title}</p>
              <p className={`text-sm leading-relaxed ${corpo}`}>
                <WeeklyMarkdown text={data.howToRead.text} />
              </p>
            </div>
          </section>
        )}

        {/* 7. Fontes + método */}
        {data.sources.length > 0 && (
          <section className={`mb-8 border-t pt-6 ${borda}`}>
            <h2 className={`mb-3 text-lg font-bold ${titulo}`}>{t.sources}</h2>
            {data.sources.map((bloco) => (
              <div key={bloco.label} className="mb-4">
                <p className={`mb-1.5 text-[11px] font-semibold uppercase tracking-wider ${rotulo}`}>{bloco.label}</p>
                {/* DOIS FORMATOS, e a diferença não é estética.
                    Padrão: o endereço aparece VISÍVEL e clicável, igual ao Tradeoff,
                    porque assim dá para conferir a fonte sem clicar e sem perdê-la
                    ao imprimir ou copiar o texto.
                    `hideUrl`: a MANCHETE vira o link e endereço nenhum é impresso.
                    Existe por causa da imprensa dos EUA, cuja coleta guarda o link
                    do Google News, não o do veículo: aquele endereço tem 300
                    caracteres ilegíveis, e escrever "cnn.com" no lugar seria
                    anunciar um destino e mandar o leitor para outro. Não dizer
                    endereço nenhum é a única saída que não mente. */}
                <ul className="space-y-1.5">
                  {bloco.items.map((it) => (
                    <li key={it.link} className={`border-b py-1.5 text-xs leading-snug last:border-b-0 ${borda} ${corpo}`}>
                      <span className={`font-semibold ${titulo}`}>{it.source}</span>
                      {it.hideUrl ? (
                        <>
                          {it.description && (
                            <>
                              {' · '}
                              <a href={it.link} target="_blank" rel="noopener noreferrer" className={`hover:underline ${acento}`}>
                                {it.description}
                              </a>
                            </>
                          )}
                          {it.paywall && <span className={rotulo}> (paywall)</span>}
                        </>
                      ) : (
                        <>
                          {it.description && <span className={secundario}> · {it.description}</span>}
                          {it.paywall && <span className={rotulo}> (paywall)</span>}
                          {', '}
                          <a href={it.link} target="_blank" rel="noopener noreferrer" className={`break-all hover:underline ${acento}`}>
                            {it.link.replace(/^https?:\/\//, '')}
                          </a>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        {data.methodology && (
          <section className={`rounded-xl p-4 ${superficieAlt}`}>
            <p className={`mb-1.5 text-[11px] font-semibold uppercase tracking-wider ${rotulo}`}>{t.methodology}</p>
            <p className={`text-xs leading-relaxed ${secundario}`}>
              <WeeklyMarkdown text={data.methodology} />
            </p>
          </section>
        )}

        {/* Assinatura, igual à do Tradeoff.
            ⛔ SEM o bloco de aviso financeiro do Tradeoff, e isso é de propósito:
            aquele texto diz que o brief não é recomendação de investimento, porque
            o Tradeoff fala com mesa institucional. O Weekly é escrito para o
            eleitor comum, e carimbar aviso de investimento aqui daria ao leitor a
            impressão errada sobre o que ele está lendo. */}
        <div className={`mt-7 flex items-center gap-4 border-t pt-5 ${borda}`}>
          <div className={`flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl text-sm font-extrabold tracking-tight ${isBlue ? 'bg-white text-primary' : 'bg-primary text-white'}`}>
            AFOS
          </div>
          <div className="text-sm">
            <div className={`text-base font-bold ${isBlue ? 'text-white' : 'text-primary'}`}>AFOS Analytics</div>
            <div className={`text-xs italic ${secundario}`}>{t.signatureTitle}</div>
            <div className={`mt-1.5 text-xs ${secundario}`}>
              <a href="https://www.afos-analytics.com" className={isBlue ? 'hover:text-white' : 'hover:text-primary'}>www.afos-analytics.com</a>
              {' · '}
              <a href="mailto:contact@afos-analytics.com" className={isBlue ? 'hover:text-white' : 'hover:text-primary'}>contact@afos-analytics.com</a>
              {' · '}
              <a href="https://github.com/AFOS-Analytics" className={isBlue ? 'hover:text-white' : 'hover:text-primary'}>github.com/AFOS-Analytics</a>
            </div>
          </div>
        </div>

        <InlineSubscribe locale={k} isBlue={isBlue} product="weekly" />

        <nav className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm">
          <a href={`/${locale}/weekly/${country}`} className={`inline-flex items-center rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${ctaBg}`}>
            {t.navArchive}
          </a>
        </nav>
      </article>
    </div>
  )
}
