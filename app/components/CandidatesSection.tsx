'use client';

import type { CandidateProfile } from '../types';
import { partyColor } from '../lib/utils';
import { SectionTitle, Card } from './ui';
import { LogicLink } from './LogicLink';
import { useTranslation } from '../i18n/context';

// Os campos `polymarket`, `poll` e `risk` são atualizados pela skill /atualizar
// (a cada execução, o markdown dos JSONs e este arquivo são reescritos com
// dados frescos).
const candidates: CandidateProfile[] = [
  {
    name: "Lula",
    party: "PT",
    age: 80,
    role: "Presidente da República",
    polymarket: "62,50%",
    poll: "Lula PARADO pelo segundo pregão: Poly 62,50% (estável, vol USD 7,68M acumulado), a 69 dias do 1º turno, com o gap sobre Flávio em +38,65pp. URNA NOVA: a BTG/Nexus de 27/Jul (n=2.004, telefônica, campo 24 a 26/Jul, margem 2pp, BR-01489/2026) é a primeira nacional com campo inteiramente posterior à convenção do PL e o dá com 42% no 1º turno contra 33% de Flávio, dois pontos acima da rodada de 13/Jul do mesmo instituto. Vence os quatro cenários de returno testados: 47x43 contra Flávio, 45x43 contra Caiado, 46x42 contra Zema e 47x39 contra Renan, sendo dois deles dentro da margem. Aprovação pessoal 47% x 49% de desaprovação, contra 49% x 48% na Datafolha de 24/Jul, ou seja, dois empates técnicos com as pontas em ordem trocada. Gestão 36% ótimo ou bom contra 43% ruim ou péssimo.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "CORREÇÃO DE SÉRIE, feita hoje ao varrer a base inteira: 62,50% NÃO é o topo do preço dele, como o painel afirmou ontem. O topo é 63,50%, marcado na madrugada de 26/Jul, depois da captura publicada, e o maior gap da série é +39,80pp, da mesma madrugada, não os +39,65pp registrados ontem. A correção é feita com o mesmo destaque da afirmação original. EVENTOS 27/Jul: a imprensa argentina informou que Milei não vai pedir desculpas ao Brasil e a China declarou apoio ao Brasil contra interferência externa (Folha de S.Paulo). A Datafolha divulgou recorte da rodada de 22 e 23/Jul em que 52% acreditam que o tarifaço de Trump busca favorecer a candidatura de Flávio, contra 37% que discordam. Nada disso teve contrapartida de preço. STF impeach 3,40%, sem variação. Volume no presidencial em USD 116,12M."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "23,85%",
    poll: "Flávio com SINAIS CRUZADOS: Poly 23,85% no vencedor (alta 0,20pp, vol USD 7,68M acumulado), mas queda de 1,50pp no 2º lugar do 1º turno, para 76,50%, e alta de 0,75pp no 3º lugar, para 7,75%. Três books do mesmo nome andando em três direções no mesmo pregão não sustentam narrativa única. URNA NOVA e ela não trouxe efeito de lançamento: a BTG/Nexus de 27/Jul, primeira nacional com campo inteiramente posterior à convenção do PL, o mede em 33% no 1º turno, um ponto ABAIXO dos 34% da rodada de 13/Jul do mesmo instituto, com a diferença dentro da margem. No returno direto, 43% contra 47% de Lula. Rejeição de 50%, a mais alta do levantamento, acima dos 48% de Lula.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 27/Jul: a Folha de S.Paulo publicou que gestores, economistas e executivos ouvidos sob anonimato torcem pela desistência dele em favor da chapa Caiado e Kassab, citando entre as razões o fato de ele ter mentido sobre a proximidade com o banqueiro Daniel Vorcaro, do Banco Master, a quem pediu dinheiro. O senador Rogério Marinho, coordenador da pré-campanha, respondeu publicamente à reportagem. É matéria com fontes anônimas, não apuração de autoridade, e entra como contexto e não como fato processual. O painel NÃO atribui o movimento de preço a ela, porque no mesmo pregão saiu pesquisa nacional nova e um terceiro candidato foi oficializado. Segue sem vice definida depois da recusa de Tereza Cristina, com as convenções correndo até 05/Ago. STF impeach 3,40%."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "9,55%",
    poll: "Renan PARA no vencedor depois de dois pregões de queda: Poly 9,55% (estável, vol USD 8,56M acumulado). O movimento foi todo nos sub-mercados e em direções opostas: perdeu 2,50pp no 3º lugar do 1º turno, indo a 62,00%, e ganhou 0,80pp no 2º lugar, indo a 12,65%. O mercado tirou dele a posição de terceiro provável, que foi para Caiado, e devolveu uma fração da hipótese de returno. URNA NOVA e ela REABRE a dispersão: a BTG/Nexus de 27/Jul o mede em 5% no 1º turno, quebrando a convergência em 3% que Datafolha 24/Jul, Gerp 22/Jul e Indexa 21/Jul tinham formado. O painel volta a ter três patamares: 3% em três institutos, 5% na Nexus e 9% na Real Time de 21/Jul. No returno, perde para Lula por 47% a 39%.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "27/Jul: a distorção que o painel acompanha continua existindo e ficou com numerador menos claro, porque a própria urna passou a discordar de si mesma. A dispersão entre institutos, que parecia resolvida na sexta com três leituras em 3%, voltou a abrir com os 5% da Nexus. RESSALVA DE SÉRIE, medida na base inteira: 9,55% não é máximo nem mínimo dele. O pico foi 17,90% em 09/Jun e o piso é 5,30% em 26/Abr. A comparação entre 9,55% e o voto declarado segue sendo entre grandezas diferentes, probabilidade de vitória contra intenção de voto, o que pede cautela em qualquer leitura de erro. Mantém o maior volume acumulado entre os nomes competitivos do book, USD 8,56M. STF impeach 3,40%."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0,25%",
    poll: "Haddad cai pelo segundo pregão: Poly 0,25% (queda 0,10pp, vol USD 6,38M acumulado). Segue sendo nome residual sem lastro de urna no cargo presidencial: não aparece nos cenários presidenciais das nacionais, incluindo a BTG/Nexus de 27/Jul e a Datafolha de 24/Jul, e nenhuma pesquisa o testa para presidente. O foco é a disputa estadual de São Paulo, cuja chapa foi oficializada em convenção do PT em Campinas em 25/Jul, com Márcio França (PSB) de vice e presença de Lula. Disputa estadual não entra neste painel, que é de escopo nacional.",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "27/Jul: segundo pregão seguido de queda, saindo do patamar em que estava antes da convenção estadual de 25/Jul. A leitura registrada na época já dizia que aquela alta coincidia com uma convenção ESTADUAL e que o cargo precificado neste book é outro, e a devolução em dois dias seguidos é consistente com isso: era ruído de evento, não reprecificação. STF impeach 3,40%."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1,95%",
    poll: "Caiado tem o ACHADO do dia, e ele vem da urna: a BTG/Nexus de 27/Jul o coloca em EMPATE TÉCNICO com Lula no returno, 45% a 43%, a diferença mais estreita entre os quatro cenários de 2º turno do levantamento, e em 6% no 1º turno, o melhor do pelotão e um ponto acima da rodada de 13/Jul. Isso INVERTE a Datafolha de 24/Jul, publicada três dias antes, que dava Lula 47% x Caiado 40%, sete pontos, e o media em 4% no 1º turno. Duas casas de primeiro escalão, campos separados por dois dias, conclusões opostas sobre qual adversário é o mais competitivo, sem terceira medição para desempatar. No mercado: Poly 1,95% (alta 0,20pp, vol USD 5,15M acumulado) e alta no 3º lugar do 1º turno, de 15,50% para a faixa de 19,00% a 19,50%.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Candidato oficializado pelo PSD.",
    risk: "27/Jul: é o primeiro dia em duas semanas em que urna e preço se movem na MESMA direção no caso dele, e convergência entre as duas fontes é mais informativa do que preço andando sozinho. Some a isso a reportagem da Folha de S.Paulo segundo a qual parte do mercado financeiro, ouvida sob anonimato, prefere a chapa dele à candidatura de Flávio. O painel registra a coincidência dos três fatos no mesmo pregão e NÃO afirma causa, porque três eventos simultâneos não permitem separar o que moveu o quê. RESSALVA DE CAPTURA: o número dele no 3º lugar é publicado como FAIXA, entre 19,00% e 19,50%, porque foi o único book que a trava de dupla leitura não conseguiu confirmar hoje, em duas rodadas. Ressalva de escala: 1,95% segue sendo patamar baixo em absoluto. STF impeach 3,40%."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0,55%",
    poll: "Zema é OFICIALIZADO e o preço cai: Poly 0,55% (queda 0,10pp, vol USD 4,54M) no próprio dia em que o Novo confirmou sua candidatura à Presidência em convenção em Brasília, ainda SEM vice definido e com prazo até 05/Ago (Poder360, Estado de Minas, Gazeta do Povo, Brasil 247). Marca 4,65% no 3º lugar do 1º turno. Na urna nova, a BTG/Nexus de 27/Jul o mede em 3% no 1º turno, um ponto abaixo dos 4% da própria rodada de 13/Jul, e ele foi o único do pelotão a cair na comparação entre as duas rodadas do mesmo instituto. Ao mesmo tempo, perde o returno para Lula por 46% a 42%, exatamente a mesma margem de quatro pontos do cenário com Flávio.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "27/Jul: é o TERCEIRO lançamento seguido do calendário em que o candidato oficializado termina o pregão em queda, depois de Flávio em 25/Jul (queda de 0,10pp) e de Caiado em 26/Jul (queda de 0,15pp). Três ocorrências seguidas já não são coincidência isolada, e mesmo assim a causa NÃO é afirmada em nenhuma das três: são books pequenos, capturas de um instante, e nada garante que a próxima convenção repita. Fica como observação a acompanhar até 05/Ago, não como regra. Segue sem vice anunciado, agora com dois concorrentes do mesmo espaço já formalizados. Michelle Bolsonaro já havia descartado publicamente ser vice dele. STF impeach 3,40%."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0,15%",
    poll: "Tarcísio estável a Poly 0,15% no presidencial (anomalia de legado, com o maior volume individual do book, USD 13,64M). Não aparece nos cenários presidenciais das nacionais, incluindo a BTG/Nexus de 27/Jul e a Datafolha de 24/Jul. Confirmou candidatura à reeleição em São Paulo, disputa estadual que não entra neste painel de escopo nacional. No Senado por cadeiras, o PL ficou em 71,00% e o MDB em 18,25%.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "27/Jul: o mercado mantém o presidencial dele em 0,15%, anomalia de legado que serve de lembrete permanente de método, porque volume acumulado mede história negociada e não convicção atual. RESSALVA DE BASE sobre o Senado, e ela é decisiva: o book inteiro soma USD 292 mil de volume acumulado contra USD 116,12M do presidencial, então movimento em percentual não significa dinheiro grande. Ontem esse mesmo book variou 1,00pp em treze minutos dentro da janela de captura, o que é o próprio argumento para não construir leitura sobre ele. Hoje a instabilidade apareceu em outro lugar: a trava de dupla leitura bloqueou as duas rodadas de captura por divergência nos books de 2º e de 3º lugar, enquanto o presidencial repetiu os mesmos números nas quatro leituras. As convenções correm até 05/Ago. STF impeach 3,40%."
  },
];

export function CandidatesSection() {
  const { t } = useTranslation();
  return (
    <section>
      <SectionTitle icon="👤" rightSlot={<LogicLink anchor="perfil-candidatos" />}>{t('sections.candidates')}</SectionTitle>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {candidates.map(c => (
          <Card key={c.name} className="flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <div>
                <h4 className="font-bold text-dark">{c.name}</h4>
                <span className="text-xs px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: partyColor[c.party] || '#94A3B8' }}>{c.party}</span>
              </div>
            </div>
            <div className="text-xs text-gray-500 mb-2">{c.role} · {c.age} {t('candidates.age')}</div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-blue-50 rounded-lg p-2 text-center">
                <div className="text-xs text-gray-500">Polymarket</div>
                <div className="font-bold text-primary">{c.polymarket}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <div className="text-xs text-gray-500">{t('candidates.poll')}</div>
                <div className="font-bold text-dark">{c.poll}</div>
              </div>
            </div>
            <p className="text-xs text-gray-600 mb-2"><strong>{t('candidates.position')}:</strong> {c.position}</p>
            <p className="text-xs text-red-600"><strong>⚠️ {t('candidates.risk')}:</strong> {c.risk}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
