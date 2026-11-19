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

Roda a coleta AO VIVO sem gravar e compara com o último `fr-polls` do Neon: diz se disparar o cron gravaria (assinatura igual = não grava), **o que a última gravação mudou na tela** (seção `DESDE O REGISTRO ANTERIOR`, desde 19/Nov/2026: rodadas novas com instituto, cliente, campo, amostra e ficha; listas que saíram; e listas EDITADAS, mesmo pollId com conteúdo diferente, que a comparação só por pollId deixaria passar; é a fonte do item "pesquisas novas" da ETAPA 3 quando o cron já gravou antes da rodada), que listas entrariam ou sairiam da tela, a tabela de `qualidade` inteira, por que cada lista recente ficou fora (com **diagnóstico de renumeração** de ficha), as pendentes, a lista principal por instituto e a média como a tela vai mostrar. É a base das ETAPAS 2 e 3.

🔎 **PENDENTES PELO TEXTO** (seção do atalho criada em 17/Nov/2026): `pendentes` só lê o RÓTULO da ficha, e 6 das 26 fichas de intenção de voto de setembro a novembro de 2026 vieram sem selo no rótulo (ex.: 10314 Ifop "climat politique post primaire", 10325 Cluster17 "Focus droite et centre"). A seção lê o texto de cada ficha recente sem selo e sem lista na base (índice `MieuxVoter/sondages-commission-index`, que arquiva 1x por dia) e procura a PERGUNTA de intenção de voto, depois de um controle positivo em fichas citadas. Medido nas 114 fichas arquivadas de setembro a novembro: 26 de 26 citadas acusadas, e das não citadas só as 2 pendentes reais. Como ler:
- `⚠️ INTENÇÃO DE VOTO NO TEXTO` = pendente que o rótulo não acusa: listar ao André junto com as outras;
- ficha do dia, ainda sem texto no índice: desde 19/Nov/2026 o atalho lê o PDF da Commission sozinho (`pdftotext -layout`, MiKTeX) com o mesmo detector, e marca `[lida do PDF]`. O caminho do PDF tem controle positivo próprio (`controle do PDF`: uma ficha citada lida pelo PDF); se ele falhar, as lidas pelo PDF saem `SEM VALOR` e se leem à mão. Mutação conferida: detector cego no PDF dá `CEGO`; PDF com intenção de voto no lugar do alvo dá `⚠️ INTENÇÃO DE VOTO NO TEXTO`;
- `⏳ texto ainda não arquivado no índice e PDF não lido` = ler o PDF à mão antes de dizer que não há pendente;
- `⛔ DETECTOR CEGO` = nada daquela seção vale como "sem pendente".

🔢 **VALORES DA BASE NA FICHA** (seção criada em 19/Nov/2026): a coleta confere número e instituto da ficha, nunca as porcentagens. A seção procura cada (sobrenome, porcentagem) das listas publicáveis dos últimos 45 dias numa linha da ficha com o sobrenome, e a lista INTEIRA num mesmo bloco de linhas (pega hipótese trocada, que passaria no teste por valor). Quando o texto do índice não fecha, refaz pelo PDF: em 19/Nov o índice da 10318 OpinionWay trazia "Marine Le Pen 4%" e "Eric Zemmour 35%" na hipótese 1, e o PDF traz Zemmour 4% e Le Pen 35%, como a base. Medido em 19/Nov: 873 de 879 valores achados nas 18 fichas com tabela, os 6 restantes por convenção ("<1%" vira 0,5 na base; "-" vira 0), 108 de 108 listas em bloco; a Odoxa 10310 traz só o questionário e sai como não conferível. Mutação conferida: valor trocado, hipótese trocada e leitura cega dão alarme. Como ler:
- `✓` = todos os valores na ficha, todas as listas em bloco;
- `↳ VALOR NÃO ACHADO NA FICHA` ou `lista sem bloco único` = conferir à mão no PDF; se a ficha diverge da base, registrar ao André (não corrigir: nenhum número de pesquisa é digitado à mão);
- `⛔ CONFERÊNCIA CEGA` = nada da seção vale como "confere".

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
- fichas pendentes (as do rótulo e as que só o texto acusa);
- a média por candidato e a lista principal de cada instituto como estão na tela agora.

Não interpretar a disputa: descrever a medição.

## Memórias relacionadas

`project_franca_2027_estudo_painel` · `feedback_verify_every_number_before_sending` · `feedback_o_superlativo_erra_o_universo_nao_so_a_janela`
