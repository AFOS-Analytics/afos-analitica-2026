# AFOS Analytics — Atualização de Pesquisas Eleitorais (TSE, BRASIL)

## 🌐 Rede externa: rodar ANTES, se não estiver na rede de casa (17/Set/2026)

```bash
npm run rede:afos        # 0 LIMPA · 2 DOMINIO_INTERCEPTADO (imprime o export) · 1 SEM_ACESSO
export AFOS_BASE=https://afos-analitica-2026.vercel.app   # só se o veredito for 2
```

🔴 Numa rede com inspeção de TLS (FortiGate), **só `www.afos-analytics.com` chega reassinado**: todo leitor local cai com `UNABLE_TO_VERIFY_LEAF_SIGNATURE` enquanto Vercel, GitHub, HF, Neon, Resend, TSE e Polymarket passam. O `AFOS_BASE` troca o **host de leitura** para o alias de produção (mesmo `dpl_`, conferido por `vercel inspect`), e os 13 leitores locais leem dele via `scripts/lib/base-afos.mjs`. ⛔ **Nunca desligar verificação de certificado.** ⛔ Links públicos (email, feed, sitemap, `llms.txt`) continuam no domínio canônico. Chamadas `curl` deste comando: trocar `https://www.afos-analytics.com` por `${AFOS_BASE:-https://www.afos-analytics.com}`. → `memory/reference_rede_com_inspecao_tls_fortigate.md`

Ingerir o registro de pesquisas eleitorais do TSE e cruzar o calendário delas com o Polymarket do Brasil.

## 🔴 Comece por aqui: a rota do cron está MORTA desde 18/Ago/2026

**Não abra este comando pelo `/api/cron/refresh-polls`.** Ele devolve `HTTP 500` com `"motivo": "Error: TSE CDN returned 403"`, e vai continuar devolvendo.

O TSE instalou proteção anti-robô na borda Akamai em toda a propriedade. O corte **não** é navegador contra robô: é **origem de rede**. Cliente vindo de faixa de datacenter apanha sempre, e a Vercel é datacenter. Medido em 22/Ago:

| cliente | de onde | resultado |
|---|---|---|
| Node `fetch` | casa, IP residencial | **200, ZIP inteiro** |
| Node `fetch` | Vercel (o cron) | 403 |
| Node `fetch` | GitHub Actions | 403 |
| `curl` | qualquer lugar | 403 |

Chamar a rota mesmo assim não é erro grave, ela **falha fechada** e nada é gravado, mas é uma chamada desperdiçada e um 500 no log. Confirme o estado se quiser, e siga para o Passo 1.

⛔ **Não forjar user-agent** para escapar do 403, e **não insistir**. Se um dia o modo `--rede` também apanhar, a resposta é o modo ARQUIVO, nunca a insistência. → `memory/reference_tse_bloqueio_antirrobo_2026.md`

## 🚀 O atalho, criado em 09/Set/2026

```bash
npm run pesquisas:brz                             # ENSAIO, não grava nada
node scripts/rodada-tse-brz.mjs --apply           # grava, relata e confere o RÓTULO
```

Ele encadeia sonda, ingestão, relatório, conferidor de escopo e sonda de fechamento, e preserva o ensaio: **sem `--apply` ele para depois de listar o que entraria**, sem rodar os passos 2, 3 e 4. O motivo não é cerimônia: o relatório lê a API e o Neon, então rodá-lo sobre um ensaio mostraria o banco **sem** as linhas recém-listadas, um retrato que não é o de antes nem o de depois.

🏷️ **O terceiro passo é o `conferir-escopo-derivado`, e ele está encadeado por um motivo medido:** em 07/Set/2026 esse conferidor estava escrito, testado com casos plantados, e **nunca era chamado por quem publica**. Régua citada em prosa é régua que alguém pula. Saída diferente de zero ali é SINAL, e não desfaz a ingestão: **1** quer dizer GRAVE no calendário vivo, o número está certo e quem não se sustenta é o rótulo de nacional; **3**, desde 14/Set/2026, quer dizer aprovado sobre base CORTADA pelo teto de 200 linhas da rota, que vale como piso.

