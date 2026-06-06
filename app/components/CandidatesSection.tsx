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
    polymarket: "41.50%",
    poll: "Lula sobe Poly 41.50% (↑1.0pp 24h, vol USD 6.14M acumulado). Gap Lula × Flávio ALARGA a +13.30pp (de +10.1pp), o mais largo do ciclo recente — 3º dia de recuo de Flávio. Vox Brasil 05/Jun (n=2.100, BR-08016/2026): 1T Lula 42.1% × Flávio 33.6% (gap +8.5pp), Lula +7.8pp desde meados de maio; 2T 47.8 × 41.3, e Lula empata Caiado e Zema. Mercado e pesquisa na mesma direção.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTOS 05/Jun D+21: Flávio cai pelo 3º dia e Lula sobe, com o gap alargando a +13.30pp — agora confirmado pela pesquisa (Vox 05/Jun 1T +8.5pp). O tarifaço/PIX virou ganho do governo (Estadão: 'esquerda domina o debate sobre tarifas e Pix') e Lula passou a se apresentar como antissistema (Gazeta do Povo). Contraponto: rejeição da indicação de Messias ao STF lida como 'cacetada' em Lula (Gazeta do Povo); PoderData aponta 52% de desaprovação à participação de Janja. STF impeach 5.45% estável."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "28.20%",
    poll: "Flávio CAI 3º dia: Poly 28.20% (↓2.2pp 24h, vol USD 6.43M acumulado) — bem abaixo do patamar pré-salto de 02/Jun. Gap para Lula alarga a +13.30pp. Vox Brasil 05/Jun: 1T 33.6% (gap -8.5pp, caiu 2.9pp desde meados de maio); 2T 41.3% × Lula 47.8. SENADO PL 72.50%. Rejeição 46% > Lula 45% (Datafolha 22/Mai).",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 05/Jun: o tarifaço/PIX se firmou como PASSIVO. A esquerda domina o enquadramento sobre tarifas e Pix (Estadão) e a fala de Eduardo Bolsonaro pressiona a campanha; Flávio insiste que 'o Pix é do Bolsonaro', mas a Folha lembra que Bolsonaro disse desconhecer a medida em 2020. No STF, Flávio pede que Moraes seja declarado suspeito no caso Master (Terra, Band) e Fachin nega afastar Nunes Marques da relatoria da CPI (BPMoney). Mantida rejeição Flávio 46% > Lula 45%. STF impeach 5.45% estável."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "16.40%",
    poll: "Renan presidencial Poly 16.40% (↑0.5pp 24h, vol USD 6.61M acumulado). Segue SEGUNDO presidencial Poly e favorito a 3º lugar (3L 44.50%), acima de Zema (3.25%), Haddad (2.65%), Caiado (2.35%). Vox Brasil 05/Jun não destaca Renan no 1T; divergência mercado × pesquisa (~10pp) persiste como a mais larga do dashboard.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "Renan subiu levemente e preserva o 2º lugar de mercado, muito acima do que as pesquisas lhe dão (~10pp, a maior divergência do dashboard — a Vox 05/Jun sequer o destaca no recorte principal de 1º turno). A VEJA fala em 'candidato que cresce nas pesquisas e vira dor de cabeça para a direita' no duelo Lula × Flávio, sinal de 3ª via tentando se viabilizar enquanto a disputa se bipolariza. STF impeach 5.45% estável."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "2.65%",
    poll: "Haddad CAI Poly 2.65% (↓2.45pp 24h, vol USD 5.54M acumulado) — devolve o prêmio das últimas sessões e perde a 3ª posição presidencial do mercado. Vox Brasil 05/Jun não lista Haddad no presidencial nacional. Mantida Vox SP 30/Mai 2T estadual Tarcísio 48.3% × Haddad 36.5% (Poder360).",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Haddad recuou forte no mercado (↓2.45pp). Como ministro da Fazenda, segue no centro da disputa do PIX, em que o governo cravou 'O PIX é do Brasil' como bandeira, mas o mercado não precifica candidatura presidencial. Disputa estadual SP desfavorável (Vox 30/Mai Tarcísio 48.3% × Haddad 36.5%). STF impeach 5.45% estável."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "2.35%",
    poll: "Caiado leve alta no piso: Poly 2.35% (↑0.45pp 24h, vol USD 3.86M acumulado). Vox Brasil 05/Jun: 1T Caiado 6.9% (LIDERA a 3ª via na pesquisa); 2T Lula empata Caiado — aqui o poll vê MUITO MAIS que o mercado (inversão rara, agora em 2 pesquisas seguidas, com RTBD 01/Jun 6% e empate 43×43).",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "Caiado segue no piso do mercado, mas é o líder da 3ª via nas pesquisas: a Vox 05/Jun dá 6.9% no 1T e empate com Lula no 2T, leitura que o mercado não precifica (mantém abaixo de 2.5%). É a inversão rara em que duas pesquisas seguidas veem mais que o Polymarket. STF impeach 5.45% estável."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "3.25%",
    poll: "Zema presidencial Poly 3.25% (↑0.75pp 24h, vol USD 3.47M), ainda no piso da 3ª via. Vox Brasil 05/Jun: 2T Lula empata Zema (poll vê mais que o mercado). 3ª via sem tração com a disputa bipolarizada Lula × Flávio. Mantida Quaest 13/Mai Zema 4% empate Caiado.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Zema com leve alta, mas segue no piso — a 3ª via não reabre com a disputa bipolarizada. A Vox 05/Jun dá Lula empatando Zema no 2º turno, leitura mais favorável que a do mercado. STF impeach 5.45% estável."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.15%",
    poll: "Tarcísio presidencial 0.15% Poly estável (vol USD ~12.4M acumulado, anomalia de legado). PL Senado em 72.50%. Vox Brasil 05/Jun não destaca Tarcísio nacional (foco reeleição SP). Mantida Vox SP 30/Mai 2T estadual Tarcísio 48.3% × Haddad 36.5% (Poder360).",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Tarcísio foi o fiador do realinhamento de 02/Jun (apoio a Flávio), mas o salto que ele destravou já reverteu inteiro com o tarifaço virando passivo — Flávio caiu pelo 3º dia. Foco na reeleição em SP, onde lidera. STF impeach 5.45% estável."
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
