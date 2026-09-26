# AFOS Analytics — Atualização do Generic Ballot (EUA, midterms 2026)

## 🌐 Rede externa: rodar ANTES, se não estiver na rede de casa (17/Set/2026)

```bash
npm run rede:afos        # 0 LIMPA · 2 DOMINIO_INTERCEPTADO (imprime o export) · 1 SEM_ACESSO
export AFOS_BASE=https://afos-analitica-2026.vercel.app   # só se o veredito for 2
```

🔴 Numa rede com inspeção de TLS (FortiGate), **só `www.afos-analytics.com` chega reassinado**: todo leitor local cai com `UNABLE_TO_VERIFY_LEAF_SIGNATURE` enquanto Vercel, GitHub, HF, Neon, Resend, TSE e Polymarket passam. O `AFOS_BASE` troca o **host de leitura** para o alias de produção (mesmo `dpl_`, conferido por `vercel inspect`), e os 13 leitores locais leem dele via `scripts/lib/base-afos.mjs`. ⛔ **Nunca desligar verificação de certificado.** ⛔ Links públicos (email, feed, sitemap, `llms.txt`) continuam no domínio canônico. Chamadas `curl` deste comando: trocar `https://www.afos-analytics.com` por `${AFOS_BASE:-https://www.afos-analytics.com}`. → `memory/reference_rede_com_inspecao_tls_fortigate.md`

Atualizar as pesquisas de intenção de voto para a Câmara dos Estados Unidos, que alimentam a seção "Pesquisas: voto para a Câmara" do `/dashboard/us`.

⚠️ **NÃO é o equivalente direto do `/atualizar-pesquisas-brz`.** No Brasil a fonte é a API do TSE, que é registro oficial obrigatório. Nos Estados Unidos **não existe registro obrigatório de pesquisa**, então a fonte é outra e a régua também.

## O que este comando NÃO faz

- **Não cobre Senado.** O generic ballot pergunta em quem o eleitor votaria para o Congresso no distrito dele. Não existe pergunta nacional equivalente para o Senado, porque só um terço das cadeiras está em disputa e cada uma é uma corrida estadual. Se aparecer pedido de "média do Senado", a resposta é que ela não existe, não que ainda não foi feita.
- **Não traduz nada.** O arquivo de saída é dado medido, e nome de instituto, data de campo, amostra e percentual não se traduzem. Ele **não tem variante por idioma, de propósito** (ver o cabeçalho de `lib/dashboard/us-static-data.ts`). O texto ao redor é que muda de idioma, e ele vive no componente. **Não procurar por uma etapa de tradução: ela não existe deste lado.**

## As duas fontes vivas, e por que são duas

| | Quem escreve | Quando | Para que serve |
|---|---|---|---|
| **Neon** (`analysisReport`, chave `us-generic-ballot`) | o cron `/api/cron/refresh-us-polls` | todo dia às **07:10 UTC** | é a **fonte viva**, o que o painel lê primeiro |
| **`public/us-polls-data.json`** | este comando, à mão | quando alguém roda | é o **piso de segurança**, lido quando o Neon não responde |

Em ambiente serverless não há repositório para gravar, então o cron **não escreve arquivo nenhum**. Por isso o arquivo do repositório envelhece entre deploys, e por isso rodar este comando de vez em quando não é redundante.

A lógica de leitura é **uma só**, em `lib/us-polls/collect.mjs`, usada pelos dois. Duas cópias da mesma regra foi o defeito que custou os rótulos de faixa do mercado em 29/Jul: convivem sem incidente até o dia em que uma é corrigida e a outra não.

## 🚀 O atalho, criado em 09/Set/2026

Os passos 1 a 4 são sempre a mesma sequência de sete comandos, na mesma ordem, e redigitá-los é a chance nova de esquecer um. Um comando roda a passada inteira:

```bash
npm run polls:usa                                   # a passada completa
node scripts/rodada-us-polls.mjs --sem-rede         # sem defasagem e índice x mundo, que saem à internet
node scripts/rodada-us-polls.mjs --sem-coleta       # só confere e mede o arquivo que já está no disco
```

Ele **PARA no portão do Passo 2** se o veredito for REPROVADO, porque os medidores dos passos seguintes leem o arquivo que a coleta acabou de escrever, e rodá-los sobre arquivo reprovado produz número que não se pode usar. Não desfaz o arquivo sozinho: desfazer apaga a prova de que a origem mudou.

⛔ **Ele não commita, não publica e não força o cron.** Orquestração apenas, sem regra própria: toda medição segue nos scripts chamados, e é assim que fica, para não nascer a segunda cópia de uma regra que já existe.

Os passos abaixo continuam valendo como a descrição do que cada peça faz e de como ler a saída.

## 🗺️ A TABELA MUDOU DE LUGAR, e ela pode mudar de novo (25/Set/2026)

🔴 **A Wikipédia tirou a tabela do generic ballot do corpo do artigo.** A seção `==Polling==` do `2026 United States elections` ficou com duas linhas:

```
==Polling==
{{2026 United States elections/polling}}
```

A tabela foi para `Template:2026 United States elections/polling`, e **`?action=raw` devolve wikitext NÃO EXPANDIDO**: a tabela simplesmente não vem mais. O artigo ficou com **zero wikitable**, a leitura caiu de **424 linhas para 0** e o portão do Passo 2 reprovou a passada.

✅ **O coletor agora MEDE onde a tabela mora**, em `localizarFonteDaTabela()`: tabela inline na seção vence sempre, e na falta dela ele segue a transclusão. O caminho usado sai declarado em `procedencia.fonteDaTabela`, com a página de onde a tabela veio e a data em que a mudança foi notada. **Conferir esse campo quando a contagem der salto estranho.**

| régua | por quê |
|---|---|
| a seção termina no **próximo cabeçalho de nível 2** | delimitar pelo primeiro `|}` é circular: a tabela é justamente o que pode faltar, e a tabela da seção SEGUINTE faria esta parecer inline |
| moldura e nota de rodapé **não são a fonte** | `{{Main}}`, `{{See also}}`, `{{sticky header}}` e afins estão numa lista de exclusão. Pegar o primeiro `{{...}}` escolheria o hatnote |
| sem tabela **e** sem transclusão, **LANÇA** | zero pesquisa é saída plausível num dia sem divulgação, e é por isso que aqui não se devolve vazio |
| a subpágina tem **DUAS** tabelas | `===2025–2026===` e `===2024–2025===`. Só a primeira está em cena, e é a que reproduz o escopo de sempre: 432 linhas contra as 424 da véspera |

