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
    polymarket: "36.50%",
    poll: "Lula DESPENCA 36.50% Poly (↓1.0pp 4º DIA CONSECUTIVO de 37.50%) gap ALARGA AINDA MAIS +7.75pp Flávio (vs +6.45pp ontem). Veritá PE 1T Lula 43,3% × Flávio 30,9% (CNN 04/Mai sample 2010 campo 24-30/Mar). Quaest ES empate técnico Lula × Flávio (A Gazeta 04/Mai). Real Time Big Data nacional publicada (VEJA 04/Mai 12:28).",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "Flávio avança Nordeste já não garantido Lula (Gazeta do Povo 04/Mai). Flávio MS 11,47% à frente Lula (Investiga MS 04/Mai). Pesquisas indicam vantagem aliados Flávio em maiores palanques (Folha 05/Mai). Dupla derrota Lula intensifica narrativa fragilidade governo (Folha 04/Mai)."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "44.25%",
    poll: "Flávio AMPLIA TOPO 44.25% Poly (↑0.30pp leve de 43.95%) gap ALARGA AINDA MAIS +7.75pp 4º dia Lula despenca. 2º lugar 66.50% (↓1.0pp leve cede). 3º DISPARA 10.05% (↑9.65pp). Quaest ES empate técnico Lula × Flávio (A Gazeta 04/Mai). Pesquisas vantagem aliados Flávio maiores palanques (Folha 05/Mai).",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "Flávio enfrenta resistência Nordeste maioria prefere Lula (Jamildo 04/Mai). Pesquisas em quatro estados aliados Flávio dificuldade entre mulheres (O Globo 04/Mai). Veritá PE Lula 43,3% × Flávio 30,9% (CNN 04/Mai sample 2010 campo 24-30/Mar). Caso Master CPI INSS 30 GB (CNN 04/Mai). PF força-tarefa foro Master (Brasil 247 04/Mai)."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "5.55%",
    poll: "Renan presidencial 5.55% Poly (↓0.10pp leve estável). 3º lugar DEVOLVE forte 31% (↓5pp de 36%) reorganização dramática 3º (Zema cede 38%, Caiado DISPARA 19%, Flávio 10.05%). Mantido 'Sou candidato direita' (BBC 28/Abr).",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "STF impeach Poly DEVOLVE 13.00% (↓0.50pp continua queda leve). Zema RECUPERA presidencial 5.05% (↑1.30pp REVERTE 4 dias <5%) compete oxigênio anti-establishment direto. Augusto Cury filia Avante para presidência (Gazeta do Povo 04/Mai) novo entrante 3ª via fragmenta. Direita unificada Senado consolidada."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "3.05%",
    poll: "Haddad presidencial recupera leve 3.05% Poly (↑0.10pp para queda 2 dias forte de 2.95%) sinaliza estabilização. 2º lugar 3.65% (↓0.20pp leve cede). Lula mira escala 6x1 evangélicos (G1 04/Mai 18:20) tema mobilizador trabalhista beneficia base PT.",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Camilo presidencial 3.85% (estável) > Haddad 3.05% diferença ALARGA estabiliza 0.80pp fragmentação esquerda persiste. PT Senado DEVOLVE 2.30% (↓1.0pp). Vox SP gov Tarcísio 38% × Haddad 26% mantido (CartaCapital 29/Abr) atrás 12pp em SP. Repercussão 'lavagem cerebral coletiva' Haddad mantida em eco."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1.25%",
    poll: "Caiado presidencial 1.25% Poly (↓0.10pp leve queda de 1.35%). 3º LUGAR DISPARA 19.00% (↑18.45pp de 0.55%) movimento extremo entrada top 3º (atenção liquidez baixa). PSD Senado recupera forte 5.85% (↑3.70pp de 2.15%) coalizão centrão recompõe. Nexus 2T Lula empate técnico Caiado mantido.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "Caiado sem apoio explícito governadores PSD na corrida presidencial (Gazeta do Povo 04/Mai 13:20) PSD fragmentado afeta base partidária. Derrota Lula Senado fortalece Flávio empurra centrão nova aliança (Tribuna da Internet 04/Mai) direita unificada Flávio MARGINALIZA Caiado."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "5.05%",
    poll: "Zema RECUPERA presidencial 5.05% Poly (↑1.30pp REVERTE 4 dias <5%, era 3.75%) movimento contra-tendência forte. 3º cede leve liderança 38.00% (↓1.5pp de 39.5%) primeira cessão. NOVO Senado leve cede 3.85% (↓0.65pp leve apenas) sem desabamento. Nexus 2T Lula empate técnico Zema mantido.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Caiado 3º DISPARA 19% competidor 3ª via emerge dramaticamente. Renan 3º DEVOLVE forte 31%. Direita unificada Flávio absorve oxigênio 3ª via (Tribuna da Internet 04/Mai). STF avança casos impacto eleitoral esvazia TSE 2026 (Estadão 04/Mai) reduz espaço narrativa anti-STF Zema. Augusto Cury filia Avante (Gazeta do Povo 04/Mai) fragmenta 3ª via."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.15%",
    poll: "Tarcísio presidencial 0.15% Poly (estável). Vox SP gov Tarcísio 38% × Haddad 26% mantido (CartaCapital 29/Abr) liderança SP. Pesquisas em quatro estados aliados Flávio dificuldade entre mulheres (O Globo 04/Mai) afeta também Tarcísio.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Tarcísio+Flávio reportados PG por crimes eleitorais (Revista Fórum 02/Mai mantido) vetor judicial. Foco mantido na reeleição SP (papel de braço estadual). Republicanos Senado emerge 1.35% (novo no top) coalizão direita estadual."
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
