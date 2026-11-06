'use client'
// Página dos Relatórios de fechamento (Brasil 2026 e, desde 06/11/2026, EUA 2026),
// no padrão da página do AFOS Daily:
// mesmos dois temas (claro e azul Sapphire), mesma escolha de tema guardada, mesmo
// seletor de idioma e a pílula do Harvard Dataverse. O corpo é o HTML aprovado do
// relatório; a tela troca só as variáveis de cor dele por tema, e os gráficos
// acompanham porque desenham com essas mesmas variáveis.
import { useEffect, useState } from 'react'
import { InlineSubscribe } from './InlineSubscribe'

type Theme = 'light' | 'blue'
// Mesma chave do Daily: quem escolheu o azul lá abre o relatório no azul.
const THEME_KEY = 'afos-daily-theme'

type Loc = 'pt-BR' | 'en' | 'es'

type Slug = 'brazil-2026' | 'usa-2026'

const T: Record<Loc, { pdf: string; themeAria: string; lightAria: string; blueAria: string; home: string; dash: string }> = {
  'pt-BR': { pdf: 'Baixar PDF', themeAria: 'Tema da página', lightAria: 'Tema claro', blueAria: 'Tema azul', home: 'Página inicial da AFOS Analytics', dash: '← Acessar o Dashboard' },
  en: { pdf: 'Download PDF', themeAria: 'Page theme', lightAria: 'Light theme', blueAria: 'Blue theme', home: 'AFOS Analytics home page', dash: '← Access the Dashboard' },
  es: { pdf: 'Descargar PDF', themeAria: 'Tema de la página', lightAria: 'Tema claro', blueAria: 'Tema azul', home: 'Página de inicio de AFOS Analytics', dash: '← Acceder al Dashboard' },
}

// O que muda de um relatório para o outro: o rótulo do topo, a versão e o painel de volta.
const REL: Record<Slug, { dash: string; eyebrow: Record<Loc, string>; version: Record<Loc, string> }> = {
  'brazil-2026': {
    dash: 'br',
    eyebrow: { 'pt-BR': 'Relatório final · Eleição Brasil 2026', en: 'Final report · Brazil 2026 election', es: 'Informe final · Elección Brasil 2026' },
    version: { 'pt-BR': 'Versão 1.1 · corte 31/10/2026', en: 'Version 1.1 · cutoff Oct 31, 2026', es: 'Versión 1.1 · corte 31/10/2026' },
  },
  'usa-2026': {
    dash: 'us',
    eyebrow: { 'pt-BR': 'Relatório final · Eleições EUA 2026', en: 'Final report · US 2026 midterms', es: 'Informe final · Elecciones EE. UU. 2026' },
    version: { 'pt-BR': 'Versão 1.0 · 06/11/2026', en: 'Version 1.0 · Nov 6, 2026', es: 'Versión 1.0 · 06/11/2026' },
  },
}

const LANG_LABEL: Record<Loc, string> = { 'pt-BR': 'PT', en: 'EN', es: 'ES' }

