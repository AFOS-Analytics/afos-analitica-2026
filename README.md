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

## Funcionalidades

### 📊 Mercados de Previsão (Polymarket)
- Odds ao vivo com dinheiro real
- Presidência, 2º e 3º lugar no 1º turno
- STF impeachment (13.5%), Senado (PL 77.5%), Inflação 2026
- Atualizado continuamente

### 📋 Pesquisas Eleitorais — +17 Institutos
- AtlasIntel/Bloomberg, Datafolha, Quaest/Genial, Paraná Pesquisas, Gerp, Real Time Big Data, Ipec, MDA, PoderData e outros
- Cenários de 1º e 2º turno
- Classificação de confiabilidade por instituto
- Tabela comparativa Pesquisas vs Polymarket

### 🔬 Análise Criteriosa
- Pontos fortes e fracos dos 4 primeiros colocados
- Cruzamento de múltiplos institutos vs Polymarket
- Análise estratégica para cada candidato

### 👤 Perfil dos Candidatos
- 7 pré-candidatos detalhados com posição política, riscos e odds

### 📰 Notícias ao Vivo
- Múltiplas fontes nacionais em tempo real
- Google News RSS + Firecrawl AI
- Categorias: Presidência, Governadores, Senado, Banco Master, INSS, STF, Congresso

### 📡 Sentimento Popular
- Análise de redes sociais e opinião pública
- Tendências por espectro político (Direita / Esquerda / Terceira Via)

### 🔴 INSS / 🏦 Banco Master / ⚖️ STF
- Escândalos ativos com impacto eleitoral
- Nexo STF × Banco Master (Toffoli, Moraes, Gilmar, Dino)
- Odds de impeachment STF: 13.5% (Polymarket)

### 🌍 Global — Eleições pelo Mundo
- Mapa mundial interativo com eleições monitoradas
- Cards clicáveis com dados Polymarket de 11+ países
- Calendário eleitoral global

---

## Posicionamento

O AFOS Analytics não é mídia. Não é apenas uma ferramenta.

> **É infraestrutura de inteligência política para a economia global.**

Uma camada que conecta informação pública, expectativa de mercado e decisão econômica — permitindo que eleitor local e capital internacional analisem o mesmo conjunto de dados.

---

## Modelo de Valor

| Camada | Descrição |
|---|---|
| **Pública (atenção)** | Acesso gratuito, educação cívica e financeira, distribuição global |
| **Institucional (fluxo financeiro)** | APIs de dados, inteligência para fundos/bancos/governos, dados estruturados e modelos de risco |

---

## Efeito Sistêmico

```
Transparência → Decisão informada → Melhor representação → Políticas eficientes → Crescimento sustentável
Previsibilidade → Investimento → Emprego → Renda → Arrecadação → Serviços públicos melhores
Accountability → Menos corrupção → Melhor uso de recursos → Infraestrutura → Qualidade de vida
```

---

## Tech Stack

| Tecnologia | Uso |
|---|---|
| **Next.js 14** | Framework React, App Router, TypeScript |
| **Tailwind CSS** | Estilização, design responsivo |
| **Vercel** | Hosting, ISR (Incremental Static Regeneration) |
| **Polymarket API** | Odds de mercado de previsão ao vivo |
| **Google News RSS** | Notícias de múltiplos veículos |
| **Firecrawl** | Scraping profundo de portais |

---

## APIs

| Endpoint | Descrição | Cache |
|---|---|---|
| `/api/polymarket` | Odds presidenciais + STF + Senado + Inflação | 2h |
| `/api/polls` | Pesquisas de +17 institutos + tabela comparativa | 2h |
| `/api/news` | Notícias categorizadas (Google News + Firecrawl) | 30min |
| `/api/analysis-cards` | Análises dinâmicas (sentimento, INSS, Master, STF) | 2h |
| `/api/analysis-criteriosa` | Análise criteriosa dos 4 primeiros colocados | 2h |
| `/api/global-elections` | Dados globais de eleições (11+ países) | 2h |

---

## Design

- **Cores**: Sapphire Blue (#0F52BA), Branco, Preto, Vermelho (#DC2626) pontual
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

- [README-v1.md](README-v1.md) — Versão original do README (pré-globalização)

---

*AFOS Analytics — Plataforma Global de Inteligência Eleitoral*
