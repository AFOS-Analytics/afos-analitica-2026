/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AFOS Hoje — 24 de abril de 2026 | AFOS Analytics',
  description: 'Síntese do dia 24/Abr/2026: Flávio assume liderança Poly (gap +3.3pp), Zema passa dos 10%, Caiado explode no 3º lugar (+15.45pp), governo proíbe Polymarket/Kalshi. Análise cruzada auditável.',
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
          24 de abril de 2026
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
            Flávio Bolsonaro <strong>ultrapassou Lula</strong> no Polymarket pela primeira vez desde segunda-feira e fechou 24 de abril com <strong>3.3 pontos percentuais de vantagem</strong> — a maior distância do ciclo favorecendo o ex-senador. <strong>Romeu Zema passou dos 10%</strong> no mercado presidencial pela primeira vez, e <strong>Ronaldo Caiado</strong> apareceu no mercado "3º lugar" com <strong>16.5%</strong> numa entrada massiva inédita que não existia pela manhã. O governo brasileiro publicou instrução proibindo Kalshi e Polymarket de oferecer apostas políticas no país.
          </p>
        </div>

        {/* MERCADO */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-primary mt-10 mb-4 pb-2 border-b-2 border-blue-100">
            1. Mercado de previsão
          </h2>
          <p className="mb-4 text-gray-700 leading-relaxed">
            O <a href="https://polymarket.com/politics/brazil" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Polymarket</a> fechou 24 de abril com <strong>inversão clara</strong> em relação à manhã. Pela manhã, Lula liderava 38.5% contra 37.95% de Flávio — gap de 0.55pp a favor do presidente. À tarde, <strong>Flávio subiu para 38.8% (+0.75pp)</strong> e <strong>Lula caiu para 35.5% (-3pp)</strong> — o gap <strong>inverteu para +3.3pp a favor de Flávio</strong>. É o primeiro dia do ciclo em que Lula fecha abaixo de 36%.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            O destaque da 3ª via foi <strong>Romeu Zema (Novo)</strong>. O governador passou de 9.15% para <strong>10.45% (+1.3pp)</strong>, ultrapassando pela primeira vez no ciclo a marca dos 10% no mercado presidencial. No mercado "3º lugar", Zema saltou para <strong>38.5%</strong> (+7.5pp) contra 27% de Renan Santos (+0.5pp) — o gap <strong>ampliou para 11.5pp</strong>, contra 4.5pp na manhã. Uma entrevista ao <a href="https://www.jornalopcao.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Jornal Opção</a> em Goiás mostrou o governador discutindo simultaneamente eleições de 2026 e o futuro do STF.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Um movimento menos previsível apareceu no mesmo mercado "3º lugar": <strong>Ronaldo Caiado (PSD)</strong> saltou de 1.55% para <strong>16.5%</strong> — alta de <strong>15.45 pontos percentuais em uma tarde</strong>, a maior variação individual do ciclo. A precificação coincide temporalmente com declaração dele à <a href="https://www.cbn.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">CBN</a> defendendo "quebrar a polarização por meio de coalizões". Flávio Bolsonaro também subiu no mesmo mercado, de 3.05% para <strong>9.1%</strong> (+6.05pp), configurando cenário em que quatro candidatos disputam posições plausíveis de terceiro colocado.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            No mercado "2º lugar", Fernando Haddad <strong>recuperou-se violentamente</strong>: caiu para 0.225% pela manhã e fechou em <strong>3.35% à tarde</strong> — variação de +3.1pp em poucas horas. Flávio estabilizou-se em 64.5% (-1.5pp) e Lula subiu para 20% (+2.5pp). A volatilidade deste mercado nos últimos três dias (6.1% → 0.225% → 3.35%) sinaliza instabilidade na precificação do cenário alternativo.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Impeachment de ministro do STF manteve-se em <strong>14%</strong> — pico do ciclo alcançado pela manhã e sustentado à noite. No Senado, PL recuperou 2pp e fechou em 82%. MDB subiu para 5.45% (+0.85pp) e PSD cedeu para 5% (-0.5pp). Na expectativa de inflação, toda a curva <strong>reverteu</strong> em direção a valores mais altos: a faixa 5.00-5.49% subiu 3.85pp para <strong>42.05%</strong>. O mercado devolveu a leve bonança da manhã.
          </p>
        </section>

        {/* PESQUISAS */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-primary mt-10 mb-4 pb-2 border-b-2 border-blue-100">
            2. O que os institutos registraram
          </h2>
          <p className="mb-4 text-gray-700 leading-relaxed">
            A base do <a href="https://www.tse.jus.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">TSE</a> contabiliza agora <strong>196 pesquisas</strong> nos últimos 15 dias — duas a mais que ontem, ambas novas <a href="https://quaest.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Quaest</a> registradas em 23 de abril. A primeira tem amostra de 1.650 entrevistados; a segunda, 1.200. As duas têm campo entre 23 e 27 de abril e publicação prevista para <strong>29 de abril</strong>. Com isso, o dia 29 passou a concentrar, além destas Quaest, uma pesquisa da NEOBE (n=1.008) — somando cerca de 3.858 entrevistados.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            A nova <a href="https://atlasintel.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">AtlasIntel</a> presidencial, publicada em 23 de abril pela <a href="https://www.cartacapital.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">CartaCapital</a>, continuou a ser digerida pela imprensa nesta sexta-feira — <a href="https://veja.abril.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">VEJA</a>, <a href="https://www.infomoney.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">InfoMoney</a>, <a href="https://ndmais.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">ND Mais</a> e outros veículos publicaram análises ao longo do dia, mas os números específicos permanecem em circulação limitada.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            O calendário da próxima semana adensou. <strong>27 de abril</strong> concentra três Quaest, a segunda rodada da Paraná Pesquisas nacional e a primeira Nexus — cerca de <strong>6.700 entrevistados</strong>. <strong>28 de abril</strong> reúne a AtlasIntel de 5.000 entrevistados, duas Quaest, Instituto Novo Perfil, Data AZ e Exatus — <strong>10.700 entrevistados</strong>. <strong>29 de abril</strong> acrescenta as duas novas Quaest mais a NEOBE — <strong>3.800 entrevistados</strong>. Somado, são <strong>cerca de 21.200 entrevistados em três dias consecutivos</strong> — a maior concentração de dados de pesquisa do ciclo.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Um dado estadual novo: a <a href="https://paranapesquisas.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Paraná Pesquisas</a> publicou levantamento para o Rio de Janeiro mostrando <strong>Eduardo Paes (PSD) com 53%</strong> na disputa ao governo, amplamente à frente dos demais candidatos, segundo a <a href="https://www.infomoney.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">InfoMoney</a>. Na mesma pesquisa, Benedita da Silva (PT) lidera a corrida ao Senado pelo estado — à frente de Cláudio Castro (PL) e Rogéria Bolsonaro, segundo a <a href="https://revistaforum.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Revista Fórum</a>.
          </p>
        </section>

        {/* NOTÍCIAS */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-primary mt-10 mb-4 pb-2 border-b-2 border-blue-100">
            3. O que a imprensa cobriu
          </h2>
          <p className="mb-4 text-gray-700 leading-relaxed">
            A movimentação do dia foi densa nos dois campos e no Judiciário.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            A <a href="https://www.folha.uol.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Folha de S.Paulo</a> publicou às 15h42 que <strong>o governo brasileiro proibiu Kalshi e Polymarket</strong> de oferecer apostas políticas no país. A medida foi anunciada no mesmo dia em que o Polymarket registrou inversão de liderança entre Lula e Flávio. O <a href="https://www.estadao.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Estadão</a> publicou, às 15h, análise em torno de uma tese atribuída ao ministro Gilmar Mendes segundo a qual "criticar Romeu Zema seria atacar Minas" — o argumento foi elaborado no contexto de críticas a governadores da oposição. O <a href="https://seligapb.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">SeLigaPB</a> noticiou às 19h que a Polícia Federal apura se <strong>Daniel Vorcaro beneficiou Alexandre de Moraes com imóveis de luxo</strong> — é o primeiro vetor de investigação formal envolvendo diretamente os dois, conforme a reportagem.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            No campo do governo, o <a href="https://valor.globo.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Valor Econômico</a> mostrou <strong>Fernando Haddad</strong> mobilizando apoio em São Paulo e enquadrando Flávio Bolsonaro como "risco democrático". O <a href="https://www.sbtnews.sbt.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">SBT News</a> registrou que <strong>o PT abriu seu Congresso com divergência interna</strong> sobre incluir ou não no debate os temas da reforma do Judiciário e das Forças Armadas. A <a href="https://www.aosfatos.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Aos Fatos</a> desmentiu boato viral de que Lula teria prometido se mudar para Cuba.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Do lado da direita, a <a href="https://www.cartacapital.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">CartaCapital</a> registrou que <strong>Tarcísio de Freitas definiu "chapa pura do bolsonarismo" em São Paulo</strong> — movimento que, somado à declaração anterior dele à <a href="https://www.msn.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">MSN</a> (Flávio poderia vencer no 1º turno), consolida o alinhamento público do governador ao projeto Flávio, após dois dias de distanciamento aparente. O <a href="https://www.sbtnews.sbt.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">SBT News</a> relatou aliança informal entre Ricardo Salles e Guilherme Derrite ao Senado paulista.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Em posição distinta, <a href="https://www.cbn.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Ronaldo Caiado</a> defendeu à CBN "quebrar a polarização por meio de coalizões" — tom diferente do confronto direto que marca Lula-Flávio e da autonomia de Zema.
          </p>
        </section>

        {/* DIVERGÊNCIAS */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-primary mt-10 mb-4 pb-2 border-b-2 border-blue-100">
            4. Divergências do dia
          </h2>
          <div className="bg-amber-50 border-l-4 border-amber-500 pl-5 py-4 mb-4 rounded-r">
            <p className="mb-3 text-gray-700 leading-relaxed">
              <strong>Mercado × Ação regulatória:</strong> o governo publicou restrição aos mercados de previsão (<a href="https://www.folha.uol.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Folha</a>) no mesmo dia em que o Polymarket precificou Flávio à frente de Lula por 3.3pp. A plataforma AFOS opera sob o pressuposto de que dados de mercados agregam informação útil; a restrição altera as condições de operação dessa premissa dentro do Brasil, mas não afeta a disponibilidade técnica dos dados globais. Vale acompanhar se a medida é mantida em revisão judicial.
            </p>
            <p className="mb-3 text-gray-700 leading-relaxed">
              <strong>Caiado:</strong> o salto de 1.55% para 16.5% no mercado "3º lugar" (+15.45pp em uma tarde) é a maior variação individual do ciclo registrada até aqui. O movimento coincide com declaração pública do governador (CBN, 18h09), mas tem magnitude descolada de qualquer pesquisa ou sinalização prévia. É um dos casos em que o mercado precifica algo que os institutos ainda não capturaram.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>Haddad:</strong> a oscilação no "2º lugar" (6.1% → 0.225% → 3.35% em 72 horas) ultrapassa os limites usuais de volatilidade. Sugere que a precificação ainda não convergiu — o dado isolado de qualquer dos três dias não basta para leitura estrutural.
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
              <span>Pela primeira vez no ciclo recente, o Polymarket precificou <strong>Flávio Bolsonaro à frente de Lula</strong> com vantagem de 3.3pp. A inversão ocorreu em poucas horas e coincide com o alinhamento público de Tarcísio de Freitas ao projeto do ex-senador em São Paulo (CartaCapital).</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold mt-0.5 flex-shrink-0">2.</span>
              <span><strong>Romeu Zema passou dos 10%</strong> no mercado presidencial pela primeira vez, e <strong>Ronaldo Caiado</strong> apareceu com 16.5% no "3º lugar" numa entrada massiva inédita. A 3ª via agora é plural e precificada em múltiplos cenários simultâneos.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold mt-0.5 flex-shrink-0">3.</span>
              <span>O governo publicou <strong>restrição a Kalshi e Polymarket</strong> no mesmo dia em que o Polymarket registrou movimento desfavorável ao campo governamental. A coincidência temporal merece acompanhamento — a plataforma AFOS continua operacional via infraestrutura internacional, mas o contexto regulatório brasileiro mudou.</span>
            </li>
          </ul>
        </section>

        {/* RODAPÉ */}
        <div className="mt-16 pt-8 border-t border-gray-200 text-xs text-gray-500 space-y-3">
          <p>
            <strong className="text-gray-700">Fontes citadas neste texto:</strong> Polymarket, TSE, Quaest, AtlasIntel, Paraná Pesquisas, CartaCapital, Folha de S.Paulo, Estadão, Valor Econômico, O Globo, SBT News, InfoMoney, VEJA, Revista Fórum, Jornal Opção, CBN, SeLigaPB, Aos Fatos, ND Mais.
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
