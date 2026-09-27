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
    polymarket: "42,50%",
    poll: "SEIS PESQUISAS NACIONAIS FORAM DIVULGADAS EM 24/Set, E SEGUEM AS MAIS RECENTES EM 27/Set, E ELAS NÃO CONCORDAM SOBRE QUEM LIDERA NENHUM DOS DOIS TURNOS. No 1º turno: Alfa Inteligência/TMC (n=2.700, campo de 18 a 23/Set, margem de 1,8pp, BR-02512/2026) dá Lula à frente por 40% a 33%; Real Time Big Data (n=2.000, campo de 19 a 23/Set, 2,0pp, BR-04202/2026) dá 41% a 37%; PoderData/Aya (n=3.000, campo de 20 a 23/Set, 1,8pp, BR-01739/2026) dá 41% a 39%; Datafolha (n=2.002, campo de 22 a 23/Set, 2,0pp, BR-00304/2026) dá 40% a 36%; Palver (n=5.000, campo de 20 a 23/Set, 2,5pp, BR-09587/2026) dá empate em 43%; e Futura/100% Cidades (n=2.000, campo de 19 a 23/Set, 2,2pp, BR-05268/2026) dá Flávio Bolsonaro à frente por 40,4% a 38,4%. No 2º turno a Datafolha é a única que põe Lula à frente, 47% a 45%, a Alfa dá empate em 43% e as outras quatro põem Flávio Bolsonaro à frente, com a Futura em 49,4% a 43,7%, a única das seis em que a distância fica FORA da margem da própria pesquisa. A comparação de cada casa contra a rodada anterior dela mesma sai 3 a 3: Lula ganhou terreno na Datafolha, na Palver e na PoderData e perdeu na Real Time, na Futura e na Alfa. As seis também medem a terceira via em leituras que divergem entre si: Renan Santos vai de 8% na Palver a 2,4% na Futura, Augusto Cury de 6% a 2% e Ronaldo Caiado de 5,7% a 1%.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "PARADO EM 42,50% NO CONTRATO DE VENCEDOR (vol USD 12,40M acumulado), leitura confirmada de 27/Set, 12:47 BRT, e com queda de 0,48pp no normalizado, porque a soma do par subiu de 98,65 para 99,75. O vão contra Flávio Bolsonaro abre de 13,65pp para 14,75pp, a segunda abertura seguida entre leituras confirmadas. ⚠️ Não é extremo: o preço dele está a 25,00pp do topo da série, 67,50% de 16 de agosto, e a 8,00pp do piso, 34,50% de 25 de abril. No contrato de 2º lugar do 1º turno ele sobe 1,00pp no cru e 0,75pp no normalizado, para 25,45% (vol USD 1,04M acumulado).",
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "57,25%",
    poll: "SEIS PESQUISAS NACIONAIS FORAM DIVULGADAS EM 24/Set, E SEGUEM AS MAIS RECENTES EM 27/Set, E ELAS NÃO CONCORDAM SOBRE QUEM LIDERA NENHUM DOS DOIS TURNOS. No 1º turno: Alfa Inteligência/TMC (n=2.700, campo de 18 a 23/Set, margem de 1,8pp, BR-02512/2026) dá Lula à frente por 40% a 33%; Real Time Big Data (n=2.000, campo de 19 a 23/Set, 2,0pp, BR-04202/2026) dá 41% a 37%; PoderData/Aya (n=3.000, campo de 20 a 23/Set, 1,8pp, BR-01739/2026) dá 41% a 39%; Datafolha (n=2.002, campo de 22 a 23/Set, 2,0pp, BR-00304/2026) dá 40% a 36%; Palver (n=5.000, campo de 20 a 23/Set, 2,5pp, BR-09587/2026) dá empate em 43%; e Futura/100% Cidades (n=2.000, campo de 19 a 23/Set, 2,2pp, BR-05268/2026) dá Flávio Bolsonaro à frente por 40,4% a 38,4%. No 2º turno a Datafolha é a única que põe Lula à frente, 47% a 45%, a Alfa dá empate em 43% e as outras quatro põem Flávio Bolsonaro à frente, com a Futura em 49,4% a 43,7%, a única das seis em que a distância fica FORA da margem da própria pesquisa. A comparação de cada casa contra a rodada anterior dela mesma sai 3 a 3: Lula ganhou terreno na Datafolha, na Palver e na PoderData e perdeu na Real Time, na Futura e na Alfa. As seis também medem a terceira via em leituras que divergem entre si: Renan Santos vai de 8% na Palver a 2,4% na Futura, Augusto Cury de 6% a 2% e Ronaldo Caiado de 5,7% a 1%.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "SOBE 1,10pp NO CONTRATO DE VENCEDOR, para 57,25% (vol USD 11,96M acumulado), leitura confirmada de 27/Set, 12:47 BRT, e 0,48pp no normalizado: mais da metade da alta crua é sobrepreço do par. O vão sobre Lula abre de 13,65pp para 14,75pp. O preço dele está a 4,45pp do topo da série, 61,70% gravado em 21/Set, e a 35,25pp do piso, 22,00% de 3 de julho. No contrato de 2º lugar do 1º turno segue em 74,50% (vol USD 1,19M acumulado), com queda de 0,75pp no normalizado.",
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "0,45%",
    poll: "SEIS PESQUISAS NACIONAIS FORAM DIVULGADAS EM 24/Set, E SEGUEM AS MAIS RECENTES EM 27/Set, E ELAS NÃO CONCORDAM SOBRE QUEM LIDERA NENHUM DOS DOIS TURNOS. No 1º turno: Alfa Inteligência/TMC (n=2.700, campo de 18 a 23/Set, margem de 1,8pp, BR-02512/2026) dá Lula à frente por 40% a 33%; Real Time Big Data (n=2.000, campo de 19 a 23/Set, 2,0pp, BR-04202/2026) dá 41% a 37%; PoderData/Aya (n=3.000, campo de 20 a 23/Set, 1,8pp, BR-01739/2026) dá 41% a 39%; Datafolha (n=2.002, campo de 22 a 23/Set, 2,0pp, BR-00304/2026) dá 40% a 36%; Palver (n=5.000, campo de 20 a 23/Set, 2,5pp, BR-09587/2026) dá empate em 43%; e Futura/100% Cidades (n=2.000, campo de 19 a 23/Set, 2,2pp, BR-05268/2026) dá Flávio Bolsonaro à frente por 40,4% a 38,4%. No 2º turno a Datafolha é a única que põe Lula à frente, 47% a 45%, a Alfa dá empate em 43% e as outras quatro põem Flávio Bolsonaro à frente, com a Futura em 49,4% a 43,7%, a única das seis em que a distância fica FORA da margem da própria pesquisa. A comparação de cada casa contra a rodada anterior dela mesma sai 3 a 3: Lula ganhou terreno na Datafolha, na Palver e na PoderData e perdeu na Real Time, na Futura e na Alfa. As seis também medem a terceira via em leituras que divergem entre si: Renan Santos vai de 8% na Palver a 2,4% na Futura, Augusto Cury de 6% a 2% e Ronaldo Caiado de 5,7% a 1%.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "CAI 4,00pp NO CRU NO CONTRATO DE 3º LUGAR DO 1º TURNO, para 41,50% (vol USD 0,43M acumulado), leitura confirmada de 27/Set, 12:47 BRT, e 3,51pp no normalizado, e perde a liderança daquele livro para Augusto Cury, que fica 2,90pp à frente. No de vencedor segue em 0,45%. 🏆 O contrato dele no livro de vencedor segue sendo o de MAIOR volume acumulado do presidencial, USD 14,52M contra USD 14,10M do de Tarcísio de Freitas, e no livro de 2º lugar do 1º turno o dele também lidera em volume, USD 1,37M contra USD 1,19M do contrato de Flávio Bolsonaro, que é quem paga 74,50% ali.",
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0,05%",
    poll: "SEIS PESQUISAS NACIONAIS FORAM DIVULGADAS EM 24/Set, E SEGUEM AS MAIS RECENTES EM 27/Set, E ELAS NÃO CONCORDAM SOBRE QUEM LIDERA NENHUM DOS DOIS TURNOS. No 1º turno: Alfa Inteligência/TMC (n=2.700, campo de 18 a 23/Set, margem de 1,8pp, BR-02512/2026) dá Lula à frente por 40% a 33%; Real Time Big Data (n=2.000, campo de 19 a 23/Set, 2,0pp, BR-04202/2026) dá 41% a 37%; PoderData/Aya (n=3.000, campo de 20 a 23/Set, 1,8pp, BR-01739/2026) dá 41% a 39%; Datafolha (n=2.002, campo de 22 a 23/Set, 2,0pp, BR-00304/2026) dá 40% a 36%; Palver (n=5.000, campo de 20 a 23/Set, 2,5pp, BR-09587/2026) dá empate em 43%; e Futura/100% Cidades (n=2.000, campo de 19 a 23/Set, 2,2pp, BR-05268/2026) dá Flávio Bolsonaro à frente por 40,4% a 38,4%. No 2º turno a Datafolha é a única que põe Lula à frente, 47% a 45%, a Alfa dá empate em 43% e as outras quatro põem Flávio Bolsonaro à frente, com a Futura em 49,4% a 43,7%, a única das seis em que a distância fica FORA da margem da própria pesquisa. A comparação de cada casa contra a rodada anterior dela mesma sai 3 a 3: Lula ganhou terreno na Datafolha, na Palver e na PoderData e perdeu na Real Time, na Futura e na Alfa. As seis também medem a terceira via em leituras que divergem entre si: Renan Santos vai de 8% na Palver a 2,4% na Futura, Augusto Cury de 6% a 2% e Ronaldo Caiado de 5,7% a 1%.",
    position: "Centro-esquerda. Ministro da Fazenda até a desincompatibilização. Foco no maior colégio eleitoral do país.",
    risk: "Parado no piso do livro, 0,05%, leitura confirmada de 27/Set, 12:47 BRT, com USD 7,55M acumulados. Não é candidato à Presidência: disputa o governo de São Paulo, e por isso não aparece nos cenários presidenciais das seis nacionais de 24/Set.",
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "0,05%",
    poll: "SEIS PESQUISAS NACIONAIS FORAM DIVULGADAS EM 24/Set, E SEGUEM AS MAIS RECENTES EM 27/Set, E ELAS NÃO CONCORDAM SOBRE QUEM LIDERA NENHUM DOS DOIS TURNOS. No 1º turno: Alfa Inteligência/TMC (n=2.700, campo de 18 a 23/Set, margem de 1,8pp, BR-02512/2026) dá Lula à frente por 40% a 33%; Real Time Big Data (n=2.000, campo de 19 a 23/Set, 2,0pp, BR-04202/2026) dá 41% a 37%; PoderData/Aya (n=3.000, campo de 20 a 23/Set, 1,8pp, BR-01739/2026) dá 41% a 39%; Datafolha (n=2.002, campo de 22 a 23/Set, 2,0pp, BR-00304/2026) dá 40% a 36%; Palver (n=5.000, campo de 20 a 23/Set, 2,5pp, BR-09587/2026) dá empate em 43%; e Futura/100% Cidades (n=2.000, campo de 19 a 23/Set, 2,2pp, BR-05268/2026) dá Flávio Bolsonaro à frente por 40,4% a 38,4%. No 2º turno a Datafolha é a única que põe Lula à frente, 47% a 45%, a Alfa dá empate em 43% e as outras quatro põem Flávio Bolsonaro à frente, com a Futura em 49,4% a 43,7%, a única das seis em que a distância fica FORA da margem da própria pesquisa. A comparação de cada casa contra a rodada anterior dela mesma sai 3 a 3: Lula ganhou terreno na Datafolha, na Palver e na PoderData e perdeu na Real Time, na Futura e na Alfa. As seis também medem a terceira via em leituras que divergem entre si: Renan Santos vai de 8% na Palver a 2,4% na Futura, Augusto Cury de 6% a 2% e Ronaldo Caiado de 5,7% a 1%.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Candidato oficializado pelo PSD.",
    risk: "SEGUE EM 14,50% NO CRU NO CONTRATO DE 3º LUGAR DO 1º TURNO (vol USD 0,17M acumulado), leitura confirmada de 27/Set, 12:47 BRT, e sobe 0,13pp no normalizado, porque a soma daquele livro caiu de 102,85 para 101,90. Mantém a terceira posição daquele livro, enquanto Augusto Cury passa Renan Santos à frente dele. ⭐ Na Futura de 24/Set ele aparece à frente de Lula no par de 2º turno, por 46,5% a 42,4%. No contrato de vencedor segue em 0,05%, com USD 7,79M acumulados.",
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0,05%",
    poll: "SEIS PESQUISAS NACIONAIS FORAM DIVULGADAS EM 24/Set, E SEGUEM AS MAIS RECENTES EM 27/Set, E ELAS NÃO CONCORDAM SOBRE QUEM LIDERA NENHUM DOS DOIS TURNOS. No 1º turno: Alfa Inteligência/TMC (n=2.700, campo de 18 a 23/Set, margem de 1,8pp, BR-02512/2026) dá Lula à frente por 40% a 33%; Real Time Big Data (n=2.000, campo de 19 a 23/Set, 2,0pp, BR-04202/2026) dá 41% a 37%; PoderData/Aya (n=3.000, campo de 20 a 23/Set, 1,8pp, BR-01739/2026) dá 41% a 39%; Datafolha (n=2.002, campo de 22 a 23/Set, 2,0pp, BR-00304/2026) dá 40% a 36%; Palver (n=5.000, campo de 20 a 23/Set, 2,5pp, BR-09587/2026) dá empate em 43%; e Futura/100% Cidades (n=2.000, campo de 19 a 23/Set, 2,2pp, BR-05268/2026) dá Flávio Bolsonaro à frente por 40,4% a 38,4%. No 2º turno a Datafolha é a única que põe Lula à frente, 47% a 45%, a Alfa dá empate em 43% e as outras quatro põem Flávio Bolsonaro à frente, com a Futura em 49,4% a 43,7%, a única das seis em que a distância fica FORA da margem da própria pesquisa. A comparação de cada casa contra a rodada anterior dela mesma sai 3 a 3: Lula ganhou terreno na Datafolha, na Palver e na PoderData e perdeu na Real Time, na Futura e na Alfa. As seis também medem a terceira via em leituras que divergem entre si: Renan Santos vai de 8% na Palver a 2,4% na Futura, Augusto Cury de 6% a 2% e Ronaldo Caiado de 5,7% a 1%.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "SEGUE EM 0,65% NO CONTRATO DE 3º LUGAR DO 1º TURNO (vol USD 0,09M acumulado), leitura confirmada de 27/Set, 12:47 BRT, parado. ⭐ A Futura de 24/Set o pôs à FRENTE de Lula no par de 2º turno, por 43,8% a 43,3%, a leitura de 2º turno mais competitiva que ele já registrou neste painel. No de vencedor está em 0,05%, com USD 7,71M acumulados.",
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0,05%",
    poll: "SEIS PESQUISAS NACIONAIS FORAM DIVULGADAS EM 24/Set, E SEGUEM AS MAIS RECENTES EM 27/Set, E ELAS NÃO CONCORDAM SOBRE QUEM LIDERA NENHUM DOS DOIS TURNOS. No 1º turno: Alfa Inteligência/TMC (n=2.700, campo de 18 a 23/Set, margem de 1,8pp, BR-02512/2026) dá Lula à frente por 40% a 33%; Real Time Big Data (n=2.000, campo de 19 a 23/Set, 2,0pp, BR-04202/2026) dá 41% a 37%; PoderData/Aya (n=3.000, campo de 20 a 23/Set, 1,8pp, BR-01739/2026) dá 41% a 39%; Datafolha (n=2.002, campo de 22 a 23/Set, 2,0pp, BR-00304/2026) dá 40% a 36%; Palver (n=5.000, campo de 20 a 23/Set, 2,5pp, BR-09587/2026) dá empate em 43%; e Futura/100% Cidades (n=2.000, campo de 19 a 23/Set, 2,2pp, BR-05268/2026) dá Flávio Bolsonaro à frente por 40,4% a 38,4%. No 2º turno a Datafolha é a única que põe Lula à frente, 47% a 45%, a Alfa dá empate em 43% e as outras quatro põem Flávio Bolsonaro à frente, com a Futura em 49,4% a 43,7%, a única das seis em que a distância fica FORA da margem da própria pesquisa. A comparação de cada casa contra a rodada anterior dela mesma sai 3 a 3: Lula ganhou terreno na Datafolha, na Palver e na PoderData e perdeu na Real Time, na Futura e na Alfa. As seis também medem a terceira via em leituras que divergem entre si: Renan Santos vai de 8% na Palver a 2,4% na Futura, Augusto Cury de 6% a 2% e Ronaldo Caiado de 5,7% a 1%.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Parado no piso do livro, 0,05%, leitura confirmada de 27/Set, 12:47 BRT, com USD 14,10M acumulados, e o contrato dele segue atrás do de Renan Santos em volume acumulado no livro presidencial, que tem USD 14,52M.",
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
