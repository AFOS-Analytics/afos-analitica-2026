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
    poll: "Lula estável Poly 39.50% (flat 24h, vol USD 6.09M acumulado). Gap Lula × Flávio ALARGA de volta a +7.4pp (de +6.1pp na véspera) com a correção de Flávio. Real Time Big Data 01/Jun: 1T Lula 38% × Flávio 31%; 2T 45×40, mas Caiado empata Lula 43×43. Aprovação Lula 42% × desaprova 52%. Mercado de novo MAIS LARGO (+7.4pp) que o 1T da pesquisa (+7pp), a convergência de 02/Jun se desfez.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTOS 03/Jun D+19: dia de correção — Flávio devolve parte do salto (↓1.3pp) e o gap volta a +7.4pp. Lula contra-ataca no front EUA: diz que o secretário de Estado Marco Rubio é 'anti-América Latina' e 'não gosta do Brasil' (g1 03/Jun). O tarifaço de 25% começa a virar passivo para a oposição: Amcham vê 'janela' de negociação e o chanceler Mauro Vieira deve encontrar Rubio em Paris (g1). Mantida aprovação 42% × 52% (RTBD 01/Jun). STF impeach 5.50% estável."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "32.10%",
    poll: "Flávio DEVOLVE parte do salto: Poly 32.10% (↓1.3pp 24h vs 33.40% véspera, vol USD 6.27M acumulado) — correção técnica após o spike de +4.2pp de 02/Jun. Gap para Lula alarga de volta a +7.4pp. SENADO PL recua a 74.00% (de 75.50%). Real Time Big Data 01/Jun: 1T 31% (gap -7pp); 2T 40% × Lula 45; rejeição 46% > Lula 45% (Datafolha 22/Mai). Mercado segue precificando Flávio acima do 1T da pesquisa, mas devolve parte do prêmio da consolidação.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 03/Jun: correção do salto (↓1.3pp) — digestão técnica do spike de ontem somada à virada do enquadramento do tarifaço. O tarifaço EUA de 25% começa a pesar como PASSIVO: Amcham vê 'janela' de negociação, o chanceler Mauro Vieira deve encontrar Rubio em Paris e análise aponta a 'conta do tarifaço 2.0 na mesa do bolsonarismo' (g1). É o fator DOUBLE-EDGED que sinalizamos em 02/Jun se materializando (custo, não só protagonismo). Flávio recebe título de cidadão honorário em BH e se reúne com Eduardo Cunha (g1). Mantida rejeição Flávio 46% > Lula 45%. STF impeach 5.50% estável."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "15.80%",
    poll: "Renan presidencial Poly 15.80% (~flat 24h, vol USD 6.55M acumulado) — estabiliza após o sangramento da 3ª via na binarização Lula × Flávio. Segue SEGUNDO presidencial Poly, acima de Haddad (4.90%), Zema (2.40%), Caiado (1.90%). Real Time Big Data 01/Jun 1T Renan 6%; divergência mercado × pesquisa (~10pp) persiste como a mais larga do dashboard. 3L favorito a 3º lugar.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "Renan estabiliza no dia da correção de Flávio — a 3ª via segue esvaziada após o apoio de Tarcísio a Flávio (Imirante, ACidade ON 01-02/Jun), mas sem perda adicional hoje. RTBD 01/Jun dá 6% no 1T, ainda bem abaixo do mercado (a maior divergência do dashboard). STF impeach 5.50% estável. Mantido Estadão 'terceira via tem janela estreita'."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "4.90%",
    poll: "Haddad cede leve Poly 4.90% (↓0.2pp 24h, vol USD 5.38M acumulado) — ruído fino. Real Time Big Data 01/Jun não lista Haddad no presidencial nacional. Mantida Vox SP 30/Mai 2T estadual Tarcísio 48.3% × Haddad 36.5% (Poder360).",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Haddad cede 0.2pp (ruído fino). Como ministro da Fazenda, segue no centro do tarifaço EUA de 25% que mira o PIX: o governo Trump concluiu que o PIX é 'injusto' (g1), e o Brasil abre trilha de negociação (Mauro Vieira encontra Rubio em Paris). Disputa estadual SP desfavorável (Vox 30/Mai Tarcísio 48.3% × Haddad 36.5%). STF impeach 5.50% estável."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1.90%",
    poll: "Caiado estável baixo: Poly 1.90% (↓0.1pp 24h, vol USD 3.80M acumulado). 3ª via segue esvaziada após Tarcísio fechar atrás de Flávio. Real Time Big Data 01/Jun: 1T Caiado 6% (2T empata Lula 43×43) — aqui o poll vê MAIS que o mercado (inversão rara). Mantida Quaest 13/Mai Caiado 4% empate Zema.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "Caiado segue no piso (↓0.1pp) — a janela da centro-direita alternativa não reabre após o apoio de Tarcísio a Flávio (Imirante, ACidade ON 01-02/Jun). A aliança Caiado-Zema sem tração. STF impeach 5.50% estável. Mantido Estadão 'terceira via tem janela estreita'."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "2.40%",
    poll: "Zema presidencial Poly 2.40% (↓0.1pp 24h, vol USD 3.41M). 3ª via segue sem tração com Tarcísio binarizando Lula × Flávio. 3L vice-favorito a 3º atrás de Renan. Real Time Big Data 01/Jun: 1T Zema 4%; 2T Zema 40 × Lula 43. Mantida Quaest 13/Mai Zema 4% empate Caiado.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Zema estável no piso (↓0.1pp) — a 3ª via não reabre após o apoio de Tarcísio a Flávio (Imirante, ACidade ON 01-02/Jun). A aliança Caiado-Zema sem tração. STJ deu 15 dias para Zema se manifestar em caso de calúnia contra Gilmar Mendes. STF impeach 5.50% estável."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.15%",
    poll: "Tarcísio presidencial 0.15% Poly estável (vol USD ~12.3M acumulado, anomalia de legado). PL Senado recua a 74.00% (de 75.50%). Real Time Big Data 01/Jun não destaca Tarcísio nacional (foco reeleição SP). Mantida Vox SP 30/Mai 2T estadual Tarcísio 48.3% × Haddad 36.5% (Poder360).",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Tarcísio segue como o fiador do realinhamento de 02/Jun: o apoio a Flávio ('meu candidato é Flávio, ponto', Imirante, ACidade ON) consolidou a direita atrás de Flávio. No dia da correção (03/Jun), o efeito persiste como pano de fundo — 3ª via no piso, Flávio devolvendo só o excesso técnico. Foco na reeleição em SP, onde lidera. STF impeach 5.50% estável."
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
