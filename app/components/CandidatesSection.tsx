import type { CandidateProfile } from '../types';
import { partyColor } from '../lib/utils';
import { SectionTitle, Card } from './ui';
import { useTranslation } from '../i18n/context';

const candidates: CandidateProfile[] = [
  { name: "Lula", party: "PT", age: 80, role: "Presidente da República", polymarket: "39.5%", poll: "37% 1T (Quaest, 15/Abr) / 39.2% (CNT/MDA) / Datafolha PE 60% aprovação (20/Abr)", position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato.", risk: "39.5% Poly (estável) — ASSUME LIDERANÇA ISOLADA (+0.9pp sobre Flávio 38.6% que caiu 2º dia consecutivo). Novo Datafolha PE (20/Abr): 60% aprovação (O Cafezinho) — reforço Nordeste. Rejeição INVERTE (MSN 19/Abr): Flávio 52.6% AGORA > Lula 47.4%. Lula 'tranquilo' na Alemanha, olha 4º mandato (G1 20/Abr). PGR/AGU pedem STF rejeitar antidelação PT desengavetada Moraes (O Globo) — reversão. STF impeach SOBE 12.5% (↑1pp). Senado PT DOBRA 4.4% (↑2pp). Haddad: 'Taxação Pix foi ideia Bolsonaro' (Conexão Política). Diário Centro Mundo: Lula diminui gap SP. PT RJ Paes+Benedita. MAS: Vorcaro transferiu R$520M para Graeff (MSN) — pressão BC indicado Lula. STF racha interno. STF trava gov MG. Paraná SP mantido: 2T 40.3%." },
  { name: "Flávio Bolsonaro", party: "PL", age: 45, role: "Senador (RJ)", polymarket: "38.6%", poll: "32% 1T (Quaest) / 35.9% (Veritá) / Travessia: viável não consolidado (20/Abr)", position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.", risk: "38.6% Poly (↓1.0pp, 2º DIA DE QUEDA — total ↓1.8pp em 2 dias) — PERDE LIDERANÇA para Lula (gap -0.9pp). 2º lugar DESPENCA: 64.5% (↓2pp). Rejeição INVERTE: Flávio 52.6% AGORA > Lula 47.4% (MSN 19/Abr). Travessia (Estadão 20/Abr): 'viável mas NÃO consolidado'. União-PP TENDÊNCIA apoiar (PlatôBR 20/Abr) — direita pode unificar. Tarcísio reafirma (MSN): 'Flávio pode vencer 1T'. Gazeta Povo: direita-centrodireita batalha Congresso. CAIADO RACHA DIREITA: apoia Kassab VP PSD puro (Gazeta Povo 20/Abr). Paraná SP mantido: 2T 48.1%. 44 ações no TSE (Valor). RISCO: Moraes inquérito inelegibilidade possível." },
  { name: "Renan Santos", party: "Missão", age: 35, role: "Fundador do MBL", polymarket: "6.35%", poll: "4.4% 1T (AtlasIntel) / 1.8% (Veritá) / N/A Quaest", position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.", risk: "6.35% Poly (↑0.1pp) — leve alta. 3º lugar 31% (↓1pp, mas ainda lidera). Bipolarização CAI 78.1% (de 79.1%) — espaço ligeiramente aberto. STF IMPEACH SOBE 12.5% (↑1pp) — combustível anti-STF volta. Vorcaro R$520M para Graeff (MSN 19/Abr) — escândalo aprofunda. BRB liquidez zero (O Globo 20/Abr). 2ª Turma STF avalia prisões BRB (Correio Braziliense). STF racha interno (MSN). Crise representatividade eco 2012 (Estadão/RenovaBR). MAS: Caiado-Kassab (PSD puro) fragmenta 3ª via. Zema volta 3.8% (outro competidor). Augusto Cury corteja empresários (Folha)." },
  { name: "Fernando Haddad", party: "PT", age: 63, role: "Pré-candidato Gov. SP", polymarket: "4.15%", poll: "Paraná Pesquisas SP: Tarcísio lidera, diferença CAI", position: "Centro-esquerda. Lula convenceu a disputar governo de SP. Fora da corrida presidencial.", risk: "4.15% Poly (↑0.05pp, quase estável). ATACA BOLSONARO: 'Taxação do Pix foi ideia de Bolsonaro' (Conexão Política 20/Abr) — peça de debate econômico. PT RJ consolidado: Paes + Benedita Senado (Folha/G1 19-20/Abr). Diário Centro Mundo (19/Abr): 'Lula diminui gap em SP'. Revista Fórum: 'Lula cresce em SP'. 2º lugar Poly: 4.5% (↓0.1pp). Paraná Pesquisas SP mantida: Tarcísio lidera mas diferença cai." },
  { name: "Ronaldo Caiado", party: "PSD", age: 76, role: "Ex-Gov. Goiás (renunciou 4/Abr)", polymarket: "1.9%", poll: "6% 1T (Quaest) / 5% (Datafolha)", position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.", risk: "1.9% Poly (↓0.05pp, quase estável). APOIA KASSAB COMO VP — PSD CHAPA PURA (Gazeta do Povo 20/Abr) — GRANDE MOVIMENTO DO DIA. Consolida aliança com presidente do PSD, chapa homogênea, não precisa alianças externas frágeis. PSD Senado DISPARA: 5.1% → 7.15% (↑2.05pp) — mercado precifica força PSD. Rejeição 32% — 2ª menor. ACM Neto apoio. 'Exército de prefeitos'. Ciro Gomes articulação anterior mantida." },
  { name: "Romeu Zema", party: "Novo", age: 56, role: "Ex-Gov. Minas Gerais (renunciou 4/Abr)", polymarket: "3.8%", poll: "3% 1T (Quaest) / 4% (Datafolha)", position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.", risk: "3.8% Poly (↑1.55pp de 2.25%) — VOLTA A SUBIR presidencial, reverte desinflação de ontem. MAS 3º lugar CAI: 17% (↓2pp de 19%) — sinal DIVIDIDO: sobe 1T, desce 3º (mercado reavalia como 1T autônomo em vez de 3ª via). Rejeição Quaest 31% — MENOR de todos. STF TRAVA GOV MG DE NOVO (Estado de Minas 20/Abr) — pressão institucional sobre seu estado. Partido Novo Senado 0.45%." },
  { name: "Tarcísio de Freitas", party: "Republicanos", age: 51, role: "Governador de São Paulo", polymarket: "0.35%", poll: "Paraná Pesquisas SP: LIDERA gov, mas diferença cai sobre Haddad", position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.", risk: "0.35% Poly (estável). Tarcísio reafirma (MSN 20/Abr): 'Flávio pode vencer Lula no 1º turno'. 3º lugar Poly SOBE: 1.65% (↑0.9pp de 0.75%) — mercado reavalia como 3ª via potencial. Paraná Pesquisas SP mantida: Tarcísio à frente Haddad mas diferença cai." },
];

export function CandidatesSection() {
  const { t } = useTranslation();
  return (
    <section>
      <SectionTitle icon="👤">{t('sections.candidates')}</SectionTitle>
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
