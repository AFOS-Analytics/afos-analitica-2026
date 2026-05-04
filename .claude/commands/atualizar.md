# AFOS Analytics — Atualização Completa

Execute uma análise profunda cruzando TODAS as fontes e atualize o projeto para os usuários.

## ETAPA 1: Coleta de dados Polymarket (ao vivo)

Busque dados de TODOS os 6 mercados via WebFetch:

1. `https://gamma-api.polymarket.com/events?slug=brazil-presidential-election&limit=1` — Extraia TODOS os candidatos com yes price %
2. `https://gamma-api.polymarket.com/events?slug=brazil-presidential-election-first-round-2nd-place&limit=1` — 2º lugar
3. `https://gamma-api.polymarket.com/events?slug=brazil-presidential-election-first-round-3rd-place&limit=1` — 3º lugar
4. `https://gamma-api.polymarket.com/events?slug=any-brazil-stf-justice-removed-by-impeachment-before-2027&limit=1` — STF impeachment
5. `https://gamma-api.polymarket.com/events?slug=next-brazil-senate-election-most-seats-won&limit=1` — Senado
6. `https://gamma-api.polymarket.com/events?slug=brazil-annual-inflation-2026&limit=1` — Inflação

## ETAPA 2: Coleta de notícias (Google News RSS)

Busque notícias recentes via WebFetch para TODAS as categorias:

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

### 3.3 `app/page.tsx` — Perfil dos candidatos (linhas ~79-97)
- Atualize `polymarket` de cada candidato com % ao vivo
- Atualize `poll` se houver pesquisa nova
- Atualize `risk` com informações relevantes do dia
- Atualize o % de impeachment STF se mudou (buscar "14.5%" ou valor atual)

### 3.4 `public/polls-data.json` — Pesquisas no dashboard (REGRA DE FRESCOR)

**Guardrail (descoberto 04/Mai/2026 — pesquisas Mar ficaram 2 meses no dashboard):**

- Verificar `lastUpdate` no topo do arquivo. Se >7 dias atrás de hoje, atualizar.
- Para cada entrada em `polls[]`:
  - Se `date` tem >30 dias: **REMOVER** (mover histórico para Neon via cron de persist; dashboard mostra só pesquisas ≤30 dias)
  - Se `date` ≤7 dias: manter
  - Se 7-30 dias: avaliar caso a caso (manter se for nacional grande tipo AtlasIntel/Quaest, remover se for estadual de baixa relevância)
- Adicionar pesquisas novas que apareceram desde último /atualizar (use os dados que `/atualizar-pesquisas` registrou no Neon, OU que apareceram no JSON `analysis-criteriosa.json` na seção de pesquisas)
- **Sem inventar números**: cada pesquisa precisa ter números verificáveis em fonte primária (Bloomberg/G1/CNN/site do instituto). Se não conseguir confirmar números detalhados, mantenha estrutura mínima (apenas 1T sem detalhes 2T).
- Atualizar `lastUpdate` para data de hoje (formato `YYYY-MM-DD`)
- Atualizar `approvalData.results` se aprovação Lula mudou (AtlasIntel/Quaest mais recentes)
- Atualizar `polymarketComparison.candidates` com % Polymarket atuais (já tem dados em ETAPA 1)

**Por que essa regra existe:** dashboard prometendo "tempo real" mostrando pesquisa de 2 meses atrás mata credibilidade. Pesquisa eleitoral perde relevância em ~3 semanas. Histórico fica no Neon (já temos).

## ETAPA 4: Build + Deploy + Commit + Persistência Neon

Execute em sequência:
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

## ESTILO TEXTUAL (anti-AI tells)

- NÃO usar markdown bold (`**...**`) dentro de strings dos JSONs — renderiza como literal `**` na UI do dashboard. Use texto plano com vírgulas, dois pontos ou frases curtas para destacar.
- NÃO usar travessão (—) como separador. Use vírgula, ponto, ou parênteses.
- Variações em pp (↑0.55pp / ↓2.5pp) são bem-vindas — formato técnico claro, não AI tell.
- Evitar sentence fragments para "ênfase" e parallel structure exagerado.
