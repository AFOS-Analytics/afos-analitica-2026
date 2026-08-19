/**
 * Leitura do `updatedAt` do frontmatter, em UM lugar só.
 *
 * O campo é escrito à mão como `"DD/MM/YYYY, HH:MM"`, em BRT. A mesma regra
 * existia copiada em três arquivos (lib/feeds/rss.ts, lib/afos-daily/schema.ts,
 * lib/afos-tradeoff/schema.ts) e nenhuma das três validava o que montava.
 *
 * 🔴 O que isso custou, medido em 19/Ago/2026 em produção: a Edição №4 do
 * Tradeoff dos EUA foi salva com `updatedAt: "08/16/2026, 23:31"`, em MM/DD.
 * As três cópias montaram `2026-16-08T23:31:00-03:00`, que é mês 16. O RSS
 * publicou `<pubDate>Invalid Date</pubDate>` e o JSON-LD publicou a mesma data
 * impossível, ou seja, a edição MAIS RECENTE do produto sumia do feed em inglês.
 *
 * ⚠️ E existe um modo pior, silencioso: `"08/10/2026"` em MM/DD é uma data
 * VÁLIDA lida como DD/MM, e vira 08 de outubro sem nenhum sinal de falha. Por
 * isso a validação aqui não se contenta com "a Date não é NaN": ela exige que
 * o dia e o mês voltem iguais aos que entraram. Quando qualquer coisa não
 * fecha, o valor cai para a meia-noite BRT da data do arquivo, que vem do NOME
 * do arquivo e é sempre correta.
 */

const FORMATO = /^(\d{2})\/(\d{2})\/(\d{4}),?\s+(\d{2}):(\d{2})$/

/** Meia-noite BRT do dia da peça. Piso sempre confiável. */
function pisoDaData(dateIso: string): string {
  return `${dateIso}T00:00:00-03:00`
}

/**
 * Devolve o `updatedAt` como ISO 8601 com offset de Brasília, ou o piso da
 * data da peça se o campo estiver ausente, malformado ou impossível.
 */
export function updatedAtToIso(updatedAt: string | undefined | null, dateIso: string): string {
  const m = String(updatedAt ?? '').match(FORMATO)
  if (!m) return pisoDaData(dateIso)
  const [, dd, mm, yyyy, hh, mi] = m
  const dia = Number(dd), mes = Number(mm), ano = Number(yyyy)
  const hora = Number(hh), min = Number(mi)
  if (mes < 1 || mes > 12 || dia < 1 || dia > 31) return pisoDaData(dateIso)
  if (hora > 23 || min > 59) return pisoDaData(dateIso)
  // Round-trip em UTC pega 31/04 e 29/02 de ano comum, que passam pelas faixas.
  const teste = new Date(Date.UTC(ano, mes - 1, dia))
  if (teste.getUTCMonth() !== mes - 1 || teste.getUTCDate() !== dia) return pisoDaData(dateIso)

  // 🔑 A trava que fecha o modo SILENCIOSO, e a análise da string sozinha nunca
  // fecharia: "08/10/2026" é uma data válida nos dois formatos, então nenhuma
  // validação de faixa a recusa. Quem a desmente é a data da PRÓPRIA PEÇA, que
  // vem do nome do arquivo. `updatedAt` é escrito na rodada que publica a peça,
  // logo ele fica a poucos dias dela; 59 dias de distância, que é o que aquele
  // caso produz, é formato trocado, não correção tardia.
  const alvo = new Date(Date.UTC(ano, mes - 1, dia)).getTime()
  const daPeca = Date.parse(`${dateIso}T00:00:00Z`)
  if (Number.isFinite(daPeca)) {
    const dias = (alvo - daPeca) / 86_400_000
    if (dias > 7 || dias < -30) return pisoDaData(dateIso)
  }

  return `${yyyy}-${mm}-${dd}T${hh}:${mi}:00-03:00`
}

/** O mesmo instante em RFC 822, que é o formato exigido pelo `<pubDate>` do RSS. */
export function updatedAtToRfc822(updatedAt: string | undefined | null, dateIso: string): string {
  const d = new Date(updatedAtToIso(updatedAt, dateIso))
  if (Number.isNaN(d.getTime())) return new Date(pisoDaData(dateIso)).toUTCString()
  return d.toUTCString()
}
