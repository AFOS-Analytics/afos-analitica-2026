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
    poll: "Lula estável Poly 40.50% (vol USD 6.20M acumulado). O gap Lula × Flávio fechou de +13.35pp para +11.15pp, com Flávio devolvendo parte da queda (sobe 2.20pp a 29.35%). Sem pesquisa nacional nova confirmada: Vox Brasil 05/Jun (n=2.100, BR-08016/2026) segue referência, 1T Lula 42.1% × Flávio 33.6% (gap +8.5pp); 2T 47.8 × 41.3. Surge a Nexus/BTG (CartaCapital, sem números); Quaest prevista para quarta 10/Jun.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTOS 09/Jun D+26: dia de volatilidade, o gap fechou a +11.15pp com Flávio devolvendo parte da queda. Evento do dia: a suspensão da pesquisa AtlasIntel pelo TSE (Kassio Nunes Marques) escala, com a associação de pesquisas falando em precedente perigoso e o caso podendo ir ao STF (Folha, CNN Brasil). Lula faz ofensiva para tirar o novo tarifaço da cabeça de Trump (Folha). STF impeach recua a 3.55%."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "29.35%",
    poll: "Flávio sobe 2.20pp: Poly 29.35% (vol USD 6.54M acumulado), devolvendo parte da queda recente (segundo movimento de alta no curto prazo). Gap para Lula em +11.15pp. Vox Brasil 05/Jun: 1T 33.6% (gap -8.5pp); 2T 41.3% × Lula 47.8. Lidera o 2º lugar no mercado a 62.50% (↓1.00pp). Rejeição 46% > Lula 45% (Datafolha 22/Mai).",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 09/Jun: a suspensão, a pedido de Flávio, da pesquisa AtlasIntel pelo TSE (Kassio Nunes Marques) escalou, a associação de pesquisas fala em precedente perigoso e o caso pode ir ao STF (Folha, CNN Brasil, Estadão). A campanha estrutura time econômico (Daniella Marques cotada como Posto Ipiranga, O Globo). Caiado cobra que Flávio explique o elo com Vorcaro. Caso Master: 2ª delação de Vorcaro avaliada como sem fatos novos (O Globo). STF impeach recua a 3.55%."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "17.15%",
    poll: "Renan presidencial Poly 17.15% (↓0.40pp 24h, vol USD 6.74M acumulado), 3º no mercado presidencial de vencedor. Favorito a terminar em 3º lugar no 1º turno (43.50%, ↓2.00pp) e 2º colocado no mercado do 2º lugar (16.85%, atrás de Flávio 62.50%). Vox Brasil 05/Jun não destaca Renan no 1T; divergência mercado × pesquisa (~11pp) persiste como a mais larga do dashboard.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "Renan recuou (↓0.40pp) mas segue, nas apostas, muito acima do que as pesquisas lhe dão (~11pp, a maior divergência do dashboard, a Vox 05/Jun sequer o destaca no 1º turno). É favorito ao 3º lugar (43.50%) e 2º no mercado do 2º colocado, atrás de Flávio. Noticiou-se que o Missão monta apostas estaduais para ajudar Renan no Planalto. A Quaest de quarta pode ser o 1º teste nacional dessa divergência. STF impeach 3.55%."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "2.85%",
    poll: "Haddad cede Poly 2.85% (↓0.10pp 24h, vol USD 5.62M acumulado), 5º nome presidencial atrás de Camilo Santana (3.75%). Vox Brasil 05/Jun não lista Haddad no presidencial nacional. Mantida Vox SP 30/Mai 2T estadual Tarcísio 48.3% × Haddad 36.5% (Poder360).",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Haddad segue atrás de Camilo Santana no mercado presidencial. Como ministro da Fazenda, no centro da disputa do PIX/tarifaço, mas o mercado não precifica candidatura presidencial dele. A ala do PT-SP pressiona por Simone Tebet na vice de Haddad no projeto estadual de SP. Disputa estadual SP desfavorável (Vox 30/Mai Tarcísio 48.3% × Haddad 36.5%). STF impeach 3.55%."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1.65%",
    poll: "Caiado cede no piso: Poly 1.65% (↓0.10pp, vol USD 3.92M acumulado). Vox Brasil 05/Jun: 1T Caiado 6.9% (LIDERA a 3ª via na pesquisa); 2T Lula empata Caiado, aqui o poll vê MUITO MAIS que o mercado (inversão rara, em 2 pesquisas seguidas, com RTBD 01/Jun 6% e empate 43×43).",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "Caiado segue no piso do mercado, mas é o líder da 3ª via nas pesquisas: a Vox 05/Jun dá 6.9% no 1T e empate com Lula no 2T, leitura que o mercado não precifica (mantém abaixo de 2%). No dia, Caiado cobrou que Flávio explique o elo com Daniel Vorcaro. A Quaest de quarta pode testá-la. STF impeach 3.55%."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "1.95%",
    poll: "Zema presidencial Poly 1.95% (↓0.25pp 24h, vol USD 3.53M), devolve o repique do dia anterior e volta ao piso da 3ª via. Vox Brasil 05/Jun: 2T Lula empata Zema (poll vê mais que o mercado). Favorito ao 3º lugar no 1º turno no mercado (22%), atrás de Renan. 3ª via sem tração com a disputa bipolarizada Lula × Flávio.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Zema devolveu o repique do dia anterior (↓0.25pp) e voltou ao piso, a 3ª via não reabre com a disputa bipolarizada. A Vox 05/Jun dá Lula empatando Zema no 2º turno, leitura mais favorável que a do mercado. STF impeach 3.55%."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.15%",
    poll: "Tarcísio presidencial 0.15% Poly estável (vol USD ~12.5M acumulado, anomalia de legado). PL Senado em 73.50% (↑1.00pp, vol USD 243k). Vox Brasil 05/Jun não destaca Tarcísio nacional (foco reeleição SP). Mantida Vox SP 30/Mai 2T estadual Tarcísio 48.3% × Haddad 36.5% (Poder360).",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Tarcísio foi o fiador do realinhamento de 02/Jun (apoio a Flávio); o salto que ele destravou reverteu, mas Flávio voltou a subir 2.20pp em 09/Jun. Foco na reeleição em SP, onde lidera. PL lidera o Senado a 73.50%. STF impeach recua a 3.55%."
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
