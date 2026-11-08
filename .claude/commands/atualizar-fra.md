# AFOS Analytics — Atualização Completa (FRANÇA 2027)

Atualiza o **painel da França** (`/[idioma]/dashboard/fr`): confere o mercado nos dois livros, confere as coletas automáticas de pesquisa e de imprensa, reescreve o texto do painel nos 3 idiomas, regera o cartão social e publica.

Criado em 08/Nov/2026. Molde: `/atualizar-brz` (painel com texto) e `/atualizar-usa` (trava, imprensa). Onde este arquivo não fala, valem as regras daqueles dois.

## ⛔ Antes de tudo

- **Comando que GRAVA só roda quando o André pede NA HORA.** Plano combinado antes não autoriza.
- 🔇 **Silêncio eleitoral** (lei de 1977, art. 11): de sexta 22:00 UTC a domingo 18:00 UTC antes de **18/Abr/2027** e de **02/Mai/2027**, NÃO rodar este comando. Nada de texto, preço ou comentário de pesquisa. A tela já se congela sozinha (`lib/fr/silencio-eleitoral.ts`); o comando não pode furar.
- 🌍 **País SEMPRE explícito:** `--pais=fra` nos scripts, `country=fra` nas rotas. Conferir o país impresso na 1ª linha da saída.
- 🌳 **Trabalhar e publicar de um worktree de `origin/main`**, nunca da árvore principal.

## ETAPA 1: Mercado, dois livros

```bash
npx tsx scripts/capture-guard.ts --pais=fra          # ler a ÚLTIMA linha: VEREDITO: APROVADO | BLOQUEADO
npx tsx scripts/kalshi-prontidao.ts --pais=fra       # VEREDITO: PRONTO PARA A TELA | AINDA NÃO
curl -s "https://www.afos-analytics.com/api/polymarket?country=fra&fresh=1"
curl -s "https://www.afos-analytics.com/api/kalshi?country=fra&fresh=1"   # entra se avaliacao.ok
```

- `BLOQUEADO` = não publicar número de mercado nesta rodada.
- 🔁 **Regra desde 08/Nov/2026 (decisão do André):** a Kalshi entra com o PREÇO DA HORA sempre que a leitura passa na avaliação (`avaliacao.ok` na resposta da rota: soma 85 a 120, líder com oferta de compra e de venda). A prontidão de 14 dias (`npx tsx scripts/kalshi-prontidao.ts --pais=fra`) passou a valer só para a SÉRIE: antes de `PRONTO`, nada de variação semanal nem superlativo da Kalshi, e qualquer "desde" diz "desde 08/11/2026".
- Kalshi: volume em **contratos**, nunca em dólares; frescor é `ultimaNegociacaoEm`, não `cadastroAtualizadoEm`.
- Polymarket: volume é **giro acumulado** (inflado por candidatos a 0.05), nunca "dinheiro em jogo".
- ⛔ Contratos de enchimento ("Candidate A") não são preço. A coleta já os descarta (`app/lib/polymarket/bootstrap.ts`).

**Série da semana:** `node scripts/semana-do-contrato.mjs --pais=fr --de=... --ate=...` (lê o backup do Neon). A série da Polymarket da França começa em **08/Nov/2026, 19:30 UTC** (a captura das 18:30 foi descartada pela quarentena por causa dos contratos de enchimento); a da Kalshi em **08/Nov/2026, 18:25 UTC**. Superlativo é "desde" essas datas.

## ETAPA 2: Pesquisas e imprensa (coletas automáticas)

Coletadas pelos crons (`refresh-fr-polls` às 07:40 e 19:40 UTC; `refresh-fr-press` às 06:25, 12:25 e 18:25 UTC). Aqui só se CONFERE:

- **Pesquisas:** rodar `/atualizar-pesquisas-fra` se a última coleta tiver mais de 12h ou se houver ficha nova pendente.
- **Imprensa:** a seção mostra o último registro `fr-press`. Se ele tiver mais de 8h, disparar a rota do cron (ver `/atualizar-pesquisas-fra`, mesmo método) com `refresh-fr-press`.
- A lista de 24 veículos foi aprovada pelo André em 08/Nov/2026. Mudar a lista exige ordem dele.

