/**
 * Casos plantados para a rota até o backup do dia.
 *
 * 🔑 Metade anti-silêncio e metade anti-excesso. As duas direções de erro aqui
 * são caras de maneiras opostas: dizer PULL quando o merge aborta entrega uma
 * instrução inexecutável, e dizer PARAR quando há saída segura trava a esteira
 * por nada.
 *
 *   node scripts/testar-rota-do-backup.mjs
 */
import { rotaDoBackup, ROTAS, ehDoBackup } from '../lib/rota-do-backup.mjs'

let ok = 0
const falhas = []
const caso = (nome, cond) => (cond ? ok++ : falhas.push(nome))
const HOJE = '2026-10-06'
const r = (e) => rotaDoBackup({ hoje: HOJE, ...e })

// ───────────────── os cinco estados ─────────────────

caso('AQUI quando o commit de hoje está nesta árvore', r({ local: HOJE, remoto: HOJE }).rota === ROTAS.AQUI)
caso('AQUI mesmo se o remoto não tiver nada', r({ local: HOJE, remoto: null }).rota === ROTAS.AQUI)
caso('ESPERAR quando ninguém tem o de hoje', r({ local: '2026-10-05', remoto: '2026-10-05' }).rota === ROTAS.ESPERAR)
caso('INDETERMINADO quando não deu para olhar', r({ local: null, remoto: null }).rota === ROTAS.INDETERMINADO)
caso('INDETERMINADO sem a data de hoje', rotaDoBackup({ local: null, remoto: null }).rota === ROTAS.INDETERMINADO)

caso(
  'PULL quando está no remoto e nada colide',
  r({ local: '2026-10-05', remoto: HOJE, deEntrada: ['backup/neon/x.gz', 'a.ts'], sujos: ['b.ts'] }).rota === ROTAS.PULL,
)
caso(
  'SO_BACKUP quando colide e backup/neon está limpo',
  r({ local: '2026-10-05', remoto: HOJE, deEntrada: ['a.ts', 'backup/neon/x.gz'], sujos: ['a.ts'] }).rota === ROTAS.SO_BACKUP,
)
caso(
  'PARAR quando colide e backup/neon está SUJO',
  r({ local: '2026-10-05', remoto: HOJE, deEntrada: ['a.ts'], sujos: ['a.ts', 'backup/neon/x.gz'] }).rota === ROTAS.PARAR,
)

// ───────────────── o caso REAL de 06/Out ─────────────────
//
// 47 caminhos de entrada, 34 sujos, 30 colidindo, backup/neon limpo, e o
// `git merge` de teste abortou exatamente como a conta previa.
{
  const deEntrada = ['backup/neon/marketPrice/2026-10.csv.gz', ...Array.from({ length: 46 }, (_, i) => `x${i}.ts`)]
  const sujos = Array.from({ length: 30 }, (_, i) => `x${i}.ts`)
  const res = r({ local: '2026-10-05', remoto: HOJE, deEntrada, sujos })
  caso('o caso real de 06/Out dá SO_BACKUP', res.rota === ROTAS.SO_BACKUP)
  caso('e conta as 30 colisões', res.colidem.length === 30)
  caso('e o motivo diz que a saída é segura por construção', /por construção/.test(res.motivo))
}

// ───────────────── ANTI-EXCESSO ─────────────────

caso(
  'ANTI-EXCESSO: sujo que o merge NÃO escreve não colide',
  r({ local: '2026-10-05', remoto: HOJE, deEntrada: ['a.ts'], sujos: ['z.ts'] }).rota === ROTAS.PULL,
)
caso(
  'ANTI-EXCESSO: entrada que NÃO está suja não colide',
  r({ local: '2026-10-05', remoto: HOJE, deEntrada: ['a.ts', 'b.ts'], sujos: [] }).rota === ROTAS.PULL,
)
caso('ANTI-EXCESSO: listas vazias dão PULL, não PARAR', r({ local: '2026-10-05', remoto: HOJE }).rota === ROTAS.PULL)
caso(
  'ANTI-EXCESSO: colisão repetida conta UMA vez',
  r({ local: '2026-10-05', remoto: HOJE, deEntrada: ['a.ts'], sujos: ['a.ts', 'a.ts'] }).colidem.length === 1,
)
caso(
  'ANTI-EXCESSO: entrada não-texto é ignorada',
  r({ local: '2026-10-05', remoto: HOJE, deEntrada: [null, '', 'a.ts'], sujos: [undefined, 'a.ts'] }).colidem.length === 1,
)

