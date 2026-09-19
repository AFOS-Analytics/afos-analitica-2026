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
    poll: "AS DUAS NACIONAIS DE 17/Set SEGUEM SENDO AS MAIS RECENTES, E NENHUMA FOI DIVULGADA EM 18 OU 19/Set: Datafolha (n=2.002, presencial, campo de 15 a 16/Set, margem de 2,0pp, BR-04029/2026) e Futura/100% Cidades (n=2.000, telefone CATI, campo de 11 a 15/Set, margem de 2,2pp, BR-00749/2026). No 1º turno ele lidera as duas, 39% a 36% na Datafolha e 38,3% a 37,7% na Futura, e as duas distâncias cabem em duas margens. No 2º turno as duas se invertem: a Datafolha o dá vencendo por 46% a 44%, pela terceira rodada seguida com o mesmo par, e a Futura o dá perdendo por 43,7% a 48,1%, fora de duas margens.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "CAI 2,00pp E ABRE O VÃO SOZINHO, PORQUE O ADVERSÁRIO SUBIU 0,25pp. O contrato de vencedor está em 40,50% (vol USD 11,41M acumulado), leitura confirmada de 19/Set, 19:20 BRT, contra o preço confirmado em 18/Set, e a distância para Flávio Bolsonaro abriu de 14,00pp para 16,25pp, a maior vantagem dele sobre Lula desde 14/Abr, em 633 leituras gravadas. Os 40,50% ficam 27,00pp abaixo do topo da série dele, de 67,50% em 16/Ago. No contrato de 2º lugar do 1º turno ele cai 4,70pp, para 24,65%, saindo do topo da série dele naquele livro, gravado em 18/Set."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "56,75%",
    poll: "AS DUAS NACIONAIS DE 17/Set SEGUEM SENDO AS MAIS RECENTES, E NENHUMA FOI DIVULGADA EM 18 OU 19/Set: Datafolha (n=2.002, presencial, campo de 15 a 16/Set, margem de 2,0pp, BR-04029/2026) e Futura/100% Cidades (n=2.000, telefone CATI, campo de 11 a 15/Set, margem de 2,2pp, BR-00749/2026). No 1º turno ele sobe de 35% para 36% na Datafolha e tem 37,7% na Futura, a 0,6 ponto de Lula. No 2º turno as duas discordam no sinal: perde por 44% a 46% na Datafolha, dentro das margens, e vence por 48,1% a 43,7% na Futura, fora de duas margens. A rejeição dele é de 47% na Datafolha, empatada com a de Lula, e de 45,3% na Futura.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "SOBE APENAS 0,25pp NO CONTRATO DE VENCEDOR, E MESMO ASSIM O VÃO ABRE. Os 56,75% (vol USD 11,03M acumulado), leitura confirmada de 19/Set, 19:20 BRT, ficam 0,05pp abaixo do maior valor já gravado nas leituras da série dele, numa série que começa em 14/Abr. O vão para o segundo colocado abriu de 14,00pp para 16,25pp, o maior desde o começo da série, porque quem se moveu foi Lula. No contrato de 2º lugar do 1º turno ele sobe 5,00pp, para 74,50%, que é vinte vezes o movimento dele no livro de vencedor."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "0,85%",
    poll: "AS DUAS NACIONAIS DE 17/Set SEGUEM SENDO AS MAIS RECENTES, E NENHUMA FOI DIVULGADA EM 18 OU 19/Set: Datafolha (n=2.002, presencial, campo de 15 a 16/Set, margem de 2,0pp, BR-04029/2026) e Futura/100% Cidades (n=2.000, telefone CATI, campo de 11 a 15/Set, margem de 2,2pp, BR-00749/2026). No 1º turno ele fica atrás de Augusto Cury nas duas, 3% a 6% na Datafolha e 3,4% a 6,5% na Futura. Na Datafolha a rejeição dele é de 15%, a terceira maior da pesquisa. Em 17/Set ele entrou com representação no Tribunal Superior Eleitoral contra o reajuste do Bolsa Família, e o relator sorteado foi André Mendonça.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "OS DOIS CONTRATOS DELE ANDARAM EM SENTIDOS OPOSTOS PELO SEGUNDO DIA. No de vencedor cede 0,10pp, para 0,85% (vol USD 13,78M acumulado), leitura confirmada de 19/Set, 19:20 BRT, a 0,05pp do menor valor das leituras gravadas da série dele. No de 3º lugar do 1º turno sobe 2,00pp, para 51,00%, e abre 14,65pp sobre Augusto Cury, contra 8,00pp em 18/Set. Não é contradição: um mede chegar em terceiro, o outro mede ganhar."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0,05%",
    poll: "As duas nacionais de 17/Set não o testam em cenário presidencial de 1º turno. NO PREÇO, ele está em 0,05% no contrato de VENCEDOR, no piso do livro e abaixo do corte de 0,5% que o painel usa para tratar preço fino como ruído.",
    position: "Centro-esquerda. Ministro da Fazenda até a desincompatibilização. Foco no maior colégio eleitoral do país.",
    risk: "Parado no piso do livro, 0,05%, leitura confirmada de 19/Set, 19:20 BRT. Não é candidato à Presidência: disputa o governo de São Paulo, e por isso não aparece nos cenários presidenciais de 1º turno. O topo da série dele no contrato de vencedor é de 7,60%, medido no backup do banco."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "0,05%",
    poll: "AS DUAS NACIONAIS DE 17/Set SEGUEM SENDO AS MAIS RECENTES, E NENHUMA FOI DIVULGADA EM 18 OU 19/Set: Datafolha (n=2.002, presencial, campo de 15 a 16/Set, margem de 2,0pp, BR-04029/2026) e Futura/100% Cidades (n=2.000, telefone CATI, campo de 11 a 15/Set, margem de 2,2pp, BR-00749/2026). No 1º turno ele é o quarto colocado nas duas, com 4% na Datafolha e 4,5% na Futura. Na Datafolha a rejeição dele é de 13%, menor que a de Renan Santos e a de Romeu Zema. Nenhuma das duas casas o testa em par de 2º turno.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Candidato oficializado pelo PSD.",
    risk: "Está em 0,05% no contrato de vencedor, leitura confirmada de 19/Set, 19:20 BRT, abaixo do menor valor das leituras gravadas da série dele, de 0,10% em 17/Set, e abaixo do corte de 0,5%. No contrato de 3º lugar do 1º turno sobe 1,00pp, para 11,50%, com USD 138 mil acumulados, e é o único dos três nomes de fora do pelotão de frente a ganhar preço nesta rodada."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0,15%",
    poll: "AS DUAS NACIONAIS DE 17/Set SEGUEM SENDO AS MAIS RECENTES, E NENHUMA FOI DIVULGADA EM 18 OU 19/Set: Datafolha (n=2.002, presencial, campo de 15 a 16/Set, margem de 2,0pp, BR-04029/2026) e Futura/100% Cidades (n=2.000, telefone CATI, campo de 11 a 15/Set, margem de 2,2pp, BR-00749/2026). No 1º turno ele tem 2% na Datafolha e 1,0% na Futura, e nenhuma das duas o testa em par de 2º turno. Na Datafolha a rejeição dele é de 14% e na Futura, de 15,9%.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Está em 0,15% no contrato de vencedor, leitura confirmada de 19/Set, 19:20 BRT, acima do piso da série dele, de 0,10% em 17/Set, e ainda abaixo do corte de 0,5%. O topo da série dele naquele contrato é de 12,00%, em 13/Mai, medido no backup do banco. No contrato de 3º lugar do 1º turno fica parado em 0,35%, e ele não se moveu em contrato nenhum nesta rodada."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0,05%",
    poll: "As duas nacionais de 17/Set não o testam em cenário presidencial de 1º turno. NO PREÇO, ele está em 0,05% no contrato de VENCEDOR, no piso do livro e abaixo do corte de 0,5%.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Parado no piso do livro, 0,05%, leitura confirmada de 19/Set, 19:20 BRT, e ainda assim o contrato dele é o de maior volume acumulado do livro presidencial, USD 14,08M contra USD 13,78M do segundo colocado. Preço no piso com volume alto mede interesse passado, não probabilidade de agora."
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
