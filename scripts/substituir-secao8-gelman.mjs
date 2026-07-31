#!/usr/bin/env node
/**
 * Substitui a seção 8 do Gelman-Rothschild-AFOS.md pelo arco completo do
 * engajamento com David Grigorian (reconhecimento 16/Jul, crítica 28/Jul,
 * retorno espontâneo 30/Jul com o paper).
 *
 * ESCRITA ATÔMICA com backup: nada é gravado antes de as asserções passarem,
 * e o original vira .bak datado antes da troca.
 */
import { readFileSync, writeFileSync, copyFileSync } from 'node:fs'

const MD = 'C:/Users/afos3/OneDrive/Documentos/MeusProjetos/AFOS-notas/Gelman-Rothschild-AFOS.md'
const BAK = 'C:/Users/afos3/OneDrive/Documentos/MeusProjetos/AFOS-notas/Gelman-Rothschild-AFOS.md.bak-31jul'

const NOVA = `# 8. A frente do risco soberano: do reconhecimento à crítica, e o que sobreviveu a ela (David Grigorian, julho de 2026)

Esta seção mudou de natureza entre a primeira e a segunda redação desta nota, e a mudança é o próprio conteúdo. O que começou como mais um reconhecimento virou a avaliação técnica mais dura que a plataforma AFOS já recebeu, seguida do retorno espontâneo de quem a formulou. É, das quatro frentes descritas aqui, a menos confortável e provavelmente a mais valiosa.

**Quem é David Grigorian.** Senior Fellow no Mossavar-Rahmani Center for Business and Government da Harvard Kennedy School, Non-Resident Fellow no Center for Global Development, em Bethesda, Maryland. Ex-IMF Mission Chief, tendo liderado a missão do Fundo Monetário Internacional ao Butão e feito o oversight do setor financeiro de Singapura e Malásia, ex-Banco Mundial em reestruturação bancária na Ásia Central, e PhD em Economia pela University of Maryland. Seu campo é o coração do risco soberano: reestruturação de dívida, estabilidade financeira, bancos e mercados de capitais, tendo recebido do Diretor-Gerente do FMI um prêmio pela reestruturação da dívida da Jamaica.

**O reconhecimento, em 16 de julho.** A mensagem de apresentação foi enviada naquele dia e ele respondeu poucas horas depois. Escreveu que vem tentando lançar luz sobre a situação na Armênia, incluindo a fraude eleitoral e o impacto dela sobre o clima de investimento e, por extensão, sobre o risco soberano, mas que não estava avançando. E concluiu, textualmente, que a plataforma AFOS está absolutamente certa em conectar essas coisas: *"you are absolutely right to connect those things"*. Ofereceu-se para revisar qualquer rascunho sobre o tema. É validação técnica, vinda de um especialista em dívida soberana, e é pessoal, porque a Armênia é o país de origem dele.

**A crítica, em 28 de julho.** Onze dias depois, respondendo a um documento de método que a plataforma AFOS lhe enviou, ele voltou com um parecer longo, generoso no tom e severo no conteúdo. Três pontos.

O primeiro é o mais duro e está correto. **A divergência tem muitos pais.** Quando o dinheiro real se afasta da pesquisa, fraude é uma explicação entre uma dúzia: erro de pesquisa, efeito de casa, eleitor envergonhado, modelo de comparecimento que erra, liquidez fina, ou simplesmente uma população de apostadores com premissas diferentes das do eleitorado. E há um limite lógico, não amostral: **numa eleição genuinamente roubada, um mercado convergindo para o resultado oficial é exatamente o que se observaria se os apostadores tivessem precificado o roubo, indistinguível no dado de um mercado que apenas acertou.** Mais casos não resolvem isso.

O segundo muda a estratégia. **A ausência de mercados líquidos em lugares como a Armênia não é lacuna de cobertura, é seleção.** Esses mercados existem onde a instituição é forte e a eleição é limpa. Logo os casos validados da plataforma AFOS vêm de quase a população oposta àquela em que a cadeia eleitoral para soberano de fato morde. Nas palavras dele, a Armênia não é o caso extremo desta pergunta de pesquisa, é o caso modal.

O terceiro é uma proposta, e é onde ele diz que o projeto fica muito mais forte. **Inverter a seta.** Em vez de usar divergência para inferir fraude, usar fraude medida de forma independente para prever risco soberano. A literatura forense já oferece a medição, com testes de segundo e último dígito e detecção de anomalias entre comparecimento e votação na tradição de Klimek e Mebane. Ele mesmo aplicou essas ferramentas às eleições armênias entre 2008 e 2015, no Policy Forum Armenia, e ofereceu os índices resultantes. Do lado esquerdo da equação entrariam spreads, CDS, ações de rating, investimento direto ou desvios de metas de programa do FMI. E acrescentou um mecanismo próprio, que é a melhor ideia da mensagem: **um governo que falsifica contagem de votos revelou que falsifica número quando a aposta é alta**, e por isso conta fiscal, passivo contingente e reserva merecem desconto pela mesma lógica, tendo as estatísticas de déficit da Grécia como precedente caro.

**O que caiu e o que ficou de pé.** A distinção importa e não pode se perder. Ele não retirou o endosso de 16 de julho: a cadeia risco eleitoral para risco soberano continua de pé para ele, tanto que o terceiro ponto é uma proposta de como prová-la direito. O que ele refutou foi o **instrumento**: a divergência entre mercado e pesquisa não sustenta, sozinha, a interpretação de fraude. E esvaziou o valor probatório do exercício de validação: mostrar que divergências se resolveram na direção do resultado real demonstra que mercados preveem bem, o que já se sabia.

**O produto diário não foi atingido, e isso não é detalhe.** O painel, a síntese diária e o Tradeoff reportam a divergência sem atribuir causa, que é precisamente a disciplina que a crítica exige. O que foi atingido em cheio foi o índice de risco eleitoral em desenho de indicador, e essa foi a segunda reprovação independente que ele recebeu, depois da que veio pelo lado do caso indiano. Duas críticas, de ângulos distintos, batendo no mesmo ponto. A conclusão foi manter o projeto suspenso e mudar o desenho, não o cronograma.

**E então ele voltou, duas vezes, sem ser procurado.** Encerrou a própria crítica com uma segunda porta aberta, agora para conversa: *"Happy to talk it through whenever useful."* E em 30 de julho enviou, por iniciativa própria, uma referência: *"I meant to share with you this paper."* Trata-se de **The Price of Democracy: Sovereign Risk Ratings, Bond Spreads and Political Business Cycles in Developing Countries**, de Steven Block e Paul Vaaler, da Fletcher School, publicado no *Journal of International Money and Finance* em 2004 depois de circular como working paper do Center for International Development de Harvard. O estudo mostra que, em países em desenvolvimento, a nota soberana cai cerca de um degrau em ano eleitoral, resultado robusto a diferentes estimadores e especificações. A amostra cobre dezessete países e trinta e nove eleições presidenciais entre 1987 e 1999, **e o Brasil está nela**, com as eleições de 1989, 1994 e 1998.

**O que o paper é, e o que ele não é.** Ele dá base empírica publicada e revisada por pares ao elo que David Grigorian já havia validado, o de eleição para preço soberano. E oferece o molde metodológico exato que ele propôs no terceiro ponto: variável política de um lado, resultado soberano do outro, painel de países, sem mercado de previsão nenhum. O que ele não faz é resgatar o índice de risco eleitoral, porque não trata de fraude, de qualidade da eleição nem de divergência entre mercado e pesquisa. Enviar bibliografia não foi recuo da crítica; foi equipá-la.

**Por que esta é, provavelmente, a relação mais sólida das quatro.** As outras três frentes descritas nesta nota chegaram por reconhecimento. Esta passou por reconhecimento, crítica severa e retorno espontâneo, e sobreviveu às três etapas. Um economista de dívida soberana com passagem pelo FMI e pelo Banco Mundial que lê o material a fundo, aponta um erro de identificação que ninguém havia apontado, oferece um desenho alternativo, disponibiliza os próprios índices, propõe conversa e ainda manda a leitura de referência, está tratando a plataforma AFOS como interlocutor que vale o tempo dele. **Elogio é barato e abundante nesta nota. Parecer técnico desta qualidade, seguido de insistência voluntária, não é.**

`

