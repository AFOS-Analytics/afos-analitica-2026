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
    poll: "Lula DESPENCA 37.50% Poly (↓1.0pp de 38.50%) gap ALARGA +6.45pp Flávio (vs +4.15pp ontem). Wellington Dias (coordenador campanha): Flávio bateu no teto (Brasil 247, VEJA 03/Mai). Real Time Big Data PA Lula lidera 1T (CNN). Nexus 2T empate técnico Lula × Flávio/Zema/Caiado (Capital News 03/Mai).",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "VOX BRASIL SP 2T: Flávio 50,4% × Lula 38,1% (Folha do Estado 03/Mai 18:37) Lula perde forte SP. 'Pai do Lulinha': campanha Lula vai chamar Flávio (Folha 03/Mai). 'Lula testa mote reeleição enquanto acumula tropeços Congresso' (Folha)."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "43.95%",
    poll: "Flávio RECUPERA TOPO 43.95% Poly (↑1.30pp de 42.65% reverte devolução) gap ALARGA +6.45pp. 2º lugar 67.5% (↓0.5pp leve). VOX SP 2T: Flávio 50,4% × Lula 38,1% (Folha do Estado 03/Mai). Federação União-PP MAIS PRÓXIMA Flávio após crise Senado (O Globo).",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "Flávio + Silas Malafaia culto Rio (Folha+Estadão 03/Mai 16:31) reaproximação alinhamento evangélico explícito. Wellington Dias (coordenador Lula): bateu no teto (Brasil 247). Tarcísio+Flávio reportados PG por crimes eleitorais (Revista Fórum 02/Mai)."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "5.65%",
    poll: "Renan presidencial 5.65% Poly (↑0.05pp leve estável). 3º lugar DISPARA 36.0% (↑2.5pp forte de 33.5%) reduz gap com Zema (39.5%). Mantido 'Sou candidato direita' (BBC 28/Abr).",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "STF impeach Poly DEVOLVE 13.5% (↓0.5pp leve). Eduardo Leite 3º DEVOLVE forte 0.85% (↓0.65pp de 1.5%) — competidor 3º lugar liberal centro-direita perde força, abre espaço Renan. Zema radicaliza impeach STF + 'privatizar tudo' (Estadão 03/Mai) compete oxigênio anti-establishment."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "2.95%",
    poll: "Haddad presidencial DESPENCA 2.95% Poly (↓0.70pp de 3.65% segundo dia consecutivo de queda forte). 'Pai do Lulinha': campanha Lula vai chamar Flávio (Folha 03/Mai 09:00) escalada retórica PT.",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "VOX BRASIL SP 2T: Flávio 50,4% × Lula 38,1% Haddad ausente. Camilo presidencial 3.85% > Haddad 2.95% diferença ALARGA 0.90pp fragmentação esquerda piora. Repercussão 'lavagem cerebral coletiva' Haddad mantida 72h (eco continua)."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1.35%",
    poll: "Caiado presidencial 1.35% Poly (↓0.10pp leve queda de 1.45%). PSD Senado DESPENCA forte 2.15% (↓5.35pp de 7.5% coalizão centrão devolve). Nexus 2T: Lula empate técnico com Caiado (Capital News 03/Mai).",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "Federação União-PP MAIS PRÓXIMA Flávio após crise Senado (O Globo 03/Mai) marginaliza Caiado centro-direita. PSD Senado DESPENCA forte. AtlasIntel 28/Abr 2T não cita Caiado mantido."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "3.75%",
    poll: "Zema presidencial 3.75% Poly (↓0.40pp continua despencando 4º dia <5%). 3º lugar mantém liderança 39.5% (↑0.50pp leve sustenta). NOVO Senado DEVOLVE forte 4.5% (↓3.4pp de 7.9%) reverte recuperação anterior.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Zema RADICALIZA: defende impeachment ministros STF + 'privatizar tudo' caso eleito (Estadão 03/Mai 16:55) — radicalização anti-establishment forte. Continua despencando presidencial 4º dia consecutivo abaixo dos 5% apesar manter liderança 3º lugar."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.15%",
    poll: "Tarcísio presidencial 0.15% Poly (estável). VOX SP gov: Tarcísio 38% × Haddad 26% mantido (CartaCapital 29/Abr) liderança SP. Marília apela Pacheco candidatura MG (Estado de Minas 03/Mai).",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Tarcísio+Flávio reportados PG por crimes eleitorais (Revista Fórum 02/Mai) mantido. VOX SP 2T presidencial: Flávio 50,4% × Lula 38,1% — Tarcísio fica fora da disputa nacional, papel de braço estadual SP."
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
