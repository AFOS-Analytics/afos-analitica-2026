# AFOS Analytics — Atualização Completa

Execute uma análise profunda cruzando TODAS as fontes e atualize o projeto para os usuários.

## ETAPA 1: Coleta de dados Polymarket (ao vivo)

**OBRIGATÓRIO — usar o proxy AFOS, NÃO o `gamma-api` direto.** O `gamma-api.polymarket.com` falha em ambiente local (ECONNREFUSED/ENOTFOUND, ver `memory/feedback_polymarket_local_dns_workaround.md`). O proxy server-side da Vercel resolve e retorna TODOS os 6 mercados numa única chamada:

```bash
curl -s "https://www.afos-analytics.com/api/polymarket"
```

A resposta traz 6 chaves: `presidential`, `secondPlace`, `thirdPlace`, `stf`, `senate`, `inflation` (+ `fetchedAt`, `degraded`, `failedCount`). Cada uma tem `markets[]` com `question`, `outcomePrices`, `outcomes`, `volumeNum`, `liquidityNum`.

Mapa slug → chave (referência; o `gamma-api` direto só serve de fallback manual se o proxy cair):

1. `brazil-presidential-election` → `presidential` — extraia TODOS os candidatos com yes price %
2. `brazil-presidential-election-first-round-2nd-place` → `secondPlace`
3. `brazil-presidential-election-first-round-3rd-place` → `thirdPlace`
4. `any-brazil-stf-justice-removed-by-impeachment-before-2027` → `stf` (impeachment)
5. `next-brazil-senate-election-most-seats-won` → `senate`
6. `brazil-annual-inflation-2026` → `inflation`

**Para cada mercado, extrair duas métricas:**

- **% (yes price)** — outcomePrices[0] convertido para %, métrica principal de probabilidade implícita.
- **`volumeNum` (volume acumulado USD)** — notional total negociado desde abertura do mercado. Reforça tese de "dinheiro real" e contextualiza distorções de baixa atividade. Forwardada pelo proxy AFOS.

NOTA: o proxy também forwarda `liquidityNum` (profundidade do order book) desde 21/Mai/2026, **mas o uso editorial está suspenso** após pushback de consultor de mercado em 21/Mai noite. Razão: liquidez baixa em Polymarket NÃO significa preço errado — o mercado é arbitrado continuamente em minutos, e expor o número técnico para leitor leigo gera misread "AFOS mostra mercado quebrado" quando na verdade indica arbitragem ativa. Campo segue disponível na API para análise interna de anomalia, mas NUNCA citar inline na narrativa do dashboard ou daily.

## ETAPA 1.7: TRAVA DE CAPTURA (obrigatória, bloqueante)

**Instalada em 24/Jul/2026, depois do incidente do snapshot das 15h38.** Naquele dia o `/atualizar` capturou o book num momento de spread largo e publicou. Metade dos deltas estava errada e **dois tinham o sinal invertido**: Michelle e Caiado foram publicados em ALTA e fecharam o dia em QUEDA. O snapshot passou por todos os validadores, porque era internamente coerente: os deltas batiam com os valores. **O erro estava na entrada, não na aritmética.** Nenhuma checagem sobre o JSON pega isso.

O Polymarket é arbitrado em minutos. Logo: duas leituras independentes que concordam são um preço; que discordam são um book em trânsito.

```bash
npx tsx scripts/capture-guard.ts
```

Padrão: 2 leituras com 8 minutos de intervalo, tolerância de 0,20pp, ignorando nomes abaixo de 0,5% (ruído de book fino). As duas leituras usam `?fresh=1`, que ignora o cache de dados do proxy.

**Interpretação do resultado, sem exceção:**

- **exit 0**: as leituras concordam. Prosseguir usando os valores da **segunda** leitura, que é a mais recente e sobreviveu à confirmação.
- **exit 1**: NÃO publicar. A saída lista o motivo por mercado, com os dois preços e a divergência em pp. Recapturar. Se persistir em duas rodadas, o book está instável agora e o correto é registrar isso, não publicar número.

⚠️ **A trava também falha fechada quando ela própria não consegue confirmar.** Se as duas leituras vierem com o mesmo `fetchedAt`, significa que saíram do mesmo cache e nada foi verificado; nesse caso ela bloqueia e avisa. Tratar como bloqueio de verdade, não como falso positivo.

⚠️ **Não pular a trava por pressa.** Ela custa 8 minutos. O incidente que ela evita custou duas horas de dado errado em produção mais o retrabalho de rebaseline em 22 pontos de 4 arquivos.

Para uso dentro de pipeline, `--json` devolve `{ ok, motivos, fetchedAt, precos }`. O `--intervalo=N` ajusta os minutos, mas **reduzir o intervalo enfraquece a trava**: com 1 minuto, um book em trânsito pode não ter se resolvido ainda e a concordância vira falso OK.