🕳️ **E havia um defeito NOSSO no mesmo par de âncoras.** O início (`==Polling==`) era conferido e lançava; o **fim** (`\n|}`) não era. `slice(ini, -1)` é fatia **válida** em JS, então com `indexOf` devolvendo -1 o parser seguia lendo até o fim do artigo como se aquilo fosse a tabela. Naquele dia não produziu linha contaminada só porque o pedaço restante não tinha nenhum `|-`. **Assimetria de guarda entre duas âncoras do mesmo par é defeito silencioso, não estilo.**

🧪 `node scripts/testar-fonte-da-tabela-us.mjs`, **19 asserções e no CI**, com 6 de 6 mutações reprovadas. Metade é anti-silêncio e metade é anti-excesso.

## Passo 1: gerar o arquivo

```bash
node scripts/parse-us-generic-ballot.mjs
```

Opções: `--dias=30` (janela da média, padrão 30) e `--out=caminho` (padrão `public/us-polls-data.json`).

## Passo 2 (BLOQUEANTE): conferir que a leitura não colapsou NEM se contaminou

🔴 **O script NÃO tem portão de segurança, e o cron tem um portão que já mediu a coisa ERRADA.** A assimetria continua sendo a razão deste passo existir, e a frase antiga, que dizia só "o cron TEM", foi corrigida em 25/Set/2026 depois de a rota gravar leitura de índice vazio com `ok: true`.

A rota se recusa a gravar leitura vazia por cima de uma boa: Wikipédia fora do ar, mudança de estrutura da página ou parse quebrado chegam como zero pesquisas, e ela devolve 502 sem gravar. **O script escreve o arquivo de qualquer jeito.**

⚠️ **Mas o portão da rota media a SAÍDA, e o que colapsa é a ENTRADA.** O teste era `!polls.length || !mediaAfos`, e as rodadas **CURADAS** entram depois dos dois portões de linha: são lista declarada em `lib/us-polls/rodadas-curadas.mjs` e existem esteja a Wikipédia de pé ou não. Em 25/Set eram **29**, e 29 é mais que zero, então o portão que existe para recusar leitura vazia deixou passar leitura **nenhuma**: gravou `lidas 0 · pub 29 · n 12 · D+7.70 · campo mais recente 14/Set` por cima de `lidas 430 · pub 449 · n 38 · D+7.98 · campo 21/Set`, com **HTTP 200**.

✅ A regra saiu da rota e virou `lib/us-polls/portao-gravacao.mjs`, com `linhasLidas === 0` recusando a gravação, guarda de **tipo** e não de valor (`Number(true)` é 1 e `Number(null)` é 0, os dois finitos) e a curada declarada na resposta. 🧪 `node scripts/testar-portao-gravacao-us.mjs`, **25 asserções e no CI**, com **7 de 7 mutações reprovadas**, incluindo o conserto TENTADOR que estaria errado (recusar só quando não houver curada) e a anti-excesso que proíbe transformar isso em "recusa leitura pequena".

⛔ **A regra é ZERO, nunca "pouco".** Uma linha lida é leitura, por magra que seja, e quem julga queda parcial é o `conferir-us-polls.mjs`, que compara contra a base do git. Duas regras para a mesma pergunta é o defeito que este comando passa a vida evitando.

⚠️ **São DOIS defeitos possíveis, e só um deles encolhe o arquivo.** Em 01/Ago/2026 a coleta CRESCEU de 278 para 282 linhas e mesmo assim publicou lixo. Conferir só o tamanho não basta.

```bash
node scripts/conferir-us-polls.mjs
```

🔴 **Rodar ISTO, e não o `node -e` de cabeça.** O script existe desde 04/Ago/2026 e não estava citado em comando nenhum, então na prática eu redigitava a conferência toda sessão, e conferidor que se redigita é chance nova de errar. Medido em 04/Set/2026: por não estar aqui, ele não foi rodado, e a atribuição da variação daquele dia foi feita à mão.

Ele varre **todas** as linhas, compara contra a versão do `git HEAD`, aplica as duas réguas abaixo e termina em `VEREDITO: APROVADO` ou `REPROVADO`. Aceita `--base=<ref-git>`, `--arquivo=` e `--base-arquivo=`.

🧭 **Ele também responde a pergunta do Passo 4**, que é a única que a régua faz antes de qualquer verbo de movimento: **o que mudou foi a intenção de voto ou foi o conjunto?** Sai como `COMPOSICAO`, `PESQUISA_NOVA`, `CORRECAO`, `PARADO` ou `INCONSISTENTE`, nomeando rodada a rodada quem entrou e quem saiu, e confere que a subtração fecha.

🚀 **E, para cada rodada que ENTRA, imprime a FICHA dela**, desde 15/Set/2026: campo, amostra, recorte, margem, D/R/outros com a soma, origem e **o link da fonte primária**. É o ponto de partida da conferência na fonte, não a conferência. Medido no dia: a CBS News/YouGov entrou pelo índice com D 54 x R 46, 1.750 LV e ±2,9. No topline, D e R e o N ponderado de 1.750 bateram; **a margem de 2,9 não constava**, porque o instituto só declara ±2,3 para os 2.460 adultos. Rodada nova se confere no topline do instituto antes de ir ao relato.

🔑 **Isso só funciona porque o arquivo passou a gravar QUAIS pesquisas entraram na média, em `mediaAfos.incluidas`, e não só quantas.** Antes de 04/Set/2026 a comparação era por NOME de casa, e nome de casa não é rodada: uma onda nova de uma casa que já estava na lista passava invisível. Caso medido sobre o arquivo real daquele dia: uma onda da YouGov com campo 28/Ago levaria a média de D+5.69 a D+5.93, e a régua antiga imprimiria *"ZERO informação nova, escrever verbo de movimento aqui é falso"*. Falso negativo que produz frase falsa. A regra vive em `lib/us-polls/atribuicao.mjs`, com casos plantados em `scripts/testar-atribuicao-us.mjs`.

⚠️ **Comparando contra uma base anterior a 04/Set/2026 ele avisa `atribuição DEGRADADA`** e manda não usar aquela linha para afirmar "zero informação nova". Isso acontece uma única vez.

