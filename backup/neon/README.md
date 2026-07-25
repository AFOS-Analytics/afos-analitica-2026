# Backup do Neon

Cópia das tabelas do banco que **não podem ser reconstruídas** se ele sumir.

## O que está aqui, e por quê

Os JSON editoriais (`public/analysis-*.json`) e as dailies (`public/afos-daily/`)
já vivem em três lugares: este repositório, a Vercel e o Neon. Eles sobrevivem à
perda de qualquer um dos três.

A **série de preços do Polymarket** não. Ela é acumulada em capturas de meia em
meia hora desde 14/Abr/2026 e não existe em nenhum outro lugar. Se o banco for
embora, ela não volta: não há como pedir ao Polymarket o preço que estava no
book às 14h37 de um dia qualquer de maio. Foi essa série que sustentou, em
25/Jul/2026, a conferência do recorde de gap entre Lula e Flávio.

## ⚠️ Este repositório é PÚBLICO

Nenhuma tabela com dado de pessoa entra aqui. Ficam de fora, por decisão
explícita e não por esquecimento: `user`, `userPreference`, `userConsent`,
`lead`, `contactEvent`, `visitorState`, `auditLog`, `deletionRequest`,
`chatConversation`, `chatMessage`, `llmRun`, `modelOutput`.

A lista atualizada, com o motivo de cada exclusão, está em
`MANIFEST.json` → `tabelasExcluidasPorConterDadoPessoal`.

Há **duas travas** e elas rodam antes de qualquer commit:

1. **Classificação por tabela** (`scripts/backup-neon.ts`). Toda tabela precisa
   estar em `PUBLICAVEL` ou em `PESSOAL`. Tabela nova sem classificação **aborta
   o backup**, em vez de o script adivinhar. Adivinhar aqui vaza dado ou perde
   backup em silêncio, e os dois desfechos são inaceitáveis.
2. **Varredura de conteúdo** (`scripts/check-backup-sem-pii.ts`). Procura
   e-mail, CPF, telefone, chave de API e segredo de alta entropia dentro dos
   arquivos descomprimidos, independentemente da tabela de origem. Roda também
   no pre-commit.

## Formato

Cada tabela vira CSV comprimido, **particionado por mês** quando tem carimbo de
tempo: `<tabela>/YYYY-MM.csv.gz`.

A partição não é enfeite. Essas tabelas são append-only, então mês fechado nunca
mais muda e o git guarda o arquivo uma única vez. Na primeira versão do script,
sem partição, `analysisReport` sozinho dava 1,7 MB reescritos por dia: cerca de
800 MB de histórico no git em um ano, para guardar um punhado de linhas novas.

`MANIFEST.json` traz, por arquivo, a contagem de linhas e um sha256 do conteúdo
descomprimido.

## Comandos

```bash
npx tsx scripts/backup-neon.ts              # gera
npx tsx scripts/backup-neon.ts --verificar  # confere checksum de cada arquivo
npx tsx scripts/check-backup-sem-pii.ts     # trava de dado pessoal
npx tsx scripts/check-backup-restauravel.ts # prova que RESTAURA
```

## A trava que mais importa

`check-backup-restauravel.ts` não compara bytes. Ele **reconstrói a série a
partir dos CSVs, sem tocar no banco**, e verifica se ela responde exatamente a
mesma pergunta que o banco responde: qual o maior gap Lula menos Flávio, e em
que dia.

Backup que ninguém tentou restaurar não é backup, é esperança comprimida.

## Automação

`.github/workflows/backup-neon.yml` roda todo dia às 15:00 UTC (12:00 BRT), uma
hora depois do cron de `persist-analysis`, e só commita se algo mudou. As quatro
checagens acima rodam antes do commit; se qualquer uma reprovar, nada é gravado.
