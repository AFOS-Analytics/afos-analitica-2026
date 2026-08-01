# AFOS Tradeoff — US Midterms Weekly

Gerar a edição semanal técnica do AFOS Tradeoff dos **Estados Unidos**, midterms de 03/Nov/2026. Audiência: leitor profissional de mercado (research, buy-side, tesouraria, mesa institucional).

O template nasceu do Brasil e **quatro seções mudaram** para os EUA, com aprovação do André em 01/Ago/2026. Elas estão na seção "As 4 trocas" abaixo, e não são preferência de redação: manter o template do Brasil produziria contradição dentro da própria peça.

## Pré-requisitos

1. **Mercado fresco**: leitura do dia via `curl -s "https://www.afos-analytics.com/api/polymarket?country=us"`. Se passaram mais de ~12h, refazer. **Sem `?country=us` a rota devolve o Brasil.**
2. **Trava de captura aprovada**: `npx tsx scripts/capture-guard.ts --pais=us`. Exit 1 significa não publicar número.
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
scenarios:             # type: base | contrarian | tail
  - { type, label, text }
indicatorGrid:         # label / value / note
liquidity:             # totalLabel, totalLink, total, rows[{rank,name,probability,amount,barWidth}]
calendar:              # date / print / sample / reading / highlight / printLink
calendarFooter: "..."
watchList:             # bold + text
methodology: "..."
additionalReading: { intro, items[{source, description, link}] }
---
```

`sinalDaSemana`, `date`, `title` e `issueNumber` são obrigatórios: sem eles o loader descarta a edição inteira com um aviso no console.

## Numeração

A **Edição №1 (31/Jul/2026) é de ABERTURA**, sem recorte semanal. Motivo declarado nela: a coleta de mercado foi ligada em 28/Jul, a série cobria 3 dos 5 pregões e os dois contratos principais andaram 0,00pp. Reportar "a semana" com três dias seria vender cobertura que não existia. **A numeração semanal começa na №2.**

## A armadilha da série, ao calcular Δ

🔴 Os contratos da Câmara e do Senado guardam os desfechos com o **mesmo nome**, `Democratas` e `Republicanos`. Consultar sem filtrar o mercado **cola as duas séries numa só**, e o resultado parece legítimo.

```bash
# CERTO
curl -s "https://www.afos-analytics.com/api/market/history?candidate=Democratas&country=which-party-will-win-the-house&days=30"
curl -s "https://www.afos-analytics.com/api/market/history?candidate=Republicanos&country=which-party-will-win-the-senate&days=30"
```

📏 **A série da Câmara começa em 28/Jul/2026.** Superlativo sobre ela é "o maior **desde 28/Jul**", nunca "do ciclo". Escrever sempre "da série", com a data de início. O `days` da rota trava em 90 de qualquer forma.

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

Depois: `npx vercel --yes --prod`, e conferir os três idiomas.

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
- **Declarar o que enfraquece a leitura** na própria peça: série curta, troca de composição da amostra, mudança da base da média.
- **Volume USD acumulado** contextualiza e é bem-vindo. **Liquidez (profundidade do book) NÃO se cita no texto editorial**, decisão de 21/Mai/2026: liquidez baixa no Polymarket não significa preço errado, e expor o número gera leitura torta.
- **Teto de 900 palavras não se aplica aqui**: aquele é do AFOS Daily. O Tradeoff é peça longa.