⛔ **Ele não roda o `/atualizar-brz`, não publica e não commita.**

## 🔍 A SONDA, passos 0 e 4, criada em 11/Set/2026

🔴 **Por que ela existe:** em 10/Set a mesma URL do TSE devolveu **851 e 863 alternando**. Uma retirada foi publicada como fato, depois desafirmada, e as duas vezes com **UMA leitura**. A dupla contagem resolveu o caso, mas ela só fala **depois** de gravar.

⭐ **O que tornou a repetição barata**, reconferido em 11/Set daqui, mesma URL e mesmo cliente:

| método | resposta |
|---|---|
| `HEAD` | **403** |
| `GET` | 200, ZIP inteiro, 3,8 MB |
| `GET` com `Range: bytes=0-0` | **206**, com `content-range` e `etag` |

📌 **Este quadro não é achado de 11/Set: ele está medido desde 23/Ago** em `reference_tse_bloqueio_antirrobo_2026`, que já registra o eixo do MÉTODO e o `Range` com 1024 bytes. O que 11/Set acrescenta é **o uso dele como instrumento**: `bytes=0-0` custa **um byte** e o par `content-range` + `etag` identifica o retrato, porque o ETag do Apache codifica tamanho e mtime. A régua velha ali é *"ao testar o bloqueio, usar sempre `GET`"*; a nova é *"para repetir a leitura, usar `GET` com `Range`"*.

```bash
npm run sonda:brz                                  # 5 leituras de 1 byte
npm run sonda:brz -- --leituras=11 --baixar        # + ZIP inteiro, sha256 e contagem
node scripts/rodada-tse-brz.mjs --apply --leituras=11
node scripts/rodada-tse-brz.mjs --apply --sem-sonda    # ⛔ só com motivo
```

🔑 **Os dois passos medem coisas diferentes.** O **0** pergunta se a fonte serve dois retratos AGORA e **PARA o `--apply`**, porque o total que a rodada grava vira o "ontem" contra o qual tudo se mede amanhã. O **4** pergunta se ela trocou **durante** a rodada, que é a janela em que o download aconteceu, e só AVISA, porque ali já está gravado e a ingestão é aditiva.

⚠️ **Saída 2 é a fonte em trânsito, manda ESPERAR. Saída 1 é a borda recusando, manda ir ao modo ARQUIVO.** Não são a mesma coisa e pedem ações opostas.

⚠️ **E concordância não é prova:** leituras seguidas podem cair no mesmo nó. Ela vale por ser n leituras em vez de uma, e `--baixar` é o único passo que fala dos **bytes** que entram, em vez de um cabeçalho.

## 👻 O CONJUNTO de fantasmas, criado em 11/Set/2026

O `historico-arquivo.jsonl` guarda **quantos** fantasmas existem e nunca **quais**. Em 11/Set as duas contas concordaram em 1 retirada nova e o protocolo dela teve de ser **deduzido**. Agora o `--apply` também anota o conjunto em `data/tse/fantasmas.jsonl`, e a retirada sai **por nome**.

⭐ **E o conjunto responde o que a contagem não responde:** 80 para 81 também é compatível com **duas saírem e uma voltar**. A subtração dá 1 nos dois casos, e só o conjunto separa. ⚭ **E desde 13/Set/2026 a retirada sai com IDENTIDADE, não só com o protocolo.** Naquele dia duas saíram, o conjunto entregou `BR043752026` e `BR065952026` como prometido, e mesmo assim foi preciso rodar um SEGUNDO script e grepar a saída para responder a única pergunta que muda o que se faz hoje: **era NACIONAL com divulgação à frente, ou estadual já vencida?** Protocolo é chave, não identidade.

Agora a linha sai com escopo, data de divulgação e casa, e o bloco fecha com um veredito:

```
   ➖ 2 SAIU(RAM) do registro do TSE desde então:
      BR043752026  estadual  div 2026-09-15  APURA PARANA
      BR065952026  estadual  div 2026-09-15  MT DADOS PESQUISAS
   ✅ nenhuma retirada era nacional com divulgação à frente: nada a corrigir no calendário.
```

