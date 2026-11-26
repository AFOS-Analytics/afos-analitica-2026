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

📄 **O QUE A FICHA PENDENTE DIZ** (linhas `📄` logo abaixo de cada `⏳`, desde 20/Nov/2026): lê a ficha pendente (índice ou PDF) e mostra o campo, as amostras citadas, onde as listas entrariam quando a base as estruturar (lista principal nova do instituto, ou campo ANTERIOR à rodada da tela, que entra só na média e nas contagens, com as datas até quando fica na média de 30 dias e nas contagens de 45) e o que a base MieuxVoter já abriu sobre ela (o robô da base abre uma issue "Nouveau sondage" para cada ficha nova). Nasceu da 10392 (Ifop/Sud Radio, publicada em 20/11 com campo de 2 a 4/11, anterior à 10384 que a tela mostra). Medido nas 24 fichas citadas de 60 dias: o fim do campo sai em 20 e bate com a base nas 20; nas 4 da Harris o texto embaralha a data (duas colunas: "du 18 au 19" numa linha, "novembre 2026." na outra). Desde 23/Nov/2026 o **recurso do campo** relê essas fichas pelo PDF em ORDEM DE LEITURA (`pdftotext` sem `-layout`) e a linha diz `(PDF em ordem de leitura)`; `controle do recurso` roda em todas as citadas de 60 dias que o 1º texto não resolve (em 23/Nov: 4 de 4 Harris com o fim da base) e, sem caso ou com um que não bate, o campo vindo do recurso sai `SEM VALOR` e a linha volta a `NÃO extraído, ler à mão`. A amostra da base está entre as citadas em 24 de 24. `controle do extrator` roda nas 5 citadas mais recentes; se não `CONFERE`, a extração sai `SEM VALOR`. Nada desta seção vai para a tela: nenhum número de pesquisa é digitado à mão.

🔎 **PENDENTES PELO TEXTO** (seção do atalho criada em 17/Nov/2026): `pendentes` só lê o RÓTULO da ficha, e 6 das 26 fichas de intenção de voto de setembro a novembro de 2026 vieram sem selo no rótulo (ex.: 10314 Ifop "climat politique post primaire", 10325 Cluster17 "Focus droite et centre"). A seção lê o texto de cada ficha recente sem selo e sem lista na base (índice `MieuxVoter/sondages-commission-index`, que arquiva 1x por dia) e procura a PERGUNTA de intenção de voto, depois de um controle positivo em fichas citadas. Medido nas 114 fichas arquivadas de setembro a novembro: 26 de 26 citadas acusadas, e das não citadas só as 2 pendentes reais. Como ler:
- `⚠️ INTENÇÃO DE VOTO NO TEXTO` = pendente que o rótulo não acusa: listar ao André junto com as outras;
- ficha do dia, ainda sem texto no índice: desde 19/Nov/2026 o atalho lê o PDF da Commission sozinho (`pdftotext -layout`, MiKTeX) com o mesmo detector, e marca `[lida do PDF]`. O caminho do PDF tem controle positivo próprio (`controle do PDF`: uma ficha citada lida pelo PDF); se ele falhar, as lidas pelo PDF saem `SEM VALOR` e se leem à mão. Mutação conferida: detector cego no PDF dá `CEGO`; PDF com intenção de voto no lugar do alvo dá `⚠️ INTENÇÃO DE VOTO NO TEXTO`;
- `⏳ texto ainda não arquivado no índice e PDF não lido` = ler o PDF à mão antes de dizer que não há pendente;
- `⛔ DETECTOR CEGO` = nada daquela seção vale como "sem pendente";
- `🗳️ INTENÇÃO DE VOTO EM PRIMÁRIA` (desde 19/Nov/2026) = TODA ocorrência da pergunta na ficha é sobre uma primária (ex.: 10387 Ifop/Le Figaro, "premier tour de cette primaire de la droite et du centre"). Fora do universo da tela, que mostra o 1º e o 2º turno da presidencial: listar ao André como primária, não como pendente. Ficha com UMA pergunta da presidencial segue `⚠️`. O `controle da primária` roda nas citadas (todas da presidencial): se marcar alguma, as marcadas como primária se leem à mão. Medido em 19/Nov: 0 de 30 citadas com texto marcadas; das 6 fichas de primária com texto, só a 10387 tem a pergunta.

🗳️ **PRIMÁRIA** (seção criada em 19/Nov/2026): lista da base que cita ficha com "primaire" no rótulo (fora "post primaire", que na 10314 é a presidencial). `⚠️ PUBLICÁVEL citando ficha de primária` = conferir no PDF se a lista é da presidencial; se for da primária, ela já está na tela: avisar o André. A coleta tira sozinha da tela a lista sem a forma da presidencial (`listaForaDaForma`, ETAPA 2); esta seção pega a primária que tiver a forma (6 nomes ou mais).

