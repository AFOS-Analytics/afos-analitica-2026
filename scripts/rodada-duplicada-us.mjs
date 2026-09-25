/**
 * 🧬 A MESMA RODADA SOB DOIS NOMES DE CASA, no generic ballot dos EUA.
 *
 * A regra mora em `lib/us-polls/duplicata-de-rodada.mjs`, com casos plantados em
 * `scripts/testar-duplicata-us.mjs`. Aqui é só leitura e impressão.
 *
 * ⛔ NÃO remove linha e NÃO decide qual nome fica: isso é mudar a PROCEDÊNCIA e
 * segue decisão do André, par a par. Quando ele decide, a decisão vira entrada
 * declarada em `lib/us-polls/casa-canonica.mjs`, que é quem a média consulta, e
 * o par passa a sair aqui como 🧬 RESOLVIDA em vez de dívida aberta.
 *
 * Saída 1 quando existe par NÃO CONFERIDO dentro da janela da média, porque aí
 * o número publicado conta uma casa duas vezes. Par já conferido sai do
 * contador e continua impresso.
 *
 * Uso: node scripts/rodada-duplicada-us.mjs [--arquivo=public/us-polls-data.json]
 */
import { readFileSync } from 'fs'
import { duplicatas, conferirCarga, DUPLICATA_CONFERIDA } from '../lib/us-polls/duplicata-de-rodada.mjs'
import { conferirCarga as conferirCasas } from '../lib/us-polls/casas.mjs'
import { media } from '../lib/us-polls/collect.mjs'

const arg = (n) => process.argv.find((a) => a.startsWith(`--${n}=`))?.slice(n.length + 3)
const ARQ = arg('arquivo') ?? 'public/us-polls-data.json'
const DIAS = Number(arg('dias') ?? 30)

const erros = [...conferirCarga(), ...conferirCasas()]
if (erros.length) {
  console.error('❌ registro INVÁLIDO (duplicatas conferidas ou casas canônicas), nada foi medido:')
  erros.forEach((e) => console.error('   ' + e))
  process.exit(2)
}

let a
try {
  a = JSON.parse(readFileSync(ARQ, 'utf8'))
} catch (e) {
  console.error(`❌ não li ${ARQ}: ${e.message}`)
  process.exit(2)
}

console.log(`\n🧬 MESMA RODADA SOB DOIS NOMES  [USO INTERNO, nao publicar]`)
console.log(`   arquivo ${ARQ} · ${a.polls?.length ?? 0} linhas · janela de ${DIAS} dias\n`)

const grupos = duplicatas(a.polls)
// 🔑 O registro da média grava o nome CANÔNICO, com o do índice ao lado quando
// houve colapso. Casar pelo canônico aqui diria "fora da média" para a linha que
// ESTÁ nela sob outro rótulo, que é o defeito que este script existe para achar.
const naMedia = new Set(
  (a.mediaAfos?.incluidas ?? []).map((x) => `${x.institutoNoIndice ?? x.instituto}|${x.campoFim}|${x.amostraTipo ?? ''}`)
)
const dentro = (l) => naMedia.has(`${l.instituto}|${l.campoFim}|${l.amostraTipo ?? ''}`)

if (!grupos.length) {
  console.log('   ✅ nenhuma assinatura de rodada aparece sob mais de um nome de casa.\n')
  process.exit(0)
}

// 🔑 DUAS perguntas diferentes, e misturá-las foi o que deixou a saída mentir na
// primeira versão: `dentro()` diz o que o ARQUIVO publicou, e `fica()` diz o que
// a REGRA de hoje mantém. Enquanto o arquivo não é regerado, os dois lados de um
// par aparecem como "NA MEDIA", e é verdade: é o que está no ar.
const agoraP = new Date()
const previa = media(a.polls, DIAS, agoraP)
const ficam = new Set(
  (previa?.incluidas ?? []).map((x) => `${x.institutoNoIndice ?? x.instituto}|${x.campoFim}|${x.amostraTipo ?? ''}`)
)
const fica = (l) => ficam.has(`${l.instituto}|${l.campoFim}|${l.amostraTipo ?? ''}`)