## ETAPA 3: Texto do painel (3 idiomas)

Arquivos: `public/fr/analise.pt-BR.json` (ORIGEM, como no painel do Brasil), `.en.json`, `.es.json`. Formato: `{ updatedAt, titulo, paragrafos[] }`, negrito com `**...**` no início de cada parágrafo.

- **Descrever a medição, não defender tese.** Mercado e pesquisa lado a lado, nunca subtraídos (o mercado paga VENCER; a pesquisa mede intenção de voto no 1º turno).
- 🔢 **Todo número do texto sai de uma medição desta rodada e é conferido antes de gravar.** "Todas as listas", "todos os duelos", "sempre" são superlativos: contar no dado (ex.: em 08/Nov, Le Pen em 1º em 60 de 60 listas dos últimos 45 dias e à frente em 28 de 28 duelos em que aparece). Superlativo sem contagem não entra.
- 🏷️ Todo número diz de qual contrato e de qual livro é; toda média diz quantas listas e institutos.
- ⛔ Sem travessão. Sem rótulo de inclinação política para candidato ou veículo. A falha da nossa máquina nunca é assunto do texto.
- Traduzir NA SESSÃO (nunca por API), ler as três versões INTEIRAS. Decimal do painel: vírgula em PT-BR e ES, ponto em EN (`lib/i18n/numero.ts`); no texto, seguir a mesma regra.

## ETAPA 4: Perfil dos candidatos

Quando a seção de perfis existir, os textos dela também moram em JSON nos 3 idiomas e seguem as regras da ETAPA 3. São os **8 candidatos com mais de 5 pontos no mercado ou na média das pesquisas** (decisão do André, 08/Nov/2026). Candidato que cair abaixo dos dois limites sai na rodada seguinte; quem passar entra.

## ETAPA 5: Cartão social

```bash
node scripts/build-og-card-fr-panel.mjs
```

Lê preço e pesquisas na hora e carimba dia e hora. **Falha se a leitura de mercado vier degradada.** Gera os 3 cartões da MESMA leitura (`public/brand/og-fr-panel-{en,pt,es}-1200x627.png`), um por idioma, cada um ligado à sua versão da página. Conferir as três imagens antes de publicar.

## ETAPA 6: Conferir, publicar, conferir de novo

```bash
npx tsc --noEmit -p .                           # o build type-checa scripts/
npx tsx scripts/check-hardcoded-ptbr.ts
git add <arquivos por NOME>                      # nunca add -A
git commit ...; git push origin HEAD:main
npx vercel --prod --yes --cwd <worktree>         # conferir depois com vercel inspect: target production
```

**Depois do deploy, com navegador (playwright), nos 3 idiomas:** a página responde 200; o texto novo aparece; nenhuma palavra em português em EN/ES; o mercado carrega; a Kalshi segue oculta ou aparece conforme a prontidão; os links "fonte ↗" aparecem fora da França. Entrega visual se confere com navegador, não com grep.

## ✅ A tela é PÚBLICA desde 08/Nov/2026

O André decidiu publicar duas semanas antes da Weekly №1 (opção B). As 5 chaves foram viradas no mesmo commit; despublicar é desvirar as mesmas 5:
1. `robots` em `app/[locale]/dashboard/fr/page.tsx` (indexável);
2. `app/sitemap.ts` (painel, e as edições de Weekly e Tradeoff da França);
3. `lib/llms/llms-txt.ts`;
4. `scripts/indexnow-ping.mjs` depois do deploy;
5. `CountrySelector`: `fr` com `ready: true`.

Depois de cada deploy que mexe na tela, `node scripts/indexnow-ping.mjs` (a lista já inclui `/dashboard/fr` nos 3 idiomas).

## Memórias relacionadas

`project_franca_2027_estudo_painel` · `feedback_pais_nao_se_mistura_e_fallback_silencioso_entrega_o_outro` · `feedback_o_superlativo_erra_o_universo_nao_so_a_janela` · `feedback_comando_so_quando_o_andre_pede`
