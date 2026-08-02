/**
 * CORREÇÃO DE DATA, 2ª passada — 02/Ago/2026.
 *
 * Reescreve campos INTEIROS por caminho, que é mais seguro que casar substring.
 * Alvos: as alegações de data que o fact-check gate do /afos-daily reprovou.
 *
 * Também sai a atribuição a Tebet ("chamou Flávio de golpista"), que tinha uma
 * só fonte e não passou na two-source rule.
 */
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

function gravar(raiz: any, caminho: string, valor: string): void {
  const partes = caminho.match(/[^.[\]]+/g)!
  let v: any = raiz
  for (let i = 0; i < partes.length - 1; i++) v = v[partes[i]]
  const k = partes[partes.length - 1]
  if (v[k] === undefined) throw new Error(`caminho inexistente: ${caminho}`)
  v[k] = valor
}

const PARAIBA =
  'Flávio Bolsonaro esteve na convenção ESTADUAL do PL na Paraíba, em João Pessoa, que lançou Efraim Filho ao governo e Marcelo Queiroga ao Senado, numa estratégia declarada de ampliar a presença dele no Nordeste, que é reduto histórico do adversário.'
const VOTO_01AGO =
  'EM 01/AGO, e não hoje, Lula e Flávio PEDIRAM VOTO ANTES DO PRAZO LEGAL, que só abre em 16/Ago, ele na convenção do PT na Bahia e Flávio na do PL em Santa Catarina, e o registro é dos dois, não de um.'
const RENAN_SEM_EVENTO =
  'NÃO houve evento dele na data: o Missão oficializou a candidatura em 20/Jul, em convenção antecipada, e fez o evento de lançamento de campanha em 01/Ago. A alta de hoje é movimento de mercado sem fato novo para acompanhar.'

// ── analysis-criteriosa.json ────────────────────────────────────────
const crit = JSON.parse(
  readFileSync(join(process.cwd(), 'public/analysis-criteriosa.json'), 'utf-8'),
)

crit.subtitle = crit.subtitle
  .replace(
    'O DIA POLÍTICO FOI DE CONVENÇÃO NACIONAL DOS DOIS LADOS: o PT oficializou Lula com Alckmin em São Paulo, reunindo sete partidos, na oitava candidatura dele à Presidência, e o Missão oficializou Renan Santos, também em São Paulo. Flávio Bolsonaro esteve na convenção do PL em Santa Catarina, onde ele e Carlos Bolsonaro criticaram o STF, e usou um novo vídeo com Jair depois de ser questionado por Moraes sobre o anterior, gerado por inteligência artificial. Lula e Flávio PEDIRAM VOTO ANTES DO PRAZO LEGAL, que só abre em 16/Ago, e o registro é dos dois, não de um.',
    `O DIA POLÍTICO FOI DA CONVENÇÃO NACIONAL DO PT: o partido oficializou Lula com Alckmin em São Paulo, reunindo SETE partidos (PT, PCdoB, PV, PSB, PDT, PSOL e Rede), a maior coligação de esquerda e centro-esquerda desde 1989, na oitava candidatura dele à Presidência. ${PARAIBA} ${VOTO_01AGO}`,
  )

gravar(crit, 'candidates[0].fracos[4]',
  'Pediu voto antes do prazo legal em 01/Ago, na convenção do PT na Bahia, e Flávio fez o mesmo no mesmo dia, em Santa Catarina. A campanha só abre em 16/Ago, e o TSE já multara Lula em R$ 15 mil por propaganda antecipada em 28/Jul.')

crit.candidates[0].analise = crit.candidates[0].analise
  .replace(
    'NA CONVENÇÃO, ele disse que não quer ser presidente do Bolsa Família e prometeu disputar emendas com o Congresso, e Tebet chamou Flávio de golpista do palanque. Ele pediu voto antes do prazo legal, que abre em 16/Ago, e Flávio fez o mesmo no mesmo dia.',
    'NA CONVENÇÃO, a chapa com Alckmin foi homologada e a coligação reuniu SETE partidos (PT, PCdoB, PV, PSB, PDT, PSOL e Rede), a maior da esquerda e do centro-esquerda desde 1989. Segundo a Folha de S.Paulo, ele disse que não quer ser presidente do Bolsa Família e prometeu disputar emendas com o Congresso. O pedido de voto antes do prazo legal foi em 01/AGO, na convenção da Bahia, e Flávio fez o mesmo no mesmo dia, em Santa Catarina.',
  )

