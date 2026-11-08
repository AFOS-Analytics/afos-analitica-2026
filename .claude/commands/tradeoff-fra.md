# AFOS Tradeoff — França 2027 (semanal, QUINTAS)

Gerar a edição semanal do **AFOS Tradeoff da França**: leitura técnica para research, buy-side e tesouraria sobre a eleição presidencial francesa (1º turno 18/Abr/2027, 2º turno 02/Mai/2027).

Criado em 08/Nov/2026. Molde: `/tradeoff-usa`, cujas regras valem aqui inteiras (frontmatter na forma do loader, portão de blocos, numeração, cauda cega, a ressalva se resolve no NÚMERO, sem travessão, volume sim e liquidez não no texto). Este arquivo diz **o que muda na França**; onde ele não fala, vale o `/tradeoff-usa`.

## 🔴 O que muda em relação aos EUA

| | Tradeoff EUA | **Tradeoff França** |
|---|---|---|
| Dia | segunda | **QUINTA** (decisão do André, 08/Nov/2026) |
| Origem | português | 🔴 **INGLÊS** (decisão do André, 08/Nov/2026, só para a França) |
| Pasta | `public/afos-tradeoff/us/` | **`public/afos-tradeoff/fr/`** |
| Idiomas | EN, PT-BR, ES | **EN, PT-BR, ES. Sem francês** |
| Mercado | 1 livro | **2 livros, Polymarket e Kalshi, lado a lado, nunca em média** |

## 🔴 A ORIGEM É O INGLÊS, mas a PASTA segue o formato do Tradeoff

O loader do Tradeoff lê `{data}.md` como **pt-BR** e `{data}.en.md` como inglês. Isso não muda. O que muda é a ORDEM de escrita:

```
public/afos-tradeoff/fr/AAAA-MM-DD.en.md     ← ESCRITO PRIMEIRO (origem)
public/afos-tradeoff/fr/AAAA-MM-DD.md        ← tradução pt-BR
public/afos-tradeoff/fr/AAAA-MM-DD.es.md     ← tradução es
```

⚠️ **Consequência conhecida:** o `persist-afos-tradeoff.ts` arquiva no Neon o arquivo `{data}.md`, que na França é a TRADUÇÃO pt-BR, e não a origem. Funciona (um registro por edição), mas o registro é a versão traduzida. Se isso importar, ensinar o script a escolher a origem por país; não contornar à mão.

⚠️ **A revisão passa a ser em português e espanhol**, a segunda língua, como na Weekly dos EUA. Ler as três versões INTEIRAS (30 erros de tradução já passaram verdes: `feedback_afos_daily_translation_review`).

## 🌍 País: SEMPRE `fr`, em todo comando

Sem `--pais=fr`, publish, persist e broadcast do Tradeoff caem no **Brasil** (pasta raiz), bem-formados e calados. Conferir na saída.

## Pré-requisitos

1. **Mercado fresco:** `curl -s "https://www.afos-analytics.com/api/polymarket?country=fra&fresh=1"` e `curl -s "https://www.afos-analytics.com/api/kalshi?country=fra&fresh=1"`.
2. **Trava aprovada:** `npx tsx scripts/capture-guard.ts --pais=fra` → `VEREDITO: APROVADO` na última linha.
3. **Kalshi:** 🔁 **Regra desde 08/Nov/2026 (decisão do André):** a Kalshi entra com o PREÇO DA HORA sempre que a leitura passa na avaliação (`avaliacao.ok` na resposta da rota: soma 85 a 120, líder com oferta de compra e de venda). A prontidão de 14 dias (`npx tsx scripts/kalshi-prontidao.ts --pais=fra`) passou a valer só para a SÉRIE: antes de `PRONTO`, nada de variação semanal nem superlativo da Kalshi, e qualquer "desde" diz "desde 08/11/2026".
4. **Pesquisas:** registro `fr-polls` do Neon, só `publicavel: true`.
5. **Δ da semana:** `node scripts/semana-do-contrato.mjs --pais=fr --de=... --ate=...` (lê o backup; série desde 08/Nov/2026).

