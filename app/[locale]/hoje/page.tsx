/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AFOS Hoje — 23 de abril de 2026 | AFOS Analytics',
  description: 'Síntese do dia 23/Abr/2026: Lula retoma liderança Poly (+0.55pp), Zema dispara no 3º lugar (gap 4.5pp sobre Renan), Tarcísio mantém distância de Flávio em SP. Análise cruzada auditável.',
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
          23 de abril de 2026
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
            Lula retomou a liderança presidencial no Polymarket com vantagem de <strong>0.55 ponto percentual</strong> sobre Flávio Bolsonaro e endureceu o tom da campanha prometendo deixar "os mentirosos nus". Romeu Zema disparou no mercado "3º lugar" e abriu <strong>4.5 pontos percentuais</strong> de vantagem sobre Renan Santos — gap que era de apenas 0.5pp há 24 horas. Tarcísio de Freitas manteve distância pública de Flávio Bolsonaro na campanha paulista, escancarando a rachadura tática entre Republicanos e PL.
          </p>
        </div>

        {/* MERCADO */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-primary mt-10 mb-4 pb-2 border-b-2 border-blue-100">
            1. Mercado de previsão
          </h2>
          <p className="mb-4 text-gray-700 leading-relaxed">
            O <a href="https://polymarket.com/politics/brazil" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Polymarket</a> fechou 23 de abril com a corrida presidencial <strong>invertida em relação à noite anterior</strong>. <strong>Luiz Inácio Lula da Silva (PT)</strong> manteve 38.5%, enquanto <strong>Flávio Bolsonaro (PL)</strong> recuou de 38.95% (22/Abr) para 37.95% — em dois movimentos consecutivos: queda para 37.75% pela manhã, recuperação parcial de 0.2pp à tarde. O gap fechou o dia em <strong>+0.55pp a favor de Lula</strong>, contra -0.45pp a favor de Flávio 24 horas antes.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            O destaque absoluto da sessão ficou por conta de <strong>Romeu Zema (Novo)</strong>. No mercado "3º lugar no 1º turno", o governador saltou de 29% pela manhã para <strong>33% à noite (+4pp em 8 horas)</strong>, enquanto Renan Santos subiu levemente de 27% para 28.5%. O gap entre os dois, que era de 2pp pela manhã e 0.5pp na véspera, <strong>ampliou para 4.5pp</strong>. No mercado presidencial, porém, Zema devolveu parte da alta: fechou em 6.95% (-0.3pp). Renan cedeu para 5.65% (-0.2pp).
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            O movimento mais inesperado apareceu no mercado "2º lugar no 1º turno". <strong>Lula explodiu</strong> de 14.5% (22/Abr) para <strong>22%</strong> — salto de 7.5pp inédito no ciclo — e manteve esse patamar ao longo do dia inteiro. Flávio, no mesmo mercado, recuou de 64.5% para <strong>59.5%</strong> (-5pp acumulado). Fernando Haddad oscilou no curto prazo: caiu de 6.1% para 4.55% pela manhã e recuperou para 5.3% à noite.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Impeachment de ministro do STF fechou a sessão em <strong>12.5%</strong> — estável em relação à manhã, mas três sessões consecutivas de alta o levaram de 11% (22/Abr manhã) a esse patamar. O pico do ciclo segue sendo <strong>13.5%</strong>, em 21 de abril. No Senado, PL manteve 82%, mas <strong>o centrão recuperou</strong>: PSD subiu de 4.7% para <strong>5.4%</strong> (+0.7pp) e MDB saltou de 3.75% para <strong>5.25%</strong> (+1.5pp). PT manteve os 3.6% alcançados pela manhã.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Na expectativa de inflação de 2026, a faixa 5.00-5.49% lidera com <strong>40.2%</strong>, mas recuou 1.15pp no dia. A faixa 4.50-4.99% subiu para 37.1% (+1pp) e 3.50-3.99% ganhou 1.1pp. Em linha, o mercado precificou <strong>inflação um pouco mais baixa</strong> do que na véspera.
          </p>
        </section>

        {/* PESQUISAS */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-primary mt-10 mb-4 pb-2 border-b-2 border-blue-100">
            2. O que os institutos registraram
          </h2>
          <p className="mb-4 text-gray-700 leading-relaxed">
            O destaque do dia no <a href="https://www.tse.jus.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">TSE</a> foi o registro formal da <strong>nova pesquisa AtlasIntel presidencial</strong>, com campo de 22 a 27 de abril e amostra de <strong>5.000 entrevistados</strong> — a maior do ciclo até aqui — publicada pela <a href="https://www.cartacapital.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">CartaCapital</a> às 15h42. Também entrou no sistema a <strong>primeira pesquisa Quaest para o governo de Minas Gerais</strong>, confirmada pela <a href="https://veja.abril.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">VEJA</a>.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Uma divergência nacional nova surgiu: a <strong>Quaest divulgada pelo MSN</strong> nesta quinta registrou <strong>Flávio à frente de Lula no segundo turno, 42% contra 40%</strong> — contradizendo o <a href="https://www.cnt.org.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">CNT</a> de 21 de abril, que havia dado Lula à frente com 44% contra 40%. Em Teresina, o <a href="https://www.piauihoje.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Piauí Hoje</a> mostrou Lula com <strong>68%</strong>, ampliando distância.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            O calendário da semana adensou ainda mais. Além do <strong>27 de abril</strong> (três Quaest, Paraná Pesquisas segunda rodada e primeira Nexus — 6.704 entrevistados), agora <strong>28 de abril</strong> concentra a AtlasIntel de 5.000, duas Quaest adicionais, Instituto Novo Perfil, Data AZ e Exatus. Soma de cerca de <strong>9.800 entrevistados</strong> em um único dia.
          </p>
        </section>

        {/* NOTÍCIAS */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-primary mt-10 mb-4 pb-2 border-b-2 border-blue-100">
            3. O que a imprensa cobriu
          </h2>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Lula endureceu publicamente o tom da campanha nesta quinta. O presidente prometeu deixar "os mentirosos nus" e intensificar ataques aos adversários, segundo <a href="https://www.folha.uol.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Folha de S.Paulo</a>, <a href="https://www.infomoney.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">InfoMoney</a>, <a href="https://www.poder360.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Poder360</a> e <a href="https://www.jornalgrandebahia.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Jornal Grande Bahia</a>. O movimento coincide com uma recuperação na aprovação do governo, segundo levantamento citado pela <a href="https://jetss.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">JETSS</a>.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Na direita, a novidade foi a <strong>manutenção de distância de Tarcísio em relação a Flávio</strong> em São Paulo. Segundo reportagem do <a href="https://oglobo.globo.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">O Globo</a>, o governador paulista não tem aparecido em eventos conjuntos do senador em seu estado. Na mesma linha, o <a href="https://www.estadao.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Estadão</a> publicou análise de Andreazza segundo a qual "Flávio se mexe" em negociações políticas. Pivetta endossou publicamente o senador em Mato Grosso, segundo o <a href="https://www.rdnews.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Rdnews</a>. O <a href="https://pleno.news" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Pleno.News</a> registrou que Flávio quer se posicionar como "candidato do agro". A <a href="https://www.folha.uol.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Folha de S.Paulo</a> descreveu Minas Gerais como "campo minado" para o senador, com avaliações internas de aliados do centrão.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            No Judiciário, dois movimentos se acumularam. A Polícia Federal entregou ao <a href="https://www.stf.jus.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">STF</a> relatório sobre a morte de testemunha ligada ao caso Master, segundo a <a href="https://www.sbtnews.sbt.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">SBT News</a>; na mesma linha, o <a href="https://www.diariodocentrodomundo.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Diário do Centro do Mundo</a> registrou que a PF entrevistou o próprio Lula sobre potenciais acusações a Bolsonaro. O TSE, por sua vez, firmou duas decisões institucionais: proibição de voto a presos provisórios não vale para 2026 (<a href="https://www.folha.uol.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Folha</a>) e autorização da descentralização de recursos para eleições no exterior.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Como pauta de bastidor, o <a href="https://www.estadao.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Estadão</a> registrou Ronaldo Caiado criticando Lula por "usar pobres em política baixa" e expressando "preocupação com candidatura precoce". O <a href="https://jovempan.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Jovem Pan</a> publicou análise descrevendo a terceira via liberal como "falha analítica" persistente.
          </p>
        </section>

        {/* DIVERGÊNCIAS */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-primary mt-10 mb-4 pb-2 border-b-2 border-blue-100">
            4. Divergências do dia
          </h2>
          <div className="bg-amber-50 border-l-4 border-amber-500 pl-5 py-4 mb-4 rounded-r">
            <p className="mb-3 text-gray-700 leading-relaxed">
              <strong>Pesquisas × Pesquisas:</strong> pela primeira vez no ciclo, um instituto deu a Flávio vantagem no 2º turno. A Quaest divulgada pelo MSN marcou <strong>Flávio 42% contra Lula 40%</strong>, invertendo o CNT de 21 de abril (Lula 44% × Flávio 40%). O Polymarket seguiu atribuindo vitória a Lula no "2º lugar" — mas o mercado precifica cenário, não resultado.
            </p>
            <p className="mb-3 text-gray-700 leading-relaxed">
              <strong>Zema:</strong> a explosão no mercado "3º lugar" (gap amplia 2pp → 4.5pp em um dia) continua sem paralelo equivalente nas pesquisas. A <strong>primeira Quaest para o governo de MG</strong> foi registrada hoje no TSE, mas ainda não publicada. O dado vai chegar — e será o primeiro teste nacional robusto da tese do mercado.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>Tarcísio × Flávio:</strong> o governador de São Paulo evita eventos conjuntos com o senador em seu próprio estado (<a href="https://oglobo.globo.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">O Globo</a>), mas a aliança formal Republicanos-PL segue no papel. Sinal de que o campo da direita pode estar mais fragmentado do que sua estrutura legislativa sugere.
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
              <span>Lula <strong>retomou a liderança presidencial</strong> no Polymarket (+0.55pp), <strong>endureceu o discurso</strong> ("mentirosos nus") e manteve o salto no mercado "2º lugar" (22%). Três movimentos alinhados no mesmo dia.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold mt-0.5 flex-shrink-0">2.</span>
              <span><strong>Zema disparou no 3º lugar</strong> (gap 4.5pp sobre Renan, era 0.5pp na véspera). O governador consolidou-se como terceiro colocado do ciclo — mas a validação ainda depende da primeira Quaest MG, registrada hoje no TSE.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold mt-0.5 flex-shrink-0">3.</span>
              <span>O <strong>centrão recuperou terreno no Senado</strong> (PSD +0.7pp, MDB +1.5pp). Em paralelo, Tarcísio mantém <strong>distância pública de Flávio</strong> em SP. Os dois sinais, juntos, indicam rearranjos em curso no campo conservador antes do ciclo de pesquisas pesadas de 27-28 de abril.</span>
            </li>
          </ul>
        </section>

        {/* RODAPÉ */}
        <div className="mt-16 pt-8 border-t border-gray-200 text-xs text-gray-500 space-y-3">
          <p>
            <strong className="text-gray-700">Fontes citadas neste texto:</strong> Polymarket, TSE, Quaest, AtlasIntel, CartaCapital, VEJA, Piauí Hoje, CNT, Datafolha, Folha de S.Paulo, O Globo, Estadão, InfoMoney, Poder360, Jornal Grande Bahia, JETSS, Rdnews, Pleno.News, SBT News, Diário do Centro do Mundo, Jovem Pan.
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
