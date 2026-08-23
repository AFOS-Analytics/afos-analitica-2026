# AFOS Tradeoff — Brazil Political Risk Weekly

Gerar edição semanal técnica do AFOS Tradeoff seguindo o template HTML preview firmado em 23/Mai/2026 (validação por Custódio + Cunha prevista pós-Edição №1 silent launch). Audiência: leitor profissional de mercado (research, buy-side, treasury, mesa institucional).

## Pré-requisitos obrigatórios

Antes de executar este comando:

1. **O Daily da semana** deve estar atualizado — `/atualizar-brz` rodado nos últimos 1-2 dias com dados frescos dos JSONs (`public/analysis-criteriosa.json`, `public/analysis-data.json`, `public/polls-data.json`).
2. **Snapshot Polymarket atual** — preço/volume USD de cada contrato relevante da semana. Se mais de ~12h desde último `/atualizar-brz`, refazer.
3. **Histórico Neon** — séries de Δ semana exigem snapshots persistidos. Verificar via API ou Neon direto que tem dados da semana inteira.

Se faltar qualquer pré-requisito, PARAR e pedir ao usuário para rodar `/atualizar-brz` primeiro.

## ETAPA 1: Coletar baseline da semana

1. Ler `public/analysis-criteriosa.json` (campo `cruzamento`, `subtitle`, `candidates[].analise`)
2. Ler `public/analysis-data.json` (cards `sentimento`, `inss`, `bancoMaster`, `stf`)
3. Snapshot Polymarket atual via `/api/polymarket?fresh=1` (cruzar com snapshots históricos Neon pra calcular Δ semana). 🔴 **O `?fresh=1` é obrigatório: sem ele a rota devolve o CACHE** e o Δ da semana passa a ser calculado contra uma leitura de minutos atrás. Conferir o `fetchedAt`, não o valor.
4. Determinar número da edição (`issueNumber`): N + 1 onde N = `listPublishedTradeoffs().length`
5. Determinar `weekStart` e `weekEnd`: tipicamente seg-sex da semana anterior à publicação (publicação seg = cobre seg-sex anterior)
6. Cadência fixa: **publicação toda segunda-feira**. Verificar dia da semana antes de gerar

## ETAPA 2: Estruturar markdown seguindo o template

Criar arquivo em `public/afos-tradeoff/{YYYY-MM-DD}.md` (data da segunda-feira de publicação) com frontmatter canônico:

```yaml
---
date: YYYY-MM-DD                    # Segunda da publicação
issueNumber: N                      # 1, 2, 3... (autoincrement)
weekStart: YYYY-MM-DD               # Segunda da semana coberta
weekEnd: YYYY-MM-DD                 # Sexta da semana coberta
updatedAt: "DD/MM/YYYY, HH:MM"
title: "AFOS Tradeoff — Edição №N · Semana de DD-DD MMM YYYY"
locale: pt-BR
status: draft                       # OBRIGATORIAMENTE draft inicial. Flip published só via scripts/publish-afos-tradeoff.ts {date} APÓS revisão humana.
sinalDaSemana: "[1-2 parágrafos sintetizando o sinal mais relevante da semana — equivalente do lede do Daily mas focado em pricing/mercado/divergência. Cita números-chave em negrito (Lula 45.50%, gap +17.75pp, STF impeach 6.65%). Linka mercados Polymarket relevantes. 250-450 palavras.]"
---
```

⚠️ **REGRA DE PUBLICAÇÃO (Fase 1.1 — publish gate):** Toda edição nova começa como `status: draft`. Isso garante:
- Página `/[locale]/tradeoff/br/{data}` retorna 404 em produção (mas acessível em Vercel preview pra revisão)
- `sitemap.xml` NÃO lista a draft (Google não indexa)
- `/feed/tradeoff.xml` NÃO inclui draft (subscritores RSS não recebem push)
- `llms.txt` NÃO inclui draft (LLM crawlers não veem)
- `getLatestDate()` NÃO retorna draft (redirect `/tradeoff` → `/tradeoff/br` continua na última publicada)

⚠️ **A rota ganhou país em 01/Ago/2026.** Este comando é o do BRASIL: as edições ficam em `/[locale]/tradeoff/br/{data}` e os arquivos seguem na RAIZ de `public/afos-tradeoff/` (só os outros países vão para subpasta). Ver `project_tradeoff_multipais_arquitetura` na memória.

