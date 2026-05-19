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
    poll: "Lula DISPARA 45.50% Poly (↑2.00pp em 26h primeira reação grande do mercado à AtlasIntel publicada hoje). Gap HISTÓRICO +17.35pp LULA (vs +11.95pp 18/Mai noite ↑5.40pp em 26h). 2L Lula 14.50% (↓1.50pp 26h). STF IMPEACH 6.05% (↑0.75pp 24h leve recuperação da mínima ciclo 5.30%). ATLASINTEL 19/Mai n=5.000 publicada: 1T Lula 47.0% × Flávio 34.3% gap +12.7pp; 2T 48.9% × 41.8% gap +7.1pp; aprovação Lula 47.4% Atlas / 42.9% Bloomberg; desaprovação 51.3%. Datafolha 16/Mai mantida 1T 38×35 / 2T 45×45. DIVERGÊNCIA Polymarket × AtlasIntel 4.65pp (Poly mais agressivo); AtlasIntel × Datafolha 9.7pp 1T.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTOS 19/Mai D+5: ATLASINTEL PUBLICADA primeiro print nacional pós-áudio Flávio-Vorcaro com Lula ampliando vantagem (BBC, Estadão, Folha, CNN Brasil, Poder360, Valor 19/Mai); LULA LEVA MESSIAS a ato com tom eleitoral antes do reenvio formal STF (Folha 19/Mai) sinal forte coordenação Executivo-STF + ato campanha; MINISTRO LULA admite 'taxa blusinhas foi erro' + confirma elo Flávio-Master vai pra campanha (Folha 19/Mai); QUAEST 32% reeleição Lula é melhor resultado / 24% retorno Bolsonaro / 22% 3ª via (G1 19/Mai); AtlasIntel 47.4% temem Flávio × 40.5% temem Lula reeleito (CNN Brasil 19/Mai). Mantidos 18/Mai: 70% brasileiros enxergam sabotagem Congresso (Brasil 247); Reação mercado financeiro debate trade eleitoral (Estadão). Mantidos 17/Mai: Lula reindicará Messias ao STF; pacote benesses reeleição; Motta CPI Master 'tratamento regimental'; batalha judicial TSE; 'Vento virou favor Lula'. MAS: desaprovação Lula 51.3% Atlas (Poder360); rejeição 50.6% Atlas (Estadão); 40.5% temem Lula reeleito (CNN Brasil). Próxima Datafolha 22/Mai sex n=2.004 cenário Michelle decisiva."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "28.15%",
    poll: "Flávio COLAPSA 28.15% Poly (↓3.40pp em 26h mínima do ciclo, primeira reação grande do mercado à AtlasIntel). Gap HISTÓRICO +17.35pp LULA. 2L Flávio 62.50% (↑0.50pp 26h base PL resiste). 3L Flávio 4.80% (↑1.55pp recuperação modesta). PL Senado 78.50% estável. ATLASINTEL 19/Mai: 1T 34.3% (cai 6 pontos vs anterior), 2T 41.8% perde para Lula 48.9%, rejeição sobe 49.8% para 52% (BBC, Estadão, Folha, CNN Brasil, Poder360, Valor). Datafolha 16/Mai mantida 1T 35% × 38%. Próxima Datafolha 22/Mai testa cenário Michelle como substituta na chapa PL.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 19/Mai D+5: EQUIPE FLÁVIO ACIONA TSE pedindo suspensão da divulgação da pesquisa AtlasIntel (Folha, Congresso em Foco 19/Mai) escalada institucional via TSE como tentativa de bloqueio; AtlasIntel inclui áudio na pesquisa empresa nega impacto no resultado (Gazeta do Povo 19/Mai); FLÁVIO DISCUTIU RENÚNCIA com pai e tenta conter danos no PL (VEJA José Casado 19/Mai) aliados PL avaliam saída substituição chapa; Money Times: Flávio despenca de 47.8% para 41.8% 2T após ligação com Vorcaro (19/Mai); 'Pesquisa mostra abalo candidatura Flávio após pedido dinheiro a Vorcaro' (GZH 19/Mai); 'Como bolsonaristas e indecisos reagiram à revelação ligação Flávio-Vorcaro em grupos WhatsApp' (BBC 19/Mai). MINISTRO LULA confirma elo Flávio-Master vai pra campanha (Folha 19/Mai). Mantidos 18/Mai: Banco Master racha STF; Chefe PF vai à Câmara; AtlasIntel publica amanhã (cumprido). Mantidos 17/Mai: Sergio Moro defende; Foragido 'Os Meninos' preso Dubai; 7 pedidos CPMI. MICHELLE 2.25% (↓0.15pp) + 2L 1.55% (↓0.95pp) — narrativa substituição perde tração no Polymarket mesmo com discussão pública. Datafolha 22/Mai sex inclui cenário Michelle Bolsonaro (InfoMoney, VEJA, CartaCapital 18/Mai)."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "12.55%",
    poll: "Renan DISPARA 12.55% Poly (↑2.85pp em 26h vs 9.70% 18/Mai noite) consolida topo 3ª via Poly acima Zema (6.25%). 2L Renan 9.50% (↑0.60pp 26h / ↑1.80pp 48h vs 7.70% 17/Mai). 3L Renan DISPARA TOPO 35.50% (↑4.00pp em 26h ULTRAPASSA Zema 28.50% pela primeira vez na semana). STF IMPEACH 6.05% (↑0.75pp 24h leve recuperação). AtlasIntel 19/Mai não destaca números detalhados 3ª via no recorte publicado. Quaest 22% apontam 3ª via como melhor resultado (G1 19/Mai).",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "Renan DISPARA 2.85pp presidencial em 26h, com 3L DISPARANDO 4.00pp ULTRAPASSANDO Zema topo 3L. Discrepância presidencial Poly (12.55%) × 3L (35.50%) mantida estrutural mas estreitada — mercado migra Flávio-colapsado para Renan como receptor 3ª via principal. ZEMA 3L COLAPSA 28.50% (↓8.00pp 26h) cede topo 3L; CAIADO 3L CEDE 13.50% (↓4.00pp). Migração de mercado clara: anti-Flávio anti-Lula concentra em Renan, não Zema nem Caiado. DATAFOLHA 22/Mai foco Michelle (não inclui Renan no cenário central). AtlasIntel 19/Mai publicada sem destaque 3ª via no headline. Quaest 22% 3ª via é melhor (G1 19/Mai) consolida narrativa. Joaquim Barbosa pré-candidato (JOTA 19/Mai) compete pelo mesmo espaço 3ª via centro. Mantido 'Sou candidato direita' (BBC 28/Abr). Aprovação Lula 47.4% Atlas melhorando reduz combustível anti-establishment Renan."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "2.35%",
    poll: "Haddad 2.35% Poly (↓0.20pp 26h vs 2.55% 18/Mai noite). 2L Haddad RECUPERA 4.25% (↑1.70pp 26h vs 2.55% ganha relevância 2º turno). 3L Haddad 2.00%. Camilo 1.50% estável — Haddad mantém gap acima Camilo. PT Senado 2.95% (↑0.05pp). AtlasIntel 19/Mai não destaca Haddad. Próxima Datafolha 22/Mai foco em Michelle Bolsonaro, não Haddad.",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Lula DISPARA Poly 45.50% (↑2.00pp 26h pós-AtlasIntel), Haddad cede 0.20pp presidencial mas 2L DISPARA 1.70pp (2.55%→4.25%) — mercado precifica Haddad como hedge 2º turno PT caso Lula vacile ou cenário mudança. EVENTOS 19/Mai: AtlasIntel publicada Lula amplia vantagem (BBC, Estadão); Lula leva Messias a ato eleitoral (Folha); Quaest 32% Lula reeleição melhor (G1); ministro Lula 'taxa blusinhas foi erro' (Folha). Mantidos 18/Mai: Datafolha 22/Mai testa Michelle × Lula; 70% brasileiros enxergam sabotagem Congresso. STF impeach 6.05% (↑0.75pp leve recuperação). Aprovação Lula 47.4% Atlas / 42.9% Bloomberg. MAS: Mantida Tarcísio crítica Haddad (Folha 05/Mai); Vox SP gap 12pp mantido."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1.45%",
    poll: "Caiado 1.45% Poly (↑0.10pp 26h vs 1.35% 18/Mai noite estável marginal). 3L Caiado CEDE 13.50% (↓4.00pp 26h vs 17.50% / ↓7.00pp vs pico 20.50%) — devolve mais a recuperação. 2L Caiado 1.35% estável. PSD Senado 4.95% (↓0.70pp 26h vs 5.65%). Mantida Quaest 13/Mai: Caiado 4% × Zema 4% empate técnico 1T 3ª via.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "Caiado 3L CEDE 4.00pp em 26h (17.50%→13.50%) — devolve mais terreno, agora ↓7.00pp vs pico 20.50% 17/Mai. Migração 3L para Renan (35.50% topo) e não Caiado consolida narrativa mercado tira Caiado do cenário 3º lugar. ZEMA 3L também COLAPSA 28.50% (↓8.00pp). RENAN 3L assume TOPO 35.50%. SENADO: PL 78.50% estável, PSD 4.95% (↓0.70pp 26h), Republicanos COLAPSA 4.20% (↓6.80pp pico 11%), MDB RECUPERA 4.90% (↑3.45pp). EVENTOS 19/Mai: AtlasIntel publicada (não destaca Caiado); ministro Lula elo Flávio-Master vai pra campanha (Folha); Quaest 22% 3ª via melhor (G1). Mantidos 17/Mai: Abilio quer CPI Master alfineta Zema; Aécio neutralidade PSDB. Mantidos 16/Mai: 'Caiado sem apoio governadores PSD'; Joaquim Barbosa DC (JOTA 19/Mai pré-candidato). MICHELLE 2.25% (↓0.15pp) mantém espaço alternativo direita reduzido."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "6.25%",
    poll: "Zema 6.25% Poly (↑1.30pp 26h vs 4.95% 18/Mai reverte cedência da mínima do mês) — mas ainda abaixo de Renan (12.55%) por gap -6.30pp. 3L Zema COLAPSA 28.50% (↓8.00pp 26h vs 36.50% 18/Mai) — cede topo 3L para Renan (35.50%) pela primeira vez na semana. 2L Zema 3.65% (↓0.10pp 26h estável baixo). NOVO Senado 1.00% (↑0.20pp leve recuperação). Mantida Quaest 13/Mai 4% empate Caiado.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "ZEMA RECUPERA 1.30pp presidencial reverte cedência mínima do mês — mas 3L COLAPSA 8.00pp em 26h (36.50%→28.50%) cede topo 3L para Renan (35.50%). Sinal mercado precificando Renan como receptor migração 3ª via não Zema. 3L Caiado também CEDE 13.50% (↓4.00pp). INFLAÇÃO bandas altas (≥6.50%) COLAPSAM 9.00% (↓5.05pp 26h vs 14.05% 18/Mai) cauda fiscal extrema vira pode reduzir tração discurso 'privatizar tudo' Zema. STF impeach 6.05% (↑0.75pp leve recuperação mas ainda baixo) reduz combustível anti-STF Zema. EVENTOS 19/Mai: AtlasIntel publicada sem destaque Zema; Quaest 22% 3ª via melhor (G1). Mantidos 17/Mai: Abilio alfineta Zema (Rdnews); Pesquisa MG indefinição Pacheco. Mantidos 16/Mai: Zema 'página virada' aliança 3ª via direita preservada; 'Zema RADICALIZA impeachment STF + privatizar tudo' (Estadão 03/Mai)."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.35%",
    poll: "Tarcísio presidencial 0.35% Poly estável (vol acumulado USD 11.36M anomalia histórica — muita aposta para-e-contra desde abertura). 2L Tarcísio 0.30% estável. 3L Tarcísio 0.95% (↑0.05pp estável). Republicanos Senado COLAPSA 4.20% (↓2.55pp 26h vs 6.75% / ↓6.80pp pico 11.00% 17/Mai) — devolve toda a recuperação. PL Senado 78.50% estável dominância.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Republicanos Senado COLAPSA 2.55pp em 26h (6.75%→4.20%) — devolve toda a recuperação 17-18/Mai. Volume USD 11.36M Tarcísio presidencial mantém anomalia (preço baixo + volume alto = convicção concentrada historicamente para-e-contra). EVENTOS 19/Mai: ATLASINTEL publicada Flávio cai 6 pontos (BBC, Estadão); equipe Flávio aciona TSE; Flávio discutiu renúncia com pai (VEJA); MICHELLE 2.25% (↓0.15pp) narrativa substituição na chapa PL perde tração no Polymarket. Datafolha 22/Mai sex inclui cenário Michelle Bolsonaro (InfoMoney, CartaCapital, VEJA 18/Mai) — vai oficializar Michelle como hipótese substituição pesquisa nacional. Tarcísio mantém foco reeleição SP. Mantidos 17/Mai: 'Vento virou favor Lula'; batalha judicial TSE; Pesquisa MG. Mantidos 16/Mai: Derrite pré-Senado SP com Flávio Sorocaba; Tarcísio Sabesp 'mão pesada Estado'; Tarcísio+Flávio reportados PG crimes eleitorais (Revista Fórum). Mantidos 13/Mai: Bolsonaristas debatem substituir Flávio por Michelle (VEJA)."
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
