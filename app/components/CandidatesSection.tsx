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
    polymarket: "38.50%",
    poll: "Lula RECUPERA 38.50% Poly (↑1.0pp de 37.50%) gap fecha +4.15pp Flávio (vs +6.05pp ontem). Real Time Big Data PA: Lula lidera todos cenários 1T (CNN). AtlasIntel 28/Abr 1T 46.6% × Flávio 39.7% mantida.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "PT autocrítica: Edinho Silva 'PT deveria ter assinado CPI Master' (O Antagonista). Mendonça: 'Vorcaro tinha apoio mais altos escalões República' (Metrópoles). Lula estuda aliança neta Brizola RS (Gazeta do Povo). Lula confiante MG (CNN)."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "42.65%",
    poll: "Flávio PERDE TOPO CICLO 42.65% Poly (↓0.90pp de 43.55%). 2º lugar ALARGA 68.0% (↑2.5pp). 'Flávio avança Nordeste já não garantido Lula' (Gazeta do Povo). 'Articulador 2 derrotas Lula' (Estadão).",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "Flávio 'assume anistia total na Papudinha' (Blog Esmael). Tarcísio+Flávio reportados PG por crimes eleitorais (Revista Fórum). Tensão direita: Flávio pede união após atrito Eduardo×Nikolas (Gazeta do Povo). 'Costa Neto antecipou acordo Flávio×Alcolumbre barrar CPI Master' (Revista Fórum)."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "5.60%",
    poll: "Renan presidencial 5.60% Poly (estável de 5.65%). 3º lugar 33.5% (estável após reversão ontem, Zema lidera 39.0%). Mantido 'Sou candidato direita' (BBC 28/Abr).",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "STF impeach Poly RECUPERA 14.0% (↑1.0pp) reverte parte do despenque ontem. Combustível anti-establishment volta levemente. Mas direita unificada Flávio absorve oxigênio (Alcolumbre articula União+PP)."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "3.65%",
    poll: "Haddad presidencial 3.65% Poly (↑0.30pp de 3.35%). 'Haddad lavagem cerebral' continua repercutindo 02/Mai (O Globo, Revista Oeste). 'Haddad planeja debates econômicos Tarcísio com inflação SP' (Estadão). Vox SP gov: Tarcísio 38% × Haddad 26% mantido.",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Repercussão 'lavagem cerebral coletiva' continua dominante 48h depois (RISCO REPUTACIONAL). Haddad atrás 12pp em SP. Camilo presidencial DISPARA 3.95% (↑0.60pp) iguala Haddad mostra fragmentação esquerda."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1.45%",
    poll: "Caiado presidencial 1.45% Poly (↓0.20pp de 1.65%). PSD Senado DISPARA 7.5% (↑4.9pp de 2.6%) coalizão centrão recupera força. Quaest GO: Daniel Vilela 33% 1T + lidera 2T (Quaest 01/Mai) aliado MDB.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "Caiado presidencial em queda lenta. 'Alcolumbre articula União+PP em Flávio' (Revista Fórum) marginaliza Caiado como alternativa centro-direita. AtlasIntel 28/Abr 2T não cita Caiado mantido."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "4.15%",
    poll: "Zema presidencial 4.15% Poly (↓0.30pp continua despencando, 3º dia consecutivo <5%). 3º lugar mantém liderança 39.0% (↓0.5pp leve, reversão ontem se sustenta). NOVO Senado DISPARA 7.9% (↑6.05pp segunda recuperação, partido reverte colapso). AtlasIntel 28/Abr 2T 'Lula empata Zema' mantido.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Zema 'criança vai poder trabalhar caso eleito' (Estadão+Blog Esmael 02/Mai) declaração polêmica trabalho infantil pode dominar narrativa próximas 48h. Presidencial continua despencando apesar 3º lugar consolidado."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.15%",
    poll: "Tarcísio presidencial 0.15% Poly (estável). 3º lugar 0.45% (↓0.10pp). Vox SP gov: Tarcísio 38% × Haddad 26% mantido (CartaCapital 29/Abr) liderança SP.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Tarcísio+Flávio reportados Procuradoria Geral por crimes eleitorais (Revista Fórum 02/Mai). 'Haddad planeja debates econômicos Tarcísio com inflação SP' (Estadão) ataque direto. Mantém aliança Flávio mas dividido entre defesa estadual e nacional."
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
