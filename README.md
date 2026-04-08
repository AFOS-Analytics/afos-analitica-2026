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

### Pipeline de Dados (Cron + Upstash Redis)

```
Background:  Cron (60s) → Polymarket (18 mercados paralelo) → Upstash Redis
Usuário:     Requisição → Redis read (<1ms) → resposta
             10M usuários = mesma carga que 10 usuários
```

**Cascata de fallback (4 níveis):**

| Nível | Condição | Resposta |
|-------|----------|----------|
| 1 | Redis com dados frescos | <1ms (99.9% dos casos) |
| 2 | Redis vazio | Fetch direto Polymarket (~4s) |
| 3 | Polymarket falhou | Dados em memória (último resultado bom) |
| 4 | Sem nenhum dado | HTTP 503 + Retry-After: 60 |

### Estrutura do Projeto

```
app/
├── types/
│   ├── index.ts                   # 19 interfaces TypeScript
│   └── global-map.ts              # Tipos do mapa global + ISO3
├── hooks/useDashboardData.ts      # Custom hooks de data fetching
├── lib/
│   ├── utils.ts                   # Funções utilitárias
│   ├── security.ts                # Documentação de segurança OWASP
│   ├── kv.ts                      # Wrapper Upstash Redis + health check
│   ├── map-colors.ts              # Tokens visuais do mapa global
│   ├── mock-elections.ts          # Mock data (fallback offline)
│   ├── cache/headers.ts           # Cache multi-camada
│   ├── polymarket/
│   │   ├── client.ts              # API client (retry, timeout, circuit breaker)
│   │   ├── country-market-map.ts  # Registry slug → ISO3 (14 países, 18 mercados)
│   │   ├── bootstrap.ts           # Aggregador: fetch → parse → normalize
│   │   └── normalize.ts           # Payload optimization (compartilhado)
│   └── email/
│       ├── subscribers.ts         # CRUD subscribers (Redis Set + Hash)
│       ├── resend.ts              # Resend service (welcome, alertas, resumo)
│       └── templates.ts           # 4 templates HTML (sem emojis, ASCII safe)
├── components/
│   ├── ui.tsx                     # Card, HBar, Stars, SectionTitle (ARIA)
│   ├── Header.tsx                 # Header com navegação + skip link
│   ├── Footer.tsx                 # Footer + botão "Voltar ao topo"
│   ├── EmailPopup.tsx             # Popup captura email (30s + scroll + LGPD)
│   ├── ModalAbout.tsx / ModalMetas.tsx / ModalGlobal.tsx
│   ├── PolymarketSection.tsx / PollsSection.tsx / CandidatesSection.tsx
│   ├── NewsSection.tsx / SentimentSection.tsx
│   ├── InssSection.tsx / BancoMasterSection.tsx / StfSection.tsx
│   └── global-map/
│       ├── GlobalElectionMap.tsx   # D3 + TopoJSON + SVG (React.memo)
│       ├── GlobalMapTooltip.tsx    # Tooltip hover (PT-BR)
│       ├── GlobalMapLegend.tsx     # Legenda de cores (PT-BR)
│       └── GlobalCountryDrawer.tsx # Drawer lateral com candidatos (PT-BR)
├── api/
│   ├── polymarket/                # Odds presidenciais BR
│   ├── polls/                     # Pesquisas eleitorais
│   ├── news/                      # Notícias (Google News + Firecrawl)
│   ├── analysis-cards/            # Análises dinâmicas
│   ├── analysis-criteriosa/       # Análise dos 4 primeiros
│   ├── global-elections/          # Eleições globais (legado)
│   ├── global-map/                # Mapa global (Redis → Polymarket fallback)
│   ├── cron/refresh-elections/    # Cron 60s → Polymarket → Redis
│   ├── health/                    # Health check (Redis, cron, circuit, subscribers)
│   ├── subscribe/                 # POST captura email (rate limit, honeypot)
│   └── test-email/                # Teste de envio dos 4 templates
├── global/
│   ├── page.tsx                   # Mapa mundial D3 (dark theme, standalone)
│   └── loading.tsx                # Skeleton
├── page.tsx                       # Dashboard BR (~92 linhas, orquestrador)
└── layout.tsx                     # Metadata + SEO + Vercel Analytics
middleware.ts                      # Rate limiting (100 req/min/IP) + headers
vercel.json                        # Cron schedule (cada 60s)
```

### Cache Multi-Camada

```
Usuário → Browser (60s) → Vercel Edge (5min) → Redis (<1ms)
```

| Camada | TTL | Propósito |
|--------|-----|-----------|
| Browser | 60s | Dados frescos para usuário ativo |
| Vercel Edge | 5min + 10min stale | Protege origem de burst traffic |
| Upstash Redis | 10min TTL | Dados escritos pelo cron, <1ms leitura global |

