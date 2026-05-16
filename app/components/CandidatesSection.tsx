import type { CandidateProfile } from '../types';
import { partyColor } from '../lib/utils';
import { SectionTitle, Card } from './ui';
import { LogicLink } from './LogicLink';
import { useTranslation } from '../i18n/context';

// Os campos `polymarket`, `poll` e `risk` são atualizados pela skill /atualizar
// (a cada execução, o markdown dos JSONs e este arquivo são reescritos com
// dados frescos).
const candidates: CandidateProfile[] = [
  {
    name: "Lula",
    party: "PT",
    age: 80,
    role: "Presidente da República",
    polymarket: "44.50%",
    poll: "Lula estável 44.50% Poly (sem variação 36h+ vs 15/Mai manhã) mantém liderança ampla. Gap ESTREITA +12.00pp LULA (vs +15.65pp 15/Mai manhã ↓3.65pp 36h pós-Datafolha). 2L Lula 15.00% estável. STF IMPEACH REVERTE colapso de reversão 7.25% (↓1.75pp 24h, ↓5.50pp 36h reverte pico 12.75% 15/Mai retorna patamar 8% baseline 14/Mai noite). DATAFOLHA publicada 16/Mai n=2.004 (G1, Folha, CartaCapital, CNN Brasil, GZH, VEJA 16/Mai): 1T Lula 38% × Flávio 35% gap +3pp; 2T 45×45 empate técnico. Mantida Quaest 13/Mai: Lula 39% × Flávio 33%. DIVERGÊNCIA mercado × Datafolha: Polymarket gap +12pp vs Datafolha gap +3pp.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTOS 16/Mai: Datafolha publicada 1T 38×35 gap +3pp; 2T 45×45 empate (G1, Folha 16/Mai); Foragido Operação Master 'Os Meninos' preso Dubai chega SP (G1, Estadão, Valor 16/Mai); Joaquim Barbosa filiado DC candidato Planalto (G1, Estadão 16/Mai); Ciro Gomes pré-candidato governo CE (G1, Estadão 16/Mai); 7 pedidos CPMI Master Congresso pós-áudio (CNN Brasil 16/Mai); Lula convida Alcolumbre chefes Poderes pacto feminicídio (SBT News 16/Mai). MAS: Armínio Fraga 'Momento preocupante País meio perdido sem caminho claro' (Estadão Economia 16/Mai); Cade notifica iFood (Estadão 16/Mai); Fiesp Justiça leilão energia (Estadão 16/Mai); Rogério Marinho cobra CPI Master reuniões Lula-Vorcaro (Blog Roberto Gonçalves 16/Mai). Mantidos 14/Mai: ANÁLISE Quaest diretor melhora avaliação governo eleição apertada (G1); Henrique Vorcaro (pai) PRESO 6ª fase Compliance Zero; Posse Kassio TSE; Fachin endurece STF. Aprovação Lula 46.6-46.8% melhorando."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "32.50%",
    poll: "Flávio RECUPERA 32.50% Poly (↑4.15pp 24h, ↑3.65pp 36h vs 28.85% 15/Mai) ressaca Vorcaro digerida parcial. Gap ESTREITA +12.00pp LULA (vs +15.65pp ↓3.65pp 36h pós-Datafolha). 2L 60.50% (↓2.50pp 24h leve cedência). 3L 5.55% (↓1.60pp 24h). PL Senado 78.00% (↓2.00pp 24h). DATAFOLHA publicada 16/Mai 1T Flávio 35% × Lula 38% gap -3pp; 2T 45×45 empate técnico (G1, Folha, CartaCapital, CNN Brasil 16/Mai). Folha 'Flávio estancou antes de Dark Horse'. Mantida Quaest 13/Mai Flávio 33% × Lula 39%.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 16/Mai: Datafolha publicada gap -3pp 1T Lula 2T empate (G1, Folha 16/Mai); Flávio reforça candidatura 'Não vou desistir' (Estadão); 'tentaram enterrá-lo vivo associa Lula ao diabo' (Folha); 'não desistirá apesar de farsas' (CBN); Sergio Moro defende Flávio + assina CPI Master (Jornal O Sul); Guilherme Derrite lança pré-Senado SP evento com Flávio Sorocaba (G1); Zema 'página virada' aliança 3ª via direita preservada (Estadão); Caiado 'não fará juízo de valor' sobre Flávio (G1). MAS: Foragido Operação Master 'Os Meninos' preso Dubai chega SP (G1, Estadão); 7 pedidos CPMI Master Congresso (CNN Brasil); Plano filme Bolsonaro USD 1 mi 'oportunidade imigração' (G1); Augusto Cury 'Bolsonaros têm que explicar à Justiça' (G1); Família Bolsonaro fundo aliado Eduardo casa EUA (Estadão); Rogério Marinho cobra CPI Master (Blog Roberto Gonçalves). MICHELLE 2.80% estável + 2L 2.85% (↓0.45pp 24h) narrativa substituição perde tração mas Joaquim Barbosa filiado DC abre alternativa 3ª via centro. Mantidos 14/Mai: Henrique Vorcaro (pai) PRESO 6ª fase Compliance Zero; Vorcaro usou conta pai ocultar R$ 2,2 bi; Valor filme 13x caixa Master; BBC 'Balde água fria'."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "9.75%",
    poll: "Renan presidencial 9.75% Poly (↑0.40pp 24h, ↑0.30pp 36h vs 9.45% 15/Mai) SUPERA Zema (5.65%) pela primeira vez em D+2 launch — consolida liderança 3ª via Poly presidencial. 3L Renan 31.00% (↓1.00pp 36h estável topo). Caiado 3L RECUPERA 18.50% (↑2.00pp 24h) Renan mantém topo. STF IMPEACH REVERTE colapso de reversão 7.25% (↓5.50pp 36h). DATAFOLHA 16/Mai não destaca Renan headline central (G1, Folha 16/Mai). Mantido 'Sou candidato direita' (BBC 28/Abr).",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "Renan AUSENTE Datafolha 16/Mai como destaque headlines (G1, Folha, CartaCapital, CNN Brasil 16/Mai) — bipolaridade Lula × Flávio reforçada. Discrepância presidencial Poly (9.75%) × 3º lugar (31.00%) sugere mercado vê Renan como '3º consolidado' não 'presidencial competitivo'. Flávio RECUPERA 32.50% (↑4.15pp 24h) base PL resiste migração outsiders. ZEMA cede 5.65% (↓1.20pp 24h) Renan ganha espaço relativo. Joaquim Barbosa filiado DC candidato Planalto (G1, Estadão 16/Mai) — concorrência 3ª via centro mas Renan ocupa direita liberal MBL diferente. Bolsonaristas debatem substituir Flávio por Michelle mantido (VEJA 13/Mai). STF IMPEACH 7.25% (↓5.50pp 36h reverte pico) institucionalidade firme volta ao pricing reduz combustível anti-establishment. Aprovação Lula 46.6-46.8% melhorando. AtlasIntel estaduais Maranhão+Amazonas (Gazeta do Povo, CartaCapital 16/Mai)."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "2.25%",
    poll: "Haddad presidencial 2.25% Poly (↓0.10pp 24h leve). 2L Haddad 2.55% estável. 3L 3.55% (↓0.40pp 24h). Camilo presidencial 1.60% estável — Haddad mantém 0.65pp ACIMA Camilo. PT Senado 3.00% (↑0.05pp). Datafolha 16/Mai não destaca Haddad cenário principal (G1, Folha 16/Mai) — Lula 38% mantém liderança PT sem Haddad emergir.",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Lula estável Poly 44.50% mantém liderança base PT beneficia Haddad por extensão. Datafolha publicada 16/Mai Lula 38% × Flávio 35% 1T 2T empate 45×45 (G1, Folha 16/Mai). STF IMPEACH REVERTE colapso de reversão 7.25% (↓5.50pp 36h). Lula convida chefes Poderes pacto feminicídio (SBT News 16/Mai) coordenação institucional. Mantida ANÁLISE Quaest 13/Mai diretor melhora governo (G1 14/Mai). Pesquisa interna 70% rejeição taxa blusinhas determinante revogação (G1 14/Mai) gestão calibrada. Aprovação Lula 46.6-46.8% melhorando. MAS: Mantida Tarcísio crítica Haddad (Folha 05/Mai); Vox SP gap 12pp mantido; Foragido Operação Master 'Os Meninos' preso Dubai (G1, Estadão 16/Mai) caso estendido; Rogério Marinho aponta reuniões Lula-Vorcaro (Blog Roberto Gonçalves 16/Mai) contra-narrativa; Armínio Fraga 'País meio perdido' (Estadão 16/Mai); Cade notifica iFood (Estadão 16/Mai); Fiesp Justiça leilão energia (Estadão 16/Mai)."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1.15%",
    poll: "Caiado presidencial 1.15% Poly (↓0.40pp 36h leve queda vs 1.55% 15/Mai). 3L RECUPERA 18.50% (↑2.00pp 24h, ↑0.50pp 36h vs 18.00% 15/Mai). PSD Senado 3.60% (↓1.90pp 24h cede institucional). Datafolha 16/Mai não destaca Caiado headline central (G1, Folha 16/Mai). Mantida QUAEST 13/Mai: Caiado 4% × Zema 4% empate técnico 1T 3ª via. Caiado 'não fará juízo de valor' sobre Flávio crítica governo Lula (G1 16/Mai) postura institucional.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "Caiado 3L RECUPERA 18.50% (↑2.00pp 24h) — reverte cedência mas ainda gap -14pp para Zema 3L 32.50%. ZEMA cede 3L 32.50% (↓7.00pp 24h colossal) Caiado mantém abaixo. RENAN 3L 31.00% estável Caiado abaixo. SENADO: PL 78.00% (↓2.00pp), PSD DEVOLVE 3.60% (↓1.90pp 24h), MDB DISPARA 16.55% (↑14.70pp 24h cuidar volume), PODEMOS 2.20% (↑1.95pp). 'Caiado sem apoio governadores PSD' mantida (Gazeta do Povo). Joaquim Barbosa filiado DC candidato Planalto (G1, Estadão 16/Mai) — pode dividir voto 3ª via centro tradicional. Caiado 'não fará juízo de valor' Flávio (G1 16/Mai) postura institucional contida preserva diálogo. MICHELLE 2.80% estável ocupa espaço alternativo direita. Datafolha 16/Mai bipolariza Lula × Flávio sem 3ª via destacada."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "5.65%",
    poll: "Zema presidencial 5.65% Poly (↓1.20pp 24h, ↓0.95pp 36h vs 6.60% 15/Mai) — RENAN SUPERA Zema (9.75%) pela primeira vez em D+2 launch. 3L Zema DEVOLVE COLOSSAL 32.50% (↓7.00pp 24h cede topo vs Renan 31.00% estável). 2L Zema 5.65% (↓0.20pp 24h). NOVO Senado 1.00% (↑0.15pp 24h). Mantida QUAEST 13/Mai: Zema 4% × Caiado 4% empate técnico 1T 3ª via. Datafolha 16/Mai não destaca Zema headline central (G1, Folha 16/Mai). Zema 'página virada' não houve ruptura aliança 3ª via direita preservada (Estadão 16/Mai).",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "ZEMA cede 3L colossal 32.50% (↓7.00pp 24h) — mercado não consolida Zema como receptor migração Flávio. Flávio RECUPERA 32.50% (↑4.15pp 24h) base PL resistiu. STF IMPEACH REVERTE colapso de reversão 7.25% (↓5.50pp 36h) institucionalidade firme volta ao pricing reduz combustível narrativa anti-STF Zema. INFLAÇÃO bandas altas (≥6.50%) consolidam 13.20% (↓2.70pp 24h); 7.00%+ 10.25% (↓1.25pp 24h) — narrativa fiscal extrema cede mas mantém. Zema 'página virada' (Estadão 16/Mai) aliança preservada mas perde liderança 3ª via Poly. MICHELLE 2.80% estável ocupa espaço alternativo direita. Joaquim Barbosa filiado DC candidato Planalto (G1, Estadão 16/Mai) — concorrência 3ª via centro. Mantidos 13/Mai: Bolsonaristas debatem substituir Flávio por Michelle; Bolsonaro ordena apoio Flávio. Mantido 'Zema RADICALIZA impeachment STF + privatizar tudo' (Estadão 03/Mai)."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.45%",
    poll: "Tarcísio presidencial 0.45% Poly (↑0.10pp 36h vs 0.35% 15/Mai). 2L Tarcísio 0.30% (↑0.05pp 24h). Republicanos Senado 10.40% (↓0.75pp 24h, ↓1.25pp 36h vs 11.65% 15/Mai). PL Senado 78.00% (↓2.00pp 24h). Datafolha 16/Mai não destaca Tarcísio cenário presidencial (G1, Folha 16/Mai).",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Guilherme Derrite (vice Tarcísio SP Republicanos) lança pré-candidatura ao Senado SP em evento com Flávio Bolsonaro em Sorocaba (G1 16/Mai) — articulação SP fortalecida com Republicanos. Tarcísio mantém foco reeleição SP. Republicanos Senado 10.40% (↓0.75pp 24h, ↓1.25pp 36h) cedência. Mantidos 14/Mai: Tarcísio Sabesp 'mão pesada Estado' (O Globo); Tarcísio+Flávio reportados PG crimes eleitorais (Revista Fórum 02/Mai mantida). Crise Flávio-Vorcaro pode levar reorganização interna PL/Republicanos. Mantidos 13/Mai: Bolsonaristas debatem substituir Flávio por Michelle (VEJA) — Tarcísio é candidato alternativo possível mas mantém foco SP. MICHELLE 2.80% estável + 2L 2.85% (↓0.45pp 24h) — direita pode reorganizar com Michelle não necessariamente Tarcísio. Joaquim Barbosa filiado DC candidato Planalto (G1, Estadão 16/Mai) — concorrência 3ª via centro."
  },
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