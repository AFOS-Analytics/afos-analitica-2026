'use client'

import { useTranslation } from '../i18n/context'
import { SectionTitle, Card } from './ui'
import type { UsPollsData } from '../../lib/dashboard/us-static-data'

/**
 * Limitações declaradas do painel dos EUA. Bloco 5, item 7.
 *
 * ⚠️ POR QUE ESTA SEÇÃO É VISÍVEL E NÃO UM ACORDEÃO FECHADO: limitação que o
 * leitor precisa clicar para ver não foi declarada, foi escondida. Ela fecha a
 * página, que é onde o leitor chega depois de ter visto todos os números.
 *
 * ⚠️ NENHUM NÚMERO É FIXO NO TEXTO. Os que aparecem vêm do próprio arquivo de
 * dado, senão envelhecem calados e a seção que existe para dizer a verdade
 * passa a mentir. A regra do portão é descrita como REGRA, e o valor do dia
 * quem mostra é a seção de mercado, sobre o dado ao vivo.
 */

const T = {
  'pt-BR': {
    titulo: 'Limitações declaradas',
    intro:
      'O que segue não é rodapé. É a lista do que este painel não consegue afirmar, escrita antes que alguém pergunte.',
    mercadoTitulo: 'Sobre o mercado',
    mercado: [
      'O volume é do Polymarket, não do mercado americano inteiro. É uma casa entre outras, e o número mostrado é a probabilidade que ela precifica. Outras casas podem estar em outro preço no mesmo instante.',
      'A Kalshi está fora, e isso é escolha declarada, não esquecimento. Ficar com uma casa só é uma limitação real deste painel, e preferimos dizer isso a somar casas com regras diferentes.',
      'Mercado de faixa fina se move com pouco dinheiro. Onde o volume é baixo, um único participante desloca o preço, e a leitura vale menos do que o número sugere. Por isso o volume aparece ao lado de cada mercado.',
      'Mercado de faixa só entra na tela se as faixas somarem entre 95% e 105%. Fora disso as faixas não podem ser lidas como probabilidade, e o mercado fica coletado mas não exibido, com a soma medida à vista.',
    ],
    pesquisaTitulo: 'Sobre as pesquisas',
    pesquisa: [
      'Não existe registro público obrigatório de pesquisa nos Estados Unidos. Não há equivalente ao protocolo do TSE, então não dá para saber o que foi a campo e ainda não saiu.',
      'A Wikipédia é usada como índice de quais pesquisas existem, e o número é sempre atribuído ao instituto, com link para a fonte primária. O AFOS não redistribui a tabela de ninguém. A ponta desse índice pode atrasar alguns dias em relação ao que os institutos já publicaram.',
      'A média é da casa e é aritmética simples, sem ponderação e sem excluir instituto. Ponderar exigiria uma régua pública de qualidade, e não existe uma desde que o FiveThirtyEight fechou, em março de 2025. Inventar a nossa seria juízo de valor disfarçado de método.',
      'Os agregadores americanos não entram nesta média. Aquilo é modelo de terceiro, e republicar modelo alheio como se fosse leitura da casa é o oposto do que o AFOS faz.',
    ],
    cruzamentoTitulo: 'Sobre o cruzamento',
    cruzamento: [
      'O mercado dá a probabilidade de um partido controlar a casa. A pesquisa dá a vantagem em pontos de voto. São grandezas diferentes, e este painel não subtrai uma da outra: o resultado não teria significado.',
      'Em 2012 os democratas tiveram mais votos e menos cadeiras. A diferença entre voto e cadeira pode ser inteiramente geografia, e nenhuma conta feita aqui separaria uma coisa da outra.',
      'Enquanto o mercado que mede a mesma grandeza da pesquisa não amadurecer, o que se cruza aqui é direção e movimento, nunca nível.',
      'O AFOS relata o cruzamento. Não faz previsão, não recomenda posição e não diz quem vai ganhar.',
    ],
    leituraTitulo: 'Sobre esta leitura',
    qualidade: (lidas: number, pub: number, desc: number, sem: number) =>
      `Do índice foram lidas ${lidas} linhas e publicadas ${pub}. ${desc === 0 ? 'Nenhuma foi descartada' : `${desc} foi descartada por forma ilegível na origem`}, e ${sem === 0 ? 'nenhuma ficou sem link para a fonte primária' : `${sem} ficaram sem link para a fonte primária`}.`,
    media: (n: number, inst: number, dias: number) =>
      `A média da casa cobre ${n} pesquisas de ${inst} institutos nos últimos ${dias} dias.`,
    atualizado: (d: string) => `Índice lido em ${d}.`,
  },
  en: {
    titulo: 'Declared limitations',
    intro:
      'What follows is not a footer. It is the list of what this panel cannot claim, written before anyone asks.',
    mercadoTitulo: 'On the market',
    mercado: [
      'The volume is Polymarket’s, not the entire American market. It is one venue among others, and the number shown is the probability it prices. Other venues may sit at a different price at the same moment.',
      'Kalshi is out, and that is a declared choice, not an oversight. Relying on a single venue is a real limitation of this panel, and we would rather say so than add up venues with different rules.',
      'Thin band markets move on little money. Where volume is low, a single participant shifts the price, and the reading is worth less than the number suggests. That is why volume appears next to every market.',
      'A band market only reaches the screen if its bands total between 95% and 105%. Outside that range the bands cannot be read as probability, so the market keeps being collected but is not displayed, with the measured total in plain sight.',
    ],
    pesquisaTitulo: 'On the polls',
    pesquisa: [
      'There is no mandatory public poll registry in the United States. Nothing matches Brazil’s TSE protocol, so there is no way to know what is in the field and has not been released yet.',
      'Wikipedia is used as an index of which polls exist, and the number is always attributed to the pollster, with a link to the primary source. AFOS does not redistribute anyone’s table. The edge of that index can lag a few days behind what pollsters have already published.',
      'The average is our own and it is a simple mean, unweighted and excluding no pollster. Weighting would require a public quality yardstick, and none has existed since FiveThirtyEight closed in March 2025. Inventing ours would be a value judgement dressed up as method.',
      'American aggregators are not part of this average. Those are third-party models, and republishing someone else’s model as if it were our own reading is the opposite of what AFOS does.',
    ],
    cruzamentoTitulo: 'On the crossing',
    cruzamento: [
      'The market gives the probability of a party controlling the chamber. The poll gives the lead in vote points. These are different quantities, and this panel does not subtract one from the other: the result would carry no meaning.',
      'In 2012 Democrats won more votes and fewer seats. The gap between votes and seats can be entirely geography, and no arithmetic done here would separate the two.',
      'Until the market that measures the same quantity as the polls matures, what is crossed here is direction and movement, never level.',
      'AFOS reports the crossing. It does not forecast, does not recommend a position, and does not say who will win.',
    ],
    leituraTitulo: 'On this reading',
    qualidade: (lidas: number, pub: number, desc: number, sem: number) =>
      `${lidas} rows were read from the index and ${pub} published. ${desc === 0 ? 'None were discarded' : `${desc} was discarded for an unreadable shape at the source`}, and ${sem === 0 ? 'none lack a link to the primary source' : `${sem} lack a link to the primary source`}.`,
    media: (n: number, inst: number, dias: number) =>
      `The house average covers ${n} polls from ${inst} pollsters over the last ${dias} days.`,
    atualizado: (d: string) => `Index read on ${d}.`,
  },
  es: {
    titulo: 'Limitaciones declaradas',
    intro:
      'Lo que sigue no es un pie de página. Es la lista de lo que este panel no puede afirmar, escrita antes de que alguien pregunte.',
    mercadoTitulo: 'Sobre el mercado',
    mercado: [
      'El volumen es de Polymarket, no del mercado estadounidense entero. Es una casa entre otras, y el número mostrado es la probabilidad que ella fija. Otras casas pueden estar en otro precio en el mismo instante.',
      'Kalshi queda fuera, y es una elección declarada, no un olvido. Quedarse con una sola casa es una limitación real de este panel, y preferimos decirlo a sumar casas con reglas distintas.',
      'Un mercado de banda fina se mueve con poco dinero. Donde el volumen es bajo, un solo participante desplaza el precio, y la lectura vale menos de lo que el número sugiere. Por eso el volumen aparece junto a cada mercado.',
      'Un mercado de bandas solo llega a la pantalla si sus bandas suman entre 95% y 105%. Fuera de ese rango las bandas no pueden leerse como probabilidad, así que el mercado se sigue recolectando pero no se exhibe, con la suma medida a la vista.',
    ],
    pesquisaTitulo: 'Sobre las encuestas',
    pesquisa: [
      'No existe un registro público obligatorio de encuestas en Estados Unidos. No hay equivalente al protocolo del TSE brasileño, así que no se puede saber qué está en campo y aún no salió.',
      'La Wikipedia se usa como índice de qué encuestas existen, y el número siempre se atribuye a la encuestadora, con enlace a la fuente primaria. El AFOS no redistribuye la tabla de nadie. La punta de ese índice puede atrasarse algunos días respecto de lo que las encuestadoras ya publicaron.',
      'El promedio es de la casa y es una media aritmética simple, sin ponderación y sin excluir encuestadora. Ponderar exigiría una vara pública de calidad, y no existe desde que FiveThirtyEight cerró, en marzo de 2025. Inventar la nuestra sería un juicio de valor disfrazado de método.',
      'Los agregadores estadounidenses no entran en este promedio. Aquello es modelo de terceros, y republicar el modelo ajeno como si fuera lectura propia es lo opuesto a lo que hace el AFOS.',
    ],
    cruzamentoTitulo: 'Sobre el cruce',
    cruzamento: [
      'El mercado da la probabilidad de que un partido controle la cámara. La encuesta da la ventaja en puntos de voto. Son magnitudes distintas, y este panel no resta una de la otra: el resultado no tendría significado.',
      'En 2012 los demócratas tuvieron más votos y menos escaños. La diferencia entre voto y escaño puede ser enteramente geografía, y ninguna cuenta hecha aquí separaría una cosa de la otra.',
      'Mientras el mercado que mide la misma magnitud que la encuesta no madure, lo que se cruza aquí es dirección y movimiento, nunca nivel.',
      'El AFOS relata el cruce. No hace pronósticos, no recomienda posiciones y no dice quién va a ganar.',
    ],
    leituraTitulo: 'Sobre esta lectura',
    qualidade: (lidas: number, pub: number, desc: number, sem: number) =>
      `Del índice se leyeron ${lidas} líneas y se publicaron ${pub}. ${desc === 0 ? 'Ninguna fue descartada' : `${desc} fue descartada por forma ilegible en el origen`}, y ${sem === 0 ? 'ninguna quedó sin enlace a la fuente primaria' : `${sem} quedaron sin enlace a la fuente primaria`}.`,
    media: (n: number, inst: number, dias: number) =>
      `El promedio de la casa cubre ${n} encuestas de ${inst} encuestadoras en los últimos ${dias} días.`,
    atualizado: (d: string) => `Índice leído el ${d}.`,
  },
}