⛔ **Sem identidade ele fica CALADO em vez de dizer "nenhuma nacional".** Zero calculado sobre base ausente mandaria publicar sossegado justamente no caso em que ninguém olhou.

↳ **E desde 16/Set/2026 a retirada nacional viva sai com o que a MESMA casa ainda tem à frente no arquivo.** Naquele dia saiu a `BR-01431/2026`, American Analytics, com divulgação marcada para o PRÓPRIO dia e impressa no calendário de cinco dailies, e a pergunta "a casa sumiu ou tem outra data?" foi respondida à mão:

```
      BR014312026  div 2026-09-16  AMERICAN ANALYTICS
         ↳ a casa tem 1 nacional(is) com divulgação à frente no registro atual:
            BR025872026  reg 2026-09-15  campo 2026-09-15 a 2026-09-20  div 2026-09-21  mesma assinatura (n, custo, metodologia)
         ⚠️ assinatura igual NÃO prova re-registro: ela aparece em 2 de 4 registro(s) desta casa no arquivo, e o registro não diz o motivo da retirada.
```

⛔ **Ele não diz "re-registro", de propósito.** Das 577 assinaturas do arquivo, 138 se repetem, e Nexus e AtlasIntel têm 9 cada: casa de onda regular repete n, custo e metodologia toda semana. A própria `BR-02587` tem a assinatura idêntica à `BR-09521` de JUNHO. Por isso a contagem da casa sai ao lado, e o motivo da retirada fica sem nome.

🕐 **E o veredito passou a usar a data civil do BRASIL.** O conserto de 15/Set chegou aos três leitores e não chegou a `vereditoEditorial`, que ainda usava UTC: das 21h BRT em diante, justamente a retirada daquele dia (nacional, divulgação HOJE) sairia como "nada a corrigir no calendário".

Teste: `node scripts/testar-tse-fantasmas.mjs`, **51 asserções**, incluindo o portão que NÃO pode disparar (nacional já vencida, estadual à frente), o medidor mudo, o CNPJ ausente que não pode virar "a casa não tem nada" e o relógio falso às 22h30 BRT. **9 de 9 mutações reprovadas.**

## Passo 1: ingerir daqui, com ENSAIO antes

```bash
npx tsx scripts/ingest-tse-local.ts --rede            # ensaio, NÃO grava
npx tsx scripts/ingest-tse-local.ts --rede --apply    # grava no Neon
```

Sem `--apply` ele só mostra. O ensaio existe para você ver o que entraria antes de entrar.

**Portão de colapso embutido:** arquivo com zero pesquisas presidenciais aborta sem gravar. Se o número total despencar sem motivo, não force.

**Modo ARQUIVO, para quando a rede falhar:**

```bash
npx tsx scripts/ingest-tse-local.ts caminho/pesquisa_eleitoral_2026.zip --apply
```

O script confere os bytes `PK` no início e recusa HTML salvo por engano, que é o que acontece quando alguém salva a página de 403 com extensão `.zip`.

## ⚠️ Passo 2: o que este arquivo É, e o que ele NÃO é

🔑 **O ZIP do TSE é o REGISTRO da pesquisa, não o resultado dela.** Os campos são `protocolo`, `registroDate`, `instituto`, `cnpj`, `cargo`, `campoInicio`, `campoFim`, `divulgacao`, `amostra`, `uf`, `conre`, `estatistico`, `valorPesquisa`, `metodologia`, `planoAmostral`, `controlSystem`.

**Não existe percentual aqui.** Nenhum candidato, nenhuma intenção de voto. Quem alimenta o grafo é o campo `percentage` e quem alimenta o dataset do HF é o `value`, e os dois chegam por outro caminho.

📌 **Consequência direta para o Passo 4:** o "cruzamento com odds" **não sai desta ingestão**. O que sai é o cruzamento do CALENDÁRIO, ou seja, quais pesquisas estão em campo e quais têm divulgação marcada, contra o preço de hoje. É um cruzamento para a frente, e é o mais útil que este comando produz.

## ⚠️ Passo 3: data no FUTURO é normal aqui, não é defeito

O TSE aceita registro **antes** da pesquisa ir a campo, então o arquivo traz `divulgacao` e até `campoFim` em datas futuras. Medido em 01/Set/2026: **61 das 155 recentes** tinham data futura, com divulgação prevista até 06/Set e campo até 09/Set.