crit.candidates[1].analise = crit.candidates[1].analise
  .replace(
    'NA CONVENÇÃO DO PL EM SANTA CATARINA, ele pediu voto antes do prazo legal, que só abre em 16/Ago, e usou um novo vídeo com Jair Bolsonaro depois de ser questionado por Moraes sobre o vídeo anterior, gerado por inteligência artificial. Carlos Bolsonaro criticou o STF no mesmo palanque.',
    'HOJE ELE FOI À PARAÍBA: esteve na convenção ESTADUAL do PL em João Pessoa, que lançou Efraim Filho ao governo e Marcelo Queiroga ao Senado, numa estratégia declarada de ampliar a presença dele no Nordeste, que é reduto histórico do adversário. Em 01/Ago, na convenção do PL em Santa Catarina, ele pedira voto antes do prazo legal, que só abre em 16/Ago.',
  )

gravar(crit, 'candidates[2].fortes[3]',
  'O Missão oficializou a candidatura dele em 20/Jul e fez o evento de lançamento em 01/Ago, então a alta de hoje NÃO tem fato do dia para acompanhar.')

crit.candidates[2].analise = crit.candidates[2].analise
  .replace(
    'e sem nenhum fato do dia para acompanhar: o Missão oficializou a candidatura dele em 20/Jul e fez o evento de lançamento em 01/Ago.',
    `e ${RENAN_SEM_EVENTO}`,
  )
  .replace(
    'No lançamento de campanha, em 01/Ago, ele atacou',
    'No evento de lançamento de campanha, em 01/Ago, ele atacou',
  )

crit.cruzamento = crit.cruzamento
  .replace(
    'O DIA POLÍTICO FOI DE CONVENÇÃO NACIONAL DOS DOIS LADOS. O PT oficializou Lula com Alckmin em São Paulo, reunindo sete partidos, na oitava candidatura dele à Presidência e na busca do quarto mandato; ele disse que não quer ser presidente do Bolsa Família e prometeu disputar emendas com o Congresso, e Tebet chamou Flávio de golpista do palanque.',
    'O DIA POLÍTICO FOI DA CONVENÇÃO NACIONAL DO PT. O partido oficializou Lula com Alckmin em São Paulo, no Expo Center Norte, reunindo SETE partidos (PT, PCdoB, PV, PSB, PDT, PSOL e Rede), a maior coligação de esquerda e centro-esquerda desde 1989, na oitava candidatura dele à Presidência e na busca do quarto mandato. Segundo a Folha de S.Paulo, ele disse que não quer ser presidente do Bolsa Família e prometeu disputar emendas com o Congresso.',
  )
  .replace(
    'Missão havia lançado Renan Santos em 01/Ago, com ataques a Lula e a Flávio. Flávio Bolsonaro esteve na convenção ESTADUAL do PL na Paraíba, em João Pessoa, que lançou Efraim Filho ao governo e Marcelo Queiroga ao Senado, numa estratégia declarada de ampliar a presença dele no Nordeste. EM 01/AGO, LULA E FLÁVIO PEDIRAM VOTO ANTES DO PRAZO LEGAL, que só abre em 16/Ago, ele na convenção do PT na Bahia e Flávio na do PL em Santa Catarina, e o registro é dos dois, não de um.',
    `O Missão havia lançado Renan Santos em 01/Ago, com ataques a Lula e a Flávio. ${PARAIBA} ${VOTO_01AGO}`,
  )

writeFileSync(
  join(process.cwd(), 'public/analysis-criteriosa.json'),
  JSON.stringify(crit, null, 2) + '\n',
  'utf-8',
)
console.log('✅ analysis-criteriosa.json')

