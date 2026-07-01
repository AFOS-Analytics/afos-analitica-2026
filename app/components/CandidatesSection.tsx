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
    poll: "Lula reafirma a dominância: Poly 57.50% (↑2.00pp, vol USD 7.1M acumulado), com o gap sobre Flávio voltando a alargar a +34.55pp (↑3.00pp), agora a apenas 0.70pp do recorde de +35.25pp (28/Jun), a 95 dias do 1º turno. O movimento reverte os dois dias de convergência e desta vez é acompanhado pela pesquisa: a AtlasIntel nacional 01/Jul (n=5.000) deu Lula ampliando (1T 46.3% × 36.6%; 2T 48.8% × 42.3%), com Flávio caindo 5.7pp no 2º turno em meio à crise com Michelle. Aprovação Atlas online pior (aprova 45.9% × desaprova 52.3%) que o platô das presenciais (48% × 48%). Dinheiro real e pesquisa apontam para o mesmo lado.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTOS 01/Jul D+48: a 95 dias do 1º turno, reversão da convergência. Lula subiu (57.50%, ↑2.00pp) e o gap voltou a +34.55pp (↑3.00pp), a 0.70pp do recorde de +35.25pp, acompanhado pela AtlasIntel nacional (1T 46.3×36.6; 2T 48.8×42.3, Flávio -5.7pp no 2T). Ressalvas: aprovação online Atlas pior (desaprova 52.3%), Reuters aponta afastamento da Geração Z (Blog do BG), e parte das presenciais ainda vê 2º turno apertado (no DF 41×40, Poder360). Rejeição 49%. Liberou R$ 520 mi para propaganda antes da eleição (Folha). Convenções começam em 20/Jul. STF impeach a 2.75% (↑0.10pp). Volume no presidencial acima de USD 107M."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "22.95%",
    poll: "Flávio cede pelo dia: Poly 22.95% (↓1.00pp, vol USD 7.2M acumulado), com o gap para Lula voltando a alargar a +34.55pp (↑3.00pp), perto do recorde de +35.25pp. A AtlasIntel 01/Jul o deu caindo 5.7pp no 2º turno (2T 42.3%, 1T 36.6%) em meio à crise com Michelle: o vídeo dela e a disputa por apoio no Ceará escalaram a guerra interna (BBC), e Flávio repudiou fala de aliado sobre 'mulher votar mal' (Folha). Ainda assim amplia o 2º lugar do 1º turno (82.5%, ↑4.00pp), adversário certo, mas a PF concluiu que ele caluniou Lula nas redes (Rondônia Dinâmica) e a rejeição segue a maior do páreo (BTG/Nexus 51%).",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 01/Jul: Flávio CEDE no mercado (22.95%, ↓1.00pp) e o gap para Lula voltou a +34.55pp (↑3.00pp), perto do recorde, na esteira da AtlasIntel (caindo 5.7pp no 2º turno, 2T 42.3%) e da crise familiar. O vídeo de Michelle e a briga por apoio no Ceará escalaram o conflito (BBC), e ele repudiou fala de aliado sobre 'mulher votar mal' (Folha). Amplia o 2º lugar do 1º turno (82.5%, ↑4.00pp), adversário certo, mas a PF concluiu calúnia contra Lula (Rondônia Dinâmica) e a rejeição segue a maior do páreo (51%). STF impeach a 2.75%. Próximo teste: Datafolha SP a partir de 05/Jul."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "10.45%",
    poll: "Renan presidencial Poly 10.45% (↓2.00pp, vol USD 7.7M acumulado) no mercado de vencedor, mas DISPARA no sub-mercado de 3º lugar do 1º turno a 65% (↑8.00pp), com folga sobre Caiado (14%) e Zema (8.5%), seguindo com o maior volume acumulado do presidencial. A BTG/Nexus 29/Jun e a PoderData/Aya deram Renan 4% no 1º turno; as demais nacionais o medem em 2-3%, e a divergência do dashboard estreita a ~6.45pp. Chamou Flávio de corrupto e atacou Lula (Portal Arauto); aposta em vaquinha, base do MBL e Faria Lima sem máquina partidária (Estadão).",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "01/Jul: Renan CEDEU no vencedor (10.45%, ↓2.00pp) mas DISPAROU no favoritismo ao 3º lugar do 1º turno (65%, ↑8.00pp), com folga sobre Caiado (14%) e Zema (8.5%). As pesquisas o medem a ~4% no 1T (BTG/Nexus 4%, PoderData/Aya 4%), e a divergência do dashboard estreitou a ~6.45pp. A aposta em vaquinha, MBL e Faria Lima (Estadão) confirma a ausência de máquina partidária. A 95 dias, com a 3ª via no piso e a crise na família Bolsonaro, o espaço anti-Lula segue em disputa. A leitura segue: provável 3º colocado, sem chance real de vencer (capital de nicho, dependente do tropeço alheio). STF impeach 2.75%."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0.95%",
    poll: "Haddad estável a Poly 0.95% (vol USD 6.0M acumulado) como nome do PT depois de Lula no mercado presidencial. As nacionais não testam Haddad no presidencial nacional (foco governo de SP). Confirmou Márcio França (PSB) como vice na chapa pelo governo de SP, com Tebet e Marina cogitados para o Senado (Folha, Brasil de Fato), consolidando a aliança de centro-esquerda no estado. A Datafolha divulga pesquisa presidencial/governo/Senado em SP a partir de domingo 05/Jul (G1).",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Haddad estável a 0.95%, como nome do PT depois de Lula. O mercado não precifica candidatura presidencial dele; o foco é estadual. Confirmou França vice na chapa de SP, com Tebet/Marina ao Senado (Folha, Brasil de Fato). A Datafolha divulga pesquisa presidencial/governo/Senado em SP a partir de domingo 05/Jul (G1). A um mês das convenções (que começam em 20/Jul), os presidenciáveis negociam vice (G1). STF impeach 2.75%."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1.35%",
    poll: "Caiado CEDE a Poly 1.35% (↓0.20pp, vol USD 4.5M acumulado) e perde o 2º lugar no sub-mercado de 3º lugar do 1º turno (14%, ↓4.5pp, ultrapassado por Renan a 65%), mesmo no dia da oficialização. FATO CONSUMADO: OFICIALIZOU Gilberto Kassab (PSD) como vice em chapa pura do PSD à Presidência e disse que Flávio perderia para Lula no 2º turno (Folha, G1), e afirmou que a centro-direita não tem 'nome universal' para concorrer (G1). A BTG/Nexus 29/Jun deu Caiado 5% no 1T, o melhor da 3ª via; a PoderData/Aya 25/Jun o pôs em empate técnico com Lula no 2º turno (Poder360, CNN). Num cenário SEM Flávio, a Futura/Apex dá Caiado 16.5% (lidera a 3ª via). É o nome posicionado para herdar o voto da direita se Flávio não for.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "Caiado CEDE a 1.35% (↓0.20pp, vol USD 4.5M) e perde o 2º lugar no sub-mercado de 3º lugar do 1º turno (14%, ↓4.5pp, ultrapassado por Renan a 65%), mesmo no dia da oficialização. FATO CONSUMADO: OFICIALIZOU Kassab (PSD) como vice em chapa pura do PSD à Presidência e disse que Flávio perderia para Lula no 2º turno (Folha, G1), afirmando que a centro-direita não tem 'nome universal' (G1). A BTG/Nexus 29/Jun o deu a 5% no 1T (melhor da 3ª via) e a PoderData o pôs em empate técnico com Lula no 2º turno, sinal de competitividade no cenário sem Flávio (Futura 16.5%). No cenário com Flávio, o 'paradoxo da direita' (G1) explica o teto. STF impeach 2.75%."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "1.15%",
    poll: "Zema sobe de leve a Poly 1.15% (↑0.10pp, vol USD 4.1M) mas recua no sub-mercado de 3º lugar do 1º turno (8.5%, ↓1.0pp, atrás de Renan a 65% e Caiado a 14%). A BTG/Nexus 29/Jun deu Zema 3% no 1T. A PoderData/Aya 25/Jun o pôs em empate técnico com Lula no 2º turno (CNN). A Datafolha 20/Jun deu 2% no 1T e 2T Lula 48% × Zema 39%. Sem Flávio, a Futura/Apex dá Zema 13.3%. Prometeu anunciar o vice (Estadão).",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Zema subiu de leve a 1.15% (↑0.10pp, vol USD 4.1M) mas recuou no sub-mercado de 3º lugar (8.5%, ↓1.0pp, atrás de Renan a 65% e Caiado a 14%). A BTG/Nexus 29/Jun o deu a 3% no 1T. A PoderData o pôs em empate técnico com Lula no 2º turno, mas na disputa bipolarizada com Flávio o Novo não encontra tração. No cenário sem Flávio, a Futura/Apex dá Zema 13.3%, fôlego latente. Prometeu anunciar o vice (Estadão). STF impeach 2.75%."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.15%",
    poll: "Tarcísio presidencial 0.15% Poly estável (vol USD ~13.2M acumulado, o maior do mercado, anomalia de legado). As nacionais não destacam Tarcísio no presidencial nacional (foco reeleição SP). A Datafolha divulga pesquisa presidencial/governo/Senado em SP a partir de domingo 05/Jul (G1), com Haddad confirmando França como vice no PT. Mantida Vox SP 30/Mai 2T estadual Tarcísio 48.3% × Haddad 36.5% (Poder360).",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Tarcísio segue focado na reeleição em SP, onde lidera, e o mercado mantém o presidencial em 0.15% (anomalia de legado, volume herdado de apostas antigas, o maior do book a USD 13.2M). A disputa por SP ganha um teste a partir de domingo 05/Jul (Datafolha presidencial/governo/Senado, G1), com Haddad confirmando França como vice (Folha). No mercado de Senado por número de cadeiras, o PL segue na liderança (74.5%, ↓1.00pp), sinal de capilaridade institucional da legenda. STF impeach 2.75%."
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
