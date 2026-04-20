/* eslint-disable react/no-unescaped-entities */
import { Callout, Card, SectionIntro, NavFlag, SummaryFrame, TocCol, TocLink } from './components'

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
            <TocLink href="#cards-polymarket">2. 6 Polymarket Cards</TocLink>
            <TocLink href="#pesquisas">3. Electoral Polls</TocLink>
            <TocLink href="#analise-criteriosa">4. In-Depth Analysis</TocLink>
            <TocLink href="#quadro-comparativo">5. Comparative Table</TocLink>
            <TocLink href="#perfil-candidatos">6. Candidate Profiles</TocLink>
            <TocLink href="#paises">7. Countries</TocLink>
            <TocLink href="#live-news">8. Live News 120'</TocLink>
            <TocLink href="#sentimento">9. Sentiment Card</TocLink>
            <TocLink href="#inss-lulinha">10. INSS & Incumbent's Family Case</TocLink>
            <TocLink href="#banco-master">11. Banco Master</TocLink>
            <TocLink href="#stf">12. Supreme Court Credibility</TocLink>
            <TocLink href="#footer">13. Footer</TocLink>
          </TocCol>
          <TocCol heading="Deep dive">
            <TocLink href="#bastidores">Behind the platform</TocLink>
            <TocLink href="#perfis-usuario">3 user profiles</TocLink>
            <TocLink href="#limitacoes">When AFOS isn't useful</TocLink>
            <TocLink href="#diferenciacao">Difference vs aggregators vs newspapers</TocLink>
            <TocLink href="#comece-aqui">Start here</TocLink>
          </TocCol>
        </div>
      </nav>

      <h2 id="introducao" className="text-2xl font-bold text-primary mt-12 mb-4 pb-2 border-b-2 border-blue-100">Introduction — Why AFOS exists</h2>
      <p className="mb-4 text-gray-700">Every day you open a newspaper and read "Poll X says candidate Y has 37%". In another, "32%". Which one to believe?</p>
      <p className="mb-4 text-gray-700"><strong className="text-primary">The problem:</strong> electoral polls measure <em>declared intent</em> — what a person <em>says</em> they will do. But intent changes, polls have bias, and in Brazil this has gone wrong several times (2018 and 2022 had major surprises).</p>
      <p className="mb-4 text-gray-700"><strong className="text-primary">AFOS's solution:</strong> instead of trusting ONE source, the platform cross-references <strong>three independent sources in real time</strong>:</p>

      <div className="overflow-x-auto my-5">
        <table className="w-full bg-white rounded-lg shadow-sm text-sm border-collapse">
          <thead>
            <tr>
              <th className="bg-primary text-white px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">Source</th>
              <th className="bg-primary text-white px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">What it measures</th>
              <th className="bg-primary text-white px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">Why it matters</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="px-4 py-3 align-top">🎯 <strong>Polymarket</strong></td>
              <td className="px-4 py-3 align-top">Where real people bet real money on who will win</td>
              <td className="px-4 py-3 align-top">When someone risks US$ 10,000, they don't lie out of vanity</td>
            </tr>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <td className="px-4 py-3 align-top">📊 <strong>Polling institutes</strong> (17+ in Brazil — Datafolha, Quaest, AtlasIntel, Paraná Pesquisas, CNT/MDA, Veritá, and others)</td>
              <td className="px-4 py-3 align-top">Declared intent from sampled audiences</td>
              <td className="px-4 py-3 align-top">Captures traditional electorate sentiment</td>
            </tr>
            <tr>
              <td className="px-4 py-3 align-top">📰 <strong>Live news</strong> (400+ sources via Google News, major portals, agencies)</td>
              <td className="px-4 py-3 align-top">Current narrative</td>
              <td className="px-4 py-3 align-top">Explains <em>why</em> the numbers changed</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mb-4 text-gray-700">When these three sources <strong>agree</strong>, the forecast is robust. When they <strong>diverge</strong>, it's a sign something is moving — and that's extremely valuable information.</p>

      <h2 id="metodo" className="text-2xl font-bold text-primary mt-12 mb-4 pb-2 border-b-2 border-blue-100">How data is cross-referenced (the method)</h2>
      <p className="mb-4 text-gray-700">AFOS doesn't do formal statistics (regression, Bayesian models). It does something different and more useful day-to-day: a <strong>structured narrative cross-reference with explicit rules</strong>.</p>

      <h3 className="text-lg font-bold text-gray-800 mt-7 mb-3">Golden rule: convergence vs divergence</h3>
      <p className="mb-4 text-gray-700">For each important question (e.g., "who wins the first round?"), the platform compares the values from the 3 sources:</p>
      <div className="overflow-x-auto my-5">
        <table className="w-full bg-white rounded-lg shadow-sm text-sm border-collapse">
          <thead>
            <tr>
              <th className="bg-primary text-white px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">Situation</th>
              <th className="bg-primary text-white px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">Interpretation</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100"><td className="px-4 py-3">Polymarket × Poll difference ≤ 3pp</td><td className="px-4 py-3"><strong>Convergence</strong> — robust signal, consensus</td></tr>
            <tr className="border-b border-gray-100 bg-gray-50/50"><td className="px-4 py-3">Difference between 3-5pp</td><td className="px-4 py-3">Neutral zone — mild tension</td></tr>
            <tr><td className="px-4 py-3">Difference &gt; 5pp</td><td className="px-4 py-3"><strong>Divergence</strong> — something is changing, one source sees what the other doesn't</td></tr>
          </tbody>
        </table>
      </div>

      <h3 className="text-lg font-bold text-gray-800 mt-7 mb-3">The gold is in divergence</h3>
      <p className="mb-4 text-gray-700">When Polymarket and polls diverge, the reason is investigated:</p>
      <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
        <li><strong>Poll above, market below</strong> → either the poll is outdated/biased, or the market knows something (imminent operation, leaking scandal)</li>
        <li><strong>Market above, poll below</strong> → either the market anticipates a turnaround, or it's speculation with low volume</li>
      </ul>

      <h3 className="text-lg font-bold text-gray-800 mt-7 mb-3">Real example — the Candidate D surge and retreat</h3>
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
      <p className="mb-4 text-gray-700">Those who read AFOS daily <strong>arrive at conclusions earlier</strong> — because they see the movement while it's happening, not after.</p>
      <SectionIntro>
        <strong>Validity note:</strong> the specific examples cited illustrate the <em>method</em>, not a definitive point. This document is revised as the platform evolves. The platform data is always live.
      </SectionIntro>

      <h2 id="variacoes-pp" className="text-2xl font-bold text-primary mt-12 mb-4 pb-2 border-b-2 border-blue-100">Understanding ↑↓pp variations</h2>
      <p className="mb-4 text-gray-700">"pp" = <strong>percentage point</strong>. It's the difference between two percentages. Different from "percent".</p>
      <p className="mb-4 text-gray-700"><strong>Example:</strong> Candidate A had 40%, today has 42%. They went up <strong>2 percentage points (2pp)</strong>. In relative terms, that's a 5% growth (2 on top of 40).</p>

      <h3 className="text-lg font-bold text-gray-800 mt-7 mb-3">Why small variations matter</h3>
      <p className="mb-3 text-gray-700"><strong>1. Liquidity:</strong> the presidential Polymarket has US$ 54 million at stake. A 0.8pp change means roughly US$ 432 thousand was repriced. It's not opinion — it's real financial commitment.</p>
      <p className="mb-3 text-gray-700"><strong>2. Speed:</strong> 0.8pp in 1 day seems small. If the pace holds: 5.6pp per week; 24pp per month; complete reversal in 5 months. Small and persistent movement <strong>beats</strong> large and isolated movement.</p>
      <p className="mb-4 text-gray-700"><strong>3. Anticipation:</strong> when the market moves, it moves <strong>before</strong> the newspaper consensus. 48 hours later, you'll read analysts saying what the market already said.</p>

      <h3 className="text-lg font-bold text-gray-800 mt-7 mb-3">Interpretation table</h3>
      <div className="overflow-x-auto my-5">
        <table className="w-full bg-white rounded-lg shadow-sm text-sm border-collapse">
          <thead>
            <tr>
              <th className="bg-primary text-white px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">Variation</th>
              <th className="bg-primary text-white px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">What it means</th>
              <th className="bg-primary text-white px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">What to do</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100"><td className="px-4 py-3">±0.0 to ±0.3pp</td><td className="px-4 py-3">Market noise</td><td className="px-4 py-3">Ignore</td></tr>
            <tr className="border-b border-gray-100 bg-gray-50/50"><td className="px-4 py-3">±0.4 to ±1.0pp</td><td className="px-4 py-3">Light movement, emerging direction</td><td className="px-4 py-3">Check if it persists 2-3 days</td></tr>
            <tr className="border-b border-gray-100"><td className="px-4 py-3">±1.0 to ±3.0pp</td><td className="px-4 py-3">Significant movement</td><td className="px-4 py-3">Investigate today's news</td></tr>
            <tr className="border-b border-gray-100 bg-gray-50/50"><td className="px-4 py-3">±3.0 to ±5.0pp</td><td className="px-4 py-3">Jump — something big happened</td><td className="px-4 py-3">Top priority</td></tr>
            <tr><td className="px-4 py-3">±5.0pp+</td><td className="px-4 py-3">Disruptive event</td><td className="px-4 py-3">Re-read the whole scenario</td></tr>
          </tbody>
        </table>
      </div>
      <blockquote className="border-l-4 border-primary bg-blue-50 px-5 py-4 my-5 italic text-gray-700 text-sm rounded-r">
        <strong>Mental rule in one sentence:</strong> "A 1pp move is a tweet. 3pp is an interview. 5pp+ is a done deal."
      </blockquote>

      <NavFlag title="Navigating the platform" description="From here, we'll walk through the platform in the order you encounter when you open the site." />

      <h2 id="header" className="text-2xl font-bold text-primary mt-12 mb-4 pb-2 border-b-2 border-blue-100">1. Header (top of the page)</h2>
      <p className="mb-4 text-gray-700">At the top of the screen you see the <strong>AFOS Analytics</strong> logo and three navigation buttons:</p>
      <div className="overflow-x-auto my-5">
        <table className="w-full bg-white rounded-lg shadow-sm text-sm border-collapse">
          <thead><tr><th className="bg-primary text-white px-4 py-3 text-left font-semibold text-xs uppercase">Button</th><th className="bg-primary text-white px-4 py-3 text-left font-semibold text-xs uppercase">What it does</th></tr></thead>
          <tbody>
            <tr className="border-b border-gray-100"><td className="px-4 py-3"><strong>About</strong></td><td className="px-4 py-3">Explains the project's mission, the problem it solves, and the method</td></tr>
            <tr className="border-b border-gray-100 bg-gray-50/50"><td className="px-4 py-3"><strong>Goals</strong></td><td className="px-4 py-3">Shows the platform's public goals (country coverage, source integration, roadmap)</td></tr>
            <tr><td className="px-4 py-3"><strong>Global</strong></td><td className="px-4 py-3">Returns to the world map — useful when you're in the middle of an analysis and want to explore another country</td></tr>
          </tbody>
        </table>
      </div>
      <p className="mb-4 text-gray-700">The header is present on all pages. It's the navigation anchor.</p>

      <h2 id="cards-polymarket" className="text-2xl font-bold text-primary mt-12 mb-4 pb-2 border-b-2 border-blue-100">2. The 6 Polymarket Cards — Instant dashboard</h2>
      <p className="mb-4 text-gray-700">Right after the header, <strong>six cards appear side by side</strong> summarizing Polymarket's most important markets at the moment. Each card shows a <strong>percentage</strong> (probability priced by the market) with the <strong>variation relative to the previous day</strong> (↑↓pp).</p>

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

      <h2 id="pesquisas" className="text-2xl font-bold text-primary mt-12 mb-4 pb-2 border-b-2 border-blue-100">3. Electoral Polls</h2>
      <p className="mb-4 text-gray-700">Below the Polymarket cards, you find the electoral polls section.</p>

      <h3 className="text-lg font-bold text-gray-800 mt-7 mb-3">How polls arrive here</h3>
      <p className="mb-4 text-gray-700">All polls registered with Brazil's <strong>TSE (Superior Electoral Court)</strong> are downloaded automatically every day. The database holds <strong>more than 150 indexed polls</strong> and grows by about <strong>2 to 4 new polls registered per week</strong> — a pace that accelerates as the electoral cycle advances.</p>

      <h3 className="text-lg font-bold text-gray-800 mt-7 mb-3">Monitored institutes</h3>
      <p className="mb-4 text-gray-700">The platform tracks 17+ Brazilian institutes. The most frequent in the last month:</p>
      <div className="overflow-x-auto my-5">
        <table className="w-full bg-white rounded-lg shadow-sm text-sm border-collapse">
          <thead><tr><th className="bg-primary text-white px-4 py-3 text-left font-semibold text-xs uppercase">Institute</th><th className="bg-primary text-white px-4 py-3 text-left font-semibold text-xs uppercase">Recent polls</th><th className="bg-primary text-white px-4 py-3 text-left font-semibold text-xs uppercase">Average sample</th></tr></thead>
          <tbody>
            <tr className="border-b border-gray-100"><td className="px-4 py-3">Paraná Pesquisas</td><td className="px-4 py-3">3</td><td className="px-4 py-3">1,593 respondents</td></tr>
            <tr className="border-b border-gray-100 bg-gray-50/50"><td className="px-4 py-3">Datafolha</td><td className="px-4 py-3">2</td><td className="px-4 py-3">1,513</td></tr>
            <tr className="border-b border-gray-100"><td className="px-4 py-3">100 Cidades</td><td className="px-4 py-3">2</td><td className="px-4 py-3">1,400</td></tr>
            <tr className="border-b border-gray-100 bg-gray-50/50"><td className="px-4 py-3">Instituto Piauiense</td><td className="px-4 py-3">2</td><td className="px-4 py-3">800</td></tr>
            <tr><td className="px-4 py-3">Veritá</td><td className="px-4 py-3">1</td><td className="px-4 py-3">1,220</td></tr>
          </tbody>
        </table>
      </div>

      <h3 className="text-lg font-bold text-gray-800 mt-7 mb-3">Knowing not only what polls say, but what they're about to say</h3>
      <p className="mb-4 text-gray-700">Under Brazilian legislation, every institute is required to <strong>register each poll with the TSE before publishing it</strong>, with a unique protocol, field dates (when it's being administered), expected publication date, sample size, and cost. This registration is <strong>public</strong> and becomes available in the TSE's official database the moment the institute submits it.</p>
      <p className="mb-4 text-gray-700"><strong>This is where AFOS intelligence kicks in:</strong> the platform runs automatic ingestion cycles throughout the day querying the TSE directly. When a new poll is registered in the official database, within hours it's already processed, cross-referenced with Polymarket, and displayed on your screen — <strong>without depending on a journalist covering it or an official note from the institute</strong>.</p>

      <h3 className="text-lg font-bold text-gray-800 mt-7 mb-3">What you see for each poll</h3>
      <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
        <li><strong>Institute</strong> (e.g., Paraná Pesquisas, Datafolha, Quaest)</li>
        <li><strong>TSE protocol</strong> (unique, auditable identifier)</li>
        <li><strong>Field:</strong> dates when interviewers are collecting responses</li>
        <li><strong>Expected publication:</strong> when the institute will release results</li>
        <li><strong>Sample:</strong> number of respondents</li>
        <li><strong>Status:</strong> "published" (already out) or "active field" (still being administered)</li>
      </ul>

      <h3 className="text-lg font-bold text-gray-800 mt-7 mb-3">Real example today (Apr 19)</h3>
      <blockquote className="border-l-4 border-primary bg-blue-50 px-5 py-4 my-5 italic text-gray-700 text-sm rounded-r">
        Paraná Pesquisas — national — field <strong>Apr 21-23 (in progress)</strong> — expected publication <strong>Apr 24</strong> — sample 1,680
      </blockquote>
      <p className="mb-4 text-gray-700">You know <strong>5 days in advance</strong> that on Thursday there will be a national Paraná Pesquisas poll with nearly 1,700 respondents.</p>
      <Callout title="Value for you">
        <p>Press and traditional analysts only discover a poll <strong>when the institute publicly releases it</strong> — which can be 5 to 10 days after registration. AFOS discovers it <strong>on the same day the registration enters the TSE</strong>, because its ingestion cycles operate automatically at intervals of a few hours. This changes the logic: you stop <strong>reacting to news</strong> and start <strong>anticipating it</strong>.</p>
      </Callout>

      <h2 id="analise-criteriosa" className="text-2xl font-bold text-primary mt-12 mb-4 pb-2 border-b-2 border-blue-100">4. In-Depth Analysis (of the top 4 candidates)</h2>
      <p className="mb-4 text-gray-700">This is the richest section and the one that requires slower reading.</p>
      <p className="mb-4 text-gray-700">The analysis is divided into <strong>4 sections</strong>: Candidate A, Candidate B, Candidate C, and a section grouping candidates D, E, and F. Each section has <strong>three blocks</strong>: STRENGTHS, WEAKNESSES, and ANALYSIS.</p>

      <h3 className="text-lg font-bold text-gray-800 mt-7 mb-3">🟢 "STRENGTHS" block</h3>
      <p className="mb-4 text-gray-700">Everything that is working in the candidate's favor <strong>that day</strong>, with <strong>source, date, and outlet cited</strong>. It's not opinion — it's auditable data.</p>
      <blockquote className="border-l-4 border-primary bg-blue-50 px-5 py-4 my-5 italic text-gray-700 text-sm rounded-r">
        <strong>Today's Candidate A example:</strong> "POLYMARKET (Apr 19): 39.5% (stable) while Candidate B deflates. 2nd-place Poly Candidate A RISES 17% (↑1pp). Folha: 'Candidate A intensifies agenda aimed at women'. Poder360: 'Women become central focus'."
      </blockquote>

      <h3 className="text-lg font-bold text-gray-800 mt-7 mb-3">🔴 "WEAKNESSES" block</h3>
      <p className="mb-4 text-gray-700">Everything working <strong>against</strong> the candidate — with the same depth as strengths blocks. AFOS is <strong>symmetric</strong>.</p>
      <blockquote className="border-l-4 border-primary bg-blue-50 px-5 py-4 my-5 italic text-gray-700 text-sm rounded-r">
        <strong>Today's Candidate A example:</strong> "Candidate B keeps minimal lead. Paraná Pesquisas São Paulo: runoff Candidate B 48.1% × Candidate A 40.3%. BNews: Candidate A drop / Candidate B growth in the Northeast. Gazeta do Povo: 'How Candidate A melted their 2022 advantage'."
      </blockquote>

      <h3 className="text-lg font-bold text-gray-800 mt-7 mb-3">🔵 "ANALYSIS" block</h3>
      <p className="mb-4 text-gray-700">The stitch. How strengths and weaknesses connect, and what it means strategically at that moment.</p>

      <h2 id="quadro-comparativo" className="text-2xl font-bold text-primary mt-12 mb-4 pb-2 border-b-2 border-blue-100">5. Comparative Table</h2>
      <p className="mb-4 text-gray-700">A single table summarizing candidate by candidate:</p>
      <div className="overflow-x-auto my-5">
        <table className="w-full bg-white rounded-lg shadow-sm text-sm border-collapse">
          <thead><tr><th className="bg-primary text-white px-4 py-3 text-left font-semibold text-xs uppercase">Candidate</th><th className="bg-primary text-white px-4 py-3 text-left font-semibold text-xs uppercase">Current poll</th><th className="bg-primary text-white px-4 py-3 text-left font-semibold text-xs uppercase">Polymarket</th><th className="bg-primary text-white px-4 py-3 text-left font-semibold text-xs uppercase">Trend</th></tr></thead>
          <tbody>
            <tr className="border-b border-gray-100"><td className="px-4 py-3">Candidate A (PT)</td><td className="px-4 py-3">37% 1st round (Quaest) / 39.2% (CNT/MDA)</td><td className="px-4 py-3">39.5% (stable)</td><td className="px-4 py-3">Technical tie with Candidate B</td></tr>
            <tr className="border-b border-gray-100 bg-gray-50/50"><td className="px-4 py-3">Candidate B (PL)</td><td className="px-4 py-3">32% 1st round (Quaest) / 35.9% (Veritá)</td><td className="px-4 py-3">39.6% (↓0.8pp)</td><td className="px-4 py-3">Surge deflates, holds minimal lead</td></tr>
            <tr className="border-b border-gray-100"><td className="px-4 py-3">Candidate C (Missão)</td><td className="px-4 py-3">4.4% (AtlasIntel)</td><td className="px-4 py-3">6.25% (stable)</td><td className="px-4 py-3">3rd place recovers (Candidate D regresses)</td></tr>
            <tr><td className="px-4 py-3">...</td><td className="px-4 py-3">...</td><td className="px-4 py-3">...</td><td className="px-4 py-3">...</td></tr>
          </tbody>
        </table>
      </div>
      <Callout title="Value for you">
        <p>In a single glance, you see the complete state of the game.</p>
      </Callout>

      <h2 id="perfil-candidatos" className="text-2xl font-bold text-primary mt-12 mb-4 pb-2 border-b-2 border-blue-100">6. Candidate Profiles</h2>
      <p className="mb-4 text-gray-700">This section presents each candidate in <strong>individual cards</strong> with five fields:</p>
      <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
        <li><strong>Name, party, age, current role</strong></li>
        <li><strong>Polymarket:</strong> current percentage in the presidential market</li>
        <li><strong>Poll:</strong> most recent voting intention number</li>
        <li><strong>Position:</strong> ideology summarized (center-left, liberal right, etc.)</li>
        <li><strong>⚠️ Risk:</strong> the day's summary — what might change, what's under pressure, what favors</li>
      </ul>
      <Callout title="Value for you">
        <p>It's a quick "who's who". If someone asks "who is Candidate C?", you open, read for 20 seconds, and answer with data.</p>
      </Callout>

      <h2 id="paises" className="text-2xl font-bold text-primary mt-12 mb-4 pb-2 border-b-2 border-blue-100">7. Countries — Clickable Buttons</h2>
      <p className="mb-4 text-gray-700">The platform covers <strong>14+ countries</strong> with monitored elections. Each country appears as a clickable button. Clicking one, you see the same type of cross-reference (Polymarket + local polls + news) applied to that election.</p>
      <p className="mb-4 text-gray-700"><strong>Countries currently featured:</strong> Brazil, USA, France, Germany, UK, Canada, Australia, South Korea, Colombia, Chile, among others.</p>
      <p className="mb-4 text-gray-700"><strong>Why this matters:</strong> global political decisions influence each other. The 2024 US result affects the dynamics of Brazil 2026. Seeing the full map gives you context.</p>

      <h2 id="live-news" className="text-2xl font-bold text-primary mt-12 mb-4 pb-2 border-b-2 border-blue-100">8. Live Elections News 120'</h2>
      <p className="mb-4 text-gray-700">A live feed showing <strong>news published in the last 120 minutes</strong> related to monitored elections. Sources include Google News, major Brazilian portals, and international agencies.</p>
      <p className="mb-4 text-gray-700"><strong>How it works:</strong> every 30 minutes, a bot fetches news in 6 different categories (presidential election, specific candidates, scandals, polls, government approval, state races) and in the platform's 3 languages (PT-BR, EN, ES). The feed displays the most relevant in chronological order.</p>
      <Callout title="Value for you">
        <p>Instead of opening 10 newspaper tabs, you have the essential on a single screen, filtered by electoral relevance.</p>
      </Callout>

      <h2 id="sentimento" className="text-2xl font-bold text-primary mt-12 mb-4 pb-2 border-b-2 border-blue-100">9. Sentiment Card</h2>
      <p className="mb-4 text-gray-700">A dedicated panel showing <strong>the general climate of the race</strong> through four simultaneous lenses:</p>
      <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
        <li><strong>Right:</strong> what's working for/against right-wing candidates</li>
        <li><strong>Left:</strong> same for left-wing candidates</li>
        <li><strong>Third way:</strong> how candidates outside the Candidate A / Candidate B axis are moving</li>
        <li><strong>Consolidated Polymarket:</strong> the single number of the day summarizing the scenario</li>
      </ul>
      <Callout title="Value for you">
        <p>In 30 seconds you have the <strong>political temperature</strong> of the moment, without needing to read any long analysis.</p>
      </Callout>

      <h2 id="inss-lulinha" className="text-2xl font-bold text-primary mt-12 mb-4 pb-2 border-b-2 border-blue-100">10. INSS Scandal and the Incumbent's Family Case</h2>
      <p className="mb-4 text-gray-700">Specific card about the biggest economic scandal of 2026 — the fraud of undue INSS (Brazilian pension) deductions — and the ramifications involving a family member of the incumbent.</p>
      <p className="mb-4 text-gray-700"><strong>What it shows:</strong> text structured in 4 blocks:</p>
      <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
        <li><strong>Current context</strong> of the case (day's updates)</li>
        <li><strong>Institutional dynamics</strong> (Congress, PF, PGR, Supreme Court)</li>
        <li><strong>Supreme Court impact</strong> (impeachment probability on Polymarket)</li>
        <li><strong>Political field</strong> (how the scandal affects Candidate A vs Candidate B)</li>
      </ul>
      <Callout title="Value for you">
        <p>A topic involving dozens of actors (ministers, senators, police chiefs, judges) becomes <strong>consolidated in 2 minutes of reading</strong>, with the connections already made.</p>
      </Callout>

      <h2 id="banco-master" className="text-2xl font-bold text-primary mt-12 mb-4 pb-2 border-b-2 border-blue-100">11. Banco Master Scandal Impact</h2>
      <p className="mb-4 text-gray-700">Card focused on the Banco Master case and the plea bargain of the executive involved — another economic scandal unfolding in chapters.</p>
      <p className="mb-4 text-gray-700"><strong>What it shows:</strong></p>
      <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
        <li>Latest developments (e.g., Central Bank approved the executive's control after initially rejecting)</li>
        <li>Institutional tensions (Federal Police × Attorney General's Office, Congressional Inquiry × Supreme Court)</li>
        <li>Cross-reference with Polymarket (does the market believe in a justice impeachment?)</li>
        <li>Electoral consequences</li>
      </ul>
      <Callout title="Value for you">
        <p>As a <strong>long and fragmented</strong> story in the press, having a consolidated diary saves hours of searching.</p>
      </Callout>

      <h2 id="stf" className="text-2xl font-bold text-primary mt-12 mb-4 pb-2 border-b-2 border-blue-100">12. Supreme Court Credibility — Electoral Impact</h2>
      <p className="mb-4 text-gray-700">Card dedicated to <strong>reading the Supreme Court as an electoral actor</strong> — because the Court, though it doesn't vote, decisively influences elections.</p>
      <p className="mb-4 text-gray-700"><strong>What it shows:</strong></p>
      <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
        <li><strong>Justice by justice</strong> (Justice 1, Justice 2, Justice 3, Justice 4): what each is doing</li>
        <li><strong>Nexus:</strong> how individual actions connect into institutional strategy</li>
        <li><strong>Analysis:</strong> interprets Polymarket — does the market expect rupture (impeachment) or accommodation?</li>
      </ul>
      <blockquote className="border-l-4 border-primary bg-blue-50 px-5 py-4 my-5 italic text-gray-700 text-sm rounded-r">
        <strong>Today's example:</strong> "Supreme Court impeach falls 11.5% (↓1.5pp, -4.5pp in 2 days). Court wants to tighten inquiry rules. Justice 1 may recuse themselves in the BRB case."
      </blockquote>
      <p className="mb-4 text-gray-700"><strong>Translation:</strong> the Court is <strong>protecting itself</strong>. The market senses there will be no impeachment — which reduces risk for candidates who would bet on institutional rupture.</p>
      <Callout title="Value for you">
        <p>Understanding the Supreme Court as a <strong>political actor</strong>, not just a judicial one.</p>
      </Callout>

      <h2 id="footer" className="text-2xl font-bold text-primary mt-12 mb-4 pb-2 border-b-2 border-blue-100">13. Footer (page bottom)</h2>
      <p className="mb-4 text-gray-700">The footer is organized into <strong>three lean blocks</strong>, each with a clear purpose. No link in the footer points to an empty page — each one delivers something specific.</p>

      <h3 className="text-lg font-bold text-gray-800 mt-7 mb-3">Block 1 — Navigation</h3>
      <p className="mb-3 text-gray-700">Shortcuts to the main platform areas:</p>
      <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
        <li><strong>Dashboard</strong> — main application with the 6 Polymarket cards, analyses, and thematic cards</li>
        <li><strong>Global Map</strong> — interactive D3.js visualization of the 14+ monitored countries</li>
        <li><strong>Latin America</strong> — regional hub with Brazil, Colombia, Chile, and Mexico</li>
        <li><strong>Europe</strong> — regional hub with France, Germany, and the United Kingdom</li>
      </ul>

      <h3 className="text-lg font-bold text-gray-800 mt-7 mb-3">Block 2 — Open Source</h3>
      <p className="mb-3 text-gray-700">Full transparency about the project, following the reference standard in open-source software:</p>
      <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
        <li><strong>Apache 2.0 License</strong> — use, modification, and redistribution permitted with attribution</li>
        <li><strong>⭐ GitHub</strong> — public repository with auditable source code</li>
        <li><strong>Security</strong> — responsible <em>disclosure</em> policy for vulnerabilities</li>
        <li><strong>Contributing</strong> — guide for external developers to submit improvements</li>
        <li><strong>Code of Conduct</strong> — community coexistence rules (Contributor Covenant)</li>
      </ul>

      <h3 className="text-lg font-bold text-gray-800 mt-7 mb-3">Block 3 — Get in Touch</h3>
      <p className="mb-3 text-gray-700">Four email channels segmented by purpose:</p>
      <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
        <li>📧 <strong>Contact</strong> — press, partnerships, and general matters</li>
        <li>💬 <strong>Support</strong> — help using the platform</li>
        <li>🔒 <strong>Security</strong> — confidential vulnerability reports</li>
        <li>👤 <strong>Founder</strong> — direct contact with the founder</li>
      </ul>

      <h3 className="text-lg font-bold text-gray-800 mt-7 mb-3">Bottom row</h3>
      <p className="mb-4 text-gray-700">Bottom line with platform identification, data sources with real frequencies ("Polymarket 5min, 17+ TSE Institutes, Google News 30min"), Polymarket non-affiliation disclaimer, and "back to top" button.</p>
      <Callout title="Why the footer is this way">
        <p>Many sites fill the footer with dozens of decorative links that don't work or lead to empty pages. AFOS chose the opposite: <strong>few links, all functional</strong>. If a link appears in the footer, it delivers something real when clicked. This is the same philosophy as mature open-source projects like Supabase, Linear, and Prisma.</p>
      </Callout>

      <div className="h-px bg-gray-200 my-12" />

      <h2 id="bastidores" className="text-2xl font-bold text-primary mt-12 mb-4 pb-2 border-b-2 border-blue-100">Behind the platform</h2>
      <h3 className="text-lg font-bold text-gray-800 mt-7 mb-3">Data arrives on its own</h3>
      <p className="mb-4 text-gray-700">Everything you read comes from automated pipelines that run 24 hours a day:</p>
      <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
        <li><strong>Every 5 minutes:</strong> Polymarket is queried and percentages updated</li>
        <li><strong>Every 30 minutes:</strong> news is collected in 6 thematic categories and 3 languages</li>
        <li><strong>Daily:</strong> new polls registered with the TSE are downloaded and indexed</li>
        <li><strong>Twice daily (12pm and 6pm BRT):</strong> complete cross-referencing of the 3 sources is executed, comparing current state with the previous day (↑↓pp variations), and persisted in the database to form an auditable history</li>
      </ul>

      <h3 className="text-lg font-bold text-gray-800 mt-7 mb-3">Analyses generated by AI from public data</h3>
      <p className="mb-4 text-gray-700">The in-depth analyses (the <strong>Strengths</strong>, <strong>Weaknesses</strong>, <strong>Analysis</strong> blocks, the <strong>Cross-reference</strong>, and the <strong>four thematic cards</strong>) are generated by <strong>artificial intelligence</strong> that:</p>
      <ol className="list-decimal pl-6 mb-4 text-gray-700 space-y-2">
        <li>Reads the current values from the 3 sources</li>
        <li>Compares with values from the previous day</li>
        <li>Consults the most relevant news from the last 24 hours</li>
        <li>Applies the convergence/divergence rules described earlier</li>
        <li>Writes the resulting narrative, citing sources, dates, and outlets</li>
      </ol>
      <p className="mb-4 text-gray-700">All data used is <strong>public and auditable</strong> — anyone can verify Polymarket, TSE polls, or cited news.</p>
      <Callout title="Why this matters to say">
        <p>Transparency about AI use is a modern standard — and it's what differentiates a serious project from an opaque one.</p>
      </Callout>

      <h2 id="perfis-usuario" className="text-2xl font-bold text-primary mt-12 mb-4 pb-2 border-b-2 border-blue-100">How to extract value (3 user profiles)</h2>
      <Card title="👤 Curious citizen">
        <p><strong>Visits:</strong> 2x per week, 5 minutes per visit.</p>
        <p><strong>What they do:</strong> read the 6 Polymarket cards + the Sentiment card.</p>
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

      <h2 id="limitacoes" className="text-2xl font-bold text-primary mt-12 mb-4 pb-2 border-b-2 border-blue-100">When AFOS isn't useful (honest limitations)</h2>
      <p className="mb-4 text-gray-700">No platform is useful for every question. Being honest about what AFOS <em>doesn't</em> deliver is what separates a serious tool from a vague promise.</p>

      <h3 className="text-lg font-bold text-gray-800 mt-7 mb-3">AFOS doesn't replace formal statistical research</h3>
      <p className="mb-4 text-gray-700">If you need <strong>margin of error, confidence interval, or controlled scientific sampling</strong> (in plain language: numbers with certified mathematical precision and auditable sampling methodology), the source is the <strong>polling institute</strong> (Datafolha, Quaest, IBGE, etc.). AFOS consolidates and cross-references this data, but doesn't produce new polls.</p>

      <h3 className="text-lg font-bold text-gray-800 mt-7 mb-3">AFOS doesn't predict results with quantitative precision</h3>
      <p className="mb-4 text-gray-700">The cross-reference is <strong>structured narrative</strong>, not statistical model. The platform doesn't deliver predictions with calculated mathematical precision. It delivers <strong>direction, pace, and convergence</strong> — qualitative readings useful for supporting decisions, but that don't replace the formal mathematical modeling that academics and quantitative funds use.</p>

      <h3 className="text-lg font-bold text-gray-800 mt-7 mb-3">AFOS depends on the quality of prediction markets</h3>
      <p className="mb-4 text-gray-700">In countries where <strong>Polymarket doesn't have active markets</strong> or has markets with very low liquidity (below US$ 100 thousand in volume), the market signal becomes noisy. AFOS flags these cases, but data confidence drops proportionally.</p>

      <h3 className="text-lg font-bold text-gray-800 mt-7 mb-3">AFOS is not investment or voting recommendation</h3>
      <p className="mb-4 text-gray-700">It's <strong>structured information to support decisions</strong>. Decisions about portfolio, bets, or votes are the sole responsibility of the user. The platform doesn't work with clients, doesn't receive commission, and has no declared conflict of interest — precisely so it doesn't have to recommend anything.</p>

      <h3 className="text-lg font-bold text-gray-800 mt-7 mb-3">Current coverage is restricted to 14+ countries</h3>
      <p className="mb-4 text-gray-700">Countries outside this list don't have a specific collection pipeline. The global map shows aggregates, but the depth of analysis (polls × Polymarket × news cross-reference) only exists where the infrastructure is ready. Expansion is continuous, but not universal.</p>

      <h2 id="diferenciacao" className="text-2xl font-bold text-primary mt-12 mb-4 pb-2 border-b-2 border-blue-100">What makes AFOS different from Google News or a newspaper</h2>
      <div className="overflow-x-auto my-5">
        <table className="w-full bg-white rounded-lg shadow-sm text-sm border-collapse">
          <thead><tr><th className="bg-primary text-white px-4 py-3 text-left font-semibold text-xs uppercase"></th><th className="bg-primary text-white px-4 py-3 text-left font-semibold text-xs uppercase">Traditional newspaper</th><th className="bg-primary text-white px-4 py-3 text-left font-semibold text-xs uppercase">Google News</th><th className="bg-primary text-white px-4 py-3 text-left font-semibold text-xs uppercase">AFOS</th></tr></thead>
          <tbody>
            <tr className="border-b border-gray-100"><td className="px-4 py-3">Editorial bias</td><td className="px-4 py-3">High</td><td className="px-4 py-3">Medium</td><td className="px-4 py-3"><strong>Transparent (shows both sides)</strong></td></tr>
            <tr className="border-b border-gray-100 bg-gray-50/50"><td className="px-4 py-3">Integrates real money?</td><td className="px-4 py-3">No</td><td className="px-4 py-3">No</td><td className="px-4 py-3"><strong>Yes, prediction market</strong></td></tr>
            <tr className="border-b border-gray-100"><td className="px-4 py-3">Cross-references multiple sources?</td><td className="px-4 py-3">No</td><td className="px-4 py-3">Aggregates but doesn't cross</td><td className="px-4 py-3"><strong>Yes, with logic and method</strong></td></tr>
            <tr className="border-b border-gray-100 bg-gray-50/50"><td className="px-4 py-3">Shows change over time?</td><td className="px-4 py-3">No</td><td className="px-4 py-3">No</td><td className="px-4 py-3"><strong>Yes (↑↓pp daily variations)</strong></td></tr>
            <tr className="border-b border-gray-100"><td className="px-4 py-3">Open source?</td><td className="px-4 py-3">No</td><td className="px-4 py-3">No</td><td className="px-4 py-3"><strong>Yes, Apache 2.0</strong></td></tr>
            <tr><td className="px-4 py-3">Cost?</td><td className="px-4 py-3">Subscription</td><td className="px-4 py-3">Free but addictive</td><td className="px-4 py-3"><strong>100% free, no login</strong></td></tr>
          </tbody>
        </table>
      </div>

      <h2 id="comece-aqui" className="text-2xl font-bold text-primary mt-12 mb-4 pb-2 border-b-2 border-blue-100">Start here</h2>
      <p className="mb-4 text-gray-700">If this is your first visit, this is the fastest way to extract value in <strong>5 minutes</strong>:</p>
      <Card title="Step 1 — Open the Dashboard">
        <p>The <strong>6 Polymarket Cards</strong> at the top already give you the day's panorama. Read in order: <em>1st round</em> → <em>2nd place</em> → <em>Supreme Court</em> → <em>Senate</em>. Focus on the <strong>↑↓pp</strong> variations — they tell you what moved since yesterday.</p>
      </Card>
      <Card title="Step 2 — Scroll down to In-Depth Analysis">
        <p>Pick a candidate you're interested in and read the <strong>STRENGTHS</strong> and <strong>WEAKNESSES</strong> blocks side by side. You'll feel honest discomfort reading the points against your favorite — that's a sign the method works. AFOS shows both sides of each number.</p>
      </Card>
      <Card title="Step 3 — Check the Sentiment Card">
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
