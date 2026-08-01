# AFOS Analytics — Atualização Completa (EUA, midterms de 03/Nov/2026)

Passada completa no painel `/dashboard/us`: ler o mercado, atualizar as pesquisas, atualizar a imprensa, conferir a tela nos três idiomas e publicar o que mudou.

## ⚠️ Leia isto antes: o painel dos EUA é quase todo AUTOMÁTICO

Esta é a diferença que muda tudo em relação ao `/atualizar-brz`. **No Brasil o comando ESCREVE a análise**, em três JSONs de prosa editorial. **Aqui não existe prosa editorial escrita por rodada.** O painel dos EUA lê dado medido e o desenha; o texto ao redor é fixo e vive nos componentes.

| Peça | Quem atualiza | Cadência |
|---|---|---|
| Mercado (8 contratos) | cron `refresh-elections` → Neon | a cada 30 min, automático |
| Generic ballot | cron `refresh-us-polls` → Neon | 07:10 UTC, automático |
| Imprensa | cron `refresh-us-press` → Neon | 07:20, 13:20 e 19:20 UTC, automático |
| `public/us-polls-data.json` | **este comando** | manual, é o piso de segurança |

Ou seja: **na maioria dos dias não há nada a publicar, e isso é sucesso, não falha.** Este comando serve para conferir que os três automatismos estão vivos, atualizar o piso versionado e relatar o que se moveu. Se a conclusão honesta for "tudo em dia, nada a commitar", essa é a entrega.

⛔ **NÃO existe etapa de tradução aqui.** Os JSONs do Brasil têm pipeline de tradução porque carregam prosa; o arquivo dos EUA é dado medido e não tem variante por idioma, de propósito. Não procurar por `.en.json`/`.es.json` deste lado, não criar.

## ETAPA 1: Ler o mercado ao vivo

**OBRIGATÓRIO usar o proxy AFOS com o parâmetro de país.** Sem `?country=us` a rota devolve o **Brasil**, byte por byte, e a leitura passa despercebida porque vem bem-formada.

```bash
curl -s "https://www.afos-analytics.com/api/polymarket?country=us"
```

Oito chaves, e a natureza delas não é a mesma:

| Chave | O que é | Natureza |
|---|---|---|
| `house` | probabilidade de cada partido controlar a Câmara | binário |
| `senate` | probabilidade de cada partido controlar o Senado | binário |
| `asScheduled` | a eleição acontece no prazo | binário |
| `houseSeats` | faixas de cadeiras republicanas na Câmara | **distribuição** |
| `senateSeats` | faixas de cadeiras republicanas no Senado | **distribuição** |
| `governors` | faixas de governos estaduais republicanos | **distribuição** |
| `turnout` | faixas de comparecimento | **distribuição** |
| `popularVoteMargin` | faixas de margem do voto popular | **distribuição** |

⚠️ **Os contratos `house` e `senate` trazem 9 mercados cada, mas só 2 têm preço.** Os outros sete são placeholders do Polymarket ("Party A" a "Party F" e "another party") e vêm com `outcomePrices` vazio. Isso é normal, não é degradação. Quem contar "9 mercados" e reportar isso como cobertura está contando fantasma.

### O portão das distribuições: 95% a 105%
Uma distribuição só sobe à tela se as faixas somarem entre 95% e 105%. **O `popularVoteMargin` está REPROVADO** e é coletado todo dia mesmo assim, para guardar série. Ele é o mercado que um dia permitiria o cruzamento limpo, porque mede a mesma grandeza da pesquisa. Reportar a soma dele quando perguntarem, e **nunca publicá-lo como se valesse**.

## ETAPA 1.7: TRAVA DE CAPTURA (bloqueante)

```bash
npx tsx scripts/capture-guard.ts --pais=us
```

**Sem `--pais=us` a trava confere o BRASIL** e devolve exit 0 sem ter olhado um único número americano. O padrão continua sendo o Brasil de propósito, para não mudar o comportamento de quem já a chamava.

Ela faz duas leituras separadas por 8 minutos e só libera se concordarem dentro de 0,20pp. O Polymarket é arbitrado em minutos: duas leituras que concordam são um preço, que discordam são um book em trânsito. Vigia os **5 preços que o painel publica** (Democratas e Republicanos na Câmara, os mesmos no Senado, e o contrato de calendário).

