#!/usr/bin/env node
/**
 * Gera "Paper Grigorian - The Price of Democracy (PT).html" e o .pdf, na MESMA
 * pasta de "Assunto Grigorian.pdf".
 *
 * O CSS é EXTRAÍDO do documento irmão em vez de reescrito, para os dois ficarem
 * da mesma família e para herdar a correção de quebra de página: as regras
 * page-break ficam FORA de @media print, porque o PDF é gerado com
 * emulateMedia('screen') e o bloco @media print nunca é aplicado.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const PASTA = 'C:/Users/afos3/OneDrive/Documentos/MeusProjetos'
const IRMAO = resolve(PASTA, 'Assunto Grigorian.html')
const SAIDA_HTML = resolve(PASTA, 'Paper Grigorian - The Price of Democracy (PT).html')
const SAIDA_PDF = resolve(PASTA, 'Paper Grigorian - The Price of Democracy (PT).pdf')

if (!existsSync(IRMAO)) { console.error('não achei o documento irmão:', IRMAO); process.exit(1) }
const irmao = readFileSync(IRMAO, 'utf-8')
const m = irmao.match(/<style>[\s\S]*?<\/style>/)
if (!m) { console.error('não consegui extrair o <style> do irmão'); process.exit(1) }
const ESTILO = m[0]

const BODY = `
<div class="page">

  <div class="cover">
    <div class="brand">AFOS Analytics · Documento de leitura</div>
    <h1>O Preço da Democracia</h1>
    <p class="sub">Notas de risco soberano, spreads de títulos e ciclos políticos de negócios em países em desenvolvimento. Tradução e síntese em português do paper enviado por David Grigorian.</p>
    <div class="meta">
      <span><b>Autores:</b> Steven Block e Paul M. Vaaler</span>
      <span><b>Origem:</b> CID Working Paper nº 82, Harvard, dez/2001</span>
      <span><b>Publicado:</b> Journal of International Money and Finance, 2004, 23(6), 917-946</span>
    </div>
  </div>

  <div class="confid">
    <b>O que este documento é, e o que não é.</b> É uma <b>tradução de trabalho</b>, feita para leitura em português, do paper que David Grigorian enviou em 30 de julho de 2026. Traduz na íntegra o resumo, a pergunta, as hipóteses, o método, os dados, os resultados, as ressalvas e a conclusão. <b>Não reproduz as tabelas de regressão coluna a coluna</b>: descreve os coeficientes que importam e diz onde estão. <b>O que vale é o original em inglês</b>, e ele está linkado no fim. Nenhuma frase deste documento é opinião dos autores do paper, exceto onde está entre aspas ou explicitamente atribuída a eles. A última seção é leitura do AFOS e está marcada como tal.
  </div>

  <h2><span class="num">1.</span>Ficha</h2>
  <table>
    <tr><td class="date">Título</td><td>The Price of Democracy: Sovereign Risk Ratings, Bond Spreads and Political Business Cycles in Developing Countries</td></tr>
    <tr><td class="date">Autores</td><td>Steven Block e Paul M. Vaaler, The Fletcher School of Law and Diplomacy, Tufts University</td></tr>
    <tr><td class="date">Versão</td><td>CID Working Paper nº 82, Center for International Development, Harvard University, dezembro de 2001</td></tr>
    <tr><td class="date">Publicação</td><td>Revisado por pares e publicado no <i>Journal of International Money and Finance</i>, 2004, vol. 23, nº 6, p. 917-946</td></tr>
    <tr><td class="date">Enviado por</td><td>David Grigorian, em 30 de julho de 2026, com a frase "I meant to share with you this paper"</td></tr>
  </table>

  <h2><span class="num">2.</span>Resumo, traduzido do original</h2>
  <blockquote>
    <p>Em países em desenvolvimento, os ciclos políticos de negócios podem ter implicações não apenas para os governos no poder e seus eleitorados, mas também para atores estrangeiros envolvidos em alocar crédito e precificá-lo adequadamente para investimento. Examinamos essa proposição com dados de notas de risco soberano das principais agências de classificação de crédito e de spreads de crédito determinados por mercado sobre o rendimento de títulos, para países em desenvolvimento que realizaram eleições presidenciais nos anos 1980 e 1990. <em>Encontramos que as notas de risco soberano das agências caem e os spreads dos títulos sobem nos países em desenvolvimento durante períodos eleitorais.</em> Tanto as agências quanto os detentores de títulos parecem ver as eleições em países em desenvolvimento de forma negativa, e impõem custos adicionais de crédito.</p>
  </blockquote>

  <h2><span class="num">3.</span>A pergunta e a teoria por trás dela</h2>
  <p>A teoria dos <b>ciclos políticos de negócios</b>, em inglês <i>political business cycles</i> ou PBC, diz que governantes têm incentivo a manipular política fiscal e monetária no ano da eleição para parecerem competentes e se reelegerem. A literatura clássica, de Nordhaus (1975), Lindbeck (1976) e Tufte (1978), sempre tratou disso como uma relação <b>interna</b>: entre o governante e o eleitor.</p>
  <p>A pergunta dos autores é outra e é a novidade do paper: <b>se o governante tem esse incentivo, e se agências de rating e credores sabem disso, então esses terceiros também reagem à eleição.</b> Nas palavras deles, é olhar o ciclo político "de fora".</p>
  <p>Os autores registram que, em países em desenvolvimento, a literatura recente favorece o ramo <b>oportunista</b> da teoria, não o partidário: a divisão ideológica esquerda-direita é menos nítida, e a eleição funciona mais como referendo sobre o governante e sobre as condições econômicas recentes. Citam Ka e van de Walle (1994) sobre elites africanas: elas "raramente são motivadas por políticas específicas; buscam maximizar suas chances de sobrevivência política e por isso baseiam decisões de política na percepção de risco político".</p>

  <h2><span class="num">4.</span>As duas hipóteses</h2>
  <div class="card">
    <p><b>H1.</b> Períodos eleitorais estarão associados a <b>notas de risco soberano mais baixas</b> publicadas pelas agências.</p>
    <p><b>H2.</b> Períodos eleitorais estarão associados a <b>spreads de crédito mais altos</b> entre o rendimento dos títulos do país em desenvolvimento e o do Tesouro americano comparável.</p>
  </div>

  <h2><span class="num">5.</span>Método</h2>
  <h3>Modelo 1, das notas de risco</h3>
  <p>A variável dependente é a <b>nota soberana de longo prazo em moeda estrangeira</b>, medida em 31 de dezembro de cada ano, numa escala ordinal de <b>17 níveis, de 0 a 16</b>. Do lado direito entram a nota defasada, variáveis <i>dummy</i> de agência, país e ano, e <b>sete controles macroeconômicos</b>: renda per capita, crescimento do PIB, inflação, resultado fiscal, resultado externo, dívida externa e um indicador de calote recente. Sobre esse conjunto entra a variável de interesse, <b>ELECT</b>, que vale 1 se houve eleição presidencial naquele ano e 0 se não houve.</p>
  <p>Estimadores: <b>probit ordenado</b> como principal, com erros padrão corrigidos para agrupamento quando várias agências avaliam o mesmo país no mesmo ano, e o estimador dinâmico de painel <b>GMM de Arellano e Bond (1991)</b> como verificação, porque a presença simultânea de variável dependente defasada e efeitos fixos torna a estimação inconsistente.</p>
  <h3>Modelo 2, dos spreads</h3>
  <p>A variável dependente é o <b>spread relativo</b>, definido como a diferença entre o rendimento do título soberano e o do Tesouro americano comparável, <b>dividida pelo rendimento do Tesouro</b>. Os autores adotam o spread relativo, e não o absoluto, seguindo Lamy e Thomson (1988), porque ele é mais estável quando o nível geral de juros oscila muito ao longo do período observado.</p>
  <p>A janela é de <b>60 dias antes a 60 dias depois</b> do dia da eleição. Duas variáveis de tempo capturam o efeito: um contador de dias e um indicador que vale 1 depois do dia da eleição. Assim, a inclinação pré-eleitoral é um coeficiente e a pós-eleitoral é a soma de dois. A escolha de 60 dias veio da duração média da campanha de eleição geral na amostra, espelhada para o período posterior. Estimador: <b>GEE</b>, equações de estimação generalizadas, com ajuste de autocorrelação e erros padrão semi-robustos.</p>

  <h2><span class="num">6.</span>Dados e amostra</h2>
  <table>
    <tr><th>Recorte</th><th>Observações</th><th>Período</th><th>Cobertura</th></tr>
    <tr><td><b>Notas de risco</b></td><td>236</td><td>1987 a 1998</td><td>17 países em desenvolvimento, 39 eleições presidenciais</td></tr>
    <tr><td><b>Spreads</b></td><td>1.694</td><td>1994 a 1999</td><td>11 países em desenvolvimento, 14 eleições presidenciais</td></tr>
  </table>
  <p>Os países que aparecem na tabela de histórico de rating e eleições são: <b>Argentina, Bolívia, Brasil, Bulgária, Chile, Colômbia, Equador, Indonésia, México, Paraguai, Peru, Filipinas, Polônia, Rússia, África do Sul, Coreia do Sul, Tunísia, Uruguai e Venezuela</b>.</p>
  <div class="card">
    <p><b>O Brasil está na amostra</b>, com as eleições presidenciais de <b>1989, 1994 e 1998</b> marcadas na tabela 2 do paper.</p>
  </div>
  <p>Só entram países com sistema presidencial, porque nesses a data da eleição tende a ser fixa; em sistema parlamentar o Executivo escolhe a data, o que criaria endogeneidade. E só entram eleições genuinamente competitivas: todas as da amostra pontuam <b>6 ou 7</b> na escala de competitividade do Banco Mundial, que vai de 1 a 7. Por esse critério, os anos eleitorais da <b>Indonésia e da Tunísia foram excluídos</b> da amostra final.</p>
  <p>Fontes: World Development Indicators e Database of Political Institutions do Banco Mundial, e Bloomberg para notas e rendimentos de títulos.</p>
  <h3>A escala de nota, e por que um degrau importa tanto</h3>
  <p>A escala de 0 a 16 vai de C, no nível 0, a AAA, no nível 16. <b>O ponto de corte fica em 7, que é BBB-</b>: abaixo dele a nota deixa de ser grau de investimento e vira grau especulativo, o chamado <i>junk</i>, o que encarece o rendimento exigido e pode impedir a colocação do título junto a investidores institucionais americanos.</p>
  <p>A nota média da amostra é <b>5,8</b>, aproximadamente BB+. Ou seja, a amostra vive <b>logo abaixo da linha de corte</b>, e é por isso que um único degrau pode ser decisivo.</p>

  <h2><span class="num">7.</span>Resultados</h2>
  <h3>Notas de risco: apoio forte a H1</h3>
  <p>O coeficiente da variável de eleição é <b>negativo e significativo em todas as especificações</b>:</p>
  <table>
    <tr><th>Especificação</th><th>Coeficiente de ELECT</th><th>Significância</th></tr>
    <tr><td>Probit ordenado, controles macro</td><td>−0,817</td><td>p &lt; 0,001</td></tr>
    <tr><td>Com variável dependente defasada</td><td>−1,20</td><td>p &lt; 0,001</td></tr>
    <tr><td>GMM de Arellano e Bond, subamostra Moody's</td><td>−1,49</td><td>p &lt; 0,01</td></tr>
  </table>
  <p>Avaliando as variáveis explicativas nas respectivas médias, a ocorrência de uma eleição reduz a nota prevista em <b>aproximadamente um degrau</b>. Os autores destacam que a inclusão da variável de eleição <b>quase não altera</b> os coeficientes dos controles macroeconômicos, o que indica que o efeito da eleição <b>não é apenas um reflexo</b> de mudanças macroeconômicas motivadas pela própria eleição.</p>

  <h3>Spreads: apoio moderado a H2, e uma surpresa</h3>
  <p>O spread relativo médio da amostra é <b>0,4189</b>. Na prática: se o Tesouro americano de dado prazo rende 500 pontos-base num dia dentro da janela eleitoral, o título soberano comparável rende cerca de <b>710 pontos-base</b> naquele dia.</p>
  <p>A inclinação pós-eleitoral é mais positiva que a pré-eleitoral em <b>0,0036</b>, com <b>p &lt; 0,10</b>, o que implica uma diferença de <b>21,6 pontos percentuais</b> nos spreads 60 dias depois da eleição em relação à tendência anterior.</p>
  <div class="hit">
    <p><b>A surpresa, e os próprios autores a declaram.</b> Eles esperavam que a tendência pré-eleitoral também fosse positiva, por antecipação do ciclo ou por reação à incerteza. Encontraram o contrário: a tendência pré-eleitoral é <b>negativa e significativa</b>, e a pós-eleitoral fica praticamente <b>plana</b>, com ponto estimado de 0,0011 que não difere de zero (p &lt; 0,57). Em números: às vésperas da eleição os spreads estão cerca de <b>15 pontos percentuais mais baixos</b> do que 60 dias antes.</p>
    <p>A explicação que eles oferecem, com todas as ressalvas: se o governante afrouxa a política monetária antes do pleito para ganhar apoio, os credores parecem <b>"ir junto"</b>, aceitando spreads menores justo antes da eleição. E acrescentam que a resolução da incerteza política depois do pleito <b>não</b> vem acompanhada de estreitamento continuado, o que é <b>inconsistente</b> com a hipótese de incerteza que Pantzalis e coautores (2000) usam para explicar preços de ações antes e depois de eleições.</p>
  </div>
  <p>Sobre robustez, os autores refizeram a análise com <b>20 janelas diferentes</b>, de 50 e 50 dias até 70 e 70. Os sinais se mantiveram em todas. A significância variou de p &lt; 0,37 a p &lt; 0,07, com <b>7 dos 20 coeficientes</b> abaixo de p &lt; 0,10 e <b>p médio de 0,16</b>. Eles próprios dizem que o achado dos spreads é <b>sensível ao comprimento da janela</b>.</p>

  <h3>Quanto isso custa, em dinheiro</h3>
  <p>O exemplo que os autores dão é a Venezuela. Em janeiro de 1998 a dívida soberana consolidada do país era de cerca de <b>30 bilhões de dólares</b>. O Tesouro americano rendia 233 pontos-base e o spread relativo venezuelano era 0,698, um prêmio de cerca de 70%. Uma diferença de apenas <b>163 pontos-base</b> implicava aproximadamente <b>489 milhões de dólares por ano</b> em custo adicional. Em nota de rodapé, registram que após os rebaixamentos de julho e agosto de 1998 os spreads venezuelanos chegaram a 7,08, o que implicaria cerca de <b>2,02 bilhões de dólares</b> de despesa adicional.</p>

  <h2><span class="num">8.</span>Conclusão dos autores</h2>
  <p>Apoio <b>firme</b> a H1: a nota cai cerca de um degrau em ano eleitoral, e o resultado é robusto a ano, país, agência, variável defasada, mudanças de amostra, de especificação e de estimador. As agências <b>percebem eleições em países em desenvolvimento como eventos arriscados</b> e reagem rebaixando, ou deixando de elevar países que de outro modo seriam menos arriscados.</p>
  <p>Apoio a H2 com a ressalva já dita: a mudança existe, mas é de tendência <b>negativa para plana</b>, e não de plana para positiva como esperavam.</p>
  <blockquote>
    <p>"No longo prazo a democracia é, sem dúvida, um bem em si mesma, mas seu benefício de longo prazo pode ser compensado pela percepção, de curto a médio prazo, de que eleições competitivas induzem má conduta econômica custosa por parte dos governantes. Na medida em que essa percepção aumenta o custo e reduz a oferta de capital para países em desenvolvimento, ela se soma ao preço da democracia, <em>ainda que esse custo continue valendo a pena</em>."</p>
  </blockquote>
  <p>Os autores encerram apontando caminhos de pesquisa: efeitos de contágio para países vizinhos em ano eleitoral, e "ciclos políticos bancários", a partir do trabalho de Uhlmann (2002) sobre corte de crédito bancário antes de eleições.</p>

  <h2><span class="num">9.</span>Ressalvas que os próprios autores declaram</h2>
  <div class="card">
    <p><b>1.</b> O achado dos spreads tem significância mais fraca (p &lt; 0,10) e é <b>sensível ao comprimento da janela</b> escolhida.</p>
    <p><b>2.</b> A tendência pré-eleitoral saiu <b>ao contrário</b> do esperado, e a explicação oferecida é interpretativa, não testada.</p>
    <p><b>3.</b> Resultados anômalos no nível e no crescimento da renda podem ser artefato dos anos de crise financeira de 1994, 1997 e 1998.</p>
    <p><b>4.</b> A amostra de spreads é pequena: <b>14 eleições</b> em 11 países, entre 1994 e 1999.</p>
    <p><b>5.</b> O estimador GMM exige uma agência por país-ano, então essa verificação roda só com Moody's.</p>
  </div>

  <h2><span class="num">10.</span>Leitura do AFOS <span style="font-size:9.4pt;font-weight:600;color:var(--muted);">(esta seção NÃO é dos autores)</span></h2>
  <p>O que segue é leitura nossa sobre o encaixe entre o paper e o AFOS. Nada aqui é afirmação dos autores nem de David Grigorian.</p>
  <h3>O que o paper sustenta</h3>
  <p>A ponte que Grigorian validou em 16 de julho, de eleição para risco soberano, <b>tem base empírica publicada e revisada por pares</b>. Não é intuição. E a janela do efeito de spread são os <b>60 dias antes do pleito</b>, que é exatamente onde o AFOS opera, diariamente, com preço de mercado.</p>
  <h3>A lacuna que o AFOS ocupa</h3>
  <p>O paper mede a eleição como <b>evento de calendário</b>: uma variável que vale 1 no ano eleitoral. Não tinha como ser diferente, é de 2001, antes de mercado de previsão existir em escala. <b>A variável contínua e diária que falta ao desenho deles é a que o AFOS produz.</b></p>
  <h3>O que o paper NÃO faz, e é preciso dizer</h3>
  <p>Ele <b>não</b> trata de fraude eleitoral, de qualidade da eleição nem de divergência entre mercado e pesquisa. Sustenta o elo que já estava aceito, não o que foi questionado. E há uma literatura vizinha considerável, os trabalhos sobre "vantagem democrática" em notas soberanas, o que significa que o terreno é mais povoado do que uma leitura apressada sugeriria.</p>
  <h3>A armadilha de citação</h3>
  <p>Quem lê só o resumo conclui "eleição aumenta spread". <b>O paper mostra o contrário no período pré-eleitoral</b>: os spreads <b>caem</b> antes do pleito e ficam planos depois. Citar o paper como se ele dissesse que o mercado cobra prêmio crescente às vésperas da eleição seria <b>errar o achado</b>. O que sobe de forma robusta é a <b>nota de rating</b> piorando no ano eleitoral, não o spread na véspera.</p>

  <div class="footer">
    <p><b>Original:</b> www.hks.harvard.edu/sites/default/files/centers/cid/files/publications/faculty-working-papers/082.pdf</p>
    <p><b>Versão publicada:</b> Journal of International Money and Finance, 2004, 23(6), 917-946.</p>
    <p>Tradução e síntese em português preparadas para leitura interna do AFOS Analytics. Em qualquer divergência, o original em inglês prevalece.</p>
  </div>

</div>
`

const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<title>O Preço da Democracia (PT) · AFOS Analytics</title>
${ESTILO}
</head>
<body>
${BODY}
</body>
</html>
`

writeFileSync(SAIDA_HTML, html, 'utf-8')
console.log('✅ HTML:', SAIDA_HTML)

const { chromium } = await import('playwright')
const browser = await chromium.launch()
const page = await browser.newPage()
await page.goto('file:///' + SAIDA_HTML.replace(/\\/g, '/'), { waitUntil: 'networkidle' })
await page.emulateMedia({ media: 'screen' })   // preserva cor; por isso page-break fica fora de @media print
await page.pdf({
  path: SAIDA_PDF,
  format: 'A4',
  printBackground: true,
  margin: { top: '16mm', bottom: '16mm', left: '15mm', right: '15mm' },
})
await browser.close()
console.log('✅ PDF :', SAIDA_PDF)
