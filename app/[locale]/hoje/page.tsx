/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AFOS Hoje — 27 de abril de 2026 | AFOS Analytics',
  description: 'Síntese do dia 27/Abr/2026 (dia-bomba): Flávio atinge 40%+ Poly pela 1ª vez (gap +4.8pp maior do ciclo), Nexus/BTG sustenta Lula 1T (41% × 36%) e empate técnico 2T (46% × 45% também c/ Zema/Caiado/Renan), STF impeach despenca de 16% para 11%, Flávio+Tarcísio 1º ato pré-campanha juntos. Análise cruzada auditável.',
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
          27 de abril de 2026
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
            Pela primeira vez no ciclo, <strong>Flávio Bolsonaro ultrapassou os 40%</strong> no Polymarket (40.30%) e abriu o <strong>maior gap do ciclo</strong> sobre Lula — <strong>4.8 pontos percentuais</strong>. No mesmo dia, a primeira pesquisa nacional grande do dia-bomba — Nexus/BTG Pactual — sustentou Lula no primeiro turno (41% × 36%) e registrou <strong>empate técnico no segundo</strong> (46% × 45%, válido também para Zema, Caiado e Renan). O mercado "impeachment de ministro do STF" <strong>despencou de 16% para 11%</strong> — a maior queda do ciclo, com o pico desfeito em 24 horas.
          </p>
        </div>

        {/* MERCADO */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-primary mt-10 mb-4 pb-2 border-b-2 border-blue-100">
            1. Mercado de previsão
          </h2>
          <p className="mb-4 text-gray-700 leading-relaxed">
            O <a href="https://polymarket.com/politics/brazil" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Polymarket</a> fechou 27 de abril com <strong>Flávio Bolsonaro ultrapassando 40% pela primeira vez no ciclo</strong>. Subiu de 39.15% para <strong>40.30%</strong> (+1.15pp). Lula caiu de 37.5% para <strong>35.5%</strong> (-2pp) — primeira queda significativa em três dias. O gap <strong>ampliou para 4.8pp a favor de Flávio</strong>, a maior margem do ciclo na direção do ex-senador.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            A 3ª via teve <strong>dia recordista</strong>. <strong>Romeu Zema (Novo)</strong> consolidou liderança absoluta no mercado "3º lugar no 1º turno": <strong>40.5%</strong> (+3pp em 24h) — <strong>nova máxima do ciclo</strong>. No presidencial, recuou levemente para <strong>9.45%</strong> (-0.4pp). <strong>Ronaldo Caiado</strong> devolveu parte do salto da véspera: caiu de 27% para <strong>24%</strong> no mercado "3º lugar". <strong>Renan Santos</strong> recuperou de 25% para 26.5%. No presidencial, Renan ficou em 5.5% — completou o <strong>11º dia consecutivo sem peça pública</strong>.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            No mercado "2º lugar no 1º turno", <strong>Fernando Haddad recuperou-se violentamente</strong>: 2.4% (26/Abr) → <strong>5.8%</strong> (+3.4pp) — volta ao patamar competitivo após cinco dias de queda extrema. Flávio estabilizou em 66.5% (+0.5pp). Lula manteve 17%. Zema ficou em 3.45%.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            <strong>Impeachment de ministro do STF caiu de 16% para 11%</strong> (-5pp) — <strong>a maior queda do ciclo em 24 horas</strong>, com o pico histórico de 26/Abr desfeito. Trajetória de 13 dias: 13.5% → 11% → 12% → 12.5% → 12.5% → 14% → 14% → 14% → 15.5% → 15% → 15% → 16% → <strong>11%</strong>. No Senado, <strong>PL recuou levemente</strong> de 83.5% para 81.5% (-2pp). E três partidos <strong>recuperaram simultaneamente</strong>: <strong>PSD subiu de 3.85% para 6.55%</strong> (+2.7pp), <strong>MDB de 1.7% para 3.35%</strong> (+1.65pp), e <strong>PT de 1% para 2.65%</strong> (+1.65pp). Movimento simétrico ao colapso de 26/Abr — mercado parece estar testando hipóteses ao longo do dia-bomba.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Na expectativa de inflação, as <strong>caudas se abriram</strong>: a faixa 3.50-3.99% disparou <strong>4.45pp para 7.6%</strong>. As faixas &lt;3.00% e 3.00-3.49% também subiram (+1.8pp e +0.7pp). A faixa central 5.00-5.49% caiu <strong>3.65pp para 37.15%</strong>, e 7%+ subiu para 5%. O mercado precificou <strong>maior dispersão</strong> em torno do cenário base.
          </p>
        </section>

        {/* PESQUISAS */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-primary mt-10 mb-4 pb-2 border-b-2 border-blue-100">
            2. O que os institutos registraram
          </h2>
          <p className="mb-4 text-gray-700 leading-relaxed">
            A base do <a href="https://www.tse.jus.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">TSE</a> chegou a <strong>201 pesquisas</strong> indexadas. O calendário da semana entrou no pico: <strong>27/Abr</strong> (~6.700 entrevistados) acaba de fechar, e <strong>28/Abr</strong> trará a maior amostra do ciclo (AtlasIntel n=5.000 + 2 Quaest + 3 outros = ~10.700).
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            A pesquisa-âncora do dia foi a <strong>Nexus/BTG Pactual</strong>, publicada em torno das 11h por sete veículos: <a href="https://www.cnnbrasil.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">CNN Brasil</a>, <a href="https://www.folha.uol.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Folha de S.Paulo</a>, <a href="https://www.estadao.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Estadão</a>, <a href="https://www.em.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Estado de Minas</a>, <a href="https://www.poder360.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Poder360</a>, <a href="https://congressoemfoco.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Congresso em Foco</a> e <a href="https://www.cartacapital.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">CartaCapital</a>. Resultados: <strong>1º turno Lula 41% × Flávio 36%</strong> (Lula lidera por 5pp); <strong>2º turno Lula 46% × Flávio 45%</strong> — <strong>empate técnico válido também para Zema, Caiado e Renan</strong>, segundo a CNN Brasil. Rejeição de ambos os candidatos: <strong>48%</strong>. A <a href="https://www.brasil247.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Brasil 247</a> registrou que "o empate técnico no 2º turno acende alerta para Lula".
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            A <strong>AtlasIntel</strong> publicada anteriormente continuou a ser digerida pela imprensa: a <a href="https://veja.abril.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">VEJA</a> publicou análise "três pontos de atenção", a <a href="https://revistaforum.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Revista Fórum</a> também repercutiu, e o <a href="https://www.terra.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Terra Brasil Notícias</a> registrou que "mais uma pesquisa projeta vitória de Flávio Bolsonaro sobre Lula" — leitura distinta da da Nexus.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            A <strong>Quaest/Genial</strong> publicou pacote estadual maciço: <strong>gov RJ</strong> (Eduardo Paes lidera primeiro turno — CBN, Estadão, O Globo, Poder360); <strong>Senado RJ</strong> (Castro e Benedita lideram — CartaCapital, CNN, G1); <strong>gov PR</strong> (Moro lidera cenários — SBT, Gazeta do Povo); <strong>Senado PR</strong> (Gazeta do Povo, VEJA, CartaCapital); <strong>gov+Senado PA</strong> (Daniel Santos × Hana Ghassan em empate técnico — Estadão, Gazeta do Povo, CNN). É a maior cobertura estadual de Quaest do ciclo.
          </p>
        </section>

        {/* NOTÍCIAS */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-primary mt-10 mb-4 pb-2 border-b-2 border-blue-100">
            3. O que a imprensa cobriu
          </h2>
          <p className="mb-4 text-gray-700 leading-relaxed">
            A pauta do dia foi atravessada por três blocos: <strong>selagem da aliança Tarcísio-Flávio, leituras divergentes das pesquisas, e desaceleração do tema STF</strong>.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            A <a href="https://www.folha.uol.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Folha de S.Paulo</a>, o <a href="https://g1.globo.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">G1</a>, o <a href="https://www.estadao.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Estadão</a> e a <a href="https://www.cnnbrasil.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">CNN Brasil</a> cobriram em paralelo o <strong>primeiro ato de pré-campanha conjunto entre Flávio Bolsonaro e Tarcísio de Freitas</strong>. Em duas declarações distintas no mesmo dia, <strong>Tarcísio afirmou que "Flávio será o próximo presidente"</strong> (G1, 19h24) e que ele próprio <strong>"tem capacidade de ser presidente e será um dia"</strong> (CNN Brasil, 15h11). É a confirmação pública do alinhamento que vinha sendo sinalizado desde 24 de abril ("chapa pura do bolsonarismo" em SP). O G1 registrou Flávio elogiando André do Prado para o Senado paulista, mas condicionando o segundo nome do PL.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Do lado do governo, a <a href="https://www.folha.uol.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Folha de S.Paulo</a> cobriu Haddad chamando Flávio de "Bolsonarinho" — narrativa mantida desde 26 de abril. O <a href="https://www.sbtnews.sbt.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">SBT News</a> noticiou que <strong>o próprio PL reagiu a "BolsoMaster"</strong> afirmando que "o desempenho de Flávio Bolsonaro causa desconforto no governo" — frase que reflete tensão dentro da coalizão de oposição. O <a href="https://www.diariodopovo.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Diário do Povo</a> registrou que <strong>o PL negou envolvimento de Flávio no caso Banco Master após vídeo do PT</strong> — defensiva contra ofensiva do governo.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            No Judiciário, o <a href="https://agendadopoder.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Agenda do Poder</a> noticiou às 11h47 que <strong>a ação sobre a CPI do Banco Master está parada há um mês no STF</strong>. O <a href="https://www.sbtnews.sbt.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">SBT News</a> publicou às 19h40 que <strong>ministros do STF apostam que Jorge Messias será aprovado com placar próximo ao de Cristiano Zanin Dino</strong> — sinal de Corte coesa. O <a href="https://www.ricardoantunes.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Blog do Ricardo Antunes</a> registrou que <strong>um sócio de consultoria investigada recebeu R$4 milhões da "Farra do INSS"</strong> — escândalo lateral. A combinação dessas três peças aparenta explicar parte da queda do mercado "impeachment STF" — mercado precificou cenário institucional "calmo" para os próximos meses.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Como pauta lateral, a <a href="https://oglobo.globo.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">O Globo</a> registrou que o <strong>PT do Rio anunciou apoio a Paes para governador e Benedita ao Senado</strong> (mantido). E a <a href="https://www.poder360.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Poder360</a> noticiou que o <strong>PT conta 12 plataformas regionais</strong> mobilizadas. O <a href="https://opiniaoce.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">OpiniãoCE</a> registrou que Camilo Santana afirmou que "Lula subirá a rampa pela quarta vez" e dispensou candidatura presidencial.
          </p>
        </section>

        {/* DIVERGÊNCIAS */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-primary mt-10 mb-4 pb-2 border-b-2 border-blue-100">
            4. Divergências do dia
          </h2>
          <div className="bg-amber-50 border-l-4 border-amber-500 pl-5 py-4 mb-4 rounded-r">
            <p className="mb-3 text-gray-700 leading-relaxed">
              <strong>Mercado × Pesquisa nacional grande:</strong> o Polymarket precificou Flávio em 40.30% e abriu gap de 4.8pp sobre Lula no mesmo dia em que a Nexus/BTG Pactual — primeira nacional grande do dia-bomba — colocou Lula à frente no 1º turno por 5pp (41% × 36%). Os dois sinais apontam direções opostas. Como o mercado é menos líquido em períodos de bloqueio regulatório (governo brasileiro proibiu plataformas em 24/Abr), parte dessa divergência pode ser ruído estatístico de baixa profundidade. Mas a narrativa precificada — Flávio + Tarcísio juntos — é estrutural e real.
            </p>
            <p className="mb-3 text-gray-700 leading-relaxed">
              <strong>STF × Senado:</strong> o mercado "impeachment STF" caiu 5pp em 24 horas (16% → 11%), enquanto no mesmo dia o PL Senado caiu 2pp e PSD/MDB/PT recuperaram-se. O movimento sugere que mercado está reprecificando o ambiente institucional como <strong>menos favorável a oposição radical</strong> — Corte coesa (Messias confortável), CPI Master parada, "BolsoMaster" causando desconforto. PL Senado mantém dominância (81.5%) mas perdeu 2pp de empolgação.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>Empate técnico múltiplo:</strong> a Nexus/BTG registrou empate técnico no 2º turno entre <strong>cinco candidatos</strong> (Lula × Flávio × Zema × Caiado × Renan). É a primeira evidência institucional de que o cenário de 2º turno está realmente plural — não há um candidato "certo" da oposição contra Lula. Polymarket ainda não precificou isso plenamente: Flávio segue dominando o mercado "2º lugar" (66.5%), com Lula em 17% e Haddad em 5.8%. As próximas pesquisas (28-30 de abril, ~22.000 entrevistados) deverão decidir.
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
              <span><strong>Pela primeira vez no ciclo, Flávio cruzou os 40% no Polymarket</strong> (40.30%) e abriu o maior gap do ciclo sobre Lula (4.8pp). No mesmo dia, a primeira pesquisa nacional grande do dia-bomba sustentou Lula no 1º turno por 5pp. Mercado e instituto <strong>divergem em direções opostas</strong> — situação que merece acompanhamento próximo nas próximas 48 horas.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold mt-0.5 flex-shrink-0">2.</span>
              <span><strong>O mercado "impeachment STF" desabou 5pp em 24 horas</strong> (16% → 11%) — a maior queda do ciclo. Combinação de Messias com aprovação confortável, CPI Master parada e "BolsoMaster" gerando desconforto interno na oposição parece ter desfeito o pico anterior. Tema institucional está sendo reprecificado como <strong>menos central</strong> do que parecia em 25-26 de abril.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold mt-0.5 flex-shrink-0">3.</span>
              <span><strong>Tarcísio + Flávio fizeram o primeiro ato conjunto de pré-campanha</strong>, e Tarcísio afirmou publicamente que "Flávio será o próximo presidente". A aliança que vinha sendo sinalizada desde 24 de abril foi formalizada simbolicamente. Em paralelo, o <strong>empate técnico múltiplo no 2º turno</strong> (Lula × Flávio × Zema × Caiado × Renan na Nexus) sugere que a polarização não está consolidada — há cinco candidatos com viabilidade institucional declarada para o 2T.</span>
            </li>
          </ul>
        </section>

        {/* RODAPÉ */}
        <div className="mt-16 pt-8 border-t border-gray-200 text-xs text-gray-500 space-y-3">
          <p>
            <strong className="text-gray-700">Fontes citadas neste texto:</strong> Polymarket, TSE, Nexus/BTG Pactual, AtlasIntel, Quaest/Genial, Paraná Pesquisas, Vox Brasil, CNN Brasil, Folha de S.Paulo, Estadão, Estado de Minas, Poder360, Congresso em Foco, CartaCapital, VEJA, Revista Fórum, Terra Brasil Notícias, G1, SBT News, Diário do Povo, Agenda do Poder, Blog do Ricardo Antunes, Brasil 247, O Globo, Gazeta do Povo, OpiniãoCE.
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
