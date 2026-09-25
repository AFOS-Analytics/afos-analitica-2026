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
    polymarket: "43,50%",
    poll: "SEIS PESQUISAS NACIONAIS FORAM DIVULGADAS EM 24/Set E ELAS NÃO CONCORDAM SOBRE QUEM LIDERA NENHUM DOS DOIS TURNOS. No 1º turno: Alfa Inteligência/TMC (n=2.700, campo de 18 a 23/Set, margem de 1,8pp, BR-02512/2026) dá Lula à frente por 40% a 33%; Real Time Big Data (n=2.000, campo de 19 a 23/Set, 2,0pp, BR-04202/2026) dá 41% a 37%; PoderData/Aya (n=3.000, campo de 20 a 23/Set, 1,8pp, BR-01739/2026) dá 41% a 39%; Datafolha (n=2.002, campo de 22 a 23/Set, 2,0pp, BR-00304/2026) dá 40% a 36%; Palver (n=5.000, campo de 20 a 23/Set, 2,5pp, BR-09587/2026) dá empate em 43%; e Futura/100% Cidades (n=2.000, campo de 19 a 23/Set, 2,2pp, BR-05268/2026) dá Flávio Bolsonaro à frente por 40,4% a 38,4%. No 2º turno a Datafolha é a única que põe Lula à frente, 47% a 45%, a Alfa dá empate em 43% e as outras quatro põem Flávio Bolsonaro à frente, com a Futura em 49,4% a 43,7%, a única das seis em que a distância fica FORA da margem da própria pesquisa. A comparação de cada casa contra a rodada anterior dela mesma sai 3 a 3: Lula ganhou terreno na Datafolha, na Palver e na PoderData e perdeu na Real Time, na Futura e na Alfa. As seis também medem a terceira via em leituras que divergem entre si: Renan Santos vai de 8% na Palver a 2,4% na Futura, Augusto Cury de 6% a 2% e Ronaldo Caiado de 5,7% a 1%.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "SOBE 3,00pp NO CONTRATO DE VENCEDOR, para 43,50% (vol USD 12,18M acumulado), leitura confirmada de 24/Set, 22:45 BRT, e 3,15pp no normalizado pela soma do par, que ficou praticamente parada, de 99,35 para 99,05. O vão contra Flávio Bolsonaro fecha de 18,35pp para 12,05pp, terceiro dia seguido de fechamento, e os 6,30pp desta passagem são o maior fechamento entre duas leituras certificadas consecutivas desde 04/Set, quando este registro começou. ⚠️ Não é extremo: o preço dele está a 24,00pp do topo da série, 67,50% de 16 de agosto, e a 9,00pp do piso, 34,50% de 25 de abril. No contrato de 2º lugar do 1º turno ele cede 1,35pp no cru e 2,05pp no normalizado, para 24,50% (vol USD 0,98M acumulado).",
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "55,55%",
    poll: "SEIS PESQUISAS NACIONAIS FORAM DIVULGADAS EM 24/Set E ELAS NÃO CONCORDAM SOBRE QUEM LIDERA NENHUM DOS DOIS TURNOS. No 1º turno: Alfa Inteligência/TMC (n=2.700, campo de 18 a 23/Set, margem de 1,8pp, BR-02512/2026) dá Lula à frente por 40% a 33%; Real Time Big Data (n=2.000, campo de 19 a 23/Set, 2,0pp, BR-04202/2026) dá 41% a 37%; PoderData/Aya (n=3.000, campo de 20 a 23/Set, 1,8pp, BR-01739/2026) dá 41% a 39%; Datafolha (n=2.002, campo de 22 a 23/Set, 2,0pp, BR-00304/2026) dá 40% a 36%; Palver (n=5.000, campo de 20 a 23/Set, 2,5pp, BR-09587/2026) dá empate em 43%; e Futura/100% Cidades (n=2.000, campo de 19 a 23/Set, 2,2pp, BR-05268/2026) dá Flávio Bolsonaro à frente por 40,4% a 38,4%. No 2º turno a Datafolha é a única que põe Lula à frente, 47% a 45%, a Alfa dá empate em 43% e as outras quatro põem Flávio Bolsonaro à frente, com a Futura em 49,4% a 43,7%, a única das seis em que a distância fica FORA da margem da própria pesquisa. A comparação de cada casa contra a rodada anterior dela mesma sai 3 a 3: Lula ganhou terreno na Datafolha, na Palver e na PoderData e perdeu na Real Time, na Futura e na Alfa. As seis também medem a terceira via em leituras que divergem entre si: Renan Santos vai de 8% na Palver a 2,4% na Futura, Augusto Cury de 6% a 2% e Ronaldo Caiado de 5,7% a 1%.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "CEDE 3,30pp NO CONTRATO DE VENCEDOR, para 55,55% (vol USD 11,79M acumulado), leitura confirmada de 24/Set, 22:45 BRT, e 3,15pp no normalizado pela soma do par. O vão sobre Lula fecha pelo terceiro dia seguido, de 22,40pp em 21/Set para 19,05pp, 18,35pp e agora 12,05pp. O preço dele está a 6,15pp do topo da série, 61,70% gravado em 21/Set, e a 33,55pp do piso, 22,00% de 3 de julho. ⭐ No contrato de 2º lugar do 1º turno ele foi na direção oposta e SOBE 4,00pp no cru, para 75,50% (vol USD 1,14M acumulado), o maior movimento de qualquer contrato desta rodada, mas só 2,05pp no normalizado, porque aquele par inchou de 97,35 para 100,00.",
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "0,55%",
    poll: "SEIS PESQUISAS NACIONAIS FORAM DIVULGADAS EM 24/Set E ELAS NÃO CONCORDAM SOBRE QUEM LIDERA NENHUM DOS DOIS TURNOS. No 1º turno: Alfa Inteligência/TMC (n=2.700, campo de 18 a 23/Set, margem de 1,8pp, BR-02512/2026) dá Lula à frente por 40% a 33%; Real Time Big Data (n=2.000, campo de 19 a 23/Set, 2,0pp, BR-04202/2026) dá 41% a 37%; PoderData/Aya (n=3.000, campo de 20 a 23/Set, 1,8pp, BR-01739/2026) dá 41% a 39%; Datafolha (n=2.002, campo de 22 a 23/Set, 2,0pp, BR-00304/2026) dá 40% a 36%; Palver (n=5.000, campo de 20 a 23/Set, 2,5pp, BR-09587/2026) dá empate em 43%; e Futura/100% Cidades (n=2.000, campo de 19 a 23/Set, 2,2pp, BR-05268/2026) dá Flávio Bolsonaro à frente por 40,4% a 38,4%. No 2º turno a Datafolha é a única que põe Lula à frente, 47% a 45%, a Alfa dá empate em 43% e as outras quatro põem Flávio Bolsonaro à frente, com a Futura em 49,4% a 43,7%, a única das seis em que a distância fica FORA da margem da própria pesquisa. A comparação de cada casa contra a rodada anterior dela mesma sai 3 a 3: Lula ganhou terreno na Datafolha, na Palver e na PoderData e perdeu na Real Time, na Futura e na Alfa. As seis também medem a terceira via em leituras que divergem entre si: Renan Santos vai de 8% na Palver a 2,4% na Futura, Augusto Cury de 6% a 2% e Ronaldo Caiado de 5,7% a 1%.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "FICA NOS MESMOS 44,00% NO CONTRATO DE 3º LUGAR DO 1º TURNO (vol USD 0,41M acumulado), leitura confirmada de 24/Set, 22:45 BRT, e cede 0,20pp no de vencedor, para 0,55%. 🏆 O contrato dele no livro de vencedor segue sendo o de MAIOR volume acumulado do presidencial e abriu distância, USD 14,39M contra USD 14,10M do de Tarcísio de Freitas. E no livro de 2º lugar do 1º turno o dele também lidera em volume, USD 1,36M contra USD 1,14M do contrato de Flávio Bolsonaro, que é quem paga 75,50% ali.",
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0,05%",
    poll: "SEIS PESQUISAS NACIONAIS FORAM DIVULGADAS EM 24/Set E ELAS NÃO CONCORDAM SOBRE QUEM LIDERA NENHUM DOS DOIS TURNOS. No 1º turno: Alfa Inteligência/TMC (n=2.700, campo de 18 a 23/Set, margem de 1,8pp, BR-02512/2026) dá Lula à frente por 40% a 33%; Real Time Big Data (n=2.000, campo de 19 a 23/Set, 2,0pp, BR-04202/2026) dá 41% a 37%; PoderData/Aya (n=3.000, campo de 20 a 23/Set, 1,8pp, BR-01739/2026) dá 41% a 39%; Datafolha (n=2.002, campo de 22 a 23/Set, 2,0pp, BR-00304/2026) dá 40% a 36%; Palver (n=5.000, campo de 20 a 23/Set, 2,5pp, BR-09587/2026) dá empate em 43%; e Futura/100% Cidades (n=2.000, campo de 19 a 23/Set, 2,2pp, BR-05268/2026) dá Flávio Bolsonaro à frente por 40,4% a 38,4%. No 2º turno a Datafolha é a única que põe Lula à frente, 47% a 45%, a Alfa dá empate em 43% e as outras quatro põem Flávio Bolsonaro à frente, com a Futura em 49,4% a 43,7%, a única das seis em que a distância fica FORA da margem da própria pesquisa. A comparação de cada casa contra a rodada anterior dela mesma sai 3 a 3: Lula ganhou terreno na Datafolha, na Palver e na PoderData e perdeu na Real Time, na Futura e na Alfa. As seis também medem a terceira via em leituras que divergem entre si: Renan Santos vai de 8% na Palver a 2,4% na Futura, Augusto Cury de 6% a 2% e Ronaldo Caiado de 5,7% a 1%.",
    position: "Centro-esquerda. Ministro da Fazenda até a desincompatibilização. Foco no maior colégio eleitoral do país.",
    risk: "Parado no piso do livro, 0,05%, leitura confirmada de 24/Set, 22:45 BRT, com USD 7,55M acumulados. Não é candidato à Presidência: disputa o governo de São Paulo, e por isso não aparece nos cenários presidenciais das seis nacionais de 24/Set.",
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "0,05%",
    poll: "SEIS PESQUISAS NACIONAIS FORAM DIVULGADAS EM 24/Set E ELAS NÃO CONCORDAM SOBRE QUEM LIDERA NENHUM DOS DOIS TURNOS. No 1º turno: Alfa Inteligência/TMC (n=2.700, campo de 18 a 23/Set, margem de 1,8pp, BR-02512/2026) dá Lula à frente por 40% a 33%; Real Time Big Data (n=2.000, campo de 19 a 23/Set, 2,0pp, BR-04202/2026) dá 41% a 37%; PoderData/Aya (n=3.000, campo de 20 a 23/Set, 1,8pp, BR-01739/2026) dá 41% a 39%; Datafolha (n=2.002, campo de 22 a 23/Set, 2,0pp, BR-00304/2026) dá 40% a 36%; Palver (n=5.000, campo de 20 a 23/Set, 2,5pp, BR-09587/2026) dá empate em 43%; e Futura/100% Cidades (n=2.000, campo de 19 a 23/Set, 2,2pp, BR-05268/2026) dá Flávio Bolsonaro à frente por 40,4% a 38,4%. No 2º turno a Datafolha é a única que põe Lula à frente, 47% a 45%, a Alfa dá empate em 43% e as outras quatro põem Flávio Bolsonaro à frente, com a Futura em 49,4% a 43,7%, a única das seis em que a distância fica FORA da margem da própria pesquisa. A comparação de cada casa contra a rodada anterior dela mesma sai 3 a 3: Lula ganhou terreno na Datafolha, na Palver e na PoderData e perdeu na Real Time, na Futura e na Alfa. As seis também medem a terceira via em leituras que divergem entre si: Renan Santos vai de 8% na Palver a 2,4% na Futura, Augusto Cury de 6% a 2% e Ronaldo Caiado de 5,7% a 1%.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Candidato oficializado pelo PSD.",
    risk: "CEDE 0,50pp NO CONTRATO DE 3º LUGAR DO 1º TURNO, para 14,00% (vol USD 0,17M acumulado), leitura confirmada de 24/Set, 22:45 BRT, e mantém a terceira posição daquele livro. ⭐ E no mesmo dia a Futura o pôs à frente de Lula no par de 2º turno, por 46,5% a 42,4%, e ele passou Augusto Cury no 1º turno daquela casa, subindo de 4,5% para 5,7%. No contrato de vencedor segue em 0,05%, com USD 7,71M acumulados.",
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0,05%",
    poll: "SEIS PESQUISAS NACIONAIS FORAM DIVULGADAS EM 24/Set E ELAS NÃO CONCORDAM SOBRE QUEM LIDERA NENHUM DOS DOIS TURNOS. No 1º turno: Alfa Inteligência/TMC (n=2.700, campo de 18 a 23/Set, margem de 1,8pp, BR-02512/2026) dá Lula à frente por 40% a 33%; Real Time Big Data (n=2.000, campo de 19 a 23/Set, 2,0pp, BR-04202/2026) dá 41% a 37%; PoderData/Aya (n=3.000, campo de 20 a 23/Set, 1,8pp, BR-01739/2026) dá 41% a 39%; Datafolha (n=2.002, campo de 22 a 23/Set, 2,0pp, BR-00304/2026) dá 40% a 36%; Palver (n=5.000, campo de 20 a 23/Set, 2,5pp, BR-09587/2026) dá empate em 43%; e Futura/100% Cidades (n=2.000, campo de 19 a 23/Set, 2,2pp, BR-05268/2026) dá Flávio Bolsonaro à frente por 40,4% a 38,4%. No 2º turno a Datafolha é a única que põe Lula à frente, 47% a 45%, a Alfa dá empate em 43% e as outras quatro põem Flávio Bolsonaro à frente, com a Futura em 49,4% a 43,7%, a única das seis em que a distância fica FORA da margem da própria pesquisa. A comparação de cada casa contra a rodada anterior dela mesma sai 3 a 3: Lula ganhou terreno na Datafolha, na Palver e na PoderData e perdeu na Real Time, na Futura e na Alfa. As seis também medem a terceira via em leituras que divergem entre si: Renan Santos vai de 8% na Palver a 2,4% na Futura, Augusto Cury de 6% a 2% e Ronaldo Caiado de 5,7% a 1%.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "SOBE 0,05pp NO CONTRATO DE 3º LUGAR DO 1º TURNO, para 0,35% (vol USD 0,08M acumulado), leitura confirmada de 24/Set, 22:45 BRT, movimento abaixo do limite de ruído de 0,5% que o painel usa para book fino. ⭐ E a Futura de 24/Set o pôs à FRENTE de Lula no par de 2º turno, por 43,8% a 43,3%, a leitura de 2º turno mais competitiva que ele já registrou neste painel. No de vencedor está em 0,05%, com USD 7,71M acumulados.",
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0,05%",
    poll: "SEIS PESQUISAS NACIONAIS FORAM DIVULGADAS EM 24/Set E ELAS NÃO CONCORDAM SOBRE QUEM LIDERA NENHUM DOS DOIS TURNOS. No 1º turno: Alfa Inteligência/TMC (n=2.700, campo de 18 a 23/Set, margem de 1,8pp, BR-02512/2026) dá Lula à frente por 40% a 33%; Real Time Big Data (n=2.000, campo de 19 a 23/Set, 2,0pp, BR-04202/2026) dá 41% a 37%; PoderData/Aya (n=3.000, campo de 20 a 23/Set, 1,8pp, BR-01739/2026) dá 41% a 39%; Datafolha (n=2.002, campo de 22 a 23/Set, 2,0pp, BR-00304/2026) dá 40% a 36%; Palver (n=5.000, campo de 20 a 23/Set, 2,5pp, BR-09587/2026) dá empate em 43%; e Futura/100% Cidades (n=2.000, campo de 19 a 23/Set, 2,2pp, BR-05268/2026) dá Flávio Bolsonaro à frente por 40,4% a 38,4%. No 2º turno a Datafolha é a única que põe Lula à frente, 47% a 45%, a Alfa dá empate em 43% e as outras quatro põem Flávio Bolsonaro à frente, com a Futura em 49,4% a 43,7%, a única das seis em que a distância fica FORA da margem da própria pesquisa. A comparação de cada casa contra a rodada anterior dela mesma sai 3 a 3: Lula ganhou terreno na Datafolha, na Palver e na PoderData e perdeu na Real Time, na Futura e na Alfa. As seis também medem a terceira via em leituras que divergem entre si: Renan Santos vai de 8% na Palver a 2,4% na Futura, Augusto Cury de 6% a 2% e Ronaldo Caiado de 5,7% a 1%.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Parado no piso do livro, 0,05%, leitura confirmada de 24/Set, 22:45 BRT, com USD 14,10M acumulados, e o contrato dele segue atrás do de Renan Santos em volume acumulado no livro presidencial, que tem USD 14,39M.",
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