🔴 **E quando NÃO existe linha de base, o veredito sai como `APROVADO (DEGRADADO)`, régua de 09/Set/2026.** Sem base, metade das regras não pode disparar: "caiu para menos da METADE", "cresceu fora da faixa" e a atribuição inteira comparam contra a versão anterior, e sem ela ficam inertes. Sobram só as absolutas, `publicadas = 0` e `mediaAfos` nula. **Medido no dia: um arquivo que foi de 387 para 3 linhas passava com `VEREDITO: APROVADO` e um ✅ verde no colapso.** Acontece com `--arquivo=` apontado para caminho que não está no git, ou com `--base=` num ref onde o arquivo não existia. O veredito degradado não serve para publicar.

Para conferir uma peça isolada à mão, ou se o script cair:

```bash
git diff --stat public/us-polls-data.json
node -e "const a=require('./public/us-polls-data.json');const q=a.qualidade,m=a.mediaAfos;console.log('publicadas',q.publicadas,'= indice',q.doIndice??q.linhasLidas,'+ curadas',q.curadas||0,'| descartadas',q.descartadas,'(forma',q.descartadasPorForma+', valor',q.descartadasPorValor+')','| media',m&&m.vantagemDem,'| institutos',m&&m.nInstitutos);const mau=a.polls.filter(p=>!(p.dem>=15&&p.dem<=70&&p.rep>=15&&p.rep<=70&&p.dem+p.rep<=100));console.log('linhas fora da regua entre as PUBLICADAS:',mau.length);const somas=a.polls.map(p=>p.dem+p.rep+(p.outros||0));const fora=somas.filter(s=>s<97||s>102);console.log('soma D+R+outros FORA da faixa 97-102:',fora.length,'de',somas.length,fora.length?'-> valores '+[...new Set(fora)].slice(0,10).join(' '):'');console.log('semFontePrimaria (contador do ARQUIVO):',a.qualidade.semFontePrimaria)"
```

**Regra de colapso:** se `publicadas` foi a 0, ou caiu para menos da metade, ou `mediaAfos` veio nulo, não commitar.

**Regra de contaminação:** se sobrar linha fora da régua entre as publicadas, ou se a soma Dem+Rep+outros não fechar perto de 100, **não commitar**. Soma que não fecha é a assinatura de coluna deslizada.

Desfazer com `git checkout -- public/us-polls-data.json` e investigar a origem.

### 📐 A régua, e por que a soma é o melhor teste
O portão de valor exige percentual entre **15% e 70%** para os dois partidos, e soma dos dois até 100. É folgado de propósito: existe recorte legítimo de adultos com muito indeciso (D=33 x R=28).

Mas o teste mais forte não é a régua, é a **soma com os outros**: numa linha bem lida, Dem + Rep + outros fecha em 99 ou 100. Quando a coluna desliza, a soma desanda. É o jeito mais rápido de saber se a origem mudou de formato.

⚠️ **A soma se confere em TODAS as linhas, não numa amostra.** A versão antiga deste comando olhava as 5 primeiras, que são sempre as mais recentes e as mais bem formatadas. Coluna deslizada aparece onde a origem mudou de formato, e isso costuma ser no meio ou no fim da tabela. Em 04/Ago/2026, varrer as 351 achou 2 fora da faixa que a amostra de 5 nunca mostraria.

📌 **Soma fora da faixa NÃO é automaticamente defeito.** As 2 de 04/Ago eram RMG Research somando 94 e Reuters/Ipsos somando 92, as duas com o indeciso fora de "outros". Antes de desfazer, abrir a linha: se `dem` e `rep` são plausíveis e `amostra` e `margemErro` estão nos campos deles, é recorte do instituto, não coluna deslizada. **Coluna deslizada tem assinatura própria: a amostra ou a margem aparecem COMO intenção de voto.**

### 📒 E a conferência dessa linha se GRAVA, régua de 23/Set/2026

🔴 **O portão reprovava por CONTAGEM BRUTA, e ele já sabia a resposta.** Ele imprime "recorte do instituto" linha a linha, distinguindo do deslize, e depois **ignora a própria classificação** para decidir pelo `somaFora.length > somaForaBase`. Efeito: linha legítima já aberta na fonte reprova a passada **todo dia** enquanto estiver na janela de 30 dias, e trava que bloqueia todo dia é trava que alguém aprende a pular.

✅ **O registro é `lib/us-polls/soma-conferida.mjs`**, no mesmo padrão do `instrumento-medido.mjs`: dado declarado com **URL, data da conferência e a decomposição do topline**, para poder ser reconferido e desfeito. O contador passa a ser das linhas que **ninguém abriu ainda**.

| trava anti-silêncio | por quê |
|---|---|
| casa pelos **VALORES** (`dem`, `rep`, `outros`), não só por casa e campo | índice reescreveu o número? a conferência **CADUCA sozinha** e a linha volta a contar |
| `ERRO_DO_INDICE` sai do contador e **nunca da saída** | é dívida aberta contra a origem, impressa em toda passada com a decomposição |
| entrada sem `url` ou sem `conferidoEm` **reprova a carga** | conferência sem prova é opinião, e opinião não desarma portão |

⛔ **Ele não corrige valor nenhum.** A Wikipédia é o ÍNDICE, e mexer no número à mão muda a procedência.

🔴 **O caso que o criou, 23/Set/2026.** A Marquette de 2-9/Set foi ao ar com `outros = 8`, e o topline de **likely voters** do instituto diz D 315 (54%), R 242 (41%), **Neither 25 (4%)**. O 8 é o "Neither" do recorte de **ADULTOS**. E a própria Wikipédia se contradiz: a célula traz `8%` e anexa a nota chamada **`Neither4`**, cujo texto é *"Neither" with 4%*. **D e R estão corretos, então a média não é afetada**, e é por isso que o defeito sobrevive: ele mora no único campo que não entra em conta nenhuma, que é justamente o que faz o teste da soma funcionar.

🧪 `node scripts/testar-soma-conferida.mjs`, **32 asserções e no CI**, com **7 de 7 mutações reprovadas**. Metade é anti-silêncio, porque o erro simétrico deste conserto é um portão que nunca mais reprova.

🏷️ **O campo da fonte chama `fontePrimaria`, não `fonte`.** Contar com o nome errado devolve "351 de 351 sem fonte primária", que parece achado gravíssimo e é laço vazio. **Usar o contador que o próprio arquivo declara, `qualidade.semFontePrimaria`**, em vez de recalcular por conta própria. Campos reais de uma linha: `instituto`, `campoInicio`, `campoFim`, `amostra`, `amostraTipo`, `margemErro`, `dem`, `rep`, `outros`, `vantagemDem`, `fontePrimaria`.