**Isso é registrada ≠ publicada, e é justamente o que o Passo 5 pede para reportar.** Não tratar como anomalia, não filtrar. E como não há percentual no arquivo, não existe risco de antecipar número.

## 📣 O GATILHO DO PAINEL é a DIVULGAÇÃO, e a rota CORTA calada, criado em 14/Set/2026

🔴 **O defeito, na rodada de 14/Set:** o arquivo do TSE era o mesmo retrato de 13/Set, a ingestão inseriu zero e a rodada fechava com *"Nenhuma NACIONAL entrou"* e *"rodar /atualizar-brz se algo nacional entrou"*. **Naquele dia NEXUS e Quaest divulgavam**, as duas inseridas em 09/Set. O relatório tinha `prevista` com `> hoje` e `vencida` com `<= hoje`, então **o dia de hoje virava um número dentro de uma contagem, sem nome**, e a dica do fecho só aparecia quando havia nacionais FUTURAS, que nunca disparam o painel.

✅ **Agora o relatório tem o bloco `📣 DIVULGAM HOJE`**, com protocolo, casa e fantasma separado, e o fecho decide pelo dia: `DISPARA`, `NAO_DISPARA` ou `INDETERMINADO`. ⛔ Divulgação marcada **não é número publicado**: o `/atualizar-brz` entra quando o instituto tiver publicado, e a data do registro é compromisso, não fato.

## 🕐 E "HOJE" é a data civil do BRASIL, não a UTC, corrigido em 15/Set/2026

🔴 **A pendência ficou aberta em 14/Set e o erro andava nas DUAS direções.** Os três leitores calculavam `hoje` como `new Date().toISOString().slice(0, 10)`, que é a data **UTC**, e o campo com que ela é comparada é a `divulgacao` do registro do TSE, que é data civil brasileira. Das **21h BRT** em diante as duas divergem, e o bloco `📣` é o gatilho do painel:

- as nacionais que divulgaram HOJE saem do bloco e caem em "vencidas", então o painel não reflete pesquisa **que já está publicada**;
- e as de AMANHÃ entram como "divulgam hoje", então o gatilho dispara para pesquisa **que ainda não saiu**.

Nenhuma das duas dá erro. Medido no dia: `2026-09-16T02:30:00Z` é **15/Set no Brasil** e 16/Set em UTC, e a passada dos EUA daquela manhã foi certificada às 01:07Z, ou seja 22:07 BRT do dia anterior, então a rodada roda nessa faixa de verdade.

✅ A regra mora em `scripts/lib/data-civil-brz.mjs` e os três leitores a usam: `relatorio-pesquisas-brz.ts`, `conferir-escopo-derivado.mjs` e `calendario-pesquisas-brz.mjs`. 🔑 **A conta é pelo fuso NOMEADO (`America/Sao_Paulo`), não por menos três horas.** O Brasil aboliu o horário de verão em 2019, então hoje dá o mesmo, mas se ele voltar o `-3` passa a errar um dia por verão em silêncio, e é a data de publicação que está em jogo.

⚠️ **E a troca não é silenciosa:** quando as duas datas divergem, o relatório imprime as duas e diz qual está usando.

🧪 `node scripts/testar-data-civil-brz.mjs`, 56 casos no CI, 8 de 8 mutações reprovadas. O caso que mais importa é a borda das **03:00Z**, que é a meia-noite de Brasília. 🕳️ E o anti-silêncio é de tipo, não de valor: `new Date(null)` e `new Date(true)` devolvem a **época de 1970**, que é data VÁLIDA, então sem guarda de tipo um `null` viraria "1970-01-01" sem reclamar.

🔴 **O segundo achado, do mesmo dia e mais fundo: `/api/polls/tse` para em 200 linhas e diz `total` igual ao que serviu.** O `take: 200` é ordenado por divulgação decrescente e o `total` é `findings.length`, então **o "total declarado" nunca diverge das linhas e não acusa corte nenhum.** Medido no Neon:

| janela | no banco | servidas | cortadas | nacionais cortadas |
|---|---|---|---|---|
| 15d | 197 | 197 | 0 | 0 |
| 20d | 257 | 200 | 57 | 8 |
| **30d** | **351** | **200** | **151** | **16** |

O conferidor de escopo roda em 30d. Sobre a base inteira, reproduzida do Neon com o mapeamento da rota (e a versão cortada reproduzindo a saída do dia **exata**, que é o controle), a Real Time contradiz em **38 de 38** e não 25 de 25, e os graves são **3** e não 1: `BR034902026` (div 01/Set) e `BR037332026` (div 31/Ago), os dois da Real Time e já vencidos. O veredito vivo **não** mudou naquele dia.

📈 **Em 16/Set/2026 o corte chegou à janela PADRÃO de 15 dias** (209 linhas no banco, borda em 08/Set), que em 14/Set ainda cabia inteira com 197. 🔑 A janela da rota é por **data de INGESTÃO** (`createdAt`), não por divulgação, e o corte ordena por divulgação decrescente. Então o gatilho `📣` só quebra quando as linhas com divulgação **de hoje em diante** passarem de 200. Medido no dia: **88** (17 de hoje, 71 futuras). O painel público só LINKA a rota (`PollsSection`, `?days=30`), não desenha com ela. Remedir a cada rodada até o 1º turno, porque o estoque de divulgações futuras cresce perto da eleição.

⭐ **O corte tem BORDA**, porque come as divulgações mais antigas primeiro: toda data depois da menor data servida está inteira, e cada leitor diz qual pedaço dele vale.

| leitor | o que o corte faz |
|---|---|
| `relatorio-pesquisas-brz.ts` | vencidas viram PISO; portão quebra se a borda alcança HOJE ou o futuro |
| `conferir-escopo-derivado.mjs` | **saída 3**: aprovado sobre base cortada, vale como piso. Não é o 1 |
| `calendario-pesquisas-brz.mjs` | só quebra se a borda passa de hoje, porque a tabela olha para a frente |

Teste: `node scripts/testar-tse-api-polls.mjs`, **24 asserções**, com o gatilho que NÃO pode disparar (estadual hoje, nacional amanhã, nacional de hoje que virou fantasma), o zero sobre base cortada, que tem de sair `INDETERMINADO`, e 6 mutações conferidas como aplicadas e pegas. ⏳ **O conserto de verdade é na ROTA** (contagem real e limite maior), e mexer nela é deploy de API pública, então a decisão é do André.

🔍 **Para saber se a pesquisa do dia JÁ SAIU, a fonte é o `news-cache`, não a busca na web.** Medido em 14/Set/2026: a busca das 12h50 BRT trouxe só ondas anteriores e concluiu "Quaest ainda não", e a Quaest tinha saído às **10h16**, com dezenas de matérias no cache gerado pelo `fetch-google-news.mjs`. A ferramenta de busca é de índice americano e atrasa; o cache lê o RSS do dia. O caminho que funcionou:

```bash
node scripts/fetch-google-news.mjs
node -e "const a=require('./public/news-cache/'+new Date().toISOString().slice(0,10)+'.json');const t=[].concat(...Object.values(a.queries).map(q=>q.items||[]));[...new Map(t.filter(x=>/quaest/i.test(x.title)).map(x=>[x.title,x])).values()].forEach(x=>console.log(x.pubDate,'|',x.sourceName,'|',x.title))"
npx tsx scripts/resolver-noticia.mjs "Quaest"      # URL do veículo, para ler o CORPO
```

⛔ E a confirmação é pelo **corpo com o protocolo ou o período de campo da onda**, nunca pela manchete: as primeiras matérias achadas naquele dia eram da onda de 07/Set.

## Passo 4 e 5, num comando só

```bash
npx tsx scripts/relatorio-pesquisas-brz.ts            # janela de 15 dias
npx tsx scripts/relatorio-pesquisas-brz.ts --dias=30
```

Ele faz o Passo 4 e o Passo 5 inteiros: lê a API de pesquisas, baixa o registro do TSE para separar os fantasmas, monta a tabela de escopo com a fonte, lista campo ATIVO e divulgação PREVISTA, roda o portão de CPF com o controle plantado e imprime o mercado do Brasil com as duas travas conferidas. **Ele não grava e não ingere.** Sai com código diferente de zero só quando um PORTÃO quebra, nunca porque o mundo é feio.