Flip pra `published` via:
```bash
npx tsx scripts/publish-afos-tradeoff.ts YYYY-MM-DD --all-locales
```

## ETAPA 2.5: 9 seções obrigatórias do corpo (espelhando template HTML preview)

Estrutura editorial canônica firmada com Custódio + Cunha em 23/Mai/2026. Não desviar sem pedido explícito.

### 1. Executive Summary
- **3 summary cards** com a métrica mais relevante de cada eixo da semana
  - Card 1: gap presidencial principal (ex: "Gap Lula × Flávio: +17.75pp · ↓1.25pp em semana")
  - Card 2: contrato de risco institucional (ex: "STF impeach <2027: 6.65% · ↑0.20pp em semana")
  - Card 3: indicador macro (ex: "Cauda CPI ≥6.50%: 14.05% · ↓1.80pp em semana")
- Parágrafo síntese (~150 palavras) introduzindo o tema central da semana

### 2. Por que o AFOS não suaviza
- Texto fixo OU adaptado com cenário da semana sobre como média ponderada cancela informação útil
- Componente visual "anti-avg" — coluna esquerda "se fosse média" (strike-through) vs direita "AFOS reporta"
- Footer com `<strong>Por que importa:</strong>` explicando que divergência É o sinal

### 3. Cenários ponderados para a semana
- **3 cenários** com probabilidades (~):
  - Cenário base (~60%) — caminho mais provável
  - Cenário contrário ao pricing atual (~30%) — mercado pode estar errado
  - Cauda (~10%) — evento de baixa probabilidade mas alto impacto

### 4. Indicator Grid
- Tabela com 7-9 contratos relevantes
- Colunas: Contrato | Preço atual | Δ semana | Vol USD acum. | Leitura implícita
- Highlight rows nas linhas mais relevantes (gap presidencial, contrato com maior Δ, STF impeach)
- Linkar cada contrato a `polymarket.com/event/{slug}`

### 5. Liquidez e estrutura de mercado
- Volume USD total acumulado no mercado presidencial (header)
- Breakdown top-5 nomes por volume USD acumulado com vol-bars proporcionais
- Anomaly callout (amber background) quando volume alto + probabilidade baixa = convicção concentrada precificada (ex: Tarcísio histórico)

### 6. Calendário de prints price-relevant
- Tabela compacta com 4-6 eventos da próxima semana
- Colunas: Data | Print | Amostra | Por que importa
- Highlight nas pesquisas Tier 1 (Datafolha, AtlasIntel, Quaest)
- Linkar registro TSE pra cada poll

### 7. Watch list — gatilhos da semana
- 5 bullets numerados com triggers a vigiar
- Cada bullet começa com `<strong>` enunciando o evento
- Foco em pontos-de-dado que mudariam o pricing

### 8. Metodologia
- Texto fixo OU adaptado sobre não-média + 3 sinais (Polymarket + pesquisas + 400 fontes imprensa)
- Apache 2.0 + link GitHub
- 2 parágrafos curtos

### 9. Leitura adicional · cobertura macro
- 4-6 referências a veículos financeiros (Bloomberg, Reuters, FT, Valor, Estadão)
- Marcar paywall quando aplicável
- Disclaimer: AFOS é fonte primária, links secundários são leitura complementar de contexto macro

## ETAPA 3: Disclaimer financeiro hard-coded (NÃO-NEGOCIÁVEL)

No final do `body` markdown, ANTES do footer de sources, sempre incluir bloco canônico (já renderizado pelo template, mas a skill deve mencionar pra reforçar):

> **Aviso obrigatório.** Este brief é pesquisa observacional sobre infraestrutura de mercados de previsão, pesquisas eleitorais e fluxo de notícias. **Não constitui recomendação de investimento.** Nenhuma posição é recomendada ou implícita. Polymarket é mercado USD-denominado operando fora da jurisdição brasileira; volumes mencionados são informativos, não orientativos. Decisões de portfólio são responsabilidade exclusiva do leitor e devem considerar análise independente, perfil de risco e regulamentação aplicável.

## REGRAS EDITORIAIS (não negociáveis)