// CSS da tela, escopado em .rel-doc. As regras espelham o <style> de impressão do
// relatório (que fica fora da página), sem as quebras de página e sem a capa A4.
const CSS = `
.rel-doc{--tinta:#17212b;--suave:#5c6672;--grade:#e4e7eb;--zero:#9aa3ad;--lula:#b8322a;--flavio:#1f4e9e;--faixa:rgba(31,78,158,.09);--neutro:#5c6f7e;--fio:#d8dce1;--nota:#eef1f5;
  color:var(--tinta);font-family:var(--rel-sans),'Source Sans 3',Arial,sans-serif;font-size:16.5px;line-height:1.6;overflow-wrap:break-word}
[data-theme="blue"] .rel-doc{--tinta:#ffffff;--suave:#bfdbfe;--grade:rgba(191,219,254,.22);--zero:rgba(191,219,254,.5);--lula:#ff8f85;--flavio:#9cc3ff;--faixa:rgba(156,195,255,.16);--neutro:#cbd5e1;--fio:rgba(191,219,254,.25);--nota:rgba(7,30,80,.45)}
.rel-doc[data-rel="usa-2026"]{--dem:#1f4e9e;--camara:#4f8fd6;--rep:#b8322a;--faixa:rgba(184,50,42,.08)}
[data-theme="blue"] .rel-doc[data-rel="usa-2026"]{--dem:#9cc3ff;--camara:#e0ecff;--rep:#ff8f85;--faixa:rgba(255,143,133,.14)}
.rel-doc h1,.rel-doc h2,.rel-doc h3{font-family:var(--rel-serif),'Source Serif 4',Georgia,serif;text-wrap:balance;margin:0;color:var(--tinta)}
.rel-doc h1{font-size:clamp(30px,5vw,42px);line-height:1.12;font-weight:700}
.rel-doc h2{font-size:clamp(22px,3.2vw,26px);margin:0 0 10px;padding-top:6px;line-height:1.25}
.rel-doc h3{font-size:18px;margin:22px 0 6px}
.rel-doc p{margin:0 0 12px}
.rel-doc .eyebrow{font-size:12.5px;letter-spacing:.09em;text-transform:uppercase;color:var(--suave);font-weight:600}
.rel-doc .capa{display:flex;flex-direction:column;gap:28px;margin-bottom:12px}
.rel-doc .capa .sub{font-family:var(--rel-serif),'Source Serif 4',serif;font-size:19px;color:var(--suave);margin-top:12px}
.rel-doc .nums{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:16px 24px;border-top:2px solid var(--tinta);padding-top:14px}
.rel-doc .nums b{display:block;font-family:var(--rel-serif),'Source Serif 4',serif;font-size:28px;font-variant-numeric:tabular-nums;line-height:1.15}
.rel-doc .nums span{font-size:14px;color:var(--suave)}
.rel-doc .quebra{margin-top:40px}
.rel-doc .secao{border-top:2px solid var(--tinta);padding-top:10px;margin-top:36px}
.rel-doc .n{font-family:var(--rel-sans),'Source Sans 3';font-size:14px;color:var(--suave);font-weight:700;margin-right:8px}
.rel-doc figure{margin:14px 0 18px}
.rel-doc figcaption{font-size:14px;color:var(--suave);margin-top:6px}
.rel-doc .fig-t{font-weight:700;font-size:15px;margin-bottom:6px}
.rel-doc .g{width:100%;height:auto;display:block;max-width:100%}
.rel-doc .g .ei{font-size:10px;fill:var(--suave);font-variant-numeric:tabular-nums}
.rel-doc .g .an{font-size:10.5px;fill:var(--tinta);font-weight:600;font-variant-numeric:tabular-nums}
.rel-doc .g .lg{font-size:10.5px;fill:var(--tinta)}
.rel-doc table{border-collapse:collapse;width:100%;font-size:14.5px;margin:6px 0 16px;display:block;overflow-x:auto}
.rel-doc th{text-align:left;font-weight:600;color:var(--suave);border-bottom:1.5px solid var(--tinta);padding:5px 10px 5px 0}
.rel-doc td{border-bottom:1px solid var(--fio);padding:5px 10px 5px 0;vertical-align:top}
.rel-doc td.num,.rel-doc th.num{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}
.rel-doc .achados{counter-reset:a;margin:0;padding:0;list-style:none}
.rel-doc .achados li{counter-increment:a;position:relative;padding:0 0 12px 30px}
.rel-doc .achados li::before{content:counter(a);position:absolute;left:0;top:0;font-weight:700;font-family:var(--rel-serif),'Source Serif 4',serif;color:var(--suave)}
.rel-doc .nota{background:var(--nota);padding:14px 16px;font-size:15px;margin:14px 0;border-radius:6px}
.rel-doc .fontes{font-size:14px;color:var(--suave)}
.rel-doc .fontes li{margin-bottom:4px}
.rel-doc ol,.rel-doc ul{padding-left:22px}
.rel-doc a{color:var(--flavio);text-decoration:underline;text-underline-offset:2px}
.rel-doc .rod{font-size:13px;color:var(--suave)}
/* O logo do PDF repete a marca que a página já mostra no topo: na tela ele sai. */
.rel-doc .capa div[style*="gap:14px"]{display:none!important}
`

function ThemeToggle({ theme, onChoose, labels }: { theme: Theme; onChoose: (t: Theme) => void; labels: { group: string; light: string; blue: string } }) {
  const isBlue = theme === 'blue'
  const baseStyle = 'w-6 h-6 rounded border-2 transition-all'
  return (
    <div className={`absolute top-3 right-3 md:top-5 md:right-5 flex items-center gap-2 p-1.5 rounded-lg ${isBlue ? 'bg-blue-900/40 border border-blue-400/30' : 'bg-white border border-gray-200'}`} role="radiogroup" aria-label={labels.group}>
      <button type="button" role="radio" aria-checked={theme === 'light'} aria-label={labels.light} onClick={() => onChoose('light')}
        className={`${baseStyle} bg-slate-50 ${theme === 'light' ? 'border-primary scale-110' : 'border-gray-300 hover:border-gray-400'}`} />
      <button type="button" role="radio" aria-checked={theme === 'blue'} aria-label={labels.blue} onClick={() => onChoose('blue')}
        className={`${baseStyle} bg-[#0a3d8f] ${theme === 'blue' ? 'border-white scale-110' : 'border-blue-700 hover:border-blue-500'}`} />
    </div>
  )
}

