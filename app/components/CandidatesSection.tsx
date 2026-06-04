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
    poll: "Lula recupera Poly 40.50% (↑1.0pp 24h, vol USD 6.10M acumulado). Gap Lula × Flávio ALARGA a +10.1pp (de +7.4pp), quase de volta ao baseline pré-salto — o salto de Flávio de 02/Jun está praticamente todo digerido. Real Time Big Data 01/Jun: 1T Lula 38% × Flávio 31%; 2T 45×40, mas Caiado empata Lula 43×43. Aprovação Lula 42% × desaprova 52%. Mercado de novo MAIS LARGO (+10.1pp) que o 1T da pesquisa (+7pp).",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTOS 04/Jun D+20: continuação do recuo de Flávio — Lula recupera (↑1.0pp) e o gap volta a +10.1pp. Lula na ofensiva no tarifaço: crava 'O PIX é do Brasil' em reunião ministerial, ataca o secretário Marco Rubio e anuncia nova carta a Trump, chamando o tratamento dos EUA de 'inaceitável' (g1). Governo diz que a tarifa pode chegar a 37,5% com sobretaxa. Mantida aprovação 42% × 52% (RTBD 01/Jun). STF impeach 5.50% estável."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "30.40%",
    poll: "Flávio DEVOLVE quase todo o salto: Poly 30.40% (↓1.7pp 24h vs 32.10% véspera, vol USD 6.42M acumulado) — 2º dia consecutivo de recuo, de volta perto do patamar pré-salto de 02/Jun. Gap para Lula alarga a +10.1pp. SENADO PL erode 4º dia a 72.50%. Real Time Big Data 01/Jun: 1T 31% (gap -7pp); 2T 40% × Lula 45; rejeição 46% > Lula 45% (Datafolha 22/Mai).",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 04/Jun: o tarifaço EUA virou PASSIVO LÍQUIDO. Lula vence o enquadramento ('O PIX é do Brasil', cartaz em reunião ministerial), a tarifa pode chegar a 37,5% com sobretaxa (governo) e a narrativa 'traidor' cola; até Renan ataca Flávio ('favorece Lula... maior jumento que já vi', Meio Norte). Flávio reage com cartaz 'O PIX é do Brasil e do Bolsonaro' e segue esperando que Trump atenda seu pedido (g1). Nunes Marques assume no TSE relatoria de representações envolvendo Flávio e Master. Mantida rejeição Flávio 46% > Lula 45%. STF impeach 5.50% estável."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "15.90%",
    poll: "Renan presidencial Poly 15.90% (~flat 24h, vol USD 6.57M acumulado). Segue SEGUNDO presidencial Poly, acima de Haddad (5.10%), Zema (2.50%), Caiado (1.90%). Real Time Big Data 01/Jun 1T Renan 6%; divergência mercado × pesquisa (~10pp) persiste como a mais larga do dashboard. 3L favorito a 3º lugar.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "Renan estável e tentando se descolar do bloco bolsonarista: atacou Flávio publicamente ('Flávio favorece Lula... maior jumento que já vi', Meio Norte). A 3ª via segue esvaziada após o realinhamento de Tarcísio (01-02/Jun), mas Renan mantém o 2º lugar de mercado bem acima do que a pesquisa lhe dá (~10pp, a maior divergência do dashboard). STF impeach 5.50% estável."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "5.10%",
    poll: "Haddad leve alta Poly 5.10% (↑0.2pp 24h, vol USD 5.40M acumulado). Real Time Big Data 01/Jun não lista Haddad no presidencial nacional. Mantida Vox SP 30/Mai 2T estadual Tarcísio 48.3% × Haddad 36.5% (Poder360).",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Haddad sobe leve (↑0.2pp). Como ministro da Fazenda, está no centro do tarifaço que mira o PIX — o governo cravou 'O PIX é do Brasil' como bandeira eleitoral e diz que a família Bolsonaro quer entregar o PIX ao setor privado (g1). Disputa estadual SP desfavorável (Vox 30/Mai Tarcísio 48.3% × Haddad 36.5%). STF impeach 5.50% estável."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1.90%",
    poll: "Caiado estável no piso: Poly 1.90% (~flat 24h, vol USD 3.81M acumulado). 3ª via segue esvaziada após Tarcísio fechar atrás de Flávio. Real Time Big Data 01/Jun: 1T Caiado 6% (2T empata Lula 43×43) — aqui o poll vê MAIS que o mercado (inversão rara). Mantida Quaest 13/Mai Caiado 4% empate Zema.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "Caiado segue no piso — a janela da centro-direita alternativa não reabre após o realinhamento de Tarcísio atrás de Flávio (01-02/Jun). RTBD 01/Jun ainda dá 6% e empate com Lula no 2T, leitura que o mercado não precifica. STF impeach 5.50% estável."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "2.40%",
    poll: "Zema presidencial Poly 2.50% (~flat 24h, vol USD 3.43M). 3ª via sem tração com a disputa binarizada Lula × Flávio. 3L vice-favorito a 3º atrás de Renan. Real Time Big Data 01/Jun: 1T Zema 4%; 2T Zema 40 × Lula 43. Mantida Quaest 13/Mai Zema 4% empate Caiado.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Zema estável no piso — a 3ª via não reabre. STJ deu 15 dias para Zema se manifestar em caso de calúnia contra Gilmar Mendes. STF impeach 5.50% estável."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.15%",
    poll: "Tarcísio presidencial 0.15% Poly estável (vol USD ~12.3M acumulado, anomalia de legado). PL Senado erode 4º dia a 72.50% (de 74.00%). Real Time Big Data 01/Jun não destaca Tarcísio nacional (foco reeleição SP). Mantida Vox SP 30/Mai 2T estadual Tarcísio 48.3% × Haddad 36.5% (Poder360).",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Tarcísio foi o fiador do realinhamento de 02/Jun (apoio a Flávio), mas o salto que ele destravou já reverteu quase inteiro com o tarifaço virando passivo. Participou da Marcha para Jesus em SP ao lado de Flávio, Nunes e Messias (g1). Foco na reeleição em SP, onde lidera. STF impeach 5.50% estável."
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
