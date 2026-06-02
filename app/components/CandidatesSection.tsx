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
    polymarket: "39.50%",
    poll: "Lula CEDE Poly 39.50% (↓1.0pp 24h, vol USD 6.08M acumulado). Gap Lula × Flávio COLAPSA pra +6.1pp (de +11.3pp na véspera) com a disparada de Flávio. Real Time Big Data 01/Jun: 1T Lula 38% × Flávio 31%; 2T 45×40, mas Caiado empata Lula 43×43. Aprovação Lula 42% × desaprova 52%. Mercado agora MAIS APERTADO (+6.1pp) que o 1T da pesquisa (+7pp).",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTOS 02/Jun D+18: reprecificação forte no curto prazo — Flávio dispara +4.2pp e o gap despenca a +6.1pp. DRIVERS: (1) Tarcísio descarta a 3ª via e fecha apoio a Flávio (Imirante, ACidade ON 01-02/Jun), consolidando a direita; (2) tarifaço EUA de 25% (02/Jun, mira o PIX) 6 dias após Flávio ver Trump. Lula reage chamando os filhos de Bolsonaro de 'traidores da pátria'; o governo culpa a família pelo tarifaço e diz que vai proteger o PIX (O Tempo, Estado de Minas, G1). Mantida aprovação 42% × 52% (RTBD). STF impeach 5.50% estável."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "33.40%",
    poll: "Flávio DISPARA Poly 33.40% (↑4.2pp 24h vs 29.20% véspera, vol USD 6.24M acumulado) — maior alta do ciclo. Gap para Lula estreita a +6.1pp. 🔥 SENADO PL recua a 75.50% (de 77.50%, leitura cautelosa de book). Real Time Big Data 01/Jun: 1T 31% (gap -7pp); 2T 40% × Lula 45; rejeição 46% > Lula 45% (Datafolha 22/Mai). Mercado precifica Flávio bem acima do 1T da pesquisa, refletindo a consolidação da direita.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 02/Jun: maior alta do ciclo (+4.2pp). DRIVER 1 — Tarcísio descarta a 3ª via e sela apoio a Flávio: 'a disputa será entre Lula e Flávio... meu candidato é Flávio, ponto' (Imirante, ACidade ON), consolidando a direita atrás dele. DRIVER 2 — tarifaço EUA de 25% (02/Jun, mira o PIX) 6 dias após Flávio ver Trump; Flávio se descola, com carta ao Secretário Marco Rubio pedindo não taxar (O Tempo, Estado de Minas). Fator DOUBLE-EDGED: protagonismo/eixo EUA vs ataque 'traidor da pátria' (Lula, PT). Mantida rejeição Flávio 46% > Lula 45%. STF impeach 5.50% estável."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "15.60%",
    poll: "Renan presidencial Poly 15.60% (↓1.2pp 24h, vol USD 6.52M acumulado) — 3ª via sangra após Tarcísio binarizar a disputa (Lula × Flávio). Segue SEGUNDO presidencial Poly, acima de Haddad (5.10%), Zema (2.50%), Caiado (2.00%). Real Time Big Data 01/Jun 1T Renan 6%; divergência mercado × pesquisa (~10pp) persiste como a mais larga do dashboard. 3L favorito a 3º lugar.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "Renan cede 1.2pp — a fala de Tarcísio de que 'não há espaço para terceira via' e o apoio fechado a Flávio (Imirante, ACidade ON) tiram oxigênio de toda a 3ª via. RTBD 01/Jun dá 6% no 1T, ainda bem abaixo do mercado. STF impeach 5.50% estável. Mantido Estadão 'terceira via tem janela estreita'."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "5.10%",
    poll: "Haddad cede Poly 5.10% (↓1.0pp 24h vs 6.10% véspera, vol USD 5.36M acumulado) — ruído fino no dia da reprecificação em torno do eixo Flávio/Tarcísio/tarifaço. Real Time Big Data 01/Jun não lista Haddad no presidencial nacional. Mantida Vox SP 30/Mai 2T estadual Tarcísio 48.3% × Haddad 36.5% (Poder360).",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Haddad cede 1.0pp (ruído fino). Como ministro da Fazenda, está no centro do tarifaço EUA de 25% que mira o PIX: diz que a família Bolsonaro fez 'movimento' contra o PIX e que o governo vai proteger a ferramenta (G1). Disputa estadual SP desfavorável (Vox 30/Mai Tarcísio 48.3% × Haddad 36.5%). STF impeach 5.50% estável."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "2.00%",
    poll: "Caiado DEVOLVE o salto de ontem: Poly 2.00% (↓0.6pp 24h vs 2.60% véspera, vol USD 3.78M acumulado). Tarcísio fechando a 3ª via atrás de Flávio tira a tração da aliança Caiado-Zema. Real Time Big Data 01/Jun: 1T Caiado 6% (2T empata Lula 43×43) — aqui o poll vê MAIS que o mercado (inversão rara). Mantida Quaest 13/Mai Caiado 4% empate Zema.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "Caiado devolve a alta de ontem (↓0.6pp) — Tarcísio declarando que 'não há espaço para terceira via' e fechando apoio a Flávio (Imirante, ACidade ON) esvazia a janela da centro-direita alternativa. A aliança Caiado-Zema perde tração no curto prazo. STF impeach 5.50% estável. Mantido Estadão 'terceira via tem janela estreita'."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "2.50%",
    poll: "Zema presidencial Poly 2.50% (↓0.3pp 24h, vol USD 3.38M). 3ª via sangra com Tarcísio binarizando Lula × Flávio. 3L vice-favorito a 3º atrás de Renan. Real Time Big Data 01/Jun: 1T Zema 4%; 2T Zema 40 × Lula 43. Mantida Quaest 13/Mai Zema 4% empate Caiado.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Zema cede com o resto da 3ª via após a fala de Tarcísio de que 'não há espaço para terceira via' (Imirante, ACidade ON). A aliança Caiado-Zema perde tração no curto prazo. STJ deu 15 dias para Zema se manifestar em caso de calúnia contra Gilmar Mendes. STF impeach 5.50% estável."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.15%",
    poll: "Tarcísio presidencial 0.15% Poly estável (vol USD ~12.3M acumulado, anomalia de legado). 🔥 PL Senado recua a 75.50% (de 77.50%, leitura cautelosa de book). Real Time Big Data 01/Jun não destaca Tarcísio nacional (foco reeleição SP). Mantida Vox SP 30/Mai 2T estadual Tarcísio 48.3% × Haddad 36.5% (Poder360).",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Tarcísio foi o PROTAGONISTA do dia mesmo sem se candidatar: descartou a 3ª via e selou apoio a Flávio ('a disputa será entre Lula e Flávio... meu candidato é Flávio, ponto', Imirante, ACidade ON), evento que reprecificou o mercado inteiro — Flávio +4.2pp e 3ª via em queda. Foco na reeleição em SP, onde lidera. STF impeach 5.50% estável."
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
