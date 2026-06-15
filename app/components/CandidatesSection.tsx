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
    polymarket: "49.50%",
    poll: "Lula mantém o pico do ciclo: Poly 49.50% (estável, vol USD 6.43M acumulado), com o gap sobre Flávio em +22.85pp, perto do mais largo do ciclo. Sem print nacional Tier 1 novo, a sustentação vem da Genial/Quaest 10/Jun (n=2.004, campo 05-08/Jun, margem 2pp: 1T Lula 39% × Flávio 29%, gap +10pp; 2T 44% × 38%, gap +6pp, Lula vence todos os cenários), da Pesquisa Alfa que confirma a recuperação do presidente (VEJA) e do 'paradoxo da direita' lido pelo diretor da Quaest (Flávio perde força, mas rivais não herdam o voto anti-Lula, G1).",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTOS 14/Jun D+31: o mercado manteve Lula no pico do ciclo, 49.50% (estável), com o gap para Flávio em +22.85pp, bem acima do 1T da Quaest (+10pp). Sem pesquisa nacional nova (a janela de registros no TSE é dominada por pesquisas estaduais, sem print nacional previsto nos próximos 7 dias), a agenda do dia é o G7 na França, com o governo vendo chance de reunião com Trump (G1). Volume total no presidencial ~USD 99.6M. STF impeach estável a 3.60% (vol baixo)."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "26.65%",
    poll: "Flávio fica praticamente estável em Poly 26.65% (↑0.10pp, vol USD 6.60M acumulado), com o gap para Lula em +22.85pp, perto do recorde do ciclo. A Quaest 10/Jun mostra perda de apoio entre evangélicos, mulheres, jovens e no Sudeste (G1, O Globo): 1T 29% (gap -10pp); 2T 38% (perde 44% × 38%); 12% dizem que a relação com Vorcaro diminui a vontade de votar nele. O PL só pretende oficializar a candidatura no fim de julho em SP (Gazeta do Povo).",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 14/Jun: a Quaest 10/Jun mostra Flávio perdendo apoio entre evangélicos, mulheres, jovens e no Sudeste (G1, O Globo), e o coordenador da pré-campanha admite que o impacto do caso 'Dark Horse' teria sido menor se exposto antes. Eduardo Bolsonaro defende ruptura entre PL e Novo após fala de Zema, e a oficialização da candidatura ficou para o fim de julho em SP (Gazeta do Povo). No mercado, Flávio ficou praticamente estável a 26.65% (↑0.10pp), com o gap para Lula perto do recorde do ciclo (+22.85pp). STF impeach 3.60%."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "14.65%",
    poll: "Renan presidencial Poly 14.65% (↑1.55pp, vol USD 6.98M acumulado), a maior alta do dia no mercado de vencedor e o maior volume acumulado do mercado presidencial. A divergência mercado × pesquisa é a maior do dashboard e hoje se ampliou: 14.65% × 3% da Quaest 10/Jun (~11.65pp), com Renan embolado com Caiado (3%), Aécio (2%) e Zema (2%). O movimento reanima as manchetes de ascensão do MBL (Conexão Política, MatoGrossoAoVivo), ainda sem lastro nas pesquisas.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "14/Jun: Renan teve a maior alta do dia no mercado de vencedor, a 14.65% (↑1.55pp), o que alargou a divergência ante a Quaest (3% no 1T) para a maior do dashboard (~11.65pp). O movimento conversa com o noticiário de ascensão do MBL (Conexão Política, MatoGrossoAoVivo), mas o 'paradoxo da direita' (G1) reforça que nenhum nome anti-Lula, Renan incluído, converteu a fraqueza de Flávio em voto nas pesquisas. Sinal a monitorar: a próxima pesquisa nacional Tier 1 (sem data prevista nos próximos 7 dias; janela do TSE só com estaduais). STF impeach 3.60%."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "2.05%",
    poll: "Haddad sobe de leve a Poly 2.05% (↑0.05pp, vol USD 5.72M acumulado), atrás de Camilo Santana (2.45%) no mercado presidencial. Genial/Quaest 10/Jun não lista Haddad no presidencial nacional (foco SP). Mantida Vox SP 30/Mai 2T estadual Tarcísio 48.3% × Haddad 36.5% (Poder360).",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Haddad segue atrás de Camilo Santana no mercado presidencial (2.05% contra 2.45%). Como ministro da Fazenda, no centro da disputa do PIX/tarifaço e do INSS, mas o mercado não precifica candidatura presidencial dele. A aprovação do governo melhora na Quaest 10/Jun (47% × 48%), reforço da gestão econômica em que ele é peça central. STF impeach 3.60%."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1.35%",
    poll: "Caiado fica estável em Poly 1.35% (vol USD 4.02M acumulado), no piso do mercado. Genial/Quaest 10/Jun: 1T Caiado 3% (empatado com Renan na 3ª via, abaixo dos 6.9% da Vox 05/Jun). Caiado domina entre os bolsonaristas em recorte da própria Quaest (Jornal Opção). No 2T, Lula vence todos os cenários.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "Caiado ficou estável a 1.35%, seguindo no piso das apostas. O 'paradoxo da direita' da Quaest (G1) explica o teto: mesmo liderando entre os bolsonaristas (Jornal Opção), não herda o voto anti-Lula que Flávio perde. Mantém o argumento de maior competitividade no 2T medida por Tier 1+2 (PoderData/AYA 29/Mai, empate técnico). STF impeach 3.60%."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "1.95%",
    poll: "Zema sobe a Poly 1.95% (↑0.30pp, vol USD 3.65M), recuperando terreno na 3ª via. Genial/Quaest 10/Jun: 1T Zema 2%. Eduardo Bolsonaro defende ruptura entre PL e Novo após nova fala de Zema sobre Flávio e Vorcaro, atrito que expõe a dificuldade de convergência da direita. O Novo se equilibra entre a candidatura de Zema e alianças com o PL nos estados.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Zema teve leve recuperação no mercado (1.95%, ↑0.30pp), mas a 3ª via segue sem tração na disputa bipolarizada Lula × Flávio. Eduardo Bolsonaro defende ruptura entre PL e Novo após nova fala de Zema sobre Flávio e Vorcaro, sinal do atrito que dificulta qualquer convergência da oposição. A alta de hoje é reacomodação no piso, não tração eleitoral. STF impeach 3.60%."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.15%",
    poll: "Tarcísio presidencial 0.15% Poly estável (vol USD ~12.6M acumulado, anomalia de legado). Genial/Quaest 10/Jun não destaca Tarcísio no presidencial nacional (foco reeleição SP). Mantida Vox SP 30/Mai 2T estadual Tarcísio 48.3% × Haddad 36.5% (Poder360).",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Tarcísio segue focado na reeleição em SP, onde lidera, e o mercado mantém o presidencial em 0.15% (anomalia de legado, volume herdado de apostas antigas). No mercado de Senado por número de cadeiras, o PL lidera com folga (73%, vol USD 243k), sinal de capilaridade institucional da legenda. STF impeach 3.60%."
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
