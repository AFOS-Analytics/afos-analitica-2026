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

## ETAPA 4: Build + Deploy + Commit

Execute em sequência:
1. `rm -rf .next && npm run build`
2. `npx vercel --yes --prod`
3. `git add app/components/CandidatesSection.tsx public/analysis-data.json public/analysis-criteriosa.json`
4. `git commit -m "Atualização AFOS [DATA] — [RESUMO PRINCIPAL]"` com Co-Authored-By
5. `git push origin main`

## REGRAS

- **Padrão de cruzamento**: Todos os dados são cruzamentos Polymarket (dinheiro real) + institutos de pesquisa (intenção declarada) + notícias (contexto) na data da atualização
- **Comparar com estado anterior**: Leia os JSONs atuais ANTES de reescrever para calcular variações (↑↓pp)
- **Fontes sempre citadas**: Inclua nome do veículo/instituto + data entre parênteses
- **Sem inventar dados**: Use APENAS dados obtidos nas buscas. Se não encontrar, mantenha o dado anterior
- **Informe ao final**: Mostre tabela resumo com principais mudanças
