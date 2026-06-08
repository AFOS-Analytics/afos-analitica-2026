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
    polymarket: "40.50%",
    poll: "Lula estável Poly 40.50% (vol USD 6.17M acumulado). Gap Lula × Flávio VOLTA A ALARGAR a +13.25pp (de +12.35pp), porque Flávio devolveu 0.90pp. De volta ao topo do ciclo. Sem pesquisa nacional nova: Vox Brasil 05/Jun (n=2.100, BR-08016/2026) segue referência — 1T Lula 42.1% × Flávio 33.6% (gap +8.5pp), Lula +7.8pp desde meados de maio; 2T 47.8 × 41.3, e Lula empata Caiado e Zema. Quaest dada como iminente (VEJA).",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTOS 07/Jun D+23: dia de continuidade — o gap volta a alargar a +13.25pp (Flávio devolve 0.90pp). A repercussão da fala de Lula de 02/Jun sobre 'traidores' segue no debate, fazendo petistas e bolsonaristas trocarem de posição (Folha); a campanha criou uma central de monitoramento de redes (Folha). Contraponto: PoderData aponta 52% de desaprovação à participação de Janja. STF impeach 5.15%."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "27.25%",
    poll: "Flávio devolve 0.90pp: Poly 27.25% (vol USD 6.50M acumulado) — segue bem abaixo do patamar pré-salto de 02/Jun. Gap para Lula VOLTA A ALARGAR a +13.25pp. Vox Brasil 05/Jun: 1T 33.6% (gap -8.5pp, caiu 2.9pp desde meados de maio); 2T 41.3% × Lula 47.8. Lidera o 2º lugar no mercado a 63.50% (vol USD 61k). Rejeição 46% > Lula 45% (Datafolha 22/Mai).",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 07/Jun: o tarifaço/PIX (TariFlávio) segue como PASSIVO e Lula escala a retórica (fala sobre 'traidores', Folha). REVÉS: o TCU arquivou uma representação de Flávio sobre a ex-nora de Lula por falta de indícios mínimos (O Globo, Folha). Na campanha, Flávio lançou o 1º jingle e enquadra a disputa como 'batalha espiritual' (Gazeta do Povo). Caso Master segue ativo no STF (suspeição de Moraes). STF impeach 5.15%."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "17.35%",
    poll: "Renan presidencial Poly 17.35% (↑0.65pp 24h, vol USD 6.66M acumulado), 3º no mercado presidencial de vencedor. Favorito a terminar em 3º lugar no 1º turno (45.00%) e 2º colocado no mercado do 2º lugar (17.15%, atrás de Flávio 63.50%). Vox Brasil 05/Jun não destaca Renan no 1T; divergência mercado × pesquisa (~11pp) persiste como a mais larga do dashboard.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "Renan subiu (↑0.65pp) e segue, nas apostas, muito acima do que as pesquisas lhe dão (~11pp, a maior divergência do dashboard — a Vox 05/Jun sequer o destaca no recorte principal de 1º turno). É favorito ao 3º lugar (45.00%) e 2º no mercado do 2º colocado, atrás de Flávio. A VEJA fala em 'candidato que cresce nas pesquisas e vira dor de cabeça para a direita' no duelo Lula × Flávio. STF impeach 5.15%."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "3.10%",
    poll: "Haddad cede Poly 3.10% (↓0.15pp 24h, vol USD 5.59M acumulado) e perde o 4º lugar presidencial do mercado para Camilo Santana (3.75%). Vox Brasil 05/Jun não lista Haddad no presidencial nacional. Mantida Vox SP 30/Mai 2T estadual Tarcísio 48.3% × Haddad 36.5% (Poder360).",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Haddad cedeu o 4º lugar presidencial a Camilo Santana. Como ministro da Fazenda, segue no centro da disputa do PIX/tarifaço, em que o governo cravou 'O PIX é do Brasil' como bandeira, mas o mercado não precifica candidatura presidencial dele. Disputa estadual SP desfavorável (Vox 30/Mai Tarcísio 48.3% × Haddad 36.5%). STF impeach 5.15%."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1.75%",
    poll: "Caiado leve recuo no piso: Poly 1.75% (↓0.20pp 24h, vol USD 3.87M acumulado). Vox Brasil 05/Jun: 1T Caiado 6.9% (LIDERA a 3ª via na pesquisa); 2T Lula empata Caiado — aqui o poll vê MUITO MAIS que o mercado (inversão rara, em 2 pesquisas seguidas, com RTBD 01/Jun 6% e empate 43×43).",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "Caiado segue no piso do mercado, mas é o líder da 3ª via nas pesquisas: a Vox 05/Jun dá 6.9% no 1T e empate com Lula no 2T, leitura que o mercado não precifica (mantém abaixo de 2%). É a inversão rara em que duas pesquisas seguidas veem mais que o Polymarket. STF impeach 5.15%."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "2.05%",
    poll: "Zema presidencial Poly 2.05% (↓1.00pp 24h, vol USD 3.49M), 5º dia consecutivo de queda, no piso da 3ª via. Vox Brasil 05/Jun: 2T Lula empata Zema (poll vê mais que o mercado). 3ª via sem tração com a disputa bipolarizada Lula × Flávio. Mantida Quaest 13/Mai Zema 4% empate Caiado.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Zema em queda pelo 5º dia, segue no piso — a 3ª via não reabre com a disputa bipolarizada. A Vox 05/Jun dá Lula empatando Zema no 2º turno, leitura mais favorável que a do mercado. STF impeach 5.15%."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.15%",
    poll: "Tarcísio presidencial 0.15% Poly estável (vol USD ~12.4M acumulado, anomalia de legado). PL Senado em 73.00% (vol USD 243k). Vox Brasil 05/Jun não destaca Tarcísio nacional (foco reeleição SP). Mantida Vox SP 30/Mai 2T estadual Tarcísio 48.3% × Haddad 36.5% (Poder360).",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Tarcísio foi o fiador do realinhamento de 02/Jun (apoio a Flávio), mas o salto que ele destravou já reverteu inteiro com o tarifaço virando passivo (TariFlávio). Foco na reeleição em SP, onde lidera. STF impeach 5.15%."
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
