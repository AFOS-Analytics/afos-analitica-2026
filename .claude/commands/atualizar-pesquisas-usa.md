# AFOS Analytics — Atualização do Generic Ballot (EUA, midterms 2026)

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

## Passo 1: gerar o arquivo

```bash
node scripts/parse-us-generic-ballot.mjs
```

Opções: `--dias=30` (janela da média, padrão 30) e `--out=caminho` (padrão `public/us-polls-data.json`).

## Passo 2 (BLOQUEANTE): conferir que a leitura não colapsou NEM se contaminou

🔴 **O script NÃO tem portão de segurança, e o cron TEM.** Esta assimetria é real e é a razão deste passo existir.

A rota do cron se recusa a gravar leitura vazia por cima de uma boa: Wikipédia fora do ar, mudança de estrutura da página ou parse quebrado chegam como zero pesquisas, e ela devolve 502 sem gravar. **O script escreve o arquivo de qualquer jeito.**

⚠️ **São DOIS defeitos possíveis, e só um deles encolhe o arquivo.** Em 01/Ago/2026 a coleta CRESCEU de 278 para 282 linhas e mesmo assim publicou lixo. Conferir só o tamanho não basta.

```bash
node scripts/conferir-us-polls.mjs
```

🔴 **Rodar ISTO, e não o `node -e` de cabeça.** O script existe desde 04/Ago/2026 e não estava citado em comando nenhum, então na prática eu redigitava a conferência toda sessão, e conferidor que se redigita é chance nova de errar. Medido em 04/Set/2026: por não estar aqui, ele não foi rodado, e a atribuição da variação daquele dia foi feita à mão.

Ele varre **todas** as linhas, compara contra a versão do `git HEAD`, aplica as duas réguas abaixo e termina em `VEREDITO: APROVADO` ou `REPROVADO`. Aceita `--base=<ref-git>`, `--arquivo=` e `--base-arquivo=`.

🧭 **Ele também responde a pergunta do Passo 4**, que é a única que a régua faz antes de qualquer verbo de movimento: **o que mudou foi a intenção de voto ou foi o conjunto?** Sai como `COMPOSICAO`, `PESQUISA_NOVA`, `CORRECAO`, `PARADO` ou `INCONSISTENTE`, nomeando rodada a rodada quem entrou e quem saiu, e confere que a subtração fecha.

🔑 **Isso só funciona porque o arquivo passou a gravar QUAIS pesquisas entraram na média, em `mediaAfos.incluidas`, e não só quantas.** Antes de 04/Set/2026 a comparação era por NOME de casa, e nome de casa não é rodada: uma onda nova de uma casa que já estava na lista passava invisível. Caso medido sobre o arquivo real daquele dia: uma onda da YouGov com campo 28/Ago levaria a média de D+5.69 a D+5.93, e a régua antiga imprimiria *"ZERO informação nova, escrever verbo de movimento aqui é falso"*. Falso negativo que produz frase falsa. A regra vive em `lib/us-polls/atribuicao.mjs`, com casos plantados em `scripts/testar-atribuicao-us.mjs`.

⚠️ **Comparando contra uma base anterior a 04/Set/2026 ele avisa `atribuição DEGRADADA`** e manda não usar aquela linha para afirmar "zero informação nova". Isso acontece uma única vez.

Para conferir uma peça isolada à mão, ou se o script cair:

```bash
git diff --stat public/us-polls-data.json
node -e "const a=require('./public/us-polls-data.json');const q=a.qualidade,m=a.mediaAfos;console.log('publicadas',q.publicadas,'de',q.linhasLidas,'| descartadas',q.descartadas,'(forma',q.descartadasPorForma+', valor',q.descartadasPorValor+')','| media',m&&m.vantagemDem,'| institutos',m&&m.nInstitutos);const mau=a.polls.filter(p=>!(p.dem>=15&&p.dem<=70&&p.rep>=15&&p.rep<=70&&p.dem+p.rep<=100));console.log('linhas fora da regua entre as PUBLICADAS:',mau.length);const somas=a.polls.map(p=>p.dem+p.rep+(p.outros||0));const fora=somas.filter(s=>s<97||s>102);console.log('soma D+R+outros FORA da faixa 97-102:',fora.length,'de',somas.length,fora.length?'-> valores '+[...new Set(fora)].slice(0,10).join(' '):'');console.log('semFontePrimaria (contador do ARQUIVO):',a.qualidade.semFontePrimaria)"
```

