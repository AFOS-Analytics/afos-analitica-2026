import type { PolyEvent, Market } from '../types';
import { extractOutcomeLabel } from './polymarket/outcome-label';

export const partyColor: Record<string, string> = {
  PT: '#DC2626', PL: '#0F52BA', PSD: '#6B7280', Novo: '#F59E0B',
  Missão: '#8B5CF6', Rep: '#059669', Republicanos: '#059669',
};

export function getParty(candidate: string): string {
  const m = candidate.match(/\(([^)]+)\)/);
  return m ? m[1] : '';
}

export function getColor(candidate: string): string {
  const p = getParty(candidate);
  return partyColor[p] || '#94A3B8';
}

/**
 * Rótulo do desfecho para a TELA.
 *
 * ⚠️ Isto aqui era uma segunda cópia inteira da regra, e ela divergiu: quando as
 * faixas dos mercados americanos ganharam tratamento em 28 e 29/Jul, só a cópia
 * que grava a série foi corrigida. A tela continuava sem entender faixa
 * nenhuma, e mostraria a pergunta crua no dia em que a seção de mercado dos EUA
 * fosse montada. Unificado em 30/Jul: a regra mora em
 * `polymarket/outcome-label.ts` e aqui ficam só as duas diferenças de
 * APRESENTAÇÃO que sempre existiram, ambas conferidas contra o que a página do
 * Brasil já mostrava.
 */
export function extractCandidateName(question: string): string {
  return extractOutcomeLabel(question, {
    separadorInflacao: '-', // a tela sempre mostrou hífen; a série grava travessão
    rotuloStf: 'Impeachment de Ministro do STF', // a tela mostra em português
  });
}
