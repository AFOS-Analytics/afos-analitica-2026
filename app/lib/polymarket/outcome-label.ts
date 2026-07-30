/**
 * Rótulo de um desfecho de mercado, a partir da pergunta do Polymarket.
 *
 * 🔴 POR QUE ESTE ARQUIVO EXISTE (30/Jul/2026)
 *
 * Esta função morava DUPLICADA: uma cópia em `bootstrap.ts`, que decide o nome
 * gravado na série, e outra em `app/lib/utils.ts`, que decide o nome mostrado na
 * tela. As duas divergiram. Quando as faixas dos mercados americanos ganharam
 * regra, só a cópia da série ganhou, e a da tela ficou sem entender faixa
 * nenhuma. Ou seja: a série já sabia dizer `≤ 47 cad.` enquanto a tela ainda
 * mostraria a pergunta crua cortada.
 *
 * Duplicata de regra não é dívida de estilo, é defeito com data marcada para
 * aparecer. Agora a regra mora aqui, e os dois lados importam daqui.
 *
 * ⚠️ O nome vira `outcomeKey`, que é ÚNICO POR MERCADO. Dois desfechos com o
 * mesmo nome COLAPSAM em um só e a distribuição perde linha sem erro nenhum
 * aparecer. É por isso que o nome de emergência não pode ser um prefixo da
 * pergunta, e é por isso que faixa nova sem regra é perigosa: ela não quebra,
 * ela some.
 */

/**
 * Sufixo estável derivado da pergunta INTEIRA, só para o nome de emergência.
 * Cortar a pergunta em 50 caracteres, que era o que se fazia antes, deixava o
 * colapso a um caractere de distância: as 11 perguntas de cadeiras do Senado só
 * divergem depois do 38º. Determinístico, para a mesma pergunta cair sempre na
 * mesma chave entre capturas.
 */
function sufixoEstavel(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0;
  return h.toString(36).slice(0, 6);
}

export interface OpcoesRotulo {
  /**
   * Separador da faixa de inflação. A tela do Brasil sempre mostrou hífen e a
   * série sempre gravou travessão; unificar mudaria a tela de uma página no ar
   * sem nenhum ganho, então a diferença fica explícita aqui em vez de virar
   * duas cópias da função inteira.
   */
  separadorInflacao?: string;
  /** Rótulo do impeachment no STF. A tela mostra em português, a série grava em inglês. */
  rotuloStf?: string;
}

