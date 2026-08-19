/**
 * Redação de segredo em mensagem de erro que vai para o CORPO da resposta.
 *
 * 🔴 Corpo de resposta é o lugar onde segredo vaza sem ninguém ver: ninguém lê
 * o JSON de erro de um cron até o dia em que precisa, e aí ele já circulou em
 * log de proxy, em captura de rede e em print de conversa.
 *
 * ⚠️ A regra existia numa rota só, `refresh-polls`, escrita em 19/Ago/2026. As
 * OUTRAS QUATRO rotas de cron devolviam `e.name + ': ' + e.message` cru. Essa
 * assimetria é o defeito: uma proteção que existe numa rota e falta na irmã é
 * pior que a ausência em todas, porque cria a impressão de que o problema foi
 * tratado. Encontrada pela auditoria EVAL de 16 eixos.
 *
 * O que sai:
 *   - `Bearer <token>`
 *   - sequência longa de hexadecimal, que é a forma de chave e de hash
 *   - valor de `token=`, `key=`, `secret=`, `password=` em query string
 *   - senha embutida em URL de conexão, `postgres://user:senha@host`
 *
 * E o texto é cortado em 300 caracteres: mensagem de driver de banco carrega
 * a string de conexão inteira quando é longa demais.
 */
export function redigirSegredo(erro: unknown, limite = 300): string {
  const bruto = erro instanceof Error ? `${erro.name}: ${erro.message}` : String(erro)
  return bruto
    .replace(/Bearer\s+\S+/gi, 'Bearer [redigido]')
    .replace(/\b[A-Fa-f0-9]{24,}\b/g, '[redigido]')
    .replace(/([?&](?:token|key|secret|password)=)[^&\s]+/gi, '$1[redigido]')
    // Senha em URL de conexão: preserva o esquema e o usuário, come a senha.
    .replace(/(\b[a-z][a-z0-9+.-]*:\/\/[^:/@\s]+:)[^@\s]+@/gi, '$1[redigido]@')
    .slice(0, limite)
}
