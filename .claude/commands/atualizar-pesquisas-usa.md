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

## Passo 2 (BLOQUEANTE): conferir que a leitura não colapsou

🔴 **O script NÃO tem portão de segurança, e o cron TEM.** Esta assimetria é real e é a razão deste passo existir.

A rota do cron se recusa a gravar leitura vazia por cima de uma boa: Wikipédia fora do ar, mudança de estrutura da página ou parse quebrado chegam como zero pesquisas, e ela devolve 502 sem gravar. **O script escreve o arquivo de qualquer jeito.** Se a leitura vier vazia e alguém commitar, o piso de segurança do painel vira um arquivo vazio.

Antes de commitar, comparar com o que estava lá:

```bash
git diff --stat public/us-polls-data.json
node -e "const a=require('./public/us-polls-data.json');console.log('publicadas',a.qualidade.publicadas,'de',a.qualidade.linhasLidas,'| media',a.mediaAfos&&a.mediaAfos.vantagemDem,'| institutos',a.mediaAfos&&a.mediaAfos.nInstitutos)"
```

**Regra:** se `publicadas` caiu para 0, ou caiu para menos da metade do que era, ou `mediaAfos` veio nulo, **não commitar**. Desfazer com `git checkout -- public/us-polls-data.json` e investigar a origem antes de tentar de novo.

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