**Mercado de distribuição fica de fora**, igual à `inflation` do Brasil: dezenas de faixas finas oscilam entre si sem que a eleição tenha mudado, e vigiá-las com 0,20pp bloquearia todo dia. Trava que bloqueia todo dia é trava que alguém aprende a pular. Quem segura a qualidade das faixas é o portão de coerência de 95-105%.

- **exit 0**: usar os valores da **segunda** leitura, que é a mais recente e sobreviveu à confirmação.
- **exit 1**: NÃO publicar. Recapturar. Persistindo em duas rodadas, o correto é registrar que o book está instável, não publicar número.
- **Ela falha fechada:** se as duas leituras vierem com o mesmo `fetchedAt`, ou se nenhum preço for lido, ela bloqueia e avisa. Tratar como bloqueio de verdade.

**Por que ela existe:** em 24/Jul/2026 o `/atualizar-brz` capturou o book num momento de spread largo e publicou. Metade dos deltas estava errada e **dois tinham o sinal invertido**. O snapshot passou por todos os validadores, porque era internamente coerente. O erro estava na entrada, não na aritmética, e nenhuma checagem sobre o JSON pega isso.

## ETAPA 2: Pesquisas

Rodar o `/atualizar-pesquisas-usa`, ou direto:

```bash
node scripts/parse-us-generic-ballot.mjs
```

🔴 **Conferir antes de commitar, e são DOIS defeitos possíveis.** O script escreve o arquivo de qualquer jeito; quem tem portão contra leitura vazia é o cron, não ele.

⚠️ **Só um dos dois encolhe o arquivo.** Em 01/Ago/2026 a coleta CRESCEU de 278 para 282 linhas e publicou lixo mesmo assim: uma linha saiu como **"Big Data Poll · D 914 x R 3,2"**, com o 914 sendo a amostra e o 3,2 a margem de erro. Conferir só o tamanho não pega isso.

```bash
node -e "const a=require('./public/us-polls-data.json');const q=a.qualidade,m=a.mediaAfos;console.log('publicadas',q.publicadas,'de',q.linhasLidas,'| descartadas',q.descartadas,'(forma',q.descartadasPorForma+', valor',q.descartadasPorValor+')','| media',m&&m.vantagemDem);const mau=a.polls.filter(p=>!(p.dem>=15&&p.dem<=70&&p.rep>=15&&p.rep<=70&&p.dem+p.rep<=100));console.log('fora da regua entre as PUBLICADAS:',mau.length);console.log('soma D+R+outros das 5 primeiras (~100):',a.polls.slice(0,5).map(p=>p.dem+p.rep+(p.outros||0)).join(' '))"
```

**Não commitar** se: `publicadas` foi a zero ou caiu pela metade; `mediaAfos` veio nulo; sobrou linha fora da régua entre as publicadas; ou a soma Dem+Rep+outros não fecha perto de 100. **Soma que não fecha é a assinatura de coluna deslizada na origem.**

📌 **`descartadasPorValor` é o sinal de alarme.** Ele deve ficar em 0. Se subir, a Wikipédia mudou o formato da tabela e o lugar de olhar é o `parseTabela` do `lib/us-polls/collect.mjs`, não a régua.

⚠️ **Conserto de leitor exige DEPLOY.** O cron das 07:10 UTC roda o código publicado, não o do disco. Corrigir e só commitar deixa o robô publicando errado no dia seguinte.

## ETAPA 3: Imprensa

Não existe script manual: a coleta vive na rota do cron.

```bash
curl -s https://www.afos-analytics.com/api/cron/refresh-us-press \
  -H "Authorization: Bearer $CRON_SECRET" | jq .
```

Grava no Neon sob a chave `us-press`. Resposta boa tem `ok: true`, `lastUpdate` e o bloco `qualidade`. Resposta com `motivo: "nenhum item na lista; nada foi gravado"` **é o portão funcionando**: nada foi apagado.

**Regras da seção, que não se negociam por rodada:** lista fixa de veículos, escolhida em 30/Jul, com o papel e a inclinação de cada um declarados; no máximo 2 matérias por veículo; e o coletor **não resume, não interpreta e não escolhe manchete por relevância**. Escolher veículo já é juízo editorial, e uma lista torta faria o painel ter opinião sem declarar que tem.

## ETAPA 4: Superlativo, com a armadilha da série

