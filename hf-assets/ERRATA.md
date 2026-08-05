# Errata

**This dataset is dated and append-only. Files for past dates are never rewritten, including when they contain a known error.** Corrections are published here instead, so the record stays exactly as it was distributed and the defect stays discoverable.

Scope note on "append-only": the file for the **current** date may be regenerated during the day, because the mirror runs more than once daily. **Files for dates already closed are never modified.**

---

## EN

### ERR-2026-001 · `data/divergence-2026-07-29.csv` · Renan Santos

| | Value |
|---|---|
| **Affected row** | `2026-07-29,Renan Santos,8.6,7.8,0.8` |
| **Published** | `polymarket_pct = 8.6` · `divergence_pp = 0.8` |
| **Correct** | `polymarket_pct = 8.70` · `divergence_pp = 0.90` |
| **Magnitude** | 0.10pp |
| **Rows affected** | 1 of 7 that date. All other rows and all other dates are unaffected. |
| **Detected** | 2026-07-30 |
| **Status** | **Not corrected in place, by design.** The historical file keeps the value as distributed. |

**Cause.** The source file `polls-data.json` stores the same market price in three fields: a display string (`polymarket`), and two numeric fields (`odds`, `value`). A mid-day rebaseline on 2026-07-29 updated the display string to `8,70%` and left the numeric fields at `8.6`. The exporter reads the numeric field first, so the numeric one is what reached this dataset.

**What the site and the published daily synthesis said that day:** `8.70%`, with the market-versus-poll distance stated as `0.90pp`. The narrative and the dataset therefore disagree by 0.10pp for this single row.

**Prevention.** Since 2026-07-30 a check (`checkPrecoTriplo`) fails the build if the three fields disagree by more than 0.005. It runs in the schema validator and in the pre-commit hook.

---

## PT-BR

### ERR-2026-001 · `data/divergence-2026-07-29.csv` · Renan Santos

Este conjunto de dados é **datado e aditivo**. Arquivos de datas já encerradas **nunca são reescritos**, mesmo quando contêm erro conhecido. A correção é publicada aqui, para que o registro permaneça exatamente como foi distribuído e o defeito continue descobrível.

| | Valor |
|---|---|
| **Linha afetada** | `2026-07-29,Renan Santos,8.6,7.8,0.8` |
| **Publicado** | `polymarket_pct = 8.6` · `divergence_pp = 0.8` |
| **Correto** | `polymarket_pct = 8.70` · `divergence_pp = 0.90` |
| **Magnitude** | 0,10pp |
| **Alcance** | 1 linha de 7 naquela data. Nenhuma outra linha e nenhuma outra data são afetadas. |
| **Detectado em** | 30/07/2026 |
| **Situação** | **Não corrigido no lugar, por decisão.** O arquivo histórico mantém o valor como distribuído. |

**Causa.** O arquivo de origem `polls-data.json` guarda o mesmo preço de mercado em três campos: uma string de exibição (`polymarket`) e dois campos numéricos (`odds`, `value`). Um rebaseline no meio do dia 29/07/2026 atualizou a string para `8,70%` e deixou os numéricos em `8.6`. O exportador lê primeiro o campo numérico, e foi ele que chegou a este conjunto de dados.

**O que o site e a síntese diária publicaram naquele dia:** `8,70%`, com a distância entre mercado e pesquisa declarada em `0,90pp`. A narrativa e o conjunto de dados divergem, portanto, em 0,10pp nesta única linha.

**Prevenção.** Desde 30/07/2026 uma checagem (`checkPrecoTriplo`) reprova a publicação se os três campos divergirem mais de 0,005. Roda no validador de esquema e no gancho de pre-commit.

---

## ES

### ERR-2026-001 · `data/divergence-2026-07-29.csv` · Renan Santos

Este conjunto de datos es **fechado y aditivo**. Los archivos de fechas ya cerradas **nunca se reescriben**, ni siquiera cuando contienen un error conocido. La corrección se publica aquí, para que el registro permanezca exactamente como fue distribuido y el defecto siga siendo detectable.

