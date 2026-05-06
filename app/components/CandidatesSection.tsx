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
    poll: "Lula estável 36.50% Poly (mantém piso) gap leve compressão +7.55pp Flávio (vs +7.75pp ontem). Real Time Big Data nacional 05/Mai 1T Lula 40% × Flávio 34% sample 2.000 campo 02-04/Mai BR-03627/2026. 2T Real Time Big Data Flávio 44% × Lula 43% empate técnico (R7 05/Mai). 2T Caiado 42% × Lula 43% empate (Estadão 05/Mai). Casa Branca confirma reunião Lula × Trump quinta 07/Mai (MSN 06/Mai).",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "Desaprovação Lula sobe 52% pós Messias (InfoMoney 05/Mai). Encontro Lula × Trump cercado de tensão e desconfiança (Estado de Minas 05/Mai). Governo se divide sobre reação de Trump (CNN Brasil 05/Mai). Tarcísio lança Alesp Senado e critica Haddad (Folha 05/Mai 18:21). Senador denuncia armação PT cobrança CPI Master (Portal 96FM 05/Mai)."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "44.05%",
    poll: "Flávio leve cede 44.05% Poly (↓0.20pp de 44.25%) gap leve compressão +7.55pp. 2º lugar DEVOLVE FORTE 62.50% (↓4.0pp de 66.50%). 3º DEVOLVE 5.40% (↓4.65pp). Real Time Big Data 05/Mai 1T Flávio 34% × Lula 40% (CNN). 2T Flávio 44% × Lula 43% empate técnico (R7 05/Mai) lidera numericamente. Tarcísio lança Alesp Senado (Folha 05/Mai). Flávio bate-volta EUA véspera Lula × Trump (Poder360 05/Mai).",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "STF impeach Poly DEVOLVE FORTE 12.00% (↓1.0pp continua queda movimento mais relevante do dia institucionalidade firme). 2L cede consolidação significativamente. PF e PGR negociam só conjunto delações INSS + Master (SBT News 05/Mai). CPI Crime Organizado reta final foco Master (Times Brasil 05/Mai). Tarcísio + Flávio reportados PG (Revista Fórum 02/Mai mantido)."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "5.45%",
    poll: "Renan presidencial 5.45% Poly (↓0.10pp leve estável). 3º lugar RECUPERA FORTE 36.00% (↑5pp de 31% reduz gap Zema 38%) competidor 3ª via emerge novamente. Real Time Big Data 05/Mai 1T Renan 3% (sample 2.000 abaixo Caiado 5% e Zema 4%). Mantido 'Sou candidato direita' (BBC 28/Abr).",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "STF impeach Poly DEVOLVE FORTE 12.00% (↓1.0pp continua queda) institucionalidade firme reduz combustível anti-establishment. Casa Branca confirma reunião Lula × Trump (MSN 06/Mai) agenda institucional dominante. Augusto Cury Avante 1% novo entrante 3ª via fragmenta (Real Time Big Data 05/Mai). Tarcísio lança Alesp Senado articulação direita centralizada absorve."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "3.15%",
    poll: "Haddad presidencial recupera leve 3.15% Poly (↑0.10pp para queda 3 dias forte de 2.95%) sinaliza estabilização contínua. 2º lugar recupera 4.70% (↑1.05pp de 3.65%). 3º 4.15% (estável). Casa Branca confirma reunião Lula × Trump (MSN 06/Mai) agenda governamental beneficia base PT.",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Tarcísio lança Alesp Senado e CRITICA HADDAD diretamente (Folha 05/Mai 18:21). Camilo presidencial 3.55% (↓0.30pp leve) > Haddad 3.15% fragmentação esquerda persiste 0.40pp. Vox SP gov Tarcísio 38% × Haddad 26% mantido atrás 12pp em SP. Real Time Big Data 1T Haddad ausente top (CNN 05/Mai). Lula empata Flávio Caiado Zema 2T (Estadão) Haddad ausente cenários 2T."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1.15%",
    poll: "Caiado presidencial 1.15% Poly (↓0.10pp leve queda de 1.25%). 3º LUGAR DEVOLVE 16.50% (↓2.5pp de 19% corrige movimento extremo ontem). Real Time Big Data 05/Mai 1T Caiado 5% LIDERA 3ª via 1T por 2pp sobre Zema 4% (CNN sample 2.000). 2T Caiado 42% × Lula 43% empate técnico (Estadão 05/Mai). Lula empata Flávio Caiado Zema 2T (Estadão).",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "Caiado sem apoio explícito governadores PSD na corrida presidencial (Gazeta do Povo 04/Mai mantida) PSD fragmentado. Tarcísio lança Alesp Senado articulação direita Tarcísio/Flávio absorve oxigênio (Folha 05/Mai). PSD Senado leve cede 5.40% (↓0.45pp). PL Senado consolida 86.50% (↑0.50pp leve)."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "4.65%",
    poll: "Zema DEVOLVE presidencial 4.65% Poly (↓0.40pp reverte recuperação ontem 5.05% volta abaixo dos 5%). 3º mantém liderança 38.00% (estável primeiro dia sustentando). NOVO Senado leve cede 3.75% (↓0.10pp leve). Real Time Big Data 05/Mai 1T Zema 4% (sample 2.000 abaixo Caiado 5%). 2T Zema × Lula empate técnico (Estadão 05/Mai). Zema RADICALIZA impeachment STF + privatizar tudo (Estadão 03/Mai mantida).",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Caiado lidera 3ª via 1T por 2pp (Real Time Big Data 5% × 4%). Renan 3L RECUPERA 36% (↑5pp) competidor 3ª via emerge. Eduardo Leite 3L DISPARA 3.0% (↑2.15pp). STF impeach DEVOLVE FORTE 12.00% (↓1.0pp continua queda) reduz espaço narrativa anti-STF. Augusto Cury Avante 1% novo entrante 3ª via fragmenta. Inflação banda 6.00-6.49% DEVOLVE 16.95% (↓3.35pp corrige) reduz oxigênio discurso fiscal Zema."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.15%",
    poll: "Tarcísio presidencial 0.15% Poly (estável). 3º lugar 0.65% (↑0.40pp leve recupera). Tarcísio LANÇA presidente da Alesp ao Senado e CRITICA Haddad (Folha 05/Mai 18:21) articulação SP intensifica. Vox SP gov Tarcísio 38% × Haddad 26% mantido liderança SP.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Tarcísio+Flávio reportados PG por crimes eleitorais (Revista Fórum 02/Mai mantido) vetor judicial. Foco mantido na reeleição SP (papel de braço estadual). Republicanos Senado DISPARA 2.35% (↑1.0pp) coalizão direita estadual emerge."
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
