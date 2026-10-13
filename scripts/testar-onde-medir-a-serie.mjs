/**
 * 🧪 Casos de `scripts/lib/onde-medir-a-serie.mjs`.
 *
 * 📐 Metade anti-silêncio (o estado que manda trocar de árvore tem de ACENDER) e
 * metade anti-excesso, porque o erro simétrico deste conserto é um aviso que
 * dispara sempre e manda trocar de árvore para ver o mesmo backup.
 */
import { ONDE, decidir, diaValido, diferencaEmDias, linhaDoVeredito } from './lib/onde-medir-a-serie.mjs'

let ok = 0
let falhou = 0
const eq = (nome, a, b) => {
  const bateu = JSON.stringify(a) === JSON.stringify(b)
  if (bateu) ok++
  else { falhou++; console.log(`   ❌ ${nome}\n      esperado ${JSON.stringify(b)}\n      recebido ${JSON.stringify(a)}`) }
}
const contem = (nome, texto, agulha) => {
  const bateu = typeof texto === 'string' && texto.includes(agulha)
  if (bateu) ok++
  else { falhou++; console.log(`   ❌ ${nome}: "${agulha}" não está em "${texto}"`) }
}

// ── a FORMA da data ────────────────────────────────────────────────────
eq('dia ISO vale', diaValido('2026-10-12'), true)
eq('string vazia do git NAO vale', diaValido(''), false)
eq('o "(nenhuma)" do chamador antigo NAO vale', diaValido('(nenhuma)'), false)
eq('data sem zero a esquerda NAO vale', diaValido('2026-1-2'), false)
eq('carimbo completo NAO vale, porque a comparacao e por DIA', diaValido('2026-10-12T21:30:35Z'), false)
eq('null nao quebra', diaValido(null), false)
eq('numero nao passa por string', diaValido(20261012), false)

// ── diferenca em dias ──────────────────────────────────────────────────
eq('3 dias', diferencaEmDias('2026-10-09', '2026-10-12'), 3)
eq('zero', diferencaEmDias('2026-10-12', '2026-10-12'), 0)
eq('atravessa o mes', diferencaEmDias('2026-09-30', '2026-10-01'), 1)
eq('data torta devolve null, nunca 0', diferencaEmDias('ontem', '2026-10-01'), null)

// ── AQUI: nao mandar trocar de arvore de graca (anti-excesso) ──────────
{
  const v = decidir({ aqui: { caminho: '/principal', dia: '2026-10-12' }, arvores: [{ caminho: '/destacada', dia: '2026-10-12' }], remoto: '2026-10-12' })
  eq('empate resolve a favor de AQUI', v.onde, ONDE.AQUI)
  eq('empate: atraso zero', v.atrasoDias, 0)
}
{
  const v = decidir({ aqui: { caminho: '/principal', dia: '2026-10-12' }, arvores: [{ caminho: '/destacada', dia: '2026-10-09' }], remoto: '2026-10-09' })
  eq('arvore mais VELHA nao desvia a medicao', v.onde, ONDE.AQUI)
}
{
  const v = decidir({ aqui: { caminho: '/principal', dia: '2026-10-12' }, arvores: [], remoto: null })
  eq('sem outras arvores e sem remoto, mede aqui', v.onde, ONDE.AQUI)
}

// ── OUTRA_ARVORE: o caso de 13/Out (anti-silencio) ────────────────────
{
  const v = decidir({
    aqui: { caminho: 'C:/.../AFOS-Analitica-2026', dia: '2026-10-09' },
    arvores: [{ caminho: 'C:/temp/afos-arvore-completa', dia: '2026-10-12' }],
    remoto: '2026-10-12',
  })
  eq('o caso real ACENDE', v.onde, ONDE.OUTRA_ARVORE)
  eq('e nomeia o caminho, nao so o estado', v.caminho, 'C:/temp/afos-arvore-completa')
  eq('e mede o atraso', v.atrasoDias, 3)
  contem('⛔ e PROIBE o conselho errado de regerar', v.acao, 'NÃO é caso de regerar backup')
  contem('a linha impressa nomeia o estado', linhaDoVeredito(v), 'OUTRA_ARVORE')
  contem('a linha impressa diz o atraso', linhaDoVeredito(v), '3 dia(s) atrás')
}
{
  // 🔑 com TRES arvores, vence a mais nova, e nao a primeira da lista
  const v = decidir({
    aqui: { caminho: '/a', dia: '2026-10-01' },
    arvores: [{ caminho: '/b', dia: '2026-10-05' }, { caminho: '/c', dia: '2026-10-11' }, { caminho: '/d', dia: '2026-10-03' }],
    remoto: '2026-10-11',
  })
  eq('escolhe a MAIS NOVA entre varias', v.caminho, '/c')
  eq('atraso contra a melhor, nao contra a primeira', v.atrasoDias, 10)
}
{
  // ⚠️ a propria arvore aparecendo na lista de "outras" nao pode virar conselho
  // de trocar para ela mesma: o `git worktree list` inclui a atual
  const v = decidir({ aqui: { caminho: '/a', dia: '2026-10-12' }, arvores: [{ caminho: '/a', dia: '2026-10-12' }], remoto: null })
  eq('a arvore atual e descartada da lista de outras', v.onde, ONDE.AQUI)
}