### 🔴 O defeito de 01/Ago, para reconhecer se voltar
A coleta publicou **"Big Data Poll · D 914 x R 3,2"**. O 914 era o TAMANHO DA AMOSTRA e o 3,2 era a MARGEM DE ERRO.

**Causa:** o `rowspan` da Wikipédia não fica só no instituto e nas datas, fica **também na margem de erro** (`rowspan="3"|–`). Nas linhas seguintes do grupo a célula da margem não existe, tudo desliza uma coluna, e o leitor gravava o REPUBLICANO no lugar do democrata e o OUTROS no lugar do republicano. Assim "Focaldata/FT, Dem 51 x Rep 44, outros 5" virava "D=42 x R=9".

O leitor passou a resolver `rowspan` **por índice de coluna**, o que consertou a raiz: os descartes por valor caíram de 35 para 0 e a leitura subiu para 304 de 307. **Se `descartadasPorValor` voltar a subir, a origem mudou de formato de novo** e o lugar de olhar é o `parseTabela`.

### 🧬 E a média pode contar a MESMA casa DUAS vezes, porque a chave é o NOME (25/Set/2026)

🔴 **A regra é uma rodada por instituto por onda, e ela agrupa pelo campo `instituto`, que é o nome que o ÍNDICE escreveu.** O índice não garante nome estável, e naquele dia **três casas estavam na média duas vezes**:

| rodada | os dois nomes | valores |
|---|---|---|
| 11-14/Set, 1.211 RV | `Beacon Research (D)/ Shaw & Co. Research (R)` e `Fox News` | os dois D+7.00 |
| 02-09/Set, 581 LV | `Marquette University Law School` e `Marquette Law School` | os dois D+13.00 |
| 31/Ago-10/Set, 1.000 LV | `ActiVote` e `Activote` | D+4.00 e D+4.60 |

As duas primeiras são a MESMA rodada sob o nome de quem **executa** e o de quem **encomenda**. **Preço medido: D+7.98 com as duplicatas e D+7.89 sem as idênticas**, com os institutos caindo de 31 para 29.

⚠️ **E há um quarto caso, dormente:** a McLaughlin entrou em 25/Set como `McLaughlin & Associates` enquanto as 7 linhas anteriores são `McLaughlin & Associates (R)`. Hoje só uma cai na janela, então não duplica; no dia em que duas caírem, duplica.

```bash
node scripts/rodada-duplicada-us.mjs     # entra na rodada como passo 2.5/9
```

📐 A assinatura é **campo + amostra + recorte**, e nunca o nome, que é a coisa sob suspeita. `IDENTICA` é mesma rodada com D e R iguais; `DIVERGE` é mesma onda com valores diferentes e pede olho humano, porque pode ser segunda via declarada.

⛔ **Ele NÃO remove linha e NÃO muda a média.** Decidir qual nome fica é mudar a PROCEDÊNCIA, e segue decisão do André, par a par. O par decidido entra em `lib/us-polls/duplicata-de-rodada.mjs`, com data, motivo e **os valores**, para a conferência CADUCAR se o índice reescrever o número.

🧪 `node scripts/testar-duplicata-us.mjs`, **24 asserções e no CI**, com **7 de 7 mutações reprovadas**. Metade é anti-excesso: sem amostra declarada, duas casas diferentes na mesma janela colidiriam sozinhas, então ali o par só conta se o nome normalizado bater.

## Passo 3: forçar o Neon, se não puder esperar as 07:10 UTC

🔑 **O `$CRON_SECRET` NÃO existe no shell.** Ele vive no `.env.local`, que não é carregado no ambiente. Chamar com `$CRON_SECRET` cru devolve **`{"error":"Unauthorized"}` com HTTP 401**, e o 401 é fácil de confundir com segredo errado ou rota quebrada. Ler do arquivo:

```bash
S=$(grep '^CRON_SECRET=' .env.local | head -1 | cut -d= -f2- | tr -d '"'"'"'\r')
curl -s https://www.afos-analytics.com/api/cron/refresh-us-polls \
  -H "Authorization: Bearer $S" | jq .
```

O `tr -d '\r'` não é enfeite: arquivo `.env` gravado no Windows carrega CR no fim da linha, e o CR entra no cabeçalho e derruba a autenticação com o mesmo 401. Medido em 04/Ago/2026.

Resposta boa traz `ok: true`, `lastUpdate`, `lidas`, `publicadas`, `descartadasPorForma`, `semFontePrimaria` e o bloco `media` com `dem`, `rep`, `vantagemDem`, `nPesquisas`, `nInstitutos`.

**Resposta 502 com `motivo: "leitura vazia ou sem média; nada foi gravado"` não é falha do comando: é o portão funcionando.** Nada foi sobrescrito. Investigar a origem, não repetir a chamada.

⚠️ **401 e 502 querem coisas opostas.** O 502 manda investigar a origem e NÃO repetir. O 401 é só o segredo não ter chegado: corrigir a chamada e repetir é o certo. Confundir os dois faz perder uma rodada.

🔴 **E `ok: true` NÃO é prova de leitura boa. Ler o campo `lidas` da resposta, sempre.** Em 25/Set/2026 esta chamada devolveu `{"ok":true,...,"lidas":0,"publicadas":29,...}` com HTTP 200 e **gravou**, porque as curadas seguravam o portão satisfeito. Depois do conserto a mesma situação sai com `motivo: "o ÍNDICE devolveu zero linha; as curadas não substituem o índice e nada foi gravado"`.

⛔ **E esta chamada roda CÓDIGO PUBLICADO, não o local.** Consertar o coletor no repositório não conserta a fonte viva: enquanto não houver `vercel --prod`, o cron das 07:10Z segue lendo com o código antigo. Isto inverte a regra do fim deste arquivo, que diz que o Neon não precisa de deploy: ela vale quando o conserto é do ARQUIVO, e não quando é da LÓGICA DE LEITURA, que os dois compartilham.

## Passo 4: relatar

Reportar sempre, com os números do arquivo e não de memória:

- média da casa (`vantagemDem`), no formato **D+X,XX** ou **R+X,XX**, e a variação contra a leitura anterior em pp

⚠️ **Dizer SEMPRE de onde veio a variação, porque a janela de 30 dias rola sozinha.** A média muda sem nenhuma pesquisa nova: basta uma antiga sair pela borda. Em 04/Ago/2026 a média foi de D+5,69 para D+5,75 com **zero pesquisa nova**, só porque `nPesquisas` caiu de 26 para 24. Reportar "a média subiu" ali seria falso: quem mudou foi o conjunto, não a intenção de voto.