## As 4 trocas em relação ao template do Brasil

Usar `sectionTitles` no frontmatter para os títulos não contradizerem o texto.

1. **A anti-média vira o bloco dos DOIS LIVROS.** A seção 2 explica por que a peça não junta Polymarket e Kalshi num número só, e por que não tira o mercado da pesquisa. A **distância entre livros** é o número que só este produto tem.
   ```yaml
   sectionTitles:
     2: "Why this brief keeps the two books apart"
   ```
2. **Calendário de prints vira calendário de FICHAS e de marcos.** A França tem ficha oficial de cada pesquisa (Commission des sondages), então dá para listar o que saiu e o que ainda não foi estruturado, mais os marcos: decreto (~07/Fev), 500 assinaturas (12/Mar), decisão da Cour de cassation sobre Le Pen (até início de abril), turnos.
3. **Histórico de acertos:** omitido, como nos EUA. Exceção possível: o caso validado **França 2024** (legislativas, DOI 10.7910/DVN/N51NQF), citado como caso medido, nunca como desempenho.
4. **Cenários saem dos contratos que o mercado já precifica:** vai ao 2º turno, estará na cédula, vence. Ler, não inventar.

## Travas legais (só da França)

1. 🔒 **ANJ, art. 57:** sem link para página de negociação. `contractLink` e `totalLink` apontam para o painel do AFOS (`/[idioma]/dashboard/fr`) ou ficam vazios; **nunca** para polymarket.com ou kalshi.com. Preço sempre como medição.
2. 🔇 **Silêncio eleitoral (lei de 1977):** nenhum envio e nenhum comentário de pesquisa no sábado e no domingo dos turnos. A quinta 15/Abr e a quinta 29/Abr saem normalmente, antes da janela.
3. **Aviso financeiro obrigatório**, como em todo Tradeoff.

## Específicas de escrita

- 🏷️ Todo número diz **de qual contrato e de qual livro** ele é.
- 🏷️ Toda média de pesquisa diz **quantas listas e quantos institutos**.
- Volume da Kalshi em **contratos**; volume da Polymarket é **giro acumulado**, não dinheiro em jogo (o contrato do vencedor somava US$ 168 mi em 08/Nov, inflado por candidatos a 0.05).
- ⛔ Contrato de enchimento ("Candidate A") não é preço.

## Portão e publicação

```bash
npx tsx scripts/check-tradeoff-blocos.ts AAAA-MM-DD fr            # bloqueante, conta pelo loader
node scripts/gate-traducao-tradeoff.mjs AAAA-MM-DD --pais=fr      # números idênticos nos 3 idiomas
npx vercel --yes                                                  # preview, AGUARDAR aprovação
npx tsx scripts/publish-afos-tradeoff.ts AAAA-MM-DD --pais=fr --all-locales
npx tsx scripts/persist-afos-tradeoff.ts AAAA-MM-DD --pais=fr
npx tsx scripts/broadcast-afos-tradeoff.ts AAAA-MM-DD --pais=fr --dry-run   # OBRIGATÓRIO antes
npx tsx scripts/broadcast-afos-tradeoff.ts AAAA-MM-DD --pais=fr
```

Deploy de produção **de um worktree de `origin/main`**, nunca da árvore principal. Antes do envio, `curl` nos 3 links conferindo o **`og:title`** e o assunto "AFOS Tradeoff France".

## Numeração e calendário

Numeração própria da França, a partir da **№1 na quinta 26/Nov/2026** (sugestão de 08/Nov, aguardando confirmação do André). Quintas até **29/Abr/2027**; a edição seguinte ao 2º turno é decisão a tomar.

## Ainda não construído

- Cartão social próprio do Tradeoff França (`scripts/build-og-card-us-tradeoff.mjs` é o molde).
- Entrada da França no `sitemap.ts`: entra no dia da tela pública.

## Memórias relacionadas

`project_franca_2027_estudo_painel` · `project_tradeoff_multipais_arquitetura` · `feedback_script_de_pais_unico_entrega_a_peca_errada_calado` · `reference_esma_contratos_de_evento_europa`
