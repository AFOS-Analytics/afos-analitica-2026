import type { CandidateProfile } from '../types';
import { partyColor } from '../lib/utils';
import { SectionTitle, Card } from './ui';
import { LogicLink } from './LogicLink';
import { useTranslation } from '../i18n/context';

const candidates: CandidateProfile[] = [
  { name: "Lula", party: "PT", age: 80, role: "Presidente da República", polymarket: "37.5%", poll: "Vox SP 2T Flávio 50.4% × 38.1% (Poder360) / Paraná RJ 2T 40.5% / Quaest 2T 40", position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato.", risk: "37.5% Poly (↓1pp de 38.5%) — **CAI**, gap -1.65pp Flávio AMPLIA (era -0.3pp). 2º lugar Lula 17% (↑0.5pp leve). **PT LANÇA MANIFESTO 2026 com foco em soberania, ACENA AO CENTRO** (Correio+Terra+G1) — Lula ausente. **PT 90% infraestrutura campanha pronta** (Blog Esmael) + **PT conta 12 plataformas regionais** (Poder360 20:53). **Camilo Santana: 'Lula subirá rampa pela 4ª vez'** (OpiniãoCE 21:14) — apoio explícito. **Haddad chama Flávio 'Bolsonarinho'** (Folha 22:12). MAS: **VOX SP 2T Flávio 50.4% × Lula 38.1%** (Poder360 17:00). **STF impeach NOVA MÁXIMA HISTÓRICA 16% (↑1pp)**. **Valor: 'centrão prevê fim da calmaria para Flávio com Lula crescendo'** (Valor Econômico 14:17) — narrativa de competitividade." },
  { name: "Flávio Bolsonaro", party: "PL", age: 45, role: "Senador (RJ)", polymarket: "39.15%", poll: "**VOX SP 2T 50.4%** (Poder360 26/Abr) / Paraná RJ 1T 39.6% / 2T 47% / Quaest 2T 42%", position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.", risk: "39.15% Poly (↑0.35pp de 38.8%) — **AMPLIA LIDERANÇA**, gap -1.65pp Flávio (era -0.3pp). **PL Senado RECUPERA FORTE 83.5% (↑4pp de 79.5%)**. 2º lugar Flávio 63% (↓3pp — devolve). **3º lugar Flávio 4.45% (↑0.8pp)**. **VOX SP 2T 50.4% × Lula 38.1%** mantido — 2ª pesquisa estadual grande favorável. **'O Pix é nosso'** mantido. **Tarcísio lidera SP 48.2%** (Poder360 14:47) — chapa SP fortalecida. MAS: 'Reforma tributária campo minado' (Folha mantido). **Valor: 'centrão prevê fim da calmaria para Flávio'** (14:17). Bloco centrão pode girar contra (Senado PSD/MDB despencam)." },
  { name: "Renan Santos", party: "Missão", age: 35, role: "Fundador do MBL", polymarket: "5.3%", poll: "4.4% 1T (AtlasIntel prev.) / N/A Quaest", position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.", risk: "5.3% Poly (↓0.05pp). **3º LUGAR — RENAN PERDE 2ª POSIÇÃO**: Caiado 27% > Renan 25% (Renan ↓3pp de 28%, **CAIADO ULTRAPASSA RENAN PELA 1ª VEZ no 3º lugar**). Zema mantém liderança 37.5%. **STF impeach NOVA MÁXIMA HISTÓRICA 16% (↑1pp de 15%)** — combustível anti-STF maior do ciclo. Empresa Vorcaro R$1bi mantido. Comissão Senado cancela Vorcaro terça mantido. Líder oposição rejeição Messias mantido. **10º dia consecutivo SEM peça pública**." },
  { name: "Fernando Haddad", party: "PT", age: 63, role: "Pré-candidato Gov. SP", polymarket: "3.35%", poll: "Tarcísio lidera SP 48.2% × Haddad ~28% em 2T (Poder360 26/Abr 14:47)", position: "Centro-esquerda. Lula convenceu a disputar governo de SP. Fora da corrida presidencial.", risk: "3.35% Poly (estável). **2º lugar Poly Haddad 2.4% (↓0.15pp)**. 3º lugar 3.25% (estável). **PT Senado DESPENCA 1% (↓2.6pp de 3.6%)** — colapso. **HADDAD chama Flávio 'Bolsonarinho'** (Folha 22:12). **TARCÍSIO LIDERA SP 48.2% gov** (Poder360 26/Abr) — adverso. Marina+Derrite+Tebet+Do Prado empatados Senado SP." },
  { name: "Ronaldo Caiado", party: "PSD", age: 76, role: "Ex-Gov. Goiás (renunciou 4/Abr)", polymarket: "1.85%", poll: "6% 1T (Quaest 15/Abr) / 5% (Datafolha)", position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.", risk: "1.85% Poly (estável). **3º LUGAR DESTAQUE: Caiado 27% (↑0.5pp) — ULTRAPASSA RENAN (25%) PELA 1ª VEZ no 3º lugar**. PSD Senado **DESPENCA 3.85% (↓2.1pp de 5.95%)** — colapso centrão legislativo. Caiado 'convergência centro-direita' mantido. **'Próxima Quaest gov GO+Senado'** (CartaCapital 17:52) — radar Caiado aquece amanhã. Pré-candidatos visitam feira agro mantido — Caiado forte no setor." },
  { name: "Romeu Zema", party: "Novo", age: 56, role: "Ex-Gov. Minas Gerais (renunciou 4/Abr)", polymarket: "9.85%", poll: "3% 1T (Quaest) / 4% (Datafolha) / Primeira Quaest MG gov em digestão", position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.", risk: "9.85% Poly (↑0.7pp de 9.15%) — quase volta dos 10%. **3º lugar 37.5% (↑1.5pp — REFORÇA LIDERANÇA)**. **2º lugar Zema 4.15% (↑0.8pp)**. **STF IMPEACH NOVA MÁXIMA HISTÓRICA 16%** — combustível anti-STF maior do ciclo beneficia Zema. **ZEMA PROMETE PRIVATIZAR PETROBRAS E BANCO DO BRASIL SE ELEITO** (Poder360 19:31) mantido — programa concreto. **'Terceira via acumula derrotas'** (Folha+Bahia Notícias) — análise estrutural mas Zema mantém liderança 3ª via." },
  { name: "Tarcísio de Freitas", party: "Republicanos", age: 51, role: "Governador de São Paulo", polymarket: "0.25%", poll: "**TARCÍSIO LIDERA SP gov 48.2% (Poder360 26/Abr 14:47)**", position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.", risk: "0.25% Poly (estável). **TARCÍSIO LIDERA SP gov 48.2%** (Poder360 26/Abr 14:47) — número estadual cheio. **Tarcísio 'lideranças envelhecidas'** mantido (GZH). 'Chapa pura bolsonarismo' SP mantido. Marina+Derrite+Tebet+Do Prado empatados Senado SP." },
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
