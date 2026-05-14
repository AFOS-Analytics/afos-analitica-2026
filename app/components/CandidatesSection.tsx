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
    polymarket: "45.50%",
    poll: "Lula DISPARA 45.50% Poly (↑7.00pp de 38.50%) MAIOR MOVIMENTO INDIVIDUAL DA SÉRIE. Gap REVERTE COLOSSAL +17.05pp LULA (vs +4.85pp Flávio ontem, variação 21.90pp em 24h MAIOR DA SÉRIE). 2L Lula 15.50% (↓1.00pp). STF IMPEACH COLAPSA 6.50% (↓4.00pp). QUAEST publicada 13/Mai: Lula 39% × Flávio 33% (G1, Gazeta do Povo, CartaCapital 13/Mai). Lula REASSUME VANTAGEM 2T (Quaest, JOTA 13/Mai). Lula MELHORA AVALIAÇÃO+intenção voto+rejeição diminui (Genial/Quaest 13/Mai). Lula vence Flávio 2T (TVT News 13/Mai).",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "BOMBA DO DIA: Áudio vazado Flávio negociou R$ 134 milhões com Vorcaro filme 'Dark Horse' (Intercept Brasil 13/Mai) abre flanco anti-direita. Campanha Lula vai explorar ligação Flávio-Vorcaro nas redes (CBN 13/Mai). Mensagens Flávio×Vorcaro viram munição Lula (Estadão 13/Mai). Fim taxa blusinhas reviravolta governo (G1, Gazeta do Povo 13/Mai); pesquisa interna 70% rejeição taxa determinante (G1 13/Mai); Lula esperou saída Haddad evitar mal-estar (CNN Brasil 13/Mai) gestão calibrada. Posse Kassio TSE consumada (TSE 13/Mai). MAS: oposição diz pesquisa máquina pública vê limite melhora (Folha 13/Mai). Eleitor não vê Lula nem Flávio como moderados (Estadão 13/Mai). Ibovespa recua dólar +2% (VEJA 13/Mai). Datafolha 15/Mai (D+1) validação pós-launch."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "28.45%",
    poll: "Flávio DESPENCA COLOSSAL 28.45% Poly (↓14.90pp de 43.35%) MAIOR QUEDA DA SÉRIE. Gap REVERTE COLOSSAL +17.05pp LULA (vs +4.85pp Flávio ontem, variação 21.90pp em 24h). 2L Flávio 61.00% (↓6.50pp). 3L DEVOLVE 3.30% (↓2.45pp). QUAEST 13/Mai: Flávio 33% × Lula 39% (G1, Gazeta do Povo 13/Mai). Lula REASSUME VANTAGEM 2T (JOTA, Quaest 13/Mai). PL Senado 77.00% (↑2.00pp recupera).",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "BOMBA: Áudio vazado Flávio negociou R$ 134 milhões com Vorcaro filme 'Dark Horse' (Intercept Brasil 13/Mai). Flávio ADMITE pedido após negativa anterior de 2 meses (Folha 13/Mai). Bolsonaristas DEBATEM SUBSTITUIR Flávio por Michelle (VEJA 13/Mai). Aliados se dizem traídos candidatura em xeque (G1 colunistas 13/Mai). 'Lei Rouanet da família Bolsonaro' Paulo Teixeira (G1 13/Mai). Caiado cobra explicações (G1 13/Mai). Lindbergh pede prisão preventiva à PF (SBT News 13/Mai). 'Tapa na cara da direita brasileira' deputado rompido (Estadão 13/Mai). Pressão renovada CPI Master (Câmara, Valor, Poder360 13/Mai). Mensagens Flávio×Vorcaro durante investigações PF Master já públicas (Estadão 13/Mai). Filme 'Dark Horse' é maior crise campanha Flávio (VEJA 13/Mai). MAS: Líder PL Sóstenes defende 'patrocínio privado' (VEJA 13/Mai). Bolsonaro ordena apoio Flávio (SBT News 13/Mai)."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "7.05%",
    poll: "Renan presidencial DISPARA 7.05% Poly (↑1.20pp de 5.85%) absorve parte migração Flávio pós-crise Vorcaro. 3L 31.50% (↓0.50pp leve cede para Zema RECUPERA LIDERANÇA 35.00%). 2L Renan 5.60% (↓1.15pp). STF IMPEACH COLAPSA 6.50% (↓4.00pp). Quaest 13/Mai não destaca Renan (G1, CartaCapital, VEJA).",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "Renan AUSENTE Quaest 13/Mai como destaque (G1, CartaCapital, VEJA 13/Mai) — Caiado 4% e Zema 4% destacados, Renan não. Crise Flávio-Vorcaro abre espaço outsider direita liberal MBL mas Lula CAPTURA maior parte migração com DISPARA 45.50%. Bolsonaristas debatem substituir Flávio por Michelle (VEJA 13/Mai) — direita pode reorganizar SEM Renan. Caiado 3L 18.50% estável. Eleitor não vê Lula nem Flávio como moderados (Estadão 13/Mai) narrativa alternativa relevante. Aprovação Lula 46.6-46.8% melhorando reduz oxigênio outsider. Datafolha 15/Mai pode reforçar bipolaridade nacional."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "2.65%",
    poll: "Haddad presidencial 2.65% Poly (estável). 2L Haddad 2.75% (↓0.10pp). 3L 4.20% (↓0.05pp). Camilo presidencial DEVOLVE 1.65% (↓0.90pp) — Haddad mantém 1.00pp ACIMA Camilo. PT Senado 3.05% (↑0.15pp). Quaest 13/Mai não destaca Haddad como cenário principal.",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Lula DISPARA Poly 45.50% (↑7.00pp) base PT beneficia Haddad por extensão. Lula MELHORA AVALIAÇÃO+intenção voto+rejeição diminui (Genial/Quaest 13/Mai). Fim taxa blusinhas reviravolta governo (G1, Gazeta do Povo 13/Mai); Lula esperou saída Haddad evitar mal-estar (CNN Brasil 13/Mai) gestão política calibrada com Haddad. PT Senado 3.05% (↑0.15pp). MAS: Tarcísio crítica Haddad mantida (Folha); Vox SP gap 12pp mantido (CartaCapital). Ibovespa recua dólar +2% (VEJA 13/Mai) fragiliza narrativa governo. Petrobras zera importações diesel (VEJA 13/Mai). Datafolha 15/Mai oportunidade reposicionamento."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1.25%",
    poll: "Caiado presidencial 1.25% Poly (estável). 3L mantém 18.50% estável consolida 3º competidor. PSD Senado 2.05%. QUAEST 13/Mai: Caiado 4% × Zema 4% empate técnico 1T 3ª via (G1, CartaCapital 13/Mai). Caiado COBRA EXPLICAÇÕES Flávio sobre Vorcaro (G1 13/Mai) postura institucional reposicionamento aproveita crise direita.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "Apesar empate Caiado×Zema 1T (Quaest 13/Mai), Zema CAPTURA mais espaço Poly (12.00% vs Caiado 1.25%) — mercado precifica Zema como receptor fragmentação direita pós-crise Vorcaro. SENADO: PL 77.00% (↑2.00pp recupera), MDB DEVOLVE 5.00% (↓3.65pp), Republicanos 5.25%, Podemos DEVOLVE 1.35% (↓1.70pp), PT 3.05% (↑0.15pp). 'Caiado sem apoio governadores PSD' (Gazeta do Povo mantida). Bolsonaristas debatem substituir Flávio por Michelle (VEJA 13/Mai) — direita pode reorganizar SEM Caiado. Líder PL Sóstenes defende Flávio 'patrocínio privado' (VEJA 13/Mai) — PL mantém Flávio."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "12.00%",
    poll: "Zema DISPARA COLOSSAL presidencial 12.00% Poly (↑8.15pp de 3.85%) MAIOR DISPARADA INDIVIDUAL 3ª via DA SÉRIE — absorve espaço Flávio pós-crise Vorcaro. 3L RECUPERA LIDERANÇA 35.00% (↑2.50pp). 2L Zema 7.25% (↑4.30pp DISPARA). NOVO Senado 0.85% (↓0.15pp). QUAEST 13/Mai: Zema 4% × Caiado 4% empate técnico 1T 3ª via (G1, CartaCapital 13/Mai).",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Crise Flávio-Vorcaro abre espaço narrativa direita alternativa moderada. 'Zema RADICALIZA impeachment STF + privatizar tudo' (Estadão 03/Mai mantida). Caiado 3L 18.50% estável competidor 3ª via. INFLAÇÃO bandas altas DEVOLVEM COLOSSAL (≥6.50%) 17.20% (↓23.10pp de 40.30%) reduz oxigênio discurso fiscal Zema momentaneamente. STF IMPEACH COLAPSA 6.50% (↓4.00pp) reduz narrativa anti-STF Zema. 2L Zema 7.25% ainda muito atrás Flávio 61% — caminho 2T requer continuidade colapso Flávio. Bolsonaristas debatem substituir Flávio por Michelle (VEJA 13/Mai) — direita pode reorganizar SEM Zema. Bolsonaro ordena apoio Flávio (SBT News 13/Mai) — base Bolsonaro resiste migração para Novo."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.55%",
    poll: "Tarcísio presidencial 0.55% Poly (↑0.30pp leve sobe). 2L Tarcísio 0.45%. Republicanos Senado 5.25% (↓0.20pp). PL Senado 77.00% (↑2.00pp recupera).",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Bolsonaristas DEBATEM SUBSTITUIR Flávio por Michelle (VEJA 13/Mai) — Tarcísio é candidato alternativo possível mas mantém foco SP. Líder PL Sóstenes defende Flávio (VEJA 13/Mai) — partido não fragmenta. Bolsonaro ordena apoio Flávio (SBT News 13/Mai) — base mantida. Crise Flávio-Vorcaro pode levar a reorganização interna PL/Republicanos. Mantido Tarcísio+Flávio reportados PG crimes eleitorais (Revista Fórum 02/Mai mantida). Mantido foco reeleição SP."
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
