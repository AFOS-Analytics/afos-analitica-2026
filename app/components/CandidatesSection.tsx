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
    polymarket: "50.50%",
    poll: "Lula recua de leve no platô do ciclo: Poly 50.50% (↓1.00pp, vol USD 6.51M acumulado), com o gap sobre Flávio em +26.45pp, recorde renovado pela queda maior do adversário. Sem pesquisa nacional nova em 17/Jun, o pano de fundo das urnas segue o das três nacionais de 15-16/Jun: CNT/MDA (n=2.002, campo 10-14/Jun, BR-04256/2026) 2T 49.3% × 36.8% (gap +12.5pp), o maior do recorte; Futura/Apex 2T 48.1% × 42.9%; BTG/Nexus 2T 49% × 43% (aprovação 48% × 47%). Próximo teste: a Datafolha 19/Jun, com Aécio Neves e Joaquim Barbosa (G1).",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTOS 17/Jun D+34: sem pesquisa nova, dia de movimento de mercado. Lula recuou a 50.50% (↓1.00pp) e Flávio caiu mais, a 24.05% (↓1.30pp), abrindo o gap a +26.45pp, recorde renovado. O pano de fundo das urnas segue favorável, com três nacionais de 15-16/Jun (CNT/MDA, Futura/Apex e BTG/Nexus) todas com Lula ampliando. Na política, Lula reagiu a Trump, que chamou o cenário brasileiro de perigoso ('não se meta nas eleições do Brasil', BBC, G1). Volume total no presidencial USD 101.2M. STF impeach 3.60% (vol baixo)."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "24.05%",
    poll: "Flávio recua mais que Lula em Poly 24.05% (↓1.30pp, vol USD 6.68M acumulado), com o gap para o presidente em +26.45pp, recorde do ciclo. Sem pesquisa nova, o pano de fundo das urnas segue adverso: CNT/MDA 16/Jun 1T 28.2% (gap -13.6pp); 2T 36.8% (perde 49.3% × 36.8%), o pior 2º turno do recorte; a Futura/Apex é mais branda (2T 42.9%, gap -5.2pp). Para virar a página do caso 'Dark Horse', prepara um plano de segurança pública (Folha). O PL só pretende oficializar a candidatura no fim de julho em SP (Gazeta do Povo).",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 17/Jun: Flávio recuou a 24.05% (↓1.30pp), com o gap para Lula no recorde do ciclo (+26.45pp). Para retomar a iniciativa, prepara um plano de segurança pública para virar a página do caso 'Dark Horse' (Folha), enquanto o atrito interno persiste (Zema diz ter mais restrições a Lula do que a Flávio, G1). No caso Master, uma senadora pediu CPI para investigar o banco e o BMG (InfoMoney); a relatoria no STF segue com Mendonça (Agência Brasil). STF impeach sobe a 3.60% (↑0.35pp)."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "15.75%",
    poll: "Renan presidencial Poly 15.75% (↑1.70pp, vol USD 7.18M acumulado), sobe pela 3ª vez na semana e consolida o posto de favorito ao 3º lugar do 1º turno (53.5% no sub-mercado, ↑6pp), com o maior volume acumulado do mercado presidencial. Com a nova alta, a divergência mercado × pesquisa abre para ~13.8pp (15.75% × 2% da CNT/MDA 16/Jun), a maior do dashboard. O noticiário resume o paradoxo: Renan cresce, mas não ameaça (Notícias Tudo Aqui), o mercado precifica conversão futura sem lastro nas urnas.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "17/Jun: Renan subiu pela 3ª vez na semana, a 15.75% (↑1.70pp), consolidando o posto de favorito ao 3º lugar do 1º turno (53.5%, ↑6pp) e reabrindo a divergência ante a CNT/MDA (2% no 1T) para ~13.8pp, a maior do dashboard. O 'paradoxo da direita' (G1) reforça que nenhum nome anti-Lula converteu a fraqueza de Flávio em voto. Sinal a monitorar: a Datafolha 19/Jun, que confirme ou não o patamar de 2-3% no 1T. STF impeach 3.60%."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "1.85%",
    poll: "Haddad recua de leve a Poly 1.85% (↓0.10pp, vol USD 5.77M acumulado), empatado com Camilo Santana (1.85%) como nome do PT depois de Lula no mercado presidencial. CNT/MDA e Futura/Apex 16/Jun não listam Haddad no presidencial nacional (foco SP). Mantida Vox SP 30/Mai 2T estadual Tarcísio 48.3% × Haddad 36.5% (Poder360).",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Haddad segue como nome do PT depois de Lula no mercado presidencial (1.85%, ↓0.10pp, empatado com Camilo Santana 1.85%). Como ministro da Fazenda, no centro da disputa do PIX/tarifaço e do INSS, mas o mercado não precifica candidatura presidencial dele. A aprovação do governo segue acima da desaprovação (Nexus 48% × 47%), reforço da gestão econômica em que ele é peça central. STF impeach 3.60%."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1.95%",
    poll: "Caiado estável em Poly 1.95% (vol USD 4.13M acumulado), segue no piso da 3ª via. CNT/MDA 16/Jun: 1T Caiado 4%, à frente da 3ª via com Flávio na disputa; e a Futura/Apex, num cenário SEM Flávio, dá Caiado 16.5% (lidera a 3ª via). Caiado domina entre os bolsonaristas em recorte da Quaest (Jornal Opção): é o nome posicionado para herdar o voto da direita se Flávio não for.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "Caiado ficou estável a 1.95% (vol USD 4.13M), seguindo no piso das apostas: o mercado precifica baixa a hipótese de Flávio sair da disputa. No cenário sem Flávio, a Futura/Apex 16/Jun dá Caiado 16.5%, sinal de quanto voto da direita está represado em Flávio. No cenário com Flávio, o 'paradoxo da direita' (G1) explica o teto. A Datafolha 19/Jun, que passa a testar Aécio e Joaquim Barbosa (G1), acirra a disputa pelo mesmo nicho. STF impeach 3.60%."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "1.45%",
    poll: "Zema sobe de leve a Poly 1.45% (↑0.10pp, vol USD 3.71M), mas segue no piso da 3ª via. CNT/MDA 16/Jun: 1T Zema 2.8% (com Flávio); sem Flávio, a Futura/Apex dá Zema 13.3% (2º da 3ª via, atrás de Caiado). Zema diz ter mais restrições a Lula do que a Flávio após a troca de críticas na direita (G1), atrito que expõe a dificuldade de convergência da direita. O Novo se equilibra entre a candidatura de Zema e alianças com o PL nos estados.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Zema subiu de leve a 1.45% (↑0.10pp), mas a 3ª via segue sem tração na disputa bipolarizada Lula × Flávio. No cenário sem Flávio, a Futura/Apex 16/Jun dá Zema 13.3%, fôlego latente. Zema diz ter mais restrições a Lula do que a Flávio após a troca de críticas na direita (G1), sinal do atrito que dificulta qualquer convergência da oposição. STF impeach 3.60%."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.15%",
    poll: "Tarcísio presidencial 0.15% Poly estável (vol USD ~12.7M acumulado, o maior do mercado, anomalia de legado). CNT/MDA e Futura/Apex 16/Jun não destacam Tarcísio no presidencial nacional (foco reeleição SP). Mantida Vox SP 30/Mai 2T estadual Tarcísio 48.3% × Haddad 36.5% (Poder360).",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Tarcísio segue focado na reeleição em SP, onde lidera, e o mercado mantém o presidencial em 0.15% (anomalia de legado, volume herdado de apostas antigas, o maior do book a USD 12.7M). No mercado de Senado por número de cadeiras, o PL lidera com folga (75%, ↑2pp), sinal de capilaridade institucional da legenda. STF impeach 3.60%."
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
