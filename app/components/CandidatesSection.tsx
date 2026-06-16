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
    poll: "Lula mantém o pico do ciclo: Poly 51.50% (estável, vol USD 6.50M acumulado), com o gap sobre Flávio em +26.15pp, recorde renovado. Duas nacionais novas 16/Jun confirmam: CNT/MDA (n=2.002, campo 10-14/Jun, BR-04256/2026) 1T 41.8% × 28.2% (gap +13.6pp); 2T 49.3% × 36.8% (gap +12.5pp), o maior do recorte. Futura/Apex (n=2.000, campo 08-12/Jun) 1T 41.6% × 34.1%; 2T 48.1% × 42.9%. Com a BTG/Nexus 15/Jun, são três nacionais em dois dias na mesma direção. Próximo teste: a Datafolha 19/Jun, com Aécio Neves e Joaquim Barbosa (G1).",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTOS 16/Jun D+33: duas nacionais novas consolidaram Lula ampliando. A CNT/MDA deu 2T 49.3% × 36.8% (gap +12.5pp), o maior do recorte; a Futura/Apex, 2T 48.1% × 42.9%. O mercado segue no pico a 51.50% (estável) e abriu o gap para Flávio a +26.15pp, recorde renovado. Ponto de convergência inédito: o gap de mercado (+26.15pp, win-prob) ficou pela 1ª vez próximo do gap de 2º turno de uma pesquisa (CNT/MDA +12.5pp, vote share). Volume total no presidencial USD 100.63M. STF impeach 3.25% (vol baixo)."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "25.35%",
    poll: "Flávio recua de leve em Poly 25.35% (↓0.20pp, vol USD 6.70M acumulado), com o gap para Lula em +26.15pp, recorde do ciclo. As duas nacionais novas pioram o quadro: CNT/MDA 16/Jun 1T 28.2% (gap -13.6pp); 2T 36.8% (perde 49.3% × 36.8%), o pior 2º turno do recorte. A Futura/Apex é mais branda (2T 42.9%, gap -5.2pp). No institucional, a PGR rejeitou a 2ª proposta de delação de Vorcaro (Metrópoles) e o ministro André Mendonça assumiu o caso Master no STF (ICL Notícias). O PL só pretende oficializar a candidatura no fim de julho em SP (Gazeta do Povo).",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 16/Jun: as duas nacionais novas mostram Flávio em desvantagem ampliada, com a CNT/MDA dando o pior 2º turno do recorte (36.8%, gap -12.5pp). No institucional, a PGR rejeitou a 2ª proposta de delação de Vorcaro (Metrópoles) e o ministro André Mendonça assumiu o caso Master no STF (ICL Notícias), e a CPI escancara repasse de R$ 11 milhões do Master a ex-ministro de Bolsonaro (Brasil 247). No mercado, Flávio recuou a 25.35% (↓0.20pp), com o gap para Lula no recorde do ciclo (+26.15pp). STF impeach 3.25%."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "14.05%",
    poll: "Renan presidencial Poly 14.05% (↑2.40pp, vol USD 7.10M acumulado), volta a subir desfazendo o recuo da véspera, com o maior volume acumulado do mercado presidencial. Com a nova alta, a divergência mercado × pesquisa reabre para ~12pp (14.05% × 2% da CNT/MDA 16/Jun), de novo a maior do dashboard. É o segundo movimento brusco em 48h: a aposta especulativa em torno do MBL caiu na segunda e ressurgiu na terça, sem lastro nas pesquisas.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "16/Jun: Renan voltou a subir e foi a 14.05% (↑2.40pp), reabrindo a divergência ante a CNT/MDA (2% no 1T) para ~12pp, de novo a maior do dashboard. É o segundo movimento brusco em 48h, um vai-e-vem que se desfez e refez sem novidade nas urnas: o 'paradoxo da direita' (G1) reforça que nenhum nome anti-Lula converteu a fraqueza de Flávio em voto. Sinal a monitorar: a Datafolha 19/Jun, que confirme ou não o patamar de 2-3% no 1T. STF impeach 3.25%."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "1.95%",
    poll: "Haddad estável a Poly 1.95% (vol USD 5.80M acumulado), empatado com Caiado e à frente de Camilo Santana (1.90%) como nome do PT no mercado presidencial. CNT/MDA e Futura/Apex 16/Jun não listam Haddad no presidencial nacional (foco SP). Mantida Vox SP 30/Mai 2T estadual Tarcísio 48.3% × Haddad 36.5% (Poder360).",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Haddad segue como nome do PT depois de Lula no mercado presidencial (1.95%, à frente de Camilo Santana 1.90%). Como ministro da Fazenda, no centro da disputa do PIX/tarifaço e do INSS, mas o mercado não precifica candidatura presidencial dele. A aprovação do governo segue acima da desaprovação (Nexus 48% × 47%), reforço da gestão econômica em que ele é peça central. STF impeach 3.25%."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1.95%",
    poll: "Caiado sobe em Poly 1.95% (↑0.45pp, vol USD 4.10M acumulado), a maior alta da 3ª via no dia, mas ainda no piso. CNT/MDA 16/Jun: 1T Caiado 4%, à frente da 3ª via com Flávio na disputa; e a Futura/Apex, num cenário SEM Flávio, dá Caiado 16.5% (lidera a 3ª via). Caiado domina entre os bolsonaristas em recorte da Quaest (Jornal Opção): é o nome posicionado para herdar o voto da direita se Flávio não for.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "Caiado subiu a 1.95% (↑0.45pp), a maior alta da 3ª via, mas seguindo no piso das apostas: o mercado precifica baixa a hipótese de Flávio sair da disputa. No cenário sem Flávio, a Futura/Apex 16/Jun dá Caiado 16.5%, sinal de quanto voto da direita está represado em Flávio. No cenário com Flávio, o 'paradoxo da direita' (G1) explica o teto. A Datafolha 19/Jun, que passa a testar Aécio e Joaquim Barbosa (G1), acirra a disputa pelo mesmo nicho. STF impeach 3.25%."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "1.35%",
    poll: "Zema sobe de leve a Poly 1.35% (↑0.10pp, vol USD 3.71M), mas segue no piso da 3ª via. CNT/MDA 16/Jun: 1T Zema 2.8% (com Flávio); sem Flávio, a Futura/Apex dá Zema 13.3% (2º da 3ª via, atrás de Caiado). Eduardo Bolsonaro defende ruptura entre PL e Novo após nova fala de Zema sobre Flávio e Vorcaro, atrito que expõe a dificuldade de convergência da direita. O Novo se equilibra entre a candidatura de Zema e alianças com o PL nos estados.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Zema subiu de leve a 1.35% (↑0.10pp), mas a 3ª via segue sem tração na disputa bipolarizada Lula × Flávio. No cenário sem Flávio, a Futura/Apex 16/Jun dá Zema 13.3%, fôlego latente. Eduardo Bolsonaro defende ruptura entre PL e Novo após nova fala de Zema sobre Flávio e Vorcaro, sinal do atrito que dificulta qualquer convergência da oposição. STF impeach 3.25%."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.15%",
    poll: "Tarcísio presidencial 0.15% Poly estável (vol USD ~12.7M acumulado, o maior do mercado, anomalia de legado). CNT/MDA e Futura/Apex 16/Jun não destacam Tarcísio no presidencial nacional (foco reeleição SP). Mantida Vox SP 30/Mai 2T estadual Tarcísio 48.3% × Haddad 36.5% (Poder360).",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Tarcísio segue focado na reeleição em SP, onde lidera, e o mercado mantém o presidencial em 0.15% (anomalia de legado, volume herdado de apostas antigas, o maior do book a USD 12.7M). No mercado de Senado por número de cadeiras, o PL lidera com folga (73%), sinal de capilaridade institucional da legenda. STF impeach 3.25%."
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
