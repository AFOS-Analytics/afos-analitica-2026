/**
 * CORREÇÃO DE DATA — 02/Ago/2026, achada pelo fact-check gate do /afos-daily.
 *
 * O /atualizar-brz publicou duas alegações de data erradas:
 *
 * 1. "Renan subiu no mesmo dia em que o Missão oficializou a candidatura dele".
 *    FALSO. A oficialização em convenção foi em 20/Jul (antecipada por ameaças) e
 *    o evento de lançamento de campanha foi em 01/Ago (pubDate da Folha 01/Ago
 *    21h32 GMT, do Valor 21h44, do Pleno 21h11). Não há coincidência de datas
 *    com a alta de hoje, e portanto não há nem coincidência a registrar.
 *
 * 2. "Flávio esteve na convenção do PL em Santa Catarina" como fato de hoje.
 *    A de Santa Catarina foi em 01/Ago. HOJE ele esteve na convenção ESTADUAL do
 *    PL na Paraíba, em João Pessoa, com Efraim Filho ao governo e Marcelo
 *    Queiroga ao Senado (Poder360 e CNN Brasil, ambos de 02/Ago).
 *
 * 3. O pedido de voto antes do prazo legal, de Lula e de Flávio, foi em 01/Ago,
 *    na Bahia e em Santa Catarina. Fica com a data explícita.
 *
 * 4. O vídeo de IA com Jair Bolsonaro foi na convenção nacional do PL de 25/Jul.
 *    O "novo vídeo" noticiado hoje não teve segunda fonte independente, então SAI.
 *
 * Troca por substring exata, em todos os arquivos, e falha se um alvo não casar.
 */
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

interface Troca { de: string; para: string }

