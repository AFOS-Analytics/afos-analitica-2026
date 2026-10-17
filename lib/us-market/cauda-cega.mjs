/**
 * A REGRA do fechamento da cauda cega, separada da leitura de disco e de rede
 * para poder ser testada.
 *
 * 🔴 O defeito que ela mata: o backup do Neon é diário e a série viva cresce o
 *    dia inteiro, então entre o último ponto gravado e agora existe uma CAUDA
 *    CEGA. O `serie-do-contrato.mjs` já a fechava, mas com a leitura
 *    CERTIFICADA da trava, que é UM ponto, e um ponto não cobre uma janela.
 *    Dois superlativos falsos saíram por isso, em 09 e 13/Out/2026.
 *
 * 🧪 E ela carrega o CONTROLE POSITIVO como parte do veredito, não como passo
 *    opcional: a rota só pode fechar a cauda se ela for espelho fiel da série
 *    gravada, e isso se prova na janela em que os dois SE SOBREPÕEM. Medido em
 *    16/Out/2026 na Câmara democrata: 15 pontos de cada lado, mesmos valores e
 *    mesmos carimbos. Sem esse controle, a ferramenta estaria apostando.
 */

export const VEREDITO = {
  FECHADA: 'CAUDA_FECHADA',
  VAZIA: 'CAUDA_VAZIA',
  EXTREMO: 'EXTREMO_NA_CAUDA',
  INDETERMINADO: 'INDETERMINADO',
}

/** Horas entre dois instantes, em número, ou null se algum não for data. */
export function horasEntre(de, ate) {
  const a = new Date(de).getTime()
  const b = new Date(ate).getTime()
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null
  return (b - a) / 36e5
}

/**
 * A rota é espelho fiel do que está gravado?
 *
 * 🔴 A janela ancora nas ULTIMAS `janelaH` horas do BACKUP, nunca no primeiro
 * ponto da rota. A primeira versão fazia o contrário, e aí uma rota que PERDE
 * pontos antigos encolhia a janela e DEFINIA PARA FORA a própria perda: o
 * controle aprovava justamente o caso que ele existe para pegar. Achado pelo
 * caso "rota com MENOS pontos na sobreposição" do arnês. ⛔ Sem sobreposição NÃO é "fiel", é
 * `semSobreposicao`, e quem recebe isso não pode tratar como aprovado.
 */
export function controlePositivo(pontosBackup, pontosRota, { janelaH = 24 } = {}) {
  const bk = pontosBackup ?? []
  const rt = pontosRota ?? []
  if (!bk.length || !rt.length) return { fiel: false, semSobreposicao: true, nBackup: 0, nRota: 0 }
  const fim = bk[bk.length - 1].t
  const corte = new Date(new Date(fim).getTime() - janelaH * 36e5).toISOString()
  const b = bk.filter((p) => p.t >= corte && p.t <= fim)
  const r = rt.filter((p) => p.t >= corte && p.t <= fim)
  if (!b.length || !r.length) return { fiel: false, semSobreposicao: true, nBackup: b.length, nRota: r.length }
  const mesmosCarimbos = b.map((p) => p.t).join(',') === r.map((p) => p.t).join(',')
  const mesmosValores = b.map((p) => p.v).join(',') === r.map((p) => p.v).join(',')
  return { fiel: mesmosCarimbos && mesmosValores, semSobreposicao: false, mesmosCarimbos, mesmosValores, nBackup: b.length, nRota: r.length }
}

/**
 * O veredito de uma série.
 *
 * @param {{min:number,max:number,fim:string}} ext extremos do BACKUP
 * @param {{t:string,v:number}[]} pontosRota pontos da rota, já do livro certo
 * @param {Date|string} agora
 */
export function vereditoDaCauda(ext, pontosRota, agora = new Date()) {
  // 🔴 Guarda que nasceu de um defeito real: na primeira versão eu comparei
  //    contra `ext.max.price`, que é undefined, e `x > undefined` é SEMPRE
  //    falso. O medidor nunca acusaria extremo e só saberia dizer "fechada".
  if (!ext || !Number.isFinite(ext.max) || !Number.isFinite(ext.min) || !ext.fim) {
    return { veredito: VEREDITO.INDETERMINADO, motivo: 'o extremo do backup não veio em número, não há contra o que comparar' }
  }
  const caudaH = horasEntre(ext.fim, agora)
  if (caudaH === null) return { veredito: VEREDITO.INDETERMINADO, motivo: 'carimbo do fim do backup ilegível', caudaH: null }

  const naCauda = (pontosRota ?? []).filter((p) => p.t > ext.fim && Number.isFinite(p.v))
  if (!naCauda.length) {
    // ⛔ Cauda ABERTA e rota muda não é "nada novo": é não ter olhado. A régua
    //    de uma hora é o tamanho abaixo do qual a grade de 30 min pode
    //    legitimamente não ter ponto novo.
    return caudaH > 1
      ? { veredito: VEREDITO.INDETERMINADO, motivo: `cauda de ${caudaH.toFixed(1)}h e a rota não trouxe ponto depois do backup`, caudaH, naCauda: 0 }
      : { veredito: VEREDITO.VAZIA, motivo: `cauda de ${caudaH.toFixed(1)}h, abaixo de uma grade de 30 min`, caudaH, naCauda: 0 }
  }

  const vs = naCauda.map((p) => p.v)
  const maxCauda = Math.max(...vs)
  const minCauda = Math.min(...vs)
  const bateTopo = maxCauda > ext.max
  const bateFundo = minCauda < ext.min
  if (bateTopo || bateFundo) {
    return {
      veredito: VEREDITO.EXTREMO,
      caudaH,
      naCauda: naCauda.length,
      maxCauda,
      minCauda,
      bateTopo,
      bateFundo,
      motivo: 'a cauda contém valor além do extremo do backup; superlativo escrito sobre o backup sozinho sai FALSO',
    }
  }
  return { veredito: VEREDITO.FECHADA, caudaH, naCauda: naCauda.length, maxCauda, minCauda, motivo: 'nenhum ponto da cauda ultrapassa o extremo do backup' }
}