export function extractOutcomeLabel(question: string, opcoes: OpcoesRotulo = {}): string {
  const q = question || '';
  const sepInfl = opcoes.separadorInflacao ?? '–';
  const rotuloStf = opcoes.rotuloStf ?? 'Yes (Impeachment)';

  // Faixas de inflação (Brasil)
  const inflLess = q.match(/less than (\d+\.\d+%)/);
  if (inflLess) return `< ${inflLess[1]}`;
  const inflRange = q.match(/between (\d+\.\d+%) and (\d+\.\d+%)/);
  if (inflRange) return `${inflRange[1]} ${sepInfl} ${inflRange[2]}`;
  const inflAbove = q.match(/at least (\d+\.\d+%)/);
  if (inflAbove) return `≥ ${inflAbove[1]}`;

  // ── Mercados de FAIXA (distribuição) ──────────────────────────────────────
  //
  // Vêm ANTES do padrão genérico de propósito, e são específicos o bastante
  // para não encostarem em mercado de candidato: exigem "popular vote",
  // "House seats", "Senate seats", "governorships" ou "votes cast".
  //
  // Sem eles, o genérico `Will (.+?) (win|finish|be)` devolvia "the Democratic
  // Party" para as 9 faixas democratas da margem e "there" para as 12 de
  // comparecimento, e 14 faixas viravam 3.

  // Margem do voto popular: "...by between 2% and 4%?" / "...by 16% or more?"
  const margemRange = q.match(/(Democratic|Republican) Party win the popular vote.*?by between (\d+)% and (\d+)%/);
  if (margemRange) return `${margemRange[1][0]}+${margemRange[2]}–${margemRange[3]}`;
  const margemAcima = q.match(/(Democratic|Republican) Party win the popular vote.*?by (\d+)% or more/);
  if (margemAcima) return `${margemAcima[1][0]}+${margemAcima[2]} ou mais`;

  // Cadeiras e governos.
  //
  // ⚠️ As formas com o NÚMERO NA FRENTE ("47 or fewer", "57 or more") e o número
  // único ("exactly 49") faltavam até 29/Jul, e por isso o mercado de cadeiras
  // do Senado saiu com 11 de 11 rótulos ilegíveis. "47 or fewer" INCLUI o 47,
  // então é ≤ e não <.
  const unidade = /House seats/.test(q) ? 'cad.' : /governorships/.test(q) ? 'gov.' : /Senate seats/.test(q) ? 'cad.' : null;
  if (unidade) {
    const entre = q.match(/between (\d+) and (\d+)/);
    if (entre) return `${entre[1]}–${entre[2]} ${unidade}`;
    const exato = q.match(/exactly (\d+) or (\d+)/);
    if (exato) return `${exato[1]} ou ${exato[2]} ${unidade}`;
    const exatoUnico = q.match(/exactly (\d+)/);
    if (exatoUnico) return `${exatoUnico[1]} ${unidade}`;
    const abaixo = q.match(/(?:below|fewer than|less than) (\d+)/);
    if (abaixo) return `< ${abaixo[1]} ${unidade}`;
    const abaixoPos = q.match(/(\d+) or fewer/);
    if (abaixoPos) return `≤ ${abaixoPos[1]} ${unidade}`;
    const acimaPos = q.match(/(\d+) or more/);
    if (acimaPos) return `≥ ${acimaPos[1]} ${unidade}`;
    const aoMenos = q.match(/at least (\d+)/);
    if (aoMenos) return `≥ ${aoMenos[1]} ${unidade}`;
    const acima = q.match(/(?:above|more than) (\d+)/);
    if (acima) return `> ${acima[1]} ${unidade}`;
  }

  // Comparecimento. "at least 130m" faltava e era a faixa que virava "there".
  if (/votes cast/.test(q)) {
    const entre = q.match(/between (\d+)m and (\d+)m/);
    if (entre) return `${entre[1]}–${entre[2]}m votos`;
    const menos = q.match(/less than (\d+)m/);
    if (menos) return `< ${menos[1]}m votos`;
    const aoMenos = q.match(/at least (\d+)m/);
    if (aoMenos) return `≥ ${aoMenos[1]}m votos`;
    const mais = q.match(/more than (\d+)m/);
    if (mais) return `> ${mais[1]}m votos`;
  }

  // Válvula de escape que existe em todo mercado de faixa.
  if (/any other outcome/i.test(q)) return 'Outro resultado';

  // ── Midterms EUA, mercados BINÁRIOS ───────────────────────────────────────
  // Precisam de regra própria porque o mercado do Senado tem série desde
  // 14/Abr: deixar o rótulo na mão do nome de emergência significa que qualquer
  // mudança nele parte a série em duas.
  const controle = q.match(/Will the (Democratic|Republican) Party control the (?:House|Senate)/);
  if (controle) return controle[1] === 'Democratic' ? 'Democratas' : 'Republicanos';
  if (/Midterm Elections happen as scheduled/i.test(q)) return 'Acontece no prazo';

  // Partido com mais cadeiras (Senado brasileiro): devolve a sigla.
  const partyMatch = q.match(/Will (.+?) \((\w+)\) win the most seats/);
  if (partyMatch) return partyMatch[2];

  // STF / impeachment
  if (/STF|Justice.*removed.*impeachment/i.test(q)) return rotuloStf;

  // Candidato: "Will X win/finish/be ..."
  const candMatch = q.match(/Will (.+?) (?:win|finish|be)/);
  if (candMatch) {
    const name = candMatch[1];
    if (name.includes('Carlos Roberto Massa')) return 'Ratinho Jr.';
    if (name.includes('Luiz Inácio Lula da Silva')) return 'Lula';
    return name.trim();
  }

  // Nome de emergência. Não é só o começo da pergunta: leva sufixo derivado da
  // pergunta inteira, senão duas perguntas com o mesmo início viram a mesma
  // chave e as faixas colapsam caladas.
  return `${q.slice(0, 40).trim()}…#${sufixoEstavel(q)}`;
}
