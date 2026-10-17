/**
 * BURACO JÁ DIAGNOSTICADO: a rodada que o agregador tem, a nossa base não, e
 * que alguém JÁ investigou, com prova e data.
 *
 * ─── O DEFEITO QUE ELE MATA ─────────────────────────────────────────────────
 *
 * 🔴 O passo 7.5 imprime "N rodadas que o agregador tem e a nossa base NÃO", e
 *    ele imprime a MESMA lista todo dia, em branco. Em 16/Out eu gastei a
 *    conferência inteira da AP-NORC; em 17/Out, a da Change Research; e as duas
 *    voltariam amanhã sem uma palavra do que já se sabe sobre elas.
 *
 * 📌 É o mesmo defeito que criou o `fonte-conferida.mjs`: sem registro, a
 *    próxima passada busca o mesmo documento, tropeça no mesmo bloqueio e chega
 *    à mesma conclusão gastando o mesmo tempo.
 *
 * ─── A DIFERENÇA PARA O `instrumento-medido.mjs`, e ela é o ponto ───────────
 *
 * ⛔ Aquele registro REMOVE a rodada da contagem de buraco, porque a rodada
 *    mede outra coisa e nunca foi nossa para ter. Este aqui **NÃO REMOVE
 *    NADA**. O buraco segue contado como buraco; o que muda é que ele passa a
 *    sair com o diagnóstico ao lado.
 *
 * 🔑 **Anotar não é silenciar**, e a fronteira entre as duas coisas é a razão
 *    de serem dois arquivos. Um buraco que some porque alguém o explicou uma
 *    vez é pior que um buraco barulhento: o barulhento ainda é verdade.
 *
 * ─── E TODO DIAGNÓSTICO VENCE ───────────────────────────────────────────────
 *
 * ⏳ `revisarApos` é OBRIGATÓRIO. Um 429 é limite de taxa e é temporário por
 *    natureza; uma fonte não localizada hoje pode ser publicada amanhã. Depois
 *    da data o diagnóstico sai como **VENCIDO** e manda reconferir, em vez de
 *    ser acreditado para sempre.
 *
 * 📌 E a caducidade pela ENTRADA vem de graça: este registro só é consultado
 *    para rodada que está FALTANDO. No dia em que o índice a receber, ninguém
 *    pergunta mais por ela.
 */

import { serieDaCasa } from './casas.mjs'

const FORMA_ISO = /^\d{4}-\d{2}-\d{2}$/

/**
 * 🏷️ As situações DECLARADAS, com o que cada uma manda a próxima passada fazer.
 *
 * ⛔ Não existe padrão: situação fora desta tabela reprova a carga e a entrada
 *    fica INERTE, porque diagnóstico que ninguém sabe ler não é diagnóstico.
 */
export const SITUACOES = {
  FONTE_INACESSIVEL: {
    descricao: 'o documento da casa foi localizado e o host recusa a leitura',
    acao: 'NÃO procurar de novo no mesmo caminho até a data de revisão; o bloqueio não se resolve insistindo',
    exigeAcesso: true,
  },
  FONTE_NAO_LOCALIZADA: {
    descricao: 'a publicação da própria casa não foi encontrada, só o registro do agregador',
    acao: 'procurar de novo na data de revisão, por outro caminho que não o já tentado',
    exigeAcesso: false,
  },
  AGUARDANDO_INDICE: {
    descricao: 'a rodada existe, é generic ballot e está conferida, e o índice simplesmente ainda não a recebeu',
    acao: 'nada a fazer: esperar o índice, ou levar a ingestão curada ao André',
    exigeAcesso: false,
  },
}

/**
 * @type {{casa: string, campoInicio: string, campoFim: string, amostra?: number, recorte?: string, situacao: keyof typeof SITUACOES, medidoEm: string, revisarApos: string, acesso?: object, nota: string}[]}
 */
