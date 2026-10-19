/**
 * CONFERIDOR DA TELA DO PAINEL ${PAIS.toUpperCase()}: os números chegam ao leitor, nos três idiomas?
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
 *   node scripts/conferir-tela.mjs --esperado=87.50,12.50,51.50,49.50,97.15,5.14
 *   node scripts/conferir-tela.mjs --esperado=... --base=http://localhost:3000
 *   node scripts/conferir-tela.mjs --esperado=... --locales=en
 *
 * Sai 1 quando algum idioma não traz algum dos valores esperados.
 */
import { chromium } from 'playwright'
import { pathToFileURL } from 'url'
import { baseDeLeitura } from './lib/base-afos.mjs'

/**
 * 🌎 O PAÍS É PARÂMETRO desde 07/Set/2026, e antes disso a rota era fixa em
 * .
 *
 * ⚠️ O buraco que isso deixava era o pior possível: a passada do BRASIL é a que
 * publica PROSA EDITORIAL em três idiomas, e era justamente ela que não tinha
 * conferidor de entrega visual. A dos EUA, que não escreve prosa por rodada,
 * tinha. Ferramenta que se declara de um país só é ferramenta que a passada do
 * outro país nunca alcança, e foi a terceira vez que esse padrão apareceu no
 * mesmo dia.
 *
 * O padrão continua , para não mudar o comportamento de quem já chamava.
 */
import { CONTRATOS, conferirRegistro } from './lib/rotulos-do-painel-us.mjs'

const PAIS = process.argv.find((a) => a.startsWith('--pais='))?.slice(7) ?? 'us'

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

/**
 * O PRIMEIRO número do texto, como a tela o escreve.
 *
 * 📌 Ele aceita ponto e vírgula no meio porque o separador muda de idioma, e
 * devolve o token CRU, sem normalizar: quem compara é quem chamou, que sabe o
 * idioma. Normalizar aqui esconderia a diferença entre `91,50` e `91.50` numa
 * tela que escreve o separador errado.
 */
export function primeiroNumero(texto) {
  const m = String(texto ?? "").match(/\d[\d.,]*\d|\d/)
  return m ? m[0] : null
}

/**
 * 🏷️ O NÚMERO ESTÁ SOB O RÓTULO DELE? É o portão que faltava desde 06/Set.
 *
 * 🔑 A régua é **o valor é o PRIMEIRO número depois do rótulo**, e ela não é
 *    proximidade. A medição que escolheu isso, na tela de 19/Out/2026: o valor
 *    certo está a 1 char do rótulo nos quatro preços de controle, o `no-prazo`
 *    legítimo está a 25 chars, e o valor REPUBLICANO está a 21 chars do rótulo
 *    "Democratas". Ou seja 25 tem de passar e 21 tem de reprovar, e nenhuma
 *    janela de caracteres separa os dois.
 *
 * 🧬 A cadeia de âncoras é procurada EM ORDEM, cada uma depois da anterior,
 *    porque "Democratas" aparece nos dois cartões e só a âncora do cartão
 *    distingue um do outro.
 *
 * ⛔ Âncora ausente é veredito PRÓPRIO e não falta de valor: um manda conferir
 *    o número, o outro manda consertar o registro de rótulos. Devolver os dois
 *    como "faltou" mandaria procurar no lugar errado.
 *
 * @returns {{ok: boolean, motivo?: string, ancora?: string, encontrado?: string|null, esperado?: string}}
 */
export function valorSobOsRotulos(texto, ancoras, valor, locale) {
  const txt = String(texto ?? "")
  if (!Array.isArray(ancoras) || !ancoras.length) return { ok: false, motivo: "SEM_ANCORA" }
  let pos = 0
  for (const a of ancoras) {
    const i = txt.indexOf(a, pos)
    if (i < 0) return { ok: false, motivo: "ANCORA_AUSENTE", ancora: a }
    pos = i + a.length
  }
  const achado = primeiroNumero(txt.slice(pos))
  if (achado === null) return { ok: false, motivo: "SEM_NUMERO_DEPOIS" }
  const esperado = naConvencao(valor, locale)
  if (achado !== esperado) return { ok: false, motivo: "OUTRO_NUMERO", encontrado: achado, esperado }
  return { ok: true, encontrado: achado }
}