## ETAPA 2: Coleta de notícias (Google News RSS)

**OBRIGATÓRIO — usar `scripts/fetch-google-news.mjs`** (não usar WebFetch direto). Implementado em 07/Mai/2026 após incidente daily 06/Mai. Razão: WebFetch processa o RSS retornando texto resumido, descartando o campo `<link>` que contém URL primária. O script usa `curl`-equivalente nativo Node, parseia XML completo, e salva cache `public/news-cache/{YYYY-MM-DD}.json` com URLs primárias preservadas (Google News redirect → matéria do veículo, funciona até para veículos com anti-bot).

```bash
node scripts/fetch-google-news.mjs              # data = hoje
node scripts/fetch-google-news.mjs 2026-05-08   # data específica
```

Output: 6 queries Google News executadas, 100-200 itens com URL primária, cache em `public/news-cache/{date}.json`.

**O `/afos-daily` lê esse cache** para citar matérias com URL primária funcional. Sem o cache, cai-se no problema de homepages genéricas e atribuições texto plano (ver `lib/afos-daily/validator.ts` regras de URL).

**Categorias coletadas (já hard-coded no script):**

- `eleicoes-2026` — eleições presidenciais Brasil (24h)
- `flavio-lula` — confronto Flávio × Lula (24h)
- `master-vorcaro` — caso Master/Vorcaro/STF/INSS/CPI (24h)
- `pesquisas` — pesquisas eleitorais nacionais (48h)
- `aprovacao` — aprovação/rejeição governo Lula (24h)
- `estaduais` — governadores e Senado 2026 (24h)

**Fallback se script falhar:** WebFetch direto nas URLs RSS abaixo (mas perde URLs primárias — apenas última opção):

- `https://news.google.com/rss/search?q=eleições+2026+presidente+Brasil+when:1d&hl=pt-BR&gl=BR&ceid=BR:pt-419`
- `https://news.google.com/rss/search?q=Flávio+Bolsonaro+Lula+2026+when:1d&hl=pt-BR&gl=BR&ceid=BR:pt-419`
- `https://news.google.com/rss/search?q=Banco+Master+Vorcaro+STF+INSS+CPI+when:1d&hl=pt-BR&gl=BR&ceid=BR:pt-419`
- `https://news.google.com/rss/search?q=pesquisa+eleitoral+Datafolha+AtlasIntel+Quaest+2026+when:2d&hl=pt-BR&gl=BR&ceid=BR:pt-419`
- `https://news.google.com/rss/search?q=Lula+aprovação+rejeição+governo+redes+sociais+when:1d&hl=pt-BR&gl=BR&ceid=BR:pt-419`
- `https://news.google.com/rss/search?q=governador+senado+eleição+2026+when:1d&hl=pt-BR&gl=BR&ceid=BR:pt-419`

## ETAPA 3: Atualizar JSONs

Com os dados coletados, atualize os 3 arquivos JSON:

### 3.1 `public/analysis-criteriosa.json`
- Atualize `updatedAt` com data/hora atual
- Atualize `subtitle` com institutos e datas das fontes cruzadas
- Para cada candidato (Lula, Flávio, Renan, Caiado/Haddad):
  - Atualize `header` com % Polymarket e pesquisas atuais
  - Atualize `fortes[]` com dados novos (Polymarket + pesquisas + notícias)
  - Atualize `fracos[]` com dados novos
  - Reescreva `analise` com cruzamento atualizado
- Atualize `quadroComparativo[]` com % atuais
- Reescreva `cruzamento` com análise do momento

### 3.2 `public/analysis-data.json`
- Atualize `updatedAt` com data/hora atual
- Reescreva os 4 cards com dados mais recentes:
  - **sentimento**: text1-3 (dados Polymarket + rejeição + pesquisas + notícias), direita, esquerda, terceiraVia, polymarket
  - **inss**: text1-4, impactoLula, impactoGestao, conclusao
  - **bancoMaster**: text1-3, conclusao
  - **stf**: toffoli, moraes, gilmar, dino, nexo, analise (incluir % impeachment atualizado)

### 3.3 `app/components/CandidatesSection.tsx` — Perfil dos candidatos (array `candidates`, linhas ~10-82)
- Atualize `polymarket` de cada candidato com % ao vivo
- Atualize `poll` se houver pesquisa nova
- Atualize `risk` com informações relevantes do dia
- Atualize o % de impeachment STF se mudou (buscar "14.5%" ou valor atual)

### 3.4 `public/polls-data.json` — Pesquisas no dashboard (ESCOPO NACIONAL + FRESCOR + SCHEMA CANÔNICO)

