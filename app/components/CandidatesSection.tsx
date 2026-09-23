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
    polymarket: "40,50%",
    poll: "A ATLASINTEL EM PARCERIA COM A BLOOMBERG, divulgada em 23/Set (n=5.015 pela internet, campo de 17 a 22/Set, margem de 1,0pp, BR-04739/2026), dá Lula à frente no 1º turno por 45,8% a 43,4%. Os dois subiram 1,7pp contra a rodada da casa de 17/Set e a distância entre eles NÃO se moveu, segue em 2,4 pontos: quem cedeu foi a terceira via inteira, com Augusto Cury de 3,5% para 2,1%, Renan Santos de 5,1% para 4,5%, Ronaldo Caiado de 1,7% para 1,3%, Romeu Zema de 1,1% para 0,9% e o branco e nulo de 1,6% para 0,7%. No par principal de 2º turno o sinal se inverteu dentro da própria casa: Lula tem 47,7% contra 47,4%, depois de 46,8% a 47,2% em 17/Set, e a casa declara empate técnico pela terceira semana seguida. Lula vence ou empata os CINCO pares testados, com 47,6% contra Romeu Zema, 46,6% contra Ronaldo Caiado, 46,2% contra Augusto Cury e 46,5% contra Renan Santos.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "SEM PREÇO NOVO NO CONTRATO DE VENCEDOR, em 40,50% (vol USD 11,96M acumulado), leitura confirmada de 23/Set, 11:54 BRT, contra a leitura confirmada de 22/Set às 14:40 BRT. ⚖️ E ainda assim ele GANHA 0,29pp de probabilidade implícita, porque a soma do par desinchou de 100,05 para 99,35, e o vão contra Flávio Bolsonaro fecha de 19,05pp para 18,35pp. ⚠️ Não é extremo: o preço dele está a 27,00pp do topo da série, 67,50% de 16 de agosto, e a 6,00pp do piso, 34,50% de 25 de abril. No contrato de 2º lugar do 1º turno ele cai 3,95pp no cru e 3,46pp no normalizado, para 25,85% (vol USD 0,90M acumulado), a maior queda da rodada.",
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "58,85%",
    poll: "A ATLASINTEL EM PARCERIA COM A BLOOMBERG, divulgada em 23/Set (n=5.015 pela internet, campo de 17 a 22/Set, margem de 1,0pp, BR-04739/2026), dá Lula à frente no 1º turno por 45,8% a 43,4%. Os dois subiram 1,7pp contra a rodada da casa de 17/Set e a distância entre eles NÃO se moveu, segue em 2,4 pontos: quem cedeu foi a terceira via inteira, com Augusto Cury de 3,5% para 2,1%, Renan Santos de 5,1% para 4,5%, Ronaldo Caiado de 1,7% para 1,3%, Romeu Zema de 1,1% para 0,9% e o branco e nulo de 1,6% para 0,7%. No par principal de 2º turno o sinal se inverteu dentro da própria casa: Lula tem 47,7% contra 47,4%, depois de 46,8% a 47,2% em 17/Set, e a casa declara empate técnico pela terceira semana seguida. Lula vence ou empata os CINCO pares testados, com 47,6% contra Romeu Zema, 46,6% contra Ronaldo Caiado, 46,2% contra Augusto Cury e 46,5% contra Renan Santos.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "CEDE 0,70pp NO CONTRATO DE VENCEDOR, para 58,85% (vol USD 11,58M acumulado), leitura confirmada de 23/Set, 11:54 BRT, e 0,29pp no normalizado pela soma do par. O vão sobre Lula fecha pelo segundo dia seguido, de 22,40pp em 21/Set para 19,05pp em 22/Set e 18,35pp agora. O preço dele está a 2,85pp do topo da série, 61,70% gravado em 21/Set. ⭐ No contrato de 2º lugar do 1º turno ele foi na direção oposta e SOBE 2,00pp no cru e 3,46pp no normalizado, para 71,50% (vol USD 1,08M acumulado).",
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "0,75%",
    poll: "A ATLASINTEL EM PARCERIA COM A BLOOMBERG, divulgada em 23/Set (n=5.015 pela internet, campo de 17 a 22/Set, margem de 1,0pp, BR-04739/2026), dá Lula à frente no 1º turno por 45,8% a 43,4%. Os dois subiram 1,7pp contra a rodada da casa de 17/Set e a distância entre eles NÃO se moveu, segue em 2,4 pontos: quem cedeu foi a terceira via inteira, com Augusto Cury de 3,5% para 2,1%, Renan Santos de 5,1% para 4,5%, Ronaldo Caiado de 1,7% para 1,3%, Romeu Zema de 1,1% para 0,9% e o branco e nulo de 1,6% para 0,7%. No par principal de 2º turno o sinal se inverteu dentro da própria casa: Lula tem 47,7% contra 47,4%, depois de 46,8% a 47,2% em 17/Set, e a casa declara empate técnico pela terceira semana seguida. Lula vence ou empata os CINCO pares testados, com 47,6% contra Romeu Zema, 46,6% contra Ronaldo Caiado, 46,2% contra Augusto Cury e 46,5% contra Renan Santos.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "MAIOR ALTA DA RODADA NO CONTRATO DE 3º LUGAR DO 1º TURNO, 1,50pp, PARA 44,00% (vol USD 0,40M acumulado), leitura confirmada de 23/Set, 11:54 BRT, e a dianteira dele sobre Augusto Cury volta a abrir, de 3,05pp para 4,15pp. 🏆 O contrato dele no livro de vencedor passou a ser o de MAIOR volume acumulado do presidencial, USD 14,17M contra USD 14,09M do de Tarcísio de Freitas. Ele paga 0,75%, a 0,05pp do piso da série, 0,70% de 21/Set.",
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0,05%",
    poll: "A ATLASINTEL EM PARCERIA COM A BLOOMBERG, divulgada em 23/Set (n=5.015 pela internet, campo de 17 a 22/Set, margem de 1,0pp, BR-04739/2026), dá Lula à frente no 1º turno por 45,8% a 43,4%. Os dois subiram 1,7pp contra a rodada da casa de 17/Set e a distância entre eles NÃO se moveu, segue em 2,4 pontos: quem cedeu foi a terceira via inteira, com Augusto Cury de 3,5% para 2,1%, Renan Santos de 5,1% para 4,5%, Ronaldo Caiado de 1,7% para 1,3%, Romeu Zema de 1,1% para 0,9% e o branco e nulo de 1,6% para 0,7%. No par principal de 2º turno o sinal se inverteu dentro da própria casa: Lula tem 47,7% contra 47,4%, depois de 46,8% a 47,2% em 17/Set, e a casa declara empate técnico pela terceira semana seguida. Lula vence ou empata os CINCO pares testados, com 47,6% contra Romeu Zema, 46,6% contra Ronaldo Caiado, 46,2% contra Augusto Cury e 46,5% contra Renan Santos.",
    position: "Centro-esquerda. Ministro da Fazenda até a desincompatibilização. Foco no maior colégio eleitoral do país.",
    risk: "Parado no piso do livro, 0,05%, leitura confirmada de 23/Set, 11:54 BRT, com USD 7,55M acumulados. Não é candidato à Presidência: disputa o governo de São Paulo, e por isso não aparece nos cenários da AtlasIntel.",
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "0,05%",
    poll: "A ATLASINTEL EM PARCERIA COM A BLOOMBERG, divulgada em 23/Set (n=5.015 pela internet, campo de 17 a 22/Set, margem de 1,0pp, BR-04739/2026), dá Lula à frente no 1º turno por 45,8% a 43,4%. Os dois subiram 1,7pp contra a rodada da casa de 17/Set e a distância entre eles NÃO se moveu, segue em 2,4 pontos: quem cedeu foi a terceira via inteira, com Augusto Cury de 3,5% para 2,1%, Renan Santos de 5,1% para 4,5%, Ronaldo Caiado de 1,7% para 1,3%, Romeu Zema de 1,1% para 0,9% e o branco e nulo de 1,6% para 0,7%. No par principal de 2º turno o sinal se inverteu dentro da própria casa: Lula tem 47,7% contra 47,4%, depois de 46,8% a 47,2% em 17/Set, e a casa declara empate técnico pela terceira semana seguida. Lula vence ou empata os CINCO pares testados, com 47,6% contra Romeu Zema, 46,6% contra Ronaldo Caiado, 46,2% contra Augusto Cury e 46,5% contra Renan Santos.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Candidato oficializado pelo PSD.",
    risk: "CEDE 1,00pp NO CONTRATO DE 3º LUGAR DO 1º TURNO, para 14,50% (vol USD 0,16M acumulado), leitura confirmada de 23/Set, 11:54 BRT, e mantém a terceira posição daquele livro. ⭐ No mesmo dia ele é o adversário mais próximo de Lula depois de Flávio Bolsonaro no par de 2º turno da AtlasIntel, 44,0% a 46,6%, e subiu 2,3pp ali contra a rodada anterior da casa. No contrato de vencedor segue em 0,05%.",
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0,05%",
    poll: "A ATLASINTEL EM PARCERIA COM A BLOOMBERG, divulgada em 23/Set (n=5.015 pela internet, campo de 17 a 22/Set, margem de 1,0pp, BR-04739/2026), dá Lula à frente no 1º turno por 45,8% a 43,4%. Os dois subiram 1,7pp contra a rodada da casa de 17/Set e a distância entre eles NÃO se moveu, segue em 2,4 pontos: quem cedeu foi a terceira via inteira, com Augusto Cury de 3,5% para 2,1%, Renan Santos de 5,1% para 4,5%, Ronaldo Caiado de 1,7% para 1,3%, Romeu Zema de 1,1% para 0,9% e o branco e nulo de 1,6% para 0,7%. No par principal de 2º turno o sinal se inverteu dentro da própria casa: Lula tem 47,7% contra 47,4%, depois de 46,8% a 47,2% em 17/Set, e a casa declara empate técnico pela terceira semana seguida. Lula vence ou empata os CINCO pares testados, com 47,6% contra Romeu Zema, 46,6% contra Ronaldo Caiado, 46,2% contra Augusto Cury e 46,5% contra Renan Santos.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Sem preço novo no contrato de 3º lugar do 1º turno, em 0,30% (vol USD 0,08M acumulado), leitura confirmada de 23/Set, 11:54 BRT, no piso daquele livro. No de vencedor está em 0,05%, com USD 7,69M acumulados.",
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0,05%",
    poll: "A ATLASINTEL EM PARCERIA COM A BLOOMBERG, divulgada em 23/Set (n=5.015 pela internet, campo de 17 a 22/Set, margem de 1,0pp, BR-04739/2026), dá Lula à frente no 1º turno por 45,8% a 43,4%. Os dois subiram 1,7pp contra a rodada da casa de 17/Set e a distância entre eles NÃO se moveu, segue em 2,4 pontos: quem cedeu foi a terceira via inteira, com Augusto Cury de 3,5% para 2,1%, Renan Santos de 5,1% para 4,5%, Ronaldo Caiado de 1,7% para 1,3%, Romeu Zema de 1,1% para 0,9% e o branco e nulo de 1,6% para 0,7%. No par principal de 2º turno o sinal se inverteu dentro da própria casa: Lula tem 47,7% contra 47,4%, depois de 46,8% a 47,2% em 17/Set, e a casa declara empate técnico pela terceira semana seguida. Lula vence ou empata os CINCO pares testados, com 47,6% contra Romeu Zema, 46,6% contra Ronaldo Caiado, 46,2% contra Augusto Cury e 46,5% contra Renan Santos.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Parado no piso do livro, 0,05%, leitura confirmada de 23/Set, 11:54 BRT, e o contrato dele DEIXOU de ser o de maior volume acumulado do livro presidencial: são USD 14,09M contra USD 14,17M do de Renan Santos.",
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
