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
    poll: "Lula DISPARA 37.50% Poly (↑1.00pp recupera de 36.50% mantém piso e avança), gap COMPRIME +7.35pp Flávio (vs +7.55pp ontem). 2L Lula estável 19.50%. Genial/Quaest 10 estados publicada hoje (Poder360, Folha, CartaCapital 06/Mai): Lula lidera em 5 estados (Nordeste forte, especialmente Pernambuco e Bahia) × Flávio em 5 (SP, RJ + Sul). Meio/Ideia 2T nacional publicada hoje 06/Mai: Flávio 45,3% × Lula 44,7% (Poder360, Exame). Real Time Big Data 2T Flávio 44% × Lula 43% (AJN1 06/Mai recobrança).",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "Senado REJEITOU Messias para STF, líder do governo diz que rejeição foi 'cacetada' em Lula (Gazeta do Povo 06/Mai 20:04). Lula adota discurso antissistema para 2026 (Gazeta do Povo 06/Mai 22:41). STF IMPEACH RECUPERA 14.50% Poly (↑2.50pp DISPARA de 12.00%) reabre narrativa institucional. Pesquisa Quaest avalia que Flávio repete teto da derrota do pai (bncamazonas 06/Mai). Quaest mostra força Lula no Nordeste mas vantagem Flávio no Sul (Brasil de Fato 06/Mai)."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "44.85%",
    poll: "Flávio DISPARA 44.85% Poly (↑0.80pp recupera de 44.05%) mantém liderança forte. 2L DISPARA 65.00% (↑2.50pp recupera de 62.50%) reverte devolução de ontem. 3L DEVOLVE 4.20% (↓1.20pp). Meio/Ideia 2T 06/Mai Flávio 45,3% × Lula 44,7% (Poder360). Genial/Quaest 06/Mai Flávio vence Lula em SP, RJ e mais 3 estados (Pleno.News). Futura/Apex RJ Flávio lidera + maioria apoia impeachment ministros STF (UOL 06/Mai 17:15). Tarcísio confirma Felício Ramuth como vice e chapa Senado SP (T7news 06/Mai).",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "STF IMPEACH RECUPERA 14.50% Poly (↑2.50pp DISPARA de 12.00%) maior movimento do dia, devolve queda forte. Senado REJEITA Messias enfraquece Mendonça e agrava crise STF (Estadão 06/Mai 21:00). 'Pesquisa Quaest avalia que Flávio repete teto da derrota do pai' (bncamazonas 06/Mai 18:05) sinal teto eleitoral. Proposta de delação Vorcaro decepciona PF (Estado de Minas 06/Mai 14:45). Costa Neto antecipou acordo Flávio × Alcolumbre barrar CPI Master (Revista Fórum mantida)."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "5.85%",
    poll: "Renan presidencial DISPARA 5.85% Poly (↑0.40pp leve recupera de 5.45%). 3L DEVOLVE 32.50% (↓3.50pp corrige recuperação ontem 36%) Zema mantém liderança 38.50%. STF impeach RECUPERA 14.50% Poly (↑2.50pp DISPARA) reabre combustível anti-establishment. Mantido 'Sou candidato direita' (BBC 28/Abr).",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "Senado REJEITA Messias e Lula adota discurso antissistema (Gazeta do Povo 06/Mai) — Lula tenta capturar oxigênio outsider que era espaço Renan. Genial/Quaest 10 estados não cita Renan competitivo (Poder360, Folha 06/Mai). Eleições 2026 vaquinha começa 15/Mai (VEJA 06/Mai 21:20). Caiado 3L DEVOLVE FORTE 11.50% (↓5.00pp) corrige movimento mas reduz disputa 3ª via."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "3.45%",
    poll: "Haddad presidencial DISPARA 3.45% Poly (↑0.30pp leve recupera de 3.15%). 2L DEVOLVE 3.55% (↓1.15pp corrige recuperação ontem 4.70%). 3L mantém 4.15% (estável). Camilo paridade presidencial 3.55% × Haddad 3.45% gap fechou para 0.10pp (vs 0.40pp ontem) fragmentação esquerda comprimindo.",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Tarcísio confirma Felício Ramuth como vice + chapa Senado (T7news 06/Mai 12:22) consolida coalizão SP. Genial/Quaest mostra Flávio à frente em SP (Folha 06/Mai 17:39) Haddad enfraquece estadual. Pré-candidatos ao Senado priorizam debate STF no Sudeste (Gazeta do Povo 06/Mai 20:18). Senado REJEITA Messias enfraquece base Lula no Senado (Estadão 06/Mai)."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "0.95%",
    poll: "Caiado presidencial leve cede 0.95% Poly (↓0.20pp de 1.15%) entra abaixo de 1%. 3L DEVOLVE FORTE 11.50% (↓5.00pp corrige de 16.50%) corrige movimento extremo. PSD Senado DEVOLVE FORTE 2.45% (↓2.95pp de 5.40%) reorganização Senado. Mantido 'Caiado lidera 3ª via 1T 5%' (Real Time Big Data 05/Mai sample 2.000).",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "Caiado sem apoio explícito governadores PSD na corrida presidencial (Gazeta do Povo 04/Mai mantida) PSD fragmentado. PSD Senado DEVOLVE FORTE 2.45% (↓2.95pp de 5.40%) reorganização significativa. Tarcísio confirma chapa Senado SP (T7news 06/Mai) articulação direita centraliza-se em PL/Republicanos."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "3.55%",
    poll: "Zema DEVOLVE FORTE presidencial 3.55% Poly (↓1.10pp continua queda de 4.65% perde 1pp em 24h). 3L mantém liderança 38.50% (↑0.50pp leve estável). 2L DISPARA 3.35% (↑1.35pp recupera de 2.00%). NOVO Senado DEVOLVE 2.10% (↓1.65pp de 3.75%) reorganização Senado. INFLAÇÃO REORGANIZAÇÃO COLOSSAL: bandas altas (≥6.50%) saltam 25.00% → 67.40% (↑42.40pp em 24h) oxigênio para narrativa fiscal Zema mas ele segue caindo Poly.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Renan 3L DEVOLVE 32.50% (↓3.50pp) MAS presidencial DISPARA 5.85% (↑0.40pp) — competidor 3ª via expande presidencial enquanto Zema cai. Caiado 3L DEVOLVE FORTE 11.50% (↓5.00pp). STF impeach RECUPERA 14.50% Poly (↑2.50pp DISPARA) reabre narrativa anti-STF mas Zema não capitaliza. Genial/Quaest 10 estados não destaca Zema (Poder360, Folha 06/Mai)."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.15%",
    poll: "Tarcísio presidencial 0.15% Poly (estável). 3L 0.45% (↓0.20pp leve cede). Tarcísio CONFIRMA Felício Ramuth como vice e anuncia chapa Senado (T7news 06/Mai 12:22) consolida coalizão SP. Genial/Quaest mostra Flávio à frente em SP (Folha 06/Mai 17:39) — Tarcísio reforça operação local pela direita.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Tarcísio+Flávio reportados PG por crimes eleitorais (Revista Fórum 02/Mai mantido) vetor judicial. Foco mantido na reeleição SP (papel de braço estadual). Republicanos Senado leve cede 1.65% Poly (↓0.70pp de 2.35%) reorganização Senado. Pré-candidatos ao Senado priorizam debate STF no Sudeste (Gazeta do Povo 06/Mai)."
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
