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
    polymarket: "65,50%",
    poll: "Lula fica ESTÁVEL em Poly 65,50% (vol USD 7,90M acumulado), a 63 dias do 1º turno, no dia em que o PT oficializou a candidatura dele em convenção nacional em São Paulo, com Alckmin de vice. O gap sobre Flávio ABRE para +40,95pp, mas abre por queda do adversário, e não por alta dele. A urna nacional segue sendo a Vox Brasil (n=2.100, campo 26-28/Jul, margem 2,15pp, BR-01084/2026): 40,5% x 31,2% no 1º turno e 47,5% x 41,1% no returno.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "O TOPO DA SÉRIE FICOU PARA TRÁS E ISSO PRECISA SER DITO COM A JANELA CERTA: o máximo é 66,50%, do fechamento de 01/Ago, e o preço de hoje está 1,00pp abaixo dele. A série do AFOS cobre de 14/Abr a hoje, 108 dias. Contra a captura publicada ontem, de 65,50%, o preço não se moveu. Nenhuma urna nacional foi publicada desde a Vox de 31/Jul, e quatro nacionais estão com campo aberto agora, com publicação declarada entre 03 e 05/Ago. Na convenção, Lula disse que não quer ser presidente do Bolsa Família e prometeu disputar emendas com o Congresso, e Tebet chamou Flávio de golpista do palanque. Ele também pediu voto antes do prazo legal, que só abre em 16/Ago, e Flávio fez o mesmo no mesmo dia."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "24,55%",
    poll: "Flávio CAI 0,20pp para Poly 24,55% (vol USD 7,82M acumulado), interrompendo seis pregões sem queda, e é essa queda que ABRE o gap para +40,95pp, porque Lula ficou parado. Nos sub-mercados o sinal é o inverso: SOBE 1,00pp no 2º lugar do 1º turno, para 80,50%, a maior marca dele naquele contrato no acompanhamento do painel, e fica praticamente parado no 3º lugar, em 4,90%.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "CEDE NA CHANCE DE GANHAR E SOBE NA DE CHEGAR AO RETURNO, no mesmo pregão, e o painel registra os dois sem escolher qual vale mais. Segue SEM vice a três dias do prazo de 05/Ago. O Valor e a Acesse Política registram que ele e Lula chegaram à reta final das convenções sem ampliar alianças, com o Centrão ainda neutro, e a convenção nacional do Republicanos, que trata de aliança presidencial, é em 04/Ago. Na convenção do PL em Santa Catarina ele pediu voto antes do prazo legal, que abre em 16/Ago, e usou um novo vídeo com Jair Bolsonaro depois de ser questionado por Moraes sobre o vídeo anterior, gerado por inteligência artificial. Na urna, a Vox o traz em 31,2% no 1º turno e 41,1% no returno."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "7,95%",
    poll: "Renan SOBE 0,35pp para Poly 7,95% (vol USD 8,82M acumulado) e INTERROMPE a sequência de queda que durava nove rodadas, no mesmo dia em que o Missão oficializou a candidatura dele em São Paulo. Sobe também nos dois books de colocação: 0,20pp no 2º lugar do 1º turno, para 8,75%, e 2,00pp no 3º lugar, para 63,50%, onde é o favorito isolado.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "A VIRADA DE HOJE NÃO DESFAZ O ARCO: ele saiu de 12,00% em 23/Jul e tocou 7,10% no fechamento de 01/Ago, que é o piso desse arco, e o de hoje é o primeiro pregão de alta em dez. NÃO é mínimo de série, e a janela precisa ser dita: o mínimo é 5,30%, de 26/Abr, e o máximo é 17,90%, de 09/Jun. Na urna, três institutos seguidos o cortaram, 7,8% na AtlasIntel de 29/Jul, 4% na PoderData de 30/Jul e 3,0% na Vox de 31/Jul, e não houve leitura nova desde então. Com o preço subindo e a urna parada, a distância entre mercado e urna VOLTOU A ABRIR, de 4,60pp para 4,95pp. No lançamento, ele atacou Lula e Flávio, chamou Moro de vassalo, disse que vai tirar Flávio do returno e prometeu matar quem roubar. O painel registra a coincidência de datas entre a convenção e a alta, e não afirma que uma causou a outra."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0,30%",
    poll: "Haddad SOBE 0,05pp para Poly 0,30% (vol USD 6,63M acumulado) e fica em 1,05% no 2º lugar do 1º turno. A Vox Brasil não o testa em nenhum cenário, nem de 1º turno nem de returno, e nenhuma nacional foi publicada desde então, então ele segue sem urna nova.",
    position: "Centro-esquerda. Ministro da Fazenda até a desincompatibilização. Foco no maior colégio eleitoral do país.",
    risk: "O agravante de leitura permanece e o painel repete: ele NÃO é candidato à Presidência, disputa o governo de São Paulo, e o cenário que o favorece é hipótese de pesquisa e não candidatura em curso. Nesse nível de preço, alta de 0,05pp tem valor informativo quase nulo, e o painel registra o nível, não a oscilação. O volume acumulado dele, USD 6,63M, é maior que o de vários nomes com preço acima do dele, o que mede história negociada e não convicção atual."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1,15%",
    poll: "Caiado CAI 0,20pp para Poly 1,15% (vol USD 5,27M) no quarto pregão seguido de queda, e ao mesmo tempo SOBE 2,00pp no 3º lugar do 1º turno, para 24,50%, recuperando a queda da véspera. Na urna, a Vox lhe dá 5,5%, a melhor leitura nacional dele no recorte, e não houve nacional nova desde então.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Candidato oficializado pelo PSD.",
    risk: "HOJE ELE TOCOU O PISO DA SÉRIE e depois se recuperou dentro do próprio dia, e as duas coisas são do mesmo 02/Ago: a coleta das 11:30 UTC gravou 0,90%, que iguala o menor valor desde 14/Abr, já registrado entre 05 e 09/Jul, e a captura travada das 19:42 UTC traz 1,15%. O painel publica a captura travada e registra o piso intradiário em vez de escolher um dos dois. O mercado segue realocando ele de candidato a vencedor para candidato a terceiro colocado, e a urna não acompanha: a divergência entre institutos sobre ele continua aberta em quatro níveis dentro do mesmo mês, 6% na Nexus, 5,5% na Vox, 5% na PoderData e 3,1% na AtlasIntel."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0,25%",
    poll: "Zema CAI 0,10pp para Poly 0,25% (vol USD 4,64M) e fica ESTÁVEL em 4,60% no 3º lugar do 1º turno. A Vox o traz em 3,2% no 1º turno, praticamente o mesmo dos 3% da PoderData, e não houve nacional nova desde então.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Segue SEM vice, com o prazo de 05/Ago a três dias, depois de o Novo descartar Barbosa para a vaga e de Marcelo Aro deixar a chapa dele ao Senado, movimento que Zema chamou publicamente de traição. Ressalva de série, e ela é grande: o máximo dele é 10,10%, de 26/Abr, então 0,25% é menos de um quarentavo daquele nível e movimentos nessa faixa têm valor informativo quase nulo. Ressalva de coleta, e ela é do painel, não do mercado: a série do AFOS para esse nome NÃO tem ponto depois de 30/Jul, então o preço de hoje entra pela captura travada e sem comparação com fechamento de série."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0,05%",
    poll: "Tarcísio fica ESTÁVEL em Poly 0,05% no presidencial, com o maior volume acumulado do book nesta captura, USD 13,70M. Não é testado pela Vox Brasil em nenhum cenário presidencial. Foi oficializado pelo Republicanos em 01/Ago à REELEIÇÃO no governo de São Paulo, e a convenção nacional do partido, que decide aliança presidencial, é em 04/Ago.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "O presidencial dele em 0,05% com o maior volume acumulado do book é a anomalia de legado que serve de lembrete permanente de método: volume mede história negociada e não convicção atual. O contrato acumulou esse valor ao longo de meses em que ele era tratado como candidato provável, e o preço de hoje diz que o mercado não o considera mais na disputa. NENHUM superlativo é afirmado sobre ele, e a razão é de coleta: a série do AFOS tem apenas três dias para esse nome, entre 28/Abr e 14/Mai, e não sustenta dizer que este é o menor valor dele."
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