Escrito em 03/Set/2026 porque o relatório vinha sendo remontado à mão toda sessão, com script descartável, e três regras já medidas moravam só na memória. Regra que fica só na ficha reincide.

O resto desta seção é o PORQUÊ de cada portão, e continua valendo para ler a saída. As chamadas soltas abaixo servem quando se quer conferir uma peça isolada.

### 👻 O banco nunca apaga, e o registro do TSE RETIRA

Medido em 02/Set/2026: **75 protocolos** estavam no Neon e já não estavam no arquivo oficial, **16 deles servidos pela API** na janela de 15 dias. Todos os 75 tinham divulgação FUTURA no dia da ingestão, contra 78,7% dos que ficaram, e nenhum já divulgado saiu. A leitura que sobra é cancelamento ou re-registro antes de publicar.

📌 **Consequência:** publicar "divulgação prevista" sem tirar os retirados é anunciar compromisso que o TSE já não tem, e a conta de "registrada e não divulgada" passa a contar cancelamento como sonegação. O script marca os fantasmas com 👻 e imprime o calendário limpo ao lado do bruto. → `memory/feedback_o_registro_do_tse_perde_linhas_e_o_banco_nunca_perde.md`

🔢 **A subtração que abre o caso cabe numa linha:** se o arquivo cresceu MENOS do que entrou na ingestão, houve retirada nova. O detalhe sai em `npx tsx scripts/diff-tse-arquivo-vs-banco.ts`.

✅ **Desde 04/Set/2026 a subtração sai sozinha, e você não precisa lembrar o total de ontem.** O `--apply` anota cada rodada em `data/tse/historico-arquivo.jsonl` e imprime a comparação com a anterior. Ela roda **duas contas independentes**, e o que interessa é o desacordo entre elas:

| conta | fórmula |
|---|---|
| subtração | `inseridas − (arquivo_hoje − arquivo_ontem)` |
| fantasmas | `fantasmas_hoje − fantasmas_ontem` |

Quando concordam, a retirada é real. Quando discordam, a diferença tem **nome** e ele é impresso: rodada de ingestão que não foi anotada, protocolo que **voltou** ao arquivo, ou linha apagada do banco, que quebra a invariante de que o banco nunca perde. 🔴 **A terceira sai em vermelho e pede o `diff` antes de publicar qualquer contagem.**

🔴 **POR QUE ISTO EXISTE:** em 04/Set/2026 a regra acima não pôde ser aplicada, porque o total do arquivo de 03/Set nunca foi gravado em lugar nenhum. Ele morava só nas fichas de capstone, e a de 03/Set não o trazia. A conta teve de ser refeita à mão pela identidade `banco = comum + fantasmas`. **Regra que depende de um número que ninguém grava é regra que não roda.**

⚠️ **O ensaio não anota.** Só o `--apply` escreve, e escreve sempre, então rodar `--apply` duas vezes no mesmo dia gera uma linha com `inseridas: 0`, que é verdade e não defeito.

Teste do conferidor: `node scripts/testar-tse-historico.mjs`, 29 asserções em 9 casos plantados, incluindo os dois em que o resultado certo é **zero**.

### 🔍 Escopo

A API devolve `scope` e `scopeSource`. 🔴 **O `scope` é DERIVADO por nós**, lido do plano amostral ou da metodologia, não é campo do TSE. Sempre reportar junto de onde ele saiu. Em 01/Set: 123 vieram de `methodology`, 40 de `sampling_plan` e 5 ficaram em `none`. Uma Real Time do DF já virou "vão nacional" por 7 dias por causa disto. → `memory/feedback_escopo_nacional_derivado_do_plano_amostral.md`

✅ **Desde 06/Set/2026 a lista de "conferir na divulgação" deixou de ser plana**, porque os sinalizados não são iguais:

```bash
node scripts/conferir-escopo-derivado.mjs --dias=30
```

