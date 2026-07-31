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
    polymarket: "64,50%",
    poll: "Lula fica ESTÁVEL em Poly 63,50% (vol USD 7,77M acumulado) pelo segundo pregão seguido, a 65 dias do 1º turno, e o gap sobre Flávio recua de +39,55pp para +39,20pp por movimento do adversário. A urna do dia é a Vox Brasil (n=2.100, campo 26-28/Jul, margem 2,15pp, BR-01084/2026): 40,5% x 31,2% no 1º turno e 47,5% x 41,1% no returno.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "A SEMANA TEM TRÊS LEITURAS DE GAP E ELAS NÃO CONCORDAM: 9,1pp na AtlasIntel de 29/Jul, 6pp na PoderData de 30/Jul e 9,3pp na Vox de hoje. A fora da curva é a PoderData, não a Vox, e o preço não reagiu a nenhuma das três. Os 6,4pp de vantagem no returno da Vox ficam FORA da margem somada, então esta leitura não descreve empate técnico. Dois nomes do campo dele subiram no mercado hoje, Camilo Santana a 2,20% e Alckmin a 1,10%, no dia do apoio formal do PCdoB à chapa Lula-Alckmin, e o painel registra a coincidência sem afirmar causa."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "24,35%",
    poll: "Flávio SOBE 0,35pp para Poly 24,30% (vol USD 7,76M acumulado) e estreita o gap para +39,20pp. Nos sub-mercados o sinal é cruzado: CAI 1,00pp no 2º lugar do 1º turno, para 78,00%, e CAI 0,60pp no 3º lugar, para 5,65%. Sobe na chance de ganhar e cede nas duas de colocação.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "O DIA DELE FOI DE ARRANJO DE CHAPA, e há três versões do mesmo fato. Ele afirmou que Tereza Cristina aceitou ser vice; a senadora disse que houve conversa e que a decisão depende do PL e do PP-União; e a cúpula do PP avalia que ela aceitou por saber que o partido barraria. O painel registra as três sem escolher. O prazo de 05/Ago está a menos de uma semana. Na urna, a Vox o traz em 31,2% no 1º turno e 41,1% no returno."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "8,15%",
    poll: "Renan CAI 0,30pp para Poly 8,15% (vol USD 8,63M acumulado), mas o movimento do dia é o oposto no book de colocação: SOBE 3,25pp no 2º lugar do 1º turno, de 6,10% para 9,35%, recuperando dois terços do que perdera na véspera, e fica estável em 62,00% no 3º lugar.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "TRÊS INSTITUTOS SEGUIDOS O CORTARAM, e é a sequência que importa: 7,8% na AtlasIntel de 29/Jul, 4% na PoderData de 30/Jul e 3,0% na Vox de hoje. Com preço em 8,15%, a distância entre mercado e urna vai a 5,15pp, a maior do recorte, contra os 0,90pp que este painel registrou em 29/Jul e chamou de convergência. A dispersão deixou de ser dispersão e virou tendência: as três leituras mais recentes são também as três mais baixas. E o mercado contradisse a si mesmo, devolvendo no book de 2º lugar parte do que tirara 24 horas antes."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0,25%",
    poll: "Haddad SOBE 0,15pp para Poly 0,30% e vai a 1,00% no 2º lugar do 1º turno. A Vox Brasil não o testa em nenhum cenário, nem de 1º turno nem de returno, então ele não tem urna nova nesta rodada.",
    position: "Centro-esquerda. Ministro da Fazenda até a desincompatibilização. Foco no maior colégio eleitoral do país.",
    risk: "O agravante de leitura permanece e o painel repete: ele NÃO é candidato à Presidência, disputa o governo de São Paulo, e o cenário que o favorece é hipótese de pesquisa e não candidatura em curso. Ausência de teste numa nacional é informação, e o painel a registra em vez de repetir o dado da véspera como se fosse novo."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1,60%",
    poll: "Caiado CAI 0,80pp para Poly 1,75% (vol USD 5,22M) e DEVOLVE em um pregão toda a alta de dois dias. No 3º lugar do 1º turno ele SOBE 1,00pp, para 26,50%, o que torna o sinal cruzado. Na urna, a Vox lhe dá 5,5%, a melhor leitura nacional dele no recorte.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Candidato oficializado pelo PSD.",
    risk: "A RESSALVA DE SÉRIE DESFAZ A LEITURA DE COLAPSO: 1,75% está dentro da faixa normal dele desde 22/Jul, quando a série do AFOS registrou 1,80%, e os 2,55% de ontem é que eram o desvio. O que se lê é que o mercado o realocou de candidato a vencedor para candidato a terceiro colocado, e que a urna não acompanhou essa realocação: a divergência sobre ele segue aberta em quatro níveis no mesmo mês, 6% na Nexus, 5,5% na Vox, 5% na PoderData e 3,1% na AtlasIntel."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0,35%",
    poll: "Zema CAI 0,10pp para Poly 0,45% (vol USD 4,58M), no terceiro pregão seguido de queda, e fica em 4,45% no 3º lugar do 1º turno. A Vox o traz em 3,2% no 1º turno, praticamente o mesmo dos 3% da PoderData.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "O DIA FOI RUIM NO ARRANJO PARTIDÁRIO. Marcelo Aro deixou a chapa dele ao Senado para disputar o governo de Minas Gerais, movimento que Zema chamou publicamente de traição, e o Novo descartou Barbosa como vice, caminhando para chapa puro-sangue. Segue SEM vice, com o prazo de 05/Ago a menos de uma semana. Ressalva de série, e ela é grande: o máximo dele na série do AFOS é 10,10%, de 26/Abr, então 0,45% é menos de um vigésimo daquele nível."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0,15%",
    poll: "Tarcísio estável a Poly 0,15% no presidencial, com o maior volume acumulado do book nesta captura, USD 13,68M. Não é testado pela Vox Brasil em nenhum cenário presidencial.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "O presidencial dele em 0,15% com o maior volume acumulado do book é a anomalia de legado que serve de lembrete permanente de método: volume mede história negociada e não convicção atual. O contrato acumulou esse valor ao longo de meses em que ele era tratado como candidato provável, e o preço de hoje diz que o mercado não o considera mais na disputa."
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