// ── analysis-data.json ──────────────────────────────────────────────
const data = JSON.parse(readFileSync(join(process.cwd(), 'public/analysis-data.json'), 'utf-8'))
const C = data.cards

C.sentimento.text2 = C.sentimento.text2.replace(
  'INTERROMPENDO uma sequência de queda que durava nove rodadas, no mesmo dia em que o Missão oficializou a candidatura dele. O painel registra a coincidência de datas e não afirma causa.',
  `INTERROMPENDO uma sequência de queda que durava nove rodadas. ${RENAN_SEM_EVENTO}`,
)

C.sentimento.direita = C.sentimento.direita.replace(
  'Na convenção do PL em Santa Catarina, ele pediu voto antes do prazo legal, que só abre em 16/Ago, e usou um novo vídeo com Jair Bolsonaro depois de ser questionado por Moraes sobre o vídeo anterior, gerado por inteligência artificial. Carlos Bolsonaro criticou o STF no mesmo palanque.',
  'HOJE ELE FOI À PARAÍBA: esteve na convenção ESTADUAL do PL em João Pessoa, que lançou Efraim Filho ao governo e Marcelo Queiroga ao Senado, numa estratégia declarada de ampliar a presença dele no Nordeste, que é reduto histórico do adversário. Em 01/Ago, na convenção do PL em Santa Catarina, ele pedira voto antes do prazo legal, que só abre em 16/Ago.',
)

C.sentimento.esquerda = C.sentimento.esquerda.replace(
  'A convenção nacional do PT, em São Paulo, oficializou a chapa com Alckmin de vice e reuniu sete partidos, na oitava vez que Lula é candidato à Presidência e na busca do quarto mandato. Ele disse que não quer ser presidente do Bolsa Família e prometeu disputar emendas com o Congresso, e Tebet chamou Flávio de golpista do palanque. Ele também pediu voto antes do prazo legal, que abre em 16/Ago, e Flávio fez o mesmo no mesmo dia.',
  'A convenção nacional do PT, no Expo Center Norte em São Paulo, homologou a chapa com Alckmin de vice e reuniu SETE partidos (PT, PCdoB, PV, PSB, PDT, PSOL e Rede), a maior coligação de esquerda e centro-esquerda desde 1989, na oitava vez que Lula é candidato à Presidência e na busca do quarto mandato. Segundo a Folha de S.Paulo, ele disse que não quer ser presidente do Bolsa Família e prometeu disputar emendas com o Congresso. O pedido de voto antes do prazo legal foi em 01/AGO, na convenção da Bahia, e Flávio fez o mesmo no mesmo dia, em Santa Catarina.',
)

C.sentimento.terceiraVia = C.sentimento.terceiraVia.replace(
  'UP 0,35pp',
  'UP 0,35pp',
)

C.inss.text1 = C.inss.text1.replace(
  'O dia político foi de CONVENÇÃO NACIONAL, dos dois lados. O PT formalmente lançou Lula em São Paulo',
  'O dia político foi da CONVENÇÃO NACIONAL DO PT. O partido oficializou Lula em São Paulo',
).replace(
  'O dia político foi de CONVENÇÃO NACIONAL, dos dois lados. O PT oficializou Lula em São Paulo, com Alckmin de vice e sete partidos na aliança, na oitava candidatura dele à Presidência. O Missão oficializou Renan Santos, também em São Paulo. E Flávio Bolsonaro esteve na convenção do PL em Santa Catarina. Lula e Flávio pediram voto antes do prazo legal, que só abre em 16/Ago, e o registro é dos dois, não de um.',
  'O dia político foi da CONVENÇÃO NACIONAL DO PT. O partido oficializou Lula em São Paulo, com Alckmin de vice e SETE partidos na coligação (PT, PCdoB, PV, PSB, PDT, PSOL e Rede), a maior da esquerda e do centro-esquerda desde 1989, na oitava candidatura dele à Presidência. Flávio Bolsonaro esteve na convenção ESTADUAL do PL na Paraíba, em João Pessoa, que lançou Efraim Filho ao governo e Marcelo Queiroga ao Senado. O Missão havia lançado Renan Santos em 01/Ago, e no mesmo 01/Ago Lula e Flávio pediram voto antes do prazo legal, que só abre em 16/Ago, e o registro é dos dois, não de um.',
)

