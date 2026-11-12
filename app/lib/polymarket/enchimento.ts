/**
 * Contrato de ENCHIMENTO da Polymarket: nome reservado para um candidato
 * futuro ("Candidate A", "Person B"...), cravado em 0,50 e sem negócio.
 *
 * Módulo único, desde 12/Nov/2026 (EVAL): a regra morava só no bootstrap da
 * coleta, e a trava de captura (`scripts/capture-guard.ts`) não a aplicava. O
 * livro firstRoundWinner da França saía certificado com 26 "preços" de 50,00.
 */
export const ENCHIMENTO = /^(?:Candidate|Person|Player|Option) [A-Z]$/;

/**
 * Só sai o que é enchimento E não tem negócio: contrato novo de verdade, mesmo
 * sem volume, continua; e enchimento que passou a ter volume também continua.
 */
export function ehEnchimento(nome: string, volume: unknown): boolean {
  return ENCHIMENTO.test(nome) && !(Number(volume) > 0);
}
