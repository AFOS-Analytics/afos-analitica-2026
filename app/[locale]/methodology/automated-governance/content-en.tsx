/* eslint-disable react/no-unescaped-entities */
import { S } from '../../how-it-works/styles'

export function AutomatedGovEn() {
  return (
    <>
      <p className="text-center text-sm font-extrabold text-primary uppercase tracking-[0.25em] mb-3">Methodology</p>
      <h1 className="text-3xl md:text-4xl font-extrabold text-primary text-center mb-2 tracking-tight">
        Automated Governance
      </h1>
      <p className="text-center text-gray-600 text-base font-medium mb-10">
        How AFOS analyses are generated — rules in code, not in humans
      </p>

      <h2 id="the-model" className={S.h2}>Two ways to interact with the hosted platform</h2>
      <p className={S.p}>
        AFOS Analytics has two distinct paths for interacting with the instance at <code>afos-analytics.com</code>.
        This separation is what lets the project be <strong>genuinely open-source</strong> in code while maintaining{' '}
        <strong>auditable quality</strong> on the hosted platform.
      </p>
      <div className={S.tableWrap}>
        <table className={S.table}>
          <thead>
            <tr>
              <th className={S.th}>Path</th>
              <th className={S.th}>What it is</th>
              <th className={S.th}>AFOS involvement</th>
              <th className={S.th}>Rules</th>
            </tr>
          </thead>
          <tbody>
            <tr className={S.trRow}>
              <td className={S.tdTop}>🍴 <strong>Fork</strong></td>
              <td className={S.tdTop}>You copy the code and run your own version</td>
              <td className={S.tdTop}>Zero</td>
              <td className={S.tdTop}>Just Apache 2.0 (attribution, NOTICE file, no use of the AFOS trademark)</td>
            </tr>
            <tr>
              <td className={S.tdTop}>🔌 <strong>Country Onboarding</strong></td>
              <td className={S.tdTop}>You contribute a configuration that onboards a new country to the hosted platform</td>
              <td className={S.tdTop}>Technical PR review, one-time</td>
              <td className={S.tdTop}>Integrity rules in code — applied automatically</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className={S.p}>
        <strong>Improvements to the code itself</strong> (bugs, features, new validators) follow the standard open-source
        flow via <a href="https://github.com/AFOS-Analytics/afos-analitica-2026/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">CONTRIBUTING.md</a>{' '}
        — nothing special, it's just a PR.
      </p>

      <h2 id="fork" className={S.h2}>Fork (Apache 2.0, full stop)</h2>
      <p className={S.p}>
        The AFOS codebase is licensed under <strong>Apache 2.0</strong>. Anyone can fork, modify, run their own
        instance, change the prompt, remove rules, swap sources, use commercially. This is not a bug — it is the
        contract of serious open-source.
      </p>
      <p className={S.p}>
        <strong>Forker's responsibility: everything.</strong> If you fork and publish biased analyses, that is your
        operation, not AFOS. If your instance goes down, that is yours. If you monetize, that is your right. The
        only obligations are the Apache 2.0 license (preserve attribution in NOTICE, cite original copyright) and our{' '}
        <a href="https://github.com/AFOS-Analytics/afos-analitica-2026/blob/main/TRADEMARK.md" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
          trademark policy
        </a>{' '}
        — the code is free, but the name "AFOS Analytics" and the logo are registered trademarks. Forks operate under their own name.
      </p>
      <p className={S.p}>
        This model has precedent: Linux kernel, PostgreSQL, React, Kubernetes — all allow forks, none accept
        responsibility for what happens in third-party instances. AFOS follows the same logic.
      </p>
      <h3 className={S.h3}>Why forks strengthen AFOS rather than weaken it</h3>
      <p className={S.p}>
        Forks are not a threat — they are validation. If someone finds enough value in AFOS to replicate it, that
        proves the method works. PostgreSQL benefits from Supabase, Neon, Aiven existing; Linux benefits from Red Hat,
        Ubuntu, SUSE; React benefits from Next.js, Remix. Every successful commercial fork expands the upstream market
        rather than replacing it.
      </p>
      <p className={S.p}>
        <strong>The real moat of AFOS is not in the code</strong> (which is free by design). It is in:
      </p>
      <ul className={S.ul}>
        <li><strong>Historical data</strong> persisted in Neon since launch — forkers start from zero</li>
        <li><strong>SEO authority</strong> built through citations, backlinks and press mentions — takes years to replicate</li>
        <li><strong>Execution speed</strong> of a solo founder vs a corporate committee — decisions in minutes, not weeks</li>
        <li><strong>Community</strong> of early contributors, reviewers and completed Country Onboardings</li>
        <li><strong>Brand</strong> protected by trademark — forcing anyone who copies the code to build reputation from scratch</li>
      </ul>
      <p className={S.p}>
        None of that is forkable. That is precisely why AFOS can be 100% open-source without fear.
      </p>

      <h2 id="country-onboarding" className={S.h2}>Country Onboarding (configuration contribution)</h2>
      <p className={S.p}>
        If you want to help expand the AFOS hosted platform to new countries, you contribute a{' '}
        <strong>Country Onboarding</strong>. It is a configuration, not daily editorial work.
      </p>
      <p className={S.p}><strong>What you submit in a PR:</strong></p>
      <ul className={S.ul}>
        <li>Polymarket event mapping relevant to the country</li>
        <li>Poll source map (which institutes matter and why)</li>
        <li>News source map (reference outlets)</li>
        <li>Local political context (actors, recurring themes, glossary)</li>
        <li>Technical scaffolding (routes, translations)</li>
      </ul>
      <p className={S.p}>
        <strong>What you do NOT submit:</strong> written analyses. The platform generates daily analyses automatically
        using your configuration + pipeline + integrity rules. <strong>Contribute once, impact persists.</strong>
      </p>
      <p className={S.p}>
        Step-by-step technical guide:{' '}
        <a href="https://github.com/AFOS-Analytics/afos-analitica-2026/blob/main/docs/platform/add-your-country.md" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
          docs/platform/add-your-country.md
        </a>{' '}
        — ~2 hours of work, one PR.
      </p>

      <h2 id="hosted-platform" className={S.h2}>Hosted platform (governance in code)</h2>
      <p className={S.p}>
        The instance at <code>afos-analytics.com</code> is operated by AFOS. Analyses published under the AFOS brand
        carry our responsibility. Governance here is <strong>enforced in code</strong>, not by human editors reviewing
        each analysis.
      </p>
      <p className={S.p}>Three technical reasons for this:</p>
      <ol className={S.ol}>
        <li><strong>Consistency.</strong> Rules in code apply identically to 100 analyses or 100,000. Human reviewers vary by day, mood, context.</li>
        <li><strong>Scale.</strong> One human editor ≈ 10 analyses/day at the limit. One pipeline ≈ infinite. We want the second.</li>
        <li><strong>Auditability.</strong> Rules in code live in git history, versionable, diffable. Human editorial decisions live in the reviewer's head.</li>
      </ol>

      <h3 className={S.h3}>The automated validators</h3>
      <p className={S.p}>
        Before publishing any analysis, the pipeline runs validators. If any fails, the analysis does not publish until the cause is corrected:
      </p>
      <div className={S.tableWrap}>
        <table className={S.table}>
          <thead>
            <tr>
              <th className={S.th}>Validator</th>
              <th className={S.th}>What it checks</th>
              <th className={S.th}>Action on failure</th>
            </tr>
          </thead>
          <tbody>
            <tr className={S.trRow}><td className={S.td}><strong>Two-source rule</strong></td><td className={S.td}>Every factual claim cites ≥ 2 independent sources</td><td className={S.td}>Blocks publish, regenerates</td></tr>
            <tr className={S.trAlt}><td className={S.td}><strong>Partisan-adjective detector</strong></td><td className={S.td}>Blocklist scan ("authoritarian", "corrupt", "savior"...)</td><td className={S.td}>Blocks, regenerates without the term</td></tr>
            <tr className={S.trRow}><td className={S.td}><strong>Symmetry checker</strong></td><td className={S.td}>STRENGTHS and WEAKNESSES have comparable depth (character ratio, bullet count)</td><td className={S.td}>Blocks if ratio out of range</td></tr>
            <tr className={S.trAlt}><td className={S.td}><strong>Cross-source triangulation</strong></td><td className={S.td}>Analysis references ≥ 2 of the 3 vectors (market, polls, news)</td><td className={S.td}>Blocks, requires explicit citation</td></tr>
            <tr><td className={S.td}><strong>Data freshness</strong></td><td className={S.td}>Ingested data ≤ 48h old</td><td className={S.td}>Aborts pipeline if data is stale</td></tr>
          </tbody>
        </table>
      </div>

      <h3 className={S.h3}>Rules in the prompt (LLM calibration)</h3>
      <p className={S.p}>
        The LLM prompt that generates analyses explicitly includes: "do not use partisan adjectives", "attribute
        motivations only when documented", "flag source disagreements rather than manufacture certainty". This
        calibration is versioned in git — see{' '}
        <a href="https://github.com/AFOS-Analytics/afos-analitica-2026/blob/main/lib/ai/prompts.ts" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-mono text-sm">
          lib/ai/prompts.ts
        </a>{' '}
        — any change requires a reviewed PR.
      </p>

      <h2 id="exceptions" className={S.h2}>The 3 honest exceptions where humans intervene</h2>
      <p className={S.p}>Transparency requires naming the ~5% of cases where humans are unavoidable:</p>
      <ol className={S.ol}>
        <li>
          <strong>Source drift.</strong> A polling institute stops publishing, a news site changes URLs, a Polymarket
          event resolves. The pipeline flags this via monitoring; a maintainer updates the country configuration.
        </li>
        <li>
          <strong>Validator bypass.</strong> Rare cases where the generated analysis passes all validators but contains
          factual error or subtle bias. Readers report via GitHub issue; maintainers investigate and correct (by
          adjusting the prompt or config, not by editing the individual analysis).
        </li>
        <li>
          <strong>Legal or ethical emergency.</strong> Defamation risk, electoral law violation, coordinated manipulation
          attempt. Channel: <a href="mailto:contact@afos-analytics.com" className="text-primary hover:underline">contact@afos-analytics.com</a>.
          Take-down is possible and documented in a public incident log.
        </li>
      </ol>
      <p className={S.p}>These exceptions are the rare case. The normal case is the pipeline running autonomously 24/7.</p>

      <h2 id="why-zero-touch" className={S.h2}>Why "zero-touch" is a differentiator, not a limitation</h2>
      <p className={S.p}>
        Traditional newsrooms sell "human editorial judgment" as quality. AFOS inverts this: rules in code are more
        honest because they are:
      </p>
      <ul className={S.ul}>
        <li><strong>Auditable.</strong> Any reader can open the repo and see exactly which rule was applied. Impossible in a traditional newsroom.</li>
        <li><strong>Reproducible.</strong> Same input generates same output. Guarantees no case gets different treatment based on who was on shift.</li>
        <li><strong>Scalable.</strong> 14 countries today, 40 tomorrow, without hiring editors. The newsroom model would die at 20 countries.</li>
        <li><strong>Directly attackable.</strong> If you think a rule is wrong, open an issue. If you think the prompt is biased, open an issue. Critique is technical, not subjective.</li>
      </ul>

      <h2 id="how-to-contribute" className={S.h2}>How to contribute</h2>
      <ul className={S.ul}>
        <li>📘 <strong>Understand the model:</strong> <a href="https://github.com/AFOS-Analytics/afos-analitica-2026/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">CONTRIBUTING.md</a> — 3 roles, responsibilities, rules</li>
        <li>🌎 <strong>Onboard a country:</strong> <a href="https://github.com/AFOS-Analytics/afos-analitica-2026/blob/main/docs/platform/add-your-country.md" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">"Add your country" guide</a> — 5 steps, ~2h, 1 PR</li>
        <li>🔧 <strong>Propose before coding:</strong> <a href="https://github.com/AFOS-Analytics/afos-analitica-2026/issues/new?template=country-onboarding.md" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Country Onboarding template</a></li>
        <li>💬 <strong>Question or bypass report:</strong> <a href="mailto:contact@afos-analytics.com" className="text-primary hover:underline">contact@afos-analytics.com</a></li>
      </ul>

      <p className={S.p}>
        The name of the game is <strong>connected APIs + rules in code + minimum human intervention</strong>. That is
        how AFOS scales from the Brazil Laboratory to dozens of countries without becoming a newsroom.
      </p>
    </>
  )
}
