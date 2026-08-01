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
git diff --stat public/us-polls-data.json
node -e "const a=require('./public/us-polls-data.json');const q=a.qualidade,m=a.mediaAfos;console.log('publicadas',q.publicadas,'de',q.linhasLidas,'| descartadas',q.descartadas,'(forma',q.descartadasPorForma+', valor',q.descartadasPorValor+')','| media',m&&m.vantagemDem,'| institutos',m&&m.nInstitutos);const mau=a.polls.filter(p=>!(p.dem>=15&&p.dem<=70&&p.rep>=15&&p.rep<=70&&p.dem+p.rep<=100));console.log('linhas fora da regua entre as PUBLICADAS:',mau.length);const s=a.polls.slice(0,5).map(p=>p.dem+p.rep+(p.outros||0));console.log('soma D+R+outros das 5 primeiras (tem que dar ~100):',s.join(' '))"
```

**Regra de colapso:** se `publicadas` foi a 0, ou caiu para menos da metade, ou `mediaAfos` veio nulo, não commitar.

**Regra de contaminação:** se sobrar linha fora da régua entre as publicadas, ou se a soma Dem+Rep+outros não fechar perto de 100, **não commitar**. Soma que não fecha é a assinatura de coluna deslizada.

Desfazer com `git checkout -- public/us-polls-data.json` e investigar a origem.

### 📐 A régua, e por que a soma é o melhor teste
O portão de valor exige percentual entre **15% e 70%** para os dois partidos, e soma dos dois até 100. É folgado de propósito: existe recorte legítimo de adultos com muito indeciso (D=33 x R=28).

Mas o teste mais forte não é a régua, é a **soma com os outros**: numa linha bem lida, Dem + Rep + outros fecha em 99 ou 100. Quando a coluna desliza, a soma desanda. É o jeito mais rápido de saber se a origem mudou de formato.

### 🔴 O defeito de 01/Ago, para reconhecer se voltar
A coleta publicou **"Big Data Poll · D 914 x R 3,2"**. O 914 era o TAMANHO DA AMOSTRA e o 3,2 era a MARGEM DE ERRO.

**Causa:** o `rowspan` da Wikipédia não fica só no instituto e nas datas, fica **também na margem de erro** (`rowspan="3"|–`). Nas linhas seguintes do grupo a célula da margem não existe, tudo desliza uma coluna, e o leitor gravava o REPUBLICANO no lugar do democrata e o OUTROS no lugar do republicano. Assim "Focaldata/FT, Dem 51 x Rep 44, outros 5" virava "D=42 x R=9".

O leitor passou a resolver `rowspan` **por índice de coluna**, o que consertou a raiz: os descartes por valor caíram de 35 para 0 e a leitura subiu para 304 de 307. **Se `descartadasPorValor` voltar a subir, a origem mudou de formato de novo** e o lugar de olhar é o `parseTabela`.

## Passo 3: forçar o Neon, se não puder esperar as 07:10 UTC

```bash
curl -s https://www.afos-analytics.com/api/cron/refresh-us-polls \
  -H "Authorization: Bearer $CRON_SECRET" | jq .
```

Resposta boa traz `ok: true`, `lastUpdate`, `lidas`, `publicadas`, `descartadasPorForma`, `semFontePrimaria` e o bloco `media` com `dem`, `rep`, `vantagemDem`, `nPesquisas`, `nInstitutos`.

**Resposta 502 com `motivo: "leitura vazia ou sem média; nada foi gravado"` não é falha do comando: é o portão funcionando.** Nada foi sobrescrito. Investigar a origem, não repetir a chamada.

## Passo 4: relatar

Reportar sempre, com os números do arquivo e não de memória:

- média da casa (`vantagemDem`), no formato **D+X,XX** ou **R+X,XX**, e a variação contra a leitura anterior em pp
- quantas pesquisas e quantos institutos entraram na janela, e qual é a janela em dias
- quantas linhas foram lidas e quantas foram descartadas por forma, com o motivo
- quantas ficaram **sem fonte primária**
- os institutos com campo mais recente, e a **dispersão entre eles**, que costuma ser o achado real

⚠️ **A dispersão importa mais que a média.** Em 31/Jul a Quinnipiac mediu D+7 e a Reuters/Ipsos D+2 com campo praticamente na mesma janela: cinco pontos entre duas casas de primeira linha. Reportar só a média esconde exatamente isso.

## Regras que valem aqui

- **Wikipédia é ÍNDICE, o instituto é FONTE.** A página agrega e dá o caminho; o número citado é o do instituto, com link para a fonte primária. Pesquisa sem fonte primária entra na contagem de qualidade e é declarada, não some.
- **Agregador não entra.** Média de agregador não é pesquisa, e misturar as duas coisas produziria uma média de médias. Os ignorados estão declarados no próprio arquivo, em `procedencia.agregadoresIgnorados`.
- **A média da casa é simples, não ponderada**, e isso é declarado na tela. Não trocar o método sem decisão do André: mudar a régua no meio da série quebra a comparabilidade de tudo que já foi publicado.
- Se commitar o arquivo, **`/dashboard/us` precisa de deploy** para o piso novo valer. O Neon não precisa.

Ver também `/atualizar-usa`, que roda isto dentro de uma passada completa do painel.
