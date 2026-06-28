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
    polymarket: "57.50%",
    poll: "Lula em novo recorde: Poly 57.50% (↑1.00pp, vol USD 7.0M acumulado), com o gap sobre Flávio se alargando a +35.25pp (↑0.90pp), o mais largo do recorte, a 98 dias do 1º turno. O domingo foi pró-Lula: Flávio faltou a 43% das votações do Senado (Folha, Valor), a crise Michelle × Flávio persiste (O Globo), e Lula fechou alianças em 25 estados contra 14 de Flávio (CNN). A Quaest deu Lula com 51% de aprovação entre independentes (Revista Fórum). A última pesquisa segue a Vox Brasil de 27/Jun (2T empate técnico, 45.3% × 42.8%), que o mercado contraria ao ampliar a vantagem de Lula. Em MG, quase 20pp à frente.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTOS 28/Jun D+45: a 98 dias do 1º turno, Lula subiu a novo recorde (57.50%, ↑1.00pp) e o gap foi ao mais largo do recorte (+35.25pp, ↑0.90pp). Domingo pró-Lula: Flávio faltou a 43% das votações do Senado (Folha, Valor), a crise na família Bolsonaro persiste (Michelle × Flávio pelo espólio e pela estrutura do PL, O Globo), Lula liderou em coalizão (alianças em 25 estados × 14, CNN) e a Quaest deu 51% de aprovação entre independentes (Revista Fórum). O caso Master segue aberto (Mendonça e o financiamento do Dark Horse à PGR, G1), STF impeach estável (2.65%). Sem pesquisa nova; AtlasIntel nacional adiada p/ 01/Jul. Volume no presidencial acima de USD 105M."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "22.25%",
    poll: "Flávio quase parado: Poly 22.25% (↑0.10pp, vol USD 7.1M acumulado) num dia em que Lula subiu, e o gap para Lula vai a +35.25pp, o mais largo do recorte. O domingo foi adverso: faltou a 43% das votações nominais do Senado em 2026 (Folha, Valor), e a crise com Michelle pelo espólio e pela estrutura do PL persiste (O Globo). Em coalizão, Lula o supera (25 estados × 14, CNN). O ativo segue sendo o 2º turno competitivo (Vox 27/Jun 42.8%, empate técnico). Recua de leve no 2º lugar do 1º turno (75.5%, ↓1pp), mas o mantém folgado.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 28/Jun: domingo adverso. Flávio quase não andou no mercado (22.25%, ↑0.10pp) e o gap para Lula foi ao mais largo do recorte (+35.25pp). Faltou a 43% das votações nominais do Senado em 2026 (Folha, Valor), munição de campanha contra o mandato, e a crise com Michelle persiste (O Globo: ela usa a estrutura do PL na disputa pelo espólio). A Quaest mediu 35% das mulheres como anti-Flávio (Revista Fórum). Flávio vai aos EUA negociar com Trump (Estadão). O ativo é o 2º turno competitivo (Vox 42.8%, empate técnico), mas a rejeição segue a maior do páreo (Datafolha 48%, BTG/Nexus 52%). STF impeach a 2.65%. AtlasIntel de 01/Jul medirá o impacto da crise Michelle × Flávio."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "11.60%",
    poll: "Renan presidencial Poly 11.60% (↓0.05pp, vol USD 7.5M acumulado) no mercado de vencedor, e seu favoritismo ao 3º lugar do 1º turno segue cravado a 49.5% no sub-mercado, com folga sobre Caiado (16%) e Zema (13%), seguindo com o maior volume acumulado do presidencial. A PoderData/Aya deu Renan 4% no 1º turno; as demais nacionais o medem em 2-3%, mantendo a divergência mais larga do dashboard (~7.60pp). Aposta em vaquinha, base do MBL e Faria Lima para disputar sem máquina partidária (Estadão).",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "28/Jun: Renan praticamente não cedeu no vencedor (11.60%, ↓0.05pp) e manteve o favoritismo ao 3º lugar do 1º turno (49.5%), com folga sobre Caiado (16%) e Zema (13%). As pesquisas o medem a ~4% no 1T (PoderData/Aya 4%), mantendo a divergência mais larga do dashboard (~7.60pp). A aposta em vaquinha, MBL e Faria Lima (Estadão) confirma a ausência de máquina partidária. A 98 dias, com a 3ª via no piso e a crise na família Bolsonaro, o espaço anti-Lula segue em disputa. A leitura segue: provável 3º colocado, sem chance real de vencer (capital de nicho, dependente do tropeço alheio). STF impeach 2.65%."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "1.05%",
    poll: "Haddad cede a Poly 1.05% (↓0.10pp, vol USD 6.0M acumulado) como nome do PT depois de Lula no mercado presidencial. As nacionais não testam Haddad no presidencial nacional (foco governo de SP). Confirmou Márcio França (PSB) como vice na chapa pelo governo de SP, com Tebet e Marina cogitados para o Senado (Folha, Brasil de Fato), consolidando a aliança de centro-esquerda no estado. Nova pesquisa testa Tarcísio × Haddad em SP (VEJA).",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Haddad cedeu a 1.05% (↓0.10pp), como nome do PT depois de Lula. O mercado não precifica candidatura presidencial dele; o foco é estadual. Confirmou França vice na chapa de SP, com Tebet/Marina ao Senado (Folha, Brasil de Fato). A Vox SP 30/Mai deu 2T estadual Tarcísio 48.3% × Haddad 36.5%. A um mês das convenções, os presidenciáveis negociam vice (G1). STF impeach 2.65%."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1.25%",
    poll: "Caiado recua a Poly 1.25% (↓0.05pp, vol USD 4.5M acumulado), ainda no piso da 3ª via, e segue atrás no sub-mercado de 3º lugar do 1º turno (16%). A PoderData/Aya 25/Jun deu Caiado 4% no 1T e o pôs em empate técnico com Lula no 2º turno (Poder360, CNN). A Datafolha 20/Jun deu 3% no 1T (2T Lula 47% × Caiado 41%, competitivo). Num cenário SEM Flávio, a Futura/Apex dá Caiado 16.5% (lidera a 3ª via). É o nome posicionado para herdar o voto da direita se Flávio não for.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "Caiado recuou a 1.25% (↓0.05pp, vol USD 4.5M), ainda no piso, e segue atrás no sub-mercado de 3º lugar do 1º turno (16%). A PoderData o pôs em empate técnico com Lula no 2º turno, sinal de competitividade no cenário sem Flávio (Futura 16.5%). No cenário com Flávio, o 'paradoxo da direita' (G1) explica o teto. Em Goiás, o MP entrou com ação contra o uso de policiais como seguranças dele (Folha). STF impeach 2.65%."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "1.15%",
    poll: "Zema cede a Poly 1.15% (↓0.10pp, vol USD 4.0M) e recua no sub-mercado de 3º lugar do 1º turno (13%, vinha de 15%). A PoderData/Aya 25/Jun o pôs em empate técnico com Lula no 2º turno (CNN). A Datafolha 20/Jun deu Zema 2% no 1T e 2T Lula 48% × Zema 39%. Sem Flávio, a Futura/Apex dá Zema 13.3% (2º da 3ª via, atrás de Caiado). Prometeu anunciar o vice nesta semana (Estadão).",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Zema cedeu a 1.15% (↓0.10pp, vol USD 4.0M) e recuou no sub-mercado de 3º lugar (13%, vinha de 15%). A PoderData o pôs em empate técnico com Lula no 2º turno, mas na disputa bipolarizada com Flávio o Novo não encontra tração. No cenário sem Flávio, a Futura/Apex dá Zema 13.3%, fôlego latente. Prometeu anunciar o vice nesta semana (Estadão). STF impeach 2.65%."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.15%",
    poll: "Tarcísio presidencial 0.15% Poly estável (vol USD ~13M acumulado, o maior do mercado, anomalia de legado). As nacionais não destacam Tarcísio no presidencial nacional (foco reeleição SP). Nova pesquisa testa Tarcísio × Haddad pelo governo de SP (VEJA), com Haddad confirmando França como vice no PT. Mantida Vox SP 30/Mai 2T estadual Tarcísio 48.3% × Haddad 36.5% (Poder360).",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Tarcísio segue focado na reeleição em SP, onde lidera, e o mercado mantém o presidencial em 0.15% (anomalia de legado, volume herdado de apostas antigas, o maior do book a USD 13M). A disputa por SP segue acirrada (nova pesquisa Tarcísio × Haddad, VEJA), com Haddad confirmando França como vice (Folha). No mercado de Senado por número de cadeiras, o PL segue na liderança (76.5%), sinal de capilaridade institucional da legenda. STF impeach 2.65%."
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