| | Valor |
|---|---|
| **Fila afectada** | `2026-07-29,Renan Santos,8.6,7.8,0.8` |
| **Publicado** | `polymarket_pct = 8.6` · `divergence_pp = 0.8` |
| **Correcto** | `polymarket_pct = 8.70` · `divergence_pp = 0.90` |
| **Magnitud** | 0,10pp |
| **Alcance** | 1 fila de 7 en esa fecha. Ninguna otra fila ni ninguna otra fecha están afectadas. |
| **Detectado** | 30/07/2026 |
| **Situación** | **No corregido en el lugar, por decisión.** El archivo histórico mantiene el valor tal como fue distribuido. |

**Causa.** El archivo de origen `polls-data.json` guarda el mismo precio de mercado en tres campos: una cadena de exhibición (`polymarket`) y dos campos numéricos (`odds`, `value`). Un rebaseline a mitad del día 29/07/2026 actualizó la cadena a `8,70%` y dejó los numéricos en `8.6`. El exportador lee primero el campo numérico, y ese fue el que llegó a este conjunto de datos.

**Lo que el sitio y la síntesis diaria publicaron ese día:** `8,70%`, con la distancia entre mercado y encuesta declarada en `0,90pp`. La narrativa y el conjunto de datos divergen, por lo tanto, en 0,10pp en esta única fila.

**Prevención.** Desde el 30/07/2026 una verificación (`checkPrecoTriplo`) rechaza la publicación si los tres campos difieren en más de 0,005. Se ejecuta en el validador de esquema y en el gancho de pre-commit.

---

## EN

### ERR-2026-002 · market odds carried a date they were not measured on · 2026-08-04 and 2026-08-05

| | Value |
|---|---|
| **Affected files** | `data/market-odds-timeseries.csv` (12 rows) · `data/divergence-timeseries.csv` (10 rows) · `data/divergence-2026-08-04.csv` (7 rows) · `data/divergence-2026-08-05.csv` (7 rows) |
| **Affected dates** | 2026-08-04 and 2026-08-05 only |
| **Published** | Rows dated `2026-08-04` and `2026-08-05` carry the market capture of **2026-08-03**, identical across all six names including volume. In `divergence-timeseries.csv`, `polymarket_date` states `2026-08-05`. |
| **Correct** | **No rows should exist for those two dates** in `market-odds-timeseries.csv`: there was no confirmed market capture on either day. In `divergence-timeseries.csv`, `polymarket_date` should read `2026-08-03`; `poll_pct`, `polymarket_pct` and `divergence_pp` are unchanged, only the provenance date was wrong. |
| **Detected** | 2026-08-05, in review, before any further publication |
| **Status** | **Not corrected in place, by design.** The historical files keep the values as distributed. |

**Cause.** When the capture lock blocks, the panel deliberately publishes the last confirmed price and says so in the `quadroComparativo[].m` field itself, for example `65,50% (vol USD 7,92M acumulado), preço de 03/Ago` ("price from Aug 3"). The exporter read the number by regex, **discarded that declared provenance**, and stamped the panel's `updatedAt` instead. On 2026-08-04 and 2026-08-05 the lock blocked on both rounds, so both days inherited the 2026-08-03 capture.

**Why this one is heavier than ERR-2026-001.** ERR-2026-001 was a 0.10pp rounding mismatch in one row. Here the values are correct and the **date is not**, and `divergence-timeseries.polymarket_date` is the column a researcher relies on to know when the price was measured. A row asserting a price for a day on which no price was confirmed is a false statement about provenance, not an imprecision.

**Scope note, to prevent over-correction.** 2026-08-01 and 2026-08-02 were suspected and **cleared**: their rows are unique across all six names, so they are genuine captures of their own days. They differ from the AFOS daily series close because the dataset records the panel's intraday locked capture, which is a different sampling point from the end-of-day close. `data/poll-divergence.csv` is **unaffected** (anchored on field midpoints; its latest `polymarket_date` is 2026-08-01). The `snapshots/` JSON files are **unaffected**: they preserve the panel verbatim, including the provenance marker, and are therefore self-documenting.

