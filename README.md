# AFOS Analytics

**Plataforma Global de Inteligência Eleitoral em Tempo Real**

🔗 **[afos-analitica-2026.vercel.app](https://afos-analitica-2026.vercel.app)**

> *Democracy runs on information. Information runs on transparency. AFOS Analytics is programmable transparency.*

---

## Sobre

O **AFOS Analytics** é uma plataforma global de inteligência eleitoral em tempo real.

Monitoramos eleições no mundo inteiro e transformamos dados complexos em informação clara, objetiva e acionável, combinando em um único ambiente:

- Mercados internacionais de previsão com dinheiro real (Polymarket)
- Pesquisas de opinião eleitoral tradicionais
- Notícias da grande imprensa
- Sinais e sentimento das redes sociais
- Análises estratégicas geradas com inteligência artificial

**Open Source. Gratuito. Atualizado automaticamente. Mobile e desktop.**

---

## Global por Design

Começamos com o Brasil, mas o objetivo é maior:

> **Acompanhar eleições no mundo inteiro e criar uma nova forma de entender risco político em escala global.**

Onde houver eleição, existe sinal. Onde existe sinal, o AFOS Analytics lê.

---

## Arquitetura

### Pipeline de Dados (Cron + KV)

```
ANTES (ISR):
  Usuário → ISR miss → Polymarket (4s) → resposta
  ❌ Usuário espera até 4s

DEPOIS (Cron + KV):
  Background:  Cron (60s) → Polymarket (18 mercados paralelo) → Vercel KV
  Usuário:     Requisição → KV read (<1ms) → resposta
  ✅ 10M usuários = mesma carga que 10 usuários
```

**Cascata de fallback (4 níveis):**

| Nível | Condição | Resposta |
|-------|----------|----------|
| 1 | KV com dados frescos | <1ms (99.9% dos casos) |
| 2 | KV vazio | Fetch direto Polymarket (~4s) |
| 3 | Polymarket falhou | Dados em memória (último resultado bom) |
| 4 | Sem nenhum dado | HTTP 503 + Retry-After: 60 |

### Estrutura de Componentes

```
app/
├── types/
│   ├── index.ts                # 19 interfaces TypeScript centralizadas
│   └── global-map.ts           # Tipos do mapa global + mapeamento ISO3
├── hooks/useDashboardData.ts   # Custom hooks de data fetching
├── lib/
│   ├── utils.ts                # Funções utilitárias compartilhadas
│   ├── security.ts             # OWASP security utilities
│   ├── kv.ts                   # Wrapper Vercel KV com fallback
│   ├── map-colors.ts           # Tokens visuais do mapa global
│   ├── mock-elections.ts       # Mock data (fallback offline)
│   ├── cache/headers.ts        # Cache multi-camada (Vercel CDN + CDN + Browser)
│   └── polymarket/
│       ├── client.ts           # API client (retry, timeout, circuit breaker)
│       ├── country-market-map.ts # Registry slug → ISO3 (14 países, 18 mercados)
│       ├── bootstrap.ts        # Aggregador: fetch → parse → normalize
│       └── ws.ts               # WebSocket (para worker dedicado)
├── components/
│   ├── ui.tsx                  # Componentes base (Card, HBar, Stars, SectionTitle)
│   ├── Header.tsx / Footer.tsx
│   ├── ModalAbout.tsx / ModalMetas.tsx / ModalGlobal.tsx
│   ├── PolymarketSection.tsx / PollsSection.tsx / CandidatesSection.tsx
│   ├── NewsSection.tsx / SentimentSection.tsx
│   ├── InssSection.tsx / BancoMasterSection.tsx / StfSection.tsx
│   └── global-map/
│       ├── GlobalElectionMap.tsx   # D3 + TopoJSON + SVG (React.memo)
│       ├── GlobalMapTooltip.tsx    # Tooltip hover
│       ├── GlobalMapLegend.tsx     # Legenda de cores
│       └── GlobalCountryDrawer.tsx # Drawer lateral com candidatos
├── api/
│   ├── polymarket/             # Odds presidenciais BR
│   ├── polls/                  # Pesquisas eleitorais
│   ├── news/                   # Notícias (Google News + Firecrawl)
│   ├── analysis-cards/         # Análises dinâmicas
│   ├── analysis-criteriosa/    # Análise dos 4 primeiros
│   ├── global-elections/       # Eleições globais (legado)
│   ├── global-map/             # Mapa global (lê KV → fallback Polymarket)
│   └── cron/
│       └── refresh-elections/  # Cron a cada 60s → Polymarket → KV
├── global/
│   ├── page.tsx                # Mapa mundial D3 (dark theme)
│   └── loading.tsx             # Skeleton
├── page.tsx                    # Dashboard BR (~80 linhas, orquestrador)
└── layout.tsx                  # Metadata + SEO
middleware.ts                   # Rate limiting (100 req/min/IP) + headers
vercel.json                    # Cron schedule
```

### Cache Multi-Camada

```
Usuário → Browser (15s) → CDN downstream (30s) → Vercel Edge (60s) → KV (<1ms)
```

| Camada | TTL | Propósito |
|--------|-----|-----------|
| Browser | 15s | Dados razoavelmente frescos para usuário ativo |
| CDN downstream | 30s + 2min stale | Absorve tráfego multi-região |
| Vercel Edge | 60s + 2min stale | Protege origem de burst traffic |
| Vercel KV | 10min TTL | Dados escritos pelo cron, <1ms leitura global |

---

## Mapa Global de Eleições (/global)

Rota dedicada com mapa mundial interativo em dark theme financeiro.

- **D3.js + TopoJSON** — Natural Earth projection, SVG render
- **14 países monitorados** com dados ao vivo do Polymarket
- **Hover** — tooltip com candidato líder, probabilidade, volume
- **Click** — drawer lateral com breakdown completo de candidatos
- **Heatmap** — escala de cores baseada em probabilidade do líder
- **Pulsing markers** — indicadores animados para mercados ao vivo
- **Zoom/Pan** — d3-zoom com limites (1x-8x)
- **React.memo** — evita re-renders desnecessários do mapa
- **Dynamic import** — D3 carregado apenas no cliente (ssr: false)

---

## Segurança (OWASP)

Implementa **OWASP Top 10 2025 (Web)** e **OWASP API Security Top 10 2023**:

| OWASP | Medida |
|---|---|
| **A02** | HSTS max-age 2 anos + preload |
| **A03** | Sanitização HTML, validação de slugs |
| **A05** | CSP, X-Frame-Options DENY, poweredByHeader false |
| **A08** | safeJsonParse, try-catch em todas as APIs |
| **A10** | Allowlist de hosts para fetch externo |
| **API4** | Rate limiting 100 req/min/IP (middleware) |
| **API8** | safeFetch com timeout 10s + AbortController |

**Circuit Breaker (Polymarket):**
```
CLOSED → 3 falhas → OPEN (skip 5min) → HALF_OPEN (1 probe) → CLOSED
```

---

## Polymarket Integration

Pipeline completo de integração com a API do Polymarket:

| Componente | Arquivo | Função |
|------------|---------|--------|
| **Client** | `lib/polymarket/client.ts` | Fetch com retry 1x, timeout 10s, circuit breaker |
| **Registry** | `lib/polymarket/country-market-map.ts` | 14 países × 18 mercados, slug → ISO3 |
| **Aggregador** | `lib/polymarket/bootstrap.ts` | fetch → parse → group → normalize |
| **WebSocket** | `lib/polymarket/ws.ts` | Real-time com exponential backoff |
| **Cron** | `api/cron/refresh-elections/` | Cada 60s → KV write |
| **API** | `api/global-map/` | KV read <1ms, 4 níveis de fallback |

---

## APIs

| Endpoint | Descrição | Fonte | Segurança |
|---|---|---|---|
| `/api/global-map` | Eleições globais normalizadas | KV (cron) → Polymarket (fallback) | Rate limit, cache multi-camada |
| `/api/cron/refresh-elections` | Refresh background | Polymarket → KV | CRON_SECRET auth |
| `/api/polymarket` | Odds presidenciais BR | Polymarket direta | Slug validation, timeout 10s |
| `/api/polls` | Pesquisas de +17 institutos | JSON local | File existence check |
| `/api/news` | Notícias categorizadas | Google News + Firecrawl | URL validation, timeout 10s |
| `/api/analysis-cards` | Análises dinâmicas | JSON local | File existence check |
| `/api/analysis-criteriosa` | Análise dos 4 primeiros | JSON local | File existence check |
| `/api/global-elections` | Eleições globais (legado) | Polymarket | Timeout, safe JSON parse |

---

## Tech Stack

| Tecnologia | Uso |
|---|---|
| **Next.js 14** | App Router, RSC, TypeScript |
| **D3.js + TopoJSON** | Mapa global SVG interativo |
| **Tailwind CSS** | Design system com cores centralizadas |
| **Vercel** | Hosting, Edge, Middleware, Cron, KV |
| **Polymarket API** | Mercados de previsão (18 mercados, 14 países) |
| **Google News RSS** | Notícias de múltiplos veículos |
| **Firecrawl** | Scraping profundo de portais |

---

## Acessibilidade

- `aria-modal="true"` em modais
- `aria-label` em botões interativos
- `focus:outline` para navegação por teclado
- `role="meter"` em barras com `aria-valuenow`
- `aria-hidden` em emojis decorativos
- Skip-to-content link
- Roles semânticos: `banner`, `main`, `contentinfo`, `dialog`

---

## Design

- **Dashboard**: Sapphire Blue (#0F52BA) em fundo branco
- **Mapa Global**: Dark theme financeiro (#07111f)
- **Cores centralizadas**: `primary`, `danger`, `dark`, `light-bg`, `light-border`
- **Font**: Inter (Google Fonts)
- **Responsive**: Mobile-first

---

## O que significa AFOS?

| Letra | Significado | Descrição |
|---|---|---|
| **A** | Astuteness | Inteligência para cruzar dados e gerar clareza |
| **F** | Faith | Confiança em informações verdadeiras e imparciais |
| **O** | Optimism | Visão de futuro baseada em inovação e transparência |
| **S** | Synthesis | Transformar dados complexos em entendimento simples |

---

## Configuração

```bash
# Clone
git clone https://github.com/andrefelipe-afos/afos-analitica-2026.git
cd afos-analitica-2026

# Instalar
npm install

# Configurar (opcional)
cp .env.example .env.local
# Preencher FIRECRAWL_API_KEY se quiser scraping de notícias

# Desenvolvimento
npm run dev

# Build
npm run build

# Produção (Vercel)
# 1. Push para GitHub
# 2. Conectar repo no Vercel Dashboard
# 3. Storage → Create KV Database → Connect
# 4. Deploy automático
```

---

## Licença

Projeto open source. Qualquer pessoa pode estudar, auditar e contribuir.

---

## Versões anteriores

- [README-v1.md](README-v1.md) — Versão original (pré-refatoração)

---

*AFOS Analytics — Plataforma Global de Inteligência Eleitoral*