- **Tom técnico, não narrativo** — research/buy-side audience; sem floreio jornalístico
- **Volume USD inline obrigatório** — toda menção de contrato Polymarket cita preço + volume USD acumulado (mesma regra do Daily firmada 17/Mai)
- **NÃO citar `liquidityNum`** (decisão 21/Mai pós-pushback Rogério Menezes — liquidez baixa ≠ preço errado em mercado arbitrado)
- **Zero recomendação de investimento explícita ou implícita** — disclaimer hard-coded reforça mas linguagem editorial precisa ser observacional
- **Cada alegação factual com link** — para fonte primária (Polymarket event, registro TSE, matéria de veículo)
- **Datas explícitas** — "17/Mai noite" não "ontem"
- **Variações ↑↓pp sempre citadas** com janela temporal (em 20h, em semana, em 72h)
- **Anti-AI tells:** evitar travessão como separador, evitar parallel structure forçado, evitar adjetivos partidários, evitar bold markdown dentro de JSON quando aplicável
- **Densidade alvo:** **2.500 a 3.000 palavras de corpo, com 3.000 de TETO**, mais 3 summary cards + 1 indicator grid (7-9 linhas) + 1 liquidez block + 1 calendar table.

  ⚠️ **A régua anterior dizia 1.500-2.500 e não valia há cinco edições.** Medido em 02/Ago/2026: №6 2.385 · №7 2.507 · №8 3.002 · №9 3.150 · №10 3.515 · №11 3.179. O André decidiu em 02/Ago voltar ao patamar da №8/№9 e **parar a escalada**, e a régua acima é essa decisão. Se uma edição passar de 3.000, cortar antes de publicar.

  **O corte sai da REPETIÇÃO ENTRE SEÇÕES, não do fato.** As 9 seções obrigatórias fazem a mesma história aparecer até cinco vezes (lede, exec summary, card, linha da grade, watch list). Na №11 saíram 691 palavras e nenhum número. Ordem de corte: watch list (recapitula) → exec summary (repete a lede, régua de ~150 palavras) → leituras da grade e do calendário → rodapés do anti-média e da liquidez. **Nunca cortar ressalva de tamanho de book, superlativo com janela declarada, nem registro de erro de edição anterior.**

  **Como medir** (conta só os campos de texto do frontmatter, sem URLs):
  ```bash
  node -e "const m=require('gray-matter'),f=require('fs');const d=m(f.readFileSync('public/afos-tradeoff/DATA.md','utf8')).data;const t=[];const go=v=>{if(typeof v==='string')t.push(v);else if(Array.isArray(v))v.forEach(go);else if(v&&typeof v==='object')Object.entries(v).forEach(([k,x])=>{if(!['contractLink','printLink','link','totalLink','deltaDirection','locale','status','unit'].includes(k))go(x)})};go(d);console.log(t.join(' ').replace(/https?:\/\/\S+/g,'').replace(/[*\[\]()#]/g,' ').split(/\s+/).filter(Boolean).length)"
  ```

## ETAPA 3.9: CONTAR os blocos pelo LOADER, antes do preview (bloqueante)

🔴 **Instalado em 23/Ago/2026, e o motivo é que esta régua existia só na skill dos EUA.** O `feedback_loader_descarta_bloco_com_campo_errado_em_silencio` documentava desde 03/Ago que o `coerce*` do loader falha **calado** em duas formas, e dizia "está na régua do `/tradeoff-usa`". Estava mesmo. E não estava aqui. Resultado: as edições **№8 a №13 do Brasil saíram com `type: contrarian`**, que não existe, e o cenário CONTRÁRIO AO PRICING foi ao ar seis vezes pintado com a cor do cenário BASE.

**As duas formas de falha, e a segunda é pior:**

| forma | o que acontece | como aparece |
|---|---|---|
| campo obrigatório com nome errado | o `.filter()` **descarta a linha** | seção menor, ou vazia |
| enum com valor inválido | o coercer **cai para o padrão** | seção do tamanho certo, com o valor **errado e plausível** |

⚠️ **Enum errado não deixa rastro nenhum.** `contrarian` vira `base`, o texto e o rótulo continuam certos, e só a cor muda. Olhar o preview não pega: página com bloco sumido e página com bloco que nunca foi escrito são idênticas.

**Os valores que o loader aceita, e são só estes:**

- `scenarios[].type`: **`base` | `bear` | `tail`**. ⛔ **`contrarian` NÃO existe.** O rótulo em português continua sendo "Contrário ao pricing"; quem muda é só o `type`.
- `deltaDirection`: `up` | `down` | `flat`.

