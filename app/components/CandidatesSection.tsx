import type { CandidateProfile } from '../types';
import { partyColor } from '../lib/utils';
import { SectionTitle, Card } from './ui';
import { LogicLink } from './LogicLink';
import { useTranslation } from '../i18n/context';

const candidates: CandidateProfile[] = [
  { name: "Lula", party: "PT", age: 80, role: "Presidente da República", polymarket: "37.50%", poll: "**MESSIAS REJEITADO PELO SENADO 29/Abr 22:15h — 1ª REJEIÇÃO STF DESDE 1894** (42 contra × 34 a favor × 1 abstenção) | AtlasIntel 28/Abr n=5000: 1T 46.6% × Flávio 39.7% mantida | Aprovação 46.6-46.8% mantida", position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato.", risk: "**DERROTA HISTÓRICA**: 37.50% Poly (↓1.0pp de 38.50% — DEVOLVE recuperação), gap REVERTE para +5.6pp Flávio (era -0.25pp empate técnico). **MESSIAS REJEITADO PELO SENADO 22:15h** — 1ª rejeição STF desde 1894 (Folha 22:15). 'Lula sofre derrota histórica' (Folha). 'Senado rejeita Messias por governabilidade rompida' (Folha 22:42). 'Alcolumbre promete oposição: novo STF será do vencedor da eleição' (Folha 23:47). **2º LUGAR DEVOLVE 19% (↓6.5pp de 25.5%)** — mercado ajusta cenário, Haddad 2º RECUPERA 5%. **STF impeach SOBE 15% (↑1pp de 14%, próximo do pico)** — risco institucional cresce com STF na ofensiva. Aprovação 46.6-46.8% mantida (AtlasIntel ontem). 'Governo minimiza derrota' (variantes). 'Esquerda atribui derrota a chantagem política' (BBC 00:16)." },
  { name: "Flávio Bolsonaro", party: "PL", age: 45, role: "Senador (RJ)", polymarket: "43.10%", poll: "**'GOVERNO LULA ACABOU' (Flávio pós-rejeição Messias 29/Abr 23:11) | OPOSIÇÃO VENCE STF 42×34 — 1ª rejeição desde 1894** | Mantida AtlasIntel 28/Abr 1T 39.7% × Lula 46.6% (mercado ignora — Messias dominante)", position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.", risk: "**DISPARA**: 43.10% Poly (↑4.35pp de 38.75% — TOPO 43% maior do ciclo). Gap REVERTE para +5.6pp Flávio (era -0.25pp empate técnico ontem). **2º lugar 65% (↑1.5pp)**. 3º lugar 5.75% (↑0.4pp). **'Governo Lula acabou' Flávio** pós-rejeição Messias (Revista Oeste 23:11, Folha do Estado 01:02, Tribuna do Sertão 01:34). 'Defeat reflete reação aos excessos do STF' (O Globo 23:32). **MESSIAS REJEITADO 42×34 — 1ª rejeição STF desde 1894** (Folha 22:15). 'Flávio: Lula perdeu governabilidade' (GP1 00:01). **Senado vira 'celebração bolsonarista'** (Correio Braziliense 01:34). 'Investidor10: Messias fall = bancarrota política Lula 2026'. **PL Senado DEVOLVE 76% (↓9.5pp de 85.5%)** — vol grande, mas **União DISPARA 16.20% (↑4.95pp)** — confirma aliança direita." },
  { name: "Renan Santos", party: "Missão", age: 35, role: "Fundador do MBL", polymarket: "5.75%", poll: "**3º LUGAR DISPARA 33.50%** (↑6pp) com queda Massa | Mantido 'Sou candidato direita' (BBC 28/Abr) | Nexus 27/Abr 2T empate técnico Lula × Renan", position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.", risk: "5.75% Poly (↓0.6pp de 6.35% — leve devolução). **3º lugar DISPARA 33.50% (↑6pp de 27.5%)** — beneficiado pela queda Massa Ratinho de 7.10% → 0.65% (mercado realiza exagero). Zema 3º cai 39% (↓0.5pp) ainda topo, Caiado 19.5% (↓3pp DEVOLVE), Flávio 5.75% (↑0.4pp), **Eduardo Bolsonaro 1.50% NOVO**. **STF impeach SOBE 15% (↑1pp)** — combustível anti-STF aproxima do pico ciclo (16%) com rejeição Messias. 'Reação contra excessos STF' (Flávio/O Globo 23:32) amplifica narrativa anti-establishment. **Bradesco cobra R$834k Vorcaro** (Brasil247) + **CPI: indícios exploração sexual festas Vorcaro** (Cafezinho) — combustível continua. MAS: **Alcolumbre acordo enterra CPI Master + reduz pena Bolsonaro** (Folha 02:00) — pode tirar oxigênio anti-establishment. Espaço 3ª via fragmenta com derrota Lula." },
  { name: "Fernando Haddad", party: "PT", age: 63, role: "Pré-candidato Gov. SP", polymarket: "3.25%", poll: "**Vox SP 29/Abr: Tarcísio 38% × Haddad 26%** | AtlasIntel 1T Lula 46.6% mantido | Vox SP 2T 50.4% mantido", position: "Centro-esquerda. Lula convenceu a disputar governo de SP. Fora da corrida presidencial.", risk: "3.25% Poly (↓0.25pp leve). **2º lugar RECUPERA 5.00% (↑2.05pp de 2.95%)** — mercado ressente derrota Lula ajustando cenário Haddad como sucessor PT. Volatilidade extrema confirma: 6.1→0.225→3.35→2.7→3.2→2.55→2.4→5.8→2.95→**5.00**. **MESSIAS REJEITADO 42×34** afeta toda chapa PT por extensão. **Vox SP gov: Tarcísio 38% × Haddad 26%** (CartaCapital 14:53). **Lula deve evitar debates 1T** (Brasil247 19:41 — análise hostil). VEJA 11:00: 'fadiga eleitoral Lula × Flávio' afeta Haddad. **PT Senado estável 2.65% (↓0.05pp)**. **MDB DEVOLVE 2.25% (↓1.7pp de 3.95%)** — aliança governo perde força com derrota Senado. 'Desestabiliza relação Lula-Senado' (Folha 22:42)." },
  { name: "Ronaldo Caiado", party: "PSD", age: 76, role: "Ex-Gov. Goiás (renunciou 4/Abr)", polymarket: "1.65%", poll: "AtlasIntel 28/Abr 2T não cita Caiado explicitamente mantido | Próxima Quaest gov GO+Senado mantida pendente", position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.", risk: "1.65% Poly (↓0.1pp leve). **3º lugar DEVOLVE 19.50% (↓3pp de 22.5%)** — perde posição com Renan beneficiado pela queda Massa. Pós-rejeição Messias mercado consolida cenário binário Lula × Flávio que marginaliza centro-direita institucional. **PSD Senado DEVOLVE 5.60% (↓0.8pp)** — aliança PSD-Lula questionada com derrota Senado, Kassab havia criticado gestão (Folha 28/Abr 22:07). **Eduardo Bolsonaro 3º 1.50% NOVO** — outsider direita compete espaço Caiado. STF impeach SOBE 15% — Caiado defende ordem institucional (potencial isolamento). **Alcolumbre acordo: enterra CPI Master + reduz pena Bolsonaro** (Folha 02:00) — Caiado afastado de articulação política." },
  { name: "Romeu Zema", party: "Novo", age: 56, role: "Ex-Gov. Minas Gerais (renunciou 4/Abr)", polymarket: "6.85%", poll: "AtlasIntel 28/Abr 2T 'Lula empata com Zema' mantido | Genial/Quaest MG Cleitinho LIDERA mantido (Kalil 5º) | Nexus 27/Abr 2T empate técnico mantido", position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.", risk: "6.85% Poly (↓1.05pp de 7.90% — **CONTINUA PERDENDO 3ª via, abaixo dos 7% pela 1ª vez ciclo recente**). **3º lugar 39% (↓0.5pp leve)** — mantém topo mas Renan dispara 33.50% reduz gap pra 5.5pp. 2º lugar 2.15% (estável). **NOVO Senado SOBE 12.65% (↑1.15pp)** — força partidária Zema em alta. **Eduardo Leite 3º DESPENCA 0.20% (↓3.15pp)** — outsider Novo do RS perde força. **MESSIAS REJEITADO PELO SENADO** consolida cenário binário Lula × Flávio que MARGINALIZA 3ª via — 'Eleição não-definida' agora se torna 'Lula perdeu governabilidade' (mercado precifica binarização). STF impeach SOBE 15% — combustível anti-STF parcialmente favorece Zema (anti-establishment)." },
  { name: "Tarcísio de Freitas", party: "Republicanos", age: 51, role: "Governador de São Paulo", polymarket: "0.25%", poll: "**Vox SP gov: Tarcísio 38% × Haddad 26%** (CartaCapital 14:53) | Tarcísio LIDERA SP gov 48.2% mantido | Senado SP Podemos: Tarcísio + Palumbo/Rufino mantido", position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.", risk: "0.25% Poly (estável). **3º lugar Tarcísio NOVO destaque 0.70%** — primeira aparição precificada como alternativa 3º lugar. **Vox SP gov 38% × Haddad 26%** (CartaCapital 14:53). **Rejeição Messias 42×34** consolida coalizão direita — Tarcísio ganha por extensão pelo realinhamento Flávio+Tarcísio. Tarcísio + Flávio juntos pré-campanha mantido (G1+Folha 27/Abr). 'Tarcísio: Flávio próximo presidente' mantido (G1+CNN 27/Abr). **REPUBLICANOS Senado DEVOLVE 9.25% (↓0.9pp)** — leve recuo mas mantém alta. PODEMOS Senado 4.10% — Senado SP confirma. Tarcísio LIDERA SP 48.2% mantido — força regional consolidada e ampliada com cenário pós-rejeição." },
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
