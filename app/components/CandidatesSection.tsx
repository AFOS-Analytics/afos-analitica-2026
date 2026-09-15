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
    polymarket: "46,50%",
    poll: "DUAS NACIONAIS SAÍRAM EM 15/Set: a Indexa/Broadcast (n=2.000, campo 10 a 13/Set, telefone, margem de 2,2pp, BR-03482/2026) e a CNT/MDA (n=2.002, campo 9 a 13/Set, presencial, margem de 2,2pp, BR-06902/2026). No 1º turno ele tem 38% na Indexa e 40,5% na CNT/MDA, à frente nas duas. No 2º turno contra Flávio Bolsonaro tem 43% a 42% na Indexa, uma vantagem de 1 ponto que cabe na margem, e 47,3% a 40% na CNT/MDA, 7,3 pontos que ficam fora dela. As duas casas concordam no sinal e discordam na magnitude, com 6,3 pontos de diferença entre elas no par de 2º turno.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "O PREÇO SUBIU E O VÃO FECHOU. O contrato de vencedor está em 46,50% (vol USD 11,11M acumulado), leitura confirmada de 15/Set, 16:37 BRT, alta de 1,00pp contra a leitura confirmada de 14/Set, e a distância para Flávio Bolsonaro fechou de 6,45pp para 5,45pp depois de dois dias de abertura. Os 46,50% ficam 21,00pp abaixo do topo da série dele, de 67,50% em 16/Ago. No contrato de 2º lugar do 1º turno ele cai 1,90pp, para 21,85%."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "51,95%",
    poll: "DUAS NACIONAIS SAÍRAM EM 15/Set: a Indexa/Broadcast (n=2.000, campo 10 a 13/Set, telefone, margem de 2,2pp, BR-03482/2026) e a CNT/MDA (n=2.002, campo 9 a 13/Set, presencial, margem de 2,2pp, BR-06902/2026). No 1º turno ele tem 34% na Indexa, o mesmo valor da onda de 26/Ago daquela casa, e 30,4% na CNT/MDA. No 2º turno contra Lula fica em 42% a 43% na Indexa, dentro da margem, e em 40% a 47,3% na CNT/MDA, fora dela. Fica atrás nos dois turnos nas duas casas.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "TERMINA NO PREÇO DA VÉSPERA E SEGUE FAVORITO. Os 51,95% (vol USD 10,73M acumulado), leitura confirmada de 15/Set, 16:37 BRT, ficam 3,15pp abaixo do topo da série dele, de 55,10% em 10/Set, e o vão para o segundo colocado fechou 1,00pp porque o outro lado subiu. Dentro do dia ele cedeu no meio da tarde e recuperou 0,30pp até o fechamento da leitura. No contrato de 2º lugar do 1º turno ele sobe 1,00pp, para 76,50%, enquanto o lado de Lula cede 1,90pp."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "1,65%",
    poll: "DUAS NACIONAIS SAÍRAM EM 15/Set: a Indexa/Broadcast (n=2.000, campo 10 a 13/Set, telefone, margem de 2,2pp, BR-03482/2026) e a CNT/MDA (n=2.002, campo 9 a 13/Set, presencial, margem de 2,2pp, BR-06902/2026). No 1º turno ele tem 3% na Indexa e 2,7% na CNT/MDA. Perde os dois pares de 2º turno para Lula fora de duas margens, por 35% a 45% e por 33,9% a 47,3%.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "CEDE 0,05pp NO CONTRATO DE VENCEDOR, para 1,65% (vol USD 13,49M acumulado), leitura confirmada de 15/Set, 16:37 BRT, e fica a 0,45pp do piso da série dele, de 1,20% em 31/Ago. O contrato dele é o de maior volume acumulado do livro presidencial e paga 1,65%: volume mede interesse acumulado desde a abertura, não probabilidade de agora. No contrato de 3º lugar do 1º turno esta rodada não publica preço novo, porque não houve leitura nova dele em 15/Set, e o valor exibido segue sendo os 37,50% de 14/Set."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0,05%",
    poll: "As duas nacionais de 15/Set, Indexa/Broadcast e CNT/MDA, não o testam em cenário presidencial de 1º turno. NO PREÇO, ele está em 0,05% no contrato de VENCEDOR, no piso do livro e abaixo do corte de 0,5% que o painel usa para tratar preço fino como ruído.",
    position: "Centro-esquerda. Ministro da Fazenda até a desincompatibilização. Foco no maior colégio eleitoral do país.",
    risk: "Parado no piso do livro, 0,05%, leitura confirmada de 15/Set, 16:37 BRT. Não é candidato à Presidência: disputa o governo de São Paulo, e por isso não aparece nos cenários presidenciais de 1º turno das duas casas do dia. O topo da série dele no contrato de vencedor é de 7,60%, em 26/Mai."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "0,15%",
    poll: "DUAS NACIONAIS SAÍRAM EM 15/Set: a Indexa/Broadcast (n=2.000, campo 10 a 13/Set, telefone, margem de 2,2pp, BR-03482/2026) e a CNT/MDA (n=2.002, campo 9 a 13/Set, presencial, margem de 2,2pp, BR-06902/2026). No 1º turno ele tem 4% na Indexa e 3% na CNT/MDA. No par de 2º turno perde para Lula por 39% a 43% na Indexa, dentro de duas margens, e por 37,3% a 46,4% na CNT/MDA, fora delas.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Candidato oficializado pelo PSD.",
    risk: "Parado em 0,15% no contrato de vencedor, leitura confirmada de 15/Set, 16:37 BRT, abaixo do corte de 0,5%. No contrato de 3º lugar do 1º turno, onde ele tinha o movimento mais forte do painel em 14/Set, esta rodada não publica preço novo, porque não houve leitura nova dele em 15/Set: o valor exibido segue sendo os 15,50% de 14/Set."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0,15%",
    poll: "DUAS NACIONAIS SAÍRAM EM 15/Set: a Indexa/Broadcast (n=2.000, campo 10 a 13/Set, telefone, margem de 2,2pp, BR-03482/2026) e a CNT/MDA (n=2.002, campo 9 a 13/Set, presencial, margem de 2,2pp, BR-06902/2026). No 1º turno ele tem 1% nas duas casas. Perde os dois pares de 2º turno para Lula fora de duas margens, por 34% a 45% na Indexa e por 34,5% a 47,7% na CNT/MDA.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Parado em 0,15% no contrato de vencedor, leitura confirmada de 15/Set, 16:37 BRT, abaixo do corte de 0,5%. Nos pares de 2º turno das duas casas do dia ele fica 11 e 13,2 pontos atrás de Lula, as duas distâncias fora de duas margens. O topo da série dele no contrato de vencedor é de 12,00%, em 13/Mai."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0,05%",
    poll: "As duas nacionais de 15/Set não o testam em cenário presidencial de 1º turno. NO PREÇO, ele está em 0,05% no contrato de VENCEDOR, no piso do livro e abaixo do corte de 0,5%.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Parado no piso do livro, 0,05%, leitura confirmada de 15/Set, 16:37 BRT, e ainda assim o contrato dele é um dos de maior volume acumulado do painel presidencial. Preço no piso com volume alto mede interesse passado, não probabilidade de agora."
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
