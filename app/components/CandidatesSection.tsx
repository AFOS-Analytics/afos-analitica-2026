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
    poll: "Lula ESTÁVEL no preço: Poly 60.50% (0,00pp, vol USD 7,5M acumulado), a 74 dias do 1º turno, sem reagir à Gerp. A Gerp 22/Jul (outlier pró-Flávio) o dá empatado no 1º turno (38x38) e perdendo o returno direto por 45x46, mas vencendo Caiado (44x41), Zema (44x38) e Renan (45x35). As duas de 21/Jul o davam liderando o 1º turno (40-41%), e o consenso Tier 1 forte segue sendo a Quaest 15/Jul (+12pp no 1T). O gap sobre Flávio abriu para +35,55pp por queda do adversário. Datafolha vem em 24/Jul.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTOS 22/Jul: a Gerp publicou a 3ª nacional da semana, o instituto outlier pró-Flávio, com empate no 1º turno (38x38) e Flávio à frente no 2º (46x45), a leitura mais dura para Lula do recorte e ainda assim mais generosa com Flávio que o Tier 1. O mercado não se moveu: Lula ficou em 60,50% (0,00pp) e o gap abriu para +35,55pp por queda do Flávio, ainda abaixo do pico do ciclo (+39,5pp em 03/Jul). A agenda segue travada no Congresso, com mais de 20 derrotas no 3º mandato (Poder360). STF impeach 2.95% (estável). Volume no presidencial em USD 114,55M. Datafolha (Tier 1) em 24/Jul é o próximo teste."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "24.95%",
    poll: "Flávio RECUA: Poly 24.95% (queda 1,20pp, vol USD 7,5M acumulado), o maior movimento do book presidencial no dia, mesmo com a Gerp favorável a ele. A Gerp 22/Jul o empata com Lula no 1º turno (38x38) e o põe à frente no returno direto (46x45), mas é a casa outlier pró-Flávio (reliability 3), mais generosa com ele que o Tier 1. As duas de 21/Jul o mantêm em 30-33% no 1º turno e perdendo o 2º contra Lula. Segue no 2º lugar do 1º turno do mercado a 78,00%. Rejeição alta: Gerp 46%, Indexa e Real Time 50%.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 22/Jul: a Gerp lhe deu a leitura mais favorável do recorte (empate no 1T, à frente no 2T direto 46x45), e ainda assim o preço CAIU 1,20pp para 24.95%, o maior recuo do book no dia. O mercado não comprou o número da casa outlier pró-Flávio. Também não confirmou o sinal da véspera: a Gerp dá Lula à frente de Caiado no 2º turno (44x41), não o empate da Real Time. As convenções correm até 05/Ago, a dele no sábado 25/Jul ainda SEM vice (Folha), com o PL fechando chapa com Jair preso e Flávio suspenso das visitas ao pai até outubro. STF impeach 2.95%."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "10.70%",
    poll: "Renan, a DISTORÇÃO que ALARGOU: Poly 10.70% (alta 1,85pp, vol USD 8,3M acumulado), o segundo maior preço do book, no MESMO dia em que a Gerp o mede em 3%. A Gerp fecha o caso do lado da Indexa (3%) contra a Real Time (9%): duas das três nacionais mais recentes o dão em 3%. A leitura de 9% da Real Time ficou isolada. O mercado subiu e a urna não acompanhou, então a divergência mercado x urna não convergiu, ela aumentou. É de novo o exemplo mais gritante do painel.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "22/Jul: Renan subiu 1,85pp para 10.70% no mesmo dia em que a Gerp o mede em 3%. O caso mais gritante de mercado descolado da urna ficou AINDA mais descolado: o preço avançou e a nova pesquisa não deu lastro. Com Indexa 3% (21/Jul) e Gerp 3% (22/Jul) contra Real Time 9%, o consenso de urna é cerca de 3% e o 9% é que parece o ponto fora da curva. O mercado banca Renan a dois dígitos sozinho. STF impeach 2.95%."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0.40%",
    poll: "Haddad sobe na margem: Poly 0.40% (alta 0,05pp, vol USD 6,3M acumulado), nome residual sem lastro de urna. Não aparece nos cenários presidenciais das nacionais (foco no governo de SP). Na Datafolha SP 05/Jul, Tarcísio lidera com 46% x Haddad 30%, com Haddad na rejeição mais alta do estado (47%). Mantém Márcio França (PSB) como vice. A oscilação diária sem nada entre as pontas é a assinatura de um book fino.",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "22/Jul: Haddad subiu 0,05pp para 0.40%, ruído de book fino. O preço dele é resíduo de nome conhecido, não sinal de candidatura presidencial: nenhuma nacional o testa nesse cargo. O foco é estadual, e no governo de SP a Datafolha 05/Jul deu Tarcísio 46% x Haddad 30%, com Haddad na rejeição mais alta do estado (47%). STF impeach 2.95%."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1.50%",
    poll: "Caiado DEVOLVE parte da alta: Poly 1.50% (queda 0,35pp, vol USD 5,0M acumulado), depois que a Gerp não confirmou o 2º turno competitivo da véspera. A Gerp 22/Jul o dá com 3% no 1º turno e Lula à frente no returno direto (44x41), não o empate (44x43) que a Real Time apontara. O sinal mais competitivo do pelotão segue sendo de uma casa só. Faixa nas três recentes: 3-7% (Gerp 3, Indexa 6, Real Time 7). Chapa pura do PSD (Kassab vice).",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "22/Jul: Caiado recuou 0,35pp para 1.50% no vencedor depois que a Gerp esvaziou o sinal do dia anterior: ela dá Lula à frente dele no 2º turno (44x41), não o empate técnico que a Real Time dera (44x43). O cenário competitivo de Caiado segue sem confirmação de segunda fonte. O contraste com o preço persiste: mede 3-7% de voto e vale 1,5% no vencedor. STF impeach 2.95%."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0.50%",
    poll: "Zema fica para trás: Poly 0.50% (queda 0,35pp, vol USD 4,5M). A Gerp 22/Jul o deu com 3% no 1º turno e perdendo o returno para Lula (38x44), mesmo patamar da Indexa 21/Jul (3%). Enquanto a distorção do topo domina o dia, ele segue no pelotão de baixo da 3ª via. Também marcou 3,7% na Futura/Apex 14/Jul e 4% na BTG/Nexus 13/Jul. A chapa entra nas convenções ainda sem vice definido.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "22/Jul: Zema recuou 0,35pp para 0.50% no vencedor e segue no fundo do pelotão da 3ª via, com 3% na Gerp e na Indexa. Chega às convenções ainda sem vice, depois de Michelle Bolsonaro ter descartado publicamente a hipótese. Defende privatização de Petrobras e Banco do Brasil em eventual governo (Jornal do Brasil), posição que o diferencia no pelotão. Marca 3% na urna e vale 0,50% no preço, cerca de um vinte avos de Renan (10,70%). STF impeach 2.95%."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.15%",
    poll: "Tarcísio estável a Poly 0.15% no presidencial (anomalia de legado, vol USD 13,5M acumulado, o maior volume individual do book presidencial). Não aparece nos cenários presidenciais das nacionais. O foco é a reeleição em SP, onde a Datafolha 05/Jul o dá liderando com 46% x Haddad 30% e aprovação de 45%. No Senado por cadeiras, o PL CAIU de 86.00% para 75.00%, o maior recuo dos sub-mercados no dia.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "22/Jul: Tarcísio segue focado na reeleição em SP, onde lidera (Datafolha 05/Jul: 46% x Haddad 30%, aprovação de 45%). O mercado mantém o presidencial em 0.15% (anomalia de legado, o maior volume individual do book a USD 13,5M), lembrete de que volume acumulado mede história negociada, não convicção atual. Nos sub-mercados, o Senado por cadeiras teve o maior movimento do dia: o PL caiu de 86.00% para 75.00%, ainda folgado na liderança. As convenções partidárias correm até 05/Ago e vão definir a chapa dele em SP. STF impeach 2.95%."
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
