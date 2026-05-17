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
    poll: "Lula estável 44.50% Poly (sem variação 48h+, mantém liderança ampla). Gap AMPLIA +13.20pp LULA (vs +12.00pp 16/Mai noite ↑1.20pp 18h, Lula consolida sem ganhar — Flávio cede). 2L Lula 16.00% (↑1.00pp 18h). STF IMPEACH MÍNIMA DO CICLO 6.15% (↓1.10pp 24h, ↓6.60pp 48h vs pico 12.75% 15/Mai retorna abaixo do baseline). DATAFOLHA 16/Mai mantida: 1T Lula 38% × Flávio 35% gap +3pp; 2T 45×45 empate. Quaest 13/Mai mantida: Lula 39% × Flávio 33%. DIVERGÊNCIA mercado × pesquisa AMPLIA: Polymarket gap +13.20pp vs Datafolha gap +3pp (mercado precifica deterioração Flávio que pesquisa ainda não capturou).",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTOS 17/Mai domingo D+3: Lula reage na busca por reeleição com pacote de benesses e vê caso Master acuar adversários (G1, Folha 17/Mai); Lula diz a aliados que pretende indicar Jorge Messias novamente ao STF (Coluna Basília, Notícias 17/Mai) reaproveita dossiê STF; Motta sobre CPI Master 'tratamento regimental' (Revista Oeste, Pleno.News, Portal 96FM 17/Mai) sinal esfriar; AtlasIntel publicada após áudio Flávio-Vorcaro (Gazeta do Povo 17/Mai); Lindbergh 'Lula tenta surfar crise Flávio' (Correio Braziliense 17/Mai); Campanhas Lula × Flávio travam batalha judicial TSE período pré-eleitoral (G1, BPMoney 17/Mai); 'Vento virou a favor de Lula e contra Flávio Bolsonaro' (UOL Notícias 17/Mai); Fim taxa blusinhas primeira reação governo derrotas Congresso (Folha 17/Mai). MAS: Mantidos 16/Mai: Armínio Fraga 'País meio perdido sem caminho claro' (Estadão); Cade iFood; Fiesp Justiça energia. Aprovação Lula 46.6-46.8% melhorando."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "31.30%",
    poll: "Flávio CEDE 31.30% Poly (↓1.20pp 18h, ↓1.20pp 24h vs 32.50% 16/Mai noite — perde sem Lula ganhar). Gap AMPLIA +13.20pp LULA (vs +12.00pp 16/Mai noite). 2L Flávio 62.00% (↑1.50pp 18h, base resiste). 3L COLAPSA 3.25% (↓2.30pp 18h vs 5.55% 16/Mai). PL Senado 78.50% (↑0.50pp estável). DATAFOLHA 16/Mai mantida: 1T Flávio 35% × Lula 38% gap -3pp; 2T 45×45 empate (G1, Folha 16/Mai). Quaest 13/Mai mantida Flávio 33% × Lula 39%. AtlasIntel publicada 17/Mai pós-áudio (Gazeta do Povo 17/Mai) ainda sem números detalhados.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 17/Mai domingo D+3: AtlasIntel publicada após áudio Flávio-Vorcaro (Gazeta do Povo, ICL Notícias 17/Mai); 'Me subestimaram, não vou desistir do meu Brasil' (Gazeta do Povo 17/Mai); Motta sobre CPI Master 'tratamento regimental' (Revista Oeste, Pleno.News 17/Mai); Campanhas Lula × Flávio travam batalha judicial TSE (G1 17/Mai); Disputa Lula × Flávio acirrada até na rejeição (ParaibaOnline 17/Mai); 'Vento virou a favor de Lula contra Flávio' (UOL Notícias 17/Mai); Abilio quer CPI Master e alfineta Zema (Rdnews 17/Mai). MAS: 3L Flávio COLAPSA 3.25% (↓2.30pp 18h) — mercado precifica saída cenário 3º lugar. Mantidos 16/Mai: Sergio Moro defende + assina CPI Master; Foragido 'Os Meninos' preso Dubai; 7 pedidos CPMI; Plano filme Bolsonaro USD 1 mi 'imigração'; Augusto Cury 'Bolsonaros têm que explicar Justiça'; Família Bolsonaro fundo aliado Eduardo casa EUA. MICHELLE 2.35% estável (↓0.45pp 18h) narrativa substituição mantém tração baixa."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "9.05%",
    poll: "Renan presidencial 9.05% Poly (↓0.70pp 18h vs 9.75% 16/Mai noite) leve recuo mas mantém topo 3ª via Poly acima Zema (5.35%). 2L Renan DISPARA 7.70% (↑1.90pp 18h vs 5.80% 16/Mai) — mercado precifica chance Renan virar 2º lugar caso Flávio caia. 3L Renan 30.00% (↓1.00pp 18h) estável topo. STF IMPEACH MÍNIMA 6.15% (↓1.10pp 24h reduz combustível anti-establishment). Datafolha 16/Mai não destaca Renan headline (G1, Folha 16/Mai). Mantido 'Sou candidato direita' (BBC 28/Abr).",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "Renan AUSENTE notícias 17/Mai domingo — domingo dia leve cobertura. 2L DISPARA 7.70% (↑1.90pp 18h) — mercado revaloriza Renan como potencial 2º colocado conforme Flávio cede. Discrepância presidencial Poly (9.05%) × 3L (30.00%) mantida — mercado vê Renan como '3º consolidado' não 'presidencial competitivo'. Flávio CEDE 31.30% (↓1.20pp 18h) abre espaço outsiders mas Renan presidencial não capta. ZEMA cede 5.35% (↓0.30pp 18h) Renan mantém liderança 3ª via Poly. Joaquim Barbosa filiado DC candidato Planalto (continuação 16/Mai) — concorrência 3ª via centro mas Renan ocupa direita liberal MBL diferente. STF IMPEACH 6.15% MÍNIMA do ciclo reduz combustível narrativa anti-STF. Aprovação Lula 46.6-46.8% melhorando."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "2.25%",
    poll: "Haddad presidencial 2.25% Poly estável 18h. 2L Haddad 2.55% estável. 3L 3.85% (↑0.30pp 18h leve). Camilo presidencial 1.45% (↓0.15pp 18h) — Haddad mantém 0.80pp ACIMA Camilo. PT Senado 3.00% estável. Datafolha 16/Mai não destaca Haddad cenário principal — Lula 38% mantém liderança PT sem Haddad emergir.",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Lula estável Poly 44.50% mantém liderança base PT beneficia Haddad por extensão. EVENTOS 17/Mai: Lula reage com pacote benesses reeleição (G1, Folha 17/Mai); Lula reindicará Jorge Messias ao STF (Coluna Basília, Notícias 17/Mai) — sinal coordenação governo-STF; Motta CPI Master 'tratamento regimental' (Revista Oeste 17/Mai); Fim taxa blusinhas reação derrotas Congresso (Folha 17/Mai); 'Vento virou a favor de Lula' (UOL Notícias 17/Mai). STF IMPEACH MÍNIMA 6.15% (↓1.10pp 24h, ↓6.60pp 48h) institucionalidade firme. Aprovação Lula 46.6-46.8% melhorando. MAS: Mantida Tarcísio crítica Haddad (Folha 05/Mai); Vox SP gap 12pp mantido; Mantidos 16/Mai: Foragido 'Os Meninos' preso Dubai; Rogério Marinho cobra CPI Lula-Vorcaro; Armínio Fraga 'País meio perdido'; Cade iFood; Fiesp Justiça energia."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1.15%",
    poll: "Caiado presidencial 1.15% Poly estável 18h. 3L Caiado SOBE 20.50% (↑2.00pp 18h, ↑4.00pp 48h vs 16.50% 15/Mai) — consolida 3º lugar do 3L atrás Zema e Renan. PSD Senado RECUPERA 5.65% (↑2.05pp 18h vs 3.60% 16/Mai noite — reverte cedência). Mantida Quaest 13/Mai: Caiado 4% × Zema 4% empate técnico 1T 3ª via. Mantido Caiado 'não fará juízo de valor' sobre Flávio (G1 16/Mai) postura institucional.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "Caiado 3L SOBE 20.50% (↑2.00pp 18h) — segunda alta consecutiva mas ainda gap -16pp Zema 3L 36.50% (que RECUPERA ↑4.00pp 18h). RENAN 3L 30.00% estável Caiado segue abaixo. SENADO: PL 78.50% (↑0.50pp estável), PSD RECUPERA 5.65% (↑2.05pp), MDB COLAPSA spike 4.70% (↓11.85pp confirma distorção anomalia 16/Mai), Republicanos 11.00% (↑0.60pp), PODEMOS 1.80% (↓0.40pp). EVENTOS 17/Mai: Abilio quer CPI Master e alfineta Zema (Rdnews 17/Mai) — sinal hostilidade 3ª via direita interna. Mantidos 16/Mai: 'Caiado sem apoio governadores PSD' (Gazeta do Povo); Joaquim Barbosa filiado DC candidato Planalto — concorrência 3ª via centro tradicional; Caiado 'não fará juízo de valor' Flávio postura institucional. MICHELLE 2.35% estável ocupa espaço alternativo direita."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "5.35%",
    poll: "Zema presidencial 5.35% Poly (↓0.30pp 18h vs 5.65% 16/Mai noite — leve recuo) mantém-se abaixo Renan (9.05%). 3L Zema RECUPERA 36.50% (↑4.00pp 18h vs 32.50% 16/Mai — reverte cedência de 24h e volta liderança 3L). 2L Zema 6.90% (↑1.25pp 18h). NOVO Senado 0.80% (↓0.20pp 18h). Mantida Quaest 13/Mai: Zema 4% × Caiado 4% empate técnico 1T 3ª via. Mantido Zema 'página virada' aliança 3ª via direita preservada (Estadão 16/Mai).",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "ZEMA RECUPERA 3L 36.50% (↑4.00pp 18h) — reverte cedência colossal de 16/Mai (↓7.00pp 24h) e retoma liderança 3L acima de Renan (30.00%) e Caiado (20.50%). Flávio CEDE 31.30% (↓1.20pp 18h) abre espaço migração outsiders 3ª via direita. INFLAÇÃO bandas altas (≥6.50%) RECUPERAM 15.85% (↑2.65pp 18h vs 13.20% 16/Mai) — narrativa fiscal extrema volta força beneficia Zema discurso 'privatizar tudo'. STF IMPEACH MÍNIMA 6.15% (↓6.60pp 48h) reduz combustível narrativa anti-STF Zema. EVENTOS 17/Mai: Abilio alfineta Zema (Rdnews 17/Mai) — hostilidade 3ª via direita interna. Mantidos 16/Mai: Zema 'página virada' aliança preservada; Joaquim Barbosa DC concorrência 3ª via centro; 'Zema RADICALIZA impeachment STF + privatizar tudo' (Estadão 03/Mai). Pesquisa MG indefinição Pacheco (17/Mai)."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.35%",
    poll: "Tarcísio presidencial 0.35% Poly (↓0.10pp 18h vs 0.45% 16/Mai). 2L Tarcísio 0.30% estável. Republicanos Senado RECUPERA 11.00% (↑0.60pp 18h vs 10.40% 16/Mai). PL Senado 78.50% (↑0.50pp estável). Datafolha 16/Mai mantida — não destaca Tarcísio cenário presidencial.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Republicanos Senado RECUPERA 11.00% (↑0.60pp 18h) reverte cedência 16/Mai. Tarcísio mantém foco reeleição SP. EVENTOS 17/Mai: 'Vento virou a favor de Lula contra Flávio' (UOL Notícias 17/Mai); Campanhas Lula × Flávio batalha judicial TSE (G1, BPMoney 17/Mai); Pesquisa MG indefinição Pacheco (17/Mai) — sinal incerteza estaduais. Mantidos 16/Mai: Derrite (vice SP Republicanos) lança pré-Senado SP evento com Flávio em Sorocaba (G1) — articulação SP fortalecida com Republicanos; Tarcísio Sabesp 'mão pesada Estado' (O Globo); Tarcísio+Flávio reportados PG crimes eleitorais (Revista Fórum 02/Mai mantida). Crise Flávio-Vorcaro pode levar reorganização interna PL/Republicanos. Mantidos 13/Mai: Bolsonaristas debatem substituir Flávio por Michelle (VEJA). MICHELLE 2.35% estável + 2L 3.20% (↑0.35pp 18h) — direita pode reorganizar com Michelle não necessariamente Tarcísio. Joaquim Barbosa filiado DC candidato Planalto continuação."
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