# AFOS Tradeoff — US Midterms Weekly

Gerar a edição semanal técnica do AFOS Tradeoff dos **Estados Unidos**, midterms de 03/Nov/2026. Audiência: leitor profissional de mercado (research, buy-side, tesouraria, mesa institucional).

O template nasceu do Brasil e **quatro seções mudaram** para os EUA, com aprovação do André em 01/Ago/2026. Elas estão na seção "As 4 trocas" abaixo, e não são preferência de redação: manter o template do Brasil produziria contradição dentro da própria peça.

## Pré-requisitos

1. **Mercado fresco**: leitura do dia via `curl -s "https://www.afos-analytics.com/api/polymarket?country=us&fresh=1"`. Se passaram mais de ~12h, refazer. **Sem `?country=us` a rota devolve o Brasil.** 🔴 **E sem `&fresh=1` ela devolve o CACHE**, que num pré-requisito chamado "mercado fresco" é o defeito mais fácil de não ver: medido em 10/Ago/2026, a leitura cacheada estava 19 minutos velha e errava o republicano da Câmara em 2.00pp. Conferir o `fetchedAt` da resposta, não o valor.
2. **Trava de captura aprovada**: `npx tsx scripts/capture-guard.ts --pais=us`. 🔑 **Ler a ÚLTIMA LINHA**, que é `VEREDITO: APROVADO` ou `VEREDITO: BLOQUEADO`, e **não o código de saída**: o exit code pode se perder no invólucro e virar 1 sem bloqueio nenhum (medido em 10/Ago/2026, num ambiente onde até um `true` "falhava"). `VEREDITO: BLOQUEADO` significa não publicar número.
3. **Generic ballot em dia**: `public/us-polls-data.json` ou a leitura do Neon, via `/atualizar-pesquisas-usa`.
4. **Série de mercado da semana** para calcular Δ, com a armadilha do filtro (ver abaixo).

Faltando qualquer um, PARAR e pedir para rodar o `/atualizar-usa` antes.

## Onde o arquivo vive

```
public/afos-tradeoff/us/YYYY-MM-DD.md        (pt-BR, é a ORIGEM)
public/afos-tradeoff/us/YYYY-MM-DD.en.md
public/afos-tradeoff/us/YYYY-MM-DD.es.md
```

Rota publicada: `/[idioma]/tradeoff/us/YYYY-MM-DD`.

📌 **Pasta assimétrica, de propósito.** O Brasil fica na RAIZ de `public/afos-tradeoff/` e cada país novo ganha subpasta. A rota é simétrica, a pasta não: mover as edições do Brasil quebraria em silêncio o publicador, o `persist-` e o `broadcast-`. **Simetria de rota é o que o leitor vê; simetria de pasta não é.**

📌 **O PT-BR é a origem**, mesmo sendo uma peça sobre os Estados Unidos. Escrever primeiro em português e traduzir para EN e ES, como em todo o resto da plataforma.

## As 4 trocas em relação ao template do Brasil

**1. A anti-média virou o bloco das DUAS GRANDEZAS.**
O template do Brasil prega não tirar média de pesquisas que divergem. Nos Estados Unidos o AFOS **faz** média simples do generic ballot e a declara na tela. Manter a seção original seria contradição na peça mais visível da casa. No lugar dela entra o argumento de que **probabilidade de controlar a casa e vantagem em pontos de voto não se subtraem**: o resultado não teria unidade, mudaria de tamanho se a pesquisa fosse expressa em outra escala, e em 2012 os democratas tiveram mais votos e menos cadeiras. Sobrescrever o título da seção 2.

**2. Calendário de prints virou CALENDÁRIO ELEITORAL.**
Não existe registro obrigatório de pesquisa nos Estados Unidos, então não há data de print para antecipar. O que existe é o calendário da eleição: 3 de novembro, primárias estaduais e a cadência dos trackers. Sobrescrever o título da seção 6.

**3. Histórico de acertos OMITIDO.** As midterms não aconteceram. Publicar uma seção de acerto histórico dando a impressão de que existe registro de desempenho seria falso.

**4. Cenários saem da DISTRIBUIÇÃO DE CADEIRAS que o mercado já precifica**, não de narrativa. Aqui existe contrato que dá a probabilidade de cada faixa, então o cenário não precisa ser inventado, basta ser lido. É a diferença mais forte em relação ao Brasil.

⚠️ **Os títulos de seção são FIXOS no template.** Sem a sobrescrita, o rótulo contradiz o texto logo abaixo. Usar `sectionTitles` no frontmatter:

```yaml
sectionTitles:
  2: "Por que este brief não subtrai o mercado da pesquisa"
  6: "Calendário eleitoral até novembro"
```

## Frontmatter, na forma que o loader aceita

```yaml
---
date: YYYY-MM-DD
issueNumber: N
weekStart: YYYY-MM-DD
weekEnd: YYYY-MM-DD
updatedAt: "DD/MM/YYYY, HH:MM"
title: "AFOS Tradeoff · EUA · Edição №N · [recorte da semana]"
locale: pt-BR
status: draft          # SEMPRE draft ao criar
sectionTitles: { 2: ..., 6: ... }
sinalDaSemana: "[1-2 parágrafos, 250-450 palavras, o sinal mais relevante da semana]"
summaryCards:          # 3 cartões: Câmara, Senado, generic ballot
  - label: ""; headline: ""; unit: ""; delta: ""; deltaDirection: up|down|flat; desc: ""
execSummaryIntro: "..."
antiAvgIntro: "..."
antiAvg: { title, leftLabel, leftValue, leftUnit, leftDetails[], rightLabel, rightValue, rightUnit, rightDetails[] }
antiAvgClosing: "..."
scenariosIntro: "..."
scenarios:             # 🔴 type: base | bear | tail  (NÃO existe 'contrarian')
  - { type, label, text }
indicatorGrid:         # 🔴 contract / value / delta / deltaDirection / volume / reading  (+ contractLink, highlight)
liquidity:             # totalLabel, totalLink, total, rows[{rank,name,probability,amount,barWidth}]
calendar:              # date / print / sample / reading / highlight / printLink
calendarFooter: "..."
watchList:             # bold + text
methodology: "..."
additionalReading: { intro, items[{source, description, link}] }
---
```

`sinalDaSemana`, `date`, `title` e `issueNumber` são obrigatórios: sem eles o loader descarta a edição inteira com um aviso no console.

### 🔴 O loader DESCARTA bloco com nome de campo errado, em silêncio

Descoberto em 03/Ago/2026, e a Edição №1 ficou **três dias em produção, nos três idiomas, sem a seção 4 inteira**.

Cada bloco passa por um `coerce*` que filtra por UM campo obrigatório. Se o nome não bate, a linha some sem erro, sem aviso e sem log. A página monta bonita, só que menor, e nada na tela diz que faltou.

| Bloco | Campo que o filtro exige | O que já foi escrito errado |
|---|---|---|
| `indicatorGrid` | **`contract`** | `label` → **as 6 linhas sumiram** |
| `scenarios` | `label` **e** `text`, com `type` em `base\|bear\|tail` | `contrarian` → virou `base` calado, e a peça mostrou dois cenários-base |
| `additionalReading.items` | `source` **e** `link` | |
| `calendar` | `date` **e** `print` | |
| `summaryCards` | `label` **e** `headline` | |
| `liquidity` | `total` **e** `rows[]` com `name` | |

📌 **Conferir contando, não olhando.** Depois de escrever, rodar o portão:

```bash
npx tsx scripts/check-tradeoff-blocos.ts YYYY-MM-DD us
```

Ele confere os três idiomas de uma vez e cobre as **três** formas caladas de falha do `coerce*`: bloco descartado pelo `.filter()`, enum coagido para o padrão (`base|bear|tail`, `up|down|flat`) e **campo escalar de texto com o nome errado**.

🔴 **A terceira foi descoberta em 30/Ago/2026 no Brasil, e a contagem de blocos era cega a ela:** `anomaly` no lugar de `anomalyText` fazia o callout inteiro sumir com **todos os contadores iguais**, porque contagem compara tamanho de ARRAY e nenhum array encolhe quando some um campo de texto.

Bloco com 0 é bloco que não vai aparecer. **Ver a página no preview não pega nenhuma das três**, porque seção ausente é indistinguível de seção que não foi escrita.

## Numeração

A **Edição №1 (31/Jul/2026) é de ABERTURA**, sem recorte semanal. Motivo declarado nela: a coleta de mercado foi ligada em 28/Jul e o primeiro ponto gravado é de 29/Jul, a série cobria 3 dos 5 pregões e os dois contratos principais andaram 0,00pp. Reportar "a semana" com três dias seria vender cobertura que não existia. **A numeração semanal começa na №2.**

## A armadilha da série, ao calcular Δ

🔴 Os contratos da Câmara e do Senado guardam os desfechos com o **mesmo nome**, `Democratas` e `Republicanos`. Consultar sem filtrar o mercado **cola as duas séries numa só**, e o resultado parece legítimo.