Ele pergunta, **por casa**, se o plano amostral separa escopo, e responde por dois sinais. **CONTRADIÇÃO**, que basta sozinha: o plano chamou de nacional uma pesquisa que a metodologia já disse ser estadual. **VARIAÇÃO**, quando não há contradição: se o plano já disse "estadual" alguma vez naquela casa, ele está sendo preenchido por pesquisa; se diz nacional em todos, é texto padrão e não informa nada.

🔴 **Medido em 06/Set, e é por isso que ele existe:** o plano amostral da Real Time Big Data diz "eleitorado brasileiro" em **23 de 23 pesquisas ESTADUAIS** dela. Três registros da casa estavam servidos como NACIONAIS apoiados exatamente nesse campo, com a metodologia calada, e um deles no calendário publicado. Eles são indistinguíveis das 23 estaduais em toda medida do registro: mesmo n (1.600 e 2.000), mesmo custo por entrevista (R$ 15,00) e uma metodologia que diz "eleitores do universo a ser explorado", que não nomeia universo nenhum.

⭐ **E ele libera quem se sustenta**, que é o que o separa de um portão histérico: o plano da Veritá diz "estadual" em 41 dos 43 registros dela, então o "nacional" do registro de n=40.500 é escolha e passa.

⛔ **Ele não diz que o registro é estadual.** Diz que a evidência para chamá-lo de nacional não sustenta o rótulo. Sai 1 só quando um GRAVE está no calendário vivo; rótulo frágil já vencido é dívida de dataset e sai 0.

Teste do conferidor: `node scripts/testar-escopo-derivado.mjs`, 12 casos plantados. **Dois deles nasceram de mutação**, não de imaginação: os 10 primeiros não pegavam nem a base aceitando nacionais de fonte forte, nem a troca de "mentiu ao menos uma vez" por "mentiu em todas".

### 🆔 CPF

A API devolve `statistician`, `methodology`, `samplingPlan` e `controlSystem`, que é texto livre onde o TSE põe CPF. A redação foi instalada na origem em 22/Ago. Conferir com o primitivo do projeto, **nunca com regex própria**:

```js
import { acharCpf } from './scripts/lib/cpf.mjs'   // exporta acharCpf, cpfValido, redigirCpf
```

⚠️ **E plantar um CPF válido conhecido antes de confiar no zero.** `529.982.247-25` tem de ser encontrado. Sem esse controle, zero pode ser o detector mudo em vez de base limpa.

### 📋 O que o relatório tem de conter

- quantas foram inseridas e quantas já existiam, e a subtração contra o total do arquivo de ontem
- os institutos com registro nacional recente
- **campo ATIVO agora**, ou seja, `fieldStart <= hoje <= fieldEnd`
- **DIVULGAM HOJE**, ou seja, `publicationDate == hoje`, nacionais e sem fantasma, que é o gatilho do `/atualizar-brz`
- **a borda do corte da rota**, quando a resposta bate nas 200 linhas
- **divulgação PREVISTA**, ou seja, `publicationDate > hoje`, que é o calendário da semana, **já sem os fantasmas**
- o preço do Polymarket do Brasil ao lado desse calendário
- escopo, sempre com o `scopeSource`

### 💹 O mercado, com as duas travas

```bash
curl -s "https://www.afos-analytics.com/api/polymarket?country=br&fresh=1"
```

🔴 Sem `country=br` a rota pode devolver o outro país, e sem `fresh=1` ela devolve o CACHE com carimbo antigo. Conferir o `fetchedAt`, não o valor. As chaves do Brasil são `presidential`, `secondPlace`, `thirdPlace`, `stf`, `senate`, `inflation`, e se aparecer `house` ou `senateSeats` você está lendo os EUA.

## ⚠️ Régua de escrita

- **Sem travessão.** Vírgula, ponto ou parênteses.
- **Nunca antecipar número de pesquisa que ainda não foi divulgada.** Registro em campo é calendário, não resultado.
- Relatar o cruzamento **sem juízo de valor**: o AFOS não diz quem tem razão entre o preço e a pesquisa.
- Se uma nacional **DIVULGA hoje** (bloco `📣` do relatório) e o número já saiu pelo instituto, rodar `/atualizar-brz` para o painel refletir. Nacional **inserida** com divulgação futura não dispara nada.
