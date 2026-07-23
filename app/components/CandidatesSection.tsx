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
    poll: "Lula ESTÁVEL pelo 2º dia: Poly 60.50% (0,00pp, vol USD 7,61M acumulado), a 73 dias do 1º turno. Nenhuma nacional nova hoje, então a urna segue sendo a Gerp 22/Jul (outlier pró-Flávio), que o dá empatado no 1º turno (38x38) e perdendo o returno direto por 45x46, mas vencendo Caiado (44x41), Zema (44x38) e Renan (45x35). O consenso Tier 1 forte segue sendo a Quaest 15/Jul (+12pp no 1T). O gap sobre Flávio abriu para +37,65pp, o maior desde 11/Jul, inteiramente por queda do adversário. Datafolha vem em 24/Jul.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTOS 23/Jul: dia sem urna. Lula ficou parado em 60,50% pelo segundo dia e ainda assim o gap sobre Flávio abriu 2,10pp, para +37,65pp, o maior desde 11/Jul. A leitura correta é que ele não subiu: todo o movimento veio da queda do adversário, e o valor segue abaixo do pico do ciclo (+39,5pp em 03/Jul). A PoderData 22/Jul (campo 18-20/Jul, n=2.500, IVR, sem registro TSE por não medir intenção de voto) trouxe a melhor avaliação dele em semanas: desaprovação pessoal de 50% para 47% e avaliação ruim ou péssima do trabalho de 47% para 37%, dez pontos numa semana. O governo segue reprovado por 51%. STF impeach 2.95% (estável). Volume no presidencial em USD 115,24M."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "22.85%",
    poll: "Flávio DESPENCA: Poly 22.85% (queda 2,10pp, vol USD 7,62M acumulado), a maior queda do book pelo 2º dia seguido, e no 2º lugar do 1º turno recuou 7,50pp, de 78,00% para 70,50%, o maior movimento isolado de todo o painel. Não houve urna nova para explicar: a Gerp 22/Jul, casa outlier pró-Flávio, segue sendo a leitura mais favorável a ele do recorte (empate no 1T 38x38, à frente no 2T direto 46x45). As duas de 21/Jul o mantêm em 30-33% no 1º turno e perdendo o 2º contra Lula. Rejeição alta: Gerp 46%, Indexa e Real Time 50%.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 23/Jul: André Mendonça (STF) autorizou a PF a abrir inquérito sobre os repasses de Daniel Vorcaro para o filme sobre Jair Bolsonaro, cerca de R$ 61 milhões entre fevereiro e maio de 2025, feitos a pedido de Flávio, com a apuração voltada a saber se o dinheiro foi mesmo aplicado no filme (Correio Braziliense, Terra, Diário do Nordeste). Ele nega vantagem indevida e diz que os recursos eram privados. No mesmo dia o preço caiu 2,10pp para 22.85% e 7,50pp no 2º lugar do 1º turno. O AFOS registra a coincidência de calendário e NÃO afirma causalidade: um único dia não estabelece causa. O PP sinalizou neutralidade (Valor) e Dora Kramer registrou que a direita profissional o acha amador (Folha), enquanto Moro disse que ele é o único capaz de derrotar Lula (Gazeta do Povo). Convenção do PL sábado 25/Jul, ainda sem vice."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "11.85%",
    poll: "Renan, a DISTORÇÃO no ponto mais agudo: Poly 11.85% (alta 1,15pp, vol USD 8,34M acumulado), 5º dia seguido de alta, e 68,00% no 3º lugar do 1º turno (alta 4,50pp). Nenhuma urna nova hoje, e o preço subiu de novo. Aos 11,85% ele está acima até dos 9% da Real Time 21/Jul, a leitura de urna mais alta do ciclo, então não existe hoje UMA pesquisa sequer que dê lastro ao patamar, com Gerp e Indexa medindo 3%. Tem o maior volume acumulado entre os nomes competitivos do book, acima de Lula e de Flávio.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "23/Jul: a distorção alargou pela 3ª vez seguida sem nenhuma urna nova. RESSALVA DE SÉRIE, e ela é obrigatória: os 11,85% NÃO são recorde. Renan valeu 17,9% em 09/Jun e 12,8% em 01/Jul, e caiu ao piso de 7,8% em 17/Jul. O que se vê é recuperação de piso recente, não descoberta do mercado, e tratar como inédito seria confundir movimento recente com máximo histórico. O que é inédito é outra coisa: o preço superou a leitura de urna mais alta do ciclo, então nenhuma pesquisa sustenta o nível atual. No 2º turno direto a Gerp o dá perdendo de Lula por 35x45. Datafolha 24/Jul decide. STF impeach 2.95%."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0.35%",
    poll: "Haddad recua na margem: Poly 0.35% (queda 0,05pp, vol USD 6,33M acumulado), nome residual sem lastro de urna. Não aparece nos cenários presidenciais das nacionais (foco no governo de SP). Na Datafolha SP 05/Jul, Tarcísio lidera com 46% x Haddad 30%, com Haddad na rejeição mais alta do estado (47%). Mantém Márcio França (PSB) como vice. A oscilação diária sem nada entre as pontas é a assinatura de um book fino.",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "23/Jul: Haddad recuou 0,05pp para 0.35%, ruído de book fino. Ficou de fora da rotação que levou preço de Flávio para Renan e Caiado, sinal de que o mercado não o trata como alternativa presidencial. O preço dele é resíduo de nome conhecido: nenhuma nacional o testa nesse cargo. O foco é estadual, e no governo de SP a Datafolha 05/Jul deu Tarcísio 46% x Haddad 30%, com Haddad na rejeição mais alta do estado (47%). STF impeach 2.95%."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "2.05%",
    poll: "Caiado SOBE sem urna nova: Poly 2.05% (alta 0,55pp, vol USD 5,10M acumulado), a 2ª maior alta do book no dia, e segue em 16,50% no 3º lugar do 1º turno. Como não houve pesquisa nova, o movimento é do mercado e não da urna: ele absorveu parte do preço que saiu de Flávio. A referência segue sendo Gerp 3% (22/Jul), Indexa 6% e Real Time 7% (21/Jul), com a Gerp dando Lula à frente no 2º turno direto (44x41), não o empate (44x43) da Real Time. Chapa pura do PSD (Kassab vice).",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "23/Jul: Caiado subiu 0,55pp para 2.05%, o maior patamar dele no ciclo recente, sem nenhuma pesquisa nova para justificar. O pelotão se partiu: ele e Renan subiram, Zema e Haddad ficaram parados, o que mostra o mercado separando a 3ª via em vez de tratá-la como bloco. O cenário de 2º turno competitivo contra Lula segue sem confirmação de segunda fonte. O contraste com o preço persiste: mede 3-7% de voto declarado e vale 2,05% no vencedor. STF impeach 2.95%."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0.45%",
    poll: "Zema fica de fora da rotação: Poly 0.45% (queda 0,05pp, vol USD 4,49M). No dia em que o mercado tirou preço de Flávio e distribuiu para Renan e Caiado, ele não recebeu nada. A Gerp 22/Jul o deu com 3% no 1º turno e perdendo o returno para Lula (38x44), mesmo patamar da Indexa 21/Jul (3%). Também marcou 3,7% na Futura/Apex 14/Jul e 4% na BTG/Nexus 13/Jul. A chapa entra nas convenções ainda sem vice definido.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "23/Jul: Zema recuou 0,05pp para 0.45% e segue no fundo do pelotão da 3ª via, com 3% na Gerp e na Indexa. Ficou de fora da rotação que beneficiou Caiado e Renan, sinal de que o mercado separa o pelotão em vez de tratá-lo como bloco. Chega às convenções ainda sem vice, depois de Michelle Bolsonaro ter descartado publicamente a hipótese. Defende privatização de Petrobras e Banco do Brasil em eventual governo (Jornal do Brasil). Marca 3% na urna e vale 0,45% no preço, cerca de um vinte e seis avos de Renan (11,85%). STF impeach 2.95%."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.15%",
    poll: "Tarcísio estável a Poly 0.15% no presidencial (anomalia de legado, vol USD 13,55M acumulado, o maior volume individual do book presidencial). Não aparece nos cenários presidenciais das nacionais. O foco é a reeleição em SP, onde a Datafolha 05/Jul o dá liderando com 46% x Haddad 30% e aprovação de 45%. No Senado por cadeiras, o PL recuou de 75.00% para 72.00% e o MDB subiu para 20,90%.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "23/Jul: Tarcísio segue focado na reeleição em SP, onde lidera (Datafolha 05/Jul: 46% x Haddad 30%, aprovação de 45%). O mercado mantém o presidencial em 0.15% (anomalia de legado, o maior volume individual do book a USD 13,55M), lembrete de que volume acumulado mede história negociada, não convicção atual. Nos sub-mercados, o Senado por cadeiras seguiu o desgaste do campo de Flávio: o PL caiu de 75.00% para 72.00% e o MDB subiu para 20,90%, ainda com o PL folgado na liderança. As convenções correm até 05/Ago. STF impeach 2.95%."
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