/** Data no formato de cada idioma. `en` usa mês/dia; pt-BR e es usam dia/mês. */
function fmtData(iso: string, locale: string): string {
  const [a, m, d] = iso.split('-')
  if (!a || !m || !d) return iso
  return locale === 'en' ? `${m}/${d}/${a}` : `${d}/${m}/${a}`
}

function Bloco({ titulo, itens }: { titulo: string; itens: string[] }) {
  return (
    <div>
      <h3 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-gray-600">{titulo}</h3>
      <ul className="space-y-2">
        {itens.map((s, i) => (
          <li key={i} className="flex gap-2 text-sm leading-snug text-gray-700">
            <span aria-hidden="true" className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-gray-400" />
            <span>{s}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function UsLimitationsSection({ data }: { data: UsPollsData | null }) {
  const { locale } = useTranslation()
  const k = (locale === 'en' || locale === 'es' ? locale : 'pt-BR') as keyof typeof T
  const t = T[k]

  const q = data?.qualidade
  const m = data?.mediaAfos

  return (
    <section>
      <SectionTitle icon="⚖️">{t.titulo}</SectionTitle>
      <Card>
        <p className="mb-4 text-sm leading-snug text-gray-800">{t.intro}</p>

        <div className="space-y-5">
          <Bloco titulo={t.mercadoTitulo} itens={t.mercado} />
          <Bloco titulo={t.pesquisaTitulo} itens={t.pesquisa} />
          <Bloco titulo={t.cruzamentoTitulo} itens={t.cruzamento} />

          {(q || m) && (
            <div>
              <h3 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-gray-600">
                {t.leituraTitulo}
              </h3>
              <p className="text-sm leading-snug text-gray-700">
                {q && t.qualidade(q.linhasLidas, q.publicadas, q.descartadasPorForma, q.semFontePrimaria)}
                {m ? ` ${t.media(m.nPesquisas, m.nInstitutos, m.janelaDias)}` : ''}
                {data?.lastUpdate ? ` ${t.atualizado(fmtData(data.lastUpdate, locale))}` : ''}
              </p>
            </div>
          )}
        </div>
      </Card>
    </section>
  )
}