---

## Mapa Global de Eleições

Disponível no botão **"Global"** do header e como rota dedicada `/global`.

- **D3.js + TopoJSON** — Natural Earth projection, SVG render
- **14 países monitorados** com dados ao vivo do Polymarket
- **Hover** — tooltip com candidato líder, probabilidade, volume
- **Click** — drawer lateral com breakdown completo de candidatos
- **Heatmap** — escala de cores baseada em probabilidade do líder
- **Pulsing markers** — indicadores animados para mercados ao vivo
- **Zoom/Pan** — d3-zoom com limites (1x-8x)
- **React.memo** — evita re-renders desnecessários
- **Dynamic import** — D3 carregado apenas no cliente (ssr: false)
- **Textos em PT-BR** — tooltip, legenda, drawer, loading

---

## Sistema de Email (Resend)

### Captura de Subscribers (Popup)

- Popup aparece após **30 segundos + scroll** (engajamento real)
- Theme **Sapphire Blue Light** (gradiente azul claro)
- **Checkbox de consentimento** desmarcado por padrão (LGPD compliant)
- **Honeypot** anti-bot (campo oculto no frontend + validação backend)
- **Rate limit específico**: 5 cadastros/IP/hora via Redis
- **Dismiss**: localStorage com TTL 24h (funciona entre abas)
- **Cadastro**: localStorage permanente (nunca mais aparece)
- **Idempotência**: email duplicado retorna sucesso sem erro

### Templates de Email (4)

| Template | Uso | Assunto |
|----------|-----|---------|
| **Welcome** | Novo subscriber | Bem-vindo ao AFOS Analytics |
| **Odds Alert** | Mudança significativa | Lula ▲ 42% — Brasil |
| **Daily Summary** | Resumo diário | AFOS Resumo — [data] |
| **System Alert** | Cron/health falhou | AFOS Alert: [tipo] |

- HTML puro, sem emojis (previne `??` em clientes de email)
- Font Arial (compatibilidade máxima)
- Header Sapphire Blue com branding AFOS
- Mobile-friendly (tabelas responsivas)

### Armazenamento

```
Redis SET  afos:subscribers         → dedup
Redis HASH afos:subscriber:{email}  → { email, source, status, consentVersion, createdAt, updatedAt }
```

### Resend

- **Free tier**: 100 emails/dia
- **Remetente**: `onboarding@resend.dev` (free tier, sem domínio verificado)
- **Welcome email**: enviado automaticamente a novos subscribers
- **Preparado para**: alertas de odds, resumo diário, alertas de sistema

---

## Observabilidade

### Health Check (`/api/health`)

```json
{
  "status": "healthy | degraded",
  "components": {
    "redis": { "ok": true },
    "cron": { "ok": true, "lastUpdate": "...", "ageSeconds": 45 },
    "polymarket": { "circuit": "CLOSED", "failures": 0 },
    "subscribers": { "total": 42 }
  }
}
```

### Vercel Analytics

Integrado via `@vercel/analytics` — métricas de tráfego, performance e uso.

---

## Segurança (OWASP)

Implementa **OWASP Top 10 2025 (Web)** e **OWASP API Security Top 10 2023**:

| OWASP | Medida |
|---|---|
| **A02** | HSTS max-age 2 anos + preload |
| **A03** | Validação de slugs, sanitização de entrada |
| **A05** | CSP, X-Frame-Options DENY, poweredByHeader false |
| **A08** | try-catch em todas as APIs, safe JSON parse |
| **A10** | Allowlist de hosts para fetch externo |
| **API4** | Rate limiting 100 req/min/IP + 5/IP/hora no subscribe |
| **API8** | Timeout 10s + AbortController em todos os fetch |

**Circuit Breaker (Polymarket):**
```
CLOSED → 3 falhas → OPEN (skip 5min) → HALF_OPEN (1 probe) → CLOSED
```

**Anti-spam (Subscribe):**
- Honeypot field (frontend + backend)
- Rate limit específico (5/IP/hora)
- Validação dupla (frontend + backend)
- Idempotência (email duplicado = sucesso silencioso)

---

## Polymarket Integration

| Componente | Arquivo | Função |
|------------|---------|--------|
| **Client** | `lib/polymarket/client.ts` | Fetch com retry 1x, timeout 10s, circuit breaker |
| **Registry** | `lib/polymarket/country-market-map.ts` | 14 países x 18 mercados, slug → ISO3 |
| **Aggregador** | `lib/polymarket/bootstrap.ts` | fetch → parse → group → normalize |
| **Normalize** | `lib/polymarket/normalize.ts` | Payload optimization (compartilhado) |
| **Cron** | `api/cron/refresh-elections/` | Cada 60s → Redis write (autenticado) |
| **API** | `api/global-map/` | Redis read <1ms, 4 níveis de fallback |