export const BURACOS_CONHECIDOS = [
  {
    // 🔴 A casa NÃO tem UMA linha em 495, e desta vez o buraco é REAL: ela
    //    publica generic ballot nacional. Fontes secundárias dão 2.021
    //    eleitores registrados, campo de 15 a 24/Set, D+7 no agregado.
    //
    // ⛔ Mas resumo de busca NÃO É NEM ÍNDICE, então o número não entra e a
    //    conferência fica aberta. O que impede fechá-la é o acesso.
    //
    // 🧪 Medido em 17/Out com controle positivo: o artigo E a raiz devolvem
    //    429, enquanto emersoncollegepolling.com e poll.qu.edu respondem 200 no
    //    mesmo cliente e no mesmo minuto. Não é o nosso leitor.
    //
    // ⚠️ E o `curl -o` GRAVOU no 429: 34.218 bytes começando em `<!DOCTYPE`,
    //    que é a página de erro. Conferir o download pelo tamanho diria que deu
    //    certo. Conferir os PRIMEIROS BYTES.
    //
    // ⏳ 429 é limite de taxa, não política: por isso a revisão é curta.
    casa: 'Change Research',
    campoInicio: '2026-09-15',
    campoFim: '2026-09-24',
    amostra: 2021,
    recorte: 'RV',
    situacao: 'FONTE_INACESSIVEL',
    medidoEm: '2026-10-17',
    revisarApos: '2026-10-20',
    acesso: {
      status: 429,
      hostTodo: true,
      medidoEm: '2026-10-17',
      controlePositivo:
        'no mesmo cliente e no mesmo minuto, emersoncollegepolling.com devolveu 200 e poll.qu.edu/robots.txt devolveu 200, enquanto changeresearch.com devolveu 429 tanto no artigo quanto na RAIZ',
      observado:
        '429 e limite de taxa, nao recusa de politica: ele e temporario por natureza e nao se resolve insistindo, entao a revisao e curta e o veredito NAO vira permanente',
    },
    nota: '⛔ Nada ingerido e o número não se mexe. 📌 A casa está em ZERO linhas de 495, então não é uma onda que faltou, é a casa inteira que o índice não carrega. Se na revisão o host abrir, a decisão de ingerir segue sendo do André, casa por casa.',
  },
  {
    // 🔎 Aqui a casa EXISTE na base, com duas ondas do mesmo tamanho (12-16/Ago
    //    e 01-04/Jun, as duas ~2.500 RV), e o índice não recebeu a de outubro.
    //
    // ⛔ A listagem pública da casa mostra só as pesquisas ESTADUAIS, e a
    //    nacional não aparece nela. Então não é bloqueio: é publicação não
    //    localizada, e as duas coisas pedem ações opostas.
    casa: 'Noble Predictive',
    campoInicio: '2026-10-05',
    campoFim: '2026-10-07',
    amostra: 2527,
    recorte: 'RV',
    situacao: 'FONTE_NAO_LOCALIZADA',
    medidoEm: '2026-10-16',
    revisarApos: '2026-10-20',
    nota: '⛔ Os números que circulam (D 47 x R 42) vêm do ecossistema de agregador, que não é nem índice. 📌 O blog da casa lista Arizona, Nevada, Utah e Califórnia, e nenhuma nacional. Na revisão, tentar a listagem de imprensa da casa em vez do blog.',
  },
]

/** A entrada da casa, pela SÉRIE, como no resto da esteira. */
function mesmaCasa(a, b) {
  return serieDaCasa(a) === serieDaCasa(b)
}

/**
 * 🔎 A carga se confere, no mesmo padrão dos registros irmãos.
 *
 * ⛔ Ela NÃO lança: entrada malformada não pode derrubar a passada. Ela fica
 * INERTE, o buraco volta a sair sem diagnóstico, que é o estado seguro, e esta
 * lista acusa em toda passada.
 */
