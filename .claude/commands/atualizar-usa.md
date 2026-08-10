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
| `public/us-press-archive/{data}.json` | **este comando**, ETAPA 3.1 | manual. É o ARQUIVO da imprensa e o piso do painel |

Ou seja: **na maioria dos dias não há nada a publicar, e isso é sucesso, não falha.** Este comando serve para conferir que os três automatismos estão vivos, atualizar o piso versionado e relatar o que se moveu. Se a conclusão honesta for "tudo em dia, nada a commitar", essa é a entrega.

⛔ **NÃO existe etapa de tradução aqui.** Os JSONs do Brasil têm pipeline de tradução porque carregam prosa; o arquivo dos EUA é dado medido e não tem variante por idioma, de propósito. Não procurar por `.en.json`/`.es.json` deste lado, não criar.

## ETAPA 1: Ler o mercado ao vivo

**OBRIGATÓRIO usar o proxy AFOS com o parâmetro de país E com `fresh=1`.** São duas travas diferentes e as duas já falharam.

```bash
curl -s "https://www.afos-analytics.com/api/polymarket?country=us&fresh=1"
```

- Sem `?country=us` a rota devolve o **Brasil**, byte por byte, e a leitura passa despercebida porque vem bem-formada.
- 🔴 **Sem `&fresh=1` a rota devolve o CACHE**, com carimbo de tempo antigo, e a captura é de minutos atrás sem avisar.

⚠️ **O cache não é inofensivo.** Medido em 10/Ago/2026: a leitura sem `fresh=1` às 17:20 UTC voltou com `fetchedAt=17:11:04`, e uma segunda chamada às 17:29 voltou com o **mesmo** carimbo. Com `fresh=1` a Câmara estava em **D 86.50% x R 12.50%**, contra **D 85.50% x R 14.50%** do cache: o lado republicano estava errado em **2.00pp**. As faixas mudaram muito mais, com `houseSeats` indo de 205.55% para 151.65% na mesma chamada.

📌 **Conferir o `fetchedAt`, não o valor.** Duas chamadas com `fetchedAt` idêntico não são duas medições, são a mesma leitura comparada com ela mesma, e diferença zero ali é tautologia e não confirmação. Esta é a mesma defesa que a trava de captura já aplica: ela usa `fresh=1` nas duas leituras e **falha fechada quando os dois `fetchedAt` são iguais**.

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

🔑 **LER A ÚLTIMA LINHA, não o código de saída.** A trava termina com `VEREDITO: APROVADO` ou `VEREDITO: BLOQUEADO`, e **essa linha é a fonte de verdade**. O exit code é confirmação e pode se perder no caminho: medido em 10/Ago/2026 num ambiente onde **todo** comando voltava com exit 1, inclusive um `true`, porque o Git Bash montava o `C:` em `/cygdrive/c` e o invólucro escrevia num `/c/...` inexistente. A trava aprovou e quase foi lida como bloqueio.

⚠️ **Desempate rápido, sem esperar outros 8 minutos:** rodar `true` no mesmo shell. Se `true` também "falha", o exit code do ambiente não vale nada e vale a linha `VEREDITO:`.

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

A coleta vive na rota do cron:

```bash
curl -s https://www.afos-analytics.com/api/cron/refresh-us-press \
  -H "Authorization: Bearer $CRON_SECRET" | jq .
```

Grava no Neon sob a chave `us-press`. Resposta boa tem `ok: true`, `lastUpdate` e o bloco `qualidade`. Resposta com `motivo: "nenhum item na lista; nada foi gravado"` **é o portão funcionando**: nada foi apagado.

### 3.1 ARQUIVAR a coleta, obrigatório (03/Ago/2026)

```bash
npx tsx scripts/snapshot-us-press.ts            # ensaio, não escreve
npx tsx scripts/snapshot-us-press.ts --apply
```

🔴 **Isto NÃO é opcional e não é só backup.** Sem este passo a imprensa existe apenas como linha de banco, que o upsert do dia sobrescreve. O script grava cada coleta em `public/us-press-archive/{data}.json` e atualiza `public/us-press-data.json`, que é o **piso de leitura** do painel quando o banco não responde.

**Contrato, igual ao do dataset do Hugging Face:** a data **corrente** pode ser regerada no dia, porque o cron roda 3x; **data encerrada nunca é reescrita**. O script mostra `🔒 data encerrada` para as antigas e avisa se alguma divergir do banco, preservando o arquivo. Erro em data passada se corrige por **errata**, não por reescrita.

⚠️ **O cron NÃO escreve esses arquivos**: em serverless o disco é efêmero. Quem versiona é este comando, e por isso os arquivos entram no commit da ETAPA 6.

### O que conferir na resposta

Além de `publicados` e `veiculosRepresentados`, olhar os campos de **procedência**, que existem desde 03/Ago:

| campo | o que diz |
|---|---|
| `publicadosComLinkCanonico` | vieram do RSS do próprio veículo, com a URL da matéria |
| `publicadosViaGoogleNews` | vieram do agregador, com link de redirecionamento opaco |
| `lidosEmFeedProprio` | quantos os 15 feeds próprios entregaram antes do filtro |

📌 **`publicadosComLinkCanonico` em ZERO é alarme, não resultado.** Significa que os 15 feeds próprios não entregaram nada e tudo veio do Google, e a causa costuma ser feed que mudou de endereço, não semana sem notícia. Medido em 03/Ago em produção: **6 canônicos de 10**.

**Regras da seção, que não se negociam por rodada:** lista fixa de veículos, escolhida em 30/Jul, com o **papel** de cada um declarado; no máximo 2 matérias por veículo; e o coletor **não resume, não interpreta e não escolhe manchete por relevância**. Escolher veículo já é juízo editorial, e uma lista torta faria o painel ter opinião sem declarar que tem.

⛔ **A lista NÃO carrega inclinação política**, e o campo foi removido em 01/Ago/2026 por decisão do André: o rótulo era nosso e sem fonte, e divergia do AllSides em 13 de 22, para os dois lados. Fica o `tipo`, que é fato sobre o que a organização é.

⛔ **Não forjar user-agent de navegador** para passar pelos veículos que devolvem 403 (Washington Examiner, Cook Political Report, Sabato's). É bloqueio deliberado deles, e eles seguem entrando pelo Google News, que é acesso que autorizaram ao agregador.

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

Se `public/us-polls-data.json` **ou** os arquivos de imprensa da ETAPA 3.1 mudaram:

1. `rm -rf .next && npm run build`
2. `npx vercel --yes --prod`
3. `git add public/us-polls-data.json public/us-press-archive public/us-press-data.json`
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
