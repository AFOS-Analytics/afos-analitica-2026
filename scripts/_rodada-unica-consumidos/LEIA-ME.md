# Scripts de UMA rodada, já consumidos

⛔ **Nada aqui se executa.** São scripts escritos para uma rodada específica de
julho e agosto de 2026, com as frases daquele dia embutidas no código.

## Por que saíram de `scripts/`

Encontrado em 19/Ago/2026 pelo crítico de cobertura do EVAL. Os 17 arquivos:

- não são citados por **nenhuma** skill, workflow, CI, `package.json` ou outro script
- **leem e escrevem** `public/analysis-criteriosa.json`, `public/analysis-data.json`
  e `public/polls-data.json`, que são os três JSONs do painel **vivo**
- fazem isso por substituição de texto, com trechos de julho fixos no código

🔴 Rodar um deles hoje **reescreve o painel com conteúdo de semanas atrás**, e o
defeito de colisão por substring já está registrado na memória como coisa que
acontece de verdade (`feedback_rebaseline_por_texto_colide_substring`).

⚠️ O risco real era de digitação: eles ficavam ao lado dos scripts operacionais
de verdade, e `scripts/atualizar-` completava para um deles.

## O que fazer se precisar de um

Não reutilize. Leia como **registro** do que foi feito naquele dia e escreva um
novo, com os números da rodada corrente. O histórico do git guarda tudo.