✅ **Não fazer essa atribuição de cabeça: ela sai do `conferir-us-polls.mjs` do Passo 2**, no bloco `composição`, que nomeia a rodada que entrou e a que saiu e fecha a subtração. Em 04/Set/2026 a média foi de D+6.07 para D+5.69 com zero pesquisa nova, porque a John Zogby Strategies, campo 04-05/Ago e D+11.00, saiu pela borda quando o dia UTC virou: `(6.07 × 14 − 11.00) / 13 = 5.69`, exato.

Comparar `nPesquisas` e `nInstitutos` com a leitura anterior antes de escrever qualquer verbo de movimento. Se caíram, a variação é de **composição** até prova em contrário. E citar a **data de campo mais recente da base**: se ela tem vários dias, a régua está parada e a média mexer é alerta, não sinal.
- quantas pesquisas e quantos institutos entraram na janela, e qual é a janela em dias

🔴 **E TRÊS MEDIDORES QUE JÁ EXISTEM E NÃO ESTAVAM CITADOS AQUI, que é o mesmo defeito do `conferir-us-polls` antes de 05/Set:** script não citado vira conta refeita à mão toda rodada. Medido em 06/Set/2026: refiz a projeção da janela de cabeça e **errei a borda em um dia**, porque a janela é INCLUSIVA (`campoFim >= corte`) e eu usei `campoFim + 30` em vez de `+ 31`. O `projetar-janela-us.mjs` já acertava isso desde sempre.

```bash
node scripts/rodada-duplicada-us.mjs     # a mesma RODADA sob dois nomes de casa
node scripts/projetar-janela-us.mjs      # o FUTURO da janela, se nada entrar
node scripts/historico-us-polls.mjs      # a SÉRIE no Neon, e se o registro de hoje é do cron
node scripts/check-us-polls-defasagem.mjs # o instituto publicou algo que o índice não tem?
node scripts/agregadores-us-polls.mjs    # o ÍNDICE parou, ou o MUNDO parou?
npm run instrumento:usa                  # a rodada fora do índice mede a MESMA pergunta?
```

🔬 **O `conferir-instrumento-us.mjs` responde a pergunta que vinha DEPOIS de todas e era respondida por suposição, criado em 15/Set/2026.** Quando o passo 1 acusa `RODADA_FORA_DO_INDICE`, ele imprimia *"o buraco é do ÍNDICE, não das casas"*. Essa frase afirmava mais do que a medição sustenta: aquele bloco compara **data e mais nada**.

🔴 **Medido em 15/Set/2026, e ela estava errada.** As duas rodadas da The Economist/YouGov fora do índice (campo 4-8/Set e 11-14/Set) **trocaram de instrumento**: a pergunta passou a trazer a nota *"Asked using the names of candidates running in the respondent's district of residence"*. Cédula **nominal** não é generic ballot, e o índice pode estar excluindo as duas com razão. A evidência circunstancial fecha: o índice recebeu a CBS News/YouGov de campo **8-11/Set**, mais nova que a Economist de 4-8/Set, então quem edita estava ativo.

⛔ **E o custo não era só de frase.** O `exposicao.mjs` projeta as rodadas devidas pela CADÊNCIA da casa, então cobrava da YouGov 07/Set e 14/Set e somava as duas na linha *"servida D+5.36 · com as que faltam D+4.66"*. Rodada de outro instrumento não é devida a esta média.

✅ **CONSERTADO em 22/Set/2026, e o atraso é o próprio caso.** A linha acima foi escrita em 15/Set como diagnóstico e ficou **sete dias** sem chegar ao código: em 22/Set a YouGov estava com **três** ondas seguidas medidas como NOMINAIS (campo 4-8, 11-14 e 18-21/Set) e a exposição ainda cobrava as três.

O registro é `lib/us-polls/instrumento-medido.mjs`, e ele é **dado declarado com prova e data**, nunca heurística: cada entrada guarda a onda, a ressalva literal, o PDF e a data da medição, para poder ser conferida e **desfeita**.

| régua | por quê |
|---|---|
| o corte é por **ONDA**, não por casa | a casa segue devendo o que é anterior à troca. Excluir a casa inteira apagaria buraco real do passado |
| `desde` é o **INÍCIO** do campo, não o fim | a cadência projeta SLOTS, e um slot cai DENTRO da onda que o preenche. Datando pelo fim (08/Set), o slot de 07/Set continuava cobrado, e quem o preenche é a onda 4-8/Set, que é nominal |
| a casa excluída **não some** do relatório | sai num bloco `🔬 rodada(s) NÃO cobrada(s)` com o motivo. Sumir com a linha esconde a decisão |
| não é permanente | casa que volta ao generic ballot volta a dever, e a entrada sai do registro. **Instrumento é propriedade da ONDA** |

📊 Medido no dia: exposição de **8 para 5 rodadas**, deslocamento de **−0,44pp para −0,34pp** e amplitude de **0,95pp para 0,59pp**.

🧪 `node scripts/testar-instrumento-medido.mjs`, **22 casos e no CI**, com 4 de 4 mutações reprovadas. Metade é anti-excesso, porque o erro simétrico deste conserto é calar buraco real.

| veredito | o que quer dizer |
|---|---|
| `GENERICO` | a pergunta está lá e sem ressalva colada. É a mesma medição da nossa média |
| `NOMINAL` | o eleitor viu os NOMES dos candidatos do distrito dele. **Outro instrumento** |
| `COM_RESSALVA` | a pergunta está lá com outra ressalva de quem foi perguntado. Precisa de olho humano |
| `AUSENTE` | documento legível, e a pergunta não está nele |
| `INDETERMINADO` | não deu para olhar. **Não é "nada novo"** |

🎯 **A lista de documentos vem da LISTAGEM da própria casa**, a mesma que o portão já consulta, e nunca de URL colada à mão. Ele marca cada documento com `JA NA BASE` ou `fora da base` casando a data de campo, então a saída diz de uma vez quais rodadas realmente faltam.

⚠️ **Depende do `pdftotext`**, que existe nesta máquina (MiKTeX) e **não existe no CI nem na Vercel**. Por isso ele é conferidor de rodada e nunca passo de cron. Sem o binário ele sai `INDETERMINADO` e código 1.

⛔ **Ele NÃO ingere e NÃO decide composição de média.** Ingerir muda a procedência e segue decisão do André.