```bash
# CERTO
curl -s "https://www.afos-analytics.com/api/market/history?candidate=Democratas&country=which-party-will-win-the-house&days=30"
curl -s "https://www.afos-analytics.com/api/market/history?candidate=Republicanos&country=which-party-will-win-the-senate&days=30"
```

📏 **A série da Câmara começa em 29/Jul/2026**, medido na própria rota em 03/Ago. Superlativo sobre ela é "o maior **desde 29/Jul**", nunca "do ciclo". Escrever sempre "da série", com a data de início. O `days` da rota trava em 90 de qualquer forma.

⚠️ **A régua dizia 28/Jul até 03/Ago/2026 e estava errada.** A coleta foi ligada em 28, mas o primeiro ponto GRAVADO é de 29. Conferir na rota antes de escrever a data, nunca copiar da edição anterior: superlativo com data de início errada é afirmação falsa sobre a série.

## Portão de publicação

Toda edição nova nasce `status: draft`. Enquanto for draft:

- `/[idioma]/tradeoff/us/{data}` dá 404 em produção, mas abre no preview da Vercel para revisão
- não entra no `sitemap.xml`, no `/feed/tradeoff.xml` nem no `llms.txt`
- `getLatestDate()` não a devolve, então o arquivo do país continua apontando para a última publicada

Virar para publicado:

```bash
npx tsx scripts/publish-afos-tradeoff.ts YYYY-MM-DD --pais=us --all-locales
```

⚠️ **Sem `--pais=us` o script procura na RAIZ**, que é o Brasil, e responde "file not found, skipping" nos três arquivos. Isso não é erro do script: é o país errado.

Arquivar no Neon, **também com `--pais=us`**:

```bash
npx tsx scripts/persist-afos-tradeoff.ts YYYY-MM-DD --pais=us
```

🔴 **O slug do Brasil e o dos EUA colidiam, e o conserto é de 03/Ago/2026.** Os dois países publicam na segunda, então os dois têm edição na MESMA data. O slug era `afos-tradeoff-DD-MM-AAAA`, sem país, e como o upsert é por slug **a segunda gravação apagaria a primeira sem erro nenhum**. Agora os EUA gravam como `afos-tradeoff-us-DD-MM-AAAA` e o **Brasil segue sem qualificador**, para não deixar órfãs as 11 edições já arquivadas.

⚠️ Antes disso o script **ignorava `--pais` em silêncio**, lia a raiz e respondia `✅ persistido` tendo regravado a edição BRASILEIRA. Conferir o slug na saída: tem que aparecer `afos-tradeoff-us-`. Se vier sem `us`, o país não chegou.

Depois: `npx vercel --yes --prod`, e conferir os três idiomas.

🔢 **DECIMAL: PONTO nos três idiomas**, inclusive pt-BR e ES, como no Tradeoff do Brasil desde 02/Ago/2026. ⚠️ A **Edição №1 dos EUA usa VÍRGULA** em pt-BR e ES porque foi escrita em 31/Jul, antes da decisão. Não copiar a convenção dela.

⚠️ **Editar o arquivo com Python em Windows converte a árvore inteira para CRLF**, e aí o `publish-afos-tradeoff.ts` responde `no status line in frontmatter`, porque o `\r` quebra a âncora do regex. Se isso aparecer, normalizar para LF antes de culpar o frontmatter.

## Conferência antes de dar por pronto

```bash
for l in pt-BR en es; do curl -s -o /dev/null -w "$l %{http_code}\n" "https://www.afos-analytics.com/$l/tradeoff/us/YYYY-MM-DD"; done
```

⚠️ **Passar o país para a página não basta: conferir tudo que a página DESENHA.** Isso já falhou duas vezes em 01/Ago. O seletor de idioma da edição mandava para `/en/tradeoff/{data}`, caía no redirect de compatibilidade e ia parar no **Brasil** daquela data, que não existe: 404. E a navegação entre edições oferecia "anterior" numa data brasileira. Conferir, um por um: o seletor de idioma, o botão Dashboard (tem que voltar para `/dashboard/us`), a navegação anterior/próxima e o link "todas as edições".

**Os links de imprensa no fim** precisam apontar para o veículo, nunca para o agregador. A URL do Google News **só resolve por redirecionamento em JavaScript**, então `curl -L` fica parado nela: abrir com navegador de verdade e usar a URL final. Veículo que não resolver por anti-robô é descartado e o descarte é declarado.

## REGRAS

