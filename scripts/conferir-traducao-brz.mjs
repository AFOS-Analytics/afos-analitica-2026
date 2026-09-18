#!/usr/bin/env node
/**
 * CONFERIR TRADUÇÃO DO PAINEL BR — as 5 checagens que o `/atualizar-brz` pedia
 * em PROSA e que ninguém media.
 *
 * 🔑 POR QUE ISTO EXISTE, em 18/Set/2026: a ETAPA 3.5 do comando manda "rodar as
 *    5 checagens que pegaram defeito real em 25/Jul" e descreve as cinco em
 *    texto corrido. Régua citada em prosa é régua que alguém pula, que é
 *    exatamente o diagnóstico que fez a ETAPA 1.9 e o conferidor de escopo
 *    virarem etapa encadeada. O gate numérico já tem medidor dentro do
 *    tradutor; estas cinco não tinham nenhum.
 *
 * As cinco, e o que cada uma pega:
 *   1 ÂNCORA MORTA   id de glossário que não existe em public/glossary/entries.json
 *   2 LOCALE CRUZADO link de /en/ dentro do arquivo .es.json, e vice-versa
 *   3 HOMÓGLIFO      letra cirílica que parece latina (а, е, о, с, р, х…)
 *   4 DECIMAL        vírgula decimal no .en.json, ponto decimal no .es.json
 *   5 PORTUGUÊS      campo que ficou em pt-BR no .en.json, que é tudo ou nada
 *
 * ⚠️ As varreduras correm sobre os VALORES, nunca sobre o texto cru do arquivo:
 *    no cru, nome de chave e nome próprio de instituto dão falso positivo, e foi
 *    isso que a régua de 25/Jul registrou.
 *
 * Uso:
 *   node scripts/conferir-traducao-brz.mjs
 *   node scripts/conferir-traducao-brz.mjs --arquivo=polls-data
 *
 * Saída: 0 limpo · 1 defeito encontrado · 4 não leu
 */

import { existsSync, readFileSync } from 'node:fs'

export const ARQUIVOS = ['analysis-data', 'analysis-criteriosa', 'polls-data']

/**
 * Cirílicas que são visualmente idênticas a latinas.
 *
 * 🔴 ESCRITAS POR CÓDIGO, NUNCA COLADAS. A primeira versão desta linha tinha as
 *    letras coladas e o dígito ASCII `2` entrou no meio delas sem que desse para
 *    ver: o conferidor acusou 32 homóglifos e TODOS eram o número 2 de uma data.
 *    Classe de caracteres invisíveis se escreve com o código do caractere, que é
 *    legível, e não com o glifo, que é justamente o que não se distingue.
 */
const HOMOGLIFOS = new RegExp(
  '[' +
    '\\u0430' + // а  CYRILLIC SMALL A
    '\\u0435' + // е  CYRILLIC SMALL IE
    '\\u043e' + // о  CYRILLIC SMALL O
    '\\u0440' + // р  CYRILLIC SMALL ER
    '\\u0441' + // с  CYRILLIC SMALL ES
    '\\u0443' + // у  CYRILLIC SMALL U
    '\\u0445' + // х  CYRILLIC SMALL HA
    '\\u0410\\u0415\\u041e\\u0420\\u0421\\u0422\\u0425' + // А Е О Р С Т Х
    ']',
)

/**
 * Percorre um JSON e devolve [caminho, string] para cada valor de texto.
 * ⛔ Só VALORES: a chave nunca entra.
 */
export function textos(obj, caminho = '', saida = []) {
  if (typeof obj === 'string') {
    saida.push([caminho, obj])
    return saida
  }
  if (Array.isArray(obj)) {
    obj.forEach((v, i) => textos(v, `${caminho}[${i}]`, saida))
    return saida
  }
  if (obj && typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj)) textos(v, caminho ? `${caminho}.${k}` : k, saida)
  }
  return saida
}

/**
 * As cinco checagens sobre UM par (idioma, conteúdo).
 *
 * @param {string} idioma 'en' ou 'es'
 * @param {object} json conteúdo do arquivo traduzido
 * @param {Set<string>} idsValidos ids do glossário
 * @returns {{tipo:string, caminho:string, detalhe:string}[]}
 */
