# AFOS Analytics — V1

🇧🇷 [Leia em Português](README-v1.pt-BR.md) | 🇺🇸 English

> This is the original V1 README, preserved to show how it all started. See the [current README](../README.md) for the latest version.

**Electoral Intelligence Dashboard — Brazil 2026 Presidential Elections**

**[afos-analytics.com](https://afos-analytics.com)**

---

## About

AFOS Analytics is an electoral intelligence dashboard that monitors the 2026 Brazilian presidential elections in real time. It combines data from international real-money prediction markets (Polymarket), traditional electoral polls from 17+ institutes, major media news, and strategic analyses — all in a single visual panel, accessible on mobile or desktop.

**A unique and unprecedented project in any election worldwide.**

---

## Features

### Polymarket — Prediction Market
- Live odds with real money on who wins the presidency
- 2nd and 3rd place data for the 1st round
- STF Impeachment, Senate, 2026 Inflation
- Updated every 2 hours (ISR)

### Electoral Polls — 17+ Institutes
- AtlasIntel/Bloomberg, Datafolha, Quaest/Genial, Parana Pesquisas, Gerp, Real Time Big Data, Ipec, MDA, PoderData and others
- Multiple 1st and 2nd round scenarios
- Institute credibility rating (1 to 5 stars)
- Comparative table: Polls vs Polymarket

### In-Depth Analysis
- Strengths and weaknesses of the top 4 candidates
- Cross-reference of 5+ institutes vs Polymarket
- Analytical verdict for each candidate

### Candidate Profiles
- 7 detailed candidates: Flavio Bolsonaro, Lula, Renan Santos, Ronaldo Caiado, Fernando Haddad, Romeu Zema, Tarcisio de Freitas
- Political position, risks, odds vs polls

### Live Elections News 120'
- Live news from 30+ national outlets
- Google News RSS + Firecrawl AI for deep scraping
- Categories: Presidency, Governors, Senate, Banco Master, INSS, STF, Congress
- Updated every 30 minutes

### Popular Sentiment
- Social media and public opinion analysis
- Trends by political spectrum (Right/Left/Third Way)
- Updated every 2 hours based on news

### INSS Scandal and the Lulinho Case
- INSS Parliamentary Inquiry, Federal Police investigations
- Impact on Lula's image and federal administration

### Banco Master Scandal Impact
- BRB losses, Operation Compliance Zero
- National and Federal District impact

### STF Credibility — Electoral Impact
- STF × Banco Master nexus (Toffoli, Moraes, Gilmar, Dino)
- Impeachment odds via Polymarket

### Global — Elections Around the World
- Interactive world map with monitored elections
- Clickable cards with Polymarket data from 11+ countries
- Global electoral calendar

---

## Tech Stack

| Technology | Usage |
|------------|-------|
| **Next.js 14** | React Framework, App Router, TypeScript |
| **Tailwind CSS** | Styling, responsive design |
| **Vercel** | Hosting, ISR (Incremental Static Regeneration) |
| **Polymarket API** | Live prediction market odds |
| **Google News RSS** | News from 30+ outlets |
| **Firecrawl** | Deep portal scraping (Poder360, Metropoles, CNN, Gazeta, UOL) |

---

## APIs

| Endpoint | Description | Cache |
|----------|-------------|-------|
| `/api/polymarket` | Presidential odds + STF + Senate + Inflation | 2h |
| `/api/polls` | Polls from 5+ institutes + comparative table | 2h |
| `/api/news` | Categorized news (Google News + Firecrawl) | 30min |
| `/api/analysis-cards` | Dynamic analyses for 4 cards (sentiment, INSS, Master, STF) | 2h |
| `/api/global-elections` | Global election data (11+ countries) | 2h |

---

## Design

- **Colors**: Sapphire Blue (#0F52BA), White, Black, Red (#DC2626) accent
- **Font**: Inter (Google Fonts)
- **Responsive**: Mobile-first, works on Android and iOS
- **Favicon**: AF/OS in sapphire blue

---

## Automatic Updates

| Component | Frequency |
|-----------|-----------|
| Polymarket (odds) | Every 2 hours |
| Live Elections News | Every 30 minutes |
| Analysis cards | Every 2 hours (when there's news) |
| Electoral polls | When a new poll is released by any institute |

---

## What does AFOS mean?

| Letter | Meaning | Description |
|--------|---------|-------------|
| **A** | Amor (Love) | For freedom and people's development |
| **F** | Fe (Faith) | In society's potential and truthful, impartial information |
| **O** | Ousadia (Boldness) | To innovate and show reality without filters |
| **S** | Sabedoria (Wisdom) | To analyze with balance and responsibility |

---

## What Made It Different

AFOS Analytics was the only Brazilian dashboard that cross-referenced Polymarket (international real-money prediction market) with national polls from 17+ institutes + scandal analysis + social media sentiment in a single panel.

**Free. No login. Automatically updated. Mobile and desktop.**

---

## License

Apache License 2.0 — See [LICENSE](../LICENSE)

---

*AFOS Analytics — Electoral Intelligence Dashboard*
