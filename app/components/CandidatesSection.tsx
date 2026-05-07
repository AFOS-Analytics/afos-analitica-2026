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
    polymarket: "37.50%",
    poll: "Lula estável 37.50% Poly (mantém piso após DISPARA ontem ↑1.00pp). 2L Lula estável 19.50%. Reunião com Trump em Washington 07/Mai durou 3 horas, com elogio de Trump (G1 07/Mai). Paraná Pesquisas SP publicada hoje 07/Mai: Flávio 39,3% × Lula 36% no 1T; 2T Flávio 48,1% × Lula 40,3% (CNN Brasil 07/Mai). Mantida Genial/Quaest 10 estados (Lula lidera em 5 Nordeste × Flávio em 5 SP/RJ/Sul) e Meio/Ideia 2T 45,3% × 44,7%.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "Gap em LEVE EXPANSÃO +7.50pp Flávio (vs +7.35pp ontem). Operação Ciro Nogueira (PF) com Planalto pedindo silêncio dos ministros (Estadão 07/Mai). Alcolumbre pediu blindagem Vorcaro a Lula, recusada (O Globo 07/Mai). Paraná Pesquisas SP Lula atrás de Flávio em SP. Camilo presidencial DEVOLVE FORTE 2.25% (↓1.30pp corrige) reabre fragmentação esquerda."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "45.00%",
    poll: "Flávio DISPARA 45.00% Poly (↑0.15pp leve avança de 44.85%) mantém liderança forte. 2L DISPARA 65.50% (↑0.50pp consolida). 3L DEVOLVE 4.20% estável. Paraná Pesquisas SP publicada hoje 07/Mai: Flávio 39,3% × Lula 36% no 1T; 2T Flávio 48,1% × Lula 40,3% (CNN Brasil 07/Mai). Mantida Meio/Ideia 2T 45,3% × Lula 44,7% e Genial/Quaest Flávio em SP, RJ + 3 estados.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "STF IMPEACH leve cede 14.00% Poly (↓0.50pp de 14.50%). Operação Ciro Nogueira (Estadão 07/Mai) atinge ex-aliado interno PL/centrão. Alcolumbre pediu blindagem Vorcaro a Lula, recusada (O Globo 07/Mai) — sinaliza nó com Planalto. Costa Neto antecipou acordo Flávio × Alcolumbre barrar CPI Master (Revista Fórum mantida)."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "5.85%",
    poll: "Renan presidencial estável 5.85% Poly (mantém após ↑0.40pp ontem). 3L estável 32.50% Renan firme em 2º na disputa por terceiro lugar (Zema DEVOLVE 33.50% ↓5pp aproxima). STF impeach leve cede 14.00% Poly (↓0.50pp). Mantido 'Sou candidato direita' (BBC 28/Abr).",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "Caiado 3L DISPARA 14.50% (↑3.00pp DISPARA de 11.50%) competidor 3ª via reaproxima. Eduardo Leite 3L DEVOLVE 0.70% (↓1.60pp). Reunião Lula × Trump (G1 07/Mai) e Operação Ciro Nogueira (Estadão 07/Mai) capturam ciclo institucional reduz oxigênio outsider. Paraná Pesquisas SP não cita Renan competitivo (CNN Brasil 07/Mai)."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "3.35%",
    poll: "Haddad presidencial leve cede 3.35% Poly (↓0.10pp de 3.45%) volta posição estável. 2L 3.55% (estável). 3L 4.15% (estável). Camilo DEVOLVE FORTE 2.25% (↓1.30pp corrige de 3.55%) — Haddad agora ACIMA de Camilo no presidencial reverte fragmentação esquerda.",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Paraná Pesquisas SP 07/Mai mostra Flávio 39,3% × Lula 36% — extrapolação Tarcísio favorito SP afeta Haddad estadual (CNN Brasil 07/Mai). PT Senado DISPARA 3.30% (↑1.15pp recupera) sinal positivo coalizão. Operação Ciro Nogueira (Estadão 07/Mai) atinge oposição."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1.15%",
    poll: "Caiado presidencial DISPARA 1.15% Poly (↑0.20pp recupera acima 1% de 0.95%). 3L DISPARA 14.50% (↑3.00pp recupera de 11.50%) reaproxima Renan 32.50%. PSD Senado DISPARA 4.25% (↑1.80pp recupera de 2.45%) reorganização Senado favorável. Mantido 'Caiado lidera 3ª via 1T 5%' (Real Time Big Data 05/Mai).",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "Senado REORGANIZAÇÃO MASSIVA: PL leve cede 81.50% (↓1.00pp), mas vários partidos centro-direita disparam (Republicanos 5.35% ↑3.70pp, MDB 5.80% ↑3.65pp). 'Caiado sem apoio explícito governadores PSD na corrida' (Gazeta do Povo 04/Mai mantida) PSD fragmentado."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "3.95%",
    poll: "Zema DISPARA presidencial 3.95% Poly (↑0.40pp recupera de 3.55% após queda forte ontem). 3L DEVOLVE FORTE 33.50% (↓5.00pp DEVOLVE de 38.50% perde liderança). NOVO Senado DEVOLVE 1.00% (↓1.10pp DEVOLVE de 2.10%) reorganização Senado afeta partido. INFLAÇÃO bandas altas (≥6.50%) corrigem 60.65% (vs 67.40% ontem) — banda 7.00%+ DEVOLVE 26.40% (↓9.40pp).",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Renan 3L estável 32.50% empata virtualmente com Zema agora. Caiado 3L DISPARA 14.50% (↑3.00pp). Reunião Lula × Trump (G1 07/Mai) agenda institucional ocupa narrativa. Operação Ciro Nogueira (Estadão 07/Mai) fragmenta direita interna."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.15%",
    poll: "Tarcísio presidencial 0.15% Poly (estável). 3L 0.45% (estável). Republicanos Senado DISPARA 5.35% Poly (↑3.70pp DISPARA de 1.65%) consolida coalizão Senado SP/Sudeste — Tarcísio reforça operação local pela direita.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Tarcísio+Flávio reportados PG por crimes eleitorais (Revista Fórum 02/Mai mantido) vetor judicial. Foco mantido na reeleição SP (papel de braço estadual). Paraná Pesquisas SP mostra Flávio à frente — Tarcísio reforça operação local."
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