🔢 **VALORES DA BASE NA FICHA** (seção criada em 19/Nov/2026): a coleta confere número e instituto da ficha, nunca as porcentagens. A seção procura cada (sobrenome, porcentagem) das listas publicáveis dos últimos 45 dias numa linha da ficha com o sobrenome, e a lista INTEIRA num mesmo bloco de linhas (pega hipótese trocada, que passaria no teste por valor). Quando o texto do índice não fecha, refaz pelo PDF: em 19/Nov o índice da 10318 OpinionWay trazia "Marine Le Pen 4%" e "Eric Zemmour 35%" na hipótese 1, e o PDF traz Zemmour 4% e Le Pen 35%, como a base. Medido em 19/Nov: 873 de 879 valores achados nas 18 fichas com tabela, os 6 restantes por convenção ("<1%" vira 0,5 na base; "-" vira 0), 108 de 108 listas em bloco; a Odoxa 10310 traz só o questionário e sai como não conferível. Mutação conferida: valor trocado, hipótese trocada e leitura cega dão alarme. Como ler:
- `✓` = todos os valores na ficha, todas as listas em bloco;
- `↳ VALOR NÃO ACHADO NA FICHA` ou `lista sem bloco único` = conferir à mão no PDF; se a ficha diverge da base, registrar ao André (não corrigir: nenhum número de pesquisa é digitado à mão);
- `⛔ CONFERÊNCIA CEGA` = nada da seção vale como "confere".
- 🧩 **Nome quebrado na tabela** (desde 26/Nov/2026): na ficha 10392 da Ifop/Sud Radio o PDF quebra o nome em duas linhas com o valor numa linha SÓ DE NÚMERO entre elas ("Jean-Luc" / "18" / "Mélenchon"; "Nicolas Dupont-" / "Aignan" / "1,5") e a seção acusou 12 de 36 valores "não achados", alarme falso (base = ficha 36 de 36, conferido quadro a quadro em ordem de leitura). Agora vale o valor numa linha sem letra nenhuma a até 2 linhas do sobrenome, e sobrenome composto achado por uma das partes. Mutação conferida: Mélenchon e Glucksmann trocados e Dupont-Aignan alterado na 10392 dão `VALOR NÃO ACHADO` e as duas listas saem do bloco (2 de 4).

🗓️ **A JANELA ANDA SEM PESQUISA NOVA** (última seção do atalho, criada em 21/Nov/2026): a média da tela é de 30 dias e as contagens (listas principais, 1º lugar, top-2, duelos) são de 45, cortadas pela data UTC de agora. À meia-noite UTC uma rodada antiga sai e a tela muda sem pesquisa nova; o texto do painel, que diz "nos últimos 30 dias", envelhece calado. Em 21/Nov o texto de 20/11 dizia "18,1 de média em 47 listas" para Mélenchon e a tela já contava 42: a Harris 10332 (campo até 21/10) saiu à meia-noite. A seção mostra:
- `DESDE O TEXTO DO PAINEL`: o registro `fr-polls` do dia do `analise.pt-BR.json` contra a tela de agora, rodada a rodada e candidato a candidato; `[no texto]` = o valor que deixou de valer está entre os números do texto publicado (pode ser coincidência, conferir a frase). Com `⚠️`, o texto está velho: dizer ao André; reescrever é `/atualizar-fra`, só se ele pedir;
- `PRÓXIMOS 7 DIAS`: com os dados de agora e nenhuma pesquisa nova, em que meia-noite UTC cada rodada sai da média (fim do campo + 31 dias) e das contagens (+ 46), e o que muda. A tela é ISR de 30 min: a mudança aparece até meia hora depois. Serve para a Weekly (segunda) e a Tradeoff (quinta) saberem o que a janela tira no dia da edição;
- ⛔ desde 24/Nov/2026, `DESDE O TEXTO DO PAINEL` está DESLIGADA (`TEXTO_DO_PAINEL_NA_TELA = false` no atalho): o texto diário saiu da tela em 23/11 e a marca `[no texto]` só daria alarme falso. O que mudou desde o registro anterior está em `DESDE O REGISTRO ANTERIOR`; `PRÓXIMOS 7 DIAS` segue valendo para a Weekly e o Tradeoff;
- dois controles: a conta direta tem de tirar as mesmas listas que a simulação, e por candidato as listas e os duelos da seção têm de ser os que `mediaPorCandidato` e `estatisticasPorCandidato` (as funções da tela) contam. Se um falhar, `SEM VALOR`. Mutação conferida: corte da seção em 31 dias derruba os dois; corte da TELA em 31 dias derruba a coerência.

