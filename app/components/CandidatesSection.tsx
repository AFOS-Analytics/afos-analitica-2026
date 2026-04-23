import type { CandidateProfile } from '../types';
import { partyColor } from '../lib/utils';
import { SectionTitle, Card } from './ui';
import { LogicLink } from './LogicLink';
import { useTranslation } from '../i18n/context';

const candidates: CandidateProfile[] = [
  { name: "Lula", party: "PT", age: 80, role: "Presidente da República", polymarket: "38.5%", poll: "40% 2T Quaest (23/Abr) / 68% Teresina (23/Abr) / AtlasIntel nova hoje", position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato.", risk: "38.5% Poly (estável) — **MANTÉM LIDERANÇA**: gap encurta LEVE para +0.55pp (Flávio subiu 37.95% ↑0.2pp). 2º lugar Poly MANTÉM salto: 22% estável (↑7.5pp da véspera). **LULA ENDURECE DISCURSO: promete deixar 'mentirosos nus'** (Folha 23/Abr 16:34 + InfoMoney 17:19 + Poder360 16:57 + Jornal Grande Bahia 18:40) — mudança de tom ofensivo. AtlasIntel nova pesquisa presidencial CONFIRMADA (CartaCapital 23/Abr 15:42). Lula recupera aprovação (JETSS). Teresina 68% (Piauí Hoje). Novo Datafolha Congresso decisivo (O Cafezinho). PT Senado 3.6% estável. MAS: PF ENTREVISTA LULA sobre potenciais acusações a Bolsonaro (Diário Centro Mundo 23/Abr) — novo vetor judicial. Quaest 2T (MSN) Flávio 42 × Lula 40 mantido." },
  { name: "Flávio Bolsonaro", party: "PL", age: 45, role: "Senador (RJ)", polymarket: "37.95%", poll: "42% 2T Quaest (23/Abr) / 42.2% RS / SP à frente", position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.", risk: "37.95% Poly (↑0.2pp de 37.75%) — **RECUPERA LEVE**, gap com Lula encurta para -0.55pp. 2º lugar CAI MAIS 59.5% (↓1.5pp de 61%). PL Senado 82% estável. **TARCÍSIO MANTÉM DISTÂNCIA de Flávio em campanha SP** (O Globo 23/Abr) — rachadura tática Republicanos-PL escancarada. Andreazza: 'Flávio se mexe' (Estadão 23/Abr 09:52) — negociações ampliadas. PIVETTA ENDOSSA Flávio (Rdnews 23/Abr 12:10). Evangélicos bloco-chave 2026 (A TARDE 23/Abr). MG 'campo minado' mantido (Folha). Gazeta Povo: inelegibilidade mantida. Quaest 2T 42% × Lula 40% mantido." },
  { name: "Renan Santos", party: "Missão", age: 35, role: "Fundador do MBL", polymarket: "5.65%", poll: "4.4% 1T (AtlasIntel prev.) / N/A Quaest", position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.", risk: "5.65% Poly (↓0.2pp de 5.85%) — 3º lugar Renan 28.5% (↑1.5pp) MAS Zema DISPARA 33% (↑4pp) — **GAP AMPLIA PARA 4.5pp** (era 2pp). Zema consolida fortemente 3ª via. 3ª VIA LIBERAL como falha analítica (Jovem Pan 23/Abr 12:07) — diagnóstico duro. STF impeach 12.5% estável — tema institucional ocupado por Zema. PF entrega STF relatório 'Sicário' (SBT News 23/Abr 15:41). Renan SEM peça pública pelo 4º dia consecutivo." },
  { name: "Fernando Haddad", party: "PT", age: 63, role: "Pré-candidato Gov. SP", polymarket: "3.25%", poll: "Paraná Pesquisas SP: Tarcísio lidera, diferença CAI", position: "Centro-esquerda. Lula convenceu a disputar governo de SP. Fora da corrida presidencial.", risk: "3.25% Poly (↓0.1pp) — presidencial estável. **2º lugar Poly Haddad RECUPERA 5.3% (↑0.75pp de 4.55%)** — mercado reprecifica cenário alternativo. 3º lugar 3.75% (↓0.05pp). PT Senado 3.6% (estável). TARCÍSIO MANTÉM DISTÂNCIA de Flávio (O Globo 23/Abr) — fragilidade adversário explícita. Novo Datafolha Congresso decisivo (O Cafezinho 23/Abr). Lula recupera aprovação (JETSS). PEC 6x1 comissão tramita." },
  { name: "Ronaldo Caiado", party: "PSD", age: 76, role: "Ex-Gov. Goiás (renunciou 4/Abr)", polymarket: "2.05%", poll: "6% 1T (Quaest 15/Abr) / 5% (Datafolha)", position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.", risk: "2.05% Poly (↓0.1pp de 2.15%) — devolve leve alta da manhã. **PSD Senado RECUPERA 5.4% (↑0.7pp de 4.7%)**. Caiado critica Lula 'usa pobres em política baixa' + 'candidatura precoce' (Estadão 23/Abr 08:30) mantido no ciclo. Aécio propõe aliança Ciro CE (Gazeta Povo) mantido. Movimento centrão ativo." },
  { name: "Romeu Zema", party: "Novo", age: 56, role: "Ex-Gov. Minas Gerais (renunciou 4/Abr)", polymarket: "6.95%", poll: "3% 1T (Quaest) / 4% (Datafolha) / Primeira Quaest MG gov (VEJA 23/Abr)", position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.", risk: "6.95% Poly (↓0.3pp de 7.25%) — presidencial devolve leve alta da manhã. **3º LUGAR DISPARA 33% (↑4pp de 29%) — gap sobre Renan (28.5%) AMPLIA PARA 4.5pp** (era 2pp). Consolida 3ª via. STF impeach 12.5% estável. Primeira pesquisa Quaest MG governo confirmada (VEJA 23/Abr 15:24). MG 'campo minado' Flávio (Folha) — valida força regional. Kiko Caputo candidato Novo DF (O Antagonista 22/Abr 23:33)." },
  { name: "Tarcísio de Freitas", party: "Republicanos", age: 51, role: "Governador de São Paulo", polymarket: "0.35%", poll: "Paraná Pesquisas SP: LIDERA gov, mas diferença cai sobre Haddad", position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.", risk: "0.35% Poly (estável). 3º lugar 0.35% (estável). **TARCÍSIO MANTÉM DISTÂNCIA DE FLÁVIO em campanha SP** (O Globo 23/Abr) — não aparece com o senador em eventos conjuntos, rachadura tática Republicanos-PL escancarada publicamente. Sinaliza autonomia e não-subordinação ao projeto Bolsonaro — movimento que pode influenciar centrão." },
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
