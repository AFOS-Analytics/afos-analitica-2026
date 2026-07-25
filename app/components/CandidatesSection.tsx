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
    polymarket: "61,50%",
    poll: "Lula ROMPE os 61%: Poly 61,50% (alta 1,00pp, vol USD 7,63M acumulado), a 72 dias do 1º turno, o maior valor dele desde 15/Jul depois de três pregões travado em 60,50%. Segundo dia seguido sem nacional nova, e a Datafolha registrada para hoje (BR-01166/2026, n=2.004, campo 22 a 24/Jul) NÃO foi divulgada até a captura. A urna segue sendo a Gerp 22/Jul (outlier pró-Flávio), que o dá empatado no 1º turno (38x38) e perdendo o returno direto por 45x46, mas vencendo Caiado (44x41), Zema (44x38) e Renan (45x35). O consenso Tier 1 forte segue sendo a Quaest 15/Jul (+12pp no 1T). O gap sobre Flávio subiu para +38,55pp, o maior desde 09/Jul.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTOS 24/Jul: reportagens mostraram que a neutralidade da federação União Progressista (PP e União Brasil), decidida em 22/Jul, saiu de articulação direta do governo para afastar o centrão de Flávio (G1, Folha de S.Paulo, 24/Jul). No mercado, ele rompeu a faixa em que estava travado e subiu 1,00pp, para 61,50%, com o gap sobre Flávio indo a +38,55pp, o maior desde 09/Jul (38,60pp) e ainda abaixo do pico do ciclo de +39,5pp (03/Jul). A diferença em relação a ontem é de natureza: em 23/Jul o gap abriu porque o adversário caiu, hoje abriu porque ele subiu. Não há evento triggador identificado no horário do movimento, então é momentum de mercado e não reação declarada a notícia. O teste de urna do dia não veio: a Datafolha ficou registrada e não divulgada. STF impeach 3,55% (alta 0,60pp). Volume no presidencial em USD 115,55M."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "22,95%",
    poll: "Flávio ESTANCA a queda sem reverter: Poly 22,95% (alta 0,10pp, vol USD 7,64M acumulado) depois de perder 2,10pp em 23/Jul, e o gap sobre ele cresceu mesmo assim porque quem andou foi Lula. A recuperação apareceu num lugar só: voltou a 74,00% no 2º lugar do 1º turno (alta 3,50pp), com Renan caindo de 17,40% para 11,40% ali. Segundo dia sem urna nova, com a Datafolha registrada para hoje sem divulgação: a Gerp 22/Jul, casa outlier pró-Flávio, segue sendo a leitura mais favorável a ele do recorte (empate no 1T 38x38, à frente no 2T direto 46x45). As duas de 21/Jul o mantêm em 30-33% no 1º turno. Rejeição alta: Gerp 46%, Indexa e Real Time 50%.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 24/Jul: dia de sinais opostos, e nenhum deles com contrapartida clara de preço. A favor: a reconciliação com Michelle avançou para um vídeo conjunto, depois do pedido de desculpas dele em vídeo na tarde de 23/Jul e do aceite dela na mesma noite (Gazeta do Povo, Metrópoles), e Javier Milei desembarcou no Brasil em 24/Jul para discursar na convenção do PL de 25/Jul (Folha de S.Paulo, CartaCapital). Ainda assim o preço de Michelle CAIU 0,10pp. Contra: reportagens de 24/Jul mostraram que a neutralidade da federação União Progressista, decidida em 22/Jul, saiu de articulação do governo Lula, e a escolha da vice segue travada pela falta de apoio do centrão (G1, UOL). O PL caiu 3,50pp no book do Senado por cadeiras, para 68,50%, num mercado de apenas USD 292 mil de volume. O inquérito autorizado em 23/Jul ganhou escopo de corrupção e lavagem, mirando ele, Eduardo e Vorcaro (Folha), e ele chamou o diretor-geral da PF de pau-mandado de Lula (Gazeta do Povo). Convenção do PL amanhã, 25/Jul, ainda sem vice."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "11,75%",
    poll: "Renan REALOCADO pelo mercado: Poly 11,75% no vencedor (queda 0,10pp, vol USD 8,45M acumulado), praticamente parado, mas o dado do dia é o sub-mercado: CAIU 6,00pp no 2º lugar do 1º turno, de 17,40% para 11,40%, e manteve 67,00% no 3º lugar. O mercado reduziu a hipótese de ele substituir Flávio no returno e o manteve como terceiro colocado firme. Aos 11,75% o preço segue acima dos 9% da Real Time 21/Jul, a leitura de urna mais alta do ciclo, com Gerp e Indexa medindo 3%. Tem o maior volume acumulado entre os nomes competitivos do book, acima de Lula e de Flávio.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "24/Jul: o teste que decidiria o caso não veio. A Datafolha estava registrada no TSE para hoje (BR-01166/2026, campo 22 a 24/Jul) e não foi divulgada até a captura, então a distorção entre preço e urna atravessa o fim de semana sem arbitragem. O rearranjo do dia foi interno ao mercado: ele perdeu 6,00pp no 2º lugar do 1º turno enquanto Flávio recuperava 3,50pp ali, sem que o preço principal se mexesse quase nada. RESSALVA DE SÉRIE, medida no ciclo inteiro: 11,75% não é o máximo. Renan valeu 17,9% em 09/Jun e 12,8% em 01/Jul, caiu ao piso de 7,8% em 17/Jul e fechou 23/Jul em 12,0%. No 2º turno direto a Gerp o dá perdendo de Lula por 35x45. STF impeach 3,55%."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0,35%",
    poll: "Haddad ESTÁVEL: Poly 0,35% (0,00pp, vol USD 6,33M acumulado), nome residual sem lastro de urna. Não aparece nos cenários presidenciais das nacionais (foco no governo de SP). Na Datafolha SP 05/Jul, Tarcísio lidera com 46% x Haddad 30%, com Haddad na rejeição mais alta do estado (47%). Mantém Márcio França (PSB) como vice. Ficar parado no dia em que Lula subiu 1,00pp mostra que o mercado não trata o preço dele como derivado do desempenho do PT.",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "24/Jul: Haddad ficou parado em 0,35% no dia em que Lula rompeu os 61% e Zema mais que dobrou. O preço dele é resíduo de nome conhecido: nenhuma nacional o testa nesse cargo. O foco é estadual, e a Datafolha divulgou hoje novas rodadas de São Paulo, para governador e para o Senado, fora do escopo deste painel nacional. Na rodada anterior, de 05/Jul, o instituto deu Tarcísio 46% x Haddad 30% no governo, com Haddad na rejeição mais alta do estado (47%). STF impeach 3,55%."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1,75%",
    poll: "Caiado DEVOLVE a alta da véspera: Poly 1,75% (queda 0,30pp, vol USD 5,11M acumulado) e recua também no 3º lugar do 1º turno, para 16,00% (queda 0,50pp). Segundo dia sem pesquisa nova, então o movimento é do mercado e não da urna. A referência segue sendo Gerp 3% (22/Jul), Indexa 6% e Real Time 7% (21/Jul), com a Gerp dando Lula à frente no 2º turno direto (44x41), não o empate (44x43) da Real Time. Chapa pura do PSD (Kassab vice).",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "24/Jul: Caiado partiu para cima do adversário do próprio campo, dizendo que voto em Flávio ajuda a reeleger Lula (Blog do Esmael) e acusando Lula e Flávio de explorarem a crise tarifária com os EUA (iG). No mercado, porém, perdeu 0,30pp e voltou a 1,75%, num dia em que o preço saiu das alternativas e foi para o favorito. O cenário de 2º turno competitivo contra Lula segue sem confirmação de segunda fonte. O contraste com o preço persiste: mede 3-7% de voto declarado e vale 1,75% no vencedor. STF impeach 3,55%."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0,95%",
    poll: "Zema MAIS QUE DOBRA: Poly 0,95% (alta 0,50pp, vol USD 4,52M), a maior variação relativa do book presidencial no dia e o único nome do pelotão a subir, exatamente depois de ter ficado de fora da rotação de ontem. Não houve pesquisa nova para justificar, então é movimento de mercado e não de voto declarado. A Gerp 22/Jul o deu com 3% no 1º turno e perdendo o returno para Lula (38x44), mesmo patamar da Indexa 21/Jul (3%). Também marcou 3,7% na Futura/Apex 14/Jul e 4% na BTG/Nexus 13/Jul. A chapa entra nas convenções ainda sem vice definido.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "24/Jul: Zema saltou de 0,45% para 0,95%, mais que dobrando de preço e sendo o ÚNICO do pelotão a subir num dia em que Caiado e Michelle recuaram, e sem nenhuma urna nova por trás. Segue medindo 3% nas duas nacionais recentes, então o descolamento entre preço e voto declarado aqui é de direção oposta à de Renan: ele vale pouco e mede pouco, só que agora vale o dobro do que valia ontem. Chega às convenções ainda sem vice, depois de Michelle Bolsonaro ter descartado publicamente a hipótese. Defende privatização de Petrobras e Banco do Brasil em eventual governo (Jornal do Brasil). STF impeach 3,55%."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0,15%",
    poll: "Tarcísio estável a Poly 0,15% no presidencial (anomalia de legado, vol USD 13,57M acumulado, o maior volume individual do book presidencial). Não aparece nos cenários presidenciais das nacionais. O foco é a reeleição em SP, onde a Datafolha 05/Jul o dá liderando com 46% x Haddad 30% e aprovação de 45%, e o instituto divulgou hoje novas rodadas paulistas para governador e Senado. No Senado por cadeiras, o PL caiu de 72,00% para 68,50% e o MDB caiu para 15,45%.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "24/Jul: Tarcísio segue focado na reeleição em SP, e o mercado mantém o presidencial dele em 0,15% (anomalia de legado, o maior volume individual do book a USD 13,57M), lembrete de que volume acumulado mede história negociada, não convicção atual. Nos sub-mercados, o Senado por cadeiras acompanhou o dia político do campo de Flávio: o PL caiu 3,50pp, para 68,50%, e o MDB caiu 5,45pp, para 15,45%, na data em que se soube da articulação do governo por trás da neutralidade da federação União Progressista, decidida em 22/Jul (G1, Folha de S.Paulo). Ressalva de base, e ela é decisiva: o book inteiro do Senado soma USD 292 mil de volume acumulado contra USD 115,55M do presidencial, então movimento em percentual não significa dinheiro grande. As convenções correm até 05/Ago. STF impeach 3,55%."
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