📰 **PUBLICADA SEM FICHA** (seção criada em 22/Nov/2026, logo depois de `PENDENTES PELO TEXTO`): as outras seções só enxergam pesquisa que JÁ tem ficha na Commission. Em 22/Nov (domingo, véspera da Weekly №1) a vaga 10 da Toluna Harris Interactive para M6, RTL e L'Express (campo 18-19/11, 2.088 inscritos) já estava no PDF da Toluna e na Wikipedia EN, a listagem da Commission parava na 10392 e o atalho dizia "1 pendente". A seção lê as tabelas de 1º turno da Wikipedia EN e FR **só como detector de existência** (instituto, fim do campo, amostra, link; nenhum número delas vai para lugar nenhum) e casa cada rodada com campo nos últimos 21 dias com a base (mesmo instituto, fim do campo a até 1 dia) e, se não está nela, com as fichas pendentes (fim do campo lido da própria ficha). Como ler:
- `📰 PUBLICADA SEM FICHA NEM LISTA NA BASE` = listar ao André (instituto, campo, amostra, link). Entra na tela sozinha quando a Commission publicar a ficha e a base estruturar; nenhum número entra à mão. A linha diz se ela passaria a ser a lista principal do instituto e até quando fica na média e nas contagens;
- `⏳ … é a ficha pendente N` = a mesma pesquisa da seção PENDENTES, vista também pela imprensa; `casada pela AMOSTRA` = o campo da ficha não foi lido, mas a amostra da Wikipedia está entre as citadas na ficha;
- `❓ … PODE SER ELA` = ficha pendente do mesmo instituto com o campo NÃO LIDO e sem a amostra entre as citadas: ler o PDF à mão. Campo não lido nunca é "OUTRO campo" (23/Nov/2026: a 10393, que É a vaga 10 da Toluna Harris, saiu como "OUTRO campo: não é ela" porque o extrator não leu o campo da Harris);
- `≈ … na base com fim do campo X` = a Wikipedia e a base dão datas diferentes (2 a 3 dias): conferir;
- controle positivo por fonte: as rodadas de 1º turno publicáveis da base nos mesmos 21 dias têm de ser achadas na tabela. Fonte que não acha nenhuma sai `⛔ CEGA`; as duas cegas = `LEITURA CEGA`, nada da seção vale como "nenhuma publicada sem ficha". Medido em 22/Nov: EN 7 de 7, FR 7 de 7. Mutações conferidas: leitor cego dá `CEGA` nas duas; rodada tirada da base vira `📰`; ficha pendente com outro campo não é casada. Em 23/Nov/2026, no recurso do campo: recurso cego (controle 0 de 4, `SEM VALOR`, a 10393 casada pela amostra 2088), recurso e amostra cegos (`❓ PODE SER ELA`), recurso com o fim deslocado 3 dias (controle 0 de 4, campo descartado, casada pela amostra). Nas três, nenhum "OUTRO campo".

🆚 **FRENTE A FRENTE** (atalho criado em 24/Nov/2026): `npx tsx scripts/frente-a-frente-fra.ts --a="Édouard Philippe" --b="David Lisnard" [--em=AAAA-MM-DD] [--dias=45]`. Em quantas listas de 1º turno que testam os dois A está à frente de B, por instituto, com as listas minoritárias, sobre o MESMO universo das contagens da tela (`listasNaJanela`, lib/fr/candidatos.ts); `--em` dá a tela de um dia (00:30 UTC) com os dados de agora, para a Weekly (segunda) e o Tradeoff (quinta). Controle: listas de A e de B = `estatisticasPorCandidato`; se não, SEM VALOR. Reproduz a Weekly №1 (25 a 3, 1 empate, em 29 listas).

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
| `listaForaDaForma` | lista sem a forma da presidencial (desde 19/Nov/2026, `formaDaLista` em `lib/fr-polls/collect.mjs`): turno que não é "1er Tour" nem "2nd Tour", 1º turno com menos de 6 nomes (a menor lista da base tem 7; as da primária na 10387 têm 4 e 3) ou duelo sem 2 nomes. Fica fora da tela, com o motivo em `FORA DA TELA`. Antes da trava, qualquer `tour` sem "2" virava 1º turno, e uma primária estruturada pela base entraria como lista da presidencial (mutação conferida: o código antigo publicava as três listas mutantes, o novo nenhuma) |
| `pendentes` | ficha de intenção de voto ainda sem dado na base. Listar no relatório ao André |

## ETAPA 3: Relatório ao André

Em português simples:
- pesquisas novas que entraram na tela (instituto, cliente, campo, ficha);
- as que ficaram fora e por quê;
- fichas pendentes (as do rótulo e as que só o texto acusa);
- pesquisas já na imprensa sem ficha nem lista na base (seção `PUBLICADA SEM FICHA`), sem número delas;
- a média por candidato e a lista principal de cada instituto como estão na tela agora;
- o que a janela já tirou desde o texto do painel e o que tira nos próximos dias (seção `A JANELA ANDA`), com a data UTC.

Não interpretar a disputa: descrever a medição.

## Memórias relacionadas

`project_franca_2027_estudo_painel` · `feedback_verify_every_number_before_sending` · `feedback_o_superlativo_erra_o_universo_nao_so_a_janela`
