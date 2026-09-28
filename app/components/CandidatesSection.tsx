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
    polymarket: "41,50%",
    poll: "DUAS PESQUISAS NACIONAIS FORAM DIVULGADAS EM 28/Set, E AS DUAS MEDEM LULA EM POSIÇÃO MELHOR QUE NA RODADA DE 21/Set DA MESMA CASA. Quaest (n=2.004, presencial, campo de 24 a 27/Set, margem de 2,0pp, BR-06520/2026): no 1º turno Lula 39%, Flávio Bolsonaro 34%, Ronaldo Caiado e Augusto Cury 4% cada, Renan Santos 3% e Romeu Zema 1%; no 2º turno os dois empatam em 42%, depois de Flávio Bolsonaro estar à frente por 42% a 41% em 21/Set. BTG/Nexus (n=2.000, telefone, campo de 25 a 27/Set, margem de 2,0pp, BR-07557/2026): no 1º turno Lula 42%, Flávio Bolsonaro 37%, Augusto Cury e Ronaldo Caiado 5% cada, Renan Santos 4% e Romeu Zema 1%; no 2º turno Lula lidera os cinco pares testados, 46% a 44% contra Flávio Bolsonaro, 46% a 42% contra Ronaldo Caiado, 46% a 41% contra Augusto Cury, 48% a 39% contra Romeu Zema e 48% a 37% contra Renan Santos. Todas as oscilações contra 21/Set estão dentro da margem. A Quaest mediu também a transferência de voto no 2º turno, e ela vai mais para Flávio Bolsonaro do que para Lula: 81% dos eleitores de Romeu Zema, 48% dos de Renan Santos, 42% dos de Ronaldo Caiado e 34% dos de Augusto Cury. As seis nacionais de 24/Set, da semana anterior, davam Lula à frente no 1º turno em quatro e Flávio Bolsonaro à frente no 2º turno em quatro.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "CAI 1,00pp NO CONTRATO DE VENCEDOR, para 41,50% (vol USD 12,52M acumulado), leitura confirmada de 28/Set, 13:49 BRT, e 0,92pp no normalizado. O vão contra Flávio Bolsonaro abre de 14,75pp para 16,55pp, a terceira abertura seguida entre leituras confirmadas, no mesmo dia em que as duas nacionais divulgadas antes desta leitura o medem melhor que na semana anterior. ⚠️ Não é extremo: o preço dele está a 26,00pp do topo da série, 67,50% de 16 de agosto, e a 7,00pp do piso, 34,50% de 25 de abril. No contrato de 2º lugar do 1º turno cai 0,90pp, para 24,55% (vol USD 1,07M acumulado).",
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "58,05%",
    poll: "DUAS PESQUISAS NACIONAIS FORAM DIVULGADAS EM 28/Set, E AS DUAS MEDEM LULA EM POSIÇÃO MELHOR QUE NA RODADA DE 21/Set DA MESMA CASA. Quaest (n=2.004, presencial, campo de 24 a 27/Set, margem de 2,0pp, BR-06520/2026): no 1º turno Lula 39%, Flávio Bolsonaro 34%, Ronaldo Caiado e Augusto Cury 4% cada, Renan Santos 3% e Romeu Zema 1%; no 2º turno os dois empatam em 42%, depois de Flávio Bolsonaro estar à frente por 42% a 41% em 21/Set. BTG/Nexus (n=2.000, telefone, campo de 25 a 27/Set, margem de 2,0pp, BR-07557/2026): no 1º turno Lula 42%, Flávio Bolsonaro 37%, Augusto Cury e Ronaldo Caiado 5% cada, Renan Santos 4% e Romeu Zema 1%; no 2º turno Lula lidera os cinco pares testados, 46% a 44% contra Flávio Bolsonaro, 46% a 42% contra Ronaldo Caiado, 46% a 41% contra Augusto Cury, 48% a 39% contra Romeu Zema e 48% a 37% contra Renan Santos. Todas as oscilações contra 21/Set estão dentro da margem. A Quaest mediu também a transferência de voto no 2º turno, e ela vai mais para Flávio Bolsonaro do que para Lula: 81% dos eleitores de Romeu Zema, 48% dos de Renan Santos, 42% dos de Ronaldo Caiado e 34% dos de Augusto Cury. As seis nacionais de 24/Set, da semana anterior, davam Lula à frente no 1º turno em quatro e Flávio Bolsonaro à frente no 2º turno em quatro.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "SOBE 0,80pp NO CONTRATO DE VENCEDOR, para 58,05% (vol USD 12,14M acumulado), leitura confirmada de 28/Set, 13:49 BRT, e 0,92pp no normalizado. O vão sobre Lula abre de 14,75pp para 16,55pp. O preço dele está a 3,65pp do topo da série, 61,70% gravado em 21/Set, e a 36,05pp do piso, 22,00% de 3 de julho. No contrato de 2º lugar do 1º turno segue em 74,50% (vol USD 1,25M acumulado). 📺 Confirmou em 27/Set que vai ao debate da TV Globo de 01/Out mesmo sem Lula.",
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "0,35%",
    poll: "DUAS PESQUISAS NACIONAIS FORAM DIVULGADAS EM 28/Set, E AS DUAS MEDEM LULA EM POSIÇÃO MELHOR QUE NA RODADA DE 21/Set DA MESMA CASA. Quaest (n=2.004, presencial, campo de 24 a 27/Set, margem de 2,0pp, BR-06520/2026): no 1º turno Lula 39%, Flávio Bolsonaro 34%, Ronaldo Caiado e Augusto Cury 4% cada, Renan Santos 3% e Romeu Zema 1%; no 2º turno os dois empatam em 42%, depois de Flávio Bolsonaro estar à frente por 42% a 41% em 21/Set. BTG/Nexus (n=2.000, telefone, campo de 25 a 27/Set, margem de 2,0pp, BR-07557/2026): no 1º turno Lula 42%, Flávio Bolsonaro 37%, Augusto Cury e Ronaldo Caiado 5% cada, Renan Santos 4% e Romeu Zema 1%; no 2º turno Lula lidera os cinco pares testados, 46% a 44% contra Flávio Bolsonaro, 46% a 42% contra Ronaldo Caiado, 46% a 41% contra Augusto Cury, 48% a 39% contra Romeu Zema e 48% a 37% contra Renan Santos. Todas as oscilações contra 21/Set estão dentro da margem. A Quaest mediu também a transferência de voto no 2º turno, e ela vai mais para Flávio Bolsonaro do que para Lula: 81% dos eleitores de Romeu Zema, 48% dos de Renan Santos, 42% dos de Ronaldo Caiado e 34% dos de Augusto Cury. As seis nacionais de 24/Set, da semana anterior, davam Lula à frente no 1º turno em quatro e Flávio Bolsonaro à frente no 2º turno em quatro.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "SOBE 1,50pp NO CRU NO CONTRATO DE 3º LUGAR DO 1º TURNO, para 43,00% (vol USD 0,45M acumulado), leitura confirmada de 28/Set, 13:49 BRT, e 0,98pp no normalizado, e a distância para Augusto Cury, que segue à frente, fecha de 2,90pp para 2,10pp. No de vencedor cai para 0,35%. 🏆 O contrato dele no livro de vencedor segue sendo o de MAIOR volume acumulado do presidencial, USD 14,61M contra USD 14,10M do de Tarcísio de Freitas. 📺 Ficou fora do debate da TV Globo de 01/Out pelo critério legal de bancada.",
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0,05%",
    poll: "DUAS PESQUISAS NACIONAIS FORAM DIVULGADAS EM 28/Set, E AS DUAS MEDEM LULA EM POSIÇÃO MELHOR QUE NA RODADA DE 21/Set DA MESMA CASA. Quaest (n=2.004, presencial, campo de 24 a 27/Set, margem de 2,0pp, BR-06520/2026): no 1º turno Lula 39%, Flávio Bolsonaro 34%, Ronaldo Caiado e Augusto Cury 4% cada, Renan Santos 3% e Romeu Zema 1%; no 2º turno os dois empatam em 42%, depois de Flávio Bolsonaro estar à frente por 42% a 41% em 21/Set. BTG/Nexus (n=2.000, telefone, campo de 25 a 27/Set, margem de 2,0pp, BR-07557/2026): no 1º turno Lula 42%, Flávio Bolsonaro 37%, Augusto Cury e Ronaldo Caiado 5% cada, Renan Santos 4% e Romeu Zema 1%; no 2º turno Lula lidera os cinco pares testados, 46% a 44% contra Flávio Bolsonaro, 46% a 42% contra Ronaldo Caiado, 46% a 41% contra Augusto Cury, 48% a 39% contra Romeu Zema e 48% a 37% contra Renan Santos. Todas as oscilações contra 21/Set estão dentro da margem. A Quaest mediu também a transferência de voto no 2º turno, e ela vai mais para Flávio Bolsonaro do que para Lula: 81% dos eleitores de Romeu Zema, 48% dos de Renan Santos, 42% dos de Ronaldo Caiado e 34% dos de Augusto Cury. As seis nacionais de 24/Set, da semana anterior, davam Lula à frente no 1º turno em quatro e Flávio Bolsonaro à frente no 2º turno em quatro.",
    position: "Centro-esquerda. Ministro da Fazenda até a desincompatibilização. Foco no maior colégio eleitoral do país.",
    risk: "Parado no piso do livro, 0,05%, leitura confirmada de 28/Set, 13:49 BRT, com USD 7,55M acumulados. Não é candidato à Presidência: disputa o governo de São Paulo, e por isso não aparece nos cenários presidenciais das nacionais de 28/Set.",
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "0,05%",
    poll: "DUAS PESQUISAS NACIONAIS FORAM DIVULGADAS EM 28/Set, E AS DUAS MEDEM LULA EM POSIÇÃO MELHOR QUE NA RODADA DE 21/Set DA MESMA CASA. Quaest (n=2.004, presencial, campo de 24 a 27/Set, margem de 2,0pp, BR-06520/2026): no 1º turno Lula 39%, Flávio Bolsonaro 34%, Ronaldo Caiado e Augusto Cury 4% cada, Renan Santos 3% e Romeu Zema 1%; no 2º turno os dois empatam em 42%, depois de Flávio Bolsonaro estar à frente por 42% a 41% em 21/Set. BTG/Nexus (n=2.000, telefone, campo de 25 a 27/Set, margem de 2,0pp, BR-07557/2026): no 1º turno Lula 42%, Flávio Bolsonaro 37%, Augusto Cury e Ronaldo Caiado 5% cada, Renan Santos 4% e Romeu Zema 1%; no 2º turno Lula lidera os cinco pares testados, 46% a 44% contra Flávio Bolsonaro, 46% a 42% contra Ronaldo Caiado, 46% a 41% contra Augusto Cury, 48% a 39% contra Romeu Zema e 48% a 37% contra Renan Santos. Todas as oscilações contra 21/Set estão dentro da margem. A Quaest mediu também a transferência de voto no 2º turno, e ela vai mais para Flávio Bolsonaro do que para Lula: 81% dos eleitores de Romeu Zema, 48% dos de Renan Santos, 42% dos de Ronaldo Caiado e 34% dos de Augusto Cury. As seis nacionais de 24/Set, da semana anterior, davam Lula à frente no 1º turno em quatro e Flávio Bolsonaro à frente no 2º turno em quatro.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Candidato oficializado pelo PSD.",
    risk: "CAI 1,00pp NO CRU NO CONTRATO DE 3º LUGAR DO 1º TURNO, para 13,50% (vol USD 0,18M acumulado), leitura confirmada de 28/Set, 13:49 BRT, e 1,14pp no normalizado. Mantém a terceira posição daquele livro. 🗳️ Nas duas nacionais de 28/Set empata em terceiro com Augusto Cury, 4% na Quaest e 5% na BTG/Nexus, e perde para Lula por 46% a 42% no par de 2º turno da BTG/Nexus. No contrato de vencedor segue em 0,05%, com USD 7,79M acumulados.",
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0,05%",
    poll: "DUAS PESQUISAS NACIONAIS FORAM DIVULGADAS EM 28/Set, E AS DUAS MEDEM LULA EM POSIÇÃO MELHOR QUE NA RODADA DE 21/Set DA MESMA CASA. Quaest (n=2.004, presencial, campo de 24 a 27/Set, margem de 2,0pp, BR-06520/2026): no 1º turno Lula 39%, Flávio Bolsonaro 34%, Ronaldo Caiado e Augusto Cury 4% cada, Renan Santos 3% e Romeu Zema 1%; no 2º turno os dois empatam em 42%, depois de Flávio Bolsonaro estar à frente por 42% a 41% em 21/Set. BTG/Nexus (n=2.000, telefone, campo de 25 a 27/Set, margem de 2,0pp, BR-07557/2026): no 1º turno Lula 42%, Flávio Bolsonaro 37%, Augusto Cury e Ronaldo Caiado 5% cada, Renan Santos 4% e Romeu Zema 1%; no 2º turno Lula lidera os cinco pares testados, 46% a 44% contra Flávio Bolsonaro, 46% a 42% contra Ronaldo Caiado, 46% a 41% contra Augusto Cury, 48% a 39% contra Romeu Zema e 48% a 37% contra Renan Santos. Todas as oscilações contra 21/Set estão dentro da margem. A Quaest mediu também a transferência de voto no 2º turno, e ela vai mais para Flávio Bolsonaro do que para Lula: 81% dos eleitores de Romeu Zema, 48% dos de Renan Santos, 42% dos de Ronaldo Caiado e 34% dos de Augusto Cury. As seis nacionais de 24/Set, da semana anterior, davam Lula à frente no 1º turno em quatro e Flávio Bolsonaro à frente no 2º turno em quatro.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "SEGUE EM 0,65% NO CONTRATO DE 3º LUGAR DO 1º TURNO (vol USD 0,09M acumulado), leitura confirmada de 28/Set, 13:49 BRT, parado. 🗳️ Tem 1% nas duas nacionais de 28/Set, e na Quaest 81% dos eleitores dele iriam para Flávio Bolsonaro no 2º turno. No de vencedor está em 0,05%, com USD 7,71M acumulados.",
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0,05%",
    poll: "DUAS PESQUISAS NACIONAIS FORAM DIVULGADAS EM 28/Set, E AS DUAS MEDEM LULA EM POSIÇÃO MELHOR QUE NA RODADA DE 21/Set DA MESMA CASA. Quaest (n=2.004, presencial, campo de 24 a 27/Set, margem de 2,0pp, BR-06520/2026): no 1º turno Lula 39%, Flávio Bolsonaro 34%, Ronaldo Caiado e Augusto Cury 4% cada, Renan Santos 3% e Romeu Zema 1%; no 2º turno os dois empatam em 42%, depois de Flávio Bolsonaro estar à frente por 42% a 41% em 21/Set. BTG/Nexus (n=2.000, telefone, campo de 25 a 27/Set, margem de 2,0pp, BR-07557/2026): no 1º turno Lula 42%, Flávio Bolsonaro 37%, Augusto Cury e Ronaldo Caiado 5% cada, Renan Santos 4% e Romeu Zema 1%; no 2º turno Lula lidera os cinco pares testados, 46% a 44% contra Flávio Bolsonaro, 46% a 42% contra Ronaldo Caiado, 46% a 41% contra Augusto Cury, 48% a 39% contra Romeu Zema e 48% a 37% contra Renan Santos. Todas as oscilações contra 21/Set estão dentro da margem. A Quaest mediu também a transferência de voto no 2º turno, e ela vai mais para Flávio Bolsonaro do que para Lula: 81% dos eleitores de Romeu Zema, 48% dos de Renan Santos, 42% dos de Ronaldo Caiado e 34% dos de Augusto Cury. As seis nacionais de 24/Set, da semana anterior, davam Lula à frente no 1º turno em quatro e Flávio Bolsonaro à frente no 2º turno em quatro.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Parado no piso do livro, 0,05%, leitura confirmada de 28/Set, 13:49 BRT, com USD 14,10M acumulados, e o contrato dele segue atrás do de Renan Santos em volume acumulado no livro presidencial, que tem USD 14,61M.",
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
