import type { CandidateProfile } from '../types';
import { partyColor } from '../lib/utils';
import { SectionTitle, Card } from './ui';
import { LogicLink } from './LogicLink';
import { useTranslation } from '../i18n/context';

const candidates: CandidateProfile[] = [
  { name: "Lula", party: "PT", age: 80, role: "Presidente da República", polymarket: "38.5%", poll: "Paraná RJ 1T 36.7% / 2T 40.5% (CNN+VEJA+Metrópoles 25/Abr) / Quaest 2T 40 mantido", position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato.", risk: "38.5% Poly (↑3pp de 35.5% manhã) — **RETOMA LIDERANÇA**, gap INVERTE +0.35pp a favor de Lula (era -4.15pp Flávio manhã). **2º lugar Poly Lula CEDE leve: 17% (↓1.5pp de 18.5%)**. **Lula pede para PT não correr atrás dos adversários** (G1 25/Abr 01:40) — postura defensiva valida. **Tarcísio critica 'lideranças envelhecidas'** (Gazeta Povo 25/Abr 23:05) — indireto. Lula e Flávio sem palanques em MG, aliados impacientes (Metrópoles 25/Abr 18:29). MAS: **STF impeach NOVA MÁXIMA HISTÓRICA 15.5% (↑1.5pp de 14%)** — risco institucional maior do ciclo. Paraná RJ adversa mantida. PT gasta R$147 mil contra Flávio mantido. Lula queda Nordeste mantido." },
  { name: "Flávio Bolsonaro", party: "PL", age: 45, role: "Senador (RJ)", polymarket: "38.15%", poll: "Paraná RJ 1T 39.6% / 2T 47% / Quaest 2T 42% mantido", position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.", risk: "38.15% Poly (↓1.5pp de 39.65% manhã) — **PERDE LIDERANÇA**, Lula retoma com gap +0.35pp (era +4.15pp Flávio). 2º lugar 67% (↓0.5pp). **3º lugar volta a subir: 7.2% (↑3.55pp de 3.65%)** — mercado reativa fallback. **PL Senado RECUPERA TOTALMENTE: 82% (↑4.5pp de 77.5%)** — devolve queda. **'Flávio Bolsonaro chama unidade da direita'** (Terra 25/Abr 19:33) — tentativa de coalizão. **Folha: 'Flávio tem obstáculos a vencer até as urnas'** (25/Abr 18:30). André do Prado quer Eduardo Bolsonaro vice Senado SP (Estadão 25/Abr 15:48) — chapa SP. Trump chama Polymarket 'cassino' (Portal do Bitcoin 25/Abr 17:07)." },
  { name: "Renan Santos", party: "Missão", age: 35, role: "Fundador do MBL", polymarket: "5.45%", poll: "4.4% 1T (AtlasIntel prev.) / N/A Quaest", position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.", risk: "5.45% Poly (estável vs manhã). 3º lugar Renan 27.5% (estável) × Zema 37.5% × Caiado 23% (↓3pp de 26%). **STF IMPEACH NOVA MÁXIMA HISTÓRICA: 15.5% (↑1.5pp)** — combustível anti-STF no maior nível do ciclo. **Van Hattem ataca STF: 'quer escolher quem participa das eleições'** (Gazeta Povo 25/Abr 14:36) — narrativa anti-Corte amplifica. Bomba atômica delação Vorcaro mantida. STF mantém prisão BRB unanimidade mantido. 8º dia consecutivo sem peça pública." },
  { name: "Fernando Haddad", party: "PT", age: 63, role: "Pré-candidato Gov. SP", polymarket: "3.25%", poll: "Primeira Quaest SP Tarcísio × Haddad publicada (VEJA 23/Abr)", position: "Centro-esquerda. Lula convenceu a disputar governo de SP. Fora da corrida presidencial.", risk: "3.25% Poly (↓0.1pp leve). **2º lugar Poly Haddad RECUPERA 3.2% (↑0.5pp de 2.7%)** — volatilidade extrema continua. 3º lugar 3.15% (↓0.1pp). PT Senado 3.8% (↑0.1pp). André do Prado quer Eduardo Bolsonaro Senado SP (Estadão 25/Abr) — disputa SP fechando contra PT. **Lula e Haddad sem palanques em MG** (Metrópoles 25/Abr 18:29). Quaest 4 novas para 30/Abr publicação podem incluir SP." },
  { name: "Ronaldo Caiado", party: "PSD", age: 76, role: "Ex-Gov. Goiás (renunciou 4/Abr)", polymarket: "1.85%", poll: "6% 1T (Quaest 15/Abr) / 5% (Datafolha)", position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.", risk: "1.85% Poly (estável). **3º lugar Poly DEVOLVE leve: 23% (↓3pp de 26%)** — mas mantém posição forte como 3ª alternativa. PSD Senado RECUPERA 5.2% (↑0.85pp). **Caiado defende 'CONVERGÊNCIA' centro-direita** (Estadão 25/Abr 22:15) — narrativa coalizão amplifica do dia. 'Direita vê STF como trunfo, Lula cautela' mantido (CartaCapital). Pode capturar voto de Flávio que 'tem obstáculos' (Folha 25/Abr)." },
  { name: "Romeu Zema", party: "Novo", age: 56, role: "Ex-Gov. Minas Gerais (renunciou 4/Abr)", polymarket: "9.2%", poll: "3% 1T (Quaest) / 4% (Datafolha) / Primeira Quaest MG gov em digestão", position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.", risk: "9.2% Poly (↓0.4pp de 9.6%) — segue abaixo dos 10%. 3º lugar 37.5% (↓0.5pp leve). 2º lugar Poly Zema sobe 3.35% (↑0.85pp). **STF impeach NOVA MÁXIMA 15.5%** — combustível anti-STF maior do ciclo beneficia Zema. Van Hattem critica STF mantido (Gazeta Povo 25/Abr). 'Direita vê STF como trunfo' (CartaCapital 25/Abr). Zema universidade mantido. **Lula e Flávio sem palanques em MG** (Metrópoles) — abre espaço para Zema dominar narrativa MG." },
  { name: "Tarcísio de Freitas", party: "Republicanos", age: 51, role: "Governador de São Paulo", polymarket: "0.25%", poll: "Paraná Pesquisas SP: LIDERA gov / Primeira Quaest SP publicada 23/Abr", position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.", risk: "0.25% Poly (estável). **TARCÍSIO CRITICA 'LIDERANÇAS ENVELHECIDAS'** (Gazeta Povo 25/Abr 23:05) — indireto contra Lula, marca posição. **André do Prado quer Eduardo Bolsonaro como vice Senado SP** (Estadão 25/Abr 15:48) — chapa bolsonarismo SP fechando completamente. 'Chapa pura bolsonarismo' SP mantido (CartaCapital 24/Abr)." },
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