C.inss.text2 = C.inss.text2.replace(
  'interrompendo nove rodadas de queda, no mesmo dia da convenção que o oficializou.',
  'interrompendo nove rodadas de queda, e sem evento dele na data: a convenção que o oficializou foi em 20/Jul e o lançamento de campanha em 01/Ago.',
)

C.inss.conclusao = C.inss.conclusao.replace(
  'O movimento do dia foi de Renan Santos, que subiu 0,35pp e interrompeu nove rodadas de queda no mesmo dia da convenção que o oficializou, e o painel registra a coincidência de datas sem afirmar causa. Na política, o PT oficializou Lula com Alckmin em São Paulo, o Missão oficializou Renan, Flávio esteve na convenção do PL em Santa Catarina, e os dois principais pediram voto antes do prazo legal.',
  'O movimento do dia foi de Renan Santos, que subiu 0,35pp e interrompeu nove rodadas de queda SEM evento dele na data, porque a convenção que o oficializou foi em 20/Jul e o lançamento de campanha em 01/Ago. Na política, o PT oficializou Lula com Alckmin em São Paulo, reunindo sete partidos, e Flávio foi à convenção estadual do PL na Paraíba. O pedido de voto antes do prazo legal, dos dois, foi em 01/Ago.',
)

C.stf.moraes =
  'Sem despacho novo de Moraes capturado neste domingo. Permanece o quadro de restrições sobre a comunicação de Jair Bolsonaro em prisão domiciliar, que já alcançava a divulgação de manifestos político-eleitorais por terceiros. No campo pessoal da família, liberou a cunhada a cuidar de Jair Bolsonaro enquanto Michelle passava por exames em Brasília.'

C.stf.nexo = C.stf.nexo.replace(
  'O nexo deste domingo é de CONVENÇÃO NACIONAL, e o eixo judicial entra pela fricção institucional. O PT oficializou Lula com Alckmin em São Paulo, reunindo sete partidos, e o Missão oficializou Renan Santos, também em São Paulo. Flávio Bolsonaro esteve na convenção do PL em Santa Catarina, onde ele e Carlos Bolsonaro criticaram o STF, e usou um novo vídeo com Jair depois de ser questionado por Moraes sobre o anterior, gerado por inteligência artificial. Lula e Flávio pediram voto antes do prazo legal, que se abre em 16/Ago.',
  'O nexo deste domingo é a CONVENÇÃO NACIONAL DO PT, e o eixo judicial entra pela fricção institucional. O partido oficializou Lula com Alckmin em São Paulo, reunindo sete partidos, a maior coligação de esquerda e centro-esquerda desde 1989. Flávio Bolsonaro esteve na convenção ESTADUAL do PL na Paraíba, em João Pessoa, numa estratégia declarada de ampliar a presença dele no Nordeste. O Missão havia lançado Renan Santos em 01/Ago, e no mesmo 01/Ago Lula e Flávio pediram voto antes do prazo legal, que só abre em 16/Ago.',
)

writeFileSync(
  join(process.cwd(), 'public/analysis-data.json'),
  JSON.stringify(data, null, 2) + '\n',
  'utf-8',
)
console.log('✅ analysis-data.json')

// ── polls-data.json ─────────────────────────────────────────────────
const polls = JSON.parse(readFileSync(join(process.cwd(), 'public/polls-data.json'), 'utf-8'))
const pm = polls.polymarketComparison

