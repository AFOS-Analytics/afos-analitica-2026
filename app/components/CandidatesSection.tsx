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
    polymarket: "43.50%",
    poll: "Lula CEDE 43.50% Poly (↓1.00pp 20h primeira variação em 60h+, primeira movimentação após estabilidade 48h+). Gap ENCOLHE +11.95pp LULA (vs +13.20pp 17/Mai noite, ↓1.25pp 20h). 2L Lula 15.50% (↓0.50pp 20h). STF IMPEACH NOVA MÍNIMA DO CICLO 5.30% (↓0.85pp 24h, ↓7.45pp 72h vs pico 12.75% 15/Mai, ↓2.70pp baseline 8% 14/Mai). DATAFOLHA 16/Mai mantida 1T 38% × 35%; Quaest 13/Mai 39% × 33%. ATLASINTEL nacional publica amanhã 19/Mai n=5.000 pós-áudio. DATAFOLHA nova nacional 22/Mai n=2.004 testando Michelle Bolsonaro (InfoMoney, CartaCapital 18/Mai). DIVERGÊNCIA mercado × pesquisa: Polymarket gap +11.95pp vs Datafolha +3pp = ~9pp (encolheu 1.20pp).",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTOS 18/Mai D+4: Datafolha publica sexta 22/Mai incluindo Michelle Bolsonaro (InfoMoney, CartaCapital, VEJA 18/Mai); AtlasIntel publica amanhã 19/Mai n=5.000 (Exame, Ric.com 18/Mai); Veritá/LeiaJá: Lula rejeição 52%, Flávio 43.7% (LeiaJá 18/Mai); Aliados Alcolumbre veem como estranho movimento nova indicação Messias (18/Mai) tensão Executivo-Senado; 70% brasileiros enxergam sabotagem Congresso contra governo Lula (Brasil 247 18/Mai); Reação mercado financeiro ao caso Flávio levanta debate sobre trade eleitoral (Estadão E-Investidores 18/Mai); Taxa blusinhas vira desgaste continuado para governo Lula (18/Mai); Ano eleitoral deve impulsionar novas medidas populares estímulos governo Lula somam X bi (18/Mai). Mantidos 17/Mai: Lula reindicará Messias ao STF; pacote benesses reeleição; Motta CPI Master 'tratamento regimental'; batalha judicial TSE; 'Vento virou favor Lula'. Aprovação Lula 46.6-46.8% melhorando."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "31.55%",
    poll: "Flávio estável 31.55% Poly (↑0.25pp 20h leve recuperação) enquanto Lula cede 1pp. Gap ENCOLHE para +11.95pp LULA (↓1.25pp em 20h vs +13.20pp 17/Mai). 2L Flávio 62.00% estável. 3L 3.25% estável (mercado mantém fora cenário 3º lugar). PL Senado 78.50% estável. DATAFOLHA 16/Mai mantida 35% × 38%; Quaest 13/Mai 33% × 39%. DATAFOLHA nova 22/Mai inclui CENÁRIO COM MICHELLE BOLSONARO (InfoMoney, CartaCapital, VEJA 18/Mai) — teste explícito de substituição na chapa. AtlasIntel publica amanhã 19/Mai n=5.000.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 18/Mai D+4: DATAFOLHA testa cenário Michelle Bolsonaro contra Lula em pesquisa que sai sexta 22/Mai (InfoMoney, CartaCapital, VEJA 18/Mai) — mercado já precifica substituição como hipótese viável (Michelle Poly presidencial 2.40%, 2L 2.50%, 3L 4.50%); AtlasIntel 19/Mai n=5.000 vai medir Flávio pós-áudio com peso amostral (Exame, Ric.com 18/Mai); Datafolha mede impacto caso Flávio e testa força Michelle contra Lula (InfoMoney 18/Mai); Datafolha antecipa cenário mais favorável a Lula após caso BolsoMaster (Vermelho 18/Mai); Caso Master: CPI dará transparência a todas as denúncias (Gazeta do Povo 18/Mai); Banco Master racha STF: ministros evitam eventos e trocam críticas nos bastidores (18/Mai); Chefe da PF vai à Câmara em meio a revelação conversas Flávio-Vorcaro (18/Mai); Atritos crise ministros STF transbordam eventos sociais Brasília (18/Mai); Reação mercado financeiro ao caso Flávio levanta debate sobre trade eleitoral (Estadão E-Investidores 18/Mai). Mantidos 17/Mai: Sergio Moro defende; Foragido 'Os Meninos' preso Dubai; 7 pedidos CPMI; Família Bolsonaro fundo aliado Eduardo casa EUA. MICHELLE 2.40% (↑0.05pp) — narrativa substituição GANHA tração via Datafolha 22/Mai."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "9.70%",
    poll: "Renan RECUPERA 9.70% Poly (↑0.65pp 20h vs 9.05% 17/Mai noite) volta perto do topo da semana e mantém liderança 3ª via Poly acima Zema (4.95%). 2L Renan SOBE 8.90% (↑1.20pp 20h vs 7.70% 17/Mai, ↑3.10pp 48h vs 5.80% 16/Mai) — mercado consolida hipótese Renan como 2º colocado. 3L Renan 31.50% (↑1.50pp 20h). STF IMPEACH NOVA MÍNIMA 5.30% reduz combustível anti-establishment. AtlasIntel 19/Mai n=5.000 vai medir.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "Renan RECUPERA 0.65pp presidencial pela 1ª vez na semana, com 2L DISPARANDO 8.90% (↑3.10pp em 48h). Discrepância presidencial Poly (9.70%) × 3L (31.50%) mantida estrutural — mercado vê Renan como '3º consolidado' não 'presidencial competitivo'. Flávio estável 31.55% mas LULA CEDE 1pp abre espaço pra outsiders. ZEMA cede mais 0.40pp pra 4.95% (mínimo da semana) Renan amplia liderança 3ª via Poly. DATAFOLHA 22/Mai NÃO inclui Renan no cenário central de teste (Michelle é a variável). AtlasIntel 19/Mai n=5.000 vai medir Renan pós-áudio com amostra grande pela 1ª vez. Datafolha histórica não destaca Renan headline. Mantido 'Sou candidato direita' (BBC 28/Abr). Aprovação Lula 46.6-46.8% melhorando."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "2.55%",
    poll: "Haddad SOBE 2.55% Poly (↑0.30pp 20h vs 2.25% 17/Mai noite). 2L Haddad 2.55% estável. 3L 3.80% estável. Camilo 1.45% estável — Haddad amplia gap acima Camilo para 1.10pp. PT Senado 2.90% (↓0.10pp). Datafolha 16/Mai não destaca Haddad. Datafolha 22/Mai foco em Michelle Bolsonaro, não Haddad.",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Lula CEDE Poly 43.50% (↓1pp em 60h+ pela 1ª vez), mas Haddad sobe 0.30pp na contramão — mercado precifica Haddad como hedge interno PT caso Lula vacile. EVENTOS 18/Mai: Datafolha 22/Mai testa Michelle Bolsonaro × Lula (InfoMoney, CartaCapital 18/Mai); Aliados Alcolumbre veem como estranho Messias (18/Mai) tensão Executivo-Senado; 70% brasileiros enxergam sabotagem Congresso (Brasil 247 18/Mai); Taxa blusinhas continua desgastando governo (Folha 18/Mai); Reação mercado financeiro debate trade eleitoral (Estadão E-Investidores 18/Mai); Ano eleitoral deve impulsionar novas medidas populares estímulos (18/Mai). STF impeach NOVA MÍNIMA 5.30% institucionalidade firme. Aprovação Lula 46.6-46.8% melhorando. MAS: Mantida Tarcísio crítica Haddad (Folha 05/Mai); Vox SP gap 12pp mantido."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1.35%",
    poll: "Caiado SOBE 1.35% Poly (↑0.20pp 20h vs 1.15% 17/Mai noite). 3L Caiado DEVOLVE 17.50% (↓3.00pp 20h vs 20.50% 17/Mai) — devolve parte da recuperação. PSD Senado estável 5.65% (mantém recuperação de 17/Mai). 2L Caiado SOBE 1.35% (↑0.50pp 20h). Mantida Quaest 13/Mai: Caiado 4% × Zema 4% empate técnico 1T 3ª via.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "Caiado presidencial SOBE 0.20pp em 20h enquanto Lula CEDE 1pp — primeiro movimento simultâneo Caiado vs Lula da semana. 3L Caiado DEVOLVE 3pp em 20h (20.50%→17.50%) mas ainda em patamar elevado vs início de semana. ZEMA 3L estável 36.50%, Renan 3L sobe 31.50%. SENADO: PL 78.50% estável, PSD 5.65% estável, Republicanos DEVOLVE 6.75% (↓4.25pp 20h), União 4.90% (↑1.25pp), MDB COLAPSA 1.45% (↓3.25pp continua devolvendo spike). EVENTOS 18/Mai: Datafolha 22/Mai foco Michelle não Caiado; Veritá: Lula rejeição 52% × Flávio 43.7% (LeiaJá 18/Mai). Mantidos 17/Mai: Abilio quer CPI Master alfineta Zema; Aécio neutralidade PSDB sem Ciro. Mantidos 16/Mai: 'Caiado sem apoio governadores PSD'; Joaquim Barbosa DC. MICHELLE 2.40% mantém espaço alternativo direita."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "4.95%",
    poll: "Zema CEDE 4.95% Poly (↓0.40pp 20h vs 5.35% 17/Mai noite) — nova mínima do mês, abaixo de Renan (9.70%) por gap -4.75pp. 3L Zema 36.50% estável (mantém liderança 3L). 2L Zema COLAPSA 3.75% (↓3.15pp 20h vs 6.90% 17/Mai) — mercado devolve recuperação 2L de ontem. NOVO Senado 0.80% estável. Mantida Quaest 13/Mai 4% empate Caiado.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "ZEMA cede 0.40pp presidencial — quarta queda da semana, perfil 'cede sem direção clara'. 2L COLAPSA 3.15pp em 20h (6.90%→3.75%) sinal mercado precificando Renan como receptor migração não Zema. 3L 36.50% mantém liderança topo mas Renan (31.50%) e Caiado (17.50%) atrás. INFLAÇÃO bandas altas (≥6.50%) DEVOLVEM 14.05% (↓1.80pp 20h vs 15.85% 17/Mai) — narrativa fiscal extrema cede beneficiando Zema discurso 'privatizar tudo'. STF impeach NOVA MÍNIMA 5.30% reduz combustível anti-STF Zema. EVENTOS 18/Mai: Datafolha 22/Mai foco Michelle não Zema; AtlasIntel 19/Mai vai medir. Mantidos 17/Mai: Abilio alfineta Zema (Rdnews); Pesquisa MG indefinição Pacheco. Mantidos 16/Mai: Zema 'página virada'; 'Zema RADICALIZA impeachment STF + privatizar tudo' (Estadão 03/Mai)."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.35%",
    poll: "Tarcísio presidencial 0.35% Poly estável. 2L Tarcísio 0.30% estável. Republicanos Senado DEVOLVE 6.75% (↓4.25pp 20h vs 11.00% 17/Mai) — perde toda a recuperação de ontem. PL Senado 78.50% estável.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Republicanos Senado COLAPSA 4.25pp em 20h (11.00%→6.75%) — devolve recuperação 17/Mai. EVENTOS 18/Mai: Datafolha 22/Mai testa MICHELLE Bolsonaro × Lula em cenário substituição (InfoMoney, CartaCapital, VEJA 18/Mai) — reorganização direita oficialmente medida; AtlasIntel 19/Mai n=5.000 amanhã (Exame 18/Mai); Banco Master racha STF (18/Mai); Reação mercado financeiro debate trade eleitoral (Estadão E-Investidores 18/Mai). Tarcísio mantém foco reeleição SP. MICHELLE 2.40% + 2L 2.50% — Datafolha 22/Mai vai oficializar Michelle como hipótese substituição em pesquisa nacional, oposto de Tarcísio (que mercado coloca em 0.35% presidencial). Mantidos 17/Mai: 'Vento virou favor Lula'; batalha judicial TSE; Pesquisa MG. Mantidos 16/Mai: Derrite pré-Senado SP com Flávio Sorocaba; Tarcísio Sabesp 'mão pesada Estado'; Tarcísio+Flávio reportados PG crimes eleitorais (Revista Fórum). Mantidos 13/Mai: Bolsonaristas debatem substituir Flávio por Michelle (VEJA)."
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