**Rodar antes do preview, e comparar com o que o arquivo tem:**

```bash
cat > scripts/tmp-tr.ts <<'EOF'
import { loadTradeoff } from '../lib/afos-tradeoff/loader'
for (const loc of ['pt-BR', 'en', 'es']) {
  const d: any = loadTradeoff('DATA', loc)
  if (!d) { console.log(`  ${loc} LOADER DEVOLVEU NULL`); continue }
  console.log(`  ${loc.padEnd(6)} cards=${d.summaryCards?.length} cenarios=${d.scenarios?.length} grade=${d.indicatorGrid?.length} watch=${d.watchList?.length} calendario=${d.calendar?.length} liquidez=${d.liquidity?.rows?.length} leituras=${d.additionalReading?.items?.length} tipos=${d.scenarios?.map((s: any) => s.type).join(',')}`)
}
EOF
npx tsx scripts/tmp-tr.ts; rm -f scripts/tmp-tr.ts
```

**Bloco com 0 é bloco que não vai aparecer. `tipos` que não der `base,bear,tail` é enum coagido.**

📌 **E a régua vale para as edições JÁ PUBLICADAS**, não só para a nova: em 23/Ago a varredura pegou 18 arquivos, 6 edições vezes 3 idiomas.

⛔ **Consertar `contrarian` NÃO se faz por substring.** Em 23/Ago o `.en` de 10/Ago tinha 3 ocorrências da palavra e o de 17/Ago tinha 2, e as extras eram **prosa em inglês** ("the contrarian got the market right"). Casar só a linha `- type:`, abortar se houver número diferente de 1 por arquivo, e conferir que a contagem da palavra no arquivo caiu em exatamente 1. → [[feedback_rebaseline_por_texto_colide_substring]]

## ETAPA 4: Preview Vercel (SEM prod)

```bash
npx vercel --yes
```

Reportar URL pra André avaliar em aba anônima.

## ETAPA 5: AGUARDAR APROVAÇÃO EXPRESSA

NÃO executar commit/push/deploy prod automaticamente. Aguardar mensagem explícita ("aprovado", "deploy prod", "pode fazer").

## ETAPA 6: Após aprovação — traduzir + publicar + persistir + deploy

**Ordem correta firmada após Edição №1 (24/Mai):** traduzir EN+ES PRIMEIRO (em draft), DEPOIS flip publish em todos os 3 locales de uma vez. Inverter essa ordem cria estado inconsistente onde PT já está published mas EN/ES seguem draft — sitemap/RSS/llms.txt entram em descompasso tri-locale.

1. **Traduzir EN+ES NA PRÓPRIA SESSÃO** (ler o `{date}.md` e escrever o `{date}.en.md` e o `{date}.es.md`, ambos em `status: draft`).

**A tradução do AFOS sempre foi feita assim, desde o lançamento, pela assinatura mensal do Claude Code.**

⛔ **NÃO usar `scripts/translate-afos-tradeoff-chunked.ts`.** Ele chama uma conta de API avulsa, que **nunca** foi o caminho da tradução do AFOS. Se for executado e falhar com `SEM CRÉDITO` ou com rate-limit, isso **não é bloqueio nem pendência do André**: é a ferramenta errada. ⛔ **NÃO sugerir recarregar crédito, NÃO citar saldo, NÃO listar como pendência e NÃO reabrir o assunto**, encerrado pelo André em 25/Jul/2026 e reafirmado em 26/Jul. Regra completa em `memory/feedback_openrouter_key_e_do_chatbot_nao_da_traducao.md`.
📌 Com a tradução feita na sessão, o gotcha de rate-limit de 24/Mai deixa de existir: não há chamada de API, então não há throttle, retry nem risco de trip do Tier 1.

