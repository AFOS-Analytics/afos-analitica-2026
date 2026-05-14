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
    polymarket: "42.50%",
    poll: "Lula DEVOLVE leve 42.50% Poly (↓3.00pp de 45.50%) ressaca do spike de ontem mantém liderança. Gap DEVOLVE +9.15pp LULA (vs +17.05pp ontem ↓7.90pp Lula mantém à frente). 2L Lula 16.00% (↑0.50pp). STF IMPEACH continua COLAPSANDO 4.50% (↓2.00pp de 6.50%, acumulado ↓13.50pp em 72h). Mantida QUAEST 13/Mai: Lula 39% × Flávio 33% (G1, Gazeta do Povo, CartaCapital 13/Mai). ANÁLISE Quaest diretor: melhora avaliação governo + eleição apertada (G1 14/Mai). Quaest aprovação sobe pós-derrotas + reunião Lula-Trump (PlatôBR 14/Mai). Lula REASSUME VANTAGEM 2T (JOTA 14/Mai). Quaest Lula vence Flávio 2T (TVT News 14/Mai).",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTO DO DIA: Henrique Vorcaro (pai Daniel) PRESO 6ª fase Compliance Zero (G1, O Globo 14/Mai) consolida narrativa anti-corrupção investigativa. Vorcaro usou conta pai ocultar R$ 2,2 bi vítimas Master (O Globo 14/Mai). Governistas comemoram áudio mas têm dúvida sobre efeito eleitor (Folha 14/Mai). Pesquisa interna 70% rejeição taxa blusinhas determinante revogação (G1 14/Mai). LAUNCH AFOS hoje D-Day. Mantidos 13/Mai: Lula explora Flávio-Vorcaro nas redes (CBN); Mensagens viram munição Lula (Estadão); Posse Kassio TSE (TSE); Fachin endurece distribuição STF (Valor). MAS: Ligação Flávio-Vorcaro pesa mercado doméstico (Valor 14/Mai). Risco político volta ao foco mercado (Valor 14/Mai). Ibovespa afetado (VEJA 14/Mai). Pesquisa Gerp publicada (Gazeta do Povo 14/Mai). Datafolha 15/Mai (D+1) validação pós-launch."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "33.35%",
    poll: "Flávio RECUPERA 33.35% Poly (↑4.90pp de 28.45%) ressaca do choque base PL resiste. Gap DEVOLVE +9.15pp LULA (de +17.05pp ↓7.90pp Lula mantém à frente). 2L recupera 66.00% (↑5.00pp de 61.00%). 3L 5.80% (↑2.50pp). Mantida QUAEST 13/Mai: Flávio 33% × Lula 39% (G1 13/Mai). PL Senado CONSOLIDA 79.50% (↑2.50pp de 77.00% partido sólido apesar crise individual).",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTO DO DIA: Henrique Vorcaro (pai Daniel) PRESO 6ª fase Compliance Zero (G1, O Globo, Estadão, Folha, BBC 14/Mai). Vorcaro usou conta pai ocultar R$ 2,2 bi vítimas Master (O Globo 14/Mai). Valor filme 13x caixa do Master (O Globo 14/Mai). Flávio negociou meses após Bolsonaro atacar Master 'sistema agindo' (O Globo 14/Mai). BBC 'Balde de água fria' bolsonarismo (BBC 14/Mai). Aliados Flávio veem abalo confiança elo Vorcaro temem mais acusações (Folha 14/Mai). Conversa Vorcaro atropela Flávio abala direita (Folha 14/Mai). 'Negócio com Master semeia dúvidas candidatura Flávio' (VEJA 14/Mai). CPI Master defendida pelo PRÓPRIO Flávio + governistas; criação depende Alcolumbre (G1 14/Mai). MICHELLE CONTINUA SUBINDO 3.40% Poly (↑1.45pp) + 2L 3.60% (↑2.60pp narrativa substituição). Imprensa internacional repercute caso (G1 14/Mai). Ibovespa afetado risco político mercado (Valor, VEJA 14/Mai). MAS: Mantidos 13/Mai Líder PL Sóstenes defende 'patrocínio privado'; Bolsonaro ordena apoio Flávio."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "7.15%",
    poll: "Renan presidencial estável 7.15% Poly (↑0.10pp leve) mantém patamar pós-ressaca Vorcaro. 3L Renan DISPARA 34.50% (↑3.00pp de 31.50%) consolida competitivo Zema 35.50%. Caiado 3L DEVOLVE COLOSSAL 13.00% (↓5.50pp) Renan ganha espaço relativo. 2L Renan 5.65% (estável). STF IMPEACH continua COLAPSANDO 4.50% (↓2.00pp, ↓13.50pp 72h). Mantida ausência destaque Quaest 13/Mai (G1, CartaCapital, VEJA).",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "Renan AUSENTE Quaest 13/Mai como destaque mantida (G1, CartaCapital, VEJA 13/Mai). Discrepância presidencial Poly (7.15%) × 3º lugar (34.50%) sugere mercado vê Renan como '3º consolidado' não 'presidencial competitivo'. Flávio RECUPERA 33.35% (↑4.90pp) base PL resiste migração para outsiders. ZEMA DEVOLVE COLOSSAL 5.85% (↓6.15pp) Renan ganha espaço relativo 3L. Mantidos 13/Mai: Bolsonaristas debatem substituir Flávio por Michelle; Sóstenes defende Flávio; Bolsonaro ordena apoio. MICHELLE CONTINUA SUBINDO 3.40% (↑1.45pp) ocupa espaço alternativo direita. STF IMPEACH continua COLAPSANDO 4.50% (↓2.00pp) reduz combustível anti-establishment. Aprovação Lula 46.6-46.8% melhorando. Pesquisa Gerp publicada (Gazeta do Povo 14/Mai). Datafolha 15/Mai pode reforçar bipolaridade."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "2.45%",
    poll: "Haddad presidencial 2.45% Poly (↓0.20pp leve). 2L Haddad 2.75% (estável). 3L 4.05% (↓0.15pp). Camilo presidencial 1.65% (estável) — Haddad mantém 0.80pp ACIMA Camilo. PT Senado 2.90% (↓0.15pp leve). Quaest 13/Mai não destaca Haddad como cenário principal.",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Lula mantém liderança Poly 42.50% (DEVOLVE leve) base PT beneficia Haddad por extensão. ANÁLISE Quaest diretor: melhora avaliação governo + eleição apertada (G1 14/Mai). Quaest aprovação sobe pós-derrotas+Trump (PlatôBR 14/Mai). Pesquisa interna 70% rejeição taxa blusinhas determinante revogação (G1 14/Mai); Lula esperou saída Haddad evitar mal-estar gestão calibrada (CNN Brasil 13/Mai mantida). PT Senado 2.90% (↓0.15pp). MAS: Mantida Tarcísio crítica Haddad (Folha 05/Mai); Vox SP gap 12pp mantido; Ligação Flávio-Vorcaro pesa mercado doméstico (Valor 14/Mai). Risco político volta ao foco (Valor 14/Mai). Ibovespa afetado (VEJA 14/Mai). Mantido Petrobras zera importações diesel (VEJA 13/Mai). Pesquisa Gerp publicada (Gazeta do Povo 14/Mai). Datafolha 15/Mai oportunidade reposicionamento."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1.35%",
    poll: "Caiado presidencial 1.35% Poly (↑0.10pp leve). 3L DEVOLVE COLOSSAL 13.00% (↓5.50pp de 18.50%) cede liderança 3L. PSD Senado DISPARA 3.05% (↑1.00pp de 2.05%) recuperação institucional. Mantida QUAEST 13/Mai: Caiado 4% × Zema 4% empate técnico 1T 3ª via (G1, CartaCapital 13/Mai). Mantido Caiado cobra explicações Flávio Vorcaro (G1 13/Mai).",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "Caiado 3L DEVOLVE COLOSSAL 13.00% (↓5.50pp) cede liderança. ZEMA DEVOLVE COLOSSAL 5.85% (↓6.15pp) mas mantém 3L 35.50% topo. Renan DISPARA 3L 34.50% (↑3.00pp) consolida competitivo. SENADO 14/Mai: PL CONSOLIDA 79.50% (↑2.50pp), PSD DISPARA 3.05% (↑1.00pp recuperação), Podemos 1.55% (↑0.20pp), REPUBLICANOS DEVOLVE COLOSSAL 1.05% (↓4.20pp), PT 2.90% (↓0.15pp). 'Caiado sem apoio governadores PSD' (Gazeta do Povo mantida). Mantidos 13/Mai: Bolsonaristas debatem substituir Flávio por Michelle; Sóstenes defende Flávio. MICHELLE CONTINUA SUBINDO 3.40% (↑1.45pp) ocupa espaço alternativo direita. Pesquisa Gerp publicada (Gazeta do Povo 14/Mai)."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "5.85%",
    poll: "Zema DEVOLVE COLOSSAL presidencial 5.85% Poly (↓6.15pp de 12.00%) spike 13/Mai NÃO confirmado mercado precifica reação excessiva. 3L Zema mantém 35.50% (↑0.50pp estável topo). 2L Zema DEVOLVE 3.10% (↓4.15pp de 7.25%). NOVO Senado 0.85% (estável). Mantida QUAEST 13/Mai: Zema 4% × Caiado 4% empate técnico 1T 3ª via (G1, CartaCapital 13/Mai).",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "ZEMA DEVOLVE COLOSSAL spike 13/Mai não confirmado — mercado não consolida Zema como receptor migração Flávio. Flávio RECUPERA 33.35% (↑4.90pp) base PL resistiu. STF IMPEACH continua COLAPSANDO 4.50% (↓2.00pp, ↓13.50pp 72h) reduz combustível narrativa anti-STF Zema. INFLAÇÃO bandas altas (≥6.50%) RECUPERAM parcial 20.35% (↑3.15pp); 7.00%+ DISPARA 10.40% (↑2.20pp) — narrativa fiscal extrema retorna pode favorecer discurso Zema MAS spike 13/Mai não confirmado. MICHELLE CONTINUA SUBINDO 3.40% (↑1.45pp) ocupa espaço alternativo direita. Mantidos 13/Mai: Bolsonaristas debatem substituir Flávio por Michelle — direita pode reorganizar SEM Zema; Bolsonaro ordena apoio Flávio. Mantido 'Zema RADICALIZA impeachment STF + privatizar tudo' (Estadão 03/Mai)."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.75%",
    poll: "Tarcísio presidencial 0.75% Poly (↑0.20pp leve sobe). 2L Tarcísio 0.35% (↓0.10pp). Republicanos Senado DEVOLVE COLOSSAL 1.05% (↓4.20pp de 5.25%). PL Senado CONSOLIDA 79.50% (↑2.50pp).",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Tarcísio comenta explosão obra Sabesp 'mão pesada do Estado vai atuar e punição vai acontecer' (O Globo 14/Mai). Republicanos Senado DEVOLVE COLOSSAL (↓4.20pp) — mercado abandona hipótese partido como força protagonista no Senado. Mantidos 13/Mai: Bolsonaristas debatem substituir Flávio por Michelle (VEJA) — Tarcísio é candidato alternativo possível mas mantém foco SP; Líder PL Sóstenes defende Flávio (VEJA); Bolsonaro ordena apoio Flávio (SBT News). Crise Flávio-Vorcaro pode levar a reorganização interna PL/Republicanos. Mantido Tarcísio+Flávio reportados PG crimes eleitorais (Revista Fórum 02/Mai mantida). MICHELLE CONTINUA SUBINDO 3.40% (↑1.45pp) — direita pode reorganizar com Michelle não necessariamente Tarcísio. Mantido foco reeleição SP."
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