// 🔴 A ARMADILHA DO PREFIXO, que a primeira versão desta regra tinha:
//    `startsWith('backup/neon')` casa `backup/neonologia/`, que é outra pasta.
caso('prefixo: backup/neon é do backup', ehDoBackup('backup/neon') === true)
caso('prefixo: backup/neon/x.gz é do backup', ehDoBackup('backup/neon/x.gz') === true)
caso('🔴 prefixo: backup/neonologia/x NÃO é do backup', ehDoBackup('backup/neonologia/x') === false)
caso('🔴 prefixo: backup/neon-antigo/x NÃO é do backup', ehDoBackup('backup/neon-antigo/x') === false)
caso('prefixo: outro caminho não é do backup', ehDoBackup('public/us-polls-data.json') === false)
caso('prefixo: entrada não-texto não é do backup', ehDoBackup(null) === false)

caso(
  '🔴 ANTI-EXCESSO: vizinho de prefixo sujo NÃO vira PARAR',
  r({ local: '2026-10-05', remoto: HOJE, deEntrada: ['a.ts'], sujos: ['a.ts', 'backup/neonologia/x'] }).rota === ROTAS.SO_BACKUP,
)

// ───────── 🔑 AQUI_SEM_COMMIT: o buraco que a propria regua tinha ─────────
//
// Achado em 06/Out ao USAR a regua: ela media COMMIT e o remedio que ela
// recomenda muda o WORKING TREE sem commitar. O dataset le ARQUIVO.

caso(
  'AQUI_SEM_COMMIT quando a arvore bate com o remoto',
  r({ local: '2026-10-05', remoto: HOJE, arvoreBateComRemoto: true, deEntrada: ['a'], sujos: ['a'] }).rota === ROTAS.AQUI_SEM_COMMIT,
)
caso(
  'e ele VENCE o SO_BACKUP, porque a pergunta e sobre arquivo',
  r({ local: '2026-10-05', remoto: HOJE, arvoreBateComRemoto: true, deEntrada: ['a'], sujos: ['a'] }).rota !== ROTAS.SO_BACKUP,
)
caso(
  'ANTI-EXCESSO: arvore que NAO bate volta a SO_BACKUP',
  r({ local: '2026-10-05', remoto: HOJE, arvoreBateComRemoto: false, deEntrada: ['a'], sujos: ['a'] }).rota === ROTAS.SO_BACKUP,
)
caso(
  'ANTI-EXCESSO: sem a medida (null) NAO assume que bate',
  r({ local: '2026-10-05', remoto: HOJE, arvoreBateComRemoto: null, deEntrada: ['a'], sujos: ['a'] }).rota === ROTAS.SO_BACKUP,
)
caso(
  'ANTI-EXCESSO: arvore batendo com remoto SEM o de hoje nao basta',
  r({ local: '2026-10-05', remoto: '2026-10-05', arvoreBateComRemoto: true }).rota === ROTAS.ESPERAR,
)
caso('o commit AQUI ainda vence tudo', r({ local: HOJE, remoto: HOJE, arvoreBateComRemoto: false }).rota === ROTAS.AQUI)

// ───────────────── CONTROLE POSITIVO ─────────────────

caso('CONTROLE POSITIVO: a régua sabe dizer PARAR', r({ local: '2026-10-05', remoto: HOJE, deEntrada: ['a'], sujos: ['a', 'backup/neon/y'] }).rota === ROTAS.PARAR)
caso('CONTROLE POSITIVO: a régua sabe dizer PULL', r({ local: '2026-10-05', remoto: HOJE, deEntrada: ['a'], sujos: [] }).rota === ROTAS.PULL)
caso('CONTROLE POSITIVO: as 7 rotas são distintas', new Set(Object.values(ROTAS)).size === 7)

console.log(`\n🧷 ROTA DO BACKUP · ${ok + falhas.length} asserções`)
if (falhas.length) {
  console.log(`\n❌ ${falhas.length} FALHA(S):`)
  for (const f of falhas) console.log('   · ' + f)
  console.log(`\nVEREDITO: REPROVADO (${ok} passaram)`)
  process.exit(1)
}
console.log(`   ✅ ${ok} de ${ok}`)
console.log('\nVEREDITO: APROVADO')
