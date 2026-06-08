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
    poll: "Lula estável Poly 40.50% (vol USD 6.18M acumulado). Gap Lula × Flávio em +13.35pp (↑0.10pp), no topo do ciclo, com Flávio cedendo 0.10pp. Sem pesquisa nacional nova publicada: Vox Brasil 05/Jun (n=2.100, BR-08016/2026) segue referência — 1T Lula 42.1% × Flávio 33.6% (gap +8.5pp); 2T 47.8 × 41.3, e Lula empata Caiado e Zema. Quaest prevista para quarta 10/Jun.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTOS 08/Jun D+24: dia de continuidade — gap em +13.35pp, no topo do ciclo. Evento do dia: o TSE (Nunes Marques) suspendeu uma pesquisa da AtlasIntel que apontava queda de Flávio, a pedido dele; a campanha de Lula classificou como precedente perigoso (Folha, O Globo). O tarifaço/PIX segue como ganho do governo (O POVO: dupla 'BolsoMaster e TariFlávio'). STF impeach repica a 5.45%."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "27.15%",
    poll: "Flávio cede 0.10pp: Poly 27.15% (vol USD 6.51M acumulado) — segue bem abaixo do patamar pré-salto de 02/Jun. Gap para Lula em +13.35pp, no topo do ciclo. Vox Brasil 05/Jun: 1T 33.6% (gap -8.5pp); 2T 41.3% × Lula 47.8. Lidera o 2º lugar no mercado a 63.50% (vol USD 61k). Rejeição 46% > Lula 45% (Datafolha 22/Mai).",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 08/Jun: a pedido de Flávio, o TSE (Nunes Marques) suspendeu uma pesquisa da AtlasIntel que apontava queda dele, por suposta indução do eleitor (Folha, O Globo, G1, Estadão); a campanha de Lula classificou como precedente perigoso. Caso Master ativo: a 2ª versão da delação de Vorcaro é avaliada como sem fatos novos (O Globo). O tarifaço/PIX segue como passivo. STF impeach repica a 5.45%."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "17.55%",
    poll: "Renan presidencial Poly 17.55% (↑0.20pp 24h, vol USD 6.68M acumulado), 3º no mercado presidencial de vencedor. Favorito a terminar em 3º lugar no 1º turno (45.50%) e 2º colocado no mercado do 2º lugar (17.00%, atrás de Flávio 63.50%). Vox Brasil 05/Jun não destaca Renan no 1T; divergência mercado × pesquisa (~11pp) persiste como a mais larga do dashboard.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "Renan subiu (↑0.20pp) e segue, nas apostas, muito acima do que as pesquisas lhe dão (~11pp, a maior divergência do dashboard — a Vox 05/Jun sequer o destaca no 1º turno). É favorito ao 3º lugar (45.50%) e 2º no mercado do 2º colocado, atrás de Flávio. A VEJA fala em 'candidato que cresce e vira dor de cabeça para a direita'. A Quaest de quarta pode ser o 1º teste nacional dessa divergência. STF impeach 5.45%."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "2.95%",
    poll: "Haddad cede Poly 2.95% (↓0.15pp 24h, vol USD 5.60M acumulado), 5º nome presidencial atrás de Camilo Santana (3.85%). Vox Brasil 05/Jun não lista Haddad no presidencial nacional. Mantida Vox SP 30/Mai 2T estadual Tarcísio 48.3% × Haddad 36.5% (Poder360).",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Haddad segue atrás de Camilo Santana no mercado presidencial. Como ministro da Fazenda, no centro da disputa do PIX/tarifaço, em que o governo cravou 'O PIX é do Brasil' como bandeira, mas o mercado não precifica candidatura presidencial dele. Disputa estadual SP desfavorável (Vox 30/Mai Tarcísio 48.3% × Haddad 36.5%). STF impeach 5.45%."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1.75%",
    poll: "Caiado estável no piso: Poly 1.75% (vol USD 3.90M acumulado). Vox Brasil 05/Jun: 1T Caiado 6.9% (LIDERA a 3ª via na pesquisa); 2T Lula empata Caiado — aqui o poll vê MUITO MAIS que o mercado (inversão rara, em 2 pesquisas seguidas, com RTBD 01/Jun 6% e empate 43×43).",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "Caiado segue no piso do mercado, mas é o líder da 3ª via nas pesquisas: a Vox 05/Jun dá 6.9% no 1T e empate com Lula no 2T, leitura que o mercado não precifica (mantém abaixo de 2%). É a inversão rara em que duas pesquisas seguidas veem mais que o Polymarket. A Quaest de quarta pode testá-la. STF impeach 5.45%."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "2.20%",
    poll: "Zema presidencial Poly 2.20% (↑0.15pp 24h, vol USD 3.51M), interrompe a sequência de quedas, ainda no piso da 3ª via. Vox Brasil 05/Jun: 2T Lula empata Zema (poll vê mais que o mercado). 3ª via sem tração com a disputa bipolarizada Lula × Flávio. Mantida Quaest 13/Mai Zema 4% empate Caiado.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Zema interrompeu a sequência de quedas (↑0.15pp), mas segue no piso — a 3ª via não reabre com a disputa bipolarizada. A Vox 05/Jun dá Lula empatando Zema no 2º turno, leitura mais favorável que a do mercado. STF impeach 5.45%."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.15%",
    poll: "Tarcísio presidencial 0.15% Poly estável (vol USD ~12.4M acumulado, anomalia de legado). PL Senado em 72.50% (vol USD 243k). Vox Brasil 05/Jun não destaca Tarcísio nacional (foco reeleição SP). Mantida Vox SP 30/Mai 2T estadual Tarcísio 48.3% × Haddad 36.5% (Poder360).",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Tarcísio foi o fiador do realinhamento de 02/Jun (apoio a Flávio), mas o salto que ele destravou já reverteu inteiro com o tarifaço virando passivo (TariFlávio). Foco na reeleição em SP, onde lidera. STF impeach repica a 5.45%."
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
