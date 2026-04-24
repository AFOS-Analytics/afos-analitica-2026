import type { CandidateProfile } from '../types';
import { partyColor } from '../lib/utils';
import { SectionTitle, Card } from './ui';
import { LogicLink } from './LogicLink';
import { useTranslation } from '../i18n/context';

const candidates: CandidateProfile[] = [
  { name: "Lula", party: "PT", age: 80, role: "Presidente da República", polymarket: "35.5%", poll: "AtlasIntel nova em digestão (VEJA 24/Abr) / 40% 2T Quaest / 68% Teresina", position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato.", risk: "35.5% Poly (↓3pp de 38.5%) — **PERDE LIDERANÇA**: Flávio ultrapassa 38.8% (↑0.75pp), gap INVERTE para -3.3pp (era +0.45pp manhã). 2º lugar Poly Lula RECUPERA levemente 20% (↑2.5pp). **CONTEXTO MACRO: Governo proíbe Kalshi e Polymarket no Brasil** (Folha 24/Abr 15:42) — evento estrutural, mas API segue ativa via Vercel. **AtlasIntel em digestão** (VEJA 24/Abr + InfoMoney 24/Abr 18:48 + ND Mais 24/Abr 19:07). **Haddad mobiliza SP, enquadra Flávio como 'risco democrático'** (Valor Econômico 24/Abr 10:00). Lula decidirá investigação Flávio crime contra honra (plantaobrasil). PT abre Congresso com divergência sobre reforma Judiciário e Forças Armadas (SBT News 24/Abr 15:33) — rachadura interna. Aos Fatos desmente boato 'Lula Cuba' (Aos Fatos 24/Abr 18:06). MAS: PT Rio apoia Paes 53% (CNN+Paraná)." },
  { name: "Flávio Bolsonaro", party: "PL", age: 45, role: "Senador (RJ)", polymarket: "38.8%", poll: "42% 2T Quaest (23/Abr) / 42.2% RS / SP à frente / AtlasIntel em digestão", position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.", risk: "38.8% Poly (↑0.75pp de 38.05%) — **ULTRAPASSA LULA E ASSUME LIDERANÇA**, gap +3.3pp a favor de Flávio (era -0.45pp manhã). **PL Senado RECUPERA 82% (↑2pp de 80%)**. 2º lugar Poly 64.5% (↓1.5pp). **3º lugar Flávio SOBE 9.1% (↑6.05pp de 3.05%)** — mercado precifica fallback. **Tarcísio define chapa pura do bolsonarismo em SP** (CartaCapital 24/Abr 18:00) — consolida aliança, reforça inflexão de ontem. Salles + Derrite aliança informal Senado SP (SBT News 24/Abr 16:04). Caiado quebrar polarização por coalizões (CBN 24/Abr 18:09). O Globo: União-PP avança para Flávio (mantido). Campanhas preparam 'munição contra família adversária' (Estadão)." },
  { name: "Renan Santos", party: "Missão", age: 35, role: "Fundador do MBL", polymarket: "5.55%", poll: "4.4% 1T (AtlasIntel prev.) / N/A Quaest", position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.", risk: "5.55% Poly (↑0.1pp de 5.45%) — leve recuperação após 3 dias de queda. 3º lugar Renan 27% × **Zema 38.5% (↑7.5pp) — gap amplia MUITO para 11.5pp** (era 4.5pp manhã). Zema presidencial 10.45% (↑1.3pp). Renan presidencial continua atrás de Zema. STF impeach 14% estável (nova máxima mantida). **PF apura se Vorcaro beneficiou Moraes com imóveis de luxo** (SeLigaPB 24/Abr 19:05) — material anti-establishment novo, mas narrativa continua ocupada por Zema. 6º dia consecutivo sem peça pública." },
  { name: "Fernando Haddad", party: "PT", age: 63, role: "Pré-candidato Gov. SP", polymarket: "2.65%", poll: "Primeira Quaest SP Tarcísio × Haddad publicada (VEJA+O Globo 23/Abr)", position: "Centro-esquerda. Lula convenceu a disputar governo de SP. Fora da corrida presidencial.", risk: "2.65% Poly (↓0.4pp de 3.05%) — presidencial cede. **2º lugar Poly RECUPERA VIOLENTAMENTE: 3.35% (↑3.1pp de 0.225%)** — mercado devolve parte do despenque, volatilidade extrema confirmada. 3º lugar 3.25% (↓0.3pp). **HADDAD MOBILIZA SP, enquadra Flávio como 'risco democrático'** (Valor Econômico 24/Abr 10:00) — peça pública forte. Tarcísio define chapa pura bolsonarismo SP (CartaCapital) — confronto direto amplificado. Primeira Quaest SP Tarcísio × Haddad em digestão." },
  { name: "Ronaldo Caiado", party: "PSD", age: 76, role: "Ex-Gov. Goiás (renunciou 4/Abr)", polymarket: "1.9%", poll: "6% 1T (Quaest 15/Abr) / 5% (Datafolha)", position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.", risk: "1.9% Poly (↓0.2pp de 2.1%) — presidencial cede leve. **3º LUGAR POLY EXPLODE: 16.5% (↑15.45pp de 1.55%!!!)** — entrada massiva inédita, mercado precifica fortemente Caiado como 3º colocado alternativo. PSD Senado 5% (↓0.5pp de 5.5%). **CAIADO DEFENDE: 'quebrar polarização por coalizões'** (CBN 24/Abr 18:09) — peça pública do dia, posicionamento centrão. Augusto Cury lateral mantido." },
  { name: "Romeu Zema", party: "Novo", age: 56, role: "Ex-Gov. Minas Gerais (renunciou 4/Abr)", polymarket: "10.45%", poll: "3% 1T (Quaest) / 4% (Datafolha) / Primeira Quaest MG gov em digestão", position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.", risk: "10.45% Poly (↑1.3pp de 9.15%) — **PASSA DOS 10% PELA 1ª VEZ NO CICLO**, continua disparando. **3º lugar AMPLIA: 38.5% (↑7.5pp) × Renan 27% — gap 11.5pp** (era 4.5pp manhã). **'Pela tese de Gilmar Mendes, criticar Zema seria atacar Minas'** (Estadão 24/Abr 15:00) — narrativa institucional polêmica no debate público. Zema discute eleições 2026 e futuro STF em Goiás (Jornal Opção 24/Abr 18:18) — expansão territorial. CNN Brasil mantido: 'Zema supera Renan'. STF impeach 14% estável." },
  { name: "Tarcísio de Freitas", party: "Republicanos", age: 51, role: "Governador de São Paulo", polymarket: "0.25%", poll: "Paraná Pesquisas SP: LIDERA gov / Primeira Quaest SP publicada 23/Abr", position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.", risk: "0.25% Poly (estável). **TARCÍSIO DEFINE 'CHAPA PURA DO BOLSONARISMO' EM SP** (CartaCapital 24/Abr 18:00) — **CONSOLIDA ALIANÇA ao projeto Flávio**, reforça inflexão de ontem (MSN 23/Abr). Salles + Derrite aliança informal Senado SP (SBT News 24/Abr). Movimento político maduro: Tarcísio SP + Flávio presidencial + PL como eixo único." },
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