- **Sem travessão (—).** Vírgula, ponto ou parênteses.
- **Todo número diz DE QUE ele é.** "85,50%" é a probabilidade de os **democratas** controlarem a **Câmara**. Validador não pega esse defeito: o valor está certo e o que falta é a etiqueta.
- **Nunca subtrair o mercado da pesquisa.** É o argumento central da peça; fazer a conta em qualquer outra seção a contradiz.
- **Distribuição só entra se as faixas somarem entre 95% e 105%.** O mercado de margem do voto popular está reprovado, é coletado todo dia para guardar série, e quando citado tem que vir com a soma real e a ressalva.
- **Relatar o cruzamento, sem juízo de valor.** O AFOS não diz quem tem razão nem quem vai ganhar.
- 🔴 **A ressalva se resolve no NÚMERO, nunca num aviso ao leitor.** Esta regra substitui, em 27/Ago/2026, a antiga "declarar o que enfraquece a leitura na própria peça", que produziu o terceiro incidente de relato de falha depois de 03/Ago e 18/Ago. A antiga estava certa na intenção e errada no destino: mandava para a PEÇA o que pertence à ESCOLHA DO NÚMERO.

  **O teste, antes de escrever qualquer ressalva:** se o parágrafo descreve o que o **AFOS** fez, e não o que a **eleição** fez, ele não entra. Não importa quão honesto pareça.

  | A ressalva é sobre | O que fazer |
  |---|---|
  | **o NÚMERO que se pode afirmar** (janela rolou, base trocou, série curta) | **remover ou trocar o número.** Delta movido por composição de janela não é variação semanal: não se explica, não se publica. No lugar entra procedência, como a data de campo |
  | **o MÉTODO em geral** | descrever de forma **positiva**: janela móvel de 30 dias, média simples e não ponderada, hierarquia de recorte, portão de 95 a 105, dupla leitura com 8 min. Isso é diferencial da casa e CONSTRÓI confiança |
  | **a MÁQUINA daquele dia** (a trava bloqueou, a base oscilou, o portão reprovou um contrato, o agregado tem ruído próprio) | **não entra, em nenhuma forma.** Nem no corpo, nem em cartão, nem em watchlist, nem em rodapé de metodologia |

  ⛔ **Nunca escrever que um contrato SAIU do portão nesta captura.** O portão filtra em silêncio: contrato que reprovou hoje simplesmente não aparece, e o leitor não precisa saber o que foi excluído nem que o veredito mudou. "O comparecimento somava 98.90% de manhã e 92.30% à tarde" é a nossa máquina oscilando, e não entra.

  ✅ **Duas exceções, e as duas são de natureza oposta ao relato de falha:**

  1. **Fato ESTRUTURAL e permanente sobre um mercado** entra, porque descreve o mercado e não a nós. O `popularVoteMargin` soma acima de 150% desde sempre, por conter um balde de "qualquer outro desfecho", e dizer isso é obrigatório quando ele é citado (ver a regra da distribuição acima). Ele é o único mercado que mediria a MESMA grandeza da pesquisa, então explicar por que ele não serve sustenta o argumento central da peça. **A régua: fato permanente do mercado, sim; mudança de veredito nosso no dia, não.**
  2. 📌 **ERRATA de número que NÓS publicamos** entra, e é obrigatória. Corrigir na cara do leitor um número que saiu errado numa edição anterior é dívida com quem leu, não confissão de fragilidade. É o oposto de esconder.

  🔑 **A diferença entre as duas exceções e o que se proíbe:** errata e fato de mercado falam de **algo que o leitor precisa para ler o número certo**. Relato de falha fala da **máquina reclamando**, e não muda nenhum número na tela.

  🧱 **E não deixar buraco.** Onde saiu a ressalva entra medição de mercado que já existe e não foi usada. Em 27/Ago o vazio da base do generic ballot foi preenchido com a faixa de 52 cadeiras cedendo 0.80pp para o empate em 50, que AMARRA com o achado da edição em vez de enfraquecê-lo.

  Ver `feedback_a_falha_do_instrumento_nunca_e_a_manchete` e `feedback_descrever_o_metodo_sim_relatar_a_falha_nao` na memória.
- **Volume USD acumulado** contextualiza e é bem-vindo. **Liquidez (profundidade do book) NÃO se cita no texto editorial**, decisão de 21/Mai/2026: liquidez baixa no Polymarket não significa preço errado, e expor o número gera leitura torta.
- **Teto de 900 palavras não se aplica aqui**: aquele é do AFOS Daily. O Tradeoff é peça longa.
