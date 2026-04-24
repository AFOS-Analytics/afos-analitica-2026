import type { CandidateProfile } from '../types';
import { partyColor } from '../lib/utils';
import { SectionTitle, Card } from './ui';
import { LogicLink } from './LogicLink';
import { useTranslation } from '../i18n/context';

const candidates: CandidateProfile[] = [
  { name: "Lula", party: "PT", age: 80, role: "Presidente da República", polymarket: "38.5%", poll: "AtlasIntel nova (CartaCapital/VEJA 24/Abr) / 40% 2T Quaest / 68% Teresina", position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato.", risk: "38.5% Poly (estável) — **MANTÉM LIDERANÇA** com gap +0.45pp (encurtou leve de +0.55pp, Flávio subiu 38.05%). **2º lugar Poly Lula DEVOLVE salto: 17.5% (↓4.5pp de 22%)** — mercado reverte parcialmente alta inédita. AtlasIntel continua digerindo (VEJA 24/Abr 11:56, Termômetro da Política 24/Abr 13:38). Lula prepara 'munição contra família do adversário' (Estadão 24/Abr 12:30). Revista Fórum: Lula expõe adversários (24/Abr 07:53). Xeque-mate: Lula decidirá se Flávio será investigado por crime contra honra (plantaobrasil 23/Abr) — novo vetor judicial. **AI PROFILE ATTACKS contra Lula targeted for removal** (Folha 24/Abr 02:26) — novo vetor. MAS: Tarcísio afirma Flávio pode vencer 1º turno (MSN 23/Abr). Gap encurta." },
  { name: "Flávio Bolsonaro", party: "PL", age: 45, role: "Senador (RJ)", polymarket: "38.05%", poll: "42% 2T Quaest (23/Abr) / 42.2% RS / SP à frente / AtlasIntel em digestão", position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.", risk: "38.05% Poly (↑0.1pp de 37.95%) — **CONTINUA RECUPERANDO** gradualmente, 2º dia consecutivo de alta. **2º lugar RECUPERA FORTE: 66% (↑6.5pp de 59.5%)** — mercado reverte preocupação. **TARCÍSIO REVERTE**: afirma que 'Flávio pode vencer Lula no 1º turno' (MSN 23/Abr 19:36) — **inflexão estratégica** após 2 dias de distanciamento. O Globo: União-PP progresso para Flávio (24/Abr 09:01). **PL Senado CAI MAIS: 80% (↓2pp de 82% — queda 3pp em 2 dias)**. Campanhas preparam 'munição contra família do adversário' (Estadão 24/Abr). MAS: MG 'campo minado' mantido. Rejeição candidatos em análise (Gazeta Povo 24/Abr 09:02)." },
  { name: "Renan Santos", party: "Missão", age: 35, role: "Fundador do MBL", polymarket: "5.45%", poll: "4.4% 1T (AtlasIntel prev.) / N/A Quaest", position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.", risk: "5.45% Poly (↓0.2pp de 5.65%) — 3º dia consecutivo de queda. **Zema PRESIDENCIAL DISPARA 9.15% (↑2.2pp)** — agora supera Renan no presidencial também, não só no 3º lugar. 3º lugar Renan 26.5% × Zema 31% — gap mantido 4.5pp. STF impeach Poly **NOVA MÁXIMA 14% (↑1.5pp — supera pico 13.5% de 21/Abr)** — tema anti-STF aquece e é ocupado por Zema. Renan SEM peça pública pelo 5º dia consecutivo. Espaço anti-establishment erodindo para Zema estruturalmente." },
  { name: "Fernando Haddad", party: "PT", age: 63, role: "Pré-candidato Gov. SP", polymarket: "3.05%", poll: "Primeira Quaest SP Tarcísio × Haddad publicada (VEJA + O Globo 23/Abr)", position: "Centro-esquerda. Lula convenceu a disputar governo de SP. Fora da corrida presidencial.", risk: "3.05% Poly (↓0.2pp de 3.25%) — presidencial recua. **2º lugar Poly Haddad DESPENCA: 0.225% (↓5pp de 5.3%)** — mercado ZERA cenário alternativo, devolve inteiramente o salto inédito. 3º lugar 3.55% (↓0.2pp). PT Senado 3.6% estável. **Primeira Quaest SP Tarcísio × Haddad publicada** (VEJA 23/Abr 22:42, O Globo 17:01). Volatilidade confirmada — salto de 22/Abr era ruído de curto prazo, não reprecificação estrutural." },
  { name: "Ronaldo Caiado", party: "PSD", age: 76, role: "Ex-Gov. Goiás (renunciou 4/Abr)", polymarket: "2.1%", poll: "6% 1T (Quaest 15/Abr) / 5% (Datafolha)", position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.", risk: "2.1% Poly (↑0.05pp — estável) — sem movimento. **PSD Senado 5.5% (↑0.1pp)** — mantém recuperação. Sem peça pública nova do dia. O Globo registra 'PSD para Lula' na dinâmica de alianças (24/Abr 09:01) — movimento que pode afastar Caiado da trajetória de vice próximos ao governo. Aécio propõe aliança Ciro CE (Gazeta Povo 22/Abr mantido)." },
  { name: "Romeu Zema", party: "Novo", age: 56, role: "Ex-Gov. Minas Gerais (renunciou 4/Abr)", polymarket: "9.15%", poll: "3% 1T (Quaest) / 4% (Datafolha) / Primeira Quaest MG gov em digestão", position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.", risk: "9.15% Poly (↑2.2pp de 6.95%) — **DISPARA PRESIDENCIAL**, consolidação 3ª via agora bate presidencial também, não só 3º lugar. **CNN Brasil destaca: 'Zema supera Renan e é 3º mais provável presidente'** (24/Abr 01:34) — midia dominante valida. **Zema se distingue de Flávio, critica STF** (Folha 24/Abr 01:02) — marca distância tática mantendo narrativa anti-Corte. 3º lugar Zema 31% × Renan 26.5% — gap 4.5pp mantido. STF impeach 14% NOVA MÁXIMA — combustível anti-STF pico do ciclo beneficia Zema. Primeira Quaest MG governo (VEJA 23/Abr) em digestão." },
  { name: "Tarcísio de Freitas", party: "Republicanos", age: 51, role: "Governador de São Paulo", polymarket: "0.25%", poll: "Paraná Pesquisas SP: LIDERA gov / Primeira Quaest SP publicada 23/Abr", position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.", risk: "0.25% Poly (↓0.1pp de 0.35%). **INFLEXÃO ESTRATÉGICA**: Tarcísio afirma 'Flávio pode vencer Lula no 1º turno' (MSN 23/Abr 19:36) — reverte distância dos últimos 2 dias, **ALINHA-SE publicamente a Flávio**. Primeira Quaest SP Tarcísio × Haddad publicada (VEJA 23/Abr 22:42) — cenário SP aquece. Movimento político denso: pode impactar PL-Republicanos-centrão." },
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