export function RelatorioFinalTemplate({ slug = 'brazil-2026', locale, corpo, pdf, harvardUrl, harvardDoi = '10.7910/DVN/2D0UK7', idiomas, fontClass }: {
  slug?: Slug
  harvardDoi?: string
  locale: Loc
  corpo: string
  pdf: string
  harvardUrl: string
  idiomas: Loc[]
  fontClass: string
}) {
  const t = T[locale]
  const rel = REL[slug]
  const [theme, setTheme] = useState<Theme>('light')
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(THEME_KEY)
      if (saved === 'blue' || saved === 'light') setTheme(saved)
    } catch { /* sem armazenamento: fica no claro */ }
  }, [])
  function chooseTheme(next: Theme) {
    setTheme(next)
    try { window.localStorage.setItem(THEME_KEY, next) } catch { /* idem */ }
  }

  const isBlue = theme === 'blue'
  const pageBg = isBlue ? 'bg-[#0a3d8f]' : 'bg-slate-50'
  const wordmarkColor = isBlue ? 'text-white' : 'text-primary'
  const eyebrowColor = isBlue ? 'text-blue-200' : 'text-primary'
  const subColor = isBlue ? 'text-blue-100' : 'text-gray-600'
  const ctaBg = isBlue ? 'bg-white text-primary hover:bg-blue-50' : 'bg-primary text-white hover:bg-primary/90'
  const harvardPill = isBlue
    ? 'bg-white/15 text-white hover:bg-white/25 border-white/20'
    : 'bg-primary/10 text-primary hover:bg-primary/20 border-primary/15'
  const linkBase = isBlue ? 'text-blue-200 hover:text-white' : 'text-gray-500 hover:text-primary'
  const activeBase = isBlue ? 'text-white font-bold' : 'text-primary font-bold'

  return (
    <div data-theme={theme} className={`min-h-screen ${pageBg} transition-colors ${fontClass}`}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <article className="max-w-[860px] mx-auto px-4 sm:px-5 md:px-10 py-12 md:py-14 relative">
        <ThemeToggle theme={theme} onChoose={chooseTheme} labels={{ group: t.themeAria, light: t.lightAria, blue: t.blueAria }} />

        <nav className="mb-10 text-sm flex flex-wrap items-center justify-between gap-3 pr-20">
          <a href={`/${locale}/dashboard/${rel.dash}`} className={`inline-flex items-center rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${ctaBg}`}>Dashboard</a>
          <div className="flex items-center gap-2 text-xs">
            {idiomas.map((loc, i) => (
              <span key={loc} className="flex items-center gap-2">
                {i > 0 && <span className={isBlue ? 'text-blue-400/50' : 'text-gray-300'}>·</span>}
                <a href={`/${loc}/report/${slug}`} hrefLang={loc} className={loc === locale ? activeBase : linkBase}>{LANG_LABEL[loc]}</a>
              </span>
            ))}
          </div>
        </nav>

        <div className="flex justify-center mb-6">
          <a href={`/${locale}`} aria-label={t.home} className="hover:opacity-90 transition-opacity">
            <span className={`text-3xl md:text-4xl font-extrabold tracking-tight ${wordmarkColor}`}>AFOS Analytics</span>
          </a>
        </div>
        <p className={`text-center text-xs font-extrabold uppercase tracking-[0.25em] mb-2 ${eyebrowColor}`}>{rel.eyebrow[locale]}</p>
        <p className={`text-center text-sm font-medium mb-5 ${subColor}`}>{rel.version[locale]}</p>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <a href={pdf} download className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${ctaBg}`}>
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M12 3v12m0 0l-5-5m5 5l5-5M4 20h16" /></svg>
            {t.pdf}
          </a>
          <a href={harvardUrl} target="_blank" rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border transition-colors ${harvardPill}`}>
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="currentColor" aria-hidden="true">
              <path d="M4 10 H7 V17 H4 Z M10 10 H13 V17 H10 Z M16 10 H19 V17 H16 Z M2 19 H21 V22 H2 Z M11.5 1 L2 6 V8 H21 V6 Z" />
            </svg>
            Harvard Dataverse · DOI {harvardDoi}
          </a>
        </div>

        <div className="rel-doc" data-rel={slug} dangerouslySetInnerHTML={{ __html: corpo }} />

        <InlineSubscribe locale={locale} isBlue={isBlue} product="relatorio" />

        <div className="mt-12 text-center">
          <a href={`/${locale}/dashboard/${rel.dash}`} className={`inline-block px-8 py-3 rounded-xl font-semibold transition-colors text-sm ${ctaBg}`}>
            {t.dash}
          </a>
        </div>
      </article>
    </div>
  )
}
