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
    poll: "Lula recua do recorde: Poly 56.50% (↓1.00pp, vol USD 7.0M acumulado), com o gap sobre Flávio se estreitando a +32.95pp (↓2.30pp), a 97 dias do 1º turno. Dia de convergência: o mercado recuou na mesma direção da nova BTG/Nexus 29/Jun (n=2.009), que deu 1T Lula 42% × Flávio 34% e 2T 47% × 44% (empate técnico, ante 49×43 em 15/Jun do próprio instituto). Aprovação em empate (48% × 48%, BTG/Nexus), com a Quaest dando 51% entre independentes (Revista Fórum). Lula mantém a folga, mas o dinheiro real aproximou-se da pesquisa.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTOS 29/Jun D+46: a 97 dias do 1º turno, dia de convergência. Lula recuou do recorde (56.50%, ↓1.00pp) e o gap estreitou a +32.95pp (↓2.30pp) na esteira da nova BTG/Nexus 29/Jun, que mostrou Flávio reduzindo a diferença (1T 42×34; 2T 47×44, empate técnico). Aprovação em empate (48% × 48%, BTG/Nexus), rejeição 49%. A Quaest deu 51% de aprovação entre independentes (Revista Fórum). O caso Master segue aberto (Mendonça e o financiamento do Dark Horse à PGR, G1), STF impeach a 2.90% (↑0.25pp). AtlasIntel nacional prevista p/ 01/Jul. Volume no presidencial acima de USD 107M."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "23.55%",
    poll: "Flávio reage: Poly 23.55% (↑1.30pp, vol USD 7.1M acumulado) num dia em que Lula recuou, estreitando o gap para Lula a +32.95pp (saindo do recorde de +35.25pp). O movimento acompanha a nova BTG/Nexus 29/Jun, que o pôs reduzindo a diferença: 1T 34%, 2T 44% (Lula 47% × 44%, empate técnico, ganhando 1pp no 2T frente a 15/Jun). Encontrou-se com Milei na Argentina (Milei falou em 'onda azul', Folha). Amplia o 2º lugar do 1º turno (78.5%, ↑3pp), mas a rejeição segue a maior do páreo (BTG/Nexus 51%).",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 29/Jun: dia de reação. Flávio SOBE no mercado (23.55%, ↑1.30pp) e o gap para Lula estreitou a +32.95pp (↓2.30pp), na esteira da nova BTG/Nexus 29/Jun, que o pôs reduzindo a diferença (1T 34%, melhor da série recente; 2T 44%, empate técnico). Encontrou-se com Milei na Argentina, que falou em 'onda azul' para o Brasil (Folha), mas Milei é rejeitado por 60% dos argentinos (Revista Fórum). O Nordeste vira desafio, com palanques frágeis (Folha). A rejeição segue a maior do páreo (BTG/Nexus 51%, Datafolha 48%). STF impeach a 2.90%. AtlasIntel de 01/Jul medirá o impacto da crise Michelle × Flávio."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "12.55%",
    poll: "Renan presidencial Poly 12.55% (↑0.95pp, vol USD 7.6M acumulado) no mercado de vencedor, e amplia o favoritismo ao 3º lugar do 1º turno a 53.5% no sub-mercado (↑4pp), com folga sobre Caiado (18%) e Zema (10.5%), seguindo com o maior volume acumulado do presidencial. A BTG/Nexus 29/Jun e a PoderData/Aya deram Renan 4% no 1º turno; as demais nacionais o medem em 2-3%, alargando a divergência do dashboard a ~8.55pp. Aposta em vaquinha, base do MBL e Faria Lima para disputar sem máquina partidária (Estadão).",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "29/Jun: Renan SOBE no vencedor (12.55%, ↑0.95pp) e ampliou o favoritismo ao 3º lugar do 1º turno (53.5%, ↑4pp), com folga sobre Caiado (18%) e Zema (10.5%). As pesquisas o medem a ~4% no 1T (BTG/Nexus 4%, PoderData/Aya 4%), alargando a divergência mais larga do dashboard a ~8.55pp. A aposta em vaquinha, MBL e Faria Lima (Estadão) confirma a ausência de máquina partidária. A 97 dias, com a 3ª via no piso e a crise na família Bolsonaro, o espaço anti-Lula segue em disputa. A leitura segue: provável 3º colocado, sem chance real de vencer (capital de nicho, dependente do tropeço alheio). STF impeach 2.90%."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "1.05%",
    poll: "Haddad estável a Poly 1.05% (vol USD 6.0M acumulado) como nome do PT depois de Lula no mercado presidencial. As nacionais não testam Haddad no presidencial nacional (foco governo de SP). Confirmou Márcio França (PSB) como vice na chapa pelo governo de SP, com Tebet e Marina cogitados para o Senado (Folha, Brasil de Fato), consolidando a aliança de centro-esquerda no estado. Nova pesquisa testa Tarcísio × Haddad em SP (VEJA).",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Haddad estável a 1.05%, como nome do PT depois de Lula. O mercado não precifica candidatura presidencial dele; o foco é estadual. Confirmou França vice na chapa de SP, com Tebet/Marina ao Senado (Folha, Brasil de Fato). A Vox SP 30/Mai deu 2T estadual Tarcísio 48.3% × Haddad 36.5%. A um mês das convenções, os presidenciáveis negociam vice (G1). STF impeach 2.90%."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1.25%",
    poll: "Caiado estável a Poly 1.25% (vol USD 4.5M acumulado), ainda no piso da 3ª via, mas sobe no sub-mercado de 3º lugar do 1º turno (18%, vinha de 16%, ultrapassando Zema). A BTG/Nexus 29/Jun deu Caiado 5% no 1T, o melhor da 3ª via. A PoderData/Aya 25/Jun deu 4% e o pôs em empate técnico com Lula no 2º turno (Poder360, CNN). A Datafolha 20/Jun deu 3% no 1T (2T Lula 47% × Caiado 41%, competitivo). Num cenário SEM Flávio, a Futura/Apex dá Caiado 16.5% (lidera a 3ª via). É o nome posicionado para herdar o voto da direita se Flávio não for.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "Caiado estável a 1.25% (vol USD 4.5M), ainda no piso, mas sobe no sub-mercado de 3º lugar do 1º turno (18%, vinha de 16%, ultrapassando Zema). A BTG/Nexus 29/Jun o deu a 5% no 1T (melhor da 3ª via) e a PoderData o pôs em empate técnico com Lula no 2º turno, sinal de competitividade no cenário sem Flávio (Futura 16.5%). No cenário com Flávio, o 'paradoxo da direita' (G1) explica o teto. Em Goiás, o MP entrou com ação contra o uso de policiais como seguranças dele (Folha). STF impeach 2.90%."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "1.20%",
    poll: "Zema sobe de leve a Poly 1.20% (↑0.05pp, vol USD 4.0M) mas recua no sub-mercado de 3º lugar do 1º turno (10.5%, vinha de 13%, ultrapassado por Caiado). A BTG/Nexus 29/Jun deu Zema 3% no 1T. A PoderData/Aya 25/Jun o pôs em empate técnico com Lula no 2º turno (CNN). A Datafolha 20/Jun deu 2% no 1T e 2T Lula 48% × Zema 39%. Sem Flávio, a Futura/Apex dá Zema 13.3%. Prometeu anunciar o vice nesta semana (Estadão).",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Zema subiu de leve a 1.20% (↑0.05pp, vol USD 4.0M) mas recuou no sub-mercado de 3º lugar (10.5%, vinha de 13%, ultrapassado por Caiado). A BTG/Nexus 29/Jun o deu a 3% no 1T. A PoderData o pôs em empate técnico com Lula no 2º turno, mas na disputa bipolarizada com Flávio o Novo não encontra tração. No cenário sem Flávio, a Futura/Apex dá Zema 13.3%, fôlego latente. Prometeu anunciar o vice nesta semana (Estadão). STF impeach 2.90%."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.15%",
    poll: "Tarcísio presidencial 0.15% Poly estável (vol USD ~13M acumulado, o maior do mercado, anomalia de legado). As nacionais não destacam Tarcísio no presidencial nacional (foco reeleição SP). Nova pesquisa testa Tarcísio × Haddad pelo governo de SP (VEJA), com Haddad confirmando França como vice no PT. Mantida Vox SP 30/Mai 2T estadual Tarcísio 48.3% × Haddad 36.5% (Poder360).",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Tarcísio segue focado na reeleição em SP, onde lidera, e o mercado mantém o presidencial em 0.15% (anomalia de legado, volume herdado de apostas antigas, o maior do book a USD 13M). A disputa por SP segue acirrada (nova pesquisa Tarcísio × Haddad, VEJA), com Haddad confirmando França como vice (Folha). No mercado de Senado por número de cadeiras, o PL segue na liderança (75.5%, ↓1pp), sinal de capilaridade institucional da legenda. STF impeach 2.90%."
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