🧪 `node scripts/testar-instrumento-us.mjs`, 75 casos e no CI, com 11 de 11 mutações reprovadas. Metade dos casos é anti-silêncio (documento ilegível não pode sair `AUSENTE`) e anti-alarme (a ressalva da pergunta SEGUINTE não pode virar ressalva desta).

🌍 **O `agregadores-us-polls.mjs` responde a pergunta que vem ANTES de todas as outras, criado em 13/Set/2026.** O coletor imprime "atraso da fonte: N dias" e não sabe dizer de quem é o atraso: ou ninguém mediu nada, e a base está completa, ou mediram e o índice não recebeu, e a base está incompleta. A defasagem responde casa por casa, deixa casas sem veredicto e não cobre quem não está no registro.

A resposta está no mesmo host que já lemos: a seção `GenericBallotAgg` do artigo da Câmara na Wikipédia, onde cada agregador declara o intervalo de campo da média dele. ⭐ **Medido no dia: seis de seis declaravam campo até 11/Set e a nossa base parava em 31/Ago, 11 dias.** Isso tinha sido lido UMA vez à mão, em 24/Ago, e nunca virou medidor.

| veredicto | o que quer dizer |
|---|---|
| `INDICE ATRASADO` | pelo menos 2 agregadores declaram campo mais de 3 dias depois da nossa base. Existem pesquisas que o índice não tem |
| `EM COMPASSO` | diferença de até 3 dias, com a tabela de agregadores atualizada há no máximo 7 |
| `BASE A FRENTE` | a nossa base tem campo mais novo que o dos agregadores, tabela viva |
| `INCONCLUSIVO` | seção sumida, rede caída, menos de 2 agregadores legíveis, ou tabela parada. **Não é "em compasso"** |

🔑 **A referência é a SEGUNDA maior data, não a maior**, para um erro de digitação isolado não fabricar atraso. E **tabela parada ainda prova atraso, mas não prova compasso**: data que já existiu não deixa de existir, mas dois parados concordarem entre si não diz nada.

📌 **O alcance dele é a PONTA, nunca a CONTAGEM.** Ele compara uma data só, a do campo mais recente, e todo veredito com referência sai com `alcance: 'PONTA'` e "NA PONTA" no motivo. Medido em 15/Set/2026: a CBS com campo até 11/Set igualou a data dos seis agregadores e o veredito saiu `EM COMPASSO`, enquanto o passo 1 contava 8 rodadas faltando dentro da janela e a listagem da Economist/YouGov declarava uma rodada de 4 a 8/Set fora do índice. **`EM COMPASSO` não quer dizer base completa**: quem responde pela contagem é o passo 1, nas listagens das casas e na exposição.

⛔ **Três coisas que ele NÃO faz:** não lê percentual de agregador (média de agregador não entra), não se publica (é fato da nossa coleta, não da eleição) e **não abre a ingestão**. Saber que o índice está atrasado não autoriza ler rodada no instituto: isso muda a procedência da média e segue decisão do André, por casa. Ver `memory/feedback_ingerir_so_quem_eu_notei_troca_amostra_por_escolha.md`.

🧪 `node scripts/testar-agregadores-us.mjs`, 51 casos e no CI. Conferido replantando 3 defeitos (referência pela maior data, sem checar tabela velha, sem tirar a `<ref>` da célula) e o teste reprovou os três.

📅 **O `projetar-janela-us.mjs` responde a pergunta que o Passo 4 faz e não tinha ferramenta**, que é de onde vem a variação, só que ANTES de ela acontecer. Ele reusa a `media()` de produção em vez de recopiá-la, conta por RODADA e não por linha, e nomeia quem sai em cada dia. ⭐ **O achado dele costuma ser o DEGRAU:** em 06/Set havia cinco rodadas com o mesmo fim de campo, 17/Ago, e todas saem no MESMO dia, 17/Set, levando o `n` de 8 para 3 e a média de D+5.00 para D+3.33. Queda de 1,67pp com zero informação nova, conhecida onze dias antes.

⛔ **Saída de USO INTERNO, como o efeito do recorte.** Ela descreve o que a NOSSA regra produz sobre a base que já está no arquivo, não o eleitorado. Publicar isso como leitura de intenção de voto seria atribuir ao mundo o que é da nossa coleta.

🧭 **O `check-us-polls-defasagem.mjs` tem CINCO vereditos, e o mais novo é o que evita alarme eterno:**

| veredicto | o que quer dizer |
|---|---|
| `POSSIVEL NOVIDADE` | o **item** mais novo da página fala do tema e é mais novo que a nossa base. Conferir o trecho impresso logo abaixo dele |
| `TEMA LONGE DA DATA` | há post mais novo que a nossa base, o tema aparece na página, mas a mais de 200 caracteres de qualquer data nova. Não é alarme nem "em dia": é o conferidor declarando que não amarra os dois |
| `INCONCLUSIVO` | menos de 3 datas lidas, ou o controle positivo não passou. **Não é "nada novo"**, é "não enxerguei a página" |
| `SEM ITEM DO TEMA` | a página foi lida e não fala de generic ballot |
| `EM DIA` | leu, fala do tema, e o item do tema não é mais novo que a nossa base |

⭐ **Ele imprime o TRECHO do item mais novo** nos dois primeiros casos, desde 07/Set/2026. Antes o veredicto mandava "abrir a página à mão", e naquele dia abrir custou quatro requisições para descobrir que o item mais recente da Big Data Poll era uma pesquisa local sobre TPS em Springfield, Ohio, e que o "Generic Ballot" era link permanente do catálogo de projetos dela. Com o trecho, a mesma decisão sai em cinco segundos.

🧪 **A regra do veredicto mora em `lib/us-polls/defasagem.mjs` e tem caso plantado:**

```bash
node scripts/testar-defasagem-us.mjs
```

Rodar depois de mexer no marcador do tema, na janela de proximidade ou na tolerância de dias. Metade dos 23 casos é de anti-silêncio: um conferidor que se aperta para calar falso positivo é a maneira mais fácil de transformar alarme barulhento em alarme mudo, e alarme mudo é indistinguível de alarme quebrado.

🔬 **O `historico-us-polls.mjs` também diz se o registro de hoje no Neon é do CRON ou de um forçamento**, e reaplica a regra de hoje aos dias já gravados como controle. Se ele disser que o cron gravou dentro da janela das 07:10Z e os números baterem com o arquivo, **o Passo 3 não é necessário**: forçar ali só troca o registro do cron por outro igual, com o risco já fichado de apagar o carimbo dele.