**Regra de colapso:** se `publicadas` foi a 0, ou caiu para menos da metade, ou `mediaAfos` veio nulo, não commitar.

**Regra de contaminação:** se sobrar linha fora da régua entre as publicadas, ou se a soma Dem+Rep+outros não fechar perto de 100, **não commitar**. Soma que não fecha é a assinatura de coluna deslizada.

Desfazer com `git checkout -- public/us-polls-data.json` e investigar a origem.

### 📐 A régua, e por que a soma é o melhor teste
O portão de valor exige percentual entre **15% e 70%** para os dois partidos, e soma dos dois até 100. É folgado de propósito: existe recorte legítimo de adultos com muito indeciso (D=33 x R=28).

Mas o teste mais forte não é a régua, é a **soma com os outros**: numa linha bem lida, Dem + Rep + outros fecha em 99 ou 100. Quando a coluna desliza, a soma desanda. É o jeito mais rápido de saber se a origem mudou de formato.

⚠️ **A soma se confere em TODAS as linhas, não numa amostra.** A versão antiga deste comando olhava as 5 primeiras, que são sempre as mais recentes e as mais bem formatadas. Coluna deslizada aparece onde a origem mudou de formato, e isso costuma ser no meio ou no fim da tabela. Em 04/Ago/2026, varrer as 351 achou 2 fora da faixa que a amostra de 5 nunca mostraria.

📌 **Soma fora da faixa NÃO é automaticamente defeito.** As 2 de 04/Ago eram RMG Research somando 94 e Reuters/Ipsos somando 92, as duas com o indeciso fora de "outros". Antes de desfazer, abrir a linha: se `dem` e `rep` são plausíveis e `amostra` e `margemErro` estão nos campos deles, é recorte do instituto, não coluna deslizada. **Coluna deslizada tem assinatura própria: a amostra ou a margem aparecem COMO intenção de voto.**

🏷️ **O campo da fonte chama `fontePrimaria`, não `fonte`.** Contar com o nome errado devolve "351 de 351 sem fonte primária", que parece achado gravíssimo e é laço vazio. **Usar o contador que o próprio arquivo declara, `qualidade.semFontePrimaria`**, em vez de recalcular por conta própria. Campos reais de uma linha: `instituto`, `campoInicio`, `campoFim`, `amostra`, `amostraTipo`, `margemErro`, `dem`, `rep`, `outros`, `vantagemDem`, `fontePrimaria`.

### 🔴 O defeito de 01/Ago, para reconhecer se voltar
A coleta publicou **"Big Data Poll · D 914 x R 3,2"**. O 914 era o TAMANHO DA AMOSTRA e o 3,2 era a MARGEM DE ERRO.

**Causa:** o `rowspan` da Wikipédia não fica só no instituto e nas datas, fica **também na margem de erro** (`rowspan="3"|–`). Nas linhas seguintes do grupo a célula da margem não existe, tudo desliza uma coluna, e o leitor gravava o REPUBLICANO no lugar do democrata e o OUTROS no lugar do republicano. Assim "Focaldata/FT, Dem 51 x Rep 44, outros 5" virava "D=42 x R=9".

O leitor passou a resolver `rowspan` **por índice de coluna**, o que consertou a raiz: os descartes por valor caíram de 35 para 0 e a leitura subiu para 304 de 307. **Se `descartadasPorValor` voltar a subir, a origem mudou de formato de novo** e o lugar de olhar é o `parseTabela`.

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

