/**
 * check-json-structure.ts — portão de ESTRUTURA para os JSONs editoriais.
 *
 * POR QUE ELE EXISTE
 * Em 07/Ago/2026 dois arrays de 5 itens (`candidates[3].fortes` e `.fracos`)
 * sumiram de `analysis-criteriosa.json` ao reescrever o arquivo inteiro, e
 * foram para produção nos três idiomas. Os quatro portões existentes passaram
 * verde, e a frase que resume é sempre a mesma:
 *
 *   ⭐ ONDE NÃO SOBROU NÚMERO, NÃO HÁ DIVERGÊNCIA PARA ACUSAR.
 *
 * Todo gate do AFOS compara VALOR com VALOR. Este defeito não tem valor
 * nenhum, tem AUSÊNCIA. Ver memory/feedback_bloco_inteiro_some_do_json_e_
 * nenhum_portao_ve.md.
 *
 * AS TRÊS RÉGUAS, e por que são três
 *
 *  1. IDENTIDADE — o MESMO elemento, casado por um campo de identidade entre
 *     o HEAD e o disco, perdeu uma chave que ELE tinha. Pega exatamente o caso
 *     de 07/Ago, em que UM candidato de quatro ficou sem `fortes`/`fracos`.
 *
 *     ⚠️ A primeira versão desta régua comparava o elemento com os IRMÃOS
 *     ("perdeu chave que a maioria tem") e foi DESCARTADA no ensaio: acusou
 *     7 veículos de `us-press-data.json` que não têm `feed`, e eles nunca
 *     tiveram, nem no HEAD. Chave opcional entre irmãos é normal; chave que
 *     o próprio elemento PERDEU não é. A régua tem que olhar o elemento
 *     contra ele mesmo no passado, não contra os vizinhos.
 *
 *  2. FORMA — caminho de forma que existia no HEAD e sumiu. Pega o bloco
 *     inteiro desaparecendo, inclusive quando TODOS os elementos o perdem
 *     junto, que é o ponto cego da régua 1.
 *     ⚠️ Índice de array é normalizado para `[]` de propósito. Sem isso,
 *     `polls[14].note` acusaria toda semana, porque pesquisa velha SAI do
 *     painel por frescor e a lista encolhe legitimamente.
 *
 *  3. LOCALES — o pt-BR, o .en e o .es têm que ter a MESMA forma. Pega a
 *     tradução que derrubou um bloco sem derrubar número nenhum.
 *
 * Uso:
 *   npx tsx scripts/check-json-structure.ts                 # arquivos staged
 *   npx tsx scripts/check-json-structure.ts --all           # todos os alvos
 *   npx tsx scripts/check-json-structure.ts public/x.json   # arquivo avulso
 */

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

// JSONs editoriais: carregam prosa e blocos nomeados. Os de dado puro ficam
// de fora porque lá a ausência de campo já aparece como número faltando.
const ALVOS = [
  'public/analysis-criteriosa.json',
  'public/analysis-data.json',
  'public/polls-data.json',
  'public/us-polls-data.json',
  'public/us-press-data.json',
]

const LOCALES = ['en', 'es']

// Campos que servem para casar o MESMO elemento entre o HEAD e o disco.
// Testados nesta ordem; vale o primeiro que for único em todos os elementos.
const CAMPOS_DE_IDENTIDADE = ['name', 'nome', 'register', 'protocolo', 'contract', 'slug', 'id', 'casa', 'label', 'question', 'key', 'rank']

type Achado = { arquivo: string; regra: string; caminho: string; detalhe: string }

const achados: Achado[] = []

/** Caminhos de FORMA: índice de array vira `[]`, então rotação de lista não acusa. */
function caminhosDeForma(v: unknown, prefixo = '', acc = new Set<string>()): Set<string> {
  if (Array.isArray(v)) {
    for (const item of v) caminhosDeForma(item, `${prefixo}[]`, acc)
  } else if (v && typeof v === 'object') {
    for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
      const p = prefixo ? `${prefixo}.${k}` : k
      acc.add(p)
      caminhosDeForma(val, p, acc)
    }
  }
  return acc
}

