/**
 * CONFERIDOR DA TELA DOS EUA: os números chegam ao leitor, nos três idiomas?
 *
 * 🔴 POR QUE `curl | grep` NÃO SERVE AQUI, e esta é a razão inteira do script.
 * O painel dos EUA serve CACHE e busca o preço no CLIENTE. O número não está no
 * HTML entregue, então o grep devolve ausência com a tela correta, e o operador
 * conclui que o painel quebrou. O erro simétrico é pior: o grep encontraria a
 * cópia dentro do dicionário de tradução mesmo com o componente NÃO montado, e
 * aí ele confirma uma entrega que não aconteceu.
 * → memory/reference_painel_us_serve_cache_e_busca_no_cliente.md
 * → memory/feedback_num_grafo_a_unidade_de_descoberta_e_o_no.md
 *
 * ⚠️ POR QUE ELE EXISTE SÓ AGORA. A ETAPA 5 do `/atualizar-usa` manda conferir
 * as três telas e a régua da casa manda conferir entrega visual com navegador,
 * mas não havia ferramenta: em 05/Set e em 06/Set/2026 a conferência foi feita
 * à mão, com playwright ad hoc, e conferência que se redigita é chance nova de
 * errar. É o mesmo motivo que fez o `conferir-us-polls.mjs` virar script.
 *
 * 🔑 ELE LÊ O TEXTO RENDERIZADO, não o HTML: `document.body.innerText` depois de
 * `networkidle` mais uma folga, que é o que dá tempo do fetch do cliente pousar.
 *
 * ⛔ O QUE ELE NÃO É. Não coleta, não escreve nada e não conserta. Ele responde
 * uma pergunta só, e ela é de ENTREGA: o número que o painel deveria mostrar
 * está na tela que o leitor recebe?
 *
 * 🏷️ E ele confere NÚMERO SOLTO, não etiqueta. Um valor certo com rótulo errado
 * passa por aqui, porque essa é outra classe de defeito e pede outro portão.
 * → memory/feedback_rotulo_diz_do_que_o_numero_e.md
 *
 * Uso:
 *   node scripts/conferir-tela-us.mjs --esperado=87.50,12.50,51.50,49.50,97.15
 *   node scripts/conferir-tela-us.mjs --esperado=... --base=http://localhost:3000
 *   node scripts/conferir-tela-us.mjs --esperado=... --locales=en
 *
 * Sai 1 quando algum idioma não traz algum dos valores esperados.
 */
import { chromium } from 'playwright'
import { pathToFileURL } from 'url'

const arg = (nome, padrao) => {
  const achado = process.argv.find((a) => a.startsWith(`--${nome}=`))
  return achado ? achado.slice(nome.length + 3) : padrao
}

/**
 * 🔴 DOIS DEFEITOS QUE ESTE CONFERIDOR TEVE NA PRIMEIRA RODADA, 06/Set/2026, e
 * que ele mesmo denunciou ao ser usado contra a produção:
 *
 * 1. SEPARADOR DECIMAL. Comparei `87.50` contra as três telas, e o pt-BR e o ES
 *    escrevem `87,50`. As duas telas certas foram acusadas de ausência, e só o
 *    inglês passou. Conferidor que não fala a convenção do idioma reprova o
 *    correto, que é o pior tipo de falso positivo: ele manda consertar o que
 *    está bom.
 *
 * 2. SUBSTRING. `texto.includes('51.50')` deu VERDADEIRO no pt-BR, numa tela que
 *    nem usa ponto decimal, porque o pedaço aparecia dentro de outro número. Um
 *    acerto por acaso é indistinguível de um acerto de verdade no relatório.
 *
 * ✅ O conserto é o mesmo para os dois: normalizar para a convenção do locale e
 * exigir FRONTEIRA de dígito nos dois lados.
 */
const VIRGULA = new Set(['pt-BR', 'es'])

/** O valor como AQUELE idioma o escreve. */
export function naConvencao(valor, locale) {
  return VIRGULA.has(locale) ? valor.replace('.', ',') : valor.replace(',', '.')
}

/**
 * Achou o número INTEIRO, não um pedaço dele dentro de outro.
 *
 * A fronteira exclui dígito, ponto e vírgula dos dois lados, porque é assim que
 * `87,50` deixa de casar dentro de `187,502`. Só `.` e `,` precisam de escape:
 * o alvo é sempre um número, não uma expressão.
 */
export function achou(texto, valor, locale) {
  const esc = naConvencao(valor, locale).replace(/[.,]/g, (c) => '\\' + c)
  return new RegExp('(?<![\\d.,])' + esc + '(?![\\d.,])').test(texto)
}


// 🔑 O runner fica GUARDADO para o teste poder importar as funções puras sem
// abrir navegador. Sem isto, `import` deste arquivo dispararia a conferência.
if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const BASE = arg('base', 'https://www.afos-analytics.com')
  const LOCALES = arg('locales', 'pt-BR,en,es').split(',').filter(Boolean)
  const ESPERADO = arg('esperado', '').split(',').map((s) => s.trim()).filter(Boolean)
  const FOLGA_MS = Number(arg('folga', '4000'))

  if (!ESPERADO.length) {
    console.error('❌ nada a conferir. Passe --esperado=valor1,valor2,...')
    console.error('   Conferidor sem alvo devolve verde sempre, que é pior que não conferir.')
    process.exit(1)
  }

  console.log(`\n🖥️  TELA DOS EUA · ${LOCALES.length} idioma(s) · ${ESPERADO.length} valor(es) esperado(s)`)
  console.log(`   base ${BASE}`)
  console.log(`   esperado: ${ESPERADO.join(' · ')}\n`)

  const navegador = await chromium.launch()
  let idiomasComFalha = 0

  for (const locale of LOCALES) {
    const pag = await navegador.newPage()
    const url = `${BASE}/${locale}/dashboard/us`
    let status = 0
    let texto = ''
    try {
      const resp = await pag.goto(url, { waitUntil: 'networkidle', timeout: 90_000 })
      status = resp?.status() ?? 0
      // ⏳ o preço chega por fetch do CLIENTE: sem esta folga o texto é lido
      // antes de o número pousar, e o conferidor acusa ausência que não existe.
      await pag.waitForTimeout(FOLGA_MS)
      texto = await pag.evaluate(() => document.body.innerText)
    } catch (e) {
      console.log(`   🔴 ${locale}: não carregou (${e.message.split('\n')[0]})`)
      idiomasComFalha++
      await pag.close()
      continue
    }

    const faltando = ESPERADO.filter((v) => !achou(texto, v, locale))
    const icone = faltando.length ? '🔴' : '✅'
    console.log(`   ${icone} ${locale.padEnd(6)} HTTP ${status} · ${texto.length} chars renderizados · ${ESPERADO.length - faltando.length}/${ESPERADO.length}`)
    if (faltando.length) {
      console.log(`        FALTANDO: ${faltando.join(' · ')}`)
      idiomasComFalha++
    }
    await pag.close()
  }

  await navegador.close()

  const ok = idiomasComFalha === 0
  console.log(`\n${ok ? '✅' : '🔴'} VEREDITO: ${ok ? 'as ' + LOCALES.length + ' telas trazem todos os valores' : idiomasComFalha + ' idioma(s) com ausência'}\n`)
  process.exit(ok ? 0 : 1)
}