**Convenções e gate, iguais aos da daily** (`.claude/commands/afos-daily.md`, ETAPA 3.7):
- Ler o pt-BR INTEIRO antes de traduzir, e as três versões inteiras antes de dar por pronto. Varredura automática não basta.
- 🔢 **DECIMAL: o Tradeoff usa PONTO nos TRÊS idiomas, inclusive no pt-BR e no ES.** Não é a regra da daily. Medido em 02/Ago/2026 sobre as edições №8, №9 e №10: **zero vírgula decimal em pt-BR e em ES**, 102 valores com ponto em cada idioma da №10. O que muda entre idiomas é só o **separador de MILHAR**: EN vírgula (`n=2,004`, `USD 7,913,520`), pt-BR e ES ponto (`n=2.004`, `USD 7.913.520`).
  ⚠️ **A armadilha:** `polls-data.json` guarda os números em formato brasileiro (`44,9`, `7,8%`, `2,15pp`). Copiar de lá direto para o pt-BR mistura as duas convenções dentro do MESMO arquivo. Aconteceu na №11 e foram 27 vírgulas para converter. Normalizar o pt-BR ANTES de traduzir:
  ```bash
  node -e "const f=require('fs'),p='public/afos-tradeoff/DATA.md';let t=f.readFileSync(p,'utf8');console.log('convertendo',(t.match(/[0-9],[0-9]/g)||[]).length);f.writeFileSync(p,t.replace(/([0-9]),([0-9])/g,'\$1.\$2'),'utf8')"
  ```
  Conferir depois que nenhum separador de milhar virou decimal (`grep -o "n=[0-9.]*\|USD [0-9][0-9.]*"`). Conferir também colunas de tabela, que já esconderam separador errado.
- URLs, protocolos TSE e slugs de mercado não mudam entre idiomas.
- **Gate numérico obrigatório:** todo número seguido de unidade (`%`, `pp`, `M`, `mil`/`thousand`) tem que dar multiconjunto idêntico nos três idiomas, normalizado pela convenção de cada um. Divergiu, corrigir antes de publicar.
- Conferir também: nenhuma âncora de glossário inexistente, nenhum link apontando para outro locale, nenhum homóglifo cirílico.

2. **Flip status:draft → published nos 3 locales de uma vez:**
```bash
npx tsx scripts/publish-afos-tradeoff.ts YYYY-MM-DD --all-locales
```

3. **Persistir no Neon:**
```bash
npx tsx scripts/persist-afos-tradeoff.ts YYYY-MM-DD
```

4. **Commit + push:**
```bash
git add public/afos-tradeoff/YYYY-MM-DD*.md
git commit -m "AFOS Tradeoff Edição №N (YYYY-MM-DD) — [resumo em 1 linha]"
git push origin main
```

5. **Deploy prod:**
```bash
npx vercel --yes --prod
```

## ETAPA 7: Broadcast email (a partir da Edição №2)

**Edição №1 = silent launch sem broadcast.**

**Edição №2 em diante:** broadcast automático pra TODOS os subscribers do Daily (decisão firmada 23/Mai/2026 — sem opt-in separado).

```bash
# Dry-run primeiro
npx tsx scripts/broadcast-afos-tradeoff.ts YYYY-MM-DD --dry-run

# Send real após aprovação
npx tsx scripts/broadcast-afos-tradeoff.ts YYYY-MM-DD
```

## Observações importantes

- **Cadência fixa segunda-feira:** Tradeoff é semanal, não diário. Skill só roda às segundas (ou domingo noite preparatório). Edições "ad-hoc" entre segundas violam o ritmo prometido ao subscriber.
- **Edição №1 (semana de 19-23 Mai 2026):** publicada **Sáb 24/Mai/2026** (silent launch antecipado vs cadência canônica de segunda — decisão de 24/Mai pra não deixar `/tradeoff` 404 até segunda; exceção exclusiva para №1, dado que a semana coberta 19-23 já estava finalizada). Slug do arquivo = data de publicação (`2026-05-24.md`), com `weekStart/weekEnd` apontando para a semana coberta. Edições subsequentes retomam cadência canônica de segunda (№2 = 2026-06-01, №3 = 2026-06-08, etc).
- **Tradeoff é independente do Daily** — pode usar dados frescos do dia ou consolidar a semana inteira; o foco é em pricing/divergência semanal, não em narrativa diária.
- **HTML preview como referência canônica:** `C:\Users\afos3\OneDrive\Área de Trabalho\AFOS-Tradeoff-Preview.html` define o visual e estrutura de 9 seções. Mantido fora do git como histórico.
- **Memórias relacionadas:** `project_tradeoff_arquitetura_final.md`, `project_tradeoff_launch_sequence.md`, `feedback_tradeoff_implementation_preview_only.md`, `project_prediction_circle_benchmark.md`.
