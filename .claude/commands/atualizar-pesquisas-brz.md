# AFOS Analytics — Atualização de Pesquisas Eleitorais (TSE, BRASIL)

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
- Se algo nacional entrou, rodar `/atualizar-brz` para o painel refletir.
