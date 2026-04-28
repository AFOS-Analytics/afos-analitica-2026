/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AFOS Daily — 28 de abril de 2026 | AFOS Analytics',
  description: 'Síntese do dia 28/Abr/2026: Polymarket precifica empate técnico Lula × Flávio pela 1ª vez (38.50% × 38.75%, gap 0.25pp). AtlasIntel n=5.000 dá Lula liderando 1º turno por 6.9pp (46.6% × 39.7%) e empate técnico no 2º.',
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://afos-analytics.com/pt-BR/daily' },
}

export default function AfosDailyPtBRPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <article className="max-w-[720px] mx-auto px-5 md:px-10 py-12 md:py-14">
        <nav className="mb-10 text-sm">
          <a href="/pt-BR/dashboard" className="text-primary hover:underline">← Voltar ao Dashboard</a>
        </nav>

        <p className="text-center text-xs font-extrabold text-primary uppercase tracking-[0.25em] mb-2">AFOS Daily · Síntese do Dia</p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary text-center mb-3 tracking-tight leading-tight">
          28 de abril de 2026
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
            Pela primeira vez no ciclo, <strong>Polymarket precificou empate técnico</strong> entre Lula e Flávio Bolsonaro: <strong>38.50% × 38.75%</strong>, gap de <strong>0.25pp</strong> — fechando os 4.8pp de 27/Abr em 24 horas. No mesmo dia, a <strong>AtlasIntel/Bloomberg</strong> (n=5.000) registrou <strong>Lula liderando o 1º turno por 6.9pp</strong> (46.6% × 39.7%) e <strong>empate técnico no 2º</strong> (47.5% × 47.8%). Encerrando o piloto de 7 dias: o produto foi aprovado e renomeado de "AFOS Hoje" para <strong>AFOS Daily</strong>.
          </p>
        </div>

        {/* MERCADO */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-primary mt-10 mb-4 pb-2 border-b-2 border-blue-100">
            1. Mercado de previsão
          </h2>
          <p className="mb-4 text-gray-700 leading-relaxed">
            O <a href="https://polymarket.com/politics/brazil" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Polymarket</a> fechou 28 de abril com o <strong>menor gap entre Lula e Flávio Bolsonaro do ciclo</strong>. Lula subiu de 35.5% para <strong>38.50%</strong> (+3.0pp) — maior alta diária registrada. Flávio caiu de 40.30% para <strong>38.75%</strong> (-1.55pp), devolvendo o topo dos 40% conquistado em 27 de abril. O gap fechou de 4.8pp Flávio para <strong>0.25pp Flávio</strong> — primeira vez no ciclo em que mercado precifica empate técnico entre os dois favoritos.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            O mercado "2º lugar no 1º turno" registrou <strong>a maior alta isolada do ciclo para Lula</strong>: 17% → <strong>25.5%</strong> (+8.5pp). Flávio recuou de 66.5% para 63.5% (-3pp), mantendo dominância mas com erosão clara. Fernando Haddad devolveu quase toda a recuperação de 27/Abr (5.8% → 2.95%, -2.85pp) — volatilidade extrema continua. A <a href="https://forbes.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Forbes Brasil</a> registrou que "Flávio aparece numericamente à frente de Lula em possível segundo turno" (14h48), enquanto a <a href="https://www.cnnbrasil.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">CNN Brasil</a> (18h38) e a <a href="https://pleno.news" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Pleno.News</a> (11h50) consolidaram a leitura de que "Lula empata com Flávio, Jair e Zema no 2º turno".
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            A 3ª via teve <strong>dia de redistribuição</strong>. <strong>Romeu Zema</strong> caiu no presidencial de 9.45% para <strong>7.90%</strong> (-1.55pp) — abaixo dos 8% pela primeira vez no ciclo recente, perdendo o que vinha sendo lido como liderança 3ª via. No mercado "3º lugar", Zema recuou de 40.5% para 39.5% (-1pp) — ainda no topo, mas eroded. <strong>Renan Santos</strong> subiu de 5.5% para <strong>6.35%</strong> no presidencial (+0.85pp); o "3º lugar" foi para 27.5% (+1pp). <strong>Carlos "Ratinho Jr." Massa disparou no 3º lugar de 1.05% para 7.10%</strong> (+6.05pp) — a maior alta isolada do ciclo nesse segmento. <strong>Eduardo Leite</strong> apareceu como novo nome relevante no 3º lugar com 3.35%. <strong>Caiado</strong> devolveu para 22.5% (-1.5pp).
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            <strong>Impeachment de ministro do STF subiu de 11% para 14%</strong> (+3pp) — devolvendo parte da queda histórica de 27/Abr (-5pp). Trajetória de 14 dias: 13.5% → 11% → 12% → 12.5% → 12.5% → 14% → 14% → 14% → 15.5% → 15% → 15% → 16% → 11% → <strong>14%</strong>. No Senado, <strong>PL recuperou de 81.5% para 85.5%</strong> (+4pp), e <strong>União Brasil disparou de 6.7% para 11.25%</strong> (+4.55pp). PSD recuou levemente para 6.40%, MDB subiu para 3.95%. PT estável em 2.70%.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Na expectativa de inflação, o mercado precificou a <strong>maior dispersão do ciclo</strong>: cinco bandas com probabilidade acima de 30% (5.50-5.99%, 7%+, 5.00-5.49%, 4.50-4.99%, 6.00-6.49%, 3.00-3.49%). O cenário central permanece em torno de 5.0-6.0%, mas a probabilidade de extremos (&gt;7% ou &lt;3%) <strong>continua aberta</strong>.
          </p>
        </section>

        {/* PESQUISAS */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-primary mt-10 mb-4 pb-2 border-b-2 border-blue-100">
            2. O que os institutos registraram
          </h2>
          <p className="mb-4 text-gray-700 leading-relaxed">
            A base do <a href="https://www.tse.jus.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">TSE</a> chegou a <strong>204 pesquisas</strong> indexadas após o refresh das 12h UTC. O dia entregou a maior amostra do ciclo registrada: <strong>AtlasIntel n=5.000 + 2 Quaest + 3 outros</strong> = aproximadamente <strong>10.700 entrevistados</strong>.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            A pesquisa-âncora foi a <strong>AtlasIntel/Bloomberg</strong>, publicada às 10h por nove veículos: <a href="https://www.infomoney.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">InfoMoney</a>, <a href="https://www.gazetadopovo.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Gazeta do Povo</a>, <a href="https://www.cartacapital.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">CartaCapital</a>, <a href="https://veja.abril.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">VEJA</a>, <a href="https://www.cnnbrasil.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">CNN Brasil</a>, <a href="https://www.poder360.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Poder360</a>, <a href="https://pleno.news" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Pleno.News</a>, <a href="https://forbes.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Forbes Brasil</a> e <a href="https://valor.globo.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Valor Econômico</a>. Resultados: <strong>1º turno Lula 46.6% × Flávio 39.7%</strong> — Lula lidera por 6.9pp. <strong>2º turno (Valor Econômico, 19h16)</strong>: Flávio 47.8% × Lula 47.5% — empate técnico, com Flávio numericamente à frente. <strong>Aprovação de Lula</strong> subiu para 46.6-46.8% segundo <a href="https://www.ocafezinho.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">O Cafezinho</a>, <a href="https://diariodoestadogo.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Diário do Estado</a> e <a href="https://www.jota.info" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">JOTA</a>. <strong>Rejeição</strong> ficou em 51.3-52.5% — variação entre veículos (Metrópoles, AL 102, InfoMoney, SpaceMoney). <a href="https://blogdobg.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Blog do BG</a> registrou rejeição de <strong>75% entre jovens</strong>. Rejeição de Flávio: <strong>49.8%</strong> (Pleno.News).
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            A <strong>Quaest/Genial</strong> publicou pacote estadual robusto. Em <strong>Minas Gerais</strong>, <a href="https://www.folha.uol.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Cleitinho lidera todos os cenários</a> de 1º e 2º turno contra Kalil, Pacheco e Simões, com Kalil em 5º lugar — cobertura simultânea de Folha de S.Paulo, Gazeta do Povo, CNN Brasil e <a href="https://oglobo.globo.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">O Globo</a>. Em <strong>Pernambuco</strong>, <a href="https://g1.globo.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">G1</a> publicou Quaest 2º turno: <strong>João Campos 46% × Raquel Lyra 38%</strong>. Próximas publicações registradas no TSE: 4 Quaest em 30/Abr, F. Façanha em 1/Mai, M B Barros em 2/Mai.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Como observação metodológica: a <a href="https://www.otempo.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">O Tempo</a> registrou às 00h21 que "mesmo fora do ar no Brasil, Polymarket movimentou US$ 60 milhões em apostas sobre a eleição de outubro" — a liquidez relativa do mercado segue robusta apesar do bloqueio regulatório imposto em 24 de abril.
          </p>
        </section>

        {/* NOTÍCIAS */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-primary mt-10 mb-4 pb-2 border-b-2 border-blue-100">
            3. O que a imprensa cobriu
          </h2>
          <p className="mb-4 text-gray-700 leading-relaxed">
            A pauta do dia foi atravessada por quatro blocos: <strong>a recuperação de Lula nas pesquisas, a estratégia de campanha do PT, a ruptura de silêncio de Renan Santos, e o avanço da investigação Vorcaro</strong>.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            A <a href="https://www.metropoles.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Metrópoles</a> (10h00) cobriu a <strong>estratégia oficial do PT para 2026</strong>: "como Lula vai retratar Flávio na campanha — corrupção e entrega nacional". É a primeira vez que a narrativa ofensiva petista contra o candidato do PL aparece estruturada publicamente. O <a href="https://www.jota.info" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">JOTA</a> registrou às 13h11 que "aprovação de Lula sobe, mas disputa segue aberta". Em paralelo, o <a href="https://g1.globo.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">G1</a> (12h32) publicou que <strong>Flávio Bolsonaro atua para que evangélicos rejeitem Messias</strong> — movimentação ativa contra o nome indicado pelo governo ao STF, com base religiosa estratégica. A <a href="https://www.bbc.com/portuguese" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">BBC</a> (07h38) noticiou que <strong>Renan Santos rompeu o silêncio de 11 dias</strong> com a frase: "Sou o candidato da direita" — disputa direta pelos votos que Flávio vinha consolidando.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Do lado conservador, o <a href="https://www.correiobraziliense.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Correio Braziliense</a> (19h13) cobriu <strong>Gilberto Kassab afirmando que "a eleição não está definida entre Lula e Flávio"</strong> — sinal de que o PSD pode reabrir negociações de aliança. O mesmo Kassab apareceu na <a href="https://www.folha.uol.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Folha de S.Paulo</a> (22h07) criticando a gestão Lula — PSD dentro do governo critica publicamente. O <a href="https://www.estadao.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Estadão</a> (18h57 e 23h54) cobriu <strong>Ciro Nogueira afirmando que a eleição "será decidida na margem de erro" e que "não vê espaço para terceira via"</strong> — análise que amplifica o binário Lula × Flávio.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            No Senado paulista, o <a href="https://www.infomoney.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">InfoMoney</a> (14h56), o <a href="https://www.poder360.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Poder360</a> (02h30) e a <a href="https://revistaoeste.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Revista Oeste</a> registraram que <strong>o Podemos apoia Tarcísio mas lança Palumbo e Rufino próprios ao Senado</strong> — direita expandindo organização legislativa em SP.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            No Judiciário, o <a href="https://www.sbtnews.sbt.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">SBT News</a> (14h43) registrou que <strong>a PF acessou novos celulares de Vorcaro e adiou a entrega do relatório sobre autoridades com foro citadas</strong> — investigação aprofunda. Em paralelo, o SBT News (15h47) noticiou que <strong>o escritório da família de Alexandre de Moraes processou Alessandro Vieira por declaração sobre PCC</strong> — STF na ofensiva pública.
          </p>
        </section>

        {/* DIVERGÊNCIAS */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-primary mt-10 mb-4 pb-2 border-b-2 border-blue-100">
            4. Divergências do dia
          </h2>
          <div className="bg-amber-50 border-l-4 border-amber-500 pl-5 py-4 mb-4 rounded-r">
            <p className="mb-3 text-gray-700 leading-relaxed">
              <strong>Mercado × pesquisa:</strong> AtlasIntel registrou Lula liderando 1º turno por <strong>6.9pp</strong> (46.6% × 39.7%) — confirmando a Nexus/BTG Pactual de 27/Abr que dera Lula em 41% × 36%. Mas o Polymarket fechou o dia com <strong>empate técnico (38.50% × 38.75%)</strong>, gap de 0.25pp. Mercado precificou em parte a recuperação de Lula (+3.0pp) mas continua reservando precificação significativa para Flávio. <strong>Duas pesquisas nacionais grandes consecutivas dão Lula no 1º turno; mercado ainda não convergiu</strong>. Como o mercado opera com profundidade reduzida desde o bloqueio regulatório (24/Abr), parte dessa divergência pode ser ruído estatístico — mas a magnitude (8.65pp entre pesquisa e mercado) é estatisticamente relevante.
            </p>
            <p className="mb-3 text-gray-700 leading-relaxed">
              <strong>Aprovação × rejeição:</strong> AtlasIntel registrou aprovação de Lula em recuperação (46.6-46.8%, segundo Cafezinho, Diário do Estado e JOTA), e simultaneamente rejeição em alta (51.3-52.5%, com 75% entre jovens segundo Blog do BG). É raro ambos os indicadores subirem juntos — sugere <strong>polarização aprofundando</strong> entre quem ratifica e quem rejeita. A leitura "aprovação melhora, rejeição também" pode indicar que o eleitor indeciso está se alocando aos dois polos.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>3ª via fragmentada:</strong> Zema caiu na presidencial (-1.55pp), mas a AtlasIntel manteve "Lula empata com Zema" no 2º turno (CNN Brasil, Pleno.News, Poder360) — viabilidade institucional preservada apesar da queda no mercado. Em paralelo, <strong>Massa "Ratinho Jr." disparou 6.05pp no 3º lugar do Polymarket</strong> — o mercado parece estar redistribuindo expectativas para outsiders sub-3ª via, possivelmente refletindo o sucesso de Cleitinho na Quaest MG. Renan rompeu silêncio anti-establishment ("sou candidato da direita"), e Ciro Nogueira anunciou que "não vê espaço para terceira via". <strong>Os três sinais convivem</strong>: viabilidade 2T (pesquisas), erosão de mercado (Polymarket), declarações divergentes (imprensa).
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
              <span><strong>Polymarket precificou empate técnico entre Lula e Flávio pela primeira vez no ciclo</strong> (38.50% × 38.75%, gap 0.25pp), fechando os 4.8pp de 27/Abr em 24 horas. A AtlasIntel/Bloomberg n=5.000 — segunda pesquisa nacional grande consecutiva — registrou <strong>Lula liderando 1º turno por 6.9pp</strong> (46.6% × 39.7%) e empate técnico no 2º (47.5% × 47.8%). Mercado e pesquisa <strong>convergiram parcialmente</strong>: mercado moveu na direção da pesquisa (+3.0pp para Lula), mas mantém precificação aberta — não selou a aposta.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold mt-0.5 flex-shrink-0">2.</span>
              <span><strong>O mercado "2º lugar no 1º turno" registrou a maior alta isolada do ciclo para Lula</strong> (17% → 25.5%, +8.5pp), enquanto <strong>Massa "Ratinho Jr." disparou no 3º lugar</strong> (1.05% → 7.10%, +6.05pp) — sinal de que mercado está redistribuindo expectativas para outsiders sub-3ª via. Em paralelo, Zema <strong>caiu abaixo dos 8%</strong> (-1.55pp) e perdeu a leitura de liderança 3ª via consolidada.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold mt-0.5 flex-shrink-0">3.</span>
              <span><strong>Piloto de 7 dias concluído com decisão GO</strong> — sete sínteses publicadas em sete dias consecutivos, cobrindo do 22/Abr (3 pesquisas, ~2.500 entrevistados) ao 28/Abr (AtlasIntel n=5.000 + Quaest MG/PE, ~10.700 entrevistados). O produto passa a se chamar <strong>AFOS Daily</strong> e será integrado ao lançamento da plataforma. As sínteses do piloto permanecem arquivadas e linkáveis (slugs `afos-hoje-22-04-2026` a `afos-hoje-28-04-2026`).</span>
            </li>
          </ul>
        </section>

        {/* RODAPÉ */}
        <div className="mt-16 pt-8 border-t border-gray-200 text-xs text-gray-500 space-y-3">
          <p>
            <strong className="text-gray-700">Fontes citadas neste texto:</strong> Polymarket, TSE, AtlasIntel/Bloomberg, Quaest/Genial, Nexus/BTG Pactual, Forbes Brasil, Valor Econômico, CNN Brasil, Folha de S.Paulo, Estadão, Poder360, Pleno.News, InfoMoney, Gazeta do Povo, CartaCapital, VEJA, JOTA, Metrópoles, BBC Brasil, Correio Braziliense, Revista Oeste, SBT News, G1, O Globo, O Cafezinho, Diário do Estado, Blog do BG, AL 102, SpaceMoney, O Tempo.
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