**Prevention.** Since 2026-08-05, `scripts/export-hf-dataset.mjs` reads the declared provenance out of the `m` field (`precoDeclaradoEm`) and dates each row by the **measurement**, not by the panel update. A companion `dedupMarketRows` keeps one row per `(date, candidate)` and prefers the original measurement over a re-attributed one. Verified on 14 unit cases including the December-to-January year boundary and the pre-2026-05-22 legacy format without a marker, end to end against the live panel, and under a simulated CI backfill that produced 12 collisions and resolved all 12.

---

## PT-BR

### ERR-2026-002 · odds de mercado carimbadas com data em que não foram medidas · 04 e 05/08/2026

Este conjunto de dados é **datado e aditivo**. Arquivos de datas já encerradas **nunca são reescritos**, mesmo quando contêm erro conhecido. A correção é publicada aqui, para que o registro permaneça exatamente como foi distribuído e o defeito continue descobrível.

| | Valor |
|---|---|
| **Arquivos afetados** | `data/market-odds-timeseries.csv` (12 linhas) · `data/divergence-timeseries.csv` (10 linhas) · `data/divergence-2026-08-04.csv` (7 linhas) · `data/divergence-2026-08-05.csv` (7 linhas) |
| **Datas afetadas** | Somente 04/08/2026 e 05/08/2026 |
| **Publicado** | As linhas datadas de `2026-08-04` e `2026-08-05` trazem a captura de mercado de **03/08/2026**, idêntica nos seis nomes, volume incluído. No `divergence-timeseries.csv`, a coluna `polymarket_date` afirma `2026-08-05`. |
| **Correto** | **Não deveria existir linha nessas duas datas** no `market-odds-timeseries.csv`: não houve captura de mercado confirmada em nenhum dos dois dias. No `divergence-timeseries.csv`, o `polymarket_date` deveria ser `2026-08-03`; `poll_pct`, `polymarket_pct` e `divergence_pp` não mudam, apenas a data de procedência estava errada. |
| **Detectado em** | 05/08/2026, em revisão, antes de qualquer publicação seguinte |
| **Situação** | **Não corrigido no lugar, por decisão.** Os arquivos históricos mantêm os valores como foram distribuídos. |

**Causa.** Quando a trava de captura bloqueia, o painel publica de propósito o último preço confirmado e diz isso no próprio campo `quadroComparativo[].m`, por exemplo `65,50% (vol USD 7,92M acumulado), preço de 03/Ago`. O exportador lia o número por regex, **descartava essa marcação de procedência** e carimbava o `updatedAt` do painel. Em 04 e 05/08/2026 a trava bloqueou nas duas rodadas, então os dois dias herdaram a captura de 03/08.

**Por que esta é mais grave que a ERR-2026-001.** A 001 era divergência de arredondamento de 0,10pp em uma linha. Aqui os valores estão certos e a **data não está**, e o `polymarket_date` do `divergence-timeseries` é justamente a coluna em que o pesquisador confia para saber quando o preço foi medido. Linha que afirma preço num dia sem preço confirmado é afirmação falsa de procedência, não imprecisão.

**Nota de alcance, para evitar correção excessiva.** 01 e 02/08/2026 foram suspeitados e **descartados**: as linhas deles são únicas nos seis nomes, logo são capturas legítimas dos próprios dias. Elas diferem do fechamento da série diária do AFOS porque o conjunto de dados grava a captura travada intradiária do painel, que é ponto de amostragem diferente do fechamento do dia. O `data/poll-divergence.csv` **não é afetado** (ancorado no ponto médio de campo; o `polymarket_date` mais recente dele é 01/08/2026). Os arquivos em `snapshots/` **não são afetados**: preservam o painel na íntegra, com a marcação de procedência, e portanto se autodocumentam.

**Prevenção.** Desde 05/08/2026 o `scripts/export-hf-dataset.mjs` lê a procedência declarada no campo `m` (`precoDeclaradoEm`) e data cada linha pela **medição**, não pela atualização do painel. Um `dedupMarketRows` mantém uma linha por `(data, candidato)` e prefere a medição original à reatribuída. Verificado em 14 casos unitários, incluindo a virada de dezembro para janeiro e o formato legado anterior a 22/05/2026 sem marcação, ponta a ponta contra o painel vivo, e sob backfill simulado do CI que gerou 12 colisões e resolveu as 12.

