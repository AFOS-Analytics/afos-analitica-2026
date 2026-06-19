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
    polymarket: "51.50%",
    poll: "Lula AVANÇA no platô do ciclo: Poly 51.50% (↑1.00pp, vol USD 6.56M acumulado), reabrindo o gap sobre Flávio a +25.75pp, ainda abaixo do recorde de 17/Jun (+26.45pp). Sem pesquisa nacional nova em 19/Jun (a Datafolha foi adiada para sábado 20/Jun), o pano de fundo das urnas segue o das três nacionais de 15-16/Jun: CNT/MDA (n=2.002, campo 10-14/Jun, BR-04256/2026) 2T 49.3% × 36.8% (gap +12.5pp), o maior do recorte; Futura/Apex 2T 48.1% × 42.9%; BTG/Nexus 2T 49% × 43% (aprovação 48% × 47%). Próximo teste: a Datafolha (Aécio, Joaquim Barbosa) sábado 20/Jun (Folha).",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTOS 19/Jun D+36: sem pesquisa nova, dia de mercado na contramão da pressão política. Lula AVANÇOU a 51.50% (↑1.00pp) e o gap reabriu a +25.75pp, mesmo no dia em que o caso Master mais pressiona o governo: a nova fase da PF escalou contra Jaques Wagner, líder do governo no Senado, e Lula já espera a renúncia dele da liderança (Folha); a investigação aproxima o escândalo do Planalto (BBC) e reduz a chance da indicação de Messias ao STF (Folha). O mercado leu a renúncia esperada como contenção, não dano. Volume total no presidencial USD 101.9M. STF impeach volta a 3.60% (↑1.15pp)."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "25.75%",
    poll: "Flávio recua de leve em Poly 25.75% (↓0.20pp, vol USD 6.75M acumulado), com o gap para o presidente reabrindo a +25.75pp pela alta de Lula. Sem pesquisa nova, o pano de fundo das urnas segue adverso: CNT/MDA 16/Jun 1T 28.2% (gap -13.6pp); 2T 36.8% (perde 49.3% × 36.8%), o pior 2º turno do recorte; a Futura/Apex é mais branda (2T 42.9%, gap -5.2pp). No dia, com o caso Master agora respingando no governo (Wagner), a campanha pediu CAUTELA na resposta para não soar oportunista (Folha). Segue isolado na frente do 2º lugar do 1º turno (69.5%).",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 19/Jun: Flávio recuou de leve a 25.75% (↓0.20pp), com o gap para Lula reabrindo a +25.75pp pela alta do presidente. O caso Master ESCALOU contra o governo (PF mira Wagner, Lula espera renúncia dele, Folha), e a campanha de Flávio pediu CAUTELA na resposta, para não soar oportunista num caso em que ele próprio é alvo (Folha). O mercado NÃO premiou a oposição: Flávio recuou e Lula subiu. Zema negou proximidade com Flávio e reacendeu a briga na direita (Estadão). STF impeach volta a 3.60% (↑1.15pp)."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "14.15%",
    poll: "Renan presidencial Poly 14.15% (↓0.40pp, vol USD 7.25M acumulado) no mercado de vencedor, MAS dispara no posto de favorito ao 3º lugar do 1º turno (54.5% no sub-mercado, ↑8pp), ainda com o maior volume acumulado do presidencial. A divergência mercado × pesquisa segue a maior do dashboard, em ~12.15pp (14.15% × 2% da CNT/MDA 16/Jun). Sinal dividido: o mercado o crava como provável 3º colocado, mas sem chance real de vencer. A Times Brasil/CNBC resume o quadro: a terceira via não decola (Vinícius Torres Freire).",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "19/Jun: Renan deu sinal dividido — recuou de leve no vencedor (14.15%, ↓0.40pp), mas o mercado o RECRAVOU como favorito ao 3º lugar do 1º turno (54.5%, ↑8pp), revertendo o recuo de ontem. A divergência ante a CNT/MDA (2% no 1T) segue a maior do dashboard, em ~12.15pp. A leitura é de um mercado que o precifica como provável 3º colocado, mas sem chance real de vencer. A Times Brasil reforça que a 3ª via não decola. Sinal a monitorar: a Datafolha 20/Jun, que confirme ou não o patamar de 2-3% no 1T. STF impeach 3.60%."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "1.95%",
    poll: "Haddad sobe de leve a Poly 1.95% (↑0.10pp, vol USD 5.81M acumulado), à frente de Camilo Santana (1.75%) como nome do PT depois de Lula no mercado presidencial. CNT/MDA e Futura/Apex 16/Jun não listam Haddad no presidencial nacional (foco SP). No dia, comentou o caso Wagner com tom institucional ('a lei tem que ser aplicada independentemente de torcida', Folha). Mantida Vox SP 30/Mai 2T estadual Tarcísio 48.3% × Haddad 36.5% (Poder360).",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Haddad sobe de leve a 1.95% (↑0.10pp), à frente de Camilo Santana (1.75%), como nome do PT depois de Lula. Como ministro da Fazenda, no centro do PIX/tarifaço e do INSS, mas o mercado não precifica candidatura presidencial dele. A escalada da PF no caso Master alcançou Jaques Wagner, líder do governo no Senado, com Lula esperando a renúncia dele (Folha), o que pressiona a articulação do PT no Congresso. Haddad comentou o caso com tom institucional (Folha). A aprovação do governo segue acima da desaprovação (Nexus 48% × 47%). STF impeach 3.60%."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "2.35%",
    poll: "Caiado sobe de leve a Poly 2.35% (↑0.15pp, vol USD 4.21M acumulado), ainda no piso da 3ª via. CNT/MDA 16/Jun: 1T Caiado 4%, à frente da 3ª via com Flávio na disputa; e a Futura/Apex, num cenário SEM Flávio, dá Caiado 16.5% (lidera a 3ª via). Disse que Flávio 'perdeu a chance' de vencer Lula (G1). Caiado domina entre os bolsonaristas em recorte da Quaest (Jornal Opção): é o nome posicionado para herdar o voto da direita se Flávio não for.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "Caiado subiu de leve a 2.35% (↑0.15pp, vol USD 4.21M), ainda no piso das apostas: o mercado precifica baixa a hipótese de Flávio sair da disputa. No cenário sem Flávio, a Futura/Apex 16/Jun dá Caiado 16.5%, sinal de quanto voto da direita está represado em Flávio. No cenário com Flávio, o 'paradoxo da direita' (G1) explica o teto, e a Times Brasil reforça que a 3ª via não decola. A Datafolha 20/Jun, que passa a testar Aécio e Joaquim Barbosa (Folha), acirra a disputa pelo mesmo nicho. STF impeach 3.60%."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "1.45%",
    poll: "Zema fica estável a Poly 1.45% (vol USD 3.74M), segue no piso da 3ª via. No dia, NEGOU proximidade com Flávio e reacendeu a briga na direita (Estadão), atrito que dificulta a convergência da oposição. CNT/MDA 16/Jun: 1T Zema 2.8% (com Flávio); sem Flávio, a Futura/Apex dá Zema 13.3% (2º da 3ª via, atrás de Caiado). O Novo se equilibra entre a candidatura de Zema e alianças com o PL nos estados.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Zema ficou estável a 1.45%, e a 3ª via segue sem tração na disputa bipolarizada Lula × Flávio. No dia, NEGOU proximidade com Flávio e reacendeu a briga na direita (Estadão), sinal do atrito do Novo com o bolsonarismo justamente quando o campo tentaria se unificar. No cenário sem Flávio, a Futura/Apex 16/Jun dá Zema 13.3%, fôlego latente. STF impeach 3.60%."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.15%",
    poll: "Tarcísio presidencial 0.15% Poly estável (vol USD ~12.7M acumulado, o maior do mercado, anomalia de legado). CNT/MDA e Futura/Apex 16/Jun não destacam Tarcísio no presidencial nacional (foco reeleição SP). Mantida Vox SP 30/Mai 2T estadual Tarcísio 48.3% × Haddad 36.5% (Poder360).",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Tarcísio segue focado na reeleição em SP, onde lidera, e o mercado mantém o presidencial em 0.15% (anomalia de legado, volume herdado de apostas antigas, o maior do book a USD 12.8M). No mercado de Senado por número de cadeiras, o PL segue na liderança (77.5%), sinal de capilaridade institucional da legenda. STF impeach 3.60%."
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