let porConferir = 0
let resolvidos = 0
for (const g of grupos) {
  const nsDentro = g.linhas.filter(dentro)
  const marca = g.resolvida
    ? '🧬 RESOLVIDA'
    : g.conferida
      ? '📒 CONFERIDA'
      : g.classe === 'IDENTICA'
        ? '🔴 IDENTICA'
        : '⚠️  DIVERGE'
  const [ini, fim, amo, rec] = g.assinatura.split('|')
  console.log(`   ${marca}  campo ${ini} a ${fim} · ${amo || 'sem amostra'} ${rec}`)
  for (const l of g.linhas) {
    const sinal = l.vantagemDem >= 0 ? 'D+' : 'R+'
    const naJanela = l.campoFim >= previa.desde
    const regra = !naJanela ? '  ----  ' : fica(l) ? '🧬 FICA ' : '   sai  '
    console.log(
      `       ${(sinal + Math.abs(l.vantagemDem).toFixed(2)).padStart(8)}  ${dentro(l) ? 'NA MEDIA' : '  fora  '}  ${regra}  ${l.instituto}`
    )
  }
  if (g.resolvida) {
    resolvidos++
    console.log(`       🧬 a tabela declarada diz que os dois nomes sao a casa "${g.casaCanonica[0]}"`)
    if (g.linhas.some((l) => fica(l))) {
      console.log(`          a media conta a casa UMA vez, e a linha que ela mantem esta marcada FICA`)
    } else if (g.linhas.some((l) => l.campoFim >= previa.desde)) {
      // ⚠️ Nenhuma FICA e todas na janela: a rodada entra pela casa canonica com
      // OUTRO recorte, tipicamente o LV do mesmo campo. Nao dizer "a que fica
      // esta marcada" aqui, porque nao esta, e a frase mandaria procurar nada.
      console.log(`          nenhuma linha DESTE recorte fica: a rodada entra pelo recorte de cima`)
    }
    if (g.linhas.some((l) => dentro(l) && !fica(l))) {
      console.log(`          ⚠️  o ARQUIVO no disco ainda publica as duas: regerar a coleta e republicar`)
    }
  } else if (nsDentro.length > 1 && !g.conferida) {
    porConferir++
    console.log(`       🔴 a casa entra ${nsDentro.length}x na media de hoje`)
    console.log(`          decidir qual nome fica e declarar em lib/us-polls/casa-canonica.mjs`)
    console.log(`          se os nomes forem casas DIFERENTES, declarar em lib/us-polls/duplicata-de-rodada.mjs`)
  } else if (nsDentro.length > 1) {
    console.log(`       📒 entra ${nsDentro.length}x na media, e isso ja foi conferido e declarado`)
  }
  console.log('')
}

// 📊 O PREÇO DA TABELA, medido DESLIGANDO a tabela na propria media, e nunca com
// um filtro escrito aqui.
//
// 🔴 Foi essa segunda copia da regra que errou em 25/Set/2026. O filtro tirava a
// linha duplicada e a casa CAIA para outro recorte em vez de sumir, porque o
// outro recorte dela continuava no arquivo: o "sem as identicas D+7.89" daquela
// passada nao era o publicado nem o corrigido, era um terceiro mundo.
const com = previa
const sem = media(a.polls, DIAS, agoraP, [])
const dpp = (x, y) => ((x - y >= 0 ? '+' : '') + (x - y).toFixed(2) + 'pp').padStart(8)
console.log(`   📊 o que a tabela de casas canonicas muda no numero`)
console.log(`      com a tabela (o que vai ao ar)   D+${com.vantagemDem.toFixed(2)} · D ${com.dem.toFixed(2)} R ${com.rep.toFixed(2)} · ${com.nPesquisas} rodadas · ${com.nInstitutos} institutos`)
console.log(`      sem a tabela (nome do indice)    D+${sem.vantagemDem.toFixed(2)} · D ${sem.dem.toFixed(2)} R ${sem.rep.toFixed(2)} · ${sem.nPesquisas} rodadas · ${sem.nInstitutos} institutos`)
console.log(`      diferenca                        ${dpp(com.vantagemDem, sem.vantagemDem)} na vantagem · ${dpp(com.dem, sem.dem)} em D · ${dpp(com.rep, sem.rep)} em R`)
if (com.vantagemDem === sem.vantagemDem && com.nPesquisas !== sem.nPesquisas) {
  console.log(`      ⚠️  a VANTAGEM nao se move e o NIVEL sim: as duplicatas tinham margem`)
  console.log(`         parecida com a da casa, entao o defeito custava contagem de institutos`)
  console.log(`         e nivel de D e R, e nao o numero que vira manchete. Isso e propriedade`)
  console.log(`         DESTE dia, nao da regra: amanha a mesma duplicata pode mover a vantagem.`)
}
console.log('')
console.log(`   ⛔ NADA foi removido do arquivo. \`polls[]\` e a transcricao do indice e segue inteira.`)
console.log(`   📌 IDENTICA e mesma rodada sob dois nomes, tipicamente quem EXECUTA e quem`)
console.log(`      ENCOMENDA. DIVERGE e mesma onda com valores diferentes, que pode ser`)
console.log(`      segunda via declarada e precisa de olho humano.
`)

if (resolvidos) console.log(`🧬 ${resolvidos} par(es) resolvido(s) pela tabela declarada de casas`)
console.log(porConferir ? `🔴 ${porConferir} par(es) NAO conferido(s) dentro da media` : '✅ nenhum par por conferir dentro da media')
process.exit(porConferir ? 1 : 0)