/** Acha um campo que identifique cada elemento sem ambiguidade. null se não houver. */
function campoDeIdentidade(arr: unknown[]): string | null {
  const objetos = arr.filter((x) => x && typeof x === 'object' && !Array.isArray(x)) as Record<string, unknown>[]
  if (objetos.length === 0 || objetos.length !== arr.length) return null
  for (const campo of CAMPOS_DE_IDENTIDADE) {
    if (!objetos.every((o) => typeof o[campo] === 'string' || typeof o[campo] === 'number')) continue
    const vals = objetos.map((o) => String(o[campo]))
    if (new Set(vals).size === vals.length) return campo
  }
  return null
}

/**
 * Régua 1: o MESMO elemento perdeu uma chave que ele tinha no HEAD.
 * Percorre as duas árvores em paralelo. Elemento que não existe mais no disco
 * é rotação legítima e NÃO é acusado; só a perda de chave dentro de um
 * elemento que sobreviveu conta.
 */
function regraIdentidade(antes: unknown, depois: unknown, arquivo: string, prefixo = ''): void {
  if (Array.isArray(antes) && Array.isArray(depois)) {
    const campo = campoDeIdentidade(antes) && campoDeIdentidade(depois) ? campoDeIdentidade(depois) : null
    if (campo) {
      const mapaDepois = new Map<string, Record<string, unknown>>()
      for (const o of depois as Record<string, unknown>[]) mapaDepois.set(String(o[campo]), o)
      for (const o of antes as Record<string, unknown>[]) {
        const id = String(o[campo])
        const novo = mapaDepois.get(id)
        if (!novo) continue // saiu da lista: rotação, não é perda de chave
        // NÃO acusar aqui: quem reporta chave faltando é o ramo de objeto,
        // logo abaixo. Acusar nos dois lugares reportava cada defeito 2x.
        regraIdentidade(o, novo, arquivo, `${prefixo}[${campo}=${id}]`)
      }
    } else if (antes.length === depois.length) {
      // sem identidade, só compara quando a lista não mudou de tamanho
      antes.forEach((o, i) => regraIdentidade(o, depois[i], arquivo, `${prefixo}[${i}]`))
    }
  } else if (antes && typeof antes === 'object' && depois && typeof depois === 'object' && !Array.isArray(antes) && !Array.isArray(depois)) {
    const a = antes as Record<string, unknown>, d = depois as Record<string, unknown>
    for (const k of Object.keys(a)) {
      const p = prefixo ? `${prefixo}.${k}` : k
      if (!(k in d)) achados.push({ arquivo, regra: 'IDENTIDADE', caminho: p, detalhe: 'existia no HEAD e sumiu' })
      else regraIdentidade(a[k], d[k], arquivo, p)
    }
  }
}

/**
 * ⚠️ AUSÊNCIA e FALHA DE LEITURA não podem dar a mesma tela.
 *
 * A primeira versão engolia todo erro do `git show` e devolvia null, que o
 * resto do código lia como "arquivo novo, sem histórico". No ensaio isso
 * apagou as DUAS réguas de histórico nos cinco arquivos de uma vez e o portão
 * imprimiu ✅. A causa era boba: o `git` não está no PATH do PowerShell, e o
 * node herdou esse PATH. Sob o hook o shell é o `sh` do git e funciona, então
 * o defeito só apareceria em execução manual, calado, para sempre.
 *
 * Agora: caminho inexistente no HEAD devolve null; QUALQUER outro erro mata o
 * processo com a mensagem do git.
 */
