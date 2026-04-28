import type { CandidateProfile } from '../types';
import { partyColor } from '../lib/utils';
import { SectionTitle, Card } from './ui';
import { LogicLink } from './LogicLink';
import { useTranslation } from '../i18n/context';

const candidates: CandidateProfile[] = [
  { name: "Lula", party: "PT", age: 80, role: "Presidente da República", polymarket: "38.50%", poll: "**AtlasIntel/Bloomberg 28/Abr n=5000: 1T 46.6% LIDERA × Flávio 39.7% / 2T Valor Econ 47.5% × Flávio 47.8% (empate técnico)** | Aprovação 46.6-46.8% RECUPERA | Rejeição 51.3-52.5% (75% jovens)", position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato.", risk: "38.50% Poly (↑3.0pp de 35.5% — **RECUPERA FORTE**), gap -0.25pp Flávio = **EMPATE TÉCNICO POLYMARKET 1ª VEZ NO CICLO** (era -4.8pp). **2º LUGAR DISPARA 25.5% (↑8.5pp ESTRONDOSO de 17%)** — mercado precifica forte chegada Lula 2T. **AtlasIntel n=5000 publicada HOJE 1T Lula 46.6% × Flávio 39.7%** (LIDERA por 6.9pp em 1T) — InfoMoney+Gazeta Povo+CartaCapital 10:00. **2T Valor Econômico Flávio 47.8% × Lula 47.5%** (empate técnico mantido, Flávio numericamente à frente). 'Lula empata Flávio+Jair+Zema 2T' (CNN 18:38). **Aprovação RECUPERA 46.6-46.8%** (Cafezinho+Diário Estado+JOTA). **STF impeach RECUPERA 14% (↑3pp de 11%)**. **PT estratégia 'corrupção + entrega Flávio'** (Metrópoles 10:00). MAS: rejeição 51.3-52.5% AVANÇA, **75% entre jovens** (Blog BG)." },
  { name: "Flávio Bolsonaro", party: "PL", age: 45, role: "Senador (RJ)", polymarket: "38.75%", poll: "**AtlasIntel 28/Abr n=5000: 1T 39.7% × Lula 46.6% (atrás 6.9pp) / 2T Valor Econ 47.8% × Lula 47.5% empate técnico** | Forbes 'numericamente à frente 2T' | Rejeição 49.8% | Vox SP 2T 50.4% / Paraná RJ 2T 47%", position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.", risk: "38.75% Poly (↓1.55pp de 40.30% — **DEVOLVE topo dos 40%**). Gap -0.25pp = **EMPATE TÉCNICO POLY 1ª vez ciclo** (era -4.8pp). 2º lugar 63.5% (↓3pp). 3º lugar 5.35% (↑0.1pp estável). **PL Senado RECUPERA FORTE 85.5% (↑4pp de 81.5%)**. **União Senado DISPARA 11.25% (↑4.55pp)**. **AtlasIntel n=5000 publicada HOJE 1T Flávio 39.7% × Lula 46.6%** — atrás por 6.9pp em 1T. 2T Valor Econ 47.8% × 47.5% (Forbes 'numericamente à frente 2T'). Rejeição 49.8% (Pleno.News, abaixo Lula). **Flávio atua para evangélicos rejeitarem Messias** (G1 12:32). **PT estratégia 'corrupção + entrega Flávio'** (Metrópoles). **Renan 'sou candidato direita'** (BBC 07:38) — disputa votos. **Massa Ratinho Jr 3º DISPARA 7.10%** — outsider compete." },
  { name: "Renan Santos", party: "Missão", age: 35, role: "Fundador do MBL", polymarket: "6.35%", poll: "**'Sou o candidato da direita'** (BBC 28/Abr 07:38) — quebra silêncio 11 dias | Nexus 27/Abr 2T empate técnico Lula × Renan", position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.", risk: "6.35% Poly (↑0.85pp de 5.5%). **QUEBRA SILÊNCIO 11 DIAS**: 'Sou o candidato da direita' (BBC 07:38) — primeira fala estratégica. **3º lugar Renan 27.5% (↑1pp leve)** × Zema 39.5% (↓1pp) × Caiado 22.5% (↓1.5pp) × **Massa Ratinho Jr 7.10% DISPARA**. **STF impeach RECUPERA 14% (↑3pp)** — combustível anti-STF parcialmente restaurado. **Família Moraes processa A. Vieira por PCC** (SBT 15:47). **PF Vorcaro novos celulares + adia relatório foro** (SBT 14:43). MAS: **Ciro Nogueira: 'eleição margem erro, sem espaço 3ª via'** (Estadão 18:57). AtlasIntel disputa apertada Lula × Flávio absorve oxigênio mediático. Genial/Quaest MG (Cleitinho) + PE (João Campos) — espaço 3ª via fragmenta regionalmente." },
  { name: "Fernando Haddad", party: "PT", age: 63, role: "Pré-candidato Gov. SP", polymarket: "3.50%", poll: "Tarcísio LIDERA SP 48.2% mantido | AtlasIntel 1T Lula 46.6% beneficia por extensão | Aprovação Lula 46.6-46.8% RECUPERA", position: "Centro-esquerda. Lula convenceu a disputar governo de SP. Fora da corrida presidencial.", risk: "3.50% Poly (↓0.1pp leve). **2º lugar Poly DEVOLVE FORTE: 2.95% (↓2.85pp de 5.8% ontem)** — quase toda recuperação ontem se desfaz, volatilidade extrema continua. **Aprovação Lula RECUPERA 46.6-46.8%** beneficia Haddad por extensão. **MDB Senado SOBE 3.95%**. PT Senado estável 2.70%. **PT estratégia 'corrupção + entrega Flávio'** (Metrópoles). **Genial/Quaest PE 2T João Campos 46% × Raquel 38%** — aliado PSB-PT. MAS: Tarcísio LIDERA SP 48.2% mantido. **Senado SP Podemos: Tarcísio + Palumbo/Rufino** (InfoMoney+Poder360). **Rejeição Lula 75% jovens** (Blog BG) afeta Haddad por extensão." },
  { name: "Ronaldo Caiado", party: "PSD", age: 76, role: "Ex-Gov. Goiás (renunciou 4/Abr)", polymarket: "1.75%", poll: "**AtlasIntel 2T não cita Caiado** explicitamente | Próxima Quaest gov GO+Senado pendente", position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.", risk: "1.75% Poly (estável). **3º lugar Poly devolve 22.5% (↓1.5pp de 24%)** mantém forte. **PSD Senado leve recuo 6.40% (↓0.15pp)** — não capitaliza recuo Zema. **Massa Ratinho Jr 3º DISPARA 7.10%** — outsider centro-direita compete pelo espaço institucional. **AtlasIntel 2T não cita Caiado** explicitamente (CNN+Pleno+Forbes — apenas Lula × Flávio × Jair × Zema). **Ciro Nogueira: 'margem erro, sem 3ª via'** (Estadão) — pressão. STF impeach RECUPERA 14% — combustível anti-STF reativa parcialmente. **Aprovação Lula RECUPERA** reduz espaço alternativa centro-direita." },
  { name: "Romeu Zema", party: "Novo", age: 56, role: "Ex-Gov. Minas Gerais (renunciou 4/Abr)", polymarket: "7.90%", poll: "**AtlasIntel 28/Abr 2T: 'Lula empata com Zema'** (CNN+Pleno+Poder360) — viabilidade institucional 2T mantida | **Genial/Quaest MG Cleitinho LIDERA** (Kalil 5º) | Nexus 27/Abr 2T empate técnico", position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.", risk: "7.90% Poly (↓1.55pp de 9.45% — **CAI abaixo dos 8% pela 1ª vez no ciclo recente, PERDE liderança 3ª via**). **3º lugar PERDE 39.5% (↓1pp de 40.5% — topo absoluto eroded)**. 2º lugar 2.20% (↓1.25pp). **AtlasIntel 2T MANTÉM 'Lula empata Zema'** (CNN 18:38, Pleno 11:50, Poder360 10:01) — viabilidade institucional 2T preservada. **Genial/Quaest MG Cleitinho LIDERA** todos cenários (Folha+Gazeta+CNN+O Globo) — Kalil 5º. **Massa Ratinho Jr 3º DISPARA 7.10%** + **Eduardo Leite 3º 3.35% NOVO** — outsiders competem espaço Zema. **Ciro Nogueira 'margem erro, sem 3ª via'** (Estadão) — pressão direta. ZEMA privatizar Petrobras+BB mantido. STF impeach RECUPERA 14%." },
  { name: "Tarcísio de Freitas", party: "Republicanos", age: 51, role: "Governador de São Paulo", polymarket: "0.25%", poll: "Tarcísio LIDERA SP gov 48.2% mantido | **Senado SP Podemos: Tarcísio + Palumbo/Rufino**", position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.", risk: "0.25% Poly (estável). **Senado SP Podemos**: apoia Tarcísio MAS lança Palumbo + Rufino próprios (InfoMoney 14:56, Poder360 02:30, Revista Oeste 11:32) — direita expandindo no Senado SP, fragmenta apoio. **AtlasIntel 2T 'Lula empata Flávio+Jair+Zema'** — Tarcísio não citado entre cenários adversários competitivos. Tarcísio + Flávio juntos pré-campanha mantido (G1+Folha 27/Abr). 'Tarcísio: Flávio próximo presidente' mantido (G1+CNN 27/Abr). 'Tarcísio capacidade presidente um dia' mantido. Tarcísio LIDERA SP 48.2% mantido — força regional consolidada." },
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
