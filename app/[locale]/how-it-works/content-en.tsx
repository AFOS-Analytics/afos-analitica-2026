/* eslint-disable react/no-unescaped-entities */
import { Callout, Card, SectionIntro, NavFlag, SummaryFrame, TocCol, TocLink } from './components'
import { S } from './styles'

export function HowItWorksEn() {
  return (
    <>
      <p className="text-center text-sm font-extrabold text-primary uppercase tracking-[0.25em] mb-3">The Method</p>
      <h1 className="text-3xl md:text-4xl font-extrabold text-primary text-center mb-2 tracking-tight">How AFOS Analytics Works</h1>
      <p className="text-center text-gray-600 text-base font-medium mb-10">A didactic guide to navigating the platform</p>

      <nav className="bg-white border border-blue-100 rounded-xl p-6 my-8 shadow-sm" aria-label="Table of contents">
        <div className="text-xs font-bold text-primary uppercase tracking-wider mb-4">Table of Contents</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <TocCol heading="What AFOS is">
            <TocLink href="#introducao">Why AFOS exists</TocLink>
            <TocLink href="#metodo">How data is cross-referenced</TocLink>
            <TocLink href="#variacoes-pp">Understanding ↑↓pp variations</TocLink>
          </TocCol>
          <TocCol heading="Platform tour">
            <TocLink href="#header">1. Header</TocLink>
            <TocLink href="#afos-daily-card">2. AFOS Daily — Daily Synthesis</TocLink>
            <TocLink href="#cards-polymarket">3. 6 Polymarket Cards</TocLink>
            <TocLink href="#pesquisas">4. Electoral Polls</TocLink>
            <TocLink href="#criterios-institutos">└ Institute evaluation</TocLink>
            <TocLink href="#analise-criteriosa">5. In-Depth Analysis</TocLink>
            <TocLink href="#quadro-comparativo">6. Comparative Table</TocLink>
            <TocLink href="#perfil-candidatos">7. Candidate Profiles</TocLink>
            <TocLink href="#paises">8. Countries</TocLink>
            <TocLink href="#live-news">9. Live News 120'</TocLink>
            <TocLink href="#sentimento">10. Political Climate</TocLink>
            <TocLink href="#inss-lulinha">11. INSS & Incumbent's Family Case</TocLink>
            <TocLink href="#banco-master">12. Banco Master</TocLink>
            <TocLink href="#stf">13. Supreme Court Credibility</TocLink>
            <TocLink href="#footer">14. Footer</TocLink>
          </TocCol>
          <TocCol heading="Deep dive">
            <TocLink href="#bastidores">Behind the platform</TocLink>
            <TocLink href="#perfis-usuario">User profiles</TocLink>
            <TocLink href="#limitacoes">When AFOS isn't useful</TocLink>
            <TocLink href="#diferenciacao">Difference vs aggregators vs newspapers</TocLink>
            <TocLink href="#comece-aqui">Start here</TocLink>
          </TocCol>
        </div>
      </nav>

      <h2 id="introducao" className={S.h2}>Introduction — Why AFOS exists</h2>
      <p className={S.p}>Every day you open a newspaper and read "Poll X says candidate Y has 37%". In another, "32%". Which one to believe?</p>
      <p className={S.p}><strong className="text-primary">The problem:</strong> electoral polls measure <em>declared intent</em> — what a person <em>says</em> they will do. But intent changes, polls have bias, and in Brazil this has gone wrong several times (2018 and 2022 had major surprises).</p>
      <p className={S.p}><strong className="text-primary">AFOS's solution:</strong> instead of trusting ONE source, the platform cross-references <strong>three independent sources in real time</strong>:</p>

      <div className={S.tableWrap}>
        <table className={S.table}>
          <thead>
            <tr>
              <th className={S.th}>Source</th>
              <th className={S.th}>What it measures</th>
              <th className={S.th}>Why it matters</th>
            </tr>
          </thead>
          <tbody>
            <tr className={S.trRow}>
              <td className={S.tdTop}>🎯 <strong>Prediction market — bets</strong> (Polymarket)</td>
              <td className={S.tdTop}>Where real people bet real money on who will win</td>
              <td className={S.tdTop}>When someone risks US$ 10,000, they don't lie out of vanity</td>
            </tr>
            <tr className={S.trAlt}>
              <td className={S.tdTop}>📊 <strong>Polling institutes</strong> (17+ in Brazil — Datafolha, Quaest, AtlasIntel, Paraná Pesquisas, CNT/MDA, Veritá, and others)</td>
              <td className={S.tdTop}>Declared intent from sampled audiences</td>
              <td className={S.tdTop}>Captures traditional electorate sentiment</td>
            </tr>
            <tr>
              <td className={S.tdTop}>📰 <strong>Live news</strong> (400+ sources via Google News, major portals, agencies)</td>
              <td className={S.tdTop}>Current narrative</td>
              <td className={S.tdTop}>Explains <em>why</em> the numbers changed</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className={S.p}>When these three sources <strong>agree</strong>, the forecast is robust. When they <strong>diverge</strong>, it's a sign something is moving — and that's extremely valuable information.</p>

      <h2 id="metodo" className={S.h2}>How data is cross-referenced (the method)</h2>
      <p className={S.p}>AFOS doesn't do formal statistics (regression, Bayesian models). It does something different and more useful day-to-day: a <strong>structured narrative cross-reference with explicit rules</strong>.</p>

      <h3 className={S.h3}>Golden rule: convergence vs divergence</h3>
      <p className={S.p}>For each important question (e.g., "who wins the first round?"), the platform compares the values from the 3 sources:</p>
      <div className={S.tableWrap}>
        <table className={S.table}>
          <thead>
            <tr>
              <th className={S.th}>Situation</th>
              <th className={S.th}>Interpretation</th>
            </tr>
          </thead>
          <tbody>
            <tr className={S.trRow}><td className={S.td}>Polymarket × Poll difference ≤ 3pp</td><td className={S.td}><strong>Convergence</strong> — robust signal, consensus</td></tr>
            <tr className={S.trAlt}><td className={S.td}>Difference between 3-5pp</td><td className={S.td}>Neutral zone — mild tension</td></tr>
            <tr><td className={S.td}>Difference &gt; 5pp</td><td className={S.td}><strong>Divergence</strong> — something is changing, one source sees what the other doesn't</td></tr>
          </tbody>
        </table>
      </div>

      <h3 className={S.h3}>The gold is in divergence</h3>
      <p className={S.p}>When Polymarket and polls diverge, the reason is investigated:</p>
      <ul className={S.ul}>
        <li><strong>Poll above, market below</strong> → either the poll is outdated/biased, or the market knows something (imminent operation, leaking scandal)</li>
        <li><strong>Market above, poll below</strong> → either the market anticipates a turnaround, or it's speculation with low volume</li>
      </ul>

      <h3 className={S.h3}>Real example — the Candidate D surge and retreat</h3>
      <Callout title="Apr 18">
        <p>Candidate D (regional governor) jumped on Polymarket "3rd place" from 8.5% to 19.5% (↑11pp in 24h).</p>
        <ul>
          <li>Polls hadn't captured this yet</li>
          <li>News mentioned: "Candidate D may be Candidate B's running mate"</li>
          <li><strong>AFOS reading:</strong> the money saw before the polls did</li>
        </ul>
      </Callout>
      <Callout title="Apr 19">
        <p>Candidate D fell to 19% (↓0.5pp) and the presidential market retreated to 2.25% (↓0.85pp).</p>
        <ul>
          <li>Market deflated the bet</li>
          <li>The political move likely didn't materialize</li>
          <li>Those who bet too fast, lost</li>
        </ul>
      </Callout>
      <p className={S.p}>Those who read AFOS daily <strong>arrive at conclusions earlier</strong> — because they see the movement while it's happening, not after.</p>
      <SectionIntro>
        <strong>Validity note:</strong> the specific examples cited illustrate the <em>method</em>, not a definitive point. This document is revised as the platform evolves. The platform data is always live.
      </SectionIntro>

      <h2 id="variacoes-pp" className={S.h2}>Understanding ↑↓pp variations</h2>
      <p className={S.p}>"pp" = <strong>percentage point</strong>. It's the difference between two percentages. Different from "percent".</p>
      <p className={S.p}><strong>Example:</strong> Candidate A had 40%, today has 42%. They went up <strong>2 percentage points (2pp)</strong>. In relative terms, that's a 5% growth (2 on top of 40).</p>

      <h3 className={S.h3}>Why small variations matter</h3>
      <p className={S.pTight}><strong>1. Liquidity:</strong> the presidential Polymarket has US$ 54 million at stake. A 0.8pp change means roughly US$ 432 thousand was repriced. It's not opinion — it's real financial commitment.</p>
      <p className={S.pTight}><strong>2. Speed:</strong> 0.8pp in 1 day seems small. If the pace holds: 5.6pp per week; 24pp per month; complete reversal in 5 months. Small and persistent movement <strong>beats</strong> large and isolated movement.</p>
      <p className={S.p}><strong>3. Anticipation:</strong> when the market moves, it moves <strong>before</strong> the newspaper consensus. 48 hours later, you'll read analysts saying what the market already said.</p>

      <h3 className={S.h3}>Interpretation table</h3>
      <div className={S.tableWrap}>
        <table className={S.table}>
          <thead>
            <tr>
              <th className={S.th}>Variation</th>
              <th className={S.th}>What it means</th>
              <th className={S.th}>What to do</th>
            </tr>
          </thead>
          <tbody>
            <tr className={S.trRow}><td className={S.td}>±0.0 to ±0.3pp</td><td className={S.td}>Market noise</td><td className={S.td}>Ignore</td></tr>
            <tr className={S.trAlt}><td className={S.td}>±0.4 to ±1.0pp</td><td className={S.td}>Light movement, emerging direction</td><td className={S.td}>Check if it persists 2-3 days</td></tr>
            <tr className={S.trRow}><td className={S.td}>±1.0 to ±3.0pp</td><td className={S.td}>Significant movement</td><td className={S.td}>Investigate today's news</td></tr>
            <tr className={S.trAlt}><td className={S.td}>±3.0 to ±5.0pp</td><td className={S.td}>Jump — something big happened</td><td className={S.td}>Top priority</td></tr>
            <tr><td className={S.td}>±5.0pp+</td><td className={S.td}>Disruptive event</td><td className={S.td}>Re-read the whole scenario</td></tr>
          </tbody>
        </table>
      </div>
      <blockquote className={S.quote}>
        <strong>Mental rule in one sentence:</strong> "A 1pp move is a tweet. 3pp is an interview. 5pp+ is a done deal."
      </blockquote>

      <NavFlag title="Navigating the platform" description="From here, we'll walk through the platform in the order you encounter when you open the site." />

      <h2 id="header" className={S.h2}>1. Header (top of the page)</h2>
      <p className={S.p}>At the top of the screen you see the <strong>AFOS Analytics</strong> logo and three navigation buttons:</p>
      <div className={S.tableWrap}>
        <table className={S.table}>
          <thead><tr><th className={S.th}>Button</th><th className={S.th}>What it does</th></tr></thead>
          <tbody>
            <tr className={S.trRow}><td className={S.td}><strong>About</strong></td><td className={S.td}>Explains the project's mission, the problem it solves, and the method</td></tr>
            <tr className={S.trAlt}><td className={S.td}><strong>Goals</strong></td><td className={S.td}>Shows the platform's public goals (country coverage, source integration, roadmap)</td></tr>
            <tr><td className={S.td}><strong>Global</strong></td><td className={S.td}>Returns to the world map — useful when you're in the middle of an analysis and want to explore another country</td></tr>
          </tbody>
        </table>
      </div>
      <p className={S.p}>The header is present on all pages. It's the navigation anchor.</p>

      <h2 id="afos-daily-card" className={S.h2}>2. AFOS Daily — Daily Synthesis</h2>
      <p className={S.p}>Right below the header you see the <strong>AFOS Daily card</strong>: a light-blue block with today's date, an excerpt of the day's narrative synthesis (up to 2 lines) and a <strong>"Read synthesis →"</strong> button.</p>
      <p className={S.p}>It's the only piece of the dashboard that is <strong>not raw data</strong> — it's a curated narrative (~700 words, 4-minute read) cross-referencing the three signals (market, poll, news) with an inline link for every claim. Published once a day, at the end of the day.</p>

      <Card title="How AFOS Daily works">
        <p><strong>Fixed structure:</strong> 2-3 line lede with 3 key movements + 4 numbered sections (Prediction market, What institutes registered, What the press covered, Divergences of the day) + final synthesis in 3 bullets.</p>
        <p><strong>Editorial rules:</strong> every claim with an inline link to the source (minimum 1 link per substantive paragraph); zero partisan adjectives; observational tone ("the market priced", "the poll registered"); always explicit dates (never "yesterday"); ↑↓pp variations cited.</p>
        <p><strong>Permanent permalink:</strong> each day has its own URL (<code>/daily/2026-04-28</code>). Allows citing and linking a specific synthesis on social media, articles or reports.</p>
        <p><strong>History:</strong> inside the synthesis page, <strong>"← Previous synthesis"</strong> and <strong>"Next synthesis →"</strong> buttons navigate the archive days.</p>
        <p><strong>3 languages:</strong> PT-BR · EN · ES. Switching language preserves the date being read. Brazilian political terms without direct translation (TSE, STF, BolsoMaster, aging political class, etc.) stay in Portuguese with an inline link to the <a href="/en/glossary" className="text-primary hover:underline">glossary</a> that explains them in 3 languages.</p>
        <p><strong>Visual theme:</strong> toggle in the top-right corner switches between light theme (default) and Sapphire Blue (dark blue background with light text, ideal for evening reading).</p>
        <p><strong>Validation:</strong> the feature went through a 7-day public pilot (April 22-28, 2026) with a GO/NO-GO decision on the last day. Approved as a permanent feature.</p>
      </Card>

      <p className={S.p}><strong>When it's worth reading:</strong> when you want to understand <em>why</em> the dashboard numbers moved, not just <em>how much</em>. The dashboard shows the day's snapshot; AFOS Daily tells the story — with auditable sources for you to verify each step.</p>

      <h2 id="cards-polymarket" className={S.h2}>3. The 6 Polymarket Cards — Instant dashboard</h2>
      <p className={S.p}>Right after the header, <strong>six cards appear side by side</strong> summarizing Polymarket's most important markets at the moment. Each card shows a <strong>percentage</strong> (probability priced by the market) with the <strong>variation relative to the previous day</strong> (↑↓pp).</p>

      <Card title="🏆 Card 1 — Who wins the presidency in the 1st round">
        <p>Shows the probabilities of major candidates <strong>winning in the first round</strong> (&gt;50% of valid votes, avoiding a runoff).</p>
        <p><strong>Today's example (Apr 19):</strong> Candidate B 39.6% × Candidate A 39.5% → <em>technical tie</em>. Neither has a real chance of winning in the 1st round.</p>
        <p><strong>How to read:</strong> if a candidate passes 50%, the market believes in direct victory; below that, there will be a runoff.</p>
      </Card>
      <Card title="🥈 Card 2 — Who comes in 2nd place">
        <p>Shows the probability of <strong>each candidate being the runner-up</strong> (reaching the runoff in second position).</p>
        <p><strong>Today's example:</strong> Candidate B 66.5% (↑0.5pp) × Candidate A 17% (↑1pp) × Candidate C 6.7%.</p>
        <p><strong>How to read:</strong> this market <strong>consolidates the runoff scenario</strong>. If Candidate B leads with 66.5%, it means the money sees it as <em>nearly certain</em> that they're in the runoff, regardless of who they face.</p>
      </Card>
      <Card title="🥉 Card 3 — Who comes in 3rd place">
        <p>Shows favorites to finish in <strong>3rd position</strong> — meaning outside the runoff, but with decisive influence (they transfer votes).</p>
        <p><strong>Today's example:</strong> Candidate C 32% × Candidate D 19% × Candidate F 3.95%.</p>
        <p><strong>How to read:</strong> this is the <strong>third-way thermometer</strong>. When a name surges here (like Candidate D from 8.5% → 19.5% on Apr 18), the market is pricing in a relevant political move.</p>
      </Card>
      <Card title="⚖️ Card 4 — Supreme Court (Justice impeachment)">
        <p>Shows the probability of <strong>any Supreme Court justice being impeached before 2027</strong>.</p>
        <p><strong>Today's example:</strong> 11.5% (↓1.5pp, falling -4.5pp in 2 days).</p>
        <p><strong>How to read:</strong> this number is the <strong>institutional risk</strong> priced by the market. When it rises, there's real tension between Congress and the Court. When it falls, the market believes the system "will accommodate".</p>
      </Card>
      <Card title="🏛️ Card 5 — Senate (Party with most seats)">
        <p>Shows the probability of <strong>each party winning the majority of seats</strong> in the 2026 Senate election.</p>
        <p><strong>Today's example:</strong> PL 76.5% (↓3pp) × MDB 10.5% × PSD 5.1% × União 3.1% × PT 2.4%.</p>
        <p><strong>How to read:</strong> the Senate <strong>conditions the next government</strong>. A president without a Senate base governs poorly. When PL falls (↓3pp), the market prices a different scenario from 2022 — when the government had an adverse Senate.</p>
      </Card>
      <Card title="📈 Card 6 — Inflation 2026">
        <p>Shows the probability of <strong>which range Brazil's 2026 annual inflation will close in</strong>.</p>
        <p><strong>Today's example:</strong> 5.00-5.49% has 39.45% probability (↑2.75pp) × 4.50-4.99%: 33.75% × 4.00-4.49%: 9.45%.</p>
        <p><strong>How to read:</strong> this is the <strong>economic thermometer</strong>. High inflation pressures government, favors opposition. When the 5.00-5.49% band surges (↑2.75pp in 1 day), the market is saying "forget low inflation" — with direct electoral consequence.</p>
      </Card>

      <h2 id="pesquisas" className={S.h2}>4. Electoral Polls</h2>
      <p className={S.p}>Below the Polymarket cards, you find the electoral polls section.</p>

      <h3 className={S.h3}>How polls arrive here</h3>
      <p className={S.p}>All polls registered with Brazil's <strong>TSE (Superior Electoral Court)</strong> are downloaded automatically every day. The database holds <strong>more than 150 indexed polls</strong> and grows by about <strong>2 to 4 new polls registered per week</strong> — a pace that accelerates as the electoral cycle advances.</p>

      <h3 className={S.h3}>Monitored institutes</h3>
      <p className={S.p}>The platform tracks 17+ Brazilian institutes. The most frequent in the last month:</p>
      <div className={S.tableWrap}>
        <table className={S.table}>
          <thead><tr><th className={S.th}>Institute</th><th className={S.th}>Recent polls</th><th className={S.th}>Average sample</th></tr></thead>
          <tbody>
            <tr className={S.trRow}><td className={S.td}>Paraná Pesquisas</td><td className={S.td}>3</td><td className={S.td}>1,593 respondents</td></tr>
            <tr className={S.trAlt}><td className={S.td}>Datafolha</td><td className={S.td}>2</td><td className={S.td}>1,513</td></tr>
            <tr className={S.trRow}><td className={S.td}>100 Cidades</td><td className={S.td}>2</td><td className={S.td}>1,400</td></tr>
            <tr className={S.trAlt}><td className={S.td}>Instituto Piauiense</td><td className={S.td}>2</td><td className={S.td}>800</td></tr>
            <tr><td className={S.td}>Veritá</td><td className={S.td}>1</td><td className={S.td}>1,220</td></tr>
          </tbody>
        </table>
      </div>

      <h3 className={S.h3}>Knowing not only what polls say, but what they're about to say</h3>
      <p className={S.p}>Under Brazilian legislation, every institute is required to <strong>register each poll with the TSE before publishing it</strong>, with a unique protocol, field dates (when it's being administered), expected publication date, sample size, and cost. This registration is <strong>public</strong> and becomes available in the TSE's official database the moment the institute submits it.</p>
      <p className={S.p}><strong>This is where AFOS intelligence kicks in:</strong> the platform runs automatic ingestion cycles throughout the day querying the TSE directly. When a new poll is registered in the official database, within hours it's already processed, cross-referenced with Polymarket, and displayed on your screen — <strong>without depending on a journalist covering it or an official note from the institute</strong>.</p>

      <h3 className={S.h3}>What you see for each poll</h3>
      <ul className={S.ul}>
        <li><strong>Institute</strong> (e.g., Paraná Pesquisas, Datafolha, Quaest)</li>
        <li><strong>TSE protocol</strong> (unique, auditable identifier)</li>
        <li><strong>Field:</strong> dates when interviewers are collecting responses</li>
        <li><strong>Expected publication:</strong> when the institute will release results</li>
        <li><strong>Sample:</strong> number of respondents</li>
        <li><strong>Status:</strong> "published" (already out) or "active field" (still being administered)</li>
      </ul>

      <h3 className={S.h3}>Real example today (Apr 19)</h3>
      <blockquote className={S.quote}>
        Paraná Pesquisas — national — field <strong>Apr 21-23 (in progress)</strong> — expected publication <strong>Apr 24</strong> — sample 1,680
      </blockquote>
      <p className={S.p}>You know <strong>5 days in advance</strong> that on Thursday there will be a national Paraná Pesquisas poll with nearly 1,700 respondents.</p>
      <Callout title="Value for you">
        <p>Press and traditional analysts only discover a poll <strong>when the institute publicly releases it</strong> — which can be 5 to 10 days after registration. AFOS discovers it <strong>on the same day the registration enters the TSE</strong>, because its ingestion cycles operate automatically at intervals of a few hours. This changes the logic: you stop <strong>reacting to news</strong> and start <strong>anticipating it</strong>.</p>
      </Callout>

      <h3 id="criterios-institutos" className={S.h3Anchor}>Institute evaluation criteria</h3>
      <p className={S.p}>Beyond listing polls, AFOS displays a dashboard card called <strong>"Monitored Institutes — Reliability"</strong>, where each institute receives a 1-to-5-star rating. This rating serves as an <strong>editorial weighting ruler</strong> to help readers decide how much to trust each source when polls diverge.</p>
      <p className={S.p}><strong>Nature of the rating:</strong> it is a <em>qualitative editorial evaluation</em> — not an automatically calculated score. It reflects public consensus in the Brazilian electoral market (analysts, specialized journalists, methodological literature). It works as an honest first approximation; evolution toward a quantitative score is on the AFOS roadmap post-election cycle.</p>

      <h4 className={S.h4}>The 5 criteria considered</h4>
      <div className="overflow-x-auto my-4">
        <table className={S.table}>
          <thead>
            <tr>
              <th className={S.th}>Criterion</th>
              <th className={S.th}>What it measures</th>
            </tr>
          </thead>
          <tbody>
            <tr className={S.trRow}><td className={S.td}><strong>Accuracy track record</strong></td><td className={S.td}>How well the institute predicted past elections (within declared margins). E.g., MDA has a strong track record of hits in previous cycles.</td></tr>
            <tr className={S.trAlt}><td className={S.td}><strong>Collection methodology</strong></td><td className={S.td}>In-person (most representative), Online (digital bias), Phone (demographic bias), Mixed. Methodology appears in parentheses on the card: "(Presencial)", "(Online)", etc.</td></tr>
            <tr className={S.trRow}><td className={S.td}><strong>Tradition and time in market</strong></td><td className={S.td}>How many election cycles the institute has covered. Long tradition reduces the risk of systemic methodological error.</td></tr>
            <tr className={S.trAlt}><td className={S.td}><strong>Who commissions</strong></td><td className={S.td}>Indirect proxy of quality demand. Polls commissioned by banks, investors, or major outlets tend to have higher rigor (typical cost R$100k-300k).</td></tr>
            <tr><td className={S.td}><strong>Frequency and scope</strong></td><td className={S.td}>How many polls are published, how often, and whether it covers national, state, or only local scenarios.</td></tr>
          </tbody>
        </table>
      </div>

      <h4 className={S.h4}>Star scale and interpretation</h4>
      <div className="overflow-x-auto my-4">
        <table className={S.table}>
          <thead>
            <tr>
              <th className={S.th}>Level</th>
              <th className={S.th}>Meaning</th>
              <th className={S.th}>How to read polls from this institute</th>
            </tr>
          </thead>
          <tbody>
            <tr className={S.trRow}><td className={S.td}><strong>★★★★★</strong></td><td className={S.td}>National reference</td><td className={S.td}>Cite without reservation. Data is usually robust and auditable.</td></tr>
            <tr className={S.trAlt}><td className={S.td}><strong>★★★★</strong></td><td className={S.td}>High reliability</td><td className={S.td}>Solid data. Good for forming opinions, ideally with cross-comparison.</td></tr>
            <tr className={S.trRow}><td className={S.td}><strong>★★★</strong></td><td className={S.td}>Reliable</td><td className={S.td}>Use, but always compare with at least 1-2 other polls from the same period.</td></tr>
            <tr className={S.trAlt}><td className={S.td}><strong>★★</strong></td><td className={S.td}>Use with caution</td><td className={S.td}>Always cite with reservation. Inconsistent methodological track record or very recent institute.</td></tr>
            <tr><td className={S.td}><strong>★</strong></td><td className={S.td}>Low reliability</td><td className={S.td}>Avoid basing decisions on this source alone. No Brazilian institute is currently at this level.</td></tr>
          </tbody>
        </table>
      </div>

      <h4 className={S.h4}>Sources consulted for the classification</h4>
      <ul className={S.ul}>
        <li><strong>Official TSE electoral results</strong> — public comparison between predictions and ballot box results in previous cycles (2018, 2022)</li>
        <li><strong>Brazilian methodological literature</strong> — ABEP (Brazilian Association of Research Companies), academic articles on electoral poll accuracy, methodological analyses at FGV and Poder360</li>
        <li><strong>Specialized journalistic consensus</strong> — reference political analysts (Folha, Estadão, O Globo, Poder360) who historically weight institutes in similar fashion</li>
        <li><strong>Public TSE history</strong> — registration protocols, sample size, declared cost, publication frequency (all public and auditable)</li>
        <li><strong>The institutes' own websites</strong> — declared methodology, disclosure of questionnaires, transparency about weighting and stratification</li>
      </ul>

      <Callout title="Honest limitation">
        <p>The current rating is <strong>editorial and subjective</strong>. Two people evaluating the same criteria could arrive at slightly different scores. To reduce this subjectivity in the long term, the <strong>AFOS roadmap calls for evolution toward a quantitative score</strong> based on TSE historical data + official results — accuracy rate, mean absolute error, weighted sample, frequency, and methodological transparency — with reproducible, published calculation. Timeline depends on data from the October 2026 election cycle.</p>
      </Callout>

      <h2 id="analise-criteriosa" className={S.h2}>5. In-Depth Analysis (of the top 4 candidates)</h2>
      <p className={S.p}>This is the richest section and the one that requires slower reading.</p>
      <p className={S.p}>The analysis is divided into <strong>4 sections</strong>: Candidate A, Candidate B, Candidate C, and a section grouping candidates D, E, and F. Each section has <strong>three blocks</strong>: STRENGTHS, WEAKNESSES, and ANALYSIS.</p>

      <h3 className={S.h3}>🟢 "STRENGTHS" block</h3>
      <p className={S.p}>Everything that is working in the candidate's favor <strong>that day</strong>, with <strong>source, date, and outlet cited</strong>. It's not opinion — it's auditable data.</p>
      <blockquote className={S.quote}>
        <strong>Today's Candidate A example:</strong> "POLYMARKET (Apr 19): 39.5% (stable) while Candidate B deflates. 2nd-place Poly Candidate A RISES 17% (↑1pp). Folha: 'Candidate A intensifies agenda aimed at women'. Poder360: 'Women become central focus'."
      </blockquote>

      <h3 className={S.h3}>🔴 "WEAKNESSES" block</h3>
      <p className={S.p}>Everything working <strong>against</strong> the candidate — with the same depth as strengths blocks. AFOS is <strong>symmetric</strong>.</p>
      <blockquote className={S.quote}>
        <strong>Today's Candidate A example:</strong> "Candidate B keeps minimal lead. Paraná Pesquisas São Paulo: runoff Candidate B 48.1% × Candidate A 40.3%. BNews: Candidate A drop / Candidate B growth in the Northeast. Gazeta do Povo: 'How Candidate A melted their 2022 advantage'."
      </blockquote>

      <h3 className={S.h3}>🔵 "ANALYSIS" block</h3>
      <p className={S.p}>The stitch. How strengths and weaknesses connect, and what it means strategically at that moment.</p>

      <h2 id="quadro-comparativo" className={S.h2}>6. Comparative Table</h2>
      <p className={S.p}>A single table summarizing candidate by candidate:</p>
      <div className={S.tableWrap}>
        <table className={S.table}>
          <thead><tr><th className={S.th}>Candidate</th><th className={S.th}>Current poll</th><th className={S.th}>Polymarket</th><th className={S.th}>Trend</th></tr></thead>
          <tbody>
            <tr className={S.trRow}><td className={S.td}>Candidate A (PT)</td><td className={S.td}>37% 1st round (Quaest) / 39.2% (CNT/MDA)</td><td className={S.td}>39.5% (stable)</td><td className={S.td}>Technical tie with Candidate B</td></tr>
            <tr className={S.trAlt}><td className={S.td}>Candidate B (PL)</td><td className={S.td}>32% 1st round (Quaest) / 35.9% (Veritá)</td><td className={S.td}>39.6% (↓0.8pp)</td><td className={S.td}>Surge deflates, holds minimal lead</td></tr>
            <tr className={S.trRow}><td className={S.td}>Candidate C (Missão)</td><td className={S.td}>4.4% (AtlasIntel)</td><td className={S.td}>6.25% (stable)</td><td className={S.td}>3rd place recovers (Candidate D regresses)</td></tr>
            <tr><td className={S.td}>...</td><td className={S.td}>...</td><td className={S.td}>...</td><td className={S.td}>...</td></tr>
          </tbody>
        </table>
      </div>
      <Callout title="Value for you">
        <p>In a single glance, you see the complete state of the game.</p>
      </Callout>

      <h2 id="perfil-candidatos" className={S.h2}>7. Candidate Profiles</h2>
      <p className={S.p}>This section presents each candidate in <strong>individual cards</strong> with five fields:</p>
      <ul className={S.ul}>
        <li><strong>Name, party, age, current role</strong></li>
        <li><strong>Polymarket:</strong> current percentage in the presidential market</li>
        <li><strong>Poll:</strong> most recent voting intention number</li>
        <li><strong>Position:</strong> ideology summarized (center-left, liberal right, etc.)</li>
        <li><strong>⚠️ Risk:</strong> the day's summary — what might change, what's under pressure, what favors</li>
      </ul>
      <Callout title="Value for you">
        <p>It's a quick "who's who". If someone asks "who is Candidate C?", you open, read for 20 seconds, and answer with data.</p>
      </Callout>

      <h2 id="paises" className={S.h2}>8. Countries — Clickable Buttons</h2>
      <p className={S.p}>The platform covers <strong>14+ countries</strong> with monitored elections. Each country appears as a clickable button. Clicking one, you see the same type of cross-reference (Polymarket + local polls + news) applied to that election.</p>
      <p className={S.p}><strong>Countries currently featured:</strong> Brazil, USA, France, Germany, UK, Canada, Australia, South Korea, Colombia, Chile, among others.</p>
      <p className={S.p}><strong>Why this matters:</strong> global political decisions influence each other. The 2024 US result affects the dynamics of Brazil 2026. Seeing the full map gives you context.</p>

      <h2 id="live-news" className={S.h2}>9. Live Elections News 120'</h2>
      <p className={S.p}>A live feed showing <strong>news published in the last 120 minutes</strong> related to monitored elections. Sources include Google News, major Brazilian portals, and international agencies.</p>
      <p className={S.p}><strong>How it works:</strong> every 30 minutes, a bot fetches news in 6 different categories (presidential election, specific candidates, scandals, polls, government approval, state races) and in the platform's 3 languages (PT-BR, EN, ES). The feed displays the most relevant in chronological order.</p>
      <Callout title="Value for you">
        <p>Instead of opening 10 newspaper tabs, you have the essential on a single screen, filtered by electoral relevance.</p>
      </Callout>

      <h2 id="sentimento" className={S.h2}>10. Political Climate</h2>
      <p className={S.p}>A dedicated panel showing <strong>the general climate of the race</strong> through four simultaneous lenses:</p>
      <ul className={S.ul}>
        <li><strong>Right:</strong> what's working for/against right-wing candidates</li>
        <li><strong>Left:</strong> same for left-wing candidates</li>
        <li><strong>Third way:</strong> how candidates outside the Candidate A / Candidate B axis are moving</li>
        <li><strong>Consolidated Polymarket:</strong> the single number of the day summarizing the scenario</li>
      </ul>
      <Callout title="Value for you">
        <p>In 30 seconds you have the <strong>political temperature</strong> of the moment, without needing to read any long analysis.</p>
      </Callout>

      <h2 id="inss-lulinha" className={S.h2}>11. INSS Scandal and the Incumbent's Family Case</h2>
      <p className={S.p}>Specific card about the biggest economic scandal of 2026 — the fraud of undue INSS (Brazilian pension) deductions — and the ramifications involving a family member of the incumbent.</p>
      <p className={S.p}><strong>What it shows:</strong> text structured in 4 blocks:</p>
      <ul className={S.ul}>
        <li><strong>Current context</strong> of the case (day's updates)</li>
        <li><strong>Institutional dynamics</strong> (Congress, PF, PGR, Supreme Court)</li>
        <li><strong>Supreme Court impact</strong> (impeachment probability on Polymarket)</li>
        <li><strong>Political field</strong> (how the scandal affects Candidate A vs Candidate B)</li>
      </ul>
      <Callout title="Value for you">
        <p>A topic involving dozens of actors (ministers, senators, police chiefs, judges) becomes <strong>consolidated in 2 minutes of reading</strong>, with the connections already made.</p>
      </Callout>

      <h2 id="banco-master" className={S.h2}>12. Banco Master Scandal Impact</h2>
      <p className={S.p}>Card focused on the Banco Master case and the plea bargain of the executive involved — another economic scandal unfolding in chapters.</p>
      <p className={S.p}><strong>What it shows:</strong></p>
      <ul className={S.ul}>
        <li>Latest developments (e.g., Central Bank approved the executive's control after initially rejecting)</li>
        <li>Institutional tensions (Federal Police × Attorney General's Office, Congressional Inquiry × Supreme Court)</li>
        <li>Cross-reference with Polymarket (does the market believe in a justice impeachment?)</li>
        <li>Electoral consequences</li>
      </ul>
      <Callout title="Value for you">
        <p>As a <strong>long and fragmented</strong> story in the press, having a consolidated diary saves hours of searching.</p>
      </Callout>

      <h2 id="stf" className={S.h2}>13. Supreme Court Credibility — Electoral Impact</h2>
      <p className={S.p}>Card dedicated to <strong>reading the Supreme Court as an electoral actor</strong> — because the Court, though it doesn't vote, decisively influences elections.</p>
      <p className={S.p}><strong>What it shows:</strong></p>
      <ul className={S.ul}>
        <li><strong>Justice by justice</strong> (Justice 1, Justice 2, Justice 3, Justice 4): what each is doing</li>
        <li><strong>Nexus:</strong> how individual actions connect into institutional strategy</li>
        <li><strong>Analysis:</strong> interprets Polymarket — does the market expect rupture (impeachment) or accommodation?</li>
      </ul>
      <blockquote className={S.quote}>
        <strong>Today's example:</strong> "Supreme Court impeach falls 11.5% (↓1.5pp, -4.5pp in 2 days). Court wants to tighten inquiry rules. Justice 1 may recuse themselves in the BRB case."
      </blockquote>
      <p className={S.p}><strong>Translation:</strong> the Court is <strong>protecting itself</strong>. The market senses there will be no impeachment — which reduces risk for candidates who would bet on institutional rupture.</p>
      <Callout title="Value for you">
        <p>Understanding the Supreme Court as a <strong>political actor</strong>, not just a judicial one.</p>
      </Callout>

      <h2 id="footer" className={S.h2}>14. Footer (page bottom)</h2>
      <p className={S.p}>The footer is organized into <strong>three lean blocks</strong>, each with a clear purpose. No link in the footer points to an empty page — each one delivers something specific.</p>

      <h3 className={S.h3}>Block 1 — Navigation</h3>
      <p className={S.pTight}>Shortcuts to the main platform areas:</p>
      <ul className={S.ul}>
        <li><strong>Dashboard</strong> — main application with the 6 Polymarket cards, analyses, and thematic cards</li>
        <li><strong>Global Map</strong> — interactive D3.js visualization of the 14+ monitored countries</li>
        <li><strong>Latin America</strong> — regional hub with Brazil, Colombia, Chile, and Mexico</li>
        <li><strong>Europe</strong> — regional hub with France, Germany, and the United Kingdom</li>
      </ul>

      <h3 className={S.h3}>Block 2 — Open Source</h3>
      <p className={S.pTight}>Full transparency about the project, following the reference standard in open-source software:</p>
      <ul className={S.ul}>
        <li><strong>Apache 2.0 License</strong> — use, modification, and redistribution permitted with attribution</li>
        <li><strong>⭐ GitHub</strong> — public repository with auditable source code</li>
        <li><strong>Security</strong> — responsible <em>disclosure</em> policy for vulnerabilities</li>
        <li><strong>Contributing</strong> — guide for external developers to submit improvements</li>
        <li><strong>Code of Conduct</strong> — community coexistence rules (Contributor Covenant)</li>
      </ul>

      <h3 className={S.h3}>Block 3 — Get in Touch</h3>
      <p className={S.pTight}>Four email channels segmented by purpose:</p>
      <ul className={S.ul}>
        <li>📧 <strong>Contact</strong> — press, partnerships, and general matters</li>
        <li>💬 <strong>Support</strong> — help using the platform</li>
        <li>🔒 <strong>Security</strong> — confidential vulnerability reports</li>
        <li>👤 <strong>Founder</strong> — direct contact with the founder</li>
      </ul>

      <h3 className={S.h3}>Bottom row</h3>
      <p className={S.p}>Bottom line with platform identification, data sources with real frequencies ("Polymarket 5min, 17+ TSE Institutes, Google News 30min"), Polymarket non-affiliation disclaimer, and "back to top" button.</p>
      <Callout title="Why the footer is this way">
        <p>Many sites fill the footer with dozens of decorative links that don't work or lead to empty pages. AFOS chose the opposite: <strong>few links, all functional</strong>. If a link appears in the footer, it delivers something real when clicked. This is the same philosophy as mature open-source projects like Supabase, Linear, and Prisma.</p>
      </Callout>

      <div className="h-px bg-gray-200 my-12" />

      <h2 id="bastidores" className={S.h2}>Behind the platform</h2>
      <h3 className={S.h3}>Data arrives on its own</h3>
      <p className={S.p}>Everything you read comes from automated pipelines that run 24 hours a day:</p>
      <ul className={S.ul}>
        <li><strong>Every 30 minutes:</strong> Polymarket is queried and percentages updated</li>
        <li><strong>Every 30 minutes:</strong> news is collected in 6 thematic categories and 3 languages</li>
        <li><strong>Daily:</strong> new polls registered with the TSE are downloaded and indexed</li>
        <li><strong>Twice daily (12pm and 6pm BRT):</strong> complete cross-referencing of the 3 sources is executed, comparing current state with the previous day (↑↓pp variations), and persisted in the database to form an auditable history</li>
      </ul>

      <h3 className={S.h3}>Analyses generated by AI from public data</h3>
      <p className={S.p}>The in-depth analyses (the <strong>Strengths</strong>, <strong>Weaknesses</strong>, <strong>Analysis</strong> blocks, the <strong>Cross-reference</strong>, and the <strong>four thematic cards</strong>) are generated by <strong>artificial intelligence</strong> that:</p>
      <ol className={S.ol}>
        <li>Reads the current values from the 3 sources</li>
        <li>Compares with values from the previous day</li>
        <li>Consults the most relevant news from the last 24 hours</li>
        <li>Applies the convergence/divergence rules described earlier</li>
        <li>Writes the resulting narrative, citing sources, dates, and outlets</li>
      </ol>
      <p className={S.p}>All data used is <strong>public and auditable</strong> — anyone can verify Polymarket, TSE polls, or cited news.</p>
      <Callout title="Why this matters to say">
        <p>Transparency about AI use is a modern standard — and it's what differentiates a serious project from an opaque one.</p>
      </Callout>

      <h2 id="perfis-usuario" className={S.h2}>User profiles</h2>
      <Card title="👤 Curious citizen">
        <p><strong>Visits:</strong> 2x per week, 5 minutes per visit.</p>
        <p><strong>What they do:</strong> read the 6 Polymarket cards + the Political Climate card.</p>
        <p><strong>Value:</strong> stays informed without consuming biased newspapers. Forms opinion based on data.</p>
      </Card>
      <Card title="👤 Professional (analyst, consultant, journalist, advisor)">
        <p><strong>Visits:</strong> daily, 15 minutes.</p>
        <p><strong>What they do:</strong> read the whole in-depth analysis + comparative table + 120' news feed. Notes variations.</p>
        <p><strong>Value:</strong> understands before competitors that the game has changed. Cites auditable sources.</p>
      </Card>
      <Card title="👤 Investor / risk manager">
        <p><strong>Visits:</strong> daily, 20 minutes.</p>
        <p><strong>What they do:</strong> reads consolidated Polymarket + Supreme Court card + Inflation card + Banco Master card. Cross-references with portfolio positions.</p>
        <p><strong>Value:</strong> political risk is <strong>asset price</strong>. Knowing before the market prices in an ineligibility or scandal = concrete advantage in trading/hedging.</p>
      </Card>

      <h2 id="limitacoes" className={S.h2}>When AFOS isn't useful (honest limitations)</h2>
      <p className={S.p}>No platform is useful for every question. Being honest about what AFOS <em>doesn't</em> deliver is what separates a serious tool from a vague promise.</p>

      <h3 className={S.h3}>AFOS doesn't replace formal statistical research</h3>
      <p className={S.p}>If you need <strong>margin of error, confidence interval, or controlled scientific sampling</strong> (in plain language: numbers with certified mathematical precision and auditable sampling methodology), the source is the <strong>polling institute</strong> (Datafolha, Quaest, IBGE, etc.). AFOS consolidates and cross-references this data, but doesn't produce new polls.</p>

      <h3 className={S.h3}>AFOS doesn't predict results with quantitative precision</h3>
      <p className={S.p}>The cross-reference is <strong>structured narrative</strong>, not statistical model. The platform doesn't deliver predictions with calculated mathematical precision. It delivers <strong>direction, pace, and convergence</strong> — qualitative readings useful for supporting decisions, but that don't replace the formal mathematical modeling that academics and quantitative funds use.</p>

      <h3 className={S.h3}>AFOS depends on the quality of prediction markets</h3>
      <p className={S.p}>In countries where <strong>Polymarket doesn't have active markets</strong> or has markets with very low liquidity (below US$ 100 thousand in volume), the market signal becomes noisy. AFOS flags these cases, but data confidence drops proportionally.</p>

      <h3 className={S.h3}>AFOS is not investment or voting recommendation</h3>
      <p className={S.p}>It's <strong>structured information to support decisions</strong>. Decisions about portfolio, bets, or votes are the sole responsibility of the user. The platform doesn't work with clients, doesn't receive commission, and has no declared conflict of interest — precisely so it doesn't have to recommend anything.</p>

      <h3 className={S.h3}>Current coverage is restricted to 14+ countries</h3>
      <p className={S.p}>Countries outside this list don't have a specific collection pipeline. The global map shows aggregates, but the depth of analysis (polls × Polymarket × news cross-reference) only exists where the infrastructure is ready. Expansion is continuous, but not universal.</p>

      <h2 id="diferenciacao" className={S.h2}>What makes AFOS different from Google News or a newspaper</h2>
      <div className={S.tableWrap}>
        <table className={S.table}>
          <thead><tr><th className={S.th}></th><th className={S.th}>Traditional newspaper</th><th className={S.th}>Google News</th><th className={S.th}>AFOS</th></tr></thead>
          <tbody>
            <tr className={S.trRow}><td className={S.td}>Editorial bias</td><td className={S.td}>High</td><td className={S.td}>Medium</td><td className={S.td}><strong>Transparent (shows both sides)</strong></td></tr>
            <tr className={S.trAlt}><td className={S.td}>Integrates real money?</td><td className={S.td}>No</td><td className={S.td}>No</td><td className={S.td}><strong>Yes, prediction market</strong></td></tr>
            <tr className={S.trRow}><td className={S.td}>Cross-references multiple sources?</td><td className={S.td}>No</td><td className={S.td}>Aggregates but doesn't cross</td><td className={S.td}><strong>Yes, with logic and method</strong></td></tr>
            <tr className={S.trAlt}><td className={S.td}>Shows change over time?</td><td className={S.td}>No</td><td className={S.td}>No</td><td className={S.td}><strong>Yes (↑↓pp daily variations)</strong></td></tr>
            <tr className={S.trRow}><td className={S.td}>Open source?</td><td className={S.td}>No</td><td className={S.td}>No</td><td className={S.td}><strong>Yes, Apache 2.0</strong></td></tr>
            <tr><td className={S.td}>Cost?</td><td className={S.td}>Subscription</td><td className={S.td}>Free but limited</td><td className={S.td}><strong>100% free, no login</strong></td></tr>
          </tbody>
        </table>
      </div>

      <h2 id="comece-aqui" className={S.h2}>Start here</h2>
      <p className={S.p}>If this is your first visit, this is the fastest way to extract value in <strong>5 minutes</strong>:</p>
      <Card title="Step 1 — Open the Dashboard">
        <p>The <strong>6 Polymarket Cards</strong> at the top already give you the day's panorama. Read in order: <em>1st round</em> → <em>2nd place</em> → <em>Supreme Court</em> → <em>Senate</em>. Focus on the <strong>↑↓pp</strong> variations — they tell you what moved since yesterday.</p>
      </Card>
      <Card title="Step 2 — Scroll down to In-Depth Analysis">
        <p>Pick a candidate you're interested in and read the <strong>STRENGTHS</strong> and <strong>WEAKNESSES</strong> blocks side by side. You'll feel honest discomfort reading the points against your favorite — that's a sign the method works. AFOS shows both sides of each number.</p>
      </Card>
      <Card title="Step 3 — Check the Political Climate Card">
        <p>The visual summary of the day's political climate in <strong>30 seconds</strong>. Right, left, third way, and consolidated Polymarket — all on one screen.</p>
      </Card>
      <Callout title="After that">
        <p>Come back <strong>tomorrow</strong>. AFOS's real value appears in sequence: one day gives context, three days give pattern, one week gives trend. Reading once is informing yourself; reading daily is <strong>anticipating</strong>.</p>
      </Callout>

      <SummaryFrame>
        AFOS Analytics is the first platform that combines real-money prediction markets, official polls, and real-time news to show, with honesty and transparency, what the data actually says about politics — without bias, without propaganda, free and without mandatory registration.
      </SummaryFrame>

      <p className="text-center text-xs text-gray-400 mt-10 mb-2">Updated April 2026</p>
    </>
  )
}