🔴 **E a base do controle é a do ARQUIVO, não a do registro mais recente**, desde 15/Set/2026. Naquele dia o índice recebeu a CBS antes do cron das 07:10Z: o arquivo em disco tinha 382/389 e o Neon 381/388. O controle ancorava no registro, recomputava 5 dias sobre o arquivo que já tinha a CBS e acusava 5 divergências e "projeção NÃO validada", com saída 1. Agora a regra mora em `diasComparaveis` (`lib/us-polls/historico.mjs`): arquivo **à frente** do Neon não tem dia comparável e o controle roda sobre o `git HEAD`, se ele tiver a base dos registros. No dia, as mesmas 5 datas reproduziram **5 de 5**. Mesma família do falso alarme de 12/Set, por outra porta: lá o critério olhava o campo errado, aqui o objeto errado.
- quantas linhas foram lidas e quantas foram descartadas por forma, com o motivo
- quantas ficaram **sem fonte primária**
- os institutos com campo mais recente, e a **dispersão entre eles**, que costuma ser o achado real

⚠️ **A dispersão importa mais que a média.** Em 31/Jul a Quinnipiac mediu D+7 e a Reuters/Ipsos D+2 com campo praticamente na mesma janela: cinco pontos entre duas casas de primeira linha. Reportar só a média esconde exatamente isso.

🎚️ **E parte da dispersão é ESCOLHA NOSSA, não medição das casas.** Quando o mesmo instituto publica LV, RV e A da mesma rodada, entra um só, pela hierarquia `LV > RV > A` do `collect.mjs`. A régua é certa e não se discute na rodada, mas ela TEM preço, e o preço se mede:

```bash
node scripts/efeito-do-recorte-us.mjs
```

Ele importa a hierarquia do coletor em vez de redigitá-la, e lê `mediaAfos.incluidas` em vez de reimplementar a janela. Sai o piso empírico do arquivo inteiro e, para a média servida, quanto UMA troca de recorte a moveria. 📌 Medido em 05/Set/2026: em 265 rodadas, 95 têm mais de um recorte, o |delta| mediano é 1,00pp, e a escolha **trocou o SINAL uma única vez**, na Harvard/Harris de 30/Ago, LV em R+2 contra RV em D+2 na mesma onda. Essa rodada sozinha levou a média de D+5.69 para D+5.14 e a amplitude de 4,00pp para 10,00pp. ⚠️ Saída de USO INTERNO: descreve a sensibilidade do MÉTODO, não é manchete nem ressalva plantada.

## Regras que valem aqui

- **Wikipédia é ÍNDICE, o instituto é FONTE.** A página agrega e dá o caminho; o número citado é o do instituto, com link para a fonte primária. Pesquisa sem fonte primária entra na contagem de qualidade e é declarada, não some.
- **Agregador não entra.** Média de agregador não é pesquisa, e misturar as duas coisas produziria uma média de médias. Os ignorados estão declarados no próprio arquivo, em `procedencia.agregadoresIgnorados`.
- **A média da casa é simples, não ponderada**, e isso é declarado na tela. Não trocar o método sem decisão do André: mudar a régua no meio da série quebra a comparabilidade de tudo que já foi publicado.
- Se commitar o arquivo, **`/dashboard/us` precisa de deploy** para o piso novo valer. O Neon não precisa.

Ver também `/atualizar-usa`, que roda isto dentro de uma passada completa do painel.

## 🧬 O NOME DA CASA entra na média, e a tabela é `lib/us-polls/casas.mjs` (25/Set/2026)

🔴 **O defeito:** a média é uma rodada por instituto por onda, e agrupava pelo **nome que o índice escreveu**. Em 25/Set três casas estavam na média **duas vezes**: 41 rodadas onde a regra dá 38, e 31 institutos onde ela dá 28.

🔑 **E a origem não era o índice, era a nossa CURADORIA.** A curada é escrita à mão do documento do **instituto**, onde a casa se nomeia (Fox News, Marquette Law School, ActiVote); o índice a nomeia pelo **executor** ou com outra grafia (Beacon/Shaw, Marquette University Law School, ActiVote). A regra "o índice SEMPRE vence" aposenta a curada pela CHAVE, e a chave era o nome: rótulos diferentes, nenhuma aposentadoria. Eram **cinco** curadas nesse estado, três na janela.

⚖️ **Decisão do André:** "fica o nome de quem EXECUTA nos três pares".

| peça | o que faz |
|---|---|
| `lib/us-polls/casas.mjs` | a tabela ÚNICA. Existia desde 17/Set para os medidores por casa, e passou a valer na média, no desempate e na aposentadoria da curada |
| `media()` | chaveia por `serieDaCasa`, e grava `institutoNoIndice` ao lado quando houve colapso |
| `rodadas-curadas.mjs` | `chave()` e `suspeitas` pela série: uma letra não derrota mais o "índice vence" |
| passo **2.5/9** | `rodada-duplicada-us.mjs`, que sai RESOLVIDA para par já declarado |

⛔ `polls[]` não muda: é a transcrição do índice. ⛔ Casamento por string **EXATA**: grafia não declarada passa inteira e volta a ser cobrada.

⚠️ **Preço declarado:** ao se aposentar, a curada da ActiVote leva o **decimal** com ela (52,3 x 47,7 volta ao 52 x 48 do índice).

### 🧭 E o VEREDITO DA VARIAÇÃO ganhou três classes, porque ele mentiu

🔴 Na primeira passada com a tabela ligada, o portão leu 4 saídas e 1 entrada e devolveu **`PESQUISA_NOVA + borda-rolou`**. Nada entrou e nada rolou pela borda. A régua manda escrever a atribuição a partir desse bloco, então veredito falso vira **frase falsa**.

| classe | quando |
|---|---|
| `RENOMEACAO` | mesma casa, mesma onda, rótulo diferente. Par 1 para 1 |
| `DEDUPLICACAO` | saiu e a casa **continua** na média naquela onda |
| 🔴 `DUPLICOU` | o INVERSO, que não se cala por simetria: a casa passou a ser contada duas vezes |

🧪 `testar-casas-us.mjs` **81 asserções, 11 de 11 mutações** · `testar-atribuicao-us.mjs` **42, 7 de 7**. Os dois no CI.

## 🔗 A FONTE foi aberta, e o que ela sustenta: `lib/us-polls/fonte-conferida.mjs` (25/Set/2026)

🔴 **O buraco:** o arquivo declara `qualidade.semFontePrimaria`, que conta **AUSÊNCIA** de link. O caso oposto e mais comum não tem contador nenhum: **link PRESENTE que não sustenta a linha**. Para todo portão da casa aquela linha tem fonte, porque o campo está preenchido.

