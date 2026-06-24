'use client';

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
    polymarket: "57.50%",
    poll: "Lula salta a novo pico: Poly 57.50% (↑4.00pp, vol USD 6.9M acumulado), com o gap sobre Flávio em +34.60pp, RECORDE do ciclo (vinha de +27.95pp). O mercado estendeu a favor de Lula e ignorou a pesquisa Gerp de hoje, que deu empate técnico (1T Lula 37% × Flávio 34%; 2T Flávio 42% × Lula 40%; aprovação 44%, rejeição 47%, CNN Brasil/Poder360). O mercado precifica o consenso Tier 1 recente (Indexa 23/Jun 42% × 31%, 2T 47% × 40%; Datafolha 20/Jun 41% × 31%, 2T 47% × 43%; CNT/MDA; BTG/Nexus), todas com Lula confortável, e trata a Gerp como outlier.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTOS 24/Jun D+41: a maior divergência do ciclo. O Polymarket abriu RECORDE a favor de Lula (57.50%, ↑4.00pp; gap +34.60pp) no MESMO dia em que a pesquisa nacional Gerp deu empate técnico (1T 37% × 34%; 2T Flávio 42% × Lula 40%). O mercado leu a Gerp como outlier e precificou o consenso Tier 1 (Lula confortável). No campo político, Lula intensifica agendas no Rio aproveitando o palanque frágil de Flávio (Folha, G1) e criticou Neymar, episódio que Flávio explorou com um vídeo de IA. Aprovação a 44% (Gerp) com rejeição alta (47%). STF impeach a 2.55% (↓1.75pp). Volume no presidencial acima de USD 105M."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "22.90%",
    poll: "Flávio recua a novo piso: Poly 22.90% (↓2.65pp, vol USD 7.0M acumulado) e o gap para Lula abre a +34.60pp, recorde do ciclo. A divergência do dia: no mesmo pregão, a pesquisa Gerp lhe deu empate técnico nacional, à frente no 2º turno (42% × 40%) e a 3pp no 1º (34% × 37%, CNN Brasil/Poder360/Jovem Pan), mas o mercado foi na direção contrária e o levou ao piso, lendo a Gerp como outlier frente ao consenso Tier 1. Reagiu no simbólico (vídeo de IA resgatando Neymar após crítica de Lula, G1/VEJA) e no externo (planeja encontro com Milei e vai aos EUA contra o tarifaço, compara Lula a Biden, Folha/Poder360). Mantém o 2º lugar do 1º turno (75.5%).",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 24/Jun: o paradoxo no extremo. A Gerp deu a Flávio o melhor retrato nacional do recorte (empate técnico, 2T 42% × 40%), MAS o mercado o levou ao piso (22.90%, ↓2.65pp) e abriu o gap para Lula a +34.60pp, recorde. O mercado lê a Gerp como outlier e segue o consenso Tier 1 (Lula confortável). Flávio reagiu no simbólico (vídeo IA do Neymar) e no externo (Milei, EUA, tarifaço), mas levou ataque de dentro da direita: Renan Santos disse que o 'bolsonarismo morreu' e que Flávio é 'inviável' contra Lula (Estadão, O Globo). A imprensa nota que ele apoiou o tarifaço e agora diz que vai 'defender empresas' (VEJA). STF impeach a 2.55% (↓1.75pp)."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "12.35%",
    poll: "Renan presidencial Poly 12.35% (↓1.00pp, vol USD 7.4M acumulado) no mercado de vencedor, e segue cravado como favorito ao 3º lugar do 1º turno (58.5% no sub-mercado), com o maior volume acumulado do presidencial. As nacionais o mantêm na faixa de 3% no 1º turno, mantendo a divergência mais larga do dashboard (~9.35pp). No dia, virou protagonista ao atacar Flávio: disse que o 'bolsonarismo morreu' e que Flávio é 'inviável' contra Lula, esperando herdar o voto antipetista (Estadão, O Globo, Imirante).",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "24/Jun: Renan recuou no vencedor (12.35%, ↓1.00pp) e seguiu cravado como favorito ao 3º lugar do 1º turno (58.5% no sub-mercado), com o maior volume do presidencial. As pesquisas o medem a ~3% no 1T, mantendo a divergência mais larga do dashboard (~9.35pp). O dia foi de protagonismo retórico: atacou Flávio ('bolsonarismo morreu', Flávio 'inviável'), apostando na migração do voto antipetista (Estadão, O Globo). A leitura segue a mesma: provável 3º colocado, sem chance real de vencer (capital de nicho). O movimento contra Flávio mostra que a 3ª via disputa o espólio do campo, não a liderança. STF impeach 2.55%."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "1.45%",
    poll: "Haddad recua de leve a Poly 1.45% (↓0.10pp, vol USD 5.9M acumulado), na faixa de Camilo Santana (1.35%) como nome do PT depois de Lula no mercado presidencial. As nacionais não testam Haddad no presidencial nacional (foco SP). No dia, ganhou holofote no debate sobre a sucessão de Lula no PT, defendendo consultar a militância via prévia: 'seria o máximo uma prévia' (BBC). A aprovação do governo segue no patamar de 44-48% (Gerp 44%, BTG/Nexus 48% × 47%).",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Haddad recuou de leve a 1.45% (↓0.10pp), na faixa de Camilo Santana (1.35%), como nome do PT depois de Lula. Como ministro da Fazenda, no centro do PIX/tarifaço, mas o mercado não precifica candidatura presidencial dele. No dia, entrou no debate da sucessão de Lula no PT defendendo prévia com a militância (BBC). A operação da PF sobre Jaques Wagner segue como ruído no Congresso e devolve o tema corrupção às redes (Estadão). STF impeach 2.55%."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1.45%",
    poll: "Caiado recua a Poly 1.45% (↓0.20pp, vol USD 4.4M acumulado), no piso da 3ª via, na sessão de recorde para Lula. A Datafolha 20/Jun deu Caiado 3% no 1T (empatado com Renan) e 2T Lula 47% × Caiado 41% (gap -6pp, competitivo). A CNT/MDA deu 4% no 1T; e a Futura/Apex, num cenário SEM Flávio, dá Caiado 16.5% (lidera a 3ª via). É o nome posicionado para herdar o voto da direita se Flávio não for.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "Caiado recuou a 1.45% (↓0.20pp, vol USD 4.4M), no piso das apostas: o mercado precifica baixa a hipótese de Flávio sair da disputa. As nacionais o mantêm a 3% no 1T. No cenário sem Flávio, a Futura/Apex dá Caiado 16.5%, sinal de quanto voto da direita está represado em Flávio. No cenário com Flávio, o 'paradoxo da direita' (G1) explica o teto, e o ataque de Renan a Flávio mostra a briga pelo mesmo espaço. STF impeach 2.55%."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "1.15%",
    poll: "Zema recua a Poly 0.95% (↓0.20pp, vol USD 3.9M), abaixo de 1%, no piso da 3ª via. A Datafolha 20/Jun deu Zema 2% no 1T e 2T Lula 48% × Zema 39% (gap -9pp, o mais largo da 3ª via testada). Sem Flávio, a Futura/Apex dá Zema 13.3% (2º da 3ª via, atrás de Caiado). O Novo se equilibra entre a candidatura de Zema e alianças com o PL nos estados, atrito que dificulta a convergência da oposição.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Zema recuou a 0.95% (↓0.20pp, vol USD 3.9M), abaixo de 1%, e a 3ª via segue sem tração na disputa bipolarizada Lula × Flávio. A Datafolha 20/Jun o mediu a 2% no 1T e deu 2T Lula 48% × Zema 39%. No cenário sem Flávio, a Futura/Apex dá Zema 13.3%, fôlego latente, mas na disputa com Flávio o Novo não encontra tração. O partido se equilibra entre a candidatura dele e alianças com o PL nos estados. STF impeach 2.55%."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.15%",
    poll: "Tarcísio presidencial 0.15% Poly estável (vol USD ~13M acumulado, o maior do mercado, anomalia de legado). As nacionais não destacam Tarcísio no presidencial nacional (foco reeleição SP). No dia, Flávio acenou ao agro em agenda com Tarcísio (Folha). Mantida Vox SP 30/Mai 2T estadual Tarcísio 48.3% × Haddad 36.5% (Poder360).",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Tarcísio segue focado na reeleição em SP, onde lidera, e o mercado mantém o presidencial em 0.15% (anomalia de legado, volume herdado de apostas antigas, o maior do book a USD 13M). No dia, Flávio fez agenda com ele acenando ao agro (Folha). No mercado de Senado por número de cadeiras, o PL segue na liderança (76.5%), sinal de capilaridade institucional da legenda. STF impeach 2.55%."
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