export function conferirCarga(registro = BURACOS_CONHECIDOS) {
  const problemas = []
  for (const e of registro ?? []) {
    const quem = `${e?.casa ?? '(sem casa)'} ${e?.campoInicio ?? '?'}..${e?.campoFim ?? '?'}`
    if (!e || typeof e !== 'object') {
      problemas.push('entrada vazia')
      continue
    }
    if (!e.casa) problemas.push(`${quem}: sem 'casa'`)
    if (!FORMA_ISO.test(e.campoInicio ?? '')) problemas.push(`${quem}: 'campoInicio' fora de AAAA-MM-DD`)
    if (!FORMA_ISO.test(e.campoFim ?? '')) problemas.push(`${quem}: 'campoFim' fora de AAAA-MM-DD`)
    const s = SITUACOES[e.situacao]
    if (!s) problemas.push(`${quem}: situação ${JSON.stringify(e.situacao)} não está declarada em SITUACOES`)
    if (!FORMA_ISO.test(e.medidoEm ?? '')) problemas.push(`${quem}: 'medidoEm' fora de AAAA-MM-DD`)
    // ⏳ Sem prazo, o diagnóstico vira crença permanente. É o defeito que este
    //    campo existe para impedir, então ele é obrigatório.
    if (!FORMA_ISO.test(e.revisarApos ?? '')) problemas.push(`${quem}: sem 'revisarApos', e diagnóstico sem prazo vira crença`)
    if (!e.nota) problemas.push(`${quem}: sem 'nota', e diagnóstico sem o que foi feito não poupa a próxima passada`)
    if (s?.exigeAcesso) {
      const a = e.acesso
      if (!a || typeof a !== 'object') problemas.push(`${quem}: ${e.situacao} exige 'acesso'`)
      else {
        // Guarda de TIPO e não de valor: `status: 0` é medição legítima de host
        // que não resolve, e `!a.status` rejeitaria justamente esse caso.
        if (typeof a.status !== 'number') problemas.push(`${quem}: 'acesso.status' tem de ser número`)
        if (!a.controlePositivo) problemas.push(`${quem}: sem 'acesso.controlePositivo', e sem ele bloqueio do host é indistinguível de leitor quebrado`)
        if (!FORMA_ISO.test(a.medidoEm ?? '')) problemas.push(`${quem}: 'acesso.medidoEm' fora de AAAA-MM-DD`)
      }
    } else if (e.acesso) {
      // ⛔ Mesma fronteira do `fonte-conferida`: anexar status de acesso a uma
      //    situação que não é de bloqueio faz o registro declarar bloqueio onde
      //    não houve.
      problemas.push(`${quem}: ${e.situacao} NÃO aceita 'acesso', que declararia bloqueio onde não houve`)
    }
  }
  return problemas
}

/**
 * O diagnóstico de UMA rodada faltante, ou `null` se ninguém a investigou.
 *
 * ⛔ Ele NUNCA diz para tirar a rodada da contagem. O buraco segue buraco: o
 * que volta aqui é o que já se sabe sobre ele, para a próxima passada não
 * refazer a investigação.
 *
 * @param {string} casa        nome da casa como o agregador escreve
 * @param {string} campoInicio `AAAA-MM-DD`
 * @param {string} campoFim    `AAAA-MM-DD`
 * @param {Date|string} hoje
 */
export function diagnosticoDe(casa, campoInicio, campoFim, registro = BURACOS_CONHECIDOS, hoje = new Date()) {
  if (!casa || !campoInicio || !campoFim) return null
  const e = (registro ?? []).find(
    (x) => x && mesmaCasa(x.casa, casa) && x.campoInicio === campoInicio && x.campoFim === campoFim
  )
  if (!e) return null
  const s = SITUACOES[e.situacao]
  // Entrada malformada fica INERTE: sem diagnóstico é o estado seguro.
  if (!s || !FORMA_ISO.test(e.revisarApos ?? '')) return null
  const dia = typeof hoje === 'string' ? hoje.slice(0, 10) : new Date(hoje).toISOString().slice(0, 10)
  const vencido = dia > e.revisarApos
  return {
    situacao: e.situacao,
    descricao: s.descricao,
    acao: vencido ? 'DIAGNÓSTICO VENCIDO: reconferir, porque crença velha não é medição' : s.acao,
    medidoEm: e.medidoEm,
    revisarApos: e.revisarApos,
    vencido,
    acesso: e.acesso ?? null,
    nota: e.nota,
  }
}
