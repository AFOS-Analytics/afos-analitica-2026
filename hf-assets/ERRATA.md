# Errata

**This dataset is dated and append-only. Files for past dates are never rewritten, including when they contain a known error.** Corrections are published here instead, so the record stays exactly as it was distributed and the defect stays discoverable.

Scope note on "append-only": the file for the **current** date may be regenerated during the day, because the mirror runs more than once daily. **Files for dates already closed are never modified.**

---

## EN

### ERR-2026-002 · `polls/tse-registry.csv` + `.json` · personal data

| | Value |
|---|---|
| **Affected field** | free text in `methodology` and `sampling_plan` |
| **Published** | the CPF (Brazilian individual taxpayer number) of the responsible statistician, written into the prose of the filing |
| **Correct** | `[CPF removido]` |
| **Rows affected** | 7 occurrences, 4 distinct individuals, out of 533 filings |
| **Detected** | 2026-08-04 |
| **Status** | **Removed from the current file and from every file published after 2026-08-04. Revisions published before that date are preserved unchanged, deliberately** — see below. |

**This is a minimisation decision, not a leak.** The registry comes from TSE Open Data (`pesquisa_eleitoral_2026_BRASIL.csv`), published openly under **Lei 9.504/1997 art. 33** and Resolução TSE 23.600/2019. Collecting it was correct and remains correct. The CPF is removed because it is **not necessary for this dataset's purpose**: nothing here is joined on CPF, and the LGPD requires processing only what the purpose needs.

**Why the CPF specifically.** The TSE does not publish CPF as a field. It publishes `statistician` as its own column, by name. The CPF reached the file only because the pollster typed the number into the free-text prose of `methodology` / `sampling_plan`, a field meant to describe sampling design. It is incidental content, not deliberate publication.

**What is kept, and why.** The institute **CNPJ** is kept. It is a company registration, public by law, and a column the TSE deliberately publishes and fills in 533 of 533 rows. It is also the only reliable join key: legal names differ from the names institutes are known by (`REAL TIME MIDIA LTDA` trades as *Real Time Big Data*). Removing it would destroy the auditability this dataset exists to provide. Careful reading required: the TSE labels part of the free text `CNPJ/CPF` and fills it with a CNPJ, so redacting by **label** would delete the institute identifier. The rule is **digit count**: 11 = CPF, removed; 14 = CNPJ, kept. The statistician's **name** is kept: it is professional activity, already its own column, and it is what lets a reader audit who signed off on a poll.

**Why past revisions are not rewritten.** This dataset's whole claim is that the record stays exactly as distributed. Purging history would require collapsing all revisions into one, destroying the public trail of every daily mirror to remove a number the TSE itself still serves openly. The defect is declared here instead, which is what an auditable dataset does with a past defect.

**Prevention.** `scripts/redigir-cpf-tse-registry.mjs` runs in the mirror workflow between the registry rebuild and the export, and a second `--check` pass fails the build if any 11-digit CPF survives.

---

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

### ERR-2026-002 · `polls/tse-registry.csv` + `.json` · dado pessoal

| | Valor |
|---|---|
| **Campo afetado** | texto livre de `methodology` e `sampling_plan` |
| **Publicado** | o CPF do estatístico responsável, escrito dentro da prosa do registro |
| **Correto** | `[CPF removido]` |
| **Linhas afetadas** | 7 ocorrências, 4 pessoas distintas, em 533 registros |
| **Detectado** | 04/08/2026 |
| **Situação** | **Removido do arquivo atual e de todo arquivo publicado depois de 04/08/2026. As revisões publicadas antes dessa data ficam preservadas sem alteração, por decisão** — ver abaixo. |

**Isto é minimização, não vazamento.** O registro vem do TSE Dados Abertos (`pesquisa_eleitoral_2026_BRASIL.csv`), publicado abertamente sob a **Lei 9.504/1997 art. 33** e a Resolução TSE 23.600/2019. Coletar foi correto e segue correto. O CPF sai porque **não é necessário à finalidade deste conjunto de dados**: nada aqui é cruzado por CPF, e a LGPD manda tratar só o que a finalidade exige.

**Por que o CPF, especificamente.** O TSE não publica CPF como campo. Ele publica `statistician` como coluna própria, com o nome. O CPF chegou ao arquivo porque o pesquisador digitou o número dentro do texto livre de `methodology` / `sampling_plan`, campo destinado a descrever o desenho amostral. É conteúdo colateral, não publicação deliberada.