const original = readFileSync(MD, 'utf-8')
const erros = []

const i8 = original.indexOf('# 8. ')
const i9 = original.indexOf('# 9. ')
if (i8 < 0) erros.push('não achei o início da seção 8')
if (i9 < 0) erros.push('não achei o início da seção 9')
if (i9 > 0 && i8 > 0 && i9 <= i8) erros.push('seção 9 vem antes da 8, ordem inesperada')

// a seção que sai tem de ser a do Grigorian, senão estou cortando a errada
const saindo = i8 >= 0 && i9 > i8 ? original.slice(i8, i9) : ''
if (!/Grigorian/.test(saindo)) erros.push('a seção 8 atual não menciona Grigorian, abortando por segurança')

if (erros.length) {
  console.error('❌ ABORTADO, nada foi escrito:')
  erros.forEach(e => console.error('   • ' + e))
  process.exit(1)
}

const novo = original.slice(0, i8) + NOVA + original.slice(i9)

// asserções sobre o RESULTADO
const checks = [
  ['seção 9 preservada', novo.includes('# 9. O aprofundamento da frente da indústria')],
  ['seção 7 preservada', novo.includes('# 7. A frente cívico-institucional')],
  ['bloco de fontes preservado', novo.includes('# Fontes')],
  ['crítica presente', novo.includes('indistinguível no dado')],
  ['paper presente', novo.includes('The Price of Democracy')],
  ['Brasil na amostra', novo.includes('e o Brasil está nela')],
  ['sem travessão', !novo.includes('—')],
]
const falhou = checks.filter(c => !c[1])
if (falhou.length) {
  console.error('❌ ABORTADO nas asserções:')
  falhou.forEach(c => console.error('   • ' + c[0]))
  process.exit(1)
}

copyFileSync(MD, BAK)
writeFileSync(MD, novo, 'utf-8')
console.log('✅ backup :', BAK)
console.log('✅ .md     : seção 8 substituída')
console.log('   antes:', original.length, 'chars | depois:', novo.length, 'chars')
