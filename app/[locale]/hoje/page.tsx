/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AFOS Hoje — 25 de abril de 2026 | AFOS Analytics',
  description: 'Síntese do dia 25/Abr/2026: 3 inversões de liderança em 24h (Lula → Flávio → Lula → Flávio), Paraná RJ Flávio 47% × Lula 40.5% 2T, STF impeach máxima histórica intradiária 15.5% (fecha 15%), 3ª via plural com Caiado e possível Ciro. Análise cruzada auditável.',
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
          25 de abril de 2026
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
            O Polymarket viveu o <strong>dia mais volátil do ciclo</strong>: <strong>três inversões de liderança em 24 horas</strong>. Pela manhã, Flávio abriu <strong>4.15pp</strong> sobre Lula; à tarde, Lula retomou com <strong>0.35pp</strong>; ao fim do dia, Flávio voltou à frente com <strong>0.45pp</strong>. A Paraná Pesquisas para o Rio publicou a primeira pesquisa estadual grande mostrando <strong>Flávio à frente</strong> (47% × 40.5% no segundo turno), replicada por seis veículos. O mercado "impeachment de ministro do STF" bateu <strong>nova máxima histórica intradiária de 15.5%</strong>, recuando para 15% no fechamento.
          </p>
        </div>

        {/* MERCADO */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-primary mt-10 mb-4 pb-2 border-b-2 border-blue-100">
            1. Mercado de previsão
          </h2>
          <p className="mb-4 text-gray-700 leading-relaxed">
            O <a href="https://polymarket.com/politics/brazil" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Polymarket</a> encerrou 25 de abril com <strong>três inversões de liderança no dia</strong>. Pela manhã, Flávio Bolsonaro chegou a abrir <strong>4.15pp</strong> de vantagem (39.65% contra 35.5%). À tarde, Lula recuperou para 38.5% e Flávio cedeu para 38.15% — gap de +0.35pp a favor do presidente. Ao fim do dia, <strong>Flávio voltou para 38.95% (+0.8pp em seis horas)</strong> e Lula manteve os 38.5%. O gap fechou em <strong>-0.45pp a favor de Flávio</strong>. Em 24 horas, gap +0.55pp Lula → +4.15pp Flávio → +0.35pp Lula → <strong>+0.45pp Flávio</strong>.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            A 3ª via teve dia denso. <strong>Romeu Zema (Novo)</strong> devolveu o salto e fechou em <strong>8.55%</strong> (-1.9pp em 24h, voltando bem abaixo dos 10% que ultrapassou em 24/Abr). <strong>Renan Santos</strong> ficou estável em 5.35% — completou o <strong>8º dia consecutivo sem peça pública</strong>. No mercado "3º lugar no 1º turno", <strong>Caiado disparou pela manhã</strong> de 1.55% para 16.5% (+15pp), seguiu subindo para 26% ao meio-dia, devolveu para 23% à tarde e <strong>voltou para 27% ao fim do dia</strong> — quase empatando Renan (28%). A maior variação individual do ciclo. Zema continuou liderando esse mercado com <strong>36%</strong> (-2.5pp em 24h).
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            No mercado "2º lugar no 1º turno", a oscilação foi extrema. Flávio recuperou para <strong>66%</strong> ao final. Lula caiu para 16.5%. <strong>Fernando Haddad</strong> repetiu padrão volátil dos últimos quatro dias: 6.1% → 0.225% → 3.35% → 2.7% → 3.2% → <strong>2.6%</strong>. A precificação não se acomoda neste mercado.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Impeachment de ministro do STF subiu <strong>1.5pp e atingiu pico intradiário de 15.5%</strong> — <strong>nova máxima histórica do ciclo</strong>, superando o pico anterior de 14%. Recuou levemente para <strong>15%</strong> no fechamento. Trajetória de cinco dias: 13.5% → 11% → 12% → 12.5% → 14% → 15.5% → <strong>15%</strong>. No Senado, PL teve sua própria montanha-russa: caiu 4.5pp (de 82% para 77.5%) pela manhã, recuperou os 82% à tarde e fechou em <strong>80%</strong> (-2pp). <strong>União Brasil</strong> disparou para 7.35% e fechou em <strong>6.15%</strong>. <strong>PSD</strong> recuperou para 5.75% (+1.4pp). MDB estável em 5.1%.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Na expectativa de inflação, <strong>as caudas extremas despencaram e parcialmente voltaram</strong>: a faixa de 7%+ caiu de 7.2% para 3.9% à tarde e fechou em <strong>4.25%</strong>. A faixa central recuou: <strong>5.00-5.49% caiu para 38%</strong> (-2.05pp em 24h) e 4.50-4.99% caiu para <strong>37.25%</strong> (-1.75pp). O mercado precificou <strong>menos certeza concentrada na faixa central</strong> ao fim do dia.
          </p>
        </section>

        {/* PESQUISAS */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-primary mt-10 mb-4 pb-2 border-b-2 border-blue-100">
            2. O que os institutos registraram
          </h2>
          <p className="mb-4 text-gray-700 leading-relaxed">
            A base do <a href="https://www.tse.jus.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">TSE</a> chegou a <strong>199 pesquisas</strong> indexadas nos últimos 15 dias — três a mais que ontem. Quatro novas Quaest foram registradas em 24 de abril (n=804, 1.104, 1.104, 1.002), todas com publicação prevista para <strong>30 de abril</strong>. A Quaest acumula agora <strong>11 pesquisas</strong> nas últimas duas semanas, dominando a contagem do calendário.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            O destaque do dia foi a <strong>Paraná Pesquisas para o Rio de Janeiro</strong>, publicada às 11h por seis veículos: <a href="https://www.cnnbrasil.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">CNN Brasil</a>, <a href="https://veja.abril.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">VEJA</a>, <a href="https://www.metropoles.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Metrópoles</a>, <a href="https://exame.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Exame</a>, <a href="https://www.sbtnews.sbt.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">SBT News</a>, <a href="https://pleno.news" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Pleno.News</a>, <a href="https://www.gazetadopovo.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Gazeta do Povo</a> e <a href="https://www.poder360.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Poder360</a>. Resultados: <strong>1º turno Flávio 39.6% × Lula 36.7%; 2º turno Flávio 47% × Lula 40.5%</strong> — <strong>6.5pp de vantagem para Flávio em estado-chave</strong>. O Poder360 registrou ainda que "quase metade dos eleitores do RJ avalia Lula negativamente".
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            O calendário da próxima semana é o mais denso do ciclo. <strong>27 de abril</strong> concentra três Quaest, a segunda rodada da Paraná Pesquisas nacional e a primeira Nexus (~6.700 entrevistados). <strong>28 de abril</strong> reúne a AtlasIntel de 5.000 entrevistados, duas Quaest e três outros institutos (~10.700). <strong>29 de abril</strong> acrescenta duas Quaest mais a NEOBE (~3.800). <strong>30 de abril</strong> concentra as quatro Quaest novas (~4.000). Somado, são <strong>cerca de 25.300 entrevistados em quatro dias consecutivos</strong> — o pico de densidade do ciclo até aqui.
          </p>
        </section>

        {/* NOTÍCIAS */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-primary mt-10 mb-4 pb-2 border-b-2 border-blue-100">
            3. O que a imprensa cobriu
          </h2>
          <p className="mb-4 text-gray-700 leading-relaxed">
            A pauta do dia foi atravessada por três blocos: <strong>inversão eleitoral, escalada institucional do STF e tentativas de coalizão à direita</strong>.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            A <a href="https://www.folha.uol.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Folha de S.Paulo</a> publicou às 18h30 que <strong>"Flávio Bolsonaro tem obstáculos a vencer até as urnas"</strong> — análise sobre a viabilidade do candidato apesar do bom desempenho regional. Em paralelo, o <a href="https://www.estadao.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Estadão</a> registrou Caiado defendendo <strong>"convergência" centro-direita</strong>, o <a href="https://www.terra.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Terra</a> noticiou Flávio chamando <strong>"unidade da direita"</strong>, e a <a href="https://www.gazetadopovo.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Gazeta do Povo</a> registrou Tarcísio criticando <strong>"lideranças envelhecidas"</strong> — três movimentos diferentes, todos do mesmo campo, no mesmo dia.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Do lado do governo, o <a href="https://g1.globo.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">G1</a> registrou Lula pedindo, na abertura do Congresso do PT, que o partido <strong>"não corresse atrás dos adversários"</strong>. O Metrópoles apontou que <strong>"Lula e Flávio seguem sem palanques em MG e aliados ficam impacientes"</strong> — situação simétrica para os dois principais candidatos. O <a href="https://www.estadao.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Estadão</a> registrou que <strong>Ciro Gomes reconsidera disputar a presidência</strong>, com decisão prevista para maio.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            No Judiciário, a <a href="https://www.folha.uol.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Folha de S.Paulo</a> publicou às 2h matéria sobre <strong>"divisões internas do STF"</strong> ("STF faces electoral scrutiny"). O <a href="https://jornaldacidadeonline.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Jornal da Cidade Online</a> noticiou às 12h57 que o relator da CPMI do INSS alertou para uma <strong>"delação devastadora" de Daniel Vorcaro</strong>. O <a href="https://paranacentral.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Paraná Central</a> registrou às 3h da manhã que o STF <strong>manteve por unanimidade</strong> a prisão do ex-presidente do BRB. O <a href="https://www.sbtnews.sbt.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">SBT News</a> publicou que <strong>Fachin autorizou venda de imóveis para socorrer o BRB</strong>. O deputado Marcel van Hattem (Novo) acusou o STF de "querer escolher quem participa das eleições", segundo a <a href="https://www.gazetadopovo.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Gazeta do Povo</a>.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Como pauta lateral relevante, o <a href="https://portaldobitcoin.uol.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Portal do Bitcoin</a> registrou às 17h07 que <strong>Donald Trump chamou o Polymarket de "cassino"</strong> — declaração que ressoa com o bloqueio aplicado pelo governo brasileiro a Kalshi e Polymarket em 24 de abril, agora replicado por mais de quinze veículos.
          </p>
        </section>

        {/* DIVERGÊNCIAS */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-primary mt-10 mb-4 pb-2 border-b-2 border-blue-100">
            4. Divergências do dia
          </h2>
          <div className="bg-amber-50 border-l-4 border-amber-500 pl-5 py-4 mb-4 rounded-r">
            <p className="mb-3 text-gray-700 leading-relaxed">
              <strong>Mercado consigo mesmo:</strong> o Polymarket precificou narrativas opostas <strong>três vezes</strong> em 24 horas (Flávio +4.15pp manhã → Lula +0.35pp tarde → Flávio +0.45pp noite). A magnitude e frequência das inversões sugerem que o mercado ainda processa a Paraná RJ, a publicação da AtlasIntel e as falas de "unidade/convergência" da direita sem convergir para uma leitura estável. O dado isolado de qualquer momento do dia não basta para conclusão estrutural.
            </p>
            <p className="mb-3 text-gray-700 leading-relaxed">
              <strong>Pesquisa estadual × Pesquisa nacional:</strong> a <a href="https://www.cnnbrasil.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Paraná Pesquisas RJ</a> deu Flávio 47% × Lula 40.5% no segundo turno — a primeira pesquisa estadual grande com Flávio à frente. Datafolha (21/Abr) e CNT (21/Abr) nacionais ainda mantêm Lula em vantagem (4pp e 4pp respectivamente). Estados onde Bolsonaro tradicionalmente performa bem (RJ, RS, SP) estão precificando uma direção; o agregado nacional, outra.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>Caiado:</strong> o salto no mercado "3º lugar" para 26% pela manhã, devolução para 23% à tarde, e novo avanço para 27% à noite — em poucas horas, três movimentos opostos. A maior variação individual do ciclo. Coincide com declaração pública sobre "convergência" (CBN, 24/Abr e Estadão, 25/Abr), mas tem magnitude descolada de qualquer pesquisa. Continua sendo um caso em que o mercado precifica algo que os institutos não capturaram.
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
              <span><strong>Três inversões em 24 horas é o dado.</strong> O mercado parece estar processando ao mesmo tempo a primeira pesquisa estadual grande favorável a Flávio (Paraná RJ), a publicação da nova AtlasIntel sendo digerida pela imprensa, e a possibilidade — ainda em formação — de uma coalizão centro-direita.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold mt-0.5 flex-shrink-0">2.</span>
              <span>O mercado "impeachment de ministro do STF" bateu <strong>nova máxima histórica intradiária de 15.5%</strong> (recuando para 15% no fechamento), superando o pico anterior. A combinação de "bomba atômica" (delação Vorcaro), prisão BRB mantida por unanimidade e divisões internas declaradas pelo Supremo aciona o gatilho — sem qualquer ministro publicamente em risco real de impeachment.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold mt-0.5 flex-shrink-0">3.</span>
              <span><strong>A 3ª via virou plural em três dias.</strong> Zema (presidencial 8.55%, 3º lugar 36%), Caiado (3º lugar 27% no fechamento, "convergência"), Renan (presidencial 5.35%, silencioso), e agora <strong>Ciro Gomes reconsiderando candidatura</strong> (Folha). Se Ciro entrar e Caiado consolidar, a polarização Lula × Flávio pode rachar pelo meio antes do segundo turno.</span>
            </li>
          </ul>
        </section>

        {/* RODAPÉ */}
        <div className="mt-16 pt-8 border-t border-gray-200 text-xs text-gray-500 space-y-3">
          <p>
            <strong className="text-gray-700">Fontes citadas neste texto:</strong> Polymarket, TSE, Paraná Pesquisas, Quaest, AtlasIntel, CNN Brasil, VEJA, Metrópoles, Exame, SBT News, Pleno.News, Gazeta do Povo, Poder360, Folha de S.Paulo, Estadão, Terra, G1, Jornal da Cidade Online, Paraná Central, Portal do Bitcoin.
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