{
  // 🔴 ESTE caso veio do ARNES: a mutacao que apaga o filtro de caminho proprio
  //    SOBREVIVEU aos 35 casos, porque em todos eles a arvore atual ja era a
  //    mais nova e o primeiro ramo devolvia AQUI de qualquer jeito. O filtro so
  //    importa quando o chamador passa a arvore ATUAL na lista das outras com
  //    uma data DIFERENTE, e ai, sem ele, o veredito manda "medir em /a" sendo
  //    que /a e onde eu estou, e ainda imprime que /a esta atrasada em relacao
  //    a /a. Conselho que aponta para o proprio pe.
  const v = decidir({ aqui: { caminho: '/a', dia: '2026-10-09' }, arvores: [{ caminho: '/a', dia: '2026-10-12' }], remoto: null })
  eq('o mesmo caminho com data diferente nao vira conselho de trocar para si', v.onde, ONDE.AQUI)
  eq('e nao inventa atraso contra si mesma', v.atrasoDias, 0)
}

// ── SO_NO_REMOTO ───────────────────────────────────────────────────────
{
  const v = decidir({ aqui: { caminho: '/a', dia: '2026-10-09' }, arvores: [{ caminho: '/b', dia: '2026-10-09' }], remoto: '2026-10-13' })
  eq('remoto mais novo que TODAS as arvores', v.onde, ONDE.SO_NO_REMOTO)
  eq('e nao aponta caminho nenhum, porque nao existe', v.caminho, null)
  contem('⛔ e proibe o `git pull` na arvore compartilhada', v.acao, 'aborta')
  contem('manda criar a arvore destacada', v.acao, 'arvore-completa.mjs')
}

// ── INDETERMINADO: nao e "em ordem" ───────────────────────────────────
{
  const v = decidir({ aqui: { caminho: '/a', dia: '' }, arvores: [{ caminho: '/b', dia: '(nenhuma)' }], remoto: null })
  eq('nenhuma data em parte nenhuma', v.onde, ONDE.INDETERMINADO)
  eq('atraso NAO vira zero quando nao se sabe', v.atrasoDias, null)
  contem('e a acao e NAO PRONUNCIAR', v.acao, 'não pronunciar')
}
{
  // 🕳️ data torta aqui conta como AUSENTE, e nao como antiga: se contasse como
  // antiga, qualquer `git log` vazio mandaria trocar de arvore
  const v = decidir({ aqui: { caminho: '/a', dia: 'lixo' }, arvores: [{ caminho: '/b', dia: '2026-10-12' }], remoto: null })
  eq('sem data aqui e com data la, vai para la', v.onde, ONDE.OUTRA_ARVORE)
  eq('atraso indeterminado, nao enorme', v.atrasoDias, null)
}
{
  const v = decidir({})
  eq('entrada vazia nao lanca', v.onde, ONDE.INDETERMINADO)
}
{
  const v = decidir({ aqui: { caminho: '/a', dia: '2026-10-12' }, arvores: 'nao e array', remoto: 42 })
  eq('tipos errados nao lancam e nao inventam veredito', v.onde, ONDE.AQUI)
}

console.log(falhou === 0 ? `\n✅ ${ok} asserção(ões) passaram, 0 falharam` : `\n❌ ${falhou} falha(s) de ${ok + falhou}`)
process.exit(falhou === 0 ? 0 : 1)
