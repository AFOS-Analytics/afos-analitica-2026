/**
 * Silêncio eleitoral da França: a lei de 1977 (art. 11) proíbe publicar,
 * difundir ou comentar pesquisa no sábado e no domingo de cada turno, até o
 * fechamento da última urna da França continental. Multa de € 75 mil.
 *
 * O painel congela pesquisa E preço nessa janela (decisão do estudo de
 * 08/Nov/2026: preço de mercado provavelmente não é "pesquisa", mas nunca foi
 * testado, e o código eleitoral também proíbe propaganda a partir do sábado).
 *
 * ⏰ Instantes em UTC, escritos à mão de propósito. Abril e maio são horário de
 * verão em Paris (UTC+2): sábado 00:00 em Paris = sexta 22:00 UTC; domingo 20:00
 * em Paris (última urna de cidade grande) = domingo 18:00 UTC. Calcular fuso em
 * tempo de execução é o tipo de conta que erra calada.
 */

export const JANELAS_DE_SILENCIO: readonly { turno: 1 | 2; inicio: string; fim: string }[] = [
  { turno: 1, inicio: '2027-04-16T22:00:00Z', fim: '2027-04-18T18:00:00Z' },
  { turno: 2, inicio: '2027-04-30T22:00:00Z', fim: '2027-05-02T18:00:00Z' },
]

export function emSilencioEleitoral(agora: Date): { silencio: boolean; turno?: 1 | 2; ate?: string } {
  const t = agora.getTime()
  for (const j of JANELAS_DE_SILENCIO) {
    if (t >= Date.parse(j.inicio) && t < Date.parse(j.fim)) return { silencio: true, turno: j.turno, ate: j.fim }
  }
  return { silencio: false }
}