// 🔑 O runner fica GUARDADO para o teste poder importar as funções puras sem
// abrir navegador. Sem isto, `import` deste arquivo dispararia a conferência.
if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const BASE = arg('base', baseDeLeitura())
  const LOCALES = arg('locales', 'pt-BR,en,es').split(',').filter(Boolean)
  const ESPERADO = arg('esperado', '').split(',').map((s) => s.trim()).filter(Boolean)
  const FOLGA_MS = Number(arg('folga', '4000'))

  if (!ESPERADO.length) {
    console.error('❌ nada a conferir. Passe --esperado=valor1,valor2,...')
    console.error('   Conferidor sem alvo devolve verde sempre, que é pior que não conferir.')
    process.exit(1)
  }

  /**
   * 🏷️ O portão de etiqueta só existe para o país que tem registro de rótulos.
   *
   * ⛔ E ele exige que a CONTAGEM bata com o registro, porque o `--esperado` é
   *    POSICIONAL: um valor a mais ou a menos desloca todos os pares e o portão
   *    passaria a conferir o número certo contra o rótulo do vizinho, que é
   *    exatamente o defeito que ele existe para pegar.
   */
  const temRegistro = PAIS === 'us'
  const COM_ETIQUETA = temRegistro && ESPERADO.length === CONTRATOS.length
  if (temRegistro) {
    const maCarga = conferirRegistro()
    if (maCarga.length) {
      console.error('❌ registro de rótulos malformado, e sem ele o portão de etiqueta não roda:')
      for (const p of maCarga) console.error('   · ' + p)
      process.exit(1)
    }
    if (!COM_ETIQUETA) {
      console.error(`❌ ${ESPERADO.length} valor(es) em --esperado contra ${CONTRATOS.length} no registro de rótulos.`)
      console.error('   O --esperado é POSICIONAL: contagem diferente conferiria o número certo')
      console.error('   contra o rótulo do vizinho. Passar os ' + CONTRATOS.length + ' na ordem:')
      CONTRATOS.forEach((c, i) => console.error(`     ${i + 1}. ${c.chave.padEnd(15)} ${c.descricao}`))
      process.exit(1)
    }
  }

  console.log(`\n🖥️  TELA DO PAINEL ${PAIS.toUpperCase()} · ${LOCALES.length} idioma(s) · ${ESPERADO.length} valor(es) esperado(s)`)
  console.log(`   base ${BASE}`)
  console.log(`   esperado: ${ESPERADO.join(' · ')}\n`)

  const navegador = await chromium.launch()
  let idiomasComFalha = 0

  for (const locale of LOCALES) {
    const pag = await navegador.newPage()
    const url = `${BASE}/${locale}/dashboard/${PAIS}`
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

    // 1) o número CHEGOU à tela? (régua de 06/Set)
    const faltando = ESPERADO.filter((v) => !achou(texto, v, locale))
    // 2) 🏷️ e ele está SOB O RÓTULO DELE? (régua de 19/Out)
    //    ⛔ O segundo não substitui o primeiro: "ausente da tela" e "presente sob
    //       o rótulo errado" são defeitos diferentes e pedem ações diferentes.
    const etiquetas = COM_ETIQUETA
      ? ESPERADO.map((v, i) => ({ chave: CONTRATOS[i].chave, descricao: CONTRATOS[i].descricao, r: valorSobOsRotulos(texto, CONTRATOS[i].ancoras[locale], v, locale) }))
      : []
    const etiquetaMa = etiquetas.filter((e) => !e.r.ok)
    const icone = faltando.length || etiquetaMa.length ? '🔴' : '✅'
    const sufixo = COM_ETIQUETA ? ` · etiqueta ${etiquetas.length - etiquetaMa.length}/${etiquetas.length}` : ' · etiqueta NÃO conferida'
    console.log(`   ${icone} ${locale.padEnd(6)} HTTP ${status} · ${texto.length} chars renderizados · ${ESPERADO.length - faltando.length}/${ESPERADO.length}${sufixo}`)
    if (faltando.length) {
      console.log(`        FALTANDO na tela: ${faltando.join(' · ')}`)
    }
    for (const e of etiquetaMa) {
      if (e.r.motivo === 'ANCORA_AUSENTE') {
        console.log(`        🏷️ ${e.chave}: ÂNCORA AUSENTE na tela, ${JSON.stringify(e.r.ancora)}`)
        console.log(`           o rótulo mudou de texto? o registro é scripts/lib/rotulos-do-painel-us.mjs`)
      } else if (e.r.motivo === 'OUTRO_NUMERO') {
        console.log(`        🏷️ ${e.chave}: sob o rótulo veio ${e.r.encontrado}, esperado ${e.r.esperado}  (${e.descricao})`)
      } else {
        console.log(`        🏷️ ${e.chave}: ${e.r.motivo}`)
      }
    }
    if (faltando.length || etiquetaMa.length) idiomasComFalha++
    await pag.close()
  }

  await navegador.close()

  const ok = idiomasComFalha === 0
  const oQue = COM_ETIQUETA ? 'trazem todos os valores, cada um SOB O RÓTULO dele' : 'trazem todos os valores (etiqueta não conferida neste país)'
  console.log(`\n${ok ? '✅' : '🔴'} VEREDITO: ${ok ? 'as ' + LOCALES.length + ' telas ' + oQue : idiomasComFalha + ' idioma(s) com problema'}\n`)
  process.exit(ok ? 0 : 1)
}