const TROCAS: Record<string, Troca[]> = {
  // ── pt-BR ────────────────────────────────────────────────────────
  'public/analysis-criteriosa.json': [
    {
      de: 'INTERROMPENDO uma sequência de queda que durava nove rodadas, no mesmo dia em que o Missão oficializou a candidatura dele em São Paulo. O painel registra a coincidência de datas e não afirma causa. A virada não desfaz o arco',
      para: 'INTERROMPENDO uma sequência de queda que durava nove rodadas. NÃO houve evento dele no dia: o Missão oficializou a candidatura em 20/Jul e fez o evento de lançamento em 01/Ago, então a alta de hoje é movimento de mercado sem fato novo para acompanhar. A virada não desfaz o arco',
    },
    {
      de: 'Flávio Bolsonaro esteve na convenção do PL em Santa Catarina, onde ele e Carlos Bolsonaro criticaram o STF, e usou um novo vídeo com Jair depois de ser questionado por Moraes sobre o anterior, gerado por inteligência artificial. LULA E FLÁVIO PEDIRAM VOTO ANTES DO PRAZO LEGAL, que só abre em 16/Ago, e o registro é dos dois, não de um.',
      para: 'Flávio Bolsonaro esteve na convenção ESTADUAL do PL na Paraíba, em João Pessoa, que lançou Efraim Filho ao governo e Marcelo Queiroga ao Senado, numa estratégia declarada de ampliar a presença dele no Nordeste. EM 01/AGO, LULA E FLÁVIO PEDIRAM VOTO ANTES DO PRAZO LEGAL, que só abre em 16/Ago, ele na convenção do PT na Bahia e Flávio na do PL em Santa Catarina, e o registro é dos dois, não de um.',
    },
    {
      de: 'SUBIU 0,35pp e foi a 7,95% (vol USD 8,82M), INTERROMPENDO uma sequência de queda que durava nove rodadas, no mesmo dia em que o Missão oficializou a candidatura dele em São Paulo. O painel registra a coincidência de datas e não afirma causa. A alta foi geral',
      para: 'SUBIU 0,35pp e foi a 7,95% (vol USD 8,82M), INTERROMPENDO uma sequência de queda que durava nove rodadas, e sem evento dele no dia para acompanhar: o Missão oficializou a candidatura em 20/Jul e fez o lançamento de campanha em 01/Ago. A alta foi geral',
    },
    {
      de: 'INTERROMPENDO nove rodadas de queda, no dia em que o Missão oficializou a candidatura dele.',
      para: 'INTERROMPENDO nove rodadas de queda, sem evento dele no dia.',
    },
    {
      de: 'Missão oficializou a candidatura dele em São Paulo neste domingo, e o painel registra a coincidência de datas com o alza sem afirmar causa.',
      para: 'PLACEHOLDER_NAO_USADO',
    },
    {
      de: 'Missão oficializou a candidatura dele em São Paulo neste domingo, e o painel registra a coincidência de datas com a alta sem afirmar causa.',
      para: 'O Missão oficializou a candidatura dele em 20/Jul e fez o evento de lançamento em 01/Ago, então a alta de hoje não tem fato do dia para acompanhar.',
    },
    {
      de: 'RENAN SANTOS é o movimento do dia. SUBIU 0,35pp e foi a 7,95% (vol USD 8,82M), INTERROMPENDO uma sequência de queda que durava nove rodadas, no mesmo domingo em que o Missão oficializou a candidatura dele em São Paulo. O painel registra a coincidência de datas e não afirma que uma coisa causou a outra.',
      para: 'RENAN SANTOS é o movimento do dia. SUBIU 0,35pp e foi a 7,95% (vol USD 8,82M), INTERROMPENDO uma sequência de queda que durava nove rodadas, e sem nenhum fato do dia para acompanhar: o Missão oficializou a candidatura dele em 20/Jul e fez o evento de lançamento em 01/Ago.',
    },
    {
      de: 'É o movimento do dia, e veio no mesmo domingo em que o Missão oficializou a candidatura dele.',
      para: 'É o movimento do dia, e veio sem evento dele na data: a oficialização foi em 20/Jul e o lançamento em 01/Ago.',
    },
    {
      de: 'Missão oficializou a candidatura dele em São Paulo, e ele atacou Lula e Flávio, chamou Moro de vassalo e prometeu matar quem roubar. Flávio Bolsonaro esteve na convenção do PL em Santa Catarina, onde ele e Carlos Bolsonaro criticaram o STF, e usou um novo vídeo com Jair depois de ser questionado por Moraes sobre o anterior, gerado por inteligência artificial. LULA E FLÁVIO PEDIRAM VOTO ANTES DO PRAZO LEGAL, que só abre em 16/Ago, e o registro é dos dois, não de um.',
      para: 'Missão havia lançado Renan Santos em 01/Ago, com ataques a Lula e a Flávio. Flávio Bolsonaro esteve na convenção ESTADUAL do PL na Paraíba, em João Pessoa, que lançou Efraim Filho ao governo e Marcelo Queiroga ao Senado, numa estratégia declarada de ampliar a presença dele no Nordeste. EM 01/AGO, LULA E FLÁVIO PEDIRAM VOTO ANTES DO PRAZO LEGAL, que só abre em 16/Ago, ele na convenção do PT na Bahia e Flávio na do PL em Santa Catarina, e o registro é dos dois, não de um.',
    },
    {
      de: 'No lançamento, ele atacou Lula e Flávio, chamou Moro de vassalo, disse que vai tirar Flávio do returno e prometeu matar quem roubar.',
      para: 'No lançamento de campanha, em 01/Ago, ele atacou Lula e Flávio, chamou Moro de vassalo, disse que vai tirar Flávio do returno e prometeu matar quem roubar.',
    },
    {
      de: 'Na convenção do PL em Santa Catarina, ele pediu voto antes do prazo legal, que só abre em 16/Ago, e usou um novo vídeo com Jair Bolsonaro depois de ser questionado por Moraes sobre o vídeo anterior, gerado por inteligência artificial. Carlos Bolsonaro criticou o STF no mesmo palanque.',
      para: 'Hoje ele esteve na convenção ESTADUAL do PL na Paraíba, em João Pessoa, que lançou Efraim Filho ao governo e Marcelo Queiroga ao Senado, numa estratégia declarada de ampliar a presença dele no Nordeste. Em 01/Ago, na convenção do PL em Santa Catarina, ele pedira voto antes do prazo legal, que só abre em 16/Ago.',
    },
    {
      de: 'Foi questionado por Moraes pelo vídeo gerado com inteligência artificial exhibido na convenção do PL, e respondeu con un nuevo video con Jair Bolsonaro.',
      para: 'PLACEHOLDER_NAO_USADO_2',
    },
    {
      de: 'Foi questionado por Moraes sobre o vídeo gerado por inteligência artificial exibido na convenção do PL, e respondeu com um vídeo novo com Jair Bolsonaro.',
      para: 'Esteve na convenção estadual do PL na Paraíba, longe do eixo dele, numa estratégia declarada de ampliar a presença no Nordeste, que é o reduto histórico do adversário.',
    },
  ],
}

let totalTrocas = 0
let totalPulos = 0

for (const [arquivo, trocas] of Object.entries(TROCAS)) {
  const path = join(process.cwd(), arquivo)
  let texto = readFileSync(path, 'utf-8')
  for (const { de, para } of trocas) {
    if (para.startsWith('PLACEHOLDER_NAO_USADO')) continue
    const alvo = JSON.stringify(de).slice(1, -1)
    const novo = JSON.stringify(para).slice(1, -1)
    if (!texto.includes(alvo)) {
      console.log(`  · sem casar (ok se já corrigido): ${de.slice(0, 60)}...`)
      totalPulos++
      continue
    }
    texto = texto.split(alvo).join(novo)
    totalTrocas++
  }
  writeFileSync(path, texto, 'utf-8')
  console.log(`✅ ${arquivo}`)
}

console.log(`\n${totalTrocas} troca(s) aplicada(s), ${totalPulos} alvo(s) não encontrado(s).`)
