import type { CandidateProfile } from '../types';
import { partyColor } from '../lib/utils';
import { SectionTitle, Card } from './ui';
import { LogicLink } from './LogicLink';
import { useTranslation } from '../i18n/context';

const candidates: CandidateProfile[] = [
  { name: "Lula", party: "PT", age: 80, role: "Presidente da República", polymarket: "38.5%", poll: "40% 2T Quaest (23/Abr) / 68% Teresina (23/Abr) / 28.2% RS (22/Abr)", position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato.", risk: "38.5% Poly (estável) — **RETOMA LIDERANÇA**: gap INVERTE para +0.75pp a favor de Lula (Flávio caiu 37.75% ↓1.2pp). **2º lugar Poly EXPLODE: 22% (↑7.5pp de 14.5%)** — mercado recalibra fortemente. 3º lugar sobe 0.25%. NOVA QUAEST 2T (MSN 23/Abr): Flávio 42% × Lula 40% — Flávio à frente 2T, contradizendo CNT 21/Abr. Lula registra recuperação na aprovação (JETSS 23/Abr). Teresina: Lula 68%, amplia distância (Piauí Hoje 23/Abr) — Nordeste dominante. Novo Datafolha: disputa Congresso decisiva 2026 (O Cafezinho 23/Abr). AtlasIntel nova pesquisa publicada (Revista Fórum 23/Abr). PT Senado sobe 3.6% (↑0.75pp). MAS: Quaest 2T adverso. MG 'campo minado' para Flávio — porém é cenário adverso ao adversário (neutro para Lula)." },
  { name: "Flávio Bolsonaro", party: "PL", age: 45, role: "Senador (RJ)", polymarket: "37.75%", poll: "42% 2T Quaest (23/Abr) / 42.2% RS (22/Abr) / SP à frente (22/Abr)", position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.", risk: "37.75% Poly (↓1.2pp de 38.95%) — **PERDE LIDERANÇA para Lula** (gap inverte -0.75pp). 2º lugar CAI MAIS: 61% (↓3.5pp de 64.5%) — mercado segue reduzindo consolidação. PL Senado cai 82% (↓1pp). MAS: Quaest NOVA 2T (MSN 23/Abr): Flávio 42% × Lula 40% — à frente 2T. Pesquisa SP Flávio à frente Lula (comunhao 22/Abr). MG 'campo minado' — aliados do centrão avaliam (Folha 23/Abr) — desafio regional. Flávio quer ser 'candidato do agro' (Pleno.News 23/Abr) — posicionamento setorial. Campanha MT Sinop + infraestrutura (mtagora 23/Abr). Gazeta Povo: 'Flávio pode ficar fora eleição 2026?' — pauta inelegibilidade. Family criticismo de ex-aliado (BBC 23/Abr)." },
  { name: "Renan Santos", party: "Missão", age: 35, role: "Fundador do MBL", polymarket: "5.85%", poll: "4.4% 1T (AtlasIntel prev.) / N/A Quaest", position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.", risk: "5.85% Poly (↓0.2pp de 6.05%) — **ULTRAPASSADO POR ZEMA NO 3º LUGAR PELA PRIMEIRA VEZ**: Zema 29% × Renan 27% (previsão de ontem se confirma). Presidencial: Zema 7.25% × Renan 5.85% — Zema consolida liderança da 3ª via. STF impeach Poly 12.5% (↑0.5pp de 12%) — 3ª sessão consecutiva subindo. Mendonça autoriza Vorcaro ao hospital (SBT News 23/Abr). PF entrega STF relatório sobre morte de 'Sicário' (SBT News 23/Abr) — dinâmica judicial avança. Senado segue no ring anti-Moraes (O Globo 22/Abr mantido). MAS: Renan sem peça pública pelo 3º dia consecutivo. Espaço 3ª via anti-STF consolidado em Zema." },
  { name: "Fernando Haddad", party: "PT", age: 63, role: "Pré-candidato Gov. SP", polymarket: "3.35%", poll: "Paraná Pesquisas SP: Tarcísio lidera, diferença CAI", position: "Centro-esquerda. Lula convenceu a disputar governo de SP. Fora da corrida presidencial.", risk: "3.35% Poly (estável) — presidencial mantém. 2º lugar Poly Haddad RECUA 4.55% (↓1.55pp de 6.1%) — mercado devolve parcialmente a alta inesperada de ontem. 3º lugar 3.8% (estável). PT Senado SOBE: 3.6% (↑0.75pp) — alta significativa pro campo PT legislativo. PEC 6x1 comissão tramita (Congresso em Foco 22/Abr mantido). Novo Datafolha mostra disputa Congresso decisiva 2026 (O Cafezinho 23/Abr) — agenda PT no centro. Lula registra recuperação na aprovação (JETSS 23/Abr) — campo favorável." },
  { name: "Ronaldo Caiado", party: "PSD", age: 76, role: "Ex-Gov. Goiás (renunciou 4/Abr)", polymarket: "2.15%", poll: "6% 1T (Quaest 15/Abr) / 5% (Datafolha)", position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.", risk: "2.15% Poly (↑0.3pp de 1.85%) — **LEVE ALTA**, movimento positivo. PSD Senado cai 4.7% (↓0.95pp). CAIADO CRITICA LULA: 'usa pobres em política baixa' + 'preocupação com candidatura precoce' (Estadão 23/Abr) — peça pública do dia, entra no debate. Aécio propõe aliança Ciro CE (Gazeta Povo 22/Abr) — movimento centrão. Caiado volta ao radar após dias de silêncio." },
  { name: "Romeu Zema", party: "Novo", age: 56, role: "Ex-Gov. Minas Gerais (renunciou 4/Abr)", polymarket: "7.25%", poll: "3% 1T (Quaest) / 4% (Datafolha)", position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.", risk: "7.25% Poly (↑1.1pp de 6.15%) — **VOLTA A SUBIR após correção de ontem**. **ULTRAPASSA RENAN NO 3º LUGAR: 29% × Renan 27%** (previsão de ontem confirmada). Zema consolida-se como 3ª via principal. STF impeach 12.5% (↑0.5pp) — combustível anti-STF persiste. Primeira pesquisa Quaest MG governo (VEJA 23/Abr) — radar MG aquece. MG 'campo minado' para Flávio (Folha 23/Abr) — mesmo sendo adversário, validação de força regional de Zema no estado. Aliança tática Flávio-Zema anti-STF de ontem mantida como contexto." },
  { name: "Tarcísio de Freitas", party: "Republicanos", age: 51, role: "Governador de São Paulo", polymarket: "0.35%", poll: "Paraná Pesquisas SP: LIDERA gov, mas diferença cai sobre Haddad", position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.", risk: "0.35% Poly (estável). 3º lugar 0.35% (↓0.1pp). Pesquisa SP Flávio à frente Lula (comunhao 22/Abr confirmado) — SP consolida direita. Tarcísio continua trabalhando superar resistência a Flávio (Metrópoles 22/Abr mantido). Após 'bênção' de Eduardo Bolsonaro, PL define candidato ao Senado em SP (Revista Fórum 23/Abr) — estrutura local organizada." },
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
