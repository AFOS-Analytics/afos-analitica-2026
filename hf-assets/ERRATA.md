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

*No other errata recorded. · Nenhuma outra errata registrada. · Ninguna otra errata registrada.*
