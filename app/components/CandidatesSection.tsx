import type { CandidateProfile } from '../types';
import { partyColor } from '../lib/utils';
import { SectionTitle, Card } from './ui';
import { LogicLink } from './LogicLink';
import { useTranslation } from '../i18n/context';

const candidates: CandidateProfile[] = [
  { name: "Lula", party: "PT", age: 80, role: "Presidente da República", polymarket: "35.5%", poll: "Paraná RJ 1T 36.7% × Flávio 39.6% / 2T 40.5% × Flávio 47% (Metrópoles+Exame+CNN 25/Abr)", position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato.", risk: "35.5% Poly (estável — 2º dia em 35.5%) — gap com Flávio AMPLIA -4.15pp (era -3.3pp), Flávio sobe 39.65% (3º dia subindo). 2º lugar Poly Lula CEDE 18.5% (↓1.5pp de 20%). **PARANÁ RJ DIVULGADA: 1T Lula 36.7% × Flávio 39.6%; 2T Lula 40.5% × Flávio 47%** (Metrópoles+Exame+CNN 25/Abr 11:00) — primeiro estadual grande com Flávio à frente. **PT GASTA R$147 MIL EM OFENSIVA CONTRA FLÁVIO** (Poder360 25/Abr 15:31) — campanha aquece. Quase metade do RJ avalia Lula negativamente (Poder360). **PT reage após vídeo Janja com Lula provocar crise** (Portal Área VIP 25/Abr 09:06) — gestão de imagem. Lula adota cautela embate STF (CartaCapital 25/Abr). Lula queda apoio Nordeste (Diário do Estado 25/Abr 09:28). MAS: BBC+MSN 25/Abr — escolha Trump como adversário fortalece Lula." },
  { name: "Flávio Bolsonaro", party: "PL", age: 45, role: "Senador (RJ)", polymarket: "39.65%", poll: "Paraná RJ 1T 39.6% / 2T 47% (CNN+VEJA+Metrópoles+SBT 25/Abr) / Quaest 42% 2T mantido", position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.", risk: "39.65% Poly (↑0.85pp de 38.8%) — **3º DIA CONSECUTIVO DE ALTA**, gap +4.15pp a favor de Flávio (amplia de +3.3pp). **2º lugar RECUPERA MAIS 67.5% (↑3pp)**. **PARANÁ RJ ESPETACULAR**: 1T 39.6% × Lula 36.7%, **2T Flávio 47% × Lula 40.5%** (CNN Brasil+VEJA+Metrópoles+SBT 25/Abr 11:00) — 1º estadual grande com Flávio à frente. **'Direita vê embate com STF como trunfo'** (CartaCapital 25/Abr 11:00). **'Flávio promete soltar Bolsonaro e assusta o centro'** (Blog do Esmael 25/Abr 10:37) — risco de rejeição. PL Senado CAI MAIS 77.5% (↓4.5pp de 82%) — queda 5.5pp em 3 dias. Tarcísio 'chapa pura' SP (CartaCapital 24/Abr mantido). PT gasta R$147 mil contra Flávio (Poder360 25/Abr)." },
  { name: "Renan Santos", party: "Missão", age: 35, role: "Fundador do MBL", polymarket: "5.45%", poll: "4.4% 1T (AtlasIntel prev.) / N/A Quaest", position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.", risk: "5.45% Poly (↓0.1pp de 5.55%) — leve queda. 3º lugar Renan 27.5% × Zema 38% × **Caiado 26% (↑9.5pp de 16.5%)** — **CAIADO QUASE EMPATA RENAN**, 3 candidatos disputam o 3º lugar. STF impeach 14% estável (3º dia em máxima). **STF mantém prisão ex-presidente BRB POR UNANIMIDADE** (Paraná Central 25/Abr 03:13). **'Bomba atômica': Relator CPMI INSS alerta para delação devastadora de Vorcaro** (Jornal da Cidade Online 25/Abr 12:57) — material anti-establishment forte mas Renan continua silencioso pelo 7º dia consecutivo." },
  { name: "Fernando Haddad", party: "PT", age: 63, role: "Pré-candidato Gov. SP", polymarket: "3.35%", poll: "Primeira Quaest SP Tarcísio × Haddad publicada (VEJA+O Globo 23/Abr)", position: "Centro-esquerda. Lula convenceu a disputar governo de SP. Fora da corrida presidencial.", risk: "3.35% Poly (↑0.7pp de 2.65%) — **RECUPERA presidencial**. **2º lugar Poly DEVOLVE: 2.7% (↓0.65pp de 3.35%)** — volatilidade extrema confirmada (6.1% → 0.225% → 3.35% → 2.7% em 96h). 3º lugar 3.25% (estável). PT Senado 3.7% (↑0.1pp). Tarcísio 'chapa pura bolsonarismo' SP mantido (CartaCapital). PT gasta R$147 mil ofensiva contra Flávio (Poder360 25/Abr) — 4 Quaest novas para 30/Abr publicação podem incluir SP." },
  { name: "Ronaldo Caiado", party: "PSD", age: 76, role: "Ex-Gov. Goiás (renunciou 4/Abr)", polymarket: "1.85%", poll: "6% 1T (Quaest 15/Abr) / 5% (Datafolha)", position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.", risk: "1.85% Poly (↓0.05pp de 1.9%) — presidencial estável. **3º LUGAR POLY DISPARA AINDA MAIS: 26% (↑9.5pp de 16.5%) — QUASE EMPATA RENAN (27.5%)** e fica próximo de Zema (38%). 3 candidatos no 3º lugar agora. PSD Senado 4.35% (↓0.65pp). Caiado 'quebrar polarização por coalizões' (CBN 24/Abr mantido). 'Direita vê embate STF como trunfo' (CartaCapital 25/Abr) — espaço alternativo amplifica narrativa Caiado." },
  { name: "Romeu Zema", party: "Novo", age: 56, role: "Ex-Gov. Minas Gerais (renunciou 4/Abr)", polymarket: "9.6%", poll: "3% 1T (Quaest) / 4% (Datafolha) / Primeira Quaest MG gov em digestão", position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.", risk: "9.6% Poly (↓0.85pp de 10.45%) — devolve parte do salto, **volta abaixo dos 10%**. 3º lugar 38% (↓0.5pp — leve correção). MAS: **Caiado 26% (↑9.5pp)** ameaça espaço. **Zema sobre greves universitárias** (Folha 25/Abr) — pauta gestão estadual. 'Pela tese de Gilmar, criticar Zema = atacar Minas' (Estadão 24/Abr mantido). Van Hattem critica STF (Gazeta Povo 25/Abr) — narrativa STF mantida. STF impeach 14% estável (combustível mantido)." },
  { name: "Tarcísio de Freitas", party: "Republicanos", age: 51, role: "Governador de São Paulo", polymarket: "0.25%", poll: "Paraná Pesquisas SP: LIDERA gov / Primeira Quaest SP publicada 23/Abr", position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.", risk: "0.25% Poly (estável). **Tarcísio apoia André do Prado para Senado SP** (G1 24/Abr) — 'excelente escolha'. 'Chapa pura bolsonarismo' SP (CartaCapital 24/Abr mantido) — Tarcísio + Flávio + PL como eixo único consolidado. Primeira Quaest SP Tarcísio × Haddad publicada (VEJA mantido)." },
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
