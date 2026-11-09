# AFOS Analytics — Atualização de Pesquisas (FRANÇA 2027)

Confere e, se preciso, força a coleta das pesquisas da presidencial francesa. Criado em 08/Nov/2026.

A França não tem registro estruturado como o TSE. A coleta (`lib/fr-polls/collect.mjs`, cron `refresh-fr-polls` às 07:40 e 19:40 UTC) cruza duas fontes:
- 🏛️ **Commission des sondages** (autoridade): a ficha oficial que toda pesquisa publicada na França deposita (lei de 1977, art. 3).
- 📊 **MieuxVoter/presidentielle2027** (base estruturada, licença MIT): candidato e porcentagem por lista testada.

Cada lista da base é conferida contra a ficha que ela cita: o número existe na listagem e o instituto bate. Só `publicavel: true` vai para a tela.

## ⛔ Regras

- **Nenhum número de pesquisa é digitado à mão.** Se uma pesquisa nova tem ficha mas não está na base, ela fica em `pendentes` até a base estruturá-la. Não "completar" com número tirado de jornal ou da Wikipedia.
- **Comando que GRAVA só roda quando o André pede NA HORA.**
- 🔇 **Silêncio eleitoral:** nada de coleta comentada nem publicação de pesquisa no sábado e domingo dos turnos (`lib/fr/silencio-eleitoral.ts`).
- 🧮 **A tela mostra (a) a lista principal de cada instituto e (b) a média por candidato** (decisão do André, 08/Nov/2026). A média sempre leva junto o número de listas e de institutos. Mudar o método é decisão dele.

## ETAPA 0: Atalho (só leitura), SEMPRE primeiro

```bash
npx tsx scripts/pesquisas-fra.ts       # precisa de .env.local no worktree
```

Roda a coleta AO VIVO sem gravar e compara com o último `fr-polls` do Neon: diz se disparar o cron gravaria (assinatura igual = não grava), que listas entrariam ou sairiam da tela, a tabela de `qualidade` inteira, por que cada lista recente ficou fora (com **diagnóstico de renumeração** de ficha), as pendentes, a lista principal por instituto e a média como a tela vai mostrar. É a base das ETAPAS 2 e 3.

## ETAPA 1: Disparar a coleta (se a última tiver mais de 12h, ou se pedido)

```bash
S=$(grep -E "^CRON_SECRET=" .env.local | cut -d= -f2- | tr -d '"\r')
curl -s -H "Authorization: Bearer $S" "https://www.afos-analytics.com/api/cron/refresh-fr-polls"
```

Resposta esperada: `ok: true` e `gravado: true` (conteúdo mudou) ou `gravado: false` com `sem mudança desde fr-polls-DD-MM-AAAA`. ⛔ `ok: false` com "fonte indisponível" = **nada foi gravado** (a coleta falha fechada); repetir mais tarde, não contornar.

## ETAPA 2: Ler a qualidade

O registro `fr-polls` mais recente do Neon traz `qualidade`:

| Campo | O que fazer |
|---|---|
| `publicaveis` / `pesquisas` | proporção normal em 08/Nov: 352 de 369 |
| `fichaDiverge` | a base cita ficha de OUTRA pesquisa. Fica fora da tela; registrar, não corrigir à mão. Em 08/Nov: 4 listas da Ifop/LCI de 27 a 29/Out citando a 10352 (ELABE). **Causa medida em 09/Nov:** a Commission publicou o PDF da Ifop como `10352-pres-iv-ifop-lci-3-novembre.pdf` em 04/Nov 09:00 UTC e o republicou como `10351-...` em 05/Nov 15:11 (o arquivo velho segue no ar); o índice `MieuxVoter/sondages-commission-index` guardou o primeiro. O atalho mostra isso como `RENUMERAÇÃO`. A mesma pesquisa aparece então também em `pendentes` (a 10351 sem lista citando). Aviso: MieuxVoter/presidentielle2027#339 |
| `fichaForaDaListagem` | ficha antiga, de outro tema da Commission (pesquisas de 2024). Normal |
| `semNumero` | a base não cita ficha (barômetros Odoxa). Fica fora da tela |
| `institutoSemMapa` | **instituto novo**: acrescentar ao mapa `INSTITUTOS` em `lib/fr-polls/collect.mjs`, com a grafia do rótulo da ficha |
| `somaForaDaFaixa` | lista que não soma 97 a 103: candidato faltando ou linha duplicada na base. Fica fora da tela |
| `pendentes` | ficha de intenção de voto ainda sem dado na base. Listar no relatório ao André |

## ETAPA 3: Relatório ao André

Em português simples:
- pesquisas novas que entraram na tela (instituto, cliente, campo, ficha);
- as que ficaram fora e por quê;
- fichas pendentes;
- a média por candidato e a lista principal de cada instituto como estão na tela agora.

Não interpretar a disputa: descrever a medição.

## Memórias relacionadas

`project_franca_2027_estudo_painel` · `feedback_verify_every_number_before_sending` · `feedback_o_superlativo_erra_o_universo_nao_so_a_janela`