## Passo 4: relatar

Reportar sempre, com os números do arquivo e não de memória:

- média da casa (`vantagemDem`), no formato **D+X,XX** ou **R+X,XX**, e a variação contra a leitura anterior em pp

⚠️ **Dizer SEMPRE de onde veio a variação, porque a janela de 30 dias rola sozinha.** A média muda sem nenhuma pesquisa nova: basta uma antiga sair pela borda. Em 04/Ago/2026 a média foi de D+5,69 para D+5,75 com **zero pesquisa nova**, só porque `nPesquisas` caiu de 26 para 24. Reportar "a média subiu" ali seria falso: quem mudou foi o conjunto, não a intenção de voto.

✅ **Não fazer essa atribuição de cabeça: ela sai do `conferir-us-polls.mjs` do Passo 2**, no bloco `composição`, que nomeia a rodada que entrou e a que saiu e fecha a subtração. Em 04/Set/2026 a média foi de D+6.07 para D+5.69 com zero pesquisa nova, porque a John Zogby Strategies, campo 04-05/Ago e D+11.00, saiu pela borda quando o dia UTC virou: `(6.07 × 14 − 11.00) / 13 = 5.69`, exato.

Comparar `nPesquisas` e `nInstitutos` com a leitura anterior antes de escrever qualquer verbo de movimento. Se caíram, a variação é de **composição** até prova em contrário. E citar a **data de campo mais recente da base**: se ela tem vários dias, a régua está parada e a média mexer é alerta, não sinal.
- quantas pesquisas e quantos institutos entraram na janela, e qual é a janela em dias

🔴 **E TRÊS MEDIDORES QUE JÁ EXISTEM E NÃO ESTAVAM CITADOS AQUI, que é o mesmo defeito do `conferir-us-polls` antes de 05/Set:** script não citado vira conta refeita à mão toda rodada. Medido em 06/Set/2026: refiz a projeção da janela de cabeça e **errei a borda em um dia**, porque a janela é INCLUSIVA (`campoFim >= corte`) e eu usei `campoFim + 30` em vez de `+ 31`. O `projetar-janela-us.mjs` já acertava isso desde sempre.

```bash
node scripts/projetar-janela-us.mjs      # o FUTURO da janela, se nada entrar
node scripts/historico-us-polls.mjs      # a SÉRIE no Neon, e se o registro de hoje é do cron
node scripts/check-us-polls-defasagem.mjs # o instituto publicou algo que o índice não tem?
```

📅 **O `projetar-janela-us.mjs` responde a pergunta que o Passo 4 faz e não tinha ferramenta**, que é de onde vem a variação, só que ANTES de ela acontecer. Ele reusa a `media()` de produção em vez de recopiá-la, conta por RODADA e não por linha, e nomeia quem sai em cada dia. ⭐ **O achado dele costuma ser o DEGRAU:** em 06/Set havia cinco rodadas com o mesmo fim de campo, 17/Ago, e todas saem no MESMO dia, 17/Set, levando o `n` de 8 para 3 e a média de D+5.00 para D+3.33. Queda de 1,67pp com zero informação nova, conhecida onze dias antes.

⛔ **Saída de USO INTERNO, como o efeito do recorte.** Ela descreve o que a NOSSA regra produz sobre a base que já está no arquivo, não o eleitorado. Publicar isso como leitura de intenção de voto seria atribuir ao mundo o que é da nossa coleta.

🔬 **O `historico-us-polls.mjs` também diz se o registro de hoje no Neon é do CRON ou de um forçamento**, e reaplica a regra de hoje aos dias já gravados como controle. Se ele disser que o cron gravou dentro da janela das 07:10Z e os números baterem com o arquivo, **o Passo 3 não é necessário**: forçar ali só troca o registro do cron por outro igual, com o risco já fichado de apagar o carimbo dele.
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