function lerHead(rel: string): unknown | null {
  let raw: string
  try {
    raw = execSync(`git show HEAD:${rel}`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
  } catch (e) {
    const err = (e as { stderr?: Buffer | string; message?: string })
    const msg = String(err.stderr ?? err.message ?? e)
    // git diz isto quando o caminho simplesmente não existe naquele commit
    if (/exists on disk, but not in|does not exist in|path .* does not exist/i.test(msg)) return null
    console.error(`\n❌ check-json-structure: não consegui ler ${rel} do HEAD.`)
    console.error(`   ${msg.trim().split('\n')[0]}`)
    console.error('   Isto é FALHA DE LEITURA, não ausência de histórico, e o portão')
    console.error('   não pode passar verde sem as réguas de histórico. Rode num shell')
    console.error('   com o git no PATH (o Git Bash, ou o próprio hook).')
    process.exit(2)
  }
  try {
    return JSON.parse(raw)
  } catch (e) {
    console.error(`\n❌ check-json-structure: versão de ${rel} no HEAD não é JSON válido: ${(e as Error).message}`)
    process.exit(2)
  }
}

function lerDisco(rel: string): unknown | null {
  const abs = path.resolve(rel)
  if (!fs.existsSync(abs)) return null
  try {
    return JSON.parse(fs.readFileSync(abs, 'utf8'))
  } catch (e) {
    achados.push({ arquivo: rel, regra: 'PARSE', caminho: '(arquivo)', detalhe: `JSON inválido: ${(e as Error).message}` })
    return null
  }
}

function variantes(rel: string): string[] {
  const base = rel.replace(/\.json$/, '')
  return LOCALES.map((l) => `${base}.${l}.json`).filter((f) => fs.existsSync(path.resolve(f)))
}

function confere(rel: string): void {
  const atual = lerDisco(rel)
  if (atual === null) return

  const head = lerHead(rel)
  if (head !== null) {
    // 1. identidade: elemento que sobreviveu e perdeu chave
    regraIdentidade(head, atual, rel)

    // 2. forma: caminho normalizado que sumiu
    const antes = caminhosDeForma(head)
    const depois = caminhosDeForma(atual)
    const jaAcusado = new Set(achados.map((a) => a.caminho))
    for (const c of antes) {
      if (!depois.has(c) && !jaAcusado.has(c)) {
        achados.push({ arquivo: rel, regra: 'FORMA', caminho: c, detalhe: 'existia no HEAD e sumiu' })
      }
    }
  } else {
    console.log(`   (${path.basename(rel)}: sem versão no HEAD, réguas de histórico não se aplicam)`)
  }

  // 3. paridade de forma entre locales
  const irmasLocale = variantes(rel)
  if (irmasLocale.length > 0) {
    const formaBase = caminhosDeForma(atual)
    for (const f of irmasLocale) {
      const outro = lerDisco(f)
      if (outro === null) continue
      const formaOutro = caminhosDeForma(outro)
      for (const c of formaBase) {
        if (!formaOutro.has(c)) {
          achados.push({ arquivo: f, regra: 'LOCALE', caminho: c, detalhe: `existe em ${path.basename(rel)} e falta aqui` })
        }
      }
    }
  }
}

function stagedAlvos(): string[] {
  try {
    const out = execSync('git diff --cached --name-only --diff-filter=ACM', { encoding: 'utf8' })
    const staged = out.split('\n').map((s) => s.trim()).filter(Boolean)
    // um .en.json staged puxa a conferência do pt-BR, que é a fonte da forma
    const base = new Set<string>()
    for (const s of staged) {
      const semLocale = s.replace(/\.(en|es)\.json$/, '.json')
      if (ALVOS.includes(semLocale)) base.add(semLocale)
    }
    return [...base]
  } catch {
    return []
  }
}

function main(): void {
  const args = process.argv.slice(2)
  let arquivos: string[]

  if (args.includes('--all')) arquivos = ALVOS.filter((f) => fs.existsSync(path.resolve(f)))
  else if (args.length > 0 && !args[0].startsWith('--')) arquivos = args
  else arquivos = stagedAlvos()

  if (arquivos.length === 0) {
    console.log('🔍 check-json-structure: nenhum JSON editorial no escopo. Nada a fazer.')
    process.exit(0)
  }

  console.log(`🔍 check-json-structure: ${arquivos.length} arquivo(s) — ${arquivos.map((f) => path.basename(f)).join(', ')}`)

  for (const f of arquivos) confere(f)

  if (achados.length === 0) {
    console.log('✅ estrutura íntegra: nenhum bloco sumiu, nenhum irmão ficou sem chave, locales em paridade.')
    process.exit(0)
  }

  console.log('')
  console.log(`❌ ${achados.length} defeito(s) de ESTRUTURA:`)
  const porArquivo: Record<string, Achado[]> = {}
  for (const a of achados) (porArquivo[a.arquivo] ||= []).push(a)
  for (const [arq, lista] of Object.entries(porArquivo)) {
    console.log(`\n  ${arq}`)
    for (const a of lista) console.log(`    [${a.regra}] ${a.caminho} — ${a.detalhe}`)
  }
  console.log('')
  console.log('   Isto é ausência, não divergência: nenhum portão de VALOR pega.')
  console.log('   Ver memory/feedback_bloco_inteiro_some_do_json_e_nenhum_portao_ve.md')
  process.exit(1)
}

main()
