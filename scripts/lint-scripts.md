# 🔎 `npm run lint:scripts`, e por que ele existe

Criado em **09/Out/2026**, e o caso que o criou é meu.

## 🔴 O defeito

Ao envolver um bloco do `estado-da-faixa-us.mjs` num guarda novo, deixei três
declarações (`fronteira`, `agoraMin`, `passouDaJanela`) **dentro** do `else`, e
o bloco logo abaixo passou a lê-las fora de escopo.

O script **estourou com `ReferenceError` em toda execução**, morrendo depois de
imprimir a linha da imprensa. Backup, pesquisas, Weekly, Tradeoff, pisos e
mercado nunca chegavam a sair, e o `estado:usa` é justamente o medidor que diz
o que a passada pode fazer naquele dia.

🕳️ **E ficou um dia inteiro assim**, porque eu conferi o conserto da véspera com
um `grep` da linha que eu esperava ver, e ela fica **acima** do ponto do estouro.

## ✅ A lacuna, e ela era precisa

| o que há em `scripts/` | quem cobre |
|---|---|
| `.ts` | o **`tsc --noEmit`**, que o build roda sobre `scripts/` |
| `.mjs` | **nada** |

O `next lint` do CI não alcança `scripts/`, e `node --check` não serve: o defeito
é **sintaxe válida** e erro de execução. Quem pega essa classe estaticamente é o
`no-undef`.

## 📊 O custo, medido antes de ligar

Rodando a regra sobre todos os `scripts/**/*.mjs`: **2 erros**, e os dois são
`document` dentro de `page.evaluate` do Playwright, ou seja contexto de navegador
de verdade. Nenhum achado real pendente, então ligar é praticamente de graça.

⛔ **Os dois NÃO foram silenciados por global de pasta**, que calaria também o
arquivo novo que errasse amanhã. Eles estão nomeados um a um num `override` com
`env: browser`, e arquivo que não está na lista volta a reprovar.

## 🧪 O controle positivo, porque regra que não pode falhar não vale nada

O defeito original foi **reintroduzido** no arquivo, conferido como aplicado com
`diff -q` contra a cópia boa, e a regra respondeu:

```
209:33  error  'fronteira' is not defined  no-undef
209:60  error  'fronteira' is not defined  no-undef
213:74  error  'fronteira' is not defined  no-undef
```

Arquivo restaurado e conferido idêntico depois.

## ⛔ O que ele NÃO faz

Uma regra só. Isto **não** é "ligar o lint em `scripts/`": estilo, imports não
usados e o resto ficam de fora de propósito, porque a pasta tem mais de cem
arquivos e um banho de avisos é como se aprende a ignorar saída de portão.

E ele **não substitui rodar o script**. Escopo ele pega; lógica, não.
**Conserto de script se confere RODANDO o script inteiro**, e não greppando a
linha que se espera encontrar.
