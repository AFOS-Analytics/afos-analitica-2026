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
    polymarket: "44.50%",
    poll: "Lula firme Poly 44.50% (vol USD 6.28M acumulado), consolidando a reação à Quaest. Genial/Quaest 10/Jun (n=2.004, campo 05-08/Jun, margem 2pp): 1T Lula 39% × Flávio 29% (gap +10pp); 2T Lula 44% × Flávio 38% (gap +6pp), Lula vence todos os cenários e abre 13pp entre independentes; aprovação 47% × 48% (vinha de 42% × 52% na RTBD 01/Jun). O gap Lula × Flávio no mercado abriu a +16.50pp. Contraponto Gerp 1T Flávio 35% × Lula 34% (Exame).",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTOS 10/Jun D+27: a Genial/Quaest nacional confirmou a liderança (1T +10pp, 2T +6pp, Lula vence todos) e a aprovação melhorou a 47% × 48%; o mercado saltou a 44.50% (estável) e o gap abriu a +16.50pp, mais largo que o 1T da pesquisa. Contraponto Gerp 1T Flávio 35% × Lula 34% (Exame), fora da curva. No TSE, o plenário adiou a decisão sobre a suspensão da pesquisa AtlasIntel pedida por Flávio (BBC). STF impeach recua a 2.30%."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "28.00%",
    poll: "Flávio cede Poly 28.00% (↓0.65pp 24h, vol USD 6.56M acumulado) após a Quaest. Genial/Quaest 10/Jun: 1T 29% (gap -10pp); 2T 38% (perde 44% × 38%); 12% dizem que a relação com Vorcaro diminui a vontade de votar nele. Renan, Caiado, Zema e Aécio seguem embolados e longe na disputa anti-Lula. Lidera o 2º lugar no mercado a 64.50% (↑2.50pp). Rejeição 46% > Lula 45% (Datafolha 22/Mai).",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 10/Jun: a Genial/Quaest deu Flávio perdendo os dois turnos (1T 29% × 39%, 2T 38% × 44%) e apontou acerto do governo em associá-lo a Vorcaro e ao tarifaço, com 12% dizendo que o vínculo reduz a vontade de votar nele (G1); o Estadão fala em sinal amarelo para toda a oposição. O mercado cedeu a 28.00% (↓0.70pp) e o gap para Lula abriu a +16.50pp. Mantém a liderança do 2º lugar (64.50%). No TSE, o plenário adiou a decisão sobre a suspensão da pesquisa AtlasIntel pedida por ele (BBC). STF impeach recua a 2.30%."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "15.70%",
    poll: "Renan presidencial Poly 15.70% (↓0.95pp 24h, vol USD 6.82M acumulado), 3º no mercado de vencedor. Genial/Quaest 10/Jun mediu Renan em 3% no 1T, embolado com Caiado (3%), Aécio (2%) e Zema (2%): a divergência mercado × pesquisa vai a ~12.70pp (15.70% × 3%), agora a mais larga e medida do dashboard. No mercado, cede no 3º lugar do 1º turno a 50.50% (↓1.50pp) e segue 2º no do 2º colocado (16.70%, atrás de Flávio 64.50%).",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "A Quaest cravou o número que faltava: Renan 3% no 1T (G1), o que alarga a maior divergência do dashboard para ~12.70pp (mercado 15.70% × pesquisa 3%). No mesmo dia, o mercado reforçou a aposta: Renan disparou a 50.50% (↑8.50pp) no 3º lugar do 1º turno, virou favorito isolado do pódio e segue 2º no do 2º colocado. Sinal a monitorar: se as próximas Tier 1 confirmarem os 3%, cresce o risco de reprecificação para baixo. STF impeach 2.30%."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "2.85%",
    poll: "Haddad estável Poly 2.85% (vol USD 5.63M acumulado), 5º nome presidencial atrás de Camilo Santana (3.80%, ↑0.65pp). Genial/Quaest 10/Jun não lista Haddad no presidencial nacional (foco SP). Mantida Vox SP 30/Mai 2T estadual Tarcísio 48.3% × Haddad 36.5% (Poder360).",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Haddad segue atrás de Camilo Santana no mercado presidencial. Como ministro da Fazenda, no centro da disputa do PIX/tarifaço, mas o mercado não precifica candidatura presidencial dele. A ala do PT-SP pressiona por Simone Tebet na vice de Haddad no projeto estadual de SP. Disputa estadual SP desfavorável (Vox 30/Mai Tarcísio 48.3% × Haddad 36.5%). STF impeach 2.30%."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1.75%",
    poll: "Caiado estável no piso: Poly 1.70% (, vol USD 3.94M acumulado). Genial/Quaest 10/Jun: 1T Caiado 3% (empatado com Renan na 3ª via, abaixo dos 6.9% da Vox 05/Jun), o que reduz a inversão poll × mercado. Caiado domina entre os bolsonaristas em recorte da própria Quaest (Jornal Opção). No 2T, Lula vence todos os cenários.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "A Quaest 10/Jun aproximou Caiado do que o mercado já precificava: 3% no 1T (contra 6.9% da Vox 05/Jun), reduzindo a inversão poll × mercado. Segue no piso das apostas (1.75%), mas mantém o argumento de maior teto na direita não-Bolsonaro ao dominar entre os bolsonaristas (Jornal Opção). Cobra que Flávio explique o elo com Vorcaro. STF impeach 2.30%."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "1.60%",
    poll: "Zema presidencial Poly 1.60% (↓0.25pp 24h, vol USD 3.55M), no piso da 3ª via. Genial/Quaest 10/Jun: 1T Zema 2%, embolado na base da disputa anti-Lula. No mercado de 3º lugar do 1º turno, Zema sobe a 19.50% no 3º lugar do 1º turno, atrás de Renan (50.50%). 3ª via sem tração com a disputa bipolarizada Lula × Flávio.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Zema segue no piso (↓0.10pp), a 3ª via não reabre com a disputa bipolarizada. A Quaest 10/Jun deu Zema 2% no 1T e Lula vencendo todos os cenários no 2T. No mercado de 3º lugar do 1º turno, perdeu terreno para Renan (50.50%), caindo a 19.50%. STF impeach 2.30%."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.15%",
    poll: "Tarcísio presidencial 0.15% Poly estável (vol USD ~12.5M acumulado, anomalia de legado). PL Senado em 72.50% (↓0.50pp, vol USD 243k). Genial/Quaest 10/Jun não destaca Tarcísio no presidencial nacional (foco reeleição SP). Mantida Vox SP 30/Mai 2T estadual Tarcísio 48.3% × Haddad 36.5% (Poder360).",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Tarcísio foi o fiador do realinhamento de 02/Jun (apoio a Flávio), mas a Quaest 10/Jun mostrou Flávio perdendo os dois turnos e o mercado cedendo a 28.00%. Tarcísio segue focado na reeleição em SP, onde lidera. PL lidera o Senado a 73.00%. STF impeach recua a 2.30%."
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
