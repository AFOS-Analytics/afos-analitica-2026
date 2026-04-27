/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AFOS Hoje — 26 de abril de 2026 | AFOS Analytics',
  description: 'Síntese do dia 26/Abr/2026: Lula cai para 37.5% (gap -1.65pp Flávio), STF impeach nova máxima histórica absoluta 16%, Caiado ultrapassa Renan no 3º lugar (1ª vez no ciclo), reorganização massiva Senado (PL recupera 83.5%, PSD/MDB/PT despencam). Análise cruzada auditável.',
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://afos-analytics.com/pt-BR/hoje' },
}

export default function AfosHojePtBRPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <article className="max-w-[720px] mx-auto px-5 md:px-10 py-12 md:py-14">
        <nav className="mb-10 text-sm">
          <a href="/pt-BR/dashboard" className="text-primary hover:underline">← Voltar ao Dashboard</a>
        </nav>

        <p className="text-center text-xs font-extrabold text-primary uppercase tracking-[0.25em] mb-2">AFOS Hoje · Síntese do Dia</p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary text-center mb-3 tracking-tight leading-tight">
          26 de abril de 2026
        </h1>
        <p className="text-center text-gray-600 text-base font-medium mb-2">
          Polymarket × Pesquisas × Notícias
        </p>
        <p className="text-center text-gray-400 text-xs mb-12 italic">
          Síntese gerada com base em dados auditáveis. Cada alegação cita sua fonte.
        </p>

        {/* LEDE */}
        <div className="border-l-4 border-primary pl-5 py-2 mb-10">
          <p className="text-lg md:text-xl text-dark font-medium leading-relaxed">
            <strong>Lula caiu para 37.5%</strong> no Polymarket (-1pp), e Flávio Bolsonaro abriu vantagem de <strong>1.65 ponto percentual</strong> — a maior do ciclo a favor do ex-senador. O mercado "impeachment de ministro do STF" bateu <strong>nova máxima histórica absoluta de 16%</strong>, superando o pico anterior de 15.5%. No mercado "3º lugar", <strong>Caiado ultrapassou Renan Santos pela primeira vez no ciclo</strong> (27% × 25%, com Renan caindo 3pp). E o Senado teve reorganização massiva: <strong>PL recuperou para 83.5%, enquanto PSD, MDB e PT despencaram simultaneamente</strong>.
          </p>
        </div>

        {/* MERCADO */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-primary mt-10 mb-4 pb-2 border-b-2 border-blue-100">
            1. Mercado de previsão
          </h2>
          <p className="mb-4 text-gray-700 leading-relaxed">
            O <a href="https://polymarket.com/politics/brazil" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Polymarket</a> fechou 26 de abril com <strong>mudanças significativas em todas as cinco frentes</strong> após dois dias de aparente acomodação. <strong>Luiz Inácio Lula da Silva (PT)</strong> caiu de <strong>38.5% para 37.5%</strong> (-1pp) — primeira queda significativa após dois dias estável em 38.5%. <strong>Flávio Bolsonaro (PL)</strong> subiu de 38.8% para <strong>39.15%</strong> (+0.35pp). O gap <strong>ampliou de 0.3pp para 1.65pp a favor de Flávio</strong> — a maior margem do ciclo na direção do ex-senador.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            A 3ª via teve <strong>inversão histórica</strong> no mercado "3º lugar no 1º turno". <strong>Romeu Zema (Novo)</strong> consolidou a liderança com <strong>37.5%</strong> (+1.5pp), atingindo o maior patamar do ciclo. Mas o destaque foi <strong>Ronaldo Caiado</strong>, que <strong>ultrapassou Renan Santos pela primeira vez</strong> desde o início do ciclo: subiu de 26.5% para <strong>27%</strong> (+0.5pp), enquanto <strong>Renan despencou de 28% para 25%</strong> (-3pp). É a primeira vez que o mercado precifica Caiado à frente de Renan na disputa do 3º lugar. No presidencial, Zema voltou para <strong>9.85%</strong> (+0.7pp em 24 horas), aproximando-se de novo dos 10%. Renan ficou estável em 5.35% — completou o <strong>10º dia consecutivo sem peça pública</strong>.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            O mercado "2º lugar no 1º turno" devolveu parte do salto da véspera: Flávio caiu de 66% para <strong>63%</strong> (-3pp). Lula subiu marginalmente para 17% (+0.5pp). <strong>Romeu Zema</strong> subiu para 4.15% (+0.8pp em 24h). <strong>Fernando Haddad</strong> continuou em queda: 3.2% → 2.55% → <strong>2.4%</strong> — sexta movimentação consecutiva. A volatilidade desse mercado sobre Haddad permanece a mais alta do ciclo.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Impeachment de ministro do STF subiu de 15% para <strong>16%</strong> (+1pp) — <strong>nova máxima histórica absoluta</strong>, superando o pico anterior de 15.5% atingido em 25 de abril. Trajetória de 11 dias: 13.5% → 11% → 12% → 12.5% → 12.5% → 14% → 14% → 14% → 15.5% → 15% → 15% → <strong>16%</strong>. No Senado, o quadro <strong>se reorganizou massivamente</strong>: PL recuperou de 79.5% para <strong>83.5%</strong> (+4pp). <strong>União Brasil</strong> subiu para 6.85% (+0.7pp). E três partidos despencaram simultaneamente: <strong>PSD caiu de 5.95% para 3.85%</strong> (-2.1pp), <strong>MDB caiu de 4.7% para 1.7%</strong> (-3pp), e <strong>PT caiu de 3.6% para 1%</strong> (-2.6pp). O movimento sugere mercado reprecificando rapidamente cenário de polarização legislativa entre PL e União Brasil.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Na expectativa de inflação, a faixa central concentrou ainda mais: <strong>5.00-5.49% subiu para 40.8%</strong> (+0.85pp) e <strong>4.50-4.99% caiu para 32.75%</strong> (-2.9pp). As caudas extremas oscilaram leve. O mercado precificou <strong>menos dispersão na faixa baixa</strong>, com pequena alta na 5.50-5.99% (+0.35pp).
          </p>
        </section>

        {/* PESQUISAS */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-primary mt-10 mb-4 pb-2 border-b-2 border-blue-100">
            2. O que os institutos registraram
          </h2>
          <p className="mb-4 text-gray-700 leading-relaxed">
            A base do <a href="https://www.tse.jus.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">TSE</a> fechou o domingo com <strong>200 pesquisas</strong> indexadas. O calendário da próxima semana é o mais denso do ciclo: <strong>27/Abr (~6.700) + 28/Abr (~10.700) + 29/Abr (~3.800) + 30/Abr (~4.000) + 1/Mai (~1.000) = ~26.300 entrevistados em cinco dias consecutivos</strong>.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            A <a href="https://www.poder360.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Vox Brasil para São Paulo</a> — publicada às 17h por seis veículos (Poder360, Pleno.News, Sobral Online, Revista Oeste, Gazeta do Povo, brasilnoticia.com.br) — <strong>manteve-se como referência do dia</strong>: Flávio 50.4% × Lula 38.1% no segundo turno paulista. É a <strong>segunda pesquisa estadual grande consecutiva</strong> mostrando Flávio à frente, somando-se à Paraná Pesquisas para o Rio (47% × 40.5%) publicada em 25 de abril.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Em paralelo, a <a href="https://www.poder360.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Poder360</a> publicou às 14h47 levantamento estadual paulista para o governo: <strong>Tarcísio com 48.2%</strong> — a leitura mais alta do governador em qualquer pesquisa estadual desde o início do ciclo. A <a href="https://ric.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Ric.com.br</a> registrou que a Quaest divulgou a primeira pesquisa para o governo do Paraná. A <a href="https://www.cartacapital.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">CartaCapital</a> anunciou que a próxima Quaest cobrirá governo de Goiás e Senado. E a <a href="https://br104.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">BR104</a> noticiou que <strong>três pesquisas foram suspensas em Alagoas</strong> pela Justiça Eleitoral — sinal de TSE atuando ativamente.
          </p>
        </section>

        {/* NOTÍCIAS */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-primary mt-10 mb-4 pb-2 border-b-2 border-blue-100">
            3. O que a imprensa cobriu
          </h2>
          <p className="mb-4 text-gray-700 leading-relaxed">
            A pauta do dia foi atravessada por três blocos: <strong>manifesto do PT, narrativa de "fim da calmaria" para Flávio, e reorganização legislativa</strong>.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            A <a href="https://www.folha.uol.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Folha de S.Paulo</a> publicou às 22h12 que <strong>Haddad chamou Flávio Bolsonaro de "Bolsonarinho"</strong> e urgiu Lula a "superar feitos passados". O <a href="https://www.correiobraziliense.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Correio Braziliense</a>, o <a href="https://www.terra.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Terra</a> e o <a href="https://g1.globo.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">G1</a> cobriram em paralelo o lançamento do <strong>manifesto do PT para 2026</strong>, com <strong>aceno explícito ao centro</strong> segundo a Terra — e <strong>sem Lula presente</strong>, segundo o G1. O <a href="https://www.esmaelmorais.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Blog do Esmael</a> registrou que <strong>90% da infraestrutura da campanha de Lula está montada</strong>. O <a href="https://www.poder360.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Poder360</a> noticiou às 20h53 que <strong>o PT conta 12 plataformas regionais</strong> mobilizadas. O <a href="https://opiniaoce.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">OpiniãoCE</a> publicou às 21h14 que <strong>Camilo Santana afirmou que "Lula subirá a rampa pela 4ª vez"</strong> e dispensou candidatura presidencial — sinal de governo do Ceará consolidado em apoio.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Do lado da direita, o <a href="https://valor.globo.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Valor Econômico</a> publicou às 14h17 análise apontando que <strong>"o centrão prevê o fim da calmaria para Flávio com Lula crescendo"</strong> — o tom da peça é de competitividade voltando, não tranquilidade consolidada para o ex-senador. A <a href="https://www.folha.uol.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Folha de S.Paulo</a> manteve a análise de 25 de abril descrevendo a <strong>reforma tributária como "campo minado para Flávio"</strong>. O <a href="https://www.em.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Estado de Minas</a> registrou Flávio defendendo que <strong>"o Pix é nosso"</strong> e prometendo "negociações com EUA e China". O <a href="https://www.poder360.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Poder360</a> registrou às 19h31 que <strong>Romeu Zema reafirmou a promessa</strong> de privatizar Petrobras e Banco do Brasil se eleito.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            No Judiciário, o <a href="https://www.em.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Estado de Minas</a> noticiou às 11h59 que <strong>a empresa da família Vorcaro movimentou R$1 bilhão em possível tentativa de esconder dinheiro</strong>, segundo relatório. O <a href="https://arquivosa.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Arquivo SA</a> registrou que <strong>a comissão do Senado cancelou a sessão que ouviria Daniel Vorcaro nesta terça-feira</strong>. O <a href="https://pleno.news" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Pleno.News</a> publicou que o <strong>líder da oposição pediu rejeição de Jorge Messias no STF</strong>.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Como pauta lateral relevante, a <a href="https://www.folha.uol.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Folha de S.Paulo</a> e a <a href="https://www.bahianoticias.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Bahia Notícias</a> reforçaram a análise de que <strong>"a terceira via acumula derrotas e ex-presidenciáveis se voltam para eleições estaduais"</strong>. A <a href="https://www.gazetadopovo.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Gazeta do Povo</a> registrou que <strong>Ciro Gomes decide em maio</strong> entre disputar a Presidência ou o governo do Ceará — pressão direta de Camilo Santana, que dispensou Ciro publicamente, complicaria essa decisão.
          </p>
        </section>

        {/* DIVERGÊNCIAS */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-primary mt-10 mb-4 pb-2 border-b-2 border-blue-100">
            4. Divergências do dia
          </h2>
          <div className="bg-amber-50 border-l-4 border-amber-500 pl-5 py-4 mb-4 rounded-r">
            <p className="mb-3 text-gray-700 leading-relaxed">
              <strong>Mercado × Narrativa de "fim da calmaria":</strong> o <a href="https://valor.globo.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Valor Econômico</a> registrou expectativa do centrão de que a calmaria está acabando para Flávio. Mas o Polymarket fez exatamente o oposto: ampliou o gap a favor de Flávio (de 0.3pp para 1.65pp). Mercado e centrão não convergem — alguma das duas leituras está errada. As pesquisas de 27-30 de abril (~26.300 entrevistados) deverão decidir.
            </p>
            <p className="mb-3 text-gray-700 leading-relaxed">
              <strong>Pesquisas estaduais × Mercado de impeachment STF:</strong> já são duas pesquisas estaduais grandes (Vox SP, Paraná RJ) mostrando Flávio à frente em estados decisivos. E o mercado de impeachment do STF bateu nova máxima absoluta (16%). Os dois movimentos apontam, hipoteticamente, para fortalecimento do campo bolsonarista. Mas o mercado presidencial nacional só registra 1.65pp de vantagem para Flávio — ainda dentro da margem que pode reverter rápido.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>Caiado:</strong> o salto no mercado "3º lugar" (de 1.55% em 22/Abr para 27% em 26/Abr) é a maior trajetória individual do ciclo. <strong>Caiado ultrapassou Renan pela primeira vez</strong> justamente no dia em que o PSD do mesmo Caiado <strong>despencou no Senado</strong> (de 5.95% para 3.85%). O mercado precifica o candidato individual subindo enquanto o partido no qual ele está afiliado desce — separação clara entre figura individual e estrutura partidária.
            </p>
          </div>
        </section>

        {/* SÍNTESE */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-primary mt-10 mb-4 pb-2 border-b-2 border-blue-100">
            Em síntese
          </h2>
          <ul className="space-y-3 text-gray-700 leading-relaxed">
            <li className="flex gap-3">
              <span className="text-primary font-bold mt-0.5 flex-shrink-0">1.</span>
              <span><strong>Lula teve a primeira queda significativa em três dias</strong> (-1pp) e o gap com Flávio ampliou para 1.65pp — a maior do ciclo na direção do ex-senador. O mercado "impeachment STF" bateu nova máxima absoluta (16%). Em conjunto, são sinais consistentes de fortalecimento do campo bolsonarista nacional, ainda que o gap presidencial siga estreito.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold mt-0.5 flex-shrink-0">2.</span>
              <span><strong>Caiado ultrapassou Renan no mercado "3º lugar" pela primeira vez no ciclo</strong> — Renan despencou 3pp, completou o 10º dia sem peça pública, e foi sucessivamente desbancado por Zema (presidencial) e agora por Caiado (3º lugar). A análise de fundo da <a href="https://www.folha.uol.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Folha</a> — "ex-presidenciáveis viram estaduais" — começa a se materializar no mercado.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold mt-0.5 flex-shrink-0">3.</span>
              <span><strong>O Senado teve reorganização massiva: PL recuperou 4pp e três partidos despencaram simultaneamente (PSD -2.1pp, MDB -3pp, PT -2.6pp).</strong> O movimento sugere precificação acelerada de cenário de polarização legislativa entre PL e União Brasil — agora a próxima semana de pesquisas pesadas (27/Abr a 1/Mai, ~26.300 entrevistados) vai testar se o mercado está antecipando algo real ou está sobrecorrigindo.</span>
            </li>
          </ul>
        </section>

        {/* RODAPÉ */}
        <div className="mt-16 pt-8 border-t border-gray-200 text-xs text-gray-500 space-y-3">
          <p>
            <strong className="text-gray-700">Fontes citadas neste texto:</strong> Polymarket, TSE, Vox Brasil, Paraná Pesquisas, Quaest, AtlasIntel, Poder360, Pleno.News, Sobral Online, Revista Oeste, Gazeta do Povo, brasilnoticia.com.br, Estado de Minas, Folha de S.Paulo, Estadão, Correio Braziliense, Terra, G1, Folha BV, Valor Econômico, CartaCapital, Metrópoles, Blog do Esmael, Arquivo SA, Pleno.News, Exame, Ric.com.br, Bahia Notícias, OpiniãoCE, BR104.
          </p>
          <p>
            <strong className="text-gray-700">Método:</strong> esta síntese é gerada automaticamente a partir dos dados auditáveis da plataforma AFOS Analytics, sob regras em código versionadas em git. Todas as alegações podem ser verificadas na plataforma ou nas fontes linkadas. <a href="/pt-BR/methodology/automated-governance" className="text-primary hover:underline">Entenda a governança automatizada</a>.
          </p>
          <p>
            <strong className="text-gray-700">Integração:</strong> para ver os dados ao vivo e as análises dos candidatos em detalhe, acesse o <a href="/pt-BR/dashboard" className="text-primary hover:underline">dashboard completo</a>. Para entender o método em profundidade, leia <a href="/pt-BR/how-it-works" className="text-primary hover:underline">O Método</a>.
          </p>
        </div>

        <div className="mt-12 text-center">
          <a
            href="/pt-BR/dashboard"
            className="inline-block bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors text-sm"
          >
            ← Acessar o Dashboard
          </a>
        </div>
      </article>
    </div>
  )
}