⚠️ A regra do Brasil vale igual: **nenhum superlativo entra sem checagem contra a série completa**. Vale para "recorde", "o mais alto", "a maior queda", "primeira vez", "do ciclo".

🔴 **A armadilha específica dos EUA:** os contratos da Câmara e do Senado guardam os desfechos com o **mesmo nome**, `Democratas` e `Republicanos`. Consultar sem filtrar o mercado **cola as duas séries numa só** e o resultado parece legítimo:

```bash
# ERRADO: mistura Câmara e Senado numa série só
curl -s "https://www.afos-analytics.com/api/market/history?candidate=Democratas&days=30"

# CERTO: o prefixo do slug separa as duas casas
curl -s "https://www.afos-analytics.com/api/market/history?candidate=Democratas&country=which-party-will-win-the-house&days=30"
curl -s "https://www.afos-analytics.com/api/market/history?candidate=Republicanos&country=which-party-will-win-the-senate&days=30"
```

Medido em 01/Ago: sem filtro, 67 pontos, sendo 62 do Senado e 5 da Câmara.

⚠️ **`scripts/check-superlativo.ts` NÃO serve aqui**: ele tem o mercado presidencial do Brasil fixo no código. A checagem dos EUA é manual, pelas consultas acima.

📏 **A série da Câmara começa em 28/Jul/2026**, quando a coleta foi ligada. Superlativo sobre ela é "o maior **desde 28/Jul**", nunca "do ciclo": a série não prova o ciclo, e o `days` da rota trava em 90 de qualquer forma. Escrever sempre "da série", com a data de início.

## ETAPA 5: Conferir a tela

O painel serve das três, então conferir as três:

```bash
for l in pt-BR en es; do curl -s -o /dev/null -w "$l %{http_code}\n" "https://www.afos-analytics.com/$l/dashboard/us"; done
```

Sete seções, nesta ordem, aprovada pelo André em 28/Jul: cartão de apresentação, mercado de previsão, pesquisas para a Câmara, grafo do cruzamento, contexto estrutural, imprensa, limitações declaradas.

⚠️ **A aresta mercado × pesquisa do grafo é MUDA, de propósito.** O mercado dá a probabilidade de controlar a casa; a pesquisa dá a vantagem em pontos de voto. **Não se exibe Δpp entre elas**, e a aresta diz "sem Δ: grandezas diferentes". Em 2012 os democratas tiveram mais votos e menos cadeiras: a diferença pode ser inteiramente geografia. Se alguma rodada produzir um número que subtrai uma da outra, o número está errado por construção.

🏷️ **Todo número diz DE QUE ele é.** "85,50%" não basta: é a probabilidade de os **democratas** controlarem a **Câmara**. Validador não pega esse defeito, porque o valor está certo e o que falta é a etiqueta.

## ETAPA 6: Publicar, só se algo mudou

Se `public/us-polls-data.json` mudou:

1. `rm -rf .next && npm run build`
2. `npx vercel --yes --prod`
3. `git add public/us-polls-data.json`
4. `git commit` com resumo do que se moveu, com Co-Authored-By
5. `git push origin main`

Se nada mudou, **não commitar por commitar** e dizer isso no relatório.

⚠️ **Uma árvore só, dois terminais.** O `vercel --prod` publica o **estado inteiro do diretório**, inclusive alteração de outro terminal. Rodar `git status` antes e commitar por NOME de arquivo, nunca `git add -A`.

## Relatório final

Tabela curta com: os dois contratos de controle e a variação em pp desde a leitura anterior; a média do generic ballot no formato D+X,XX ou R+X,XX e a variação dela; quantas pesquisas e institutos entraram; a soma das faixas de cada distribuição, dizendo quais passaram no portão; quantas matérias de imprensa e de quantos veículos; e se houve deploy.

## ESTILO

- **Sem travessão (—).** Vírgula, ponto ou parênteses.
- Variação em pp (↑0,55pp / ↓1,00pp) é formato técnico e é bem-vinda.
- **Relatar o cruzamento, sem juízo de valor.** O AFOS não diz quem tem razão entre o mercado e a pesquisa, nem quem vai ganhar. Diz o que cada um mede e o que cada um fez.
- Sem superlativo que a série não prove, e sem frase de série reciclada de rodada anterior: frase que era verdadeira com o valor antigo vira mentira com o novo.
