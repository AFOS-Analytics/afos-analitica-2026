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

## Passo 4: conferir o que a API devolve

```bash
curl -s "https://www.afos-analytics.com/api/polls/tse?days=15" -o /tmp/tse15.json
```

**Escopo:** a API devolve `scope` e `scopeSource`. 🔴 **O `scope` é DERIVADO por nós**, lido do plano amostral ou da metodologia, não é campo do TSE. Sempre reportar junto de onde ele saiu. Em 01/Set: 123 vieram de `methodology`, 40 de `sampling_plan` e 5 ficaram em `none`. Uma Real Time do DF já virou "vão nacional" por 7 dias por causa disto. → `memory/feedback_escopo_nacional_derivado_do_plano_amostral.md`

**🆔 CPF:** a API devolve `statistician`, `methodology`, `samplingPlan` e `controlSystem`, que é texto livre onde o TSE põe CPF. A redação foi instalada na origem em 22/Ago. Conferir com o primitivo do projeto, **nunca com regex própria**:

```js
import { acharCpf } from './scripts/lib/cpf.mjs'   // exporta acharCpf, cpfValido, redigirCpf
```

⚠️ **E plantar um CPF válido conhecido antes de confiar no zero.** `529.982.247-25` tem de ser encontrado. Sem esse controle, zero pode ser o detector mudo em vez de base limpa.

## Passo 5: reportar

- quantas foram inseridas e quantas já existiam
- os institutos com registro nacional recente
- **campo ATIVO agora**, ou seja, `fieldStart <= hoje <= fieldEnd`
- **divulgação PREVISTA**, ou seja, `publicationDate > hoje`, que é o calendário da semana
- o preço do Polymarket do Brasil ao lado desse calendário
- escopo, sempre com o `scopeSource`

**O mercado, com as duas travas:**

```bash
curl -s "https://www.afos-analytics.com/api/polymarket?country=br&fresh=1"
```

🔴 Sem `country=br` a rota pode devolver o outro país, e sem `fresh=1` ela devolve o CACHE com carimbo antigo. Conferir o `fetchedAt`, não o valor. As chaves do Brasil são `presidential`, `secondPlace`, `thirdPlace`, `stf`, `senate`, `inflation`, e se aparecer `house` ou `senateSeats` você está lendo os EUA.

## ⚠️ Régua de escrita

- **Sem travessão.** Vírgula, ponto ou parênteses.
- **Nunca antecipar número de pesquisa que ainda não foi divulgada.** Registro em campo é calendário, não resultado.
- Relatar o cruzamento **sem juízo de valor**: o AFOS não diz quem tem razão entre o preço e a pesquisa.
- Se algo nacional entrou, rodar `/atualizar-brz` para o painel refletir.