---

## ES

### ERR-2026-002 · odds de mercado con fecha en la que no fueron medidas · 04 y 05/08/2026

Este conjunto de datos es **fechado y aditivo**. Los archivos de fechas ya cerradas **nunca se reescriben**, ni siquiera cuando contienen un error conocido. La corrección se publica aquí, para que el registro permanezca exactamente como fue distribuido y el defecto siga siendo detectable.

| | Valor |
|---|---|
| **Archivos afectados** | `data/market-odds-timeseries.csv` (12 filas) · `data/divergence-timeseries.csv` (10 filas) · `data/divergence-2026-08-04.csv` (7 filas) · `data/divergence-2026-08-05.csv` (7 filas) |
| **Fechas afectadas** | Solo 04/08/2026 y 05/08/2026 |
| **Publicado** | Las filas fechadas `2026-08-04` y `2026-08-05` traen la captura de mercado del **03/08/2026**, idéntica en los seis nombres, volumen incluido. En `divergence-timeseries.csv`, la columna `polymarket_date` afirma `2026-08-05`. |
| **Correcto** | **No debería existir fila en esas dos fechas** en `market-odds-timeseries.csv`: no hubo captura de mercado confirmada en ninguno de los dos días. En `divergence-timeseries.csv`, `polymarket_date` debería ser `2026-08-03`; `poll_pct`, `polymarket_pct` y `divergence_pp` no cambian, solo la fecha de procedencia estaba equivocada. |
| **Detectado** | 05/08/2026, en revisión, antes de cualquier publicación posterior |
| **Situación** | **No corregido en el lugar, por decisión.** Los archivos históricos mantienen los valores tal como fueron distribuidos. |

**Causa.** Cuando la traba de captura bloquea, el panel publica a propósito el último precio confirmado y lo dice en el propio campo `quadroComparativo[].m`, por ejemplo `65,50% (vol USD 7,92M acumulado), preço de 03/Ago`. El exportador leía el número por regex, **descartaba esa marca de procedencia** y sellaba el `updatedAt` del panel. El 04 y el 05/08/2026 la traba bloqueó en las dos rondas, así que ambos días heredaron la captura del 03/08.

**Por qué esta es más grave que la ERR-2026-001.** La 001 era una discrepancia de redondeo de 0,10pp en una fila. Aquí los valores están correctos y la **fecha no**, y el `polymarket_date` del `divergence-timeseries` es justamente la columna en la que el investigador confía para saber cuándo se midió el precio. Una fila que afirma un precio en un día sin precio confirmado es una afirmación falsa de procedencia, no una imprecisión.

**Nota de alcance, para evitar corrección excesiva.** El 01 y el 02/08/2026 fueron sospechados y **descartados**: sus filas son únicas en los seis nombres, así que son capturas legítimas de sus propios días. Difieren del cierre de la serie diaria de AFOS porque el conjunto de datos registra la captura trabada intradiaria del panel, que es un punto de muestreo distinto del cierre del día. `data/poll-divergence.csv` **no está afectado** (anclado en el punto medio de campo; su `polymarket_date` más reciente es 01/08/2026). Los archivos en `snapshots/` **no están afectados**: preservan el panel íntegro, con la marca de procedencia, y por lo tanto se autodocumentan.

**Prevención.** Desde el 05/08/2026 `scripts/export-hf-dataset.mjs` lee la procedencia declarada en el campo `m` (`precoDeclaradoEm`) y fecha cada fila por la **medición**, no por la actualización del panel. Un `dedupMarketRows` mantiene una fila por `(fecha, candidato)` y prefiere la medición original a la reatribuida. Verificado en 14 casos unitarios, incluyendo el cambio de diciembre a enero y el formato heredado anterior al 22/05/2026 sin marca, de punta a punta contra el panel vivo, y bajo un backfill simulado del CI que generó 12 colisiones y resolvió las 12.

---

*No other errata recorded. · Nenhuma outra errata registrada. · Ninguna otra errata registrada.*
