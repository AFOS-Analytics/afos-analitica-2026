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
    poll: "Lula renova o pico do ciclo: Poly 49.50% (↑2.00pp, vol USD 6.40M acumulado), com o gap sobre Flávio abrindo a +22.95pp, o mais largo do ciclo. Sem print nacional Tier 1 novo, o movimento digere a Genial/Quaest 10/Jun (n=2.004, campo 05-08/Jun, margem 2pp: 1T Lula 39% × Flávio 29%, gap +10pp; 2T 44% × 38%, gap +6pp, Lula vence todos os cenários) e ganha reforço da Pesquisa Alfa, que confirma a recuperação do presidente (VEJA), e do 'paradoxo da direita' lido pelo diretor da Quaest (Flávio perde força, mas rivais não herdam o voto anti-Lula, G1).",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTOS 13/Jun D+30: o mercado levou Lula a um novo pico do ciclo, 49.50% (↑2.00pp), com o gap para Flávio em +22.95pp, bem acima do 1T da Quaest (+10pp). Sem pesquisa nacional nova (MDA, IPESPE e AtlasIntel registradas no TSE para 15-16/Jun), o motor foi a Pesquisa Alfa (VEJA) e a leitura do 'paradoxo da direita' (diretor da Quaest, G1). A Copa abre hoje (Brasil contra Marrocos) e divide a atenção política. STF impeach sobe a 3.60% (vol baixo)."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "26.55%",
    poll: "Flávio fica estável em Poly 26.55% (vol USD 6.58M acumulado), mas o gap para Lula abriu a +22.95pp com a alta do presidente. A campanha vive momento difícil, com baque nas pesquisas e racha entre aliados (VEJA), e o Estadão fala em necessidade de 'rebranding'. Genial/Quaest 10/Jun: 1T 29% (gap -10pp); 2T 38% (perde 44% × 38%); 12% dizem que a relação com Vorcaro diminui a vontade de votar nele. Lidera com folga o 2º lugar no mercado a 68.00% (↑1.50pp).",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 13/Jun: o diretor da Quaest resumiu o dilema da oposição no 'paradoxo da direita', Flávio perde força mas os rivais não conseguem herdar o voto anti-Lula (G1). A campanha enfrenta racha entre aliados (VEJA) e pressão por 'rebranding' (Estadão). No mercado, Flávio ficou estável a 26.55%, mas o gap para Lula virou recorde do ciclo (+22.95pp). Segue líder isolado do 2º lugar (68.00%, ↑1.50pp). STF impeach 3.60%."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "13.10%",
    poll: "Renan presidencial Poly 13.10% (↓0.60pp, vol USD 6.94M acumulado), 3º no mercado de vencedor. A divergência mercado × pesquisa segue a maior do dashboard: 13.10% × 3% da Quaest 10/Jun (~10.10pp), com Renan embolado com Caiado (3%), Aécio (2%) e Zema (2%). No mercado, reforça o favoritismo do 3º lugar do 1º turno a 52.00% (↑0.50pp) e segue 2º no do 2º colocado (16.65%, atrás de Flávio 68.00%).",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "13/Jun: Renan cedeu de leve no mercado de vencedor a 13.10% (↓0.60pp), com a divergência ante a Quaest (3% no 1T) ainda a maior do dashboard (~10.10pp). No pódio do 1º turno, ampliou o favoritismo isolado do 3º lugar (52.00%). O 'paradoxo da direita' (G1) reforça que nenhum nome anti-Lula, Renan incluído, tem convertido a fraqueza de Flávio. Sinal a monitorar: as Tier 1 de 15-16/Jun (MDA/IPESPE/AtlasIntel). STF impeach 3.60%."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "2.00%",
    poll: "Haddad sobe de leve a Poly 2.00% (↑0.10pp, vol USD 5.70M acumulado), atrás de Camilo Santana (2.35%) no mercado presidencial. Genial/Quaest 10/Jun não lista Haddad no presidencial nacional (foco SP). Mantida Vox SP 30/Mai 2T estadual Tarcísio 48.3% × Haddad 36.5% (Poder360).",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Haddad segue atrás de Camilo Santana no mercado presidencial (2.00% contra 2.35%). Como ministro da Fazenda, no centro da disputa do PIX/tarifaço e do INSS, mas o mercado não precifica candidatura presidencial dele. A 'taxa das blusinhas', antes de revogada, rendeu mais de R$ 2 bilhões ao governo em 2026 (G1), pano de fundo fiscal da sua pasta. STF impeach 3.60%."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1.35%",
    poll: "Caiado cede a Poly 1.35% (↓0.25pp, vol USD 4.00M acumulado), no piso do mercado. Genial/Quaest 10/Jun: 1T Caiado 3% (empatado com Renan na 3ª via, abaixo dos 6.9% da Vox 05/Jun). Caiado domina entre os bolsonaristas em recorte da própria Quaest (Jornal Opção). No 2T, Lula vence todos os cenários.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "Caiado recuou a 1.35% (↓0.25pp), seguindo no piso das apostas. O 'paradoxo da direita' da Quaest (G1) explica o teto: mesmo liderando entre os bolsonaristas (Jornal Opção), não herda o voto anti-Lula que Flávio perde. Mantém o argumento de maior competitividade no 2T medida por Tier 1+2 (PoderData/AYA 29/Mai, empate técnico). STF impeach 3.60%."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "1.65%",
    poll: "Zema sobe a Poly 1.65% (↑0.45pp, vol USD 3.63M), interrompendo a queda. Genial/Quaest 10/Jun: 1T Zema 2%. O Novo tenta se equilibrar entre a candidatura de Zema e alianças com Flávio nos estados (G1). No mercado de 3º lugar do 1º turno, Zema é 3º a 16.50%, empatado com Caiado e atrás de Renan (52.00%).",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Zema teve leve recuperação no mercado (1.65%, ↑0.45pp), mas a 3ª via segue sem tração na disputa bipolarizada Lula × Flávio. O Novo tenta equilibrar a candidatura presidencial de Zema com alianças locais junto a Flávio (G1), o que dilui o discurso nacional. No 3º lugar do 1º turno, caiu para 16.50% (empate com Caiado), atrás de Renan (52.00%). STF impeach 3.60%."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.15%",
    poll: "Tarcísio presidencial 0.15% Poly estável (vol USD ~12.6M acumulado, anomalia de legado). PL Senado SALTA a 76.50% (↑4.00pp, vol USD 243k). Genial/Quaest 10/Jun não destaca Tarcísio no presidencial nacional (foco reeleição SP). Mantida Vox SP 30/Mai 2T estadual Tarcísio 48.3% × Haddad 36.5% (Poder360).",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Tarcísio segue focado na reeleição em SP, onde lidera, e o mercado mantém o presidencial em 0.15% (anomalia de legado). O PL, partido dele e de Flávio, reforçou o favoritismo no Senado a 76.50% (↑4.00pp), sinal de que o mercado preserva a capilaridade institucional da legenda mesmo com Flávio em baixa. STF impeach 3.60%."
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
