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
    polymarket: "55.50%",
    poll: "Lula salta a novo pico do ciclo: Poly 55.50% (↑4.00pp, vol USD 6.67M acumulado), com o gap sobre Flávio abrindo a +31.75pp, recorde do período. O mercado reprecificou forte a favor de Lula num dia sem pesquisa nova, digerindo a Datafolha de sábado e um caso Master que passou a pesar mais sobre a oposição. A Datafolha 20/Jun (n=2.004, campo 17-19/Jun, BR-09956/2026) confirma a liderança: 1T 41% × Flávio 31%; 2T 47% × 43% (gap +4pp); 47% × Caiado 41%; 48% × Zema 39%, vence todos os cenários (G1, Folha). Rejeição de Flávio (48%) maior que a de Lula (46%). Em linha com as três nacionais de 15-16/Jun (CNT/MDA 2T 49.3% × 36.8%, Futura/Apex 48.1% × 42.9%, BTG/Nexus 49% × 43%).",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTOS 22/Jun D+39: virada no mercado. Sem pesquisa nacional nova no TSE, o Polymarket reprecificou forte a favor de Lula, que saltou +4.00pp para 55.50%, novo pico do ciclo, e o gap sobre Flávio abriu a +31.75pp, recorde do período. O movimento veio depois de o mercado digerir a Datafolha de sábado e um caso Master que passou a pesar mais sobre a oposição (rombo evangélico na campanha de Flávio, bncamazonas; a Datafolha 'isola Flávio na direita', O Cafezinho). No campo do governo, a operação da PF mira Jaques Wagner, líder no Senado, e Lula deve recomendar sua saída da liderança (Folha); o PT já articula a sucessão (CartaCapital). Mesmo com a operação respingando no governo, o mercado não reprecificou a corrida contra o presidente. Volume total no presidencial acima de USD 100M. STF impeach a 3.75% (↑0.15pp)."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "23.75%",
    poll: "Flávio recua com força em Poly 23.75% (↓1.15pp, vol USD 6.90M acumulado) na sessão em que o mercado reprecificou a favor de Lula. A Datafolha 20/Jun ainda lhe dá o melhor 2º turno do recorte (1T 31%, gap -10pp; 2T 47% × 43%, gap -4pp), mas o caso Master abriu 'rombo evangélico' em sua campanha (bncamazonas) e a leitura virou que a Datafolha 'isola Flávio na direita' (O Cafezinho). A rejeição (48%) segue a maior do páreo (Lula 46%), e o gap para Lula abriu a +31.75pp, recorde do ciclo. Segue isolado na frente do 2º lugar do 1º turno (68.5%).",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 22/Jun: o paradoxo de Flávio virou recuo. A Datafolha de sábado ainda lhe dá o melhor 2º turno do recorte (47% × 43%, gap -4pp), MAS o mercado reprecificou a favor de Lula: Flávio caiu a 23.75% (↓1.15pp) e o gap para Lula abriu a +31.75pp, recorde do ciclo. O caso Master abriu 'rombo evangélico' em sua campanha (bncamazonas) e a leitura de imprensa virou que a Datafolha 'isola Flávio na direita' (O Cafezinho). A divergência é o sinal, agora aprofundado: a pesquisa mostra a corrida estreitando no 2º turno, o mercado dobra a aposta na dominância de Lula. A rejeição (48%, a maior do páreo) segue como teto, e o racha na direita persiste (Zema negou proximidade, Estadão). STF impeach a 3.75% (↑0.15pp)."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "13.70%",
    poll: "Renan presidencial Poly 13.70% (↓0.60pp, vol USD 7.33M acumulado) no mercado de vencedor, e segue cravado como favorito ao 3º lugar do 1º turno (60.5% no sub-mercado), com o maior volume acumulado do presidencial. A Datafolha 20/Jun mediu Renan a 3% no 1T, empatado com Caiado e à frente de Zema/Aécio (2%) e Joaquim Barbosa (1%). A divergência mercado × pesquisa segue a maior do dashboard, em ~10.70pp (13.70% × 3% na Datafolha), estreitada de leve porque o recuo no mercado aproximou as duas leituras. A Gazeta do Povo discute se ele é 'nome de terceira via para o futuro'.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "22/Jun: na sessão de virada a favor de Lula, Renan recuou no vencedor (13.70%, ↓0.60pp) e seguiu cravado como favorito ao 3º lugar do 1º turno (60.5% no sub-mercado). A Datafolha o mediu a 3% no 1T; com o recuo do mercado, a divergência estreitou de leve para ~10.70pp, ainda a maior do dashboard. A leitura é de um mercado que o precifica como provável 3º colocado, mas sem chance real de vencer (capital de nicho, não de vitória). A Datafolha confirma o campo anti-Lula embolado no piso (Caiado e Renan 3%, Zema e Aécio 2%). A Gazeta do Povo discute se Renan é nome de terceira via 'para o futuro'. STF impeach 3.75%."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "1.75%",
    poll: "Haddad recua de leve a Poly 1.75% (↓0.35pp, vol USD 5.87M acumulado), à frente de Camilo Santana (1.65%) como nome do PT depois de Lula no mercado presidencial. A Datafolha 20/Jun não testa Haddad no presidencial nacional (foco SP). No dia, comentou o caso Wagner dizendo que a PF está 'no papel dela de investigar' (Folha). Mantida Vox SP 30/Mai 2T estadual Tarcísio 48.3% × Haddad 36.5% (Poder360).",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Haddad recuou de leve a 1.75% (↓0.35pp) na sessão de virada a favor de Lula, à frente de Camilo Santana (1.65%), como nome do PT depois de Lula. Como ministro da Fazenda, no centro do PIX/tarifaço e do INSS, mas o mercado não precifica candidatura presidencial dele. A operação da PF no caso Master mira Jaques Wagner, líder do governo no Senado, e Lula deve recomendar sua saída da liderança (Folha), o que pressiona a articulação do PT no Congresso. Haddad comentou o caso com tom institucional (Folha). A aprovação do governo segue acima da desaprovação na série BTG/Nexus (48% × 47%). STF impeach 3.75%."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1.55%",
    poll: "Caiado recua a Poly 1.55% (↓0.45pp, vol USD 4.32M acumulado), no piso da 3ª via, na sessão de virada a favor de Lula. A Datafolha 20/Jun deu Caiado 3% no 1T (empatado com Renan) e 2T Lula 47% × Caiado 41% (gap -6pp, competitivo). A CNT/MDA deu 4% no 1T; e a Futura/Apex, num cenário SEM Flávio, dá Caiado 16.5% (lidera a 3ª via). Disse que Flávio 'perdeu a chance' de vencer Lula (G1). Caiado domina entre os bolsonaristas em recorte da Quaest (Jornal Opção): é o nome posicionado para herdar o voto da direita se Flávio não for.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "Caiado recuou a 1.55% (↓0.45pp, vol USD 4.32M), no piso das apostas: o mercado precifica baixa a hipótese de Flávio sair da disputa. A Datafolha 20/Jun o manteve a 3% no 1T. No cenário sem Flávio, a Futura/Apex dá Caiado 16.5%, sinal de quanto voto da direita está represado em Flávio. No cenário com Flávio, o 'paradoxo da direita' (G1) explica o teto. A estreia de Aécio na Datafolha disputa o mesmo nicho. STF impeach 3.75%."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "1.15%",
    poll: "Zema recua a Poly 1.15% (↓0.25pp, vol USD 3.81M), segue no piso da 3ª via. A Datafolha 20/Jun deu Zema 2% no 1T e 2T Lula 48% × Zema 39% (gap -9pp, o mais largo da 3ª via testada). No dia, NEGOU proximidade com Flávio e reacendeu a briga na direita (Estadão), atrito que dificulta a convergência da oposição. Sem Flávio, a Futura/Apex dá Zema 13.3% (2º da 3ª via, atrás de Caiado). O Novo se equilibra entre a candidatura de Zema e alianças com o PL nos estados.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Zema recuou a 1.15% (↓0.25pp), e a 3ª via segue sem tração na disputa bipolarizada Lula × Flávio. A Datafolha 20/Jun o mediu a 2% no 1T e deu 2T Lula 48% × Zema 39%. No dia, NEGOU proximidade com Flávio e reacendeu a briga na direita (Estadão), sinal do atrito do Novo com o bolsonarismo justamente quando o campo tentaria se unificar. No cenário sem Flávio, a Futura/Apex dá Zema 13.3%, fôlego latente. STF impeach 3.75%."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.15%",
    poll: "Tarcísio presidencial 0.15% Poly estável (vol USD ~12.90M acumulado, o maior do mercado, anomalia de legado). A Datafolha 20/Jun e as nacionais de 16/Jun não destacam Tarcísio no presidencial nacional (foco reeleição SP). Mantida Vox SP 30/Mai 2T estadual Tarcísio 48.3% × Haddad 36.5% (Poder360).",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Tarcísio segue focado na reeleição em SP, onde lidera, e o mercado mantém o presidencial em 0.15% (anomalia de legado, volume herdado de apostas antigas, o maior do book a USD 12.90M). No mercado de Senado por número de cadeiras, o PL segue na liderança (76.5%), sinal de capilaridade institucional da legenda. STF impeach 3.75%."
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
