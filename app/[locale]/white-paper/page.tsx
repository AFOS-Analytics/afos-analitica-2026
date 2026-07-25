import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isValidLocale } from '../../../lib/afos-daily/loader'
import { buildMetadata } from '../../../lib/seo/metadata'
import type { Locale } from '../../../lib/i18n/config'
import { WhitePaperShell, type WhitePaperContent } from './WhitePaperShell'
import { SUPPORTED_LOCALES } from '../../../lib/afos-daily/loader'

// Sem isto o Next nao sabe quais locales pre-renderizar e serve a pagina sob
// demanda a cada requisicao, mesmo ela sendo conteudo estatico. Instalado
// 25/Jul/2026, ao medir que 11 paginas caiam nesse caso.
export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map(locale => ({ locale }))
}


interface Props { params: Promise<{ locale: string }> }

interface PageContent extends WhitePaperContent {
  title: string
  description: string
}

const CONTENT: Record<string, PageContent> = {
  'pt-BR': {
    title: 'White Paper | AFOS Analytics',
    description: 'White paper da AFOS Analytics: objetivos e método. A divergência entre mercados de previsão e pesquisas como sinal, validada pelo resultado real.',
    h1: 'White Paper',
    tagline: 'Mercados, pesquisas e o sinal da divergência: objetivos e método do projeto',
    updated: 'Nota de trabalho, junho de 2026',
    intro: [
      'Duas décadas de pesquisa sobre mercados de previsão e pesquisas de opinião (Wolfers e Zitzewitz, 2004; Rothschild, POQ 2009) estabeleceram que cada um carrega informação e cada um carrega viés, e que mercados de-enviesados muitas vezes superam pesquisas de-enviesadas no início do ciclo. A pergunta prática que decorre disso tem sido mais difícil de operacionalizar em escala:',
    ],
    question: 'Quando mercados e pesquisas discordam, o que essa discordância nos diz, e ela se sustenta diante dos resultados reais?',
    questionAfter: 'A AFOS Analytics é uma tentativa de responder a isso de forma contínua, em vários países, em público, com os dados deixados abertos para inspeção.',
    thesisIntro: 'Nossa tese de trabalho é simples e deliberadamente falseável:',
    thesis: 'A divergência entre o que os mercados de dinheiro real precificam e o que as pesquisas reportam é, em si, um sinal, e seu poder informativo pode ser verificado contra o resultado final.',
    thesisAfter: 'Não afirmamos que a divergência sempre favorece o mercado. Afirmamos que ela é uma quantidade mensurável que vale a pena acompanhar, e que se ela apontou na direção certa é uma questão empírica que respondemos caso a caso, inclusive nos casos em que falhou.',
    sections: [
      {
        heading: 'O que integramos',
        paras: ['Para cada eleição, reunimos quatro camadas em um único painel atualizado continuamente:'],
        bullets: [
          { lead: 'Mercados de previsão com dinheiro real', text: '(por exemplo, Polymarket): probabilidades implícitas.' },
          { lead: 'Pesquisas de opinião tradicionais', text: 'de múltiplos institutos, com os metadados de amostragem e metodologia preservados onde a fonte os publica.' },
          { lead: 'Cobertura da imprensa de referência', text: 'com data e hora e arquivada (Wayback), para que cada movimento de mercado possa ser ancorado a um evento do mundo real.' },
          { lead: 'Síntese gerada por IA', text: 'que resume, nunca substitui, os números subjacentes.' },
        ],
      },
      {
        heading: 'A leitura de divergência',
        paras: [
          'A leitura de divergência é descritiva, ainda não um estimador calibrado: para cada candidato, acompanhamos a distância entre a probabilidade implícita no mercado e a posição implícita nas pesquisas ao longo do ciclo, e perguntamos se e quando essa distância antecipou o resultado real.',
          'Somos explícitos quanto ao fato de isso ser observacional. Transformá-la em uma previsão devidamente calibrada é uma das questões em aberto do projeto.',
        ],
      },
      {
        heading: 'Validação, inclusive das falhas',
        paras: [
          'O projeto começou pela validação prática, e não por um modelo. Reconstruímos o quadro mercados-versus-pesquisas para eleições cujos resultados já são conhecidos e conferimos a leitura de divergência contra o desfecho efetivo. O conjunto validado cobre oito eleições nacionais em três continentes (à parte o caso do Brasil): Peru, Colômbia, Chile, Alemanha, Canadá, México 2024, Reino Unido 2024 e Estados Unidos 2024.',
          'Dois pontos que tratamos como estruturais:',
        ],
        bullets: [
          { lead: 'Convergência também conta.', text: 'Na Alemanha e na Colômbia o sinal foi de divergência quase nula, e o resultado confirmou isso. O validador é o resultado real, não o tamanho da divergência.' },
          { lead: 'Publicamos os erros.', text: 'No caso dos EUA em 2024, o mercado do colégio eleitoral leu o resultado corretamente, enquanto o mercado do voto popular não. Documentamos a falha em vez de escondê-la, porque um método que só exibe os acertos não é um método.' },
        ],
      },
      {
        heading: 'Dados e abertura',
        paras: ['Tudo é aberto e citável.'],
        bullets: [
          'Os conjuntos de dados estão depositados no Harvard Dataverse (coleção afos-analytics), com DOIs próprios, sob licença CC BY 4.0, e espelhados no Hugging Face.',
          'A própria plataforma é de código aberto.',
          'O objetivo é que qualquer afirmação que façamos possa ser auditada e reproduzida a partir dos dados depositados.',
        ],
      },
      {
        heading: 'Objetivos',
        bullets: [
          { lead: 'Curto prazo:', text: 'consolidar a leitura de divergência, de um indicador descritivo para algo com calibração e incerteza explícitas, e ampliar a biblioteca de casos validados.' },
          { lead: 'Médio prazo:', text: 'uma leitura global, em tempo real, do risco político, que trate cada eleição como uma instância comparável do mesmo problema de medição mercados-versus-pesquisas, em vez de uma série de histórias nacionais isoladas.' },
        ],
        paras: ['Declaramos a ambição com clareza, mantendo modestas as afirmações de curto prazo. Os casos validados são a evidência; o enquadramento global é a direção, não um resultado pronto.'],
      },
      {
        heading: 'Questões em aberto',
        paras: ['Algumas questões sobre as quais estamos genuinamente incertos e nas quais trabalhamos:'],
        bullets: [
          'Qual a melhor forma de de-enviesar mercados rasos ou de baixa liquidez (a profundidade do Polymarket varia enormemente entre eleições) antes de compará-los às pesquisas.',
          'Se uma correção do tipo MRP no lado das pesquisas altera qual sinal "vence" na divergência.',
          'Como formalizar "divergência como sinal" em uma probabilidade calibrada, em vez de uma distância descritiva.',
          'Efeitos de seleção: as eleições que atraem liquidez de mercado não são uma amostra aleatória das eleições.',
        ],
      },
      {
        heading: 'Limitações',
        paras: ['O conjunto validado ainda é pequeno. A liquidez dos mercados é desigual. A ancoragem na imprensa é curada, não exaustiva. A leitura de divergência é, hoje, um instrumento descritivo, e tomamos cuidado para não exagerá-la. Preferimos ser corrigidos cedo a ser impressionantes no papel.'],
      },
    ],
    closing: [
      'Dados: Harvard Dataverse (coleção afos-analytics, CC BY 4.0). Plataforma de código aberto.',
      'Contato: founder@afos-analytics.com',
    ],
  },
  en: {
    title: 'White Paper | AFOS Analytics',
    description: 'AFOS Analytics white paper: project goals and method. The divergence between prediction markets and polls as a signal, validated by the real outcome.',
    h1: 'White Paper',
    tagline: 'Markets, polls, and the divergence signal: project goals and method',
    updated: 'Working note, June 2026',
    intro: [
      'Two decades of research on prediction markets and polls (Wolfers and Zitzewitz, 2004; Rothschild, POQ 2009) established that each carries information and each carries bias, and that de-biased markets often outperform de-biased polls early in the cycle. The practical question that follows has been harder to operationalize at scale:',
    ],
    question: 'When markets and polls disagree, what does the disagreement tell us, and does it hold up against real outcomes?',
    questionAfter: 'AFOS Analytics is an attempt to answer this continuously, across countries, in public, with the data left open for inspection.',
    thesisIntro: 'Our working thesis is simple and deliberately falsifiable:',
    thesis: 'The divergence between what real-money markets price and what polls report is itself a signal, and its informativeness can be checked against the eventual result.',
    thesisAfter: 'We do not claim divergence always favors the market. We claim it is a measurable quantity worth tracking, and that whether it pointed the right way is an empirical question we answer case by case, including the cases where it failed.',
    sections: [
      {
        heading: 'What we integrate',
        paras: ['For each race we bring four layers into one continuously updated panel:'],
        bullets: [
          { lead: 'Real-money prediction markets', text: '(e.g. Polymarket): implied probabilities.' },
          { lead: 'Traditional opinion polls', text: 'from multiple institutes, with sampling and methodological metadata preserved where the source publishes it.' },
          { lead: 'Mainstream press coverage', text: 'time-stamped and archived (Wayback) so each market move can be anchored to a real-world event.' },
          { lead: 'AI-generated synthesis', text: 'that summarizes, never substitutes, the underlying numbers.' },
        ],
      },
      {
        heading: 'The divergence reading',
        paras: [
          'The divergence reading is descriptive, not yet a calibrated estimator: for each candidate we track the gap between market-implied probability and poll-implied standing over the cycle, and we ask whether and when that gap anticipated the real result.',
          'We are explicit that this is observational. Turning it into a properly calibrated forecast is one of the project’s open questions.',
        ],
      },
      {
        heading: 'Validation, including the failures',
        paras: [
          'The project began with practical validation rather than a model. We reconstructed the markets-versus-polls picture for elections whose results are now known and checked the divergence reading against the actual outcome. The validated set spans eight national elections across three continents (Brazil context aside): Peru, Colombia, Chile, Germany, Canada, Mexico 2024, the United Kingdom 2024, and the United States 2024.',
          'Two points we treat as load-bearing:',
        ],
        bullets: [
          { lead: 'Convergence counts too.', text: 'In Germany and Colombia the signal was near-zero divergence, and the result confirmed it. The validator is the real outcome, not the size of the divergence.' },
          { lead: 'We publish the misses.', text: 'In the US 2024 case the electoral-college market read the result correctly while the popular-vote market did not. We document the failure rather than hide it, because a method that only displays its wins is not a method.' },
        ],
      },
      {
        heading: 'Data and openness',
        paras: ['Everything is open and citable.'],
        bullets: [
          'Datasets are deposited in the Harvard Dataverse (collection afos-analytics) with their own DOIs, under CC BY 4.0, and mirrored on Hugging Face.',
          'The platform itself is open source.',
          'The aim is that any claim we make can be audited and reproduced from the deposited data.',
        ],
      },
      {
        heading: 'Goals',
        bullets: [
          { lead: 'Near term:', text: 'harden the divergence reading from a descriptive indicator into something with explicit calibration and uncertainty, and widen the validated-case library.' },
          { lead: 'Medium term:', text: 'a real-time, global reading of political risk that treats every election as a comparable instance of the same markets-versus-polls measurement problem, rather than a series of one-off national stories.' },
        ],
        paras: ['We state the ambition plainly while keeping the near-term claims modest. The validated cases are the evidence; the global framing is the direction, not a finished result.'],
      },
      {
        heading: 'Open questions',
        paras: ['A few questions we are genuinely unsure about and are working on:'],
        bullets: [
          'How best to de-bias thin or low-liquidity markets (Polymarket depth varies enormously by race) before comparing them to polls.',
          'Whether an MRP-style correction on the polling side changes which signal "wins" in the divergence.',
          'How to formalize "divergence as signal" into a calibrated probability rather than a descriptive gap.',
          'Selection effects: the races that attract market liquidity are not a random sample of elections.',
        ],
      },
      {
        heading: 'Limitations',
        paras: ['The validated set is still small. Market liquidity is uneven. Press anchoring is curated, not exhaustive. The divergence reading is, today, a descriptive instrument and we are careful not to oversell it. We would rather be corrected early than be impressive on paper.'],
      },
    ],
    closing: [
      'Data: Harvard Dataverse (collection afos-analytics, CC BY 4.0). Open-source platform.',
      'Contact: founder@afos-analytics.com',
    ],
  },
  es: {
    title: 'White Paper | AFOS Analytics',
    description: 'White paper de AFOS Analytics: objetivos y método. La divergencia entre mercados de predicción y encuestas como señal, validada por el resultado real.',
    h1: 'White Paper',
    tagline: 'Mercados, encuestas y la señal de la divergencia: objetivos y método del proyecto',
    updated: 'Nota de trabajo, junio de 2026',
    intro: [
      'Dos décadas de investigación sobre mercados de predicción y encuestas de opinión (Wolfers y Zitzewitz, 2004; Rothschild, POQ 2009) establecieron que cada uno aporta información y cada uno aporta sesgo, y que los mercados de-sesgados a menudo superan a las encuestas de-sesgadas al inicio del ciclo. La pregunta práctica que se desprende ha sido más difícil de operacionalizar a escala:',
    ],
    question: 'Cuando mercados y encuestas discrepan, ¿qué nos dice esa discrepancia, y se sostiene frente a los resultados reales?',
    questionAfter: 'AFOS Analytics es un intento de responder a esto de forma continua, en varios países, en público, con los datos abiertos para inspección.',
    thesisIntro: 'Nuestra tesis de trabajo es simple y deliberadamente falsable:',
    thesis: 'La divergencia entre lo que los mercados de dinero real valoran y lo que las encuestas reportan es, en sí misma, una señal, y su poder informativo puede verificarse frente al resultado final.',
    thesisAfter: 'No afirmamos que la divergencia siempre favorezca al mercado. Afirmamos que es una cantidad medible que vale la pena seguir, y que si apuntó en la dirección correcta es una cuestión empírica que respondemos caso por caso, incluso en los casos en que falló.',
    sections: [
      {
        heading: 'Lo que integramos',
        paras: ['Para cada elección reunimos cuatro capas en un único panel actualizado continuamente:'],
        bullets: [
          { lead: 'Mercados de predicción con dinero real', text: '(por ejemplo, Polymarket): probabilidades implícitas.' },
          { lead: 'Encuestas de opinión tradicionales', text: 'de múltiples institutos, con los metadatos de muestreo y metodología preservados donde la fuente los publica.' },
          { lead: 'Cobertura de la prensa de referencia', text: 'con fecha y hora y archivada (Wayback), para que cada movimiento de mercado pueda anclarse a un evento del mundo real.' },
          { lead: 'Síntesis generada por IA', text: 'que resume, nunca sustituye, los números subyacentes.' },
        ],
      },
      {
        heading: 'La lectura de divergencia',
        paras: [
          'La lectura de divergencia es descriptiva, todavía no un estimador calibrado: para cada candidato seguimos la distancia entre la probabilidad implícita en el mercado y la posición implícita en las encuestas a lo largo del ciclo, y preguntamos si y cuándo esa distancia anticipó el resultado real.',
          'Somos explícitos en que esto es observacional. Transformarla en una previsión debidamente calibrada es una de las cuestiones abiertas del proyecto.',
        ],
      },
      {
        heading: 'Validación, incluidas las fallas',
        paras: [
          'El proyecto empezó por la validación práctica, y no por un modelo. Reconstruimos el cuadro mercados-versus-encuestas para elecciones cuyos resultados ya se conocen y cotejamos la lectura de divergencia contra el desenlace efectivo. El conjunto validado cubre ocho elecciones nacionales en tres continentes (aparte del caso de Brasil): Perú, Colombia, Chile, Alemania, Canadá, México 2024, Reino Unido 2024 y Estados Unidos 2024.',
          'Dos puntos que tratamos como estructurales:',
        ],
        bullets: [
          { lead: 'La convergencia también cuenta.', text: 'En Alemania y Colombia la señal fue de divergencia casi nula, y el resultado lo confirmó. El validador es el resultado real, no el tamaño de la divergencia.' },
          { lead: 'Publicamos los errores.', text: 'En el caso de EE. UU. en 2024, el mercado del colegio electoral leyó el resultado correctamente, mientras que el mercado del voto popular no. Documentamos la falla en vez de esconderla, porque un método que solo exhibe los aciertos no es un método.' },
        ],
      },
      {
        heading: 'Datos y apertura',
        paras: ['Todo es abierto y citable.'],
        bullets: [
          'Los conjuntos de datos están depositados en el Harvard Dataverse (colección afos-analytics), con DOIs propios, bajo licencia CC BY 4.0, y replicados en Hugging Face.',
          'La propia plataforma es de código abierto.',
          'El objetivo es que cualquier afirmación que hagamos pueda auditarse y reproducirse a partir de los datos depositados.',
        ],
      },
      {
        heading: 'Objetivos',
        bullets: [
          { lead: 'Corto plazo:', text: 'consolidar la lectura de divergencia, de un indicador descriptivo a algo con calibración e incertidumbre explícitas, y ampliar la biblioteca de casos validados.' },
          { lead: 'Mediano plazo:', text: 'una lectura global, en tiempo real, del riesgo político, que trate cada elección como una instancia comparable del mismo problema de medición mercados-versus-encuestas, en vez de una serie de historias nacionales aisladas.' },
        ],
        paras: ['Declaramos la ambición con claridad, manteniendo modestas las afirmaciones de corto plazo. Los casos validados son la evidencia; el encuadre global es la dirección, no un resultado terminado.'],
      },
      {
        heading: 'Cuestiones abiertas',
        paras: ['Algunas cuestiones sobre las que estamos genuinamente inciertos y en las que trabajamos:'],
        bullets: [
          'Cuál es la mejor forma de de-sesgar mercados delgados o de baja liquidez (la profundidad de Polymarket varía enormemente entre elecciones) antes de compararlos con las encuestas.',
          'Si una corrección del tipo MRP en el lado de las encuestas altera qué señal "gana" en la divergencia.',
          'Cómo formalizar "divergencia como señal" en una probabilidad calibrada, en vez de una distancia descriptiva.',
          'Efectos de selección: las elecciones que atraen liquidez de mercado no son una muestra aleatoria de las elecciones.',
        ],
      },
      {
        heading: 'Limitaciones',
        paras: ['El conjunto validado todavía es pequeño. La liquidez de los mercados es desigual. El anclaje en la prensa es curado, no exhaustivo. La lectura de divergencia es, hoy, un instrumento descriptivo, y tenemos cuidado de no exagerarla. Preferimos ser corregidos temprano a ser impresionantes en el papel.'],
      },
    ],
    closing: [
      'Datos: Harvard Dataverse (colección afos-analytics, CC BY 4.0). Plataforma de código abierto.',
      'Contacto: founder@afos-analytics.com',
    ],
  },
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const c = CONTENT[params.locale as keyof typeof CONTENT] ?? CONTENT['pt-BR']
  return buildMetadata({ title: c.title, description: c.description, path: 'white-paper' }, params.locale as Locale)
}

export default async function WhitePaperPage(props: Props) {
  const params = await props.params
  if (!isValidLocale(params.locale)) notFound()
  const c = CONTENT[params.locale as keyof typeof CONTENT] ?? CONTENT['pt-BR']
  return <WhitePaperShell locale={params.locale} c={c} />
}
