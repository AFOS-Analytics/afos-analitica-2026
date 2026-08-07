/**
 * PRIMITIVO ÚNICO de CPF: detectar, validar e redigir.
 *
 * ⛔ POR QUE ISTO EXISTE (07/Ago/2026): a regra vivia dentro do
 * `redigir-cpf-tse-registry.mjs`, presa ao diretório do Hugging Face, enquanto o
 * backup do Neon tinha uma detecção PRÓPRIA e mais fraca. Duas cópias da mesma
 * regra convivem sem incidente até o dia em que uma é corrigida e a outra não, e
 * foi exatamente o que aconteceu: a do backup só via CPF PONTUADO e deixou
 * passar CPF cru para o repositório público durante três meses.
 *
 * 🔴 PENDENTE, e está escrito aqui para não virar promessa esquecida: hoje quem
 * usa este primitivo são `scripts/backup-neon.ts` e `scripts/check-backup-sem-pii.ts`.
 * O `redigir-cpf-tse-registry.mjs`, do Hugging Face, AINDA tem a cópia antiga.
 * Enquanto ele não migrar, a duplicação que causou este defeito segue de pé do
 * lado do dataset.
 *
 * 🧮 O QUE SAI E O QUE FICA
 *   SAI  CPF de pessoa física (11 dígitos), pontuado ou cru.
 *   FICA CNPJ (14 dígitos), que identifica empresa e não pessoa. O TSE rotula o
 *        campo como "CNPJ/CPF" e preenche com CNPJ: redigir por RÓTULO apagaria
 *        o identificador do instituto, que é o que dá auditabilidade ao dado.
 *   FICA o NOME do estatístico, que é atuação profissional e campo próprio.
 *
 * 🔑 POR QUE DÍGITO VERIFICADOR, E NÃO "11 DÍGITOS"
 * Medido em 07/Ago/2026: dentro do backup, 884 trechos de `marketPrice` casavam
 * como "11 dígitos" e eram pedaços de número de volume; e em `researchFinding`
 * havia fragmentos de UUID com 11 dígitos seguidos. Redigir por comprimento
 * corromperia a série de preços, que é o dado insubstituível que o backup existe
 * para proteger. O dígito verificador separa CPF de coincidência numérica sem
 * depender de contexto nem de rótulo.
 */

/** CPF com os 11 dígitos iguais é inválido, e é o que mais aparece em teste. */
function digitosRepetidos(d) {
  return /^(\d)\1{10}$/.test(d)
}

/** Validação oficial pelos dois dígitos verificadores (módulo 11). */
export function cpfValido(digitos) {
  if (typeof digitos !== 'string' || digitos.length !== 11 || digitosRepetidos(digitos)) return false
  const n = digitos.split('').map(Number)
  for (const [ate, pos] of [[9, 9], [10, 10]]) {
    let soma = 0
    for (let i = 0; i < ate; i++) soma += n[i] * (ate + 1 - i)
    let dv = (soma * 10) % 11
    if (dv === 10) dv = 0
    if (dv !== n[pos]) return false
  }
  return true
}

/**
 * Percorre o texto e devolve cada CPF VÁLIDO encontrado.
 *
 * 🔴 A FRONTEIRA É DE PALAVRA, NÃO DE DÍGITO, e isso não é detalhe. Com
 * `(?<!\d)` a varredura recortava corridas de 11 dígitos de dentro de ID
 * hexadecimal (`67849220dbd00822311500a1e0e53b6`) e de UUID, e 16 delas ainda
 * passavam no dígito verificador por coincidência. Exigindo `(?<!\w)`, o número
 * só conta quando está isolado por pontuação ou espaço, que é como CPF aparece
 * em texto de gente.
 */
export function acharCpf(texto) {
  const achados = []
  const RE = /(?<!\w)(\d{3}\.\d{3}\.\d{3}-\d{2}|\d{11})(?!\w)/g
  for (const m of String(texto).matchAll(RE)) {
    const digitos = m[0].replace(/\D/g, '')
    if (!cpfValido(digitos)) continue
    achados.push({ trecho: m[0], digitos, indice: m.index })
  }
  return achados
}

/**
 * ⚠️ SEGUNDA REDE: o número ROTULADO como CPF sai mesmo com dígito verificador
 * inválido. O dígito verificador é preciso, mas rejeita CPF digitado errado, e o
 * TSE recebe texto batido à mão. Quando o próprio texto diz "CPF" logo antes do
 * número, a intenção está declarada e o erro de digitação não deve virar
 * salvo-conduto. O rótulo é exigido justamente para isto não voltar a acusar
 * número solto.
 */
const ROTULADO = /(CPF|C\.P\.F)[\s:.ºon°-]{0,8}(?<!\w)(\d{3}\.\d{3}\.\d{3}-\d{2}|\d{11})(?!\w)/gi

/** Troca todo CPF pelo marcador: válido pelo dígito, ou rotulado no texto. */
export function redigirCpf(texto, marcador = '[CPF removido]') {
  let n = 0
  let saida = String(texto).replace(/(?<!\w)(\d{3}\.\d{3}\.\d{3}-\d{2}|\d{11})(?!\w)/g, (m) => {
    if (!cpfValido(m.replace(/\D/g, ''))) return m
    n++
    return marcador
  })
  saida = saida.replace(ROTULADO, (m, rot, num) => {
    n++
    return m.replace(num, marcador)
  })
  return { saida, n }
}
