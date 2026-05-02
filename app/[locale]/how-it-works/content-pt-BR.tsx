/* eslint-disable react/no-unescaped-entities */
import { Callout, Card, SectionIntro, NavFlag, SummaryFrame, TocCol, TocLink } from './components'
import { S } from './styles'

export function HowItWorksPtBR() {
  return (
    <>
      <p className="text-center text-sm font-extrabold text-primary uppercase tracking-[0.25em] mb-3">O Método</p>
      <h1 className="text-3xl md:text-4xl font-extrabold text-primary text-center mb-2 tracking-tight">
        Como funciona<br className="md:hidden" aria-hidden="true" /> AFOS Analytics
      </h1>
      <p className="text-center text-gray-600 text-base font-medium mb-10">Guia didático para navegação na plataforma</p>

      <nav className="bg-white border border-blue-100 rounded-xl p-6 my-8 shadow-sm" aria-label="Sumário do documento">
        <div className="text-xs font-bold text-primary uppercase tracking-wider mb-4">Sumário</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <TocCol heading="O que é o AFOS">
            <TocLink href="#introducao">Por que o AFOS existe</TocLink>
            <TocLink href="#metodo">Como os dados são cruzados</TocLink>
            <TocLink href="#variacoes-pp">Entendendo variações ↑↓pp</TocLink>
          </TocCol>
          <TocCol heading="Tour pela plataforma">
            <TocLink href="#header">1. Header</TocLink>
            <TocLink href="#modal-sobre">└ Modal Sobre</TocLink>
            <TocLink href="#modal-metas">└ Modal Metas</TocLink>
            <TocLink href="#modal-global">└ Modal Global</TocLink>
            <TocLink href="#afos-daily-card">2. AFOS Daily, Síntese do Dia</TocLink>
            <TocLink href="#cards-polymarket">3. 6 Cards Polymarket</TocLink>
            <TocLink href="#pesquisas">4. Pesquisas Eleitorais</TocLink>
            <TocLink href="#criterios-institutos">└ Avaliação dos institutos</TocLink>
            <TocLink href="#analise-criteriosa">5. Análise Criteriosa</TocLink>
            <TocLink href="#quadro-comparativo">6. Quadro Comparativo</TocLink>
            <TocLink href="#perfil-candidatos">7. Perfil dos Candidatos</TocLink>
            <TocLink href="#paises">8. Países</TocLink>
            <TocLink href="#live-news">9. Live News 120'</TocLink>
            <TocLink href="#sentimento">10. Clima Político</TocLink>
            <TocLink href="#inss-lulinha">11. INSS e Caso Lulinha</TocLink>
            <TocLink href="#banco-master">12. Banco Master</TocLink>
            <TocLink href="#stf">13. Credibilidade do STF</TocLink>
            <TocLink href="#footer">14. Footer</TocLink>
          </TocCol>
          <TocCol heading="Aprofundamento">
            <TocLink href="#bastidores">Por trás da plataforma</TocLink>
            <TocLink href="#perfis-usuario">Perfis de usuários</TocLink>
            <TocLink href="#limitacoes">Quando o AFOS não serve</TocLink>
            <TocLink href="#diferenciacao">Diferença vs agregadores vs jornais</TocLink>
            <TocLink href="#comece-aqui">Comece por aqui</TocLink>
          </TocCol>
        </div>
      </nav>

      <h2 id="introducao" className={S.h2}>Introdução, Por que o AFOS existe</h2>
      <p className={S.p}>Todo dia você abre um jornal e lê "Pesquisa X diz que candidato Y tem 37%". Em outro, lê "32%". Qual acreditar?</p>
      <p className={S.p}><strong className="text-primary">O problema:</strong> pesquisas eleitorais medem <em>intenção declarada</em>, o que a pessoa <em>diz</em> que vai fazer. Mas intenção muda, pesquisa tem viés, e no Brasil já deu errado várias vezes (2018 e 2022 tiveram surpresas grandes).</p>
      <p className={S.p}><strong className="text-primary">A solução do AFOS:</strong> em vez de confiar em UMA fonte, a plataforma cruza <strong>três fontes independentes em tempo real</strong>:</p>

      <div className={S.tableWrap}>
        <table className={S.table}>
          <thead>
            <tr>
              <th className={S.th}>Fonte</th>
              <th className={S.th}>O que mede</th>
              <th className={S.th}>Por que importa</th>
            </tr>
          </thead>
          <tbody>
            <tr className={S.trRow}>
              <td className={S.tdTop}>🎯 <strong>Mercado de previsão, apostas</strong> (Polymarket)</td>
              <td className={S.tdTop}>Onde gente real aposta dinheiro real em quem vai ganhar</td>
              <td className={S.tdTop}>Quando alguém arrisca US$ 10.000, não mente por vaidade</td>
            </tr>
            <tr className={S.trAlt}>
              <td className={S.tdTop}>📊 <strong>Institutos de pesquisa</strong> (17+ no Brasil, Datafolha, Quaest, AtlasIntel, Paraná Pesquisas, CNT/MDA, Veritá e outros)</td>
              <td className={S.tdTop}>Intenção declarada em amostras</td>
              <td className={S.tdTop}>Captura o sentimento do eleitorado tradicional</td>
            </tr>
            <tr>
              <td className={S.tdTop}>📰 <strong>Notícias ao vivo</strong> (400+ fontes via Google News, grandes portais, agências)</td>
              <td className={S.tdTop}>Narrativa do momento</td>
              <td className={S.tdTop}>Explica <em>por que</em> os números mudaram</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className={S.p}>Quando essas três fontes <strong>concordam</strong>, a previsão é robusta. Quando <strong>divergem</strong>, é sinal de que algo está em movimento, e isso é informação valiosíssima.</p>

      <h2 id="metodo" className={S.h2}>Como os dados são cruzados (o método)</h2>
      <p className={S.p}>O AFOS não faz estatística formal (regressão, modelos bayesianos). Faz algo diferente e mais útil no dia a dia: um <strong>cruzamento narrativo estruturado com regras explícitas</strong>.</p>

      <h3 className={S.h3}>Regra de ouro: convergência vs divergência</h3>
      <p className={S.p}>Para cada pergunta importante (ex: "quem ganha o 1º turno?"), a plataforma compara os valores das 3 fontes:</p>
      <div className={S.tableWrap}>
        <table className={S.table}>
          <thead>
            <tr>
              <th className={S.th}>Situação</th>
              <th className={S.th}>Interpretação</th>
            </tr>
          </thead>
          <tbody>
            <tr className={S.trRow}><td className={S.td}>Diferença Polymarket × Pesquisa ≤ 3pp</td><td className={S.td}><strong>Convergência</strong>, sinal robusto, consenso</td></tr>
            <tr className={S.trAlt}><td className={S.td}>Diferença entre 3-5pp</td><td className={S.td}>Zona neutra, tensão leve</td></tr>
            <tr><td className={S.td}>Diferença &gt; 5pp</td><td className={S.td}><strong>Divergência</strong>, algo está mudando, uma das fontes vê o que a outra não vê</td></tr>
          </tbody>
        </table>
      </div>

      <h3 className={S.h3}>O ouro está na divergência</h3>
      <p className={S.p}>Quando Polymarket e pesquisa divergem, investiga-se o porquê:</p>
      <ul className={S.ul}>
        <li><strong>Pesquisa acima, mercado abaixo</strong> → ou a pesquisa está desatualizada/enviesada, ou o mercado sabe de algo (operação iminente, escândalo vazando)</li>
        <li><strong>Mercado acima, pesquisa abaixo</strong> → ou o mercado antecipa virada, ou é especulação com pouco volume</li>
      </ul>

      <h3 className={S.h3}>Exemplo real, o salto e o recuo do Candidato D</h3>
      <Callout title="18/Abr">
        <p>O Candidato D (governador regional) saltou no Polymarket "3º lugar" de 8.5% para 19.5% (↑11pp em 24h).</p>
        <ul>
          <li>Pesquisas ainda não tinham captado</li>
          <li>Notícias mencionavam: "Candidato D pode ser vice do Candidato B"</li>
          <li><strong>Leitura AFOS:</strong> o dinheiro viu antes que a pesquisa</li>
        </ul>
      </Callout>
      <Callout title="19/Abr">
        <p>O Candidato D caiu para 19% (↓0.5pp) e o presidencial regrediu para 2.25% (↓0.85pp).</p>
        <ul>
          <li>Mercado desinflou a aposta</li>
          <li>A articulação provavelmente não se concretizou</li>
          <li>Quem apostou rápido demais, perdeu</li>
        </ul>
      </Callout>
      <p className={S.p}>Quem lê AFOS diariamente <strong>chega antes na conclusão</strong>, porque vê o movimento enquanto ele acontece, não depois.</p>
      <SectionIntro>
        <strong>Nota de validade:</strong> os exemplos concretos citados ilustram o <em>método</em>, não um ponto definitivo. Este documento é revisado conforme a plataforma evolui. Os dados na plataforma estão sempre ao vivo.
      </SectionIntro>

      <h2 id="variacoes-pp" className={S.h2}>Entendendo as variações ↑↓pp</h2>
      <p className={S.p}>"pp" = <strong>ponto percentual</strong>. É a diferença entre dois percentuais. Diferente de "percentual".</p>
      <p className={S.p}><strong>Exemplo:</strong> o Candidato A tinha 40%, hoje tem 42%. Subiu <strong>2 pontos percentuais (2pp)</strong>. Em termos relativos, é crescimento de 5% (2 em cima de 40).</p>

      <h3 className={S.h3}>Por que variações pequenas importam</h3>
      <p className={S.pTight}><strong>1. Liquidez:</strong> o Polymarket presidencial tem US$ 54 milhões em jogo. Uma mudança de 0.8pp significa que cerca de US$ 432 mil líquidos foram reprecificados. Não é opinião, é compromisso financeiro real.</p>
      <p className={S.pTight}><strong>2. Velocidade:</strong> 0.8pp em 1 dia parece pouco. Se sustentar o ritmo: 5.6pp por semana; 24pp por mês; reversão completa em 5 meses. Movimento pequeno e persistente <strong>vence</strong> movimento grande e isolado.</p>
      <p className={S.p}><strong>3. Antecipação:</strong> quando o mercado move, ele move <strong>antes</strong> do consenso dos jornais. 48 horas depois, você vai ler analistas dizendo o que o mercado já disse.</p>

      <h3 className={S.h3}>Tabela de interpretação</h3>
      <div className={S.tableWrap}>
        <table className={S.table}>
          <thead>
            <tr>
              <th className={S.th}>Variação</th>
              <th className={S.th}>O que significa</th>
              <th className={S.th}>O que fazer</th>
            </tr>
          </thead>
          <tbody>
            <tr className={S.trRow}><td className={S.td}>±0.0 a ±0.3pp</td><td className={S.td}>Ruído de mercado</td><td className={S.td}>Ignorar</td></tr>
            <tr className={S.trAlt}><td className={S.td}>±0.4 a ±1.0pp</td><td className={S.td}>Movimento leve, direção nascendo</td><td className={S.td}>Observar se persiste 2-3 dias</td></tr>
            <tr className={S.trRow}><td className={S.td}>±1.0 a ±3.0pp</td><td className={S.td}>Movimento significativo</td><td className={S.td}>Investigar notícias do dia</td></tr>
            <tr className={S.trAlt}><td className={S.td}>±3.0 a ±5.0pp</td><td className={S.td}>Salto, algo grande aconteceu</td><td className={S.td}>Prioridade máxima</td></tr>
            <tr><td className={S.td}>±5.0pp+</td><td className={S.td}>Evento disruptivo</td><td className={S.td}>Reler todo o cenário</td></tr>
          </tbody>
        </table>
      </div>
      <blockquote className={S.quote}>
        <strong>Regra mental em uma frase:</strong> "Um movimento de 1pp é um tweet. 3pp é uma entrevista. 5pp+ é um fato consumado."
      </blockquote>

      <NavFlag title="Navegando a plataforma" description="A partir daqui, vamos percorrer a plataforma na ordem em que você a encontra ao abrir o site." />

      <h2 id="header" className={S.h2}>1. Header (topo da página)</h2>
      <p className={S.p}>No topo da tela você vê o logo <strong>AFOS Analytics</strong> e três botões de navegação:</p>
      <div className={S.tableWrap}>
        <table className={S.table}>
          <thead><tr><th className={S.th}>Botão</th><th className={S.th}>O que faz</th></tr></thead>
          <tbody>
            <tr className={S.trRow}><td className={S.td}><strong>Sobre</strong></td><td className={S.td}>Explica a missão do projeto, o problema que resolve e o método</td></tr>
            <tr className={S.trAlt}><td className={S.td}><strong>Metas</strong></td><td className={S.td}>Mostra os objetivos públicos da plataforma (cobertura de países, integração de fontes, roadmap)</td></tr>
            <tr><td className={S.td}><strong>Global</strong></td><td className={S.td}>Volta ao mapa mundial, útil quando você está no meio de uma análise e quer explorar outro país</td></tr>
          </tbody>
        </table>
      </div>
      <p className={S.p}>O header está presente em todas as páginas. É a âncora da navegação.</p>

      <Card title="Modal Sobre" id="modal-sobre">
        <p>Clicar em <strong>Sobre</strong> abre uma janela com 4 blocos: <em>Quem somos</em> (descrição da plataforma e fontes), <em>Para que serve</em> (perguntas que ajuda a responder), <em>Como usar</em> (perfis sugeridos: eleitor, investidor, jornalista) e <em>O que significa AFOS</em> (sigla A-F-O-S: Astuteness, Fairness, Objectivity, Synthesis, os 4 valores que guiam o projeto).</p>
        <p>O modelo open-source é declarado: qualquer pessoa pode estudar, auditar e contribuir. Detalhes de licenciamento (Apache 2.0 para código, CC BY 4.0 para conteúdo editorial) ficam no rodapé de todas as páginas e na página de <a href="/pt-BR/terms" className="text-primary hover:underline">Termos de Uso</a>.</p>
      </Card>

      <Card title="Modal Metas" id="modal-metas">
        <p>Clicar em <strong>Metas</strong> abre o documento estratégico do projeto: a tese central (informação política como infraestrutura global), o impacto pretendido em três dimensões (econômica, institucional, educacional) e o roadmap de cobertura por país.</p>
        <p>Aqui você encontra o "porquê" do projeto: qual problema estrutural resolve, qual valor entrega para investidores institucionais, governos, jornalistas e cidadãos. É a página mais densa institucionalmente, recomendada para quem está avaliando a plataforma como parceira ou referência analítica.</p>
      </Card>

      <Card title="Modal Global" id="modal-global">
        <p>Clicar em <strong>Global</strong> abre o mapa-múndi interativo das eleições nacionais previstas para 2026 e anos seguintes. Cada país com eleição registrada aparece em destaque, com volume de mercado em Polymarket (quando disponível) e candidato favorito segundo as odds.</p>
        <p>Atualmente, 14 países são monitorados, com foco em América Latina (Brasil, Argentina, Chile, Colômbia, Peru, México) e países-chave globais (EUA, França, Reino Unido). Para cada um, o card exibe data da eleição, principais candidatos, e link para ficha detalhada.</p>
        <p>É a porta de entrada para a expansão internacional da plataforma. Se você está acompanhando uma eleição específica, o mapa global é o atalho mais rápido para mudar de contexto sem precisar voltar à home.</p>
      </Card>

      <h2 id="afos-daily-card" className={S.h2}>2. AFOS Daily, Síntese do Dia</h2>
      <p className={S.p}>Logo abaixo do header aparece o <strong>card AFOS Daily</strong>: um bloco azul claro com a data de hoje, um trecho da síntese narrativa do dia (até 2 linhas) e um botão <strong>"Ler síntese →"</strong>.</p>
      <p className={S.p}>É a única peça do dashboard que <strong>não é dado bruto</strong>, é uma narrativa curada (~700 palavras, 4 minutos de leitura) cruzando os três sinais (mercado, pesquisa, notícia) com link inline para cada alegação. Publicada uma vez por dia, ao final do dia.</p>

      <Card title="Como o AFOS Daily funciona">
        <p><strong>Estrutura fixa:</strong> lede de 2-3 linhas com 3 movimentos-chave + 4 seções numeradas (Mercado de previsão, O que os institutos registraram, O que a imprensa cobriu, Divergências do dia) + síntese final em 3 bullets.</p>
        <p><strong>Regras editoriais:</strong> cada alegação com link inline para a fonte (mínimo 1 link por parágrafo substantivo); zero adjetivos partidários; tom observacional ("o mercado precificou", "a pesquisa registrou"); datas sempre explícitas (nunca "ontem"); variações ↑↓pp citadas.</p>
        <p><strong>Permalink permanente:</strong> cada dia tem URL própria (<code>/daily/2026-04-28</code>). Permite citar e linkar uma síntese específica em redes sociais, reportagens ou relatórios.</p>
        <p><strong>Histórico:</strong> dentro da página da síntese, botões <strong>"← Síntese anterior"</strong> e <strong>"Próxima síntese →"</strong> navegam pelos dias do arquivo.</p>
        <p><strong>3 idiomas:</strong> PT-BR · EN · ES. Trocar de idioma preserva a data sendo lida. Termos políticos brasileiros sem tradução direta (TSE, STF, BolsoMaster, lideranças envelhecidas, etc.) ficam em português com link inline para o <a href="/pt-BR/glossary" className="text-primary hover:underline">glossário</a> que explica nos 3 idiomas.</p>
        <p><strong>Tema visual:</strong> toggle no canto superior direito alterna entre tema claro (padrão) e Sapphire Blue (fundo azul escuro com texto claro, ideal para leitura noturna).</p>
        <p><strong>Validação:</strong> a feature passou por um piloto público de 7 dias (22-28 de abril/2026) com decisão GO/NO-GO no último dia. Aprovada como feature permanente.</p>
      </Card>

      <p className={S.p}><strong>Quando vale ler:</strong> quando você quer entender <em>por quê</em> os números do dashboard mexeram, não apenas <em>quanto</em>. O dashboard mostra a foto do dia; o AFOS Daily explica a história, com fontes auditáveis para você verificar cada passo.</p>

      <h2 id="cards-polymarket" className={S.h2}>3. Os 6 Cards Polymarket, Painel instantâneo</h2>
      <p className={S.p}>Logo após o header, aparecem <strong>seis cards lado a lado</strong> resumindo os mercados mais importantes do Polymarket no momento. Cada card mostra um <strong>percentual</strong> (probabilidade precificada pelo mercado) com a <strong>variação em relação ao dia anterior</strong> (↑↓pp).</p>

      <Card title="🏆 Card 1, Quem vence a presidência no 1º turno">
        <p>Mostra as probabilidades dos principais candidatos de <strong>ganhar no primeiro turno</strong> (&gt;50% dos votos válidos, evitando 2º turno).</p>
        <p><strong>Exemplo hoje (19/Abr):</strong> Candidato B 39.6% × Candidato A 39.5% → <em>empate técnico</em>. Nenhum dos dois com chance real de vitória em 1º turno.</p>
        <p><strong>Como ler:</strong> se um candidato passa de 50%, o mercado acredita em vitória direta; abaixo disso, haverá 2º turno.</p>
      </Card>
      <Card title="🥈 Card 2, Quem fica em 2º lugar">
        <p>Mostra a probabilidade de <strong>cada candidato ser o vice-líder</strong> (chegar ao 2º turno em segunda posição).</p>
        <p><strong>Exemplo hoje:</strong> Candidato B 66.5% (↑0.5pp) × Candidato A 17% (↑1pp) × Candidato C 6.7%.</p>
        <p><strong>Como ler:</strong> esse mercado <strong>consolida o cenário de 2º turno</strong>. Se o Candidato B lidera com 66.5%, significa que o dinheiro vê <em>quase certo</em> que ele disputa o 2º turno, independentemente de quem enfrentar.</p>
      </Card>
      <Card title="🥉 Card 3, Quem fica em 3º lugar">
        <p>Mostra os favoritos a ficarem em <strong>3ª posição</strong>, ou seja, fora do 2º turno, mas com influência decisiva (transferem votos).</p>
        <p><strong>Exemplo hoje:</strong> Candidato C 32% × Candidato D 19% × Candidato F 3.95%.</p>
        <p><strong>Como ler:</strong> esse é o <strong>termômetro da 3ª via</strong>. Quando um nome sobe forte aqui (como o Candidato D subiu de 8.5% → 19.5% em 18/Abr), o mercado está precificando uma articulação política relevante.</p>
      </Card>
      <Card title="⚖️ Card 4, STF (Impeachment de ministro)">
        <p>Mostra a probabilidade de <strong>algum ministro do STF sofrer impeachment antes de 2027</strong>.</p>
        <p><strong>Exemplo hoje:</strong> 11.5% (↓1.5pp, caindo -4.5pp em 2 dias).</p>
        <p><strong>Como ler:</strong> esse número é o <strong>risco institucional</strong> precificado. Quando sobe, há tensão real entre Congresso e STF. Quando cai, o mercado acredita que o sistema "vai se acomodar".</p>
      </Card>
      <Card title="🏛️ Card 5, Senado (Partido com mais cadeiras)">
        <p>Mostra a probabilidade de <strong>cada partido ganhar a maioria das cadeiras</strong> na eleição do Senado 2026.</p>
        <p><strong>Exemplo hoje:</strong> PL 76.5% (↓3pp) × MDB 10.5% × PSD 5.1% × União 3.1% × PT 2.4%.</p>
        <p><strong>Como ler:</strong> o Senado <strong>condiciona o próximo governo</strong>. Um presidente sem base no Senado governa pouco. Quando o PL cai (↓3pp), o mercado precifica um cenário diferente de 2022, onde o governo teve Senado adverso.</p>
      </Card>
      <Card title="📈 Card 6, Inflação 2026">
        <p>Mostra a probabilidade de <strong>em qual faixa a inflação anual de 2026 vai fechar</strong>.</p>
        <p><strong>Exemplo hoje:</strong> 5.00-5.49% tem 39.45% de probabilidade (↑2.75pp) × 4.50-4.99%: 33.75% × 4.00-4.49%: 9.45%.</p>
        <p><strong>Como ler:</strong> esse é o <strong>termômetro econômico</strong>. Inflação alta pressiona o governo, favorece oposição. Quando a faixa 5.00-5.49% dispara (↑2.75pp em 1 dia), o mercado está dizendo "esqueça inflação baixa", com consequência eleitoral direta.</p>
      </Card>

      <h2 id="pesquisas" className={S.h2}>4. Pesquisas Eleitorais</h2>
      <p className={S.p}>Abaixo dos cards Polymarket, você encontra a seção de pesquisas eleitorais.</p>

      <h3 className={S.h3}>Como as pesquisas chegam aqui</h3>
      <p className={S.p}>Todas as pesquisas registradas no <strong>TSE (Tribunal Superior Eleitoral)</strong> são baixadas automaticamente todos os dias. A base conta com <strong>mais de 150 pesquisas indexadas</strong> e cresce com cerca de <strong>2 a 4 novas pesquisas registradas por semana</strong>, ritmo que acelera à medida que o ciclo eleitoral avança.</p>

      <h3 className={S.h3}>Institutos monitorados</h3>
      <p className={S.p}>A plataforma acompanha 17+ institutos brasileiros. Os mais frequentes no último mês:</p>
      <div className={S.tableWrap}>
        <table className={S.table}>
          <thead><tr><th className={S.th}>Instituto</th><th className={S.th}>Pesquisas recentes</th><th className={S.th}>Amostra média</th></tr></thead>
          <tbody>
            <tr className={S.trRow}><td className={S.td}>Paraná Pesquisas</td><td className={S.td}>3</td><td className={S.td}>1.593 entrevistados</td></tr>
            <tr className={S.trAlt}><td className={S.td}>Datafolha</td><td className={S.td}>2</td><td className={S.td}>1.513</td></tr>
            <tr className={S.trRow}><td className={S.td}>100 Cidades</td><td className={S.td}>2</td><td className={S.td}>1.400</td></tr>
            <tr className={S.trAlt}><td className={S.td}>Instituto Piauiense</td><td className={S.td}>2</td><td className={S.td}>800</td></tr>
            <tr><td className={S.td}>Veritá</td><td className={S.td}>1</td><td className={S.td}>1.220</td></tr>
          </tbody>
        </table>
      </div>

      <h3 className={S.h3}>Saber não só o que as pesquisas dizem, mas o que vão dizer</h3>
      <p className={S.p}>Pela legislação brasileira, todo instituto é obrigado a <strong>registrar cada pesquisa no TSE antes de divulgá-la</strong>, com protocolo único, data do campo (quando está sendo aplicada), data prevista de publicação, tamanho da amostra e custo. Esse registro é <strong>público</strong> e fica disponível na base oficial do TSE no instante em que o instituto o envia.</p>
      <p className={S.p}><strong>É aí que a inteligência do AFOS entra:</strong> a plataforma roda ciclos automáticos de ingestão ao longo do dia consultando o TSE diretamente. Quando uma pesquisa nova é registrada na base oficial, em poucas horas ela já está processada, cruzada com Polymarket e exibida na sua tela, <strong>sem depender de jornalista cobrir ou de nota oficial do instituto</strong>.</p>

      <h3 className={S.h3}>O que você vê em cada pesquisa</h3>
      <ul className={S.ul}>
        <li><strong>Instituto</strong> (ex: Paraná Pesquisas, Datafolha, Quaest)</li>
        <li><strong>Protocolo TSE</strong> (identificador único, auditável)</li>
        <li><strong>Campo:</strong> datas em que os entrevistadores estão coletando respostas</li>
        <li><strong>Publicação prevista:</strong> quando o instituto vai divulgar o resultado</li>
        <li><strong>Amostra:</strong> número de entrevistados</li>
        <li><strong>Status:</strong> "publicada" (já saiu) ou "campo ativo" (ainda sendo aplicada)</li>
      </ul>

      <h3 className={S.h3}>Exemplo real hoje (19/Abr)</h3>
      <blockquote className={S.quote}>
        Paraná Pesquisas, nacional, campo <strong>21-23/Abr (em andamento)</strong>, publicação prevista <strong>24/Abr</strong>, amostra 1.680
      </blockquote>
      <p className={S.p}>Você sabe <strong>com 5 dias de antecedência</strong> que na quinta-feira haverá uma pesquisa nacional da Paraná Pesquisas com quase 1.700 entrevistados.</p>
      <Callout title="Valor pra você">
        <p>Imprensa e analistas tradicionais só descobrem uma pesquisa <strong>quando o instituto divulga publicamente</strong>, e isso pode ser 5 a 10 dias depois do registro. O AFOS descobre <strong>no mesmo dia em que o registro entra no TSE</strong>, porque seus ciclos de ingestão operam automaticamente em intervalos de poucas horas. Isso transforma a lógica: você para de <strong>reagir a notícias</strong> e passa a <strong>antecipá-las</strong>.</p>
      </Callout>

      <h3 id="criterios-institutos" className={S.h3Anchor}>Critérios de avaliação dos institutos</h3>
      <p className={S.p}>Além de listar as pesquisas, o AFOS exibe no dashboard um card chamado <strong>"Institutos Monitorados, Confiabilidade"</strong>, onde cada instituto recebe uma classificação de 1 a 5 estrelas. Essa classificação serve como <strong>régua de peso editorial</strong> para ajudar o leitor a decidir quanto confiar quando duas pesquisas divergem.</p>
      <p className={S.p}><strong>Natureza da classificação:</strong> é uma avaliação <em>editorial qualitativa</em>, não um score calculado automaticamente. Reflete o consenso público do mercado eleitoral brasileiro (analistas, jornalistas especializados, literatura metodológica). Funciona como primeira aproximação honesta; a evolução para score quantitativo está no roadmap do AFOS pós-ciclo eleitoral.</p>

      <h4 className={S.h4}>Os 5 critérios considerados</h4>
      <div className="overflow-x-auto my-4">
        <table className={S.table}>
          <thead>
            <tr>
              <th className={S.th}>Critério</th>
              <th className={S.th}>O que mede</th>
            </tr>
          </thead>
          <tbody>
            <tr className={S.trRow}><td className={S.td}><strong>Histórico de precisão</strong></td><td className={S.td}>Quanto o instituto acertou em eleições passadas (dentro da margem declarada). Ex: MDA tem histórico robusto de acertos em ciclos anteriores.</td></tr>
            <tr className={S.trAlt}><td className={S.td}><strong>Metodologia de coleta</strong></td><td className={S.td}>Presencial (mais representativa), Online (viés digital), Telefônica (viés demográfico), Misto. Metodologia aparece entre parênteses no card: "(Presencial)", "(Online)", etc.</td></tr>
            <tr className={S.trRow}><td className={S.td}><strong>Tradição e tempo de mercado</strong></td><td className={S.td}>Quantos ciclos eleitorais o instituto já cobriu. Tradição longa reduz risco de erro metodológico sistêmico.</td></tr>
            <tr className={S.trAlt}><td className={S.td}><strong>Quem encomenda</strong></td><td className={S.td}>Proxy indireto de exigência de qualidade. Pesquisas encomendadas por bancos, investidores ou grandes veículos tendem a ter rigor maior (custo típico R$100k-300k).</td></tr>
            <tr><td className={S.td}><strong>Frequência e abrangência</strong></td><td className={S.td}>Quantas pesquisas publica, com que regularidade, e se cobre cenários nacionais, estaduais ou apenas locais.</td></tr>
          </tbody>
        </table>
      </div>

      <h4 className={S.h4}>Escala de estrelas e interpretação</h4>
      <div className="overflow-x-auto my-4">
        <table className={S.table}>
          <thead>
            <tr>
              <th className={S.th}>Nível</th>
              <th className={S.th}>Significado</th>
              <th className={S.th}>Como ler as pesquisas desse instituto</th>
            </tr>
          </thead>
          <tbody>
            <tr className={S.trRow}><td className={S.td}><strong>★★★★★</strong></td><td className={S.td}>Referência nacional</td><td className={S.td}>Cite sem ressalva. Dado costuma ser robusto e auditável.</td></tr>
            <tr className={S.trAlt}><td className={S.td}><strong>★★★★</strong></td><td className={S.td}>Alta confiabilidade</td><td className={S.td}>Dado sólido. Boa para formar opinião, idealmente com comparação cruzada.</td></tr>
            <tr className={S.trRow}><td className={S.td}><strong>★★★</strong></td><td className={S.td}>Confiável</td><td className={S.td}>Usar, mas sempre comparar com pelo menos 1-2 outras pesquisas do mesmo período.</td></tr>
            <tr className={S.trAlt}><td className={S.td}><strong>★★</strong></td><td className={S.td}>Usar com cautela</td><td className={S.td}>Cite sempre com ressalva. Histórico metodológico inconsistente ou instituto muito recente.</td></tr>
            <tr><td className={S.td}><strong>★</strong></td><td className={S.td}>Baixa confiabilidade</td><td className={S.td}>Evitar basear decisão apenas nesta fonte. Nenhum instituto brasileiro está neste nível atualmente.</td></tr>
          </tbody>
        </table>
      </div>

      <h4 className={S.h4}>Fontes consultadas para a classificação</h4>
      <ul className={S.ul}>
        <li><strong>Resultados eleitorais oficiais do TSE</strong>, comparação pública entre previsões e resultado de urna em ciclos anteriores (2018, 2022)</li>
        <li><strong>Literatura metodológica brasileira</strong>, ABEP (Associação Brasileira de Empresas de Pesquisa), artigos acadêmicos sobre precisão de pesquisas eleitorais, análises metodológicas em FGV e Poder360</li>
        <li><strong>Consenso jornalístico especializado</strong>, analistas políticos de referência (Folha, Estadão, O Globo, Poder360) que historicamente pesam os institutos de forma similar</li>
        <li><strong>Histórico público do TSE</strong>, protocolos de registro, tamanho de amostra, custo declarado, frequência de publicação (todos públicos e auditáveis)</li>
        <li><strong>Próprios sites dos institutos</strong>, metodologia declarada, divulgação de questionário, transparência sobre ponderação e estratificação</li>
      </ul>

      <Callout title="Limitação honesta">
        <p>A classificação atual é <strong>editorial e subjetiva</strong>. Duas pessoas avaliando os mesmos critérios poderiam chegar a notas ligeiramente diferentes. Para reduzir essa subjetividade no longo prazo, o <strong>roadmap do AFOS prevê evolução para score quantitativo</strong> baseado em dados históricos TSE + resultados oficiais, taxa de acerto, erro médio absoluto, amostra ponderada, frequência e transparência metodológica, com cálculo reproduzível publicado. Prazo dependente de dados do ciclo eleitoral de outubro/2026.</p>
      </Callout>

      <h2 id="analise-criteriosa" className={S.h2}>5. Análise Criteriosa (dos 4 primeiros candidatos)</h2>
      <p className={S.p}>Esta é a seção mais rica e a que exige leitura mais lenta.</p>
      <p className={S.p}>A análise é dividida em <strong>4 seções</strong>: Candidato A, Candidato B, Candidato C, e uma seção agrupada com os candidatos D, E e F. Cada seção tem <strong>três blocos</strong>: FORTES, FRACOS e ANÁLISE.</p>

      <h3 className={S.h3}>🟢 Bloco "FORTES"</h3>
      <p className={S.p}>Tudo o que está jogando a favor do candidato <strong>naquele dia</strong>, com <strong>fonte, data e veículo citados</strong>. Não é opinião, é dado auditável.</p>
      <blockquote className={S.quote}>
        <strong>Exemplo Candidato A hoje:</strong> "POLYMARKET (19/Abr): 39.5% (estável) enquanto o Candidato B desinfla. 2º lugar Poly Candidato A SOBE 17% (↑1pp). Folha: 'Candidato A intensifica agenda voltada às mulheres'. Poder360: 'Mulheres viram foco central'."
      </blockquote>

      <h3 className={S.h3}>🔴 Bloco "FRACOS"</h3>
      <p className={S.p}>Tudo que está <strong>contra</strong> o candidato, com a mesma profundidade dos blocos fortes. O AFOS é <strong>simétrico</strong>.</p>
      <blockquote className={S.quote}>
        <strong>Exemplo Candidato A hoje:</strong> "Candidato B mantém liderança mínima. Paraná Pesquisas SP: 2T Candidato B 48.1% × Candidato A 40.3%. BNews: queda Candidato A / crescimento Candidato B no Nordeste. Gazeta Povo: 'Como o Candidato A derreteu vantagem de 2022'."
      </blockquote>

      <h3 className={S.h3}>🔵 Bloco "ANÁLISE"</h3>
      <p className={S.p}>A costura. Como os pontos de fortes e fracos se conectam, e o que isso significa estrategicamente naquele momento.</p>

      <h2 id="quadro-comparativo" className={S.h2}>6. Quadro Comparativo</h2>
      <p className={S.p}>Uma tabela única que resume candidato por candidato:</p>
      <div className={S.tableWrap}>
        <table className={S.table}>
          <thead><tr><th className={S.th}>Candidato</th><th className={S.th}>Pesquisa vigente</th><th className={S.th}>Polymarket</th><th className={S.th}>Tendência</th></tr></thead>
          <tbody>
            <tr className={S.trRow}><td className={S.td}>Candidato A (PT)</td><td className={S.td}>37% 1T (Quaest) / 39.2% (CNT/MDA)</td><td className={S.td}>39.5% (estável)</td><td className={S.td}>Empate técnico com Candidato B</td></tr>
            <tr className={S.trAlt}><td className={S.td}>Candidato B (PL)</td><td className={S.td}>32% 1T (Quaest) / 35.9% (Veritá)</td><td className={S.td}>39.6% (↓0.8pp)</td><td className={S.td}>Desinfla salto, mantém liderança mínima</td></tr>
            <tr className={S.trRow}><td className={S.td}>Candidato C (Missão)</td><td className={S.td}>4.4% (AtlasIntel)</td><td className={S.td}>6.25% (estável)</td><td className={S.td}>3º lugar recupera (Candidato D regride)</td></tr>
            <tr><td className={S.td}>...</td><td className={S.td}>...</td><td className={S.td}>...</td><td className={S.td}>...</td></tr>
          </tbody>
        </table>
      </div>
      <Callout title="Valor pra você">
        <p>Em um único olhar, você vê o estado do jogo completo.</p>
      </Callout>

      <h2 id="perfil-candidatos" className={S.h2}>7. Perfil dos Candidatos</h2>
      <p className={S.p}>Esta seção apresenta cada candidato em <strong>cards individuais</strong> com cinco campos:</p>
      <ul className={S.ul}>
        <li><strong>Nome, partido, idade, cargo atual</strong></li>
        <li><strong>Polymarket:</strong> percentual atual no mercado presidencial</li>
        <li><strong>Pesquisa:</strong> número mais recente de intenção de voto</li>
        <li><strong>Posicionamento:</strong> ideologia resumida (centro-esquerda, direita liberal, etc.)</li>
        <li><strong>⚠️ Risco:</strong> o resumo do dia, o que pode mudar, o que está sob pressão, o que favorece</li>
      </ul>
      <Callout title="Valor pra você">
        <p>É um "quem é quem" rápido. Se alguém pergunta "quem é o Candidato C?", você abre, lê 20 segundos e responde com dados.</p>
      </Callout>

      <h2 id="paises" className={S.h2}>8. Países, Botões Clicáveis</h2>
      <p className={S.p}>A plataforma cobre <strong>14+ países</strong> com eleições monitoradas. Cada país aparece como um botão clicável. Clicando em um, você vê o mesmo tipo de cruzamento (Polymarket + pesquisas locais + notícias) aplicado àquela eleição.</p>
      <p className={S.p}><strong>Países em destaque atualmente:</strong> Brasil, EUA, França, Alemanha, Reino Unido, Canadá, Austrália, Coreia do Sul, Colômbia, Chile, entre outros.</p>
      <p className={S.p}><strong>Por que isso importa:</strong> decisões políticas globais se influenciam. O resultado dos EUA 2024 afeta a dinâmica do Brasil 2026. Ver o mapa completo te dá contexto.</p>

      <h2 id="live-news" className={S.h2}>9. Live Eleições News 120'</h2>
      <p className={S.p}>Um feed ao vivo que mostra as <strong>notícias publicadas nos últimos 120 minutos</strong> relacionadas às eleições monitoradas. Fontes incluem Google News, grandes portais brasileiros e agências internacionais.</p>
      <p className={S.p}><strong>Como funciona:</strong> a cada 30 minutos, um robô busca notícias em 6 categorias diferentes (eleição presidencial, candidatos específicos, escândalos, pesquisas, aprovação do governo, disputas estaduais) e nos 3 idiomas da plataforma (PT-BR, EN, ES). O feed exibe as mais relevantes em ordem cronológica.</p>
      <Callout title="Valor pra você">
        <p>Em vez de abrir 10 abas de jornais, você tem o essencial em uma única tela, filtrado por relevância eleitoral.</p>
      </Callout>

      <h2 id="sentimento" className={S.h2}>10. Clima Político</h2>
      <p className={S.p}>Um painel dedicado a mostrar <strong>o clima geral da disputa</strong> em quatro lentes simultâneas:</p>
      <ul className={S.ul}>
        <li><strong>Direita:</strong> o que está jogando a favor/contra os candidatos de direita</li>
        <li><strong>Esquerda:</strong> idem para candidatos de esquerda</li>
        <li><strong>Terceira via:</strong> como os candidatos fora do eixo Candidato A / Candidato B estão se movendo</li>
        <li><strong>Polymarket consolidado:</strong> o número único do dia que resume o cenário</li>
      </ul>
      <Callout title="Valor pra você">
        <p>Em 30 segundos você tem a <strong>temperatura política</strong> do momento, sem precisar ler qualquer análise longa.</p>
      </Callout>

      <h2 id="inss-lulinha" className={S.h2}>11. Escândalo INSS e o Caso do Familiar do Incumbente</h2>
      <p className={S.p}>Card específico sobre o maior escândalo econômico de 2026, a fraude dos descontos indevidos no INSS, e as ramificações envolvendo familiar do incumbente.</p>
      <p className={S.p}><strong>O que mostra:</strong> texto estruturado em 4 blocos:</p>
      <ul className={S.ul}>
        <li><strong>Contexto atual</strong> do caso (novidades do dia)</li>
        <li><strong>Dinâmica institucional</strong> (Congresso, PF, PGR, STF)</li>
        <li><strong>Impacto no STF</strong> (probabilidade de impeachment no Polymarket)</li>
        <li><strong>Campo político</strong> (como o escândalo afeta Candidato A vs Candidato B)</li>
      </ul>
      <Callout title="Valor pra você">
        <p>Um tema que envolve dezenas de atores (ministros, senadores, delegados, juízes) fica <strong>consolidado em 2 minutos de leitura</strong>, com as conexões já feitas.</p>
      </Callout>

      <h2 id="banco-master" className={S.h2}>12. Impacto do Escândalo Banco Master</h2>
      <p className={S.p}>Card focado no caso Banco Master e na delação do executivo envolvido, outro escândalo econômico que se desenrola em capítulos.</p>
      <p className={S.p}><strong>O que mostra:</strong></p>
      <ul className={S.ul}>
        <li>Últimos desenvolvimentos (ex: BC aprovou controle do executivo após primeiro rejeitar)</li>
        <li>Tensões institucionais (PF × PGR, CPMI × STF)</li>
        <li>Cruzamento com o Polymarket (o mercado acredita em impeachment de ministro?)</li>
        <li>Consequências eleitorais</li>
      </ul>
      <Callout title="Valor pra você">
        <p>Por ser uma história <strong>longa e fragmentada</strong> na imprensa, ter um diário consolidado economiza horas de busca.</p>
      </Callout>

      <h2 id="stf" className={S.h2}>13. Credibilidade do STF, Impacto Eleitoral</h2>
      <p className={S.p}>Card dedicado à <strong>leitura do Supremo como ator eleitoral</strong>, porque o STF, embora não vote, influencia decisivamente as eleições.</p>
      <p className={S.p}><strong>O que mostra:</strong></p>
      <ul className={S.ul}>
        <li><strong>Ministro por ministro</strong> (Ministro 1, Ministro 2, Ministro 3, Ministro 4): o que cada um está fazendo</li>
        <li><strong>Nexo:</strong> como as ações individuais se conectam em estratégia institucional</li>
        <li><strong>Análise:</strong> interpreta o Polymarket, mercado acha que haverá ruptura (impeachment) ou acomodação?</li>
      </ul>
      <blockquote className={S.quote}>
        <strong>Exemplo hoje:</strong> "STF impeach cai 11.5% (↓1.5pp, -4.5pp em 2 dias). Supremo quer endurecer CPIs. Ministro 1 pode se declarar impedido em caso BRB."
      </blockquote>
      <p className={S.p}><strong>Tradução:</strong> o STF está <strong>se blindando</strong>. O mercado sente que não haverá impeachment, o que reduz o risco para candidatos que apostariam em ruptura institucional.</p>
      <Callout title="Valor pra você">
        <p>Entender o STF como <strong>ator político</strong>, não só jurídico.</p>
      </Callout>

      <h2 id="footer" className={S.h2}>14. Footer (rodapé da página)</h2>
      <p className={S.p}>O rodapé é organizado em <strong>três blocos enxutos</strong>, cada um com propósito claro. Nenhum link no footer aponta para página vazia, cada um entrega algo específico.</p>

      <h3 className={S.h3}>Bloco 1, Navegação</h3>
      <p className={S.pTight}>Atalhos para as áreas principais da plataforma:</p>
      <ul className={S.ul}>
        <li><strong>Dashboard</strong>, aplicação principal com os 6 cards Polymarket, análises e cards temáticos</li>
        <li><strong>Mapa Global</strong>, visualização D3.js interativa dos 14+ países monitorados</li>
        <li><strong>América Latina</strong>, hub regional com Brasil, Colômbia, Chile e México</li>
        <li><strong>Europa</strong>, hub regional com França, Alemanha e Reino Unido</li>
      </ul>

      <h3 className={S.h3}>Bloco 2, Open Source</h3>
      <p className={S.pTight}>Transparência completa sobre o projeto, conforme padrão de referência em software open-source:</p>
      <ul className={S.ul}>
        <li><strong>Licença Apache 2.0</strong>, uso, modificação e redistribuição permitidos com atribuição</li>
        <li><strong>⭐ GitHub</strong>, repositório público com código-fonte auditável</li>
        <li><strong>Segurança</strong>, política de <em>disclosure</em> responsável para vulnerabilidades</li>
        <li><strong>Contribuir</strong>, guia para desenvolvedores externos enviarem melhorias</li>
        <li><strong>Código de Conduta</strong>, regras de convivência na comunidade (Contributor Covenant)</li>
      </ul>

      <h3 className={S.h3}>Bloco 3, Fale Conosco</h3>
      <p className={S.pTight}>Quatro canais de email segmentados por propósito:</p>
      <ul className={S.ul}>
        <li>📧 <strong>Contato</strong>, imprensa, parcerias e assuntos gerais</li>
        <li>💬 <strong>Suporte</strong>, ajuda para uso da plataforma</li>
        <li>🔒 <strong>Segurança</strong>, reporte confidencial de vulnerabilidades</li>
        <li>👤 <strong>Founder</strong>, contato direto com o fundador</li>
      </ul>

      <h3 className={S.h3}>Rodapé final</h3>
      <p className={S.p}>Linha inferior com identificação da plataforma, fontes de dados com frequências reais ("Polymarket 5min, 17+ Institutos TSE, Google News 30min"), disclaimer de não-afiliação com o Polymarket e botão "voltar ao topo".</p>
      <Callout title="Por que o footer é assim">
        <p>Muitos sites preenchem o rodapé com dezenas de links decorativos que não funcionam ou levam a páginas vazias. O AFOS optou pelo oposto: <strong>poucos links, todos funcionais</strong>. Se um link aparece no footer, ele entrega algo real quando clicado. Essa é a mesma filosofia de projetos open-source maduros como Supabase, Linear e Prisma.</p>
      </Callout>

      <div className="h-px bg-gray-200 my-12" />

      <h2 id="bastidores" className={S.h2}>Por trás da plataforma</h2>
      <h3 className={S.h3}>Os dados chegam sozinhos</h3>
      <p className={S.p}>Tudo o que você lê vem de pipelines automatizados que rodam 24 horas por dia:</p>
      <ul className={S.ul}>
        <li><strong>A cada 30 minutos:</strong> o Polymarket é consultado e os percentuais são atualizados</li>
        <li><strong>A cada 30 minutos:</strong> notícias são coletadas em 6 categorias temáticas e 3 idiomas</li>
        <li><strong>Diariamente:</strong> novas pesquisas registradas no TSE são baixadas e indexadas</li>
        <li><strong>Duas vezes ao dia (12h e 18h BRT):</strong> cruzamento completo das 3 fontes é executado, comparando o estado atual com o do dia anterior (variações ↑↓pp), e persistido no banco para formar histórico auditável</li>
      </ul>

      <h3 className={S.h3}>Análises geradas por IA a partir de dados públicos</h3>
      <p className={S.p}>As análises criteriosas (os blocos <strong>Fortes</strong>, <strong>Fracos</strong>, <strong>Análise</strong>, o <strong>Cruzamento</strong> e os <strong>quatro cards temáticos</strong>) são geradas por <strong>inteligência artificial</strong> que:</p>
      <ol className={S.ol}>
        <li>Lê os valores atuais das 3 fontes</li>
        <li>Compara com os valores do dia anterior</li>
        <li>Consulta as notícias mais relevantes das últimas 24 horas</li>
        <li>Aplica as regras de convergência/divergência descritas anteriormente</li>
        <li>Escreve a narrativa resultante, citando fontes, datas e veículos</li>
      </ol>
      <p className={S.p}>Todos os dados usados são <strong>públicos e auditáveis</strong>, qualquer pessoa pode verificar Polymarket, pesquisas do TSE ou notícias citadas.</p>
      <Callout title="Por que isso é importante dizer">
        <p>Transparência sobre o uso de IA é padrão moderno, e é o que diferencia um projeto sério de um projeto opaco.</p>
      </Callout>

      <h2 id="perfis-usuario" className={S.h2}>Perfis de usuários</h2>
      <Card title="👤 Cidadão curioso">
        <p><strong>Visita:</strong> 2x por semana, 5 minutos por vez.</p>
        <p><strong>O que faz:</strong> lê os 6 cards Polymarket + o card Clima Político.</p>
        <p><strong>Valor:</strong> mantém-se informado sem consumir jornais enviesados. Forma opinião baseada em dados.</p>
      </Card>
      <Card title="👤 Profissional (analista, consultor, jornalista, assessor)">
        <p><strong>Visita:</strong> diariamente, 15 minutos.</p>
        <p><strong>O que faz:</strong> lê a análise criteriosa inteira + o quadro comparativo + o feed de notícias 120'. Anota variações.</p>
        <p><strong>Valor:</strong> entende antes dos competidores que o jogo mudou. Cita fontes auditáveis.</p>
      </Card>
      <Card title="👤 Investidor / gestor de risco">
        <p><strong>Visita:</strong> diariamente, 20 minutos.</p>
        <p><strong>O que faz:</strong> lê Polymarket consolidado + card STF + card Inflação + card Banco Master. Cruza com posições do portfólio.</p>
        <p><strong>Valor:</strong> risco político é <strong>preço de ativo</strong>. Saber antes que o mercado precifica uma inelegibilidade ou um escândalo = vantagem concreta em trade/hedge.</p>
      </Card>

      <h2 id="limitacoes" className={S.h2}>Quando o AFOS não serve (limitações honestas)</h2>
      <p className={S.p}>Nenhuma plataforma é útil para todas as perguntas. Ser honesto sobre o que o AFOS <em>não</em> entrega é o que separa uma ferramenta séria de uma promessa vaga.</p>

      <h3 className={S.h3}>O AFOS não substitui pesquisa estatística formal</h3>
      <p className={S.p}>Se você precisa de <strong>margem de erro, intervalo de confiança ou amostragem científica controlada</strong> (em linguagem simples: números com precisão matemática certificada e metodologia auditável de amostragem), a fonte é o <strong>instituto de pesquisa</strong> (Datafolha, Quaest, IBGE etc.). O AFOS consolida e cruza esses dados, mas não produz pesquisa nova.</p>

      <h3 className={S.h3}>O AFOS não prevê resultados com precisão quantitativa</h3>
      <p className={S.p}>O cruzamento é <strong>narrativo estruturado</strong>, não modelo estatístico. A plataforma não entrega previsões com precisão matemática calculada. Entrega <strong>direção, ritmo e convergência</strong>, leituras qualitativas úteis para apoiar decisão, mas que não substituem a modelagem matemática formal que acadêmicos e fundos quantitativos usam.</p>

      <h3 className={S.h3}>O AFOS depende da qualidade dos mercados de previsão</h3>
      <p className={S.p}>Em países onde o <strong>Polymarket não tem mercados ativos</strong> ou tem mercados com liquidez muito baixa (abaixo de US$ 100 mil em volume), o sinal de mercado fica ruidoso. O AFOS sinaliza esses casos, mas a confiança dos dados cai proporcionalmente.</p>

      <h3 className={S.h3}>O AFOS não é recomendação de investimento ou voto</h3>
      <p className={S.p}>É <strong>informação estruturada para apoiar decisão</strong>. Decisão sobre portfolio, apostas ou voto é responsabilidade exclusiva de quem usa. A plataforma não opera com cliente, não recebe comissão e não tem conflito de interesse declarado, justamente para não precisar recomendar nada.</p>

      <h3 className={S.h3}>A cobertura atual é restrita a 14+ países</h3>
      <p className={S.p}>Países fora dessa lista não têm pipeline de coleta específico. O mapa global mostra agregados, mas a profundidade de análise (cruzamento pesquisas × Polymarket × notícias) só existe onde há infraestrutura pronta. Expansão é contínua, mas não é universal.</p>

      <h2 id="diferenciacao" className={S.h2}>O que torna o AFOS diferente de Google News ou um jornal</h2>
      <div className={S.tableWrap}>
        <table className={S.table}>
          <thead><tr><th className={S.th}></th><th className={S.th}>Jornal tradicional</th><th className={S.th}>Google News</th><th className={S.th}>AFOS</th></tr></thead>
          <tbody>
            <tr className={S.trRow}><td className={S.td}>Viés editorial</td><td className={S.td}>Alto</td><td className={S.td}>Médio</td><td className={S.td}><strong>Transparente (mostra os 2 lados)</strong></td></tr>
            <tr className={S.trAlt}><td className={S.td}>Integra dinheiro real?</td><td className={S.td}>Não</td><td className={S.td}>Não</td><td className={S.td}><strong>Sim, mercado de previsão</strong></td></tr>
            <tr className={S.trRow}><td className={S.td}>Cruza múltiplas fontes?</td><td className={S.td}>Não</td><td className={S.td}>Agrega mas não cruza</td><td className={S.td}><strong>Sim, com lógica e método</strong></td></tr>
            <tr className={S.trAlt}><td className={S.td}>Mostra mudança no tempo?</td><td className={S.td}>Não</td><td className={S.td}>Não</td><td className={S.td}><strong>Sim (↑↓pp variações diárias)</strong></td></tr>
            <tr className={S.trRow}><td className={S.td}>Open source?</td><td className={S.td}>Não</td><td className={S.td}>Não</td><td className={S.td}><strong>Sim, Apache 2.0</strong></td></tr>
            <tr><td className={S.td}>Custa?</td><td className={S.td}>Assinatura</td><td className={S.td}>Grátis mas limitado</td><td className={S.td}><strong>100% grátis, sem login</strong></td></tr>
          </tbody>
        </table>
      </div>

      <h2 id="comece-aqui" className={S.h2}>Comece por aqui</h2>
      <p className={S.p}>Se é sua primeira visita, este é o caminho mais rápido para extrair valor em <strong>5 minutos</strong>:</p>
      <Card title="Passo 1, Abra o Dashboard">
        <p>Os <strong>6 Cards Polymarket</strong> no topo já dão o panorama do dia. Leia na ordem: <em>1º turno</em> → <em>2º lugar</em> → <em>STF</em> → <em>Senado</em>. Foco nas variações <strong>↑↓pp</strong>, elas dizem o que se moveu desde ontem.</p>
      </Card>
      <Card title="Passo 2, Desça até a Análise Criteriosa">
        <p>Escolha um candidato que te interessa e leia os blocos <strong>FORTES</strong> e <strong>FRACOS</strong> lado a lado. Vai sentir desconforto honesto lendo os pontos contra o seu preferido, isso é sinal de que o método funciona. O AFOS mostra os dois lados de cada número.</p>
      </Card>
      <Card title="Passo 3, Consulte o Card Clima Político">
        <p>O resumo visual do clima político do dia em <strong>30 segundos</strong>. Direita, esquerda, 3ª via e Polymarket consolidado, tudo em uma tela.</p>
      </Card>
      <Callout title="Depois disso">
        <p>Volte <strong>amanhã</strong>. O valor real do AFOS aparece na sequência: um dia dá contexto, três dias dão padrão, uma semana dá tendência. Ler uma única vez é informar-se; ler diariamente é <strong>antecipar</strong>.</p>
      </Callout>

      <SummaryFrame>
        AFOS Analytics é a primeira plataforma que combina mercados de previsão com dinheiro real, pesquisas oficiais e notícias em tempo real para mostrar, com honestidade e transparência, o que os dados realmente dizem sobre política, sem viés, sem propaganda, livre e sem cadastro obrigatório.
      </SummaryFrame>

      <p className="text-center text-xs text-gray-400 mt-10 mb-2">Atualizado em abril de 2026</p>
    </>
  )
}
