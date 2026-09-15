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
    polymarket: "45,50%",
    poll: "DUAS NACIONAIS SAÍRAM EM 14/Set: a BTG/Nexus (n=2.003, campo 11 a 13/Set, margem de 2,0pp, BR-04076/2026) e a Genial/Quaest (n=2.004, campo 10 a 13/Set, margem de 2,0pp, BR-03607/2026). No 1º turno as duas dão a Lula os mesmos 5 pontos de vantagem, 42% a 37% e 36% a 31%, e no par de 2º turno discordam no sinal, 47% a 46% para Lula na primeira e 42% a 40% para Flávio Bolsonaro na segunda, as duas dentro da margem. NO PREÇO, o contrato de vencedor dele caiu 2,00pp e está em 45,50% (vol USD 11,01M acumulado), leitura confirmada de 14/Set, 19:44 BRT, e no de 2º lugar do 1º turno subiu 1,75pp, para 23,75%.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "O PREÇO CAIU À TARDE E O VÃO ABRIU PELOS DOIS LADOS. O contrato de vencedor está em 45,50%, leitura confirmada de 14/Set, 19:44 BRT, queda de 2,00pp contra a leitura confirmada de 13/Set, e a distância para o primeiro colocado foi de 2,15pp para 6,45pp. A aprovação do governo fica em 43% contra 50% de desaprovação na Genial/Quaest de 14/Set, os mesmos números da rodada de 07/Set da casa, e em 47% contra 49% na BTG/Nexus."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "51,95%",
    poll: "DUAS NACIONAIS SAÍRAM EM 14/Set: a BTG/Nexus (n=2.003, campo 11 a 13/Set, margem de 2,0pp, BR-04076/2026) e a Genial/Quaest (n=2.004, campo 10 a 13/Set, margem de 2,0pp, BR-03607/2026). No 1º turno as duas dão a Lula os mesmos 5 pontos de vantagem, 42% a 37% e 36% a 31%, e no par de 2º turno discordam no sinal, 47% a 46% para Lula na primeira e 42% a 40% para Flávio Bolsonaro na segunda, as duas dentro da margem. Ele tem 37% e 31% no 1º turno, 2 pontos acima da rodada anterior de cada casa. NO PREÇO, o contrato de vencedor SUBIU 2,30pp e está em 51,95% (vol USD 10,68M acumulado), leitura confirmada de 14/Set, 19:44 BRT, 3,15pp abaixo do topo da série dele, de 55,10% em 10/Set. No contrato de 2º lugar do 1º turno caiu 1,50pp, para 75,50%.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "SOBE 2,30pp NO CONTRATO DE VENCEDOR E INTERROMPE DOIS DIAS DE QUEDA. Os 51,95%, leitura confirmada de 14/Set, 19:44 BRT, ficam 3,15pp abaixo do topo da série dele, de 55,10% em 10/Set, e o vão para o segundo colocado abriu de 2,15pp para 6,45pp. A ordem dos fatos do dia está medida, o vínculo com o preço não, porque o livro é arbitrado continuamente."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "1,70%",
    poll: "DUAS NACIONAIS SAÍRAM EM 14/Set: a BTG/Nexus (n=2.003, campo 11 a 13/Set, margem de 2,0pp, BR-04076/2026) e a Genial/Quaest (n=2.004, campo 10 a 13/Set, margem de 2,0pp, BR-03607/2026). No 1º turno as duas dão a Lula os mesmos 5 pontos de vantagem, 42% a 37% e 36% a 31%, e no par de 2º turno discordam no sinal, 47% a 46% para Lula na primeira e 42% a 40% para Flávio Bolsonaro na segunda, as duas dentro da margem. Ele tem 2% no 1º turno da BTG/Nexus e 4% no da Genial/Quaest, e perde o par de 2º turno para Lula por 37% a 48% e por 38% a 41%. NO PREÇO, o contrato de vencedor cedeu 0,15pp e está em 1,70% (vol USD 13,47M acumulado), leitura confirmada de 14/Set, 19:44 BRT, e no de 3º lugar do 1º turno subiu 3,00pp, para 37,50%.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "SOBE 3,00pp NO CONTRATO DE 3º LUGAR DO 1º TURNO, para 37,50%, depois de dois dias seguidos de queda ali, e o vão para o favorito daquele contrato fechou de 21,10pp para 7,90pp, leitura confirmada de 14/Set, 19:44 BRT. As duas casas do dia o medem em direções opostas no 1º turno: a BTG/Nexus de 4% para 2% e a Genial/Quaest de 3% para 4%."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0,05%",
    poll: "As duas nacionais de 14/Set, BTG/Nexus e Genial/Quaest, não o testam em cenário presidencial. NO PREÇO, ele está em 0,05% (vol USD 7,54M acumulado) no contrato de VENCEDOR, no piso do livro e abaixo do corte de 0,5% que o painel usa para separar preço de ruído, leitura confirmada de 14/Set, 19:44 BRT.",
    position: "Centro-esquerda. Ministro da Fazenda até a desincompatibilização. Foco no maior colégio eleitoral do país.",
    risk: "Parado no piso do livro, 0,05%, leitura confirmada de 14/Set, 19:44 BRT. Não é candidato à Presidência: disputa o governo de São Paulo, e por isso não aparece nos cenários presidenciais das nacionais do dia."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "0,15%",
    poll: "DUAS NACIONAIS SAÍRAM EM 14/Set: a BTG/Nexus (n=2.003, campo 11 a 13/Set, margem de 2,0pp, BR-04076/2026) e a Genial/Quaest (n=2.004, campo 10 a 13/Set, margem de 2,0pp, BR-03607/2026). No 1º turno as duas dão a Lula os mesmos 5 pontos de vantagem, 42% a 37% e 36% a 31%, e no par de 2º turno discordam no sinal, 47% a 46% para Lula na primeira e 42% a 40% para Flávio Bolsonaro na segunda, as duas dentro da margem. Ele tem 5% no 1º turno da BTG/Nexus e 4% no da Genial/Quaest, e perde o par de 2º turno para Lula por 41% a 47% na primeira, fora da margem, e por 39% a 41% na segunda, dentro dela. NO PREÇO, está em 0,15% no contrato de VENCEDOR, leitura confirmada de 14/Set, 19:44 BRT, abaixo do corte de 0,5%, e no contrato de 3º LUGAR do 1º turno subiu 7,00pp, para 15,50%.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Candidato oficializado pelo PSD.",
    risk: "O SEGUNDO MAIOR MOVIMENTO DO PAINEL NESTA RODADA É DELE: 7,00pp no contrato de 3º lugar do 1º turno, de 8,50% para 15,50%, leitura confirmada de 14/Set, 19:44 BRT, terceiro dia seguido de alta ali. Não é extremo: nas leituras gravadas de 30/Ago o mesmo contrato chegou a 45,50% para ele. E as duas casas do dia divergem sobre ele no par de 2º turno, uma dentro e outra fora da margem."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0,15%",
    poll: "DUAS NACIONAIS SAÍRAM EM 14/Set: a BTG/Nexus (n=2.003, campo 11 a 13/Set, margem de 2,0pp, BR-04076/2026) e a Genial/Quaest (n=2.004, campo 10 a 13/Set, margem de 2,0pp, BR-03607/2026). No 1º turno as duas dão a Lula os mesmos 5 pontos de vantagem, 42% a 37% e 36% a 31%, e no par de 2º turno discordam no sinal, 47% a 46% para Lula na primeira e 42% a 40% para Flávio Bolsonaro na segunda, as duas dentro da margem. Ele tem 1% no 1º turno das duas e perde o par de 2º turno para Lula por 38% a 49% e por 33% a 45%, as duas fora da margem. NO PREÇO, está em 0,15% (vol USD 7,30M acumulado) no contrato de VENCEDOR, leitura confirmada de 14/Set, 19:44 BRT, abaixo do corte de 0,5%, e no contrato de 3º LUGAR do 1º turno subiu 0,05pp, para 0,75%.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Parado em 0,15% no contrato de vencedor (vol USD 7,30M acumulado), leitura confirmada de 14/Set, 19:44 BRT, abaixo do corte de 0,5%. Nos pares de 2º turno das duas casas do dia ele fica 11 e 12 pontos atrás de Lula, a distância mais larga da Genial/Quaest e empatada com a de Renan Santos na BTG/Nexus."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0,05%",
    poll: "As duas nacionais de 14/Set não o testam em cenário presidencial de 1º turno. NO PREÇO, ele está em 0,05% (vol USD 14,07M acumulado) no contrato de VENCEDOR, no piso do livro e abaixo do corte de 0,5%, leitura confirmada de 14/Set, 19:44 BRT.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Parado no piso do livro, 0,05%, leitura confirmada de 14/Set, 19:44 BRT, e ainda assim o contrato dele é o de maior volume acumulado do painel presidencial, USD 14,07M. Preço no piso com volume alto mede quanto já se negociou, não quanto se espera dele agora."
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
