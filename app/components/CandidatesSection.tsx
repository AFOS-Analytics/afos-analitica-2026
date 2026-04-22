import type { CandidateProfile } from '../types';
import { partyColor } from '../lib/utils';
import { SectionTitle, Card } from './ui';
import { LogicLink } from './LogicLink';
import { useTranslation } from '../i18n/context';

const candidates: CandidateProfile[] = [
  { name: "Lula", party: "PT", age: 80, role: "Presidente da República", polymarket: "38.5%", poll: "39% 1T Datafolha (21/Abr) / 44% 2T CNT (21/Abr) / 51.4% PE (21/Abr)", position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato.", risk: "38.5% Poly (↓1.0pp) — PERDE LIDERANÇA para Flávio (gap -0.9pp, agora 39.4%). Datafolha 21/Abr (O Cafezinho): 1T Lula 39% × Flávio 35% — 4pp à frente na pesquisa. CNT 21/Abr (rastro101): 2T Lula 44% × Flávio 40% — volta a LIDERAR 2T. Pernambuco: Lula 51.4% × Flávio 21.6% (Blog Assis Ramalho) — Nordeste reforçado. JOTA: Lula 48.4% apoio × 49.1% rejeição (ranking argentino). MAS: 2º lugar Poly DESPENCA para 15.5% (↓0.5pp) e 3º lugar cai 1.4% (↓0.95pp). PT propõe reforma Judiciário 'sem disputa política' (SBT News 20/Abr). Dino propõe contraponto a Fachin (SBT News). CPI MASTER ESFRIA (Folha 21/Abr): Kassio deve NEGAR pedido — alívio para governo. Folha 21/Abr: 'A esquerda perdeu o pulso do Brasil?' (questionamento). Rejeição mantida alta." },
  { name: "Flávio Bolsonaro", party: "PL", age: 45, role: "Senador (RJ)", polymarket: "39.4%", poll: "35% 1T Datafolha (21/Abr) / 40% 2T CNT (21/Abr)", position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.", risk: "39.4% Poly (↑0.8pp de 38.6%) — RETOMA LIDERANÇA ISOLADA (+0.9pp sobre Lula 38.5%). 2º lugar DISPARA: 69.0% (↑4.5pp de 64.5%) — mercado CONSOLIDA Flávio no 2T. PL SENADO CONSOLIDA: 82.5% (↑6.0pp de 76.5%) — domínio absoluto. Flávio AVALIA VP CATÓLICO (Folha 21/Abr) — estratégia religiosa. Estratégia de outreach jovens (TV Pampa 21/Abr): mira nascidos após gestões Lula. Chefe de campanha critica proposta STF (Folha 21/Abr). Campanha MT em Sinop (Rdnews 20/Abr). MAS: Datafolha 21/Abr mostra Flávio 4pp atrás 1T (35% × 39%). CNT: 2T atrás 40% × 44%. Travessia mantida: 'viável não consolidado'. 1ª inversão CNT 2T em dias. Pernambuco 21.6% contra Lula 51.4%." },
  { name: "Renan Santos", party: "Missão", age: 35, role: "Fundador do MBL", polymarket: "6.35%", poll: "4.4% 1T (AtlasIntel) / 1.8% (Veritá) / N/A Quaest", position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.", risk: "6.35% Poly (estável). 3º lugar CAI: 29% (↓2pp de 31%) — ZEMA ameaça liderança 3º. STF IMPEACH SOBE 13.5% (↑1pp, 2º DIA DE ALTA) — combustível anti-STF intensifica. Vorcaro pode abastecer novas investigações (Gazeta Povo 21/Abr). BRB liquidez zero mantido (O Globo 21/Abr). Aliados veem grupo Gilmar/Moraes em 'negação' sobre crise STF (O Globo 21/Abr) — narrativa anti-establishment reforçada. Zema ataque: STF-Vorcaro como 'abusos da Igreja', 'nos dá nojo' (tvfloridausa 21/Abr). MAS: CPI MASTER ESFRIA (Folha 21/Abr) — Kassio deve negar pedido — reduz combustível anti-sistema. Zema explode Poly (3º lugar 22.5%, ↑5.5pp) — concorrente direto 3ª via." },
  { name: "Fernando Haddad", party: "PT", age: 63, role: "Pré-candidato Gov. SP", polymarket: "3.8%", poll: "Paraná Pesquisas SP: Tarcísio lidera, diferença CAI", position: "Centro-esquerda. Lula convenceu a disputar governo de SP. Fora da corrida presidencial.", risk: "3.8% Poly (↓0.35pp de 4.15%) — recua. 2º lugar cai 3.8% (↓0.7pp). PT reforma Judiciário 'sem disputa política' (SBT News 20/Abr) — peça de posicionamento. Dino propõe reforma Judiciário em contraponto a Fachin (SBT News) — PT alinhado. Paraná Pesquisas SP mantida: Tarcísio lidera mas diferença cai. CPI Master esfria (Folha 21/Abr) — alívio governo. Folha 21/Abr: 'A esquerda perdeu o pulso do Brasil?' — questionamento." },
  { name: "Ronaldo Caiado", party: "PSD", age: 76, role: "Ex-Gov. Goiás (renunciou 4/Abr)", polymarket: "1.9%", poll: "6% 1T (Quaest) / 5% (Datafolha)", position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.", risk: "1.9% Poly (estável). PSD Senado RECUA: 5.35% (↓1.8pp de 7.15%) — mercado devolve alta de ontem após Kassab-VP consolidar. 2º lugar Poly 1.5% (↓0.25pp). Rejeição 32% — 2ª menor (Quaest). Kassab-VP anunciado ontem mantém estrutura, mas mercado não precifica como game-changer. Poll Datafolha 21/Abr não inclui Caiado em destaque — pesquisa foca bipolar Lula×Flávio. PL Senado DISPARA 82.5% (↑6pp) — comprime espaço PSD no legislativo." },
  { name: "Romeu Zema", party: "Novo", age: 56, role: "Ex-Gov. Minas Gerais (renunciou 4/Abr)", polymarket: "4.8%", poll: "3% 1T (Quaest) / 4% (Datafolha)", position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.", risk: "4.8% Poly (↑1.0pp de 3.8%) — 2º DIA DE ALTA presidencial. 3º lugar EXPLODE: 22.5% (↑5.5pp de 17%) — MAIOR MOVIMENTO DO DIA no 3º, ameaça Renan (29%, ↓2pp). ATACA STF: compara vínculos ministros com Vorcaro a 'abusos da Igreja', diz que 'nos dá nojo' (tvfloridausa 21/Abr) — posição anti-establishment agressiva. Rejeição Quaest 31% — MENOR de todos. MAS: base orgânica limitada, Partido Novo Senado 0.4% (nula). CPI Master esfria pode reduzir combustível." },
  { name: "Tarcísio de Freitas", party: "Republicanos", age: 51, role: "Governador de São Paulo", polymarket: "0.35%", poll: "Paraná Pesquisas SP: LIDERA gov, mas diferença cai sobre Haddad", position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.", risk: "0.35% Poly (estável). 3º lugar DESPENCA: 0.1% (↓1.55pp de 1.65%) — mercado abandona como 3ª via. Paraná Pesquisas SP mantida: Tarcísio à frente Haddad mas diferença cai. Sem movimentação pública significativa hoje." },
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
