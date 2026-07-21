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
    poll: "Lula ESTÁVEL no preço: Poly 60.50% (0,00pp, vol USD 7,5M acumulado), a 75 dias do 1º turno. Duas nacionais saíram hoje e o mercado não se mexeu. Indexa 21/Jul: 1T 41x30 (+11pp), 2T 46x39 (+7pp). Real Time Big Data 21/Jul: 1T 40x33 (+7pp), 2T 45x42 (empate técnico). As duas concordam na liderança do 1º turno e divergem no 2º. Atenção ao sinal da Real Time: num 2º turno direto, Lula empata tecnicamente com Caiado e fica numericamente atrás (43x44), leitura de uma casa só a confirmar. O gap sobre Flávio alargou para +34,35pp por queda do adversário.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTOS 21/Jul: duas nacionais quebraram o jejum de pesquisa e confirmaram Lula liderando o 1º turno (40-41%), mas o mercado ficou imóvel a 60,50% (0,00pp). O gap sobre Flávio alargou para +34,35pp por queda do adversário, não por passo de Lula, ainda longe do pico do ciclo (+39,5pp em 03/Jul). A aprovação, com quatro leituras na semana, ficou entre 42% e 49%, sem folga. A agenda segue travada no Congresso, com mais de 20 derrotas no 3º mandato (Poder360) e pacote de crédito de R$ 145 bi por fora do arcabouço (Estadão). STF impeach 2.95% (estável). Volume no presidencial em USD 114,2M."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "26.15%",
    poll: "Flávio quase PARADO: Poly 26.15% (queda 0,10pp, vol USD 7,5M acumulado), e o 2º lugar do 1º turno cedeu de 79,00% para 78,00%. As duas nacionais de hoje o mantêm em 30-33% no 1T (Indexa 30%, Real Time 33%), patamar mais baixo do que já ocupou, e ele perde o 2º turno contra Lula nas duas. O golpe do dia é de posição: na Real Time, quem empata tecnicamente com Lula no returno e fica à frente é CAIADO (44x43), não ele. A VEJA cravou que o adversário mais competitivo de Lula não é Flávio. Rejeição de 50% nas duas do dia, a maior do páreo.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 21/Jul: com duas pesquisas novas, Flávio recuou 0,10pp para 26.15% e o gap para Lula alargou para +34,35pp. O dado que ataca a candidatura dele: a Real Time deu Caiado à frente de Lula num 2º turno direto (44x43), desafiando a premissa de que Flávio é o nome da direita no returno, que o mercado ainda banca a 78% no 2º lugar do 1º turno. É leitura de uma casa reliability 3, a confirmar. As convenções correm até 05/Ago, a dele no sábado 25/Jul ainda SEM vice (Folha), com o PL fechando chapa com Jair preso e Flávio suspenso das visitas ao pai até outubro. No caso Master, a PF revelou repasses milionários do banco a consultoria (Revista Oeste). STF impeach 2.95%."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "8.85%",
    poll: "Renan, o ACHADO do dia: Poly 8.85% (alta 0,20pp, vol USD 8,2M acumulado), o segundo maior preço do book presidencial. A Real Time 21/Jul o deu com 9% no 1º turno, a maior marca dele numa nacional do recorte e praticamente o preço do mercado, a primeira urna a encostar naquele nível (VEJA chamou de salto surpreendente). Mas a Indexa do MESMO dia o mede em 3%, seis pontos abaixo. A distorção não convergiu, se partiu: uma casa validou o mercado, a outra o manteve. A régua honesta dele passou de 3-6% para 3-9%.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "21/Jul: Renan subiu 0,20pp para 8.85%. O caso que era o exemplo mais gritante de mercado descolado da urna foi parcialmente testado, e o resultado é uma divisão, não convergência: a Real Time deu 9% (valida o preço), a Indexa deu 3% (mantém a distorção). Falta segunda fonte na direção do 9%. Contrapeso do próprio dia: no 2º turno direto, a Real Time o dá perdendo de Lula por 44 a 35, enquanto dá empate a Caiado, ou seja, o salto no 1º turno não vira competitividade no returno. O mercado subiu só 0,20pp e o 3º lugar do 1º turno até recuou. STF impeach 2.95%."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0.35%",
    poll: "Haddad recua: Poly 0.35% (queda 0,20pp, vol USD 6,3M acumulado), nome residual sem lastro de urna. Não aparece nos cenários presidenciais das nacionais de 21/Jul (foco no governo de SP). Na Datafolha SP 05/Jul, Tarcísio lidera com 46% x Haddad 30%, com Haddad na rejeição mais alta do estado (47%). Mantém Márcio França (PSB) como vice. A oscilação diária sem nada entre as pontas é a assinatura de um book fino.",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "21/Jul: Haddad recuou 0,20pp para 0.35%. O preço dele é resíduo de nome conhecido num mercado fino, não sinal de candidatura: o mercado não precifica candidatura presidencial dele e nenhuma nacional o testa nesse cargo. O foco é estadual, e no governo de SP a Datafolha 05/Jul deu Tarcísio 46% x Haddad 30%, com Haddad na rejeição mais alta do estado (47%). STF impeach 2.95%."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1.85%",
    poll: "Caiado sobe e surpreende: Poly 1.85% (alta 0,50pp, vol USD 5,0M acumulado). As duas nacionais de 21/Jul o sobem, 6% na Indexa e 7% na Real Time, o dobro dos 3-4% em que vinha. O dado do dia é dele: na Real Time empata tecnicamente com Lula num 2º turno direto (44x43, numericamente à frente), e a VEJA cravou que o adversário mais competitivo de Lula não é Flávio. Chapa pura do PSD (Kassab vice).",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "21/Jul: Caiado subiu 0,50pp para 1.85% no vencedor e para 16,50% no 3º lugar do 1º turno, na esteira do 2º turno competitivo da Real Time (empate com Lula, 44x43). É a maior mexida do pelotão no dia, mas o cenário é de uma casa reliability 3 e precisa de confirmação: na Indexa do mesmo dia ele fica em 6% no 1T, sem esse returno testado. O contraste com o preço persiste: mede 6-7% de voto e vale menos de 2% no vencedor, sinal de que o mercado ainda não precifica viabilidade de 2º turno. STF impeach 2.95%."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0.85%",
    poll: "Zema fica para trás: Poly 0.85% (alta 0,20pp, vol USD 4,4M). A Indexa 21/Jul o deu com 3% no 1º turno, e ele não apareceu destacado no cenário da Real Time, atrás de Renan (9%) e Caiado (7%). Enquanto o pelotão da 3ª via subiu no dia, ele ficou para trás. Também marcou 3,7% na Futura/Apex 14/Jul e 4% na BTG/Nexus 13/Jul. A chapa entra nas convenções ainda sem vice definido.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "21/Jul: Zema subiu 0,20pp para 0.85% no vencedor, mas ficou para trás na corrida da 3ª via, com Caiado e Renan subindo mais forte. Chega às convenções ainda sem vice, depois de Michelle Bolsonaro ter descartado publicamente a hipótese. Defende privatização de Petrobras e Banco do Brasil em eventual governo (Jornal do Brasil), posição que o diferencia no pelotão. Marca 3% na Indexa e vale 0,85% no preço, cerca de um décimo de Renan (8,85%). STF impeach 2.95%."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.15%",
    poll: "Tarcísio estável a Poly 0.15% no presidencial (anomalia de legado, vol USD 13,5M acumulado, o maior volume individual do book presidencial). Não aparece nos cenários presidenciais das nacionais, nem na Indexa nem na Real Time de 21/Jul. O foco é a reeleição em SP, onde a Datafolha 05/Jul o dá liderando com 46% x Haddad 30% e aprovação de 45%. No Senado por cadeiras, o PL subiu para 86.00% (alta 0,50pp), a liderança do mercado de mais cadeiras.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "21/Jul: Tarcísio segue focado na reeleição em SP, onde lidera (Datafolha 05/Jul: 46% x Haddad 30%, aprovação de 45%). O mercado mantém o presidencial em 0.15% (anomalia de legado, volume herdado de apostas antigas, o maior volume individual do book presidencial a USD 13,5M), e essa combinação de volume alto com preço de piso é o melhor lembrete do painel de que volume acumulado mede história negociada, não convicção atual. Nos sub-mercados, o Senado por cadeiras subiu, com o PL em 86.00%, folgado. As convenções partidárias correm até 05/Ago e vão definir a chapa dele em SP. STF impeach 2.95%."
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