⛔ **E o custo não é de forma, é a conferência REFEITA toda rodada.** Sem registro, a próxima passada busca o mesmo documento, tropeça no mesmo 451 e chega à mesma conclusão gastando o mesmo tempo.

| resultado | o que quer dizer |
|---|---|
| `CONFIRMA` | o documento do instituto sustenta a linha inteira |
| `CONFIRMA_PARCIAL` | sustenta parte, e exige as **DUAS** listas: `confirmado` e `naoConfirmado` |
| `NAO_CONTEM_A_PERGUNTA` | o documento existe, foi lido, e não traz a pergunta |
| `NAO_ENCONTRADO` | nada do executor nem do patrocinador foi achado |

🔑 **Casa por casa (pela SÉRIE), campo e VALORES.** Se o índice reescrever D ou R, a conferência **CADUCA** e a linha volta a contar como não conferida. ⛔ Não é portão e não muda veredito: é ledger de dívida, impresso em toda passada pelo `conferir-us-polls`, e a ficha de quem ENTRA já diz se a fonte daquela rodada foi aberta antes.

### As duas primeiras entradas, de 25/Set/2026

- **CNN/SSRS, 16-17/Set, `CONFIRMA_PARCIAL`.** A **SSRS é quem vai a campo** e publica no próprio site, alcançável: ela declara campo, amostra total de 1.206, margem de ±3,5 no total e a **vantagem de 8 pontos**, que é o que entra na média. A decomposição 49 x 41 x 10 e o subgrupo de 867 RV com ±4,1 seguem valendo pelo índice, porque a CNN devolve **451** para leitor automatizado. 🔑 **A régua que sai daí: para pesquisa de veículo, procurar o site de quem EXECUTA antes do site de quem publica.**
- **Emerson College/RealClear, 12-15/Set, `NAO_CONTEM_A_PERGUNTA`.** O link do índice é matéria sobre **primárias**, sem generic ballot. A Emerson publica a onda de 21-22/Set (53 x 42, 1.000 LV) e **nenhuma** de 12-15/Set; nada achado na RealClear. A metodologia declarada bate, mas metodologia não é topline.

📌 **As duas valem 0,00pp na média de hoje**, porque as duas estão praticamente na média. Isso é propriedade do dia e não motivo para parar de cobrar.

🧪 `node scripts/testar-fonte-conferida.mjs`, **29 asserções e no CI**, com **9 de 9 mutações reprovadas**. A mais importante é a que cala o ledger: `dividasAbertas` devolvendo vazio tem de reprovar.

## 🎯 A MÉDIA MEDE O QUE ELA DIZ MEDIR: onda de outro instrumento fica FORA (26/Set/2026)

⚖️ **Decisão do André**, delegada com "resolva da melhor forma técnica possível".

🔴 **O que havia:** o registro `instrumento-medido.mjs` nasceu em 22/Set para a **cadência** parar de cobrar da casa ondas que ela publicou com cédula **nominal**. A **média** seguiu incluindo essas mesmas ondas. Ou seja, a casa declarava, com prova e data, que três ondas não são generic ballot, e publicava-as dentro de uma média chamada generic ballot. **Dois medidores da mesma pergunta discordando dentro de casa.**

📊 **Preço:** as três ondas nominais eram as **três maiores margens da janela** (D+14, D+12 e D+11) e puxavam a média para cima. **D+7,97 sobre 38 rodadas virou D+7,59 sobre 34** (a diferença inclui a borda que rolou no dia).

| régua | por quê |
|---|---|
| o corte é por **ONDA** e pelo **INÍCIO** do campo | a casa segue na média com tudo que é anterior à troca, e segue mesmo, pela onda de 31/Ago |
| a exclusão **não some** | sai em `mediaAfos.excluidasPorInstrumento`, uma entrada por **rodada**, com `desde`, `medidoEm`, a ressalva literal e a **prova** |
| `media()` aceita `registroInstrumento` | para o medidor mostrar o preço **desligando** a regra, sem escrever uma segunda cópia dela |
| o `metodo` publicado diz isso | promessa que a página faz sobre si mesma não pode ficar falsa em silêncio |

⛔ **E a atribuição ganhou `EXCLUIDA_POR_INSTRUMENTO`**, porque sem ela o portão diria `COMPOSICAO`, cuja leitura prescrita é "saiu gente pela borda". Falso: a rodada **continua na janela** e deixou de ser elegível. Quem mexeu foi a **régua**, não o eleitorado nem a borda.

## 🧬 O índice renomeou DUAS casas em 24 horas (26/Set/2026)

⭐ **Prova independente da tese da tabela de casas**, e ela veio sozinha:

| casa | o que mudou |
|---|---|
| McLaughlin & Associates | entrou em 25/Set **sem** o sufixo `(R)` e em 26/Set apareceu **com** ele, que é a forma das 7 rodadas anteriores |
| Emerson College/RealClear | o índice passou a escrever um **ESPAÇO** depois da barra |

Sem declaração, as duas saem como rodada que **saiu** e rodada que **entrou**, ou seja "pesquisa nova" onde nada é novo. Declaradas, saem como `RENOMEADA`.

🔎 **E a renomeação passou a dizer se o VALOR mudou na mesma troca.** Correção da origem escondida dentro de uma troca de rótulo passaria como "só renomeou". 📌 **Neste caso não mudou:** D 48 x R 43 nos dois rótulos, conferido contra o `git HEAD`. ⚠️ **E aqui eu tinha errado:** em 25/Set relatei essa rodada como D 47 x R 42, e o arquivo daquele dia registra 48 x 43. A margem, D+5, estava certa; a decomposição no meu relato não. A errata está na ficha da rodada.

### ⏳ O que ficou declarado como NÃO decidido

`Emerson College/RealClear Opinion Research` **não** foi juntado com `Emerson College` puro, que tem 9 rodadas próprias. Sob "fica quem executa" as duas colapsariam, porque a Emerson vai a campo nas duas, mas vale a advertência da tabela: "Morning Consult" e "Morning Consult/Cato Institute" são produtos diferentes. Juntar é outra pergunta de procedência.

🧪 `node scripts/testar-casas-us.mjs`, **103 asserções e no CI**, com **8 de 8 mutações reprovadas** só na parte do instrumento. Metade dos casos é anti-excesso: onda anterior à troca continua, campo que **começa** antes continua, casa fora do registro não é tocada.