---

## APIs

| Endpoint | Descrição | Fonte | Segurança |
|---|---|---|---|
| `/api/global-map` | Eleições globais normalizadas | Redis → Polymarket | Rate limit, cache, 4 fallbacks |
| `/api/cron/refresh-elections` | Refresh background | Polymarket → Redis | x-vercel-cron + CRON_SECRET |
| `/api/health` | Status do sistema | Redis + circuit breaker | revalidate=0 |
| `/api/subscribe` | Captura email | Redis | Rate limit 5/IP/h, honeypot |
| `/api/polymarket` | Odds presidenciais BR | Polymarket | Slug validation, timeout 10s |
| `/api/polls` | Pesquisas +17 institutos | JSON local | File check |
| `/api/news` | Notícias categorizadas | Google News + Firecrawl | URL validation, timeout |
| `/api/analysis-cards` | Análises dinâmicas | JSON local | File check |
| `/api/analysis-criteriosa` | Análise dos 4 primeiros | JSON local | File check |
| `/api/global-elections` | Eleições globais (legado) | Polymarket | Timeout, safe JSON parse |
| `/api/test-email` | Teste dos 4 templates | Resend | Autenticação cron |

---

## Tech Stack

| Tecnologia | Uso |
|---|---|
| **Next.js 14** | App Router, RSC, TypeScript |
| **D3.js + TopoJSON** | Mapa global SVG interativo |
| **Tailwind CSS** | Design system com cores centralizadas |
| **Vercel** | Hosting, Edge, Middleware, Cron |
| **Upstash Redis** | KV store, subscribers, rate limiting |
| **Resend** | Email transacional (welcome, alertas, resumo) |
| **Polymarket API** | Mercados de previsão (18 mercados, 14 países) |
| **Google News RSS** | Notícias de múltiplos veículos |
| **Firecrawl** | Scraping profundo de portais |
| **Vercel Analytics** | Métricas de tráfego e performance |

---

## Funcionalidades

| Seção | Descrição |
|-------|-----------|
| **Polymarket** | Odds ao vivo com dinheiro real (presidência, senado, STF, inflação) |
| **Pesquisas** | +17 institutos com classificação de confiabilidade + tabela comparativa |
| **Análise Criteriosa** | Pontos fortes/fracos dos 4 primeiros + cruzamento |
| **Perfil Candidatos** | 7 pré-candidatos com posição, riscos, odds |
| **Notícias** | Múltiplas fontes ao vivo (Google News + Firecrawl) |
| **Sentimento** | Redes sociais, tendências por espectro político |
| **INSS / Master / STF** | Escândalos ativos com impacto eleitoral |
| **Mapa Global** | D3 interativo com 14 países + calendário + bandeiras |
| **Email Popup** | Captura de subscribers com Resend (LGPD compliant) |
| **Health Check** | Monitoramento de Redis, cron, circuit breaker, subscribers |

---

## Acessibilidade

- `aria-modal="true"` em modais
- `aria-label` em todos os botões interativos
- `focus:outline` para navegação por teclado
- `role="meter"` em barras com `aria-valuenow`
- `aria-hidden` em emojis decorativos
- Skip-to-content link
- Roles semânticos: `banner`, `main`, `contentinfo`, `dialog`
- Botão "Voltar ao topo" no footer com scroll suave

---

## UX

- **Popup Sapphire Blue Light** — gradiente azul claro, discreto, não intrusivo
- **Mapa D3 dark theme** — visual financeiro premium
- **Dashboard light** — Sapphire Blue (#0F52BA) em fundo branco
- **Cores centralizadas**: `primary`, `primary-dark`, `danger`, `dark`, `light-bg`
- **Font**: Inter (Google Fonts)
- **Responsive**: Mobile-first, Android e iOS
- **Botão "Voltar ao topo"** no footer

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

# Configurar
cp .env.example .env.local
# Preencher: UPSTASH_REDIS, FIRECRAWL_API_KEY, RESEND_API_KEY, CRON_SECRET

# Desenvolvimento
npm run dev

# Build
npm run build

# Produção (Vercel)
# 1. Push para GitHub
# 2. Conectar repo no Vercel Dashboard
# 3. Marketplace → Upstash Redis → Install → Connect
# 4. Environment Variables → RESEND_API_KEY
# 5. Deploy automático + cron ativo a cada 60s
```

---

## Licença

Projeto open source. Qualquer pessoa pode estudar, auditar e contribuir.

---

## Versões anteriores

- [README-v1.md](README-v1.md) — Versão original (pré-refatoração)

---

*AFOS Analytics — Plataforma Global de Inteligência Eleitoral*
