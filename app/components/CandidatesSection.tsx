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
    poll: "Lula recua pelo 2º dia: Poly 55.50% (↓1.00pp, vol USD 7.1M acumulado), com o gap sobre Flávio se estreitando a +31.55pp (↓1.40pp), agora 3.70pp abaixo do recorde de +35.25pp (28/Jun), a 96 dias do 1º turno. O recuo acompanha a repercussão da BTG/Nexus 29/Jun (n=2.009), que deu 1T Lula 42% × Flávio 34% e 2T 47% × 44% (empate técnico). A imprensa detalhou os recortes: Lula mantém o Nordeste mas oscila ~5pp para baixo na região após a operação contra Jaques Wagner (Jamildo), e abre 29pp entre idosos (viva.com.br). Aprovação em empate (48% × 48%, BTG/Nexus). Lula mantém a folga, mas o dinheiro real continua se aproximando da pesquisa.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTOS 30/Jun D+47: a 96 dias do 1º turno, 2º dia seguido de convergência. Lula recuou (55.50%, ↓1.00pp) e o gap estreitou a +31.55pp (↓1.40pp), longe do recorde de +35.25pp, na esteira da repercussão da BTG/Nexus 29/Jun (2T 47×44, empate técnico). Recortes regionais: Lula mantém o Nordeste mas oscila 5pp para baixo pós-operação Wagner (Jamildo); antipetismo complica o 2º turno (Gazeta do Povo). Aprovação em empate (48% × 48%), rejeição 49%. Liberou R$ 520 mi para propaganda antes da eleição (Folha). O caso Master segue aberto (Dark Horse à PGR com Mendonça), STF impeach a 2.65% (↓0.25pp). AtlasIntel nacional adiada p/ 01/Jul. Volume no presidencial acima de USD 107M."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "23.95%",
    poll: "Flávio sobe pelo 2º dia: Poly 23.95% (↑0.40pp, vol USD 7.1M acumulado), estreitando o gap para Lula a +31.55pp (↓1.40pp), longe do recorde de +35.25pp. A repercussão da BTG/Nexus 29/Jun o consolidou como principal adversário: lidera no Sul e no Norte/Centro-Oeste e tem 60% entre evangélicos (comunhao.com.br, Brasil 61). A reunião com Milei segue repercutindo (Milei desistiu de ir à Cúpula do Mercosul onde está Lula, BPMoney). Amplia o 2º lugar do 1º turno (78.5%, estável), mas a PF concluiu que ele caluniou Lula nas redes (Rondônia Dinâmica) e a rejeição segue a maior do páreo (BTG/Nexus 51%).",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 30/Jun: Flávio SOBE no mercado pelo 2º dia (23.95%, ↑0.40pp) e o gap para Lula estreitou a +31.55pp (↓1.40pp), na esteira da repercussão da BTG/Nexus 29/Jun (1T 34%; 2T 44%, empate técnico). Recortes a favor: lidera no Sul e Norte/CO e 60% entre evangélicos (Brasil 61, comunhao.com.br). A reunião com Milei seguiu rendendo (Milei desistiu do Mercosul onde está Lula, BPMoney). Mas a PF concluiu que ele caluniou Lula nas redes (Rondônia Dinâmica), a crise com Michelle surpreendeu a campanha pelo impacto do vídeo (Metrópoles), e a rejeição segue a maior do páreo (51%). STF impeach a 2.65%. AtlasIntel de 01/Jul medirá o impacto da crise Michelle × Flávio."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "12.45%",
    poll: "Renan presidencial Poly 12.45% (↓0.10pp, vol USD 7.6M acumulado) no mercado de vencedor, mas amplia o favoritismo ao 3º lugar do 1º turno a 57% no sub-mercado (↑3.5pp), com folga sobre Caiado (18.5%) e Zema (9.5%), seguindo com o maior volume acumulado do presidencial. A BTG/Nexus 29/Jun e a PoderData/Aya deram Renan 4% no 1º turno; as demais nacionais o medem em 2-3%, mantendo a divergência do dashboard a ~8.45pp. Chamou Flávio de corrupto e atacou Lula (Portal Arauto); aposta em vaquinha, base do MBL e Faria Lima sem máquina partidária (Estadão).",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "30/Jun: Renan ESTÁVEL no vencedor (12.45%, ↓0.10pp) mas ampliou o favoritismo ao 3º lugar do 1º turno (57%, ↑3.5pp), com folga sobre Caiado (18.5%) e Zema (9.5%). As pesquisas o medem a ~4% no 1T (BTG/Nexus 4%, PoderData/Aya 4%), mantendo a divergência mais larga do dashboard a ~8.45pp. A aposta em vaquinha, MBL e Faria Lima (Estadão) confirma a ausência de máquina partidária. A 96 dias, com a 3ª via no piso e a crise na família Bolsonaro, o espaço anti-Lula segue em disputa. A leitura segue: provável 3º colocado, sem chance real de vencer (capital de nicho, dependente do tropeço alheio). STF impeach 2.65%."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0.95%",
    poll: "Haddad recua de leve a Poly 0.95% (↓0.10pp, vol USD 6.0M acumulado) como nome do PT depois de Lula no mercado presidencial. As nacionais não testam Haddad no presidencial nacional (foco governo de SP). Confirmou Márcio França (PSB) como vice na chapa pelo governo de SP, com Tebet e Marina cogitados para o Senado (Folha, Brasil de Fato), consolidando a aliança de centro-esquerda no estado. A Datafolha divulga pesquisa presidencial/governo/Senado em SP a partir de domingo 05/Jul (G1).",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Haddad recua de leve a 0.95%, como nome do PT depois de Lula. O mercado não precifica candidatura presidencial dele; o foco é estadual. Confirmou França vice na chapa de SP, com Tebet/Marina ao Senado (Folha, Brasil de Fato). A Datafolha divulga pesquisa presidencial/governo/Senado em SP a partir de domingo 05/Jul (G1). A um mês das convenções, os presidenciáveis negociam vice (G1). STF impeach 2.65%."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1.55%",
    poll: "Caiado SOBE a Poly 1.55% (↑0.30pp, vol USD 4.5M acumulado), saindo do piso da 3ª via, e mantém o 2º lugar no sub-mercado de 3º lugar do 1º turno (18.5%, ↑0.5pp). Novidade do dia: deve oficializar Gilberto Kassab (PSD) como vice em chapa pura do PSD à Presidência nesta quarta (01/Jul, coletiva 11h em Brasília) (CartaCapital, Folha, G1), e disse que a centro-direita não tem 'nome universal' para concorrer (G1). A BTG/Nexus 29/Jun deu Caiado 5% no 1T, o melhor da 3ª via; a PoderData/Aya 25/Jun o pôs em empate técnico com Lula no 2º turno (Poder360, CNN). Num cenário SEM Flávio, a Futura/Apex dá Caiado 16.5% (lidera a 3ª via). É o nome posicionado para herdar o voto da direita se Flávio não for.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "Caiado SOBE a 1.55% (↑0.30pp, vol USD 4.5M), saindo do piso, e mantém o 2º lugar no sub-mercado de 3º lugar do 1º turno (18.5%, ↑0.5pp). FATO NOVO: deve oficializar Kassab (PSD) como vice em chapa pura do PSD à Presidência nesta quarta (01/Jul) (CartaCapital, Folha, G1), e afirmou que a centro-direita não tem 'nome universal' para concorrer (G1). A BTG/Nexus 29/Jun o deu a 5% no 1T (melhor da 3ª via) e a PoderData o pôs em empate técnico com Lula no 2º turno, sinal de competitividade no cenário sem Flávio (Futura 16.5%). No cenário com Flávio, o 'paradoxo da direita' (G1) explica o teto. STF impeach 2.65%."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "1.05%",
    poll: "Zema recua a Poly 1.05% (↓0.15pp, vol USD 4.0M) e perde terreno no sub-mercado de 3º lugar do 1º turno (9.5%, ↓1.0pp, ultrapassado por Caiado a 18.5%). A BTG/Nexus 29/Jun deu Zema 3% no 1T. A PoderData/Aya 25/Jun o pôs em empate técnico com Lula no 2º turno (CNN). A Datafolha 20/Jun deu 2% no 1T e 2T Lula 48% × Zema 39%. Sem Flávio, a Futura/Apex dá Zema 13.3%. Prometeu anunciar o vice nesta semana (Estadão).",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Zema recuou a 1.05% (↓0.15pp, vol USD 4.0M) e perdeu terreno no sub-mercado de 3º lugar (9.5%, ↓1.0pp, ultrapassado por Caiado a 18.5%). A BTG/Nexus 29/Jun o deu a 3% no 1T. A PoderData o pôs em empate técnico com Lula no 2º turno, mas na disputa bipolarizada com Flávio o Novo não encontra tração. No cenário sem Flávio, a Futura/Apex dá Zema 13.3%, fôlego latente. Prometeu anunciar o vice nesta semana (Estadão). STF impeach 2.65%."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.15%",
    poll: "Tarcísio presidencial 0.15% Poly estável (vol USD ~13M acumulado, o maior do mercado, anomalia de legado). As nacionais não destacam Tarcísio no presidencial nacional (foco reeleição SP). A Datafolha divulga pesquisa presidencial/governo/Senado em SP a partir de domingo 05/Jul (G1), com Haddad confirmando França como vice no PT. Mantida Vox SP 30/Mai 2T estadual Tarcísio 48.3% × Haddad 36.5% (Poder360).",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Tarcísio segue focado na reeleição em SP, onde lidera, e o mercado mantém o presidencial em 0.15% (anomalia de legado, volume herdado de apostas antigas, o maior do book a USD 13M). A disputa por SP ganha um teste a partir de domingo 05/Jul (Datafolha presidencial/governo/Senado, G1), com Haddad confirmando França como vice (Folha). No mercado de Senado por número de cadeiras, o PL segue na liderança (75.5%, estável), sinal de capilaridade institucional da legenda. STF impeach 2.65%."
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