**Guardrail #0 (escopo NACIONAL — firmado 12/Mai/2026, `memory/project_dashboard_polls_scope.md`):** o dashboard mostra APENAS pesquisas de escopo **nacional** (1º e 2º turnos). Pesquisas estaduais NUNCA entram em `polls-data.json` — vão exclusivamente pro `analysis-criteriosa.json` (cobertura jornalística) e Seção 2 do AFOS Daily. Existe runtime filter `isStatePoll` em `PollsSection.tsx` como belt-and-suspenders, mas a regra de origem é: só nacional no JSON.

**Guardrail #1 (frescor — descoberto 04/Mai/2026, pesquisas Mar ficaram 2 meses no dashboard):**

- Verificar `lastUpdate` no topo do arquivo. Se >7 dias atrás de hoje, atualizar.
- Para cada entrada em `polls[]`:
  - Se `date` tem >30 dias: **REMOVER** (mover histórico para Neon via cron de persist; dashboard mostra só pesquisas ≤30 dias)
  - Se `date` ≤7 dias: manter
  - Se 7-30 dias: avaliar caso a caso (manter se for nacional grande tipo AtlasIntel/Quaest). Estaduais NUNCA entram, independente de relevância (Guardrail #0 — vão pro Daily)
- Adicionar pesquisas novas que apareceram desde último /atualizar (use os dados que `/atualizar-pesquisas` registrou no Neon, OU que apareceram no JSON `analysis-criteriosa.json` na seção de pesquisas)
- **Sem inventar números**: cada pesquisa precisa ter números verificáveis em fonte primária (Bloomberg/G1/CNN/site do instituto). Se não conseguir confirmar números detalhados, mantenha estrutura mínima (apenas 1T sem detalhes 2T).
- Atualizar `lastUpdate` para data de hoje (formato `YYYY-MM-DD`)
- Atualizar `approvalData.results` se aprovação Lula mudou (AtlasIntel/Quaest mais recentes)
- Atualizar `polymarketComparison.candidates` com % Polymarket atuais (já tem dados em ETAPA 1)

**Guardrail #3 (SUPERLATIVO — instalado 20/Jul/2026 após bug em produção):**

⚠️ A prosa de `polymarketComparison.note` e de `tendenciaPolymarket`/`tendenciaPesquisa` é **escrita por modelo, não gerada por script**. O validator checa SCHEMA, não checa AFIRMAÇÃO. Ou seja: nada impede uma frase falsa de ir para produção, e foi exatamente o que aconteceu.

**Regra:** nenhum superlativo entra sem checagem contra a **SÉRIE COMPLETA**. Vale para "a mais larga/o mais largo", "recorde", "a maior queda", "o maior volume", "primeiro/última vez", "do ciclo", "do ano".

Antes de escrever qualquer um deles:
```bash
# série do ciclo (o cap de 1000 pontos TRUNCA days=90; puxar em duas janelas e juntar)
curl -s "https://www.afos-analytics.com/api/market/history?candidate=Lula&days=90"
curl -s "https://www.afos-analytics.com/api/market/history?candidate=Lula&days=18"
curl -s "https://www.afos-analytics.com/api/market/history?candidate=Fl%C3%A1vio&days=18"
```
Filtrar `slug === 'brazil-presidential-election'`, pegar o último ponto de cada dia, comparar contra **todo** o histórico disponível. Nome acentuado e URL-encoded (`memory/reference_market_history_api_prefix_accent.md`).

**Se não der para verificar, não use superlativo.** "Alta no dia", "acima da semana passada" e "perto do topo recente" custam zero e não podem ser desmentidos.

**Precisar a JANELA sempre.** "A mais larga da semana" é uma afirmação; "a mais larga" sem janela vira "do ciclo" na cabeça de quem lê.

**Incidente que originou a regra (20/Jul/2026):** a nota de 19/Jul afirmou que o gap Lula−Flávio de +34,85pp era "a mais larga do ciclo". Era FALSO: o pico foi +39,5pp em 03/Jul e a série vinha ESTREITANDO havia duas semanas. Ficou no ar até 20/Jul, e só foi pego porque o André mandou verificar uma frase de e-mail que reciclava o mesmo enquadramento. O post de 14/Jul nas 4 plataformas repetia o erro com um terceiro número (+35,25pp). Detalhe em `memory/project_bug_dashboard_widest_of_cycle_20jul.md` e regra geral em `memory/feedback_verify_every_number_before_sending.md`.

**Guardrail #2 (schema canônico — OBRIGATÓRIO, instalado 21/Mai/2026 após 2ª regressão em 72h):**

⚠️ **PROTOCOLO TEMPLATE-FIRST — NÃO NEGOCIÁVEL.** Antes de inserir QUALQUER nova entry em `polls[]`:

1. **LER uma entry canônica recente do array** (ex: `data.polls[0]` ou a mais próxima do mesmo instituto) e usar como template field-por-field.
2. **Copiar EXATAMENTE as chaves estruturais:** `institute`, `date`, `sample`, `margin`, `reliability`, `method`, `fieldDates`, `note`, `scenarios[]`, `secondRound[]`, `source`.
3. **`scenarios` e `secondRound` SEMPRE arrays.** Se a fonte original (ex: AtlasIntel report puro) vier com `results.firstRound`/`results.secondRound` como OBJETO, CONVERTER para o shape canônico antes de gravar. Aprovação/desaprovação/rejeição vão no campo `note` (texto), nunca em chaves estruturadas novas.
4. **Antes de fechar o commit, rodar:**
   ```bash
   npx tsx scripts/validate-polls-data.ts
   ```
   Exit 0 obrigatório. Schema canônico completo em `memory/feedback_polls_data_canonical_schema.md`.

**Por que esse protocolo existe:** `app/components/PollsSection.tsx` consome `poll.scenarios` e `poll.secondRound` em render client. Quando uma entry vem com shape divergente, **derruba o dashboard inteiro**. Incidentes documentados: AtlasIntel 19/Mai e Vox Brasil 21/Mai (2× em 72h). Validator é trava final, mas template-first elimina o erro na origem.

**Por que a regra de frescor existe:** dashboard prometendo "tempo real" mostrando pesquisa de 2 meses atrás mata credibilidade. Pesquisa eleitoral perde relevância em ~3 semanas. Histórico fica no Neon (já temos).

## ETAPA 4: Build + Deploy + Commit + Persistência Neon

Execute em sequência:
0. **VALIDATOR-FIRST (bloqueante):** `npx tsx scripts/validate-polls-data.ts`. Se exit 1, NÃO prosseguir — corrigir entry malformada e rodar de novo. Mais barato que crashar prod (incidente 21/Mai).
1. `rm -rf .next && npm run build`
2. `npx vercel --yes --prod`
3. `git add app/components/CandidatesSection.tsx public/analysis-data.json public/analysis-criteriosa.json public/polls-data.json`
4. `git commit -m "Atualização AFOS [DATA] — [RESUMO PRINCIPAL]"` com Co-Authored-By
5. `git push origin main`
6. **Persistir snapshots no Neon** (após deploy concluir):
   - `npx tsx scripts/persist-analysis.ts` (local) OU
   - `curl -X GET "https://www.afos-analytics.com/api/cron/persist-analysis" -H "Authorization: Bearer $CRON_SECRET"` (via rota cron)
   - Cron Vercel também roda automaticamente às 14:00 UTC diariamente (11:00 BRT)

## REGRAS

- Padrão de cruzamento: Todos os dados são cruzamentos Polymarket (dinheiro real) + institutos de pesquisa (intenção declarada) + notícias (contexto) na data da atualização
- Comparar com estado anterior: Leia os JSONs atuais ANTES de reescrever para calcular variações (↑↓pp)
- Fontes sempre citadas: Inclua nome do veículo/instituto + data entre parênteses
- Sem inventar dados: Use APENAS dados obtidos nas buscas. Se não encontrar, mantenha o dado anterior
- Informe ao final: Mostre tabela resumo com principais mudanças
- **Volume Polymarket — regra firmada 17/Mai/2026 D+3:** ao escrever os campos `subtitle`, `header`, `analise` e `t` (trend) em `analysis-criteriosa.json` e os textos dos cards em `analysis-data.json`, citar volume USD acumulado quando o número agregar contexto. Formato canônico: `Lula 45,50% (vol USD 5,69M acumulado)`. Volume reforça tese "dinheiro real" diferenciando AFOS de agregadores. Aplicação contextual, não exaustiva — em parágrafos de fechamento da `analise` de cada candidato top 4 e em sub-mercados onde volume sinaliza distorção (vol baixo = sinal a contextualizar). NÃO citar `liquidityNum` no texto editorial — decisão 21/Mai/2026 noite após pushback do consultor de mercado: liquidez baixa em Polymarket não significa preço errado (arbitragem ativa em minutos), e expor o número gera misread "AFOS mostra mercado quebrado" no leitor leigo. Liquidity segue disponível na API para análise interna de anomalia.

## ESTILO TEXTUAL (anti-AI tells)

- NÃO usar markdown bold (`**...**`) dentro de strings dos JSONs — renderiza como literal `**` na UI do dashboard. Use texto plano com vírgulas, dois pontos ou frases curtas para destacar.
- NÃO usar travessão (—) como separador. Use vírgula, ponto, ou parênteses.
- Variações em pp (↑0.55pp / ↓2.5pp) são bem-vindas — formato técnico claro, não AI tell.
- Evitar sentence fragments para "ênfase" e parallel structure exagerado.