pm.note = pm.note
  .replace(
    'INTERROMPENDO nove rodadas de queda, no mesmo domingo em que o Missão oficializou a candidatura dele, e o painel registra a coincidência de datas sem afirmar causa.',
    `INTERROMPENDO nove rodadas de queda, e SEM evento dele na data: o Missão oficializou a candidatura em 20/Jul e fez o lançamento de campanha em 01/Ago.`,
  )
  .replace(
    'No dia político, o PT oficializou Lula com Alckmin em São Paulo e o Missão oficializou Renan, enquanto Flávio esteve na convenção do PL em Santa Catarina; os dois principais pediram voto antes do prazo legal, que se abre em 16/Ago, e seguem sem ampliar alianças, com o Centrão neutro.',
    'No dia político, o PT oficializou Lula com Alckmin em São Paulo, reunindo sete partidos, enquanto Flávio esteve na convenção ESTADUAL do PL na Paraíba. O pedido de voto antes do prazo legal, dos dois, foi em 01/Ago, e os dois seguem sem ampliar alianças, com o Centrão neutro.',
  )

const cands = pm.candidates
for (const c of cands) {
  if (c.name === 'Renan Santos') {
    c.tendenciaPolymarket = c.tendenciaPolymarket.replace(
      'INTERROMPENDO uma racha de caídas',
      'INTERROMPENDO uma sequência de queda',
    ).replace(
      'INTERROMPENDO uma sequência de queda que durava nove rodadas, no mesmo domingo em que o Missão oficializou a candidatura dele em São Paulo. O painel registra a coincidência de datas e não afirma causa.',
      `INTERROMPENDO uma sequência de queda que durava nove rodadas. ${RENAN_SEM_EVENTO}`,
    )
    c.tendenciaPesquisa = c.tendenciaPesquisa.replace(
      'Neste domingo o Missão oficializou a candidatura dele em São Paulo, e ele atacou Lula e Flávio, chamou Moro de vassalo, disse que vai tirar Flávio do returno e prometeu matar quem roubar.',
      'O Missão oficializou a candidatura dele em 20/Jul e fez o evento de lançamento de campanha em 01/Ago, quando ele atacou Lula e Flávio, chamou Moro de vassalo, disse que vai tirar Flávio do returno e prometeu matar quem roubar.',
    )
  }
  if (c.name === 'Flávio Bolsonaro') {
    c.tendenciaPesquisa = c.tendenciaPesquisa.replace(
      'Na convenção do PL em Santa Catarina ele pediu voto antes do prazo legal, que só abre em 16/Ago, e usou um novo vídeo com Jair Bolsonaro depois de ser questionado por Moraes sobre o anterior, gerado por inteligência artificial.',
      'Neste domingo esteve na convenção ESTADUAL do PL na Paraíba, em João Pessoa, que lançou Efraim Filho ao governo e Marcelo Queiroga ao Senado, numa estratégia declarada de ampliar a presença dele no Nordeste. Em 01/Ago, na convenção do PL em Santa Catarina, ele pedira voto antes do prazo legal, que só abre em 16/Ago.',
    )
  }
}

writeFileSync(
  join(process.cwd(), 'public/polls-data.json'),
  JSON.stringify(polls, null, 2) + '\n',
  'utf-8',
)
console.log('✅ polls-data.json')

// ── verificação final: nenhuma alegação de data errada sobreviveu ───
const PROIBIDO = [
  'no mesmo dia em que o Missão',
  'no mesmo domingo em que o Missão',
  'no mesmo dia da convenção que o oficializou',
  'CONVENÇÃO NACIONAL, dos dois lados',
  'CONVENÇÃO NACIONAL DOS DOIS LADOS',
  'novo vídeo com Jair',
]
let sujo = 0
for (const arq of ['public/analysis-criteriosa.json', 'public/analysis-data.json', 'public/polls-data.json']) {
  const t = readFileSync(join(process.cwd(), arq), 'utf-8')
  for (const p of PROIBIDO) {
    const alvo = JSON.stringify(p).slice(1, -1)
    if (t.includes(alvo)) { console.error(`❌ ${arq}: ainda contém "${p}"`); sujo++ }
  }
}
console.log(sujo === 0 ? '\n✅ nenhuma alegação de data reprovada sobreviveu nos 3 JSON' : `\n❌ ${sujo} sobrevivente(s)`)
process.exit(sujo === 0 ? 0 : 1)
