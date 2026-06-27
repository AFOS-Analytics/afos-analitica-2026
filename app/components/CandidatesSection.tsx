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
    polymarket: "56.50%",
    poll: "Lula estável na dominância: Poly 56.50% (vol USD 7.0M acumulado), com o gap sobre Flávio se alargando a +34.35pp (↑0.80pp), o mais largo do recorte, a 99 dias do 1º turno. A divergência do dia é nítida: a Vox Brasil publicada hoje deu 2º turno em empate técnico (Lula 45.3% × Flávio 42.8%, gap +2.5pp), o mais apertado do ciclo, enquanto o mercado faz o oposto e amplia a vantagem de Lula. O consenso Tier 1 (Indexa 23/Jun 2T 47% × 40%; Datafolha 20/Jun 2T 47% × 43%; CNT/MDA; BTG/Nexus) dá folga maior que a Vox e a PoderData. Em MG, Lula aparece quase 20pp à frente (Revista Fórum).",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTOS 27/Jun D+44: a 99 dias do 1º turno, Lula segue dominante e estável (56.50%) e o gap foi ao mais largo do recorte (+34.35pp, ↑0.80pp). A divergência do dia foi nítida: a Vox Brasil de hoje deu 2T empate técnico (Lula 45.3% × Flávio 42.8%), o mais apertado do ciclo, com Lula até recuando 2.5pp frente à própria rodada de 05/Jun, enquanto o mercado ampliou a vantagem dele. O caso Master deu trégua (Wagner volta a defender inocência, Folha) e o STF impeach recuou ao piso (2.65%, ↓0.75pp). Volume no presidencial acima de USD 105M."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "22.15%",
    poll: "Flávio cede no dia: Poly 22.15% (↓0.80pp, vol USD 7.1M acumulado), e o gap para Lula vai a +34.35pp, o mais largo do recorte. O dia foi de pressão jurídica: a PF concluiu que ele caluniou Lula ao associá-lo ao tráfico (Valor, Folha), desdobramento do inquérito de Moraes. Ainda assim, a Vox de hoje o mostra competitivo no 2º turno (Lula 45.3% × Flávio 42.8%, empate técnico, subindo 1.5pp frente à própria rodada de 05/Jun). Recua de leve no 2º lugar do 1º turno (76.5%, ↓2pp), mas o mantém folgado.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 27/Jun: pressão jurídica. Flávio cedeu no mercado (22.15%, ↓0.80pp) e o gap para Lula foi ao mais largo do recorte (+34.35pp). A PF concluiu que ele caluniou Lula ao associá-lo ao tráfico (Valor, Folha, vermelho.org), desdobramento do inquérito aberto por Moraes na véspera. Flávio anunciou viagem aos EUA para negociar com Trump (Estadão), e a campanha segue apostando em vice mulher após o vídeo de Michelle (a BBC questiona se o vídeo se voltou contra ela). O ativo é o 2º turno competitivo (Vox 42.8%, empate técnico), mas a rejeição segue a maior do páreo (Datafolha 48%, BTG/Nexus 52%). STF impeach a 2.65%."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "11.65%",
    poll: "Renan presidencial Poly 11.65% (↑0.20pp, vol USD 7.5M acumulado) no mercado de vencedor, e seu favoritismo ao 3º lugar do 1º turno segue cravado a 50% no sub-mercado, agora com folga maior (Caiado e Zema cederam a 16% e 15% atrás), seguindo com o maior volume acumulado do presidencial. A PoderData/Aya deu Renan 4% no 1º turno; as demais nacionais o medem em 2-3%, mantendo a divergência mais larga do dashboard (~7.65pp).",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "27/Jun: Renan subiu de leve no vencedor (11.65%, ↑0.20pp) e manteve o favoritismo ao 3º lugar do 1º turno (50%), agora com folga maior, já que Caiado (16%) e Zema (15%) recuaram no sub-mercado. As pesquisas o medem a ~4% no 1T (PoderData/Aya 4%), mantendo a divergência mais larga do dashboard (~7.65pp). A 99 dias, com a 3ª via no piso e a crise na família Bolsonaro, o espaço anti-Lula segue em disputa. A leitura segue: provável 3º colocado, sem chance real de vencer (capital de nicho, dependente do tropeço alheio). STF impeach 2.65%."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "1.15%",
    poll: "Haddad cede a Poly 1.15% (↓0.10pp, vol USD 6.0M acumulado), na faixa de Camilo Santana (1.15%) como nome do PT depois de Lula no mercado presidencial. As nacionais não testam Haddad no presidencial nacional (foco governo de SP). Confirmou Márcio França (PSB) como vice na chapa pelo governo de SP, com Tebet e Marina cogitados para o Senado (Folha, Brasil de Fato), consolidando a aliança de centro-esquerda no estado.",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Haddad cedeu a 1.15% (↓0.10pp), na faixa de Camilo Santana (1.15%), como nome do PT depois de Lula. O mercado não precifica candidatura presidencial dele; o foco é estadual. Confirmou França vice na chapa de SP, com Tebet/Marina ao Senado (Folha, Brasil de Fato). A Vox SP 30/Mai deu 2T estadual Tarcísio 48.3% × Haddad 36.5%. A reorganização da liderança no Senado adiciona ruído à articulação do PT. STF impeach 2.65%."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1.30%",
    poll: "Caiado recua a Poly 1.30% (↓0.15pp, vol USD 4.4M acumulado), ainda no piso da 3ª via, e cede no sub-mercado de 3º lugar do 1º turno (16%, vinha de 21%). A PoderData/Aya 25/Jun deu Caiado 4% no 1T e o pôs em empate técnico com Lula no 2º turno (Poder360, CNN). A Datafolha 20/Jun deu 3% no 1T (2T Lula 47% × Caiado 41%, competitivo). Num cenário SEM Flávio, a Futura/Apex dá Caiado 16.5% (lidera a 3ª via). É o nome posicionado para herdar o voto da direita se Flávio não for.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "Caiado recuou a 1.30% (↓0.15pp, vol USD 4.4M), ainda no piso, e cedeu no sub-mercado de 3º lugar do 1º turno (16%, vinha de 21%). A PoderData o pôs em empate técnico com Lula no 2º turno, sinal de competitividade no cenário sem Flávio (Futura 16.5%). No cenário com Flávio, o 'paradoxo da direita' (G1) explica o teto. Em Goiás, o MP entrou com ação contra o uso de policiais como seguranças dele (Folha). STF impeach 2.65%."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "1.25%",
    poll: "Zema estável a Poly 1.25% (vol USD 4.0M) num dia em que os pares da 3ª via recuaram, mas cede no sub-mercado de 3º lugar do 1º turno (15%, vinha de 16%). A PoderData/Aya 25/Jun o pôs em empate técnico com Lula no 2º turno (CNN). A Datafolha 20/Jun deu Zema 2% no 1T e 2T Lula 48% × Zema 39%. Sem Flávio, a Futura/Apex dá Zema 13.3% (2º da 3ª via, atrás de Caiado). Negou aliança com Flávio e Caiado e prometeu anunciar o vice nesta semana (Estadão).",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Zema ficou estável a 1.25% (vol USD 4.0M) num dia em que os pares da 3ª via recuaram, e cedeu no sub-mercado de 3º lugar (15%, vinha de 16%). A PoderData o pôs em empate técnico com Lula no 2º turno, mas na disputa bipolarizada com Flávio o Novo não encontra tração. Negou aliança com Flávio e Caiado (Estadão). No cenário sem Flávio, a Futura/Apex dá Zema 13.3%, fôlego latente. STF impeach 2.65%."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.15%",
    poll: "Tarcísio presidencial 0.15% Poly estável (vol USD ~13M acumulado, o maior do mercado, anomalia de legado). As nacionais não destacam Tarcísio no presidencial nacional (foco reeleição SP). Com Haddad confirmando França como vice no PT, a disputa por SP ganha contornos definidos. Mantida Vox SP 30/Mai 2T estadual Tarcísio 48.3% × Haddad 36.5% (Poder360).",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Tarcísio segue focado na reeleição em SP, onde lidera, e o mercado mantém o presidencial em 0.15% (anomalia de legado, volume herdado de apostas antigas, o maior do book a USD 13M). A disputa por SP se define: Haddad confirmou França como vice (Folha). No mercado de Senado por número de cadeiras, o PL segue na liderança (76.5%), sinal de capilaridade institucional da legenda. STF impeach 2.65%."
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
