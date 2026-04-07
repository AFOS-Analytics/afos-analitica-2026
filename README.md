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

O projeto foi refatorado seguindo boas práticas de engenharia:

```
app/
├── types/index.ts              # 19 interfaces TypeScript centralizadas
├── hooks/useDashboardData.ts   # Custom hooks de data fetching
├── lib/
│   ├── utils.ts                # Funções utilitárias compartilhadas
│   └── security.ts             # OWASP security utilities
├── components/
│   ├── ui.tsx                  # Componentes base (Card, HBar, Stars, SectionTitle)
│   ├── Header.tsx              # Header com navegação
│   ├── Footer.tsx              # Footer com disclaimer
│   ├── ModalAbout.tsx          # Modal "Sobre"
│   ├── ModalMetas.tsx          # Modal "Metas"
│   ├── ModalGlobal.tsx         # Modal "Eleições Globais" com mapa SVG
│   ├── PolymarketSection.tsx   # Odds de mercados de previsão
│   ├── PollsSection.tsx        # Pesquisas eleitorais + análise criteriosa
│   ├── CandidatesSection.tsx   # Perfil dos candidatos
│   ├── NewsSection.tsx         # Notícias ao vivo
│   ├── SentimentSection.tsx    # Sentimento popular
│   ├── InssSection.tsx         # Escândalo INSS
│   ├── BancoMasterSection.tsx  # Banco Master
│   └── StfSection.tsx          # Credibilidade do STF
├── api/                        # 6 API routes (hardened)
├── page.tsx                    # Orquestrador (~80 linhas)
└── layout.tsx                  # Metadata + SEO
middleware.ts                   # Rate limiting + security headers
```

**page.tsx: de 1242 linhas → 80 linhas** — toda a lógica distribuída em componentes especializados.

---

## Segurança (OWASP)

O projeto implementa medidas de segurança baseadas em **OWASP Top 10 2025 (Web)** e **OWASP API Security Top 10 2023**:

| OWASP | Medida Implementada |
|---|---|
| **A02 - Cryptographic Failures** | HSTS com max-age 2 anos, preload |
| **A03 - Injection** | Sanitização HTML, validação de slugs (regex) |
| **A05 - Security Misconfiguration** | CSP, X-Frame-Options DENY, poweredByHeader false |
| **A08 - Data Integrity** | safeJsonParse com fallback, try-catch em todas as APIs |
| **A10 - SSRF** | Allowlist de hosts para fetch externo |
| **API4 - Resource Consumption** | Rate limiting 100 req/min/IP via middleware |
| **API8 - Automated Threats** | safeFetch com timeout 10s + AbortController |

**Arquivos de segurança:**
- `middleware.ts` — Rate limiting por IP, security headers em APIs
- `app/lib/security.ts` — Sanitização, validação URL, safe fetch, safe JSON parse
- `next.config.mjs` — CSP, HSTS, X-Content-Type-Options, Permissions-Policy

---

## Funcionalidades

### 📊 Mercados de Previsão (Polymarket)
- Odds ao vivo com dinheiro real
- Presidência, 2º e 3º lugar no 1º turno
- STF impeachment, Senado, Inflação 2026
- Atualizado continuamente

### 📋 Pesquisas Eleitorais — +17 Institutos
- AtlasIntel/Bloomberg, Datafolha, Quaest/Genial, Paraná Pesquisas, Gerp, Real Time Big Data, Ipec, MDA, PoderData e outros
- Cenários de 1º e 2º turno
- Classificação de confiabilidade por instituto
- Tabela comparativa Pesquisas vs Polymarket

### 🔬 Análise Criteriosa
- Pontos fortes e fracos dos 4 primeiros colocados
- Cruzamento de múltiplos institutos vs Polymarket

### 👤 Perfil dos Candidatos
- 7 pré-candidatos detalhados com posição política, riscos e odds

### 📰 Notícias ao Vivo
- Múltiplas fontes nacionais em tempo real
- Google News RSS + Firecrawl AI

### 📡 Sentimento Popular
- Análise de redes sociais e opinião pública
- Tendências por espectro político

### 🔴 INSS / 🏦 Banco Master / ⚖️ STF
- Escândalos ativos com impacto eleitoral
- Odds de impeachment STF via Polymarket

### 🌍 Global — Eleições pelo Mundo
- Mapa mundial interativo com eleições monitoradas
- Cards clicáveis com dados Polymarket de 11+ países

---

## Acessibilidade

- `aria-modal="true"` em todos os modais
- `aria-label` em todos os botões interativos
- `focus:outline` para navegação por teclado
- `role="meter"` em barras de progresso com `aria-valuenow`
- `aria-hidden` em emojis decorativos
- Skip-to-content link
- Roles semânticos: `banner`, `main`, `contentinfo`, `dialog`
- Contraste de cores validado

---

## Tech Stack

| Tecnologia | Uso |
|---|---|
| **Next.js 14** | Framework React, App Router, TypeScript |
| **Tailwind CSS** | Estilização com cores centralizadas |
| **Vercel** | Hosting, ISR, Middleware |
| **Polymarket API** | Odds de mercado de previsão ao vivo |
| **Google News RSS** | Notícias de múltiplos veículos |
| **Firecrawl** | Scraping profundo de portais |

---

## APIs

| Endpoint | Descrição | Cache | Segurança |
|---|---|---|---|
| `/api/polymarket` | Odds presidenciais + STF + Senado + Inflação | 2h | Slug validation, timeout 10s |
| `/api/polls` | Pesquisas de +17 institutos | 2h | File existence check |
| `/api/news` | Notícias categorizadas | 30min | URL validation, timeout 10s |
| `/api/analysis-cards` | Análises dinâmicas | 2h | File existence check |
| `/api/analysis-criteriosa` | Análise dos 4 primeiros | 2h | File existence check |
| `/api/global-elections` | Eleições globais (11+ países) | 2h | Safe JSON parse, timeout 10s |

Todas as APIs protegidas por rate limiting (100 req/min/IP) via middleware.

---

## Design

- **Cores centralizadas**: `primary` (#0F52BA), `danger` (#DC2626), `dark` (#1a1a1a), `light-bg` (#F8FAFC)
- **Font**: Inter (Google Fonts)
- **Responsive**: Mobile-first, Android e iOS
- **Favicon**: AF/OS em sapphire blue

---

## O que significa AFOS?

| Letra | Significado | Descrição |
|---|---|---|
| **A** | Astuteness | Inteligência para cruzar dados e gerar clareza |
| **F** | Faith | Confiança em informações verdadeiras e imparciais |
| **O** | Optimism | Visão de futuro baseada em inovação e transparência |
| **S** | Synthesis | Transformar dados complexos em entendimento simples |

---

## Diferencial

O AFOS Analytics é uma plataforma única que conecta, no mesmo lugar:

- O que as pessoas dizem (pesquisas)
- O que o mercado acredita (apostas reais)
- O que está sendo narrado (mídia)
- O que está sendo sentido (redes sociais)

Isso permite enxergar a eleição por múltiplas perspectivas — e não depender de uma única fonte.

---

## Licença

Projeto open source. Qualquer pessoa pode estudar, auditar e contribuir.

---

## Versões anteriores

- [README-v1.md](README-v1.md) — Versão original do README (pré-refatoração)

---

*AFOS Analytics — Plataforma Global de Inteligência Eleitoral*
