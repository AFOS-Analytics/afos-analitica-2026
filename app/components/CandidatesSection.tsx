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
    polymarket: "60.50%",
    poll: "Lula ESTÁVEL pelo 3º dia: Poly 60.50% (0,00pp, vol USD 7,61M acumulado), a 72 dias do 1º turno. Segundo dia seguido sem nacional nova, e a Datafolha registrada para hoje (BR-01166/2026, n=2.004, campo 22 a 24/Jul) NÃO foi divulgada até a captura. A urna segue sendo a Gerp 22/Jul (outlier pró-Flávio), que o dá empatado no 1º turno (38x38) e perdendo o returno direto por 45x46, mas vencendo Caiado (44x41), Zema (44x38) e Renan (45x35). O consenso Tier 1 forte segue sendo a Quaest 15/Jul (+12pp no 1T). O gap sobre Flávio recuou 0,20pp, para +37,45pp.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTOS 24/Jul: a federação União Progressista (PP e União Brasil) definiu neutralidade na disputa presidencial, resultado de articulação direta do governo para afastar o centrão de Flávio (G1, Folha de S.Paulo). O sinal apareceu no mercado, mas do lado errado do tabuleiro: quem caiu foi o PL no book do Senado por cadeiras, 11,50pp, e não a probabilidade presidencial do adversário. Lula segue parado em 60,50% pelo terceiro pregão, sem participar de nenhum dos movimentos do book. O teste de urna do dia não veio: a Datafolha ficou registrada e não divulgada, então o painel entra no fim de semana com a leitura de uma casa outlier como referência. STF impeach 3.50% (alta 0,55pp). Volume no presidencial em USD 115,46M."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "23.05%",
    poll: "Flávio RECUPERA parte do tombo: Poly 23.05% (alta 0,20pp, vol USD 7,63M acumulado), primeira alta em três dias, e no 2º lugar do 1º turno subiu 4,50pp, de 70,50% para 75,00%, devolvendo por inteiro o recuo de ontem. Renan, que disputa esse mesmo mercado, caiu de 17,40% para 7,15%. Segundo dia sem urna nova, com a Datafolha registrada para hoje sem divulgação: a Gerp 22/Jul, casa outlier pró-Flávio, segue sendo a leitura mais favorável a ele do recorte (empate no 1T 38x38, à frente no 2T direto 46x45). As duas de 21/Jul o mantêm em 30-33% no 1º turno. Rejeição alta: Gerp 46%, Indexa e Real Time 50%.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 24/Jul: dia de recomposição no mercado e de perda na base parlamentar. Ele fechou acordo com Michelle Bolsonaro, pediu desculpas e recebeu promessa de apoio, com vídeo de reconciliação a caminho segundo Valdemar (Folha de S.Paulo), e Javier Milei chegou ao Brasil para apoiar a candidatura dele (Folha). Michelle subiu 0,30pp e Jair 0,15pp na mesma data. Do outro lado, a federação União Progressista declarou neutralidade na presidencial após articulação do governo Lula, e a escolha da vice segue travada pela falta de apoio do centrão (G1, UOL). O PL caiu 11,50pp no book do Senado por cadeiras, para 60,50%, num mercado de apenas USD 291 mil de volume. O inquérito autorizado ontem ganhou escopo de corrupção e lavagem, mirando ele, Eduardo e Vorcaro (Folha), e ele chamou o diretor-geral da PF de pau-mandado de Lula (Gazeta do Povo). Convenção do PL amanhã, 25/Jul, ainda sem vice."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "11.95%",
    poll: "Renan REALOCADO pelo mercado: Poly 11.95% no vencedor (alta 0,10pp, vol USD 8,43M acumulado), 6º dia seguido de alta, mas o dado do dia é o sub-mercado: DESABOU 10,25pp no 2º lugar do 1º turno, de 17,40% para 7,15%, e manteve 67,00% no 3º lugar. O mercado parou de tratá-lo como possível substituto de Flávio no returno e voltou a tratá-lo como terceiro colocado. Aos 11,95% o preço segue acima dos 9% da Real Time 21/Jul, a leitura de urna mais alta do ciclo, com Gerp e Indexa medindo 3%. Tem o maior volume acumulado entre os nomes competitivos do book, acima de Lula e de Flávio.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "24/Jul: o teste que decidiria o caso não veio. A Datafolha estava registrada no TSE para hoje (BR-01166/2026, campo 22 a 24/Jul) e não foi divulgada até a captura, então a distorção entre preço e urna atravessa o fim de semana sem arbitragem. O rearranjo do dia foi interno ao mercado: ele perdeu 10,25pp no 2º lugar do 1º turno enquanto Flávio recuperava 4,50pp ali, sem que o preço principal se mexesse quase nada. RESSALVA DE SÉRIE, medida no ciclo inteiro: 11,95% não é o máximo. Renan valeu 17,9% em 09/Jun e 12,8% em 01/Jul, e caiu ao piso de 7,8% em 17/Jul. No 2º turno direto a Gerp o dá perdendo de Lula por 35x45. STF impeach 3.50%."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0.35%",
    poll: "Haddad ESTÁVEL: Poly 0.35% (0,00pp, vol USD 6,33M acumulado), nome residual sem lastro de urna e o único do pelotão que não subiu no dia. Não aparece nos cenários presidenciais das nacionais (foco no governo de SP). Na Datafolha SP 05/Jul, Tarcísio lidera com 46% x Haddad 30%, com Haddad na rejeição mais alta do estado (47%). Mantém Márcio França (PSB) como vice. A ausência de movimento num dia em que todo o resto do pelotão andou é a assinatura de um nome que o mercado não trata como candidatura presidencial.",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "24/Jul: Haddad ficou parado em 0.35% enquanto Zema mais que dobrou, Caiado subiu e Michelle voltou acima de 1%. O preço dele é resíduo de nome conhecido: nenhuma nacional o testa nesse cargo. O foco é estadual, e a Datafolha divulgou hoje novas rodadas de São Paulo, para governador e para o Senado, fora do escopo deste painel nacional. Na rodada anterior, de 05/Jul, o instituto deu Tarcísio 46% x Haddad 30% no governo, com Haddad na rejeição mais alta do estado (47%). STF impeach 3.50%."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "2.10%",
    poll: "Caiado sustenta o patamar: Poly 2.10% (alta 0,05pp, vol USD 5,11M acumulado), segundo dia no nível mais alto dele no ciclo recente, e segue em 16,50% no 3º lugar do 1º turno. Segundo dia sem pesquisa nova, então o movimento é do mercado e não da urna. A referência segue sendo Gerp 3% (22/Jul), Indexa 6% e Real Time 7% (21/Jul), com a Gerp dando Lula à frente no 2º turno direto (44x41), não o empate (44x43) da Real Time. Chapa pura do PSD (Kassab vice).",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "24/Jul: Caiado partiu para cima do adversário do próprio campo, dizendo que voto em Flávio ajuda a reeleger Lula (Blog do Esmael) e acusando Lula e Flávio de explorarem a crise tarifária com os EUA (iG). No mercado subiu 0,05pp, para 2.10%, num dia em que o pelotão inteiro andou para cima e Zema mais que dobrou. O cenário de 2º turno competitivo contra Lula segue sem confirmação de segunda fonte. O contraste com o preço persiste: mede 3-7% de voto declarado e vale 2,10% no vencedor. STF impeach 3.50%."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0.95%",
    poll: "Zema MAIS QUE DOBRA: Poly 0.95% (alta 0,50pp, vol USD 4,52M), a maior variação relativa do book presidencial no dia, exatamente depois de ter ficado de fora da rotação de ontem. Não houve pesquisa nova para justificar, então é movimento de mercado e não de voto declarado. A Gerp 22/Jul o deu com 3% no 1º turno e perdendo o returno para Lula (38x44), mesmo patamar da Indexa 21/Jul (3%). Também marcou 3,7% na Futura/Apex 14/Jul e 4% na BTG/Nexus 13/Jul. A chapa entra nas convenções ainda sem vice definido.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "24/Jul: Zema saltou de 0,45% para 0.95%, mais que dobrando de preço no dia em que o pelotão inteiro andou para cima, e sem nenhuma urna nova por trás. Segue medindo 3% nas duas nacionais recentes, então o descolamento entre preço e voto declarado aqui é de direção oposta à de Renan: ele vale pouco e mede pouco, só que agora vale o dobro do que valia ontem. Chega às convenções ainda sem vice, depois de Michelle Bolsonaro ter descartado publicamente a hipótese. Defende privatização de Petrobras e Banco do Brasil em eventual governo (Jornal do Brasil). STF impeach 3.50%."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.15%",
    poll: "Tarcísio estável a Poly 0.15% no presidencial (anomalia de legado, vol USD 13,56M acumulado, o maior volume individual do book presidencial). Não aparece nos cenários presidenciais das nacionais. O foco é a reeleição em SP, onde a Datafolha 05/Jul o dá liderando com 46% x Haddad 30% e aprovação de 45%, e o instituto divulgou hoje novas rodadas paulistas para governador e Senado. No Senado por cadeiras houve o maior deslocamento percentual do dia: o PL caiu de 72.00% para 60.50% e o MDB caiu para 15,65%.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "24/Jul: Tarcísio segue focado na reeleição em SP, e o mercado mantém o presidencial dele em 0.15% (anomalia de legado, o maior volume individual do book a USD 13,56M), lembrete de que volume acumulado mede história negociada, não convicção atual. O movimento do dia foi no Senado por cadeiras: o PL caiu 11,50pp, para 60.50%, e o MDB caiu 5,25pp, para 15,65%, na data em que a federação União Progressista definiu neutralidade na presidencial (G1, Folha de S.Paulo). Ressalva de base, e ela é decisiva: o book inteiro do Senado soma USD 291 mil de volume acumulado contra USD 115,46M do presidencial, então movimento grande em percentual não significa dinheiro grande. As convenções correm até 05/Ago. STF impeach 3.50%."
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