**O que fica, e por quê.** O **CNPJ** do instituto fica. É registro de empresa, público por lei, e coluna que o TSE publica de propósito e preenche em 533 de 533 linhas. É também a única chave confiável de junção: o nome jurídico difere do nome pelo qual o instituto é conhecido (`REAL TIME MIDIA LTDA` atua como *Real Time Big Data*). Removê-lo destruiria a auditabilidade que justifica este conjunto de dados existir. Exige leitura cuidadosa: o TSE rotula parte do texto livre como `CNPJ/CPF` e a preenche com CNPJ, então redigir pelo **rótulo** apagaria o identificador do instituto. A régua é a **contagem de dígitos**: 11 é CPF e sai, 14 é CNPJ e fica. O **nome** do estatístico também fica: é atuação profissional, já é coluna própria, e é o que permite auditar quem assinou a pesquisa.

**Por que as revisões passadas não são reescritas.** A afirmação central deste conjunto de dados é que o registro permanece exatamente como foi distribuído. Purgar o histórico exigiria colapsar todas as revisões numa só, destruindo o rastro público de cada espelhamento diário para remover um número que o próprio TSE continua servindo aberto. O defeito é declarado aqui, que é o que um conjunto de dados auditável faz com defeito passado.

**Prevenção.** O `scripts/redigir-cpf-tse-registry.mjs` roda no espelhamento entre a reconstrução do registro e o export, e uma segunda passada com `--check` reprova a publicação se sobrar qualquer CPF de 11 dígitos.

---

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

### ERR-2026-002 · `polls/tse-registry.csv` + `.json` · dato personal

| | Valor |
|---|---|
| **Campo afectado** | texto libre de `methodology` y `sampling_plan` |
| **Publicado** | el CPF (número de contribuyente individual brasileño) del estadístico responsable, escrito dentro de la prosa del registro |
| **Correcto** | `[CPF removido]` |
| **Filas afectadas** | 7 apariciones, 4 personas distintas, de 533 registros |
| **Detectado** | 04/08/2026 |
| **Situación** | **Eliminado del archivo actual y de todo archivo publicado después del 04/08/2026. Las revisiones publicadas antes de esa fecha quedan preservadas sin alteración, por decisión** — ver abajo. |

**Esto es minimización, no una filtración.** El registro viene del TSE Datos Abiertos (`pesquisa_eleitoral_2026_BRASIL.csv`), publicado abiertamente bajo la **Lei 9.504/1997 art. 33** y la Resolução TSE 23.600/2019. Recolectarlo fue correcto y sigue siéndolo. El CPF se elimina porque **no es necesario para la finalidad de este conjunto de datos**: nada aquí se cruza por CPF, y la LGPD exige tratar solo lo que la finalidad requiere.

**Por qué el CPF, específicamente.** El TSE no publica el CPF como campo. Publica `statistician` como columna propia, con el nombre. El CPF llegó al archivo solo porque el encuestador escribió el número dentro del texto libre de `methodology` / `sampling_plan`, un campo destinado a describir el diseño muestral. Es contenido colateral, no publicación deliberada.

**Qué se conserva, y por qué.** El **CNPJ** del instituto se conserva. Es registro de empresa, público por ley, y una columna que el TSE publica a propósito y llena en 533 de 533 filas. Es además la única clave fiable de unión: el nombre legal difiere del nombre por el que se conoce al instituto (`REAL TIME MIDIA LTDA` opera como *Real Time Big Data*). Eliminarlo destruiría la auditabilidad que justifica la existencia de este conjunto de datos. Exige lectura cuidadosa: el TSE rotula parte del texto libre como `CNPJ/CPF` y la llena con un CNPJ, así que redactar por **rótulo** borraría el identificador del instituto. La regla es el **conteo de dígitos**: 11 es CPF y sale, 14 es CNPJ y se queda. El **nombre** del estadístico también se conserva: es actividad profesional, ya es columna propia, y es lo que permite auditar quién firmó una encuesta.

**Por qué no se reescriben las revisiones pasadas.** La afirmación central de este conjunto de datos es que el registro permanece exactamente como fue distribuido. Purgar el historial exigiría colapsar todas las revisiones en una sola, destruyendo el rastro público de cada espejado diario para eliminar un número que el propio TSE sigue sirviendo abiertamente. El defecto se declara aquí, que es lo que un conjunto de datos auditable hace con un defecto pasado.

**Prevención.** `scripts/redigir-cpf-tse-registry.mjs` corre en el espejado entre la reconstrucción del registro y el export, y una segunda pasada con `--check` reprueba la publicación si sobrevive algún CPF de 11 dígitos.

---

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
