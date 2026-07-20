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
    poll: "Lula ESTÁVEL no preço: Poly 60.50% (0,00pp, vol USD 7,5M acumulado), a 76 dias do 1º turno. Hoje o gap sobre Flávio ESTREITOU para +34,25pp, porque o adversário subiu e Lula ficou parado, movimento inverso ao dos dias anteriores. As últimas nacionais seguem a Quaest 15/Jul (1T 40x28, 2T 45x37) e a PoderData 16/Jul (1T 40x34, 2T 45x43), e Lula é IDÊNTICO nas duas: 40% no 1T e 45% no 2T. A discordância inteira está no Flávio. Uma Quaest de expectativa desta semana mostra 55% achando que Lula vence, contra 25% para Flávio (G1, CartaCapital). Próximas nacionais de intenção em 21, 22 e 24/Jul.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTOS 20/Jul: as convenções partidárias abriram hoje e vão até 05/Ago, a fase mais estrutural do ciclo. No mercado, Lula ficou imóvel a 60,50% (0,00pp) e a variação veio do adversário, que subiu, estreitando o gap para +34,25pp, ainda bem abaixo do pico do ciclo (+39,5pp em 03/Jul). O ponto que importa: o gap se moveu por conta do adversário, não do favorito, e sem gatilho de pesquisa nem evento de urna é momentum, não reação. A agenda segue travada no Congresso, com mais de 20 derrotas no 3º mandato (Poder360) e pacote de crédito de R$ 145 bi por fora do arcabouço (Estadão). STF impeach 2.95% (queda 0,80pp). Volume no presidencial em USD 113,8M."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "26.25%",
    poll: "Flávio DEVOLVE parte da queda: Poly 26.25% (alta 0,60pp, vol USD 7,5M acumulado), recuperando parte das três sessões seguidas de perda até 19/Jul, sem pesquisa nem evento de urna por trás. É ele que segue movendo o painel, para baixo ou para cima, num book onde Lula está travado. O pano de fundo do voto, inalterado, segue desfavorável no nível: Quaest 28% e PoderData 34% no 1T, as duas medindo queda dentro de cada casa (Quaest 29 para 28, PoderData 36 para 34).",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 20/Jul: Flávio entregou o movimento do dia de novo, desta vez para cima (alta 0,60pp, para 26.25%), e o gap para Lula recuou para +34,25pp. A semana é a mais estrutural do ciclo: as convenções abriram em 20/Jul e vão até 05/Ago, e ele deve realizar a própria convenção no sábado 25/Jul ainda SEM vice definido (Folha), com o PL fechando chapa com Jair preso e Flávio suspenso das visitas ao pai até outubro. No caso Master, pediu a suspeição de Moraes (MSN), enquanto a PF revelou repasses milionários do banco a consultoria (Revista Oeste). Uma Quaest de expectativa desta semana mostra só 25% achando que ele vence, contra 55% para Lula (G1). STF impeach 2.95%."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "8.65%",
    poll: "Renan sobe no vencedor: Poly 8.65% (alta 0,50pp, vol USD 8,2M acumulado), o segundo maior preço do book presidencial, atrás só de Lula e Flávio. A última urna segue os 6% da PoderData 16/Jul, a maior marca dele entre as nacionais do recorte de 30 dias e alta dentro da própria casa (4% em 25/Jun). A Quaest de 15/Jul deu 3%, atrás de Caiado: as duas casas ainda discordam de quem lidera a 3ª via. A distorção clássica persiste, o mercado o precifica bem acima do que qualquer urna mede.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "20/Jul: Renan subiu 0,50pp no vencedor, para 8.65%, mantendo a distorção que é a mais didática do painel: vale 8,65% no mercado contra um teto de 6% na melhor urna (PoderData 16/Jul), e mais que dobra qualquer nacional anterior a julho. É o retrato do que separa notoriedade de intenção de voto, e o que um mercado precifica quando um nome vira aposta de cauda. A leitura de fundo não mudou: a Quaest cravou que Caiado, Zema e Renan não decolam nem com Flávio perdendo terreno na direita não-bolsonarista. STF impeach 2.95%."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0.55%",
    poll: "Haddad estável: Poly 0.55% (0,00pp, vol USD 6,3M acumulado), nome residual sem lastro de urna. Não aparece nos cenários presidenciais das nacionais (foco no governo de SP). Na Datafolha SP 05/Jul, Tarcísio lidera com 46% x Haddad 30%, com Haddad na rejeição mais alta do estado (47%). Mantém Márcio França (PSB) como vice. A oscilação diária sem nada entre as pontas é a assinatura de um book fino.",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "20/Jul: Haddad estável em 0.55%. O preço dele é resíduo de nome conhecido num mercado fino, não sinal de candidatura: o mercado não precifica candidatura presidencial dele e nenhuma nacional o testa nesse cargo. O foco é estadual, e no governo de SP a Datafolha 05/Jul deu Tarcísio 46% x Haddad 30%, com Haddad na rejeição mais alta do estado (47%). STF impeach 2.95%."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1.35%",
    poll: "Caiado praticamente parado: Poly 1.35% (0,00pp, vol USD 5,0M acumulado). Sem pesquisa nova, segue a foto da PoderData 16/Jul: 4%, empatado com Zema e ATRÁS de Renan (6%), invertendo a Quaest (Caiado 4%, Renan 3%). Mede 4% nas duas casas, o número mais estável do pelotão, mas as duas discordam de quem lidera. Chapa pura do PSD (Kassab vice).",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "20/Jul: Caiado estável em 1.35%, entrando na semana das convenções sem novidade de preço. O pano de fundo segue a PoderData 16/Jul, que o pôs em 4%, atrás de Renan (6%) e empatado com Zema. As duas casas discordam da ordem do pelotão e concordam que nenhum decola: a Quaest cravou que Caiado, Zema e Renan não crescem nem com Flávio perdendo terreno na direita não-bolsonarista em dois meses. O contraste com o preço persiste: mede 4% de voto e vale cerca de um sexto de Renan (8,65%) no vencedor. STF impeach 2.95%."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0.65%",
    poll: "Zema estável: Poly 0.65% (0,00pp, vol USD 4,4M). A última urna, a PoderData 16/Jul, o dá com 4%, DOBRO dos 2% da Quaest, empatado com Caiado. Também marcou 3,7% na Futura/Apex 14/Jul e 4% na BTG/Nexus 13/Jul. Marca dois terços do voto de Renan na MESMA pesquisa e vale cerca de um treze avos dele (8,65%) no preço. A chapa entra nas convenções ainda sem vice definido.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "20/Jul: Zema estável em 0.65% no vencedor, entrando na abertura das convenções ainda sem vice, depois de Michelle Bolsonaro ter descartado publicamente a hipótese. Defende privatização de Petrobras e Banco do Brasil em eventual governo (Jornal do Brasil), posição que o diferencia no pelotão. Segue a distorção relativa mais visível do painel na mesma régua: na MESMA PoderData, Zema marca 4% e Renan 6%, e vale 0,65% contra 8,65% no preço. Não é sobre intenção de voto, é sobre notoriedade e narrativa, que é o que um mercado fino precifica. STF impeach 2.95%."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.15%",
    poll: "Tarcísio estável a Poly 0.15% no presidencial (anomalia de legado, vol USD 13,5M acumulado, o maior volume individual do book presidencial). Não aparece nos cenários presidenciais das nacionais, nem na Quaest 15/Jul nem na PoderData 16/Jul. O foco é a reeleição em SP, onde a Datafolha 05/Jul o dá liderando com 46% x Haddad 30% e aprovação de 45%. No Senado por cadeiras, o PL segue folgado em 85.50% (estável), a liderança do mercado de mais cadeiras.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "20/Jul: Tarcísio segue focado na reeleição em SP, onde lidera (Datafolha 05/Jul: 46% x Haddad 30%, aprovação de 45%). O mercado mantém o presidencial em 0.15% (anomalia de legado, volume herdado de apostas antigas, o maior volume individual do book presidencial a USD 13,5M), e essa combinação de volume alto com preço de piso é o melhor lembrete do painel de que volume acumulado mede história negociada, não convicção atual. Nos sub-mercados, o Senado por cadeiras ficou estável, com o PL em 85.50%, folgado. As convenções partidárias abriram em 20/Jul e vão definir a chapa dele em SP. STF impeach 2.95%."
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
