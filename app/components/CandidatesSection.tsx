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
    poll: "Lula estável Poly 40.50% (flat 24h, vol USD 6.03M acumulado). Gap Lula × Flávio estreita pra +11.3pp porque Flávio sobe a 29.20%. Real Time Big Data 01/Jun (nacional, n=2.000, BR-05864/2026): 1T Lula 38% × Flávio 31% (gap +7pp); 2T Lula 45% × Flávio 40% (+5). Aprovação Lula 42% × desaprova 52%. Mercado segue mais largo que o poll no 1T. Mantidas Datafolha 22/Mai (1T 40×31, 2T 47×43) e Meio/Ideia 28/Mai (1T 38.5×31.5).",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTOS 01/Jun D+17: 1ª pesquisa nacional pós-caso Vorcaro/Dark Horse (Real Time Big Data) — Lula amplia vantagem no 2T contra Flávio (45×40), MAS Caiado EMPATA com Lula (43×43) e Zema fica perto (43×40), sinal de que a 3ª via é mais competitiva que Flávio contra Lula. Aprovação 42% × desaprovação 52%, economia 'piorou' para 40%. A decisão dos EUA de classificar PCC/CV como terroristas segue como arma eleitoral Lula × Flávio (Band). STF impeach 5.50% estável. Mantida rejeição Lula 45% próxima de Flávio 46% (Datafolha 22/Mai)."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "29.20%",
    poll: "Flávio SOBE Poly 29.20% (↑0.85pp 24h vs 28.35% véspera, vol USD 6.17M acumulado) — capitaliza decisão EUA/PCC apesar de pesquisa desfavorável. Gap Lula × Flávio estreita pra +11.3pp. 2L Flávio topo. 🔥 SENADO PL salta a 77.50% (↑9.5pp, leitura cautelosa de book). Real Time Big Data 01/Jun: 1T 31% (gap -7pp); 2T 40% × Lula 45 (-5); Caiado e Zema MAIS competitivos que Flávio contra Lula. Mantida Datafolha 22/Mai rejeição 46% > Lula 45%.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 01/Jun: Flávio sobe no Poly capitalizando a decisão dos EUA sobre PCC/CV (Band, 'Flávio capitaliza'), MAS a 1ª pesquisa nacional pós-Vorcaro (Real Time Big Data) o mostra MENOS competitivo que Caiado/Zema no 2T contra Lula. Operação contra ONG da produtora de 'Dark Horse'; Flávio fala em 'perseguição' e 'pescaria probatória' (G1). Sakamoto/UOL: 'Flávio fez gol importante e jogou batata quente pro Lula'. Mantida rejeição Flávio 46% > Lula 45% (Datafolha 22/Mai). STF impeach 5.50% estável."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "16.80%",
    poll: "Renan presidencial Poly 16.80% (flat 24h, vol USD 6.44M acumulado) — segue SEGUNDO presidencial Poly, acima de Haddad (6.10%), Zema (2.80%), Caiado (2.60%). Real Time Big Data 01/Jun 1T Renan 6% — acima do Meio/Ideia 28/Mai (2.1%) mas ainda ~11pp abaixo do mercado, divergência que persiste como a mais larga do dashboard. 2L Renan ~17%; 3L favorito a 3º lugar.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "Renan estável no Poly. RTBD 01/Jun dá 6% no 1T (melhor leitura recente de pesquisa), mas o mercado segue muito acima (~11pp). 🤝 a rearticulação da centro-direita (Caiado-Zema, com Aécio/PSDB no radar) divide o oxigênio da 3ª via. A decisão EUA/PCC pode reabsorver pauta anti-establishment se Flávio capitalizar. STF impeach 5.50% estável. Mantidos 22-23/Mai: Estadão 'terceira via tem janela estreita'; Joaquim Barbosa pré-candidato."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "6.10%",
    poll: "Haddad SOBE Poly 6.10% (↑0.80pp 24h vs 5.30% véspera, vol USD 5.32M acumulado) — ruído de mercado fino, sem evento presidencial nacional direto. 2L Haddad ~5%. Real Time Big Data 01/Jun não lista Haddad no presidencial nacional. Mantida Vox SP 30/Mai 2T estadual Tarcísio 48.3% × Haddad 36.5% (Poder360).",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Haddad sobe 0.80pp no Poly (ruído de mercado fino). Haddad defende a 'taxa das blusinhas' mesmo após recuo de Lula: 'não mudei de opinião' (G1). Mantido enquadramento da decisão EUA/PCC como autogol da direita (O Globo). Disputa estadual SP desfavorável (Vox 30/Mai Tarcísio 48.3% × Haddad 36.5%). STF impeach 5.50% estável."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "2.60%",
    poll: "Caiado SALTA Poly 2.60% (↑1.15pp 24h vs 1.45% véspera, vol USD 3.70M acumulado) — maior alta relativa do dia. Real Time Big Data 01/Jun: 1T Caiado 6% LIDERA a 3ª via; 2T Caiado EMPATA Lula 43×43 — mais competitivo que Flávio contra Lula (Portal N10, Jornal Opção). 3L Caiado favorito intermediário. Mantida Quaest 13/Mai Caiado 4% empate Zema.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "Caiado tem a MAIOR alta do dia no Poly, reprecificado após a Real Time Big Data mostrá-lo empatando Lula no 2T (43×43) — leitura de que a centro-direita pode ser mais viável que Flávio contra Lula. 🤝 ALIANÇA CAIADO-ZEMA ganha tração (continuidade da reunião 27/Mai) como alternativa a Flávio; Aécio/PSDB também se mexe. STF impeach 5.50% estável. Mantido Estadão 'terceira via tem janela estreita'."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "2.80%",
    poll: "Zema presidencial Poly 2.80% (↑0.05pp 24h, vol USD 3.28M). 2L Zema ~3%; 3L vice-favorito a 3º lugar atrás de Renan. Real Time Big Data 01/Jun: 1T Zema 4%; 2T Zema 40 × Lula 43 (-3) — mais competitivo que Flávio contra Lula. Mantida Quaest 13/Mai Zema 4% empate Caiado.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Zema estável. Real Time Big Data 01/Jun o coloca competitivo no 2T (43×40 Lula). 🤝 ALIANÇA CAIADO-ZEMA segue como alternativa de centro-direita a Flávio (continuidade da reunião 27/Mai). STJ dá 15 dias para Zema se manifestar em caso de calúnia contra Gilmar Mendes. Mantida competição interna no Novo (Eduardo Leite, VEJA). STF impeach 5.50% estável."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.15%",
    poll: "Tarcísio presidencial 0.15% Poly estável (vol USD ~12.3M acumulado, maior volume do mercado mas precificação baixíssima, anomalia de legado). 🔥 PL Senado SALTA a 77.50% (↑9.5pp, leitura cautelosa de book), dominante na disputa por mais cadeiras. Real Time Big Data 01/Jun não destaca Tarcísio nacional (foco reeleição SP). Mantida Vox SP 30/Mai 2T estadual Tarcísio 48.3% × Haddad 36.5% (Poder360).",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Tarcísio presidencial estável (anomalia de volume alto e preço baixíssimo, convicção concentrada para-e-contra). Foco na reeleição em SP, onde lidera. Mantido Haddad tentando enquadrar a decisão dos EUA sobre PCC/CV como problema para Tarcísio (O Globo). STF impeach 5.50% estável. Mantidos 22-23/Mai: PL e Centrão temem queda maior de Flávio (O Globo)."
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
