# AFOS Analytics — V1

🇧🇷 Português | 🇺🇸 [Read in English](README-v1.md)

> Este é o README original da V1, preservado para mostrar como tudo começou. Veja o [README atual](../README.pt-BR.md) para a versão mais recente.

**Dashboard de Inteligência Eleitoral — Eleições Presidenciais Brasil 2026**

**[afos-analytics.com](https://afos-analytics.com)**

---

## Sobre

O AFOS Analytics é um dashboard de inteligência eleitoral que monitora em tempo real as eleições presidenciais do Brasil em 2026. Combina dados de mercados de previsão internacionais de apostas reais em eventos futuros (Polymarket), pesquisas de opinião eleitorais tradicionais de +17 institutos, notícias da grande imprensa e análises estratégicas — tudo em um único painel visual, acessível pelo celular ou computador.

**Projeto único e inédito em uma eleição no mundo.**

---

## Funcionalidades

### Polymarket — Mercado de Previsão
- Odds ao vivo com dinheiro real de quem vence a presidência
- Dados de 2º e 3º lugar no 1º turno
- Impeachment STF, Senado, Inflação 2026
- Atualizado a cada 2 horas (ISR)

### Pesquisas Eleitorais — +17 Institutos
- AtlasIntel/Bloomberg, Datafolha, Quaest/Genial, Paraná Pesquisas, Gerp, Real Time Big Data, Ipec, MDA, PoderData e outros
- Múltiplos cenários de 1º e 2º turno
- Classificação de confiabilidade por instituto (1 a 5 estrelas)
- Tabela comparativa Pesquisas vs Polymarket

### Análise Criteriosa
- Pontos fortes e fracos dos 4 primeiros colocados
- Cruzamento de 5+ institutos vs Polymarket
- Veredicto analítico para cada candidato

### Perfil dos Pré-Candidatos
- 7 candidatos detalhados: Flávio Bolsonaro, Lula, Renan Santos, Ronaldo Caiado, Fernando Haddad, Romeu Zema, Tarcísio de Freitas
- Posição política, riscos, odds vs pesquisas

### Live Eleições News 120'
- Notícias ao vivo de +30 veículos nacionais
- Google News RSS + Firecrawl AI para scraping profundo
- Categorias: Presidência, Governadores, Senado, Banco Master, INSS, STF, Congresso
- Atualizado a cada 30 minutos

### Sentimento Popular
- Análise de redes sociais e opinião pública
- Tendências por espectro político (Direita/Esquerda/Terceira Via)
- Atualizado a cada 2 horas com base em notícias

### Escândalo INSS e o Caso Lulinha
- CPMI do INSS, investigações da PF
- Impacto na imagem de Lula e na gestão federal

### Impacto do Escândalo Banco Master
- Rombo BRB, Operação Compliance Zero
- Impacto nacional e no Distrito Federal

### Credibilidade do STF — Impacto Eleitoral
- Nexo STF × Banco Master (Toffoli, Moraes, Gilmar, Dino)
- Odds de impeachment via Polymarket

### Global — Eleições pelo Mundo
- Mapa mundial interativo com eleições monitoradas
- Cards clicáveis com dados Polymarket de 11+ países
- Calendário eleitoral global

---

## Tech Stack

| Tecnologia | Uso |
|---|---|
| **Next.js 14** | Framework React, App Router, TypeScript |
| **Tailwind CSS** | Estilização, design responsivo |
| **Vercel** | Hosting, ISR (Incremental Static Regeneration) |
| **Polymarket API** | Odds de mercado de previsão ao vivo |
| **Google News RSS** | Notícias de +30 veículos |
| **Firecrawl** | Scraping profundo de portais (Poder360, Metrópoles, CNN, Gazeta, UOL) |

---

## APIs

| Endpoint | Descrição | Cache |
|---|---|---|
| `/api/polymarket` | Odds presidenciais + STF + Senado + Inflação | 2h |
| `/api/polls` | Pesquisas de 5+ institutos + tabela comparativa | 2h |
| `/api/news` | Notícias categorizadas (Google News + Firecrawl) | 30min |
| `/api/analysis-cards` | Análises dinâmicas dos 4 cards (sentimento, INSS, Master, STF) | 2h |
| `/api/global-elections` | Dados globais de eleições (11+ países) | 2h |

---

## Design

- **Cores**: Sapphire Blue (#0F52BA), Branco, Preto, Vermelho (#DC2626) pontual
- **Font**: Inter (Google Fonts)
- **Responsive**: Mobile-first, funciona em Android e iOS
- **Favicon**: AF/OS em sapphire blue

---

## Atualizações Automáticas

| Componente | Frequência |
|---|---|
| Polymarket (odds) | A cada 2 horas |
| Live Eleições News | A cada 30 minutos |
| Análises dos cards | A cada 2 horas (quando houver novidade) |
| Pesquisas eleitorais | Quando sair nova pesquisa de qualquer instituto |

---

## O que significa AFOS?

| Letra | Significado | Descrição |
|---|---|---|
| **A** | Amor | À liberdade e ao desenvolvimento das pessoas |
| **F** | Fé | No potencial da sociedade e na informação verdadeira e imparcial |
| **O** | Ousadia | Para inovar e mostrar a realidade sem filtros |
| **S** | Sabedoria | Para analisar com equilíbrio e responsabilidade |

---

## Diferencial

O AFOS Analytics é o único e inédito dashboard brasileiro que cruza Polymarket (mercado internacional de apostas reais em eventos futuros) com pesquisas nacionais de +17 institutos + análise de escândalos + sentimento de redes sociais em um único painel.

**Gratuito. Sem login. Atualizado automaticamente. Mobile e desktop.**

---

## Licença

Apache License 2.0 — Veja [LICENSE](../LICENSE)

---

*AFOS Analytics — Dashboard de Inteligência Eleitoral*