export function conferir(idioma, json, idsValidos) {
  const achados = []
  const outro = idioma === 'en' ? 'es' : 'en'

  for (const [caminho, txt] of textos(json)) {
    // 1 e 2: links de glossário.
    for (const m of txt.matchAll(/\[([^\]]*)\]\(\/([a-zA-Z-]+)\/glossary#([^)]*)\)/g)) {
      const [, rotulo, locale, id] = m
      if (!idsValidos.has(id)) {
        achados.push({ tipo: 'ANCORA_MORTA', caminho, detalhe: `id "${id}" não existe no glossário (rótulo "${rotulo}")` })
      }
      if (locale === outro || (locale !== idioma && locale !== 'pt-BR')) {
        achados.push({ tipo: 'LOCALE_CRUZADO', caminho, detalhe: `link aponta para /${locale}/ dentro do arquivo .${idioma}.json` })
      }
    }

    // 3: homóglifo cirílico.
    const h = txt.match(HOMOGLIFOS)
    if (h) {
      achados.push({
        tipo: 'HOMOGLIFO',
        caminho,
        detalhe: `caractere cirílico U+${h[0].codePointAt(0).toString(16).toUpperCase().padStart(4, '0')} em "${txt.slice(Math.max(0, h.index - 24), h.index + 24)}"`,
      })
    }

    // 4: separador decimal. 🔑 Só entre DÍGITOS, para não acusar vírgula de
    //    frase nem ponto final. E o milhar é o separador OPOSTO, então em
    //    inglês "2,002" é milhar legítimo e "2,0pp" é decimal errado: o que
    //    separa os dois é a contagem de dígitos depois do separador.
    if (idioma === 'en') {
      const m = txt.match(/\d,\d(?!\d\d)/)
      if (m) achados.push({ tipo: 'DECIMAL_PT_NO_EN', caminho, detalhe: `"${txt.slice(Math.max(0, m.index - 30), m.index + 30)}"` })
    } else {
      const m = txt.match(/\d\.\d(?!\d\d)/)
      if (m) achados.push({ tipo: 'DECIMAL_EN_NO_ES', caminho, detalhe: `"${txt.slice(Math.max(0, m.index - 30), m.index + 30)}"` })
    }

    // 5: campo que ficou em português no inglês. Palavras que NÃO existem em
    //    inglês e que não são nome próprio nem termo de glossário.
    //
    // ⛔ NOME PRÓPRIO fica de fora, e por isso a exclusão é por CAMINHO e não
    //    por palavra: "Paraná Pesquisas" é o nome do instituto e continua em
    //    português nos três idiomas, de propósito. A régua de 25/Jul já dizia
    //    que nome de instituto dá falso positivo; aqui ela vira código.
    const nomeProprio = /(institutes|candidates)\[\d+\]\.name$/.test(caminho)
    if (idioma === 'en' && !nomeProprio) {
      // 🔴 A URL do link de glossário SAI antes da busca: o id é sempre em
      //    português (`#primeiro-turno`, `#empate-tecnico`) de propósito, e
      //    procurar "turno" no texto cru acusa todo link correto como campo
      //    não traduzido. O que se confere é o texto que o leitor vê.
      const visivel = txt.replace(/\]\(\/[^)]*\)/g, ']')
      const pt = visivel.match(
        /(?<![\p{L}])(?:turno|pesquisas?|leitura|confirmada|contrato|vencedor|rodada|aprovação|desaprovação|eleitores|entrevistas)(?![\p{L}])/iu,
      )
      if (pt) achados.push({ tipo: 'PORTUGUES_NO_EN', caminho, detalhe: `"${pt[0]}" em "${visivel.slice(Math.max(0, pt.index - 30), pt.index + 30)}"` })
    }
  }
  return achados
}

// ─────────────────────────── execução ───────────────────────────
if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}` || process.argv[1].endsWith('conferir-traducao-brz.mjs')) {
  const argv = process.argv.slice(2)
  const so = argv.find((a) => a.startsWith('--arquivo='))?.slice(10)

  let idsValidos
  try {
    idsValidos = new Set(Object.keys(JSON.parse(readFileSync('public/glossary/entries.json', 'utf8'))))
  } catch (e) {
    console.error(`\n⚠️ NÃO LEU o glossário: ${e.message}. A medição não aconteceu.`)
    process.exit(4)
  }

  console.log(`\n🈯 CONFERIR TRADUÇÃO DO PAINEL BR · ${idsValidos.size} ids de glossário`)
  let total = 0
  let lidos = 0

  for (const base of ARQUIVOS) {
    if (so && base !== so) continue
    for (const idioma of ['en', 'es']) {
      const caminho = `public/${base}.${idioma}.json`
      if (!existsSync(caminho)) {
        console.log(`   ⚠️ ${caminho} não existe (o gate numérico pode ter descartado). Fallback serve o pt-BR.`)
        continue
      }
      lidos++
      const achados = conferir(idioma, JSON.parse(readFileSync(caminho, 'utf8')), idsValidos)
      total += achados.length
      if (achados.length === 0) {
        console.log(`   ✅ ${base}.${idioma}`)
      } else {
        console.log(`   🔴 ${base}.${idioma}: ${achados.length} achado(s)`)
        for (const a of achados.slice(0, 12)) console.log(`        [${a.tipo}] ${a.caminho}\n           ${a.detalhe}`)
        if (achados.length > 12) console.log(`        … e mais ${achados.length - 12}`)
      }
    }
  }

  if (lidos === 0) {
    console.error('\n⚠️ nenhum arquivo traduzido lido: a medição não aconteceu.')
    process.exit(4)
  }
  console.log(
    total === 0
      ? `\n✅ VEREDITO: LIMPO nas 5 checagens, em ${lidos} arquivo(s).`
      : `\n🔴 VEREDITO: ${total} achado(s). Corrigir antes de publicar.`,
  )
  process.exit(total === 0 ? 0 : 1)
}
