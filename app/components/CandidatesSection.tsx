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
    poll: "Lula fica PARADO em Poly 65,50% (vol USD 7,92M acumulado) pelo segundo pregão, a 62 dias do 1º turno, no dia em que a urna apertou. O gap sobre Flávio FECHA 0,90pp e vai a +40,05pp, mas fecha por ALTA do adversário, e não por queda dele. A urna nova é a BTG/Nexus (n=2.002, campo 31/Jul a 02/Ago, telefônica, margem 2pp, BR-02874/2026): 41% x 37% no 1º turno e 46% x 45% no returno, que é empate técnico dentro da margem.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "AS DUAS MEDIÇÕES ANDARAM PARA O MESMO LADO HOJE, o que é raro, e o mecanismo é idêntico nas duas: ele não cedeu e o adversário subiu. Na urna perdeu 1pp no 1º turno e 1pp no returno, quedas DENTRO da margem de 2pp que isoladas não são movimento. No preço ficou exatamente parado. A JANELA PRECISA SER DITA: o topo da série é 66,50%, do fechamento de 01/Ago, e o preço de hoje está 1,00pp abaixo dele; o topo do gap é +41,80pp, da mesma data, e o de hoje está 1,75pp abaixo. Na série diária, o gap não ficava abaixo dos +40,05pp desde 30/Jul, quando marcou +39,50pp. A RESSALVA QUE IMPEDE A LEITURA FÁCIL é a dispersão entre casas: os 4pp da Nexus contrastam com 6pp na PoderData de 30/Jul, 9,1pp na AtlasIntel de 29/Jul e 9,3pp na Vox Brasil de 31/Jul, e a distância entre a mais alta e a mais baixa chega a 5,3pp. Uma casa medindo diferente das outras três não é virada de patamar. As duas nacionais que faltam da janela, Quaest e Ideia/Canal Meio, publicam em 05/Ago. Fora da disputa, a PF pediu ao STF a abertura de um terceiro inquérito contra Lulinha, sob suspeita de tráfico de influência, e o painel registra sem atribuir efeito eleitoral."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "25,45%",
    poll: "Flávio SOBE 0,90pp para Poly 25,45% (vol USD 7,86M acumulado), o movimento mais forte do pregão entre os dois primeiros, e é essa alta que FECHA o gap para +40,05pp, porque Lula ficou parado. Na urna da BTG/Nexus subiu 4pp, para 37% no 1º turno, e foi de 43% para 45% no returno, encostando a 1pp de Lula. Nos sub-mercados fica ESTÁVEL em 80,50% no 2º lugar do 1º turno e em 4,90% no 3º lugar.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "SUBIU NAS DUAS MEDIÇÕES NO MESMO DIA, o que não vinha acontecendo neste painel, e a alta de 4pp na urna é o DOBRO da margem de 2pp, então não se explica por ruído amostral. DUAS RESSALVAS MUDAM A LEITURA. A primeira é de série: o topo dele no mercado é 45,20%, de 07/Mai, e o piso é 22,00%, de 03/Jul, então 25,45% é recuperação DENTRO de um patamar já rebaixado, e chamar isso de retomada seria trocar a régua. A segunda é de dispersão: os 37% são a leitura mais favorável a ele entre as quatro nacionais publicadas desde 29/Jul, e as outras três dão gap de 6pp a 9,3pp no 1º turno, contra 4pp aqui. Ele perde os QUATRO cenários de returno da própria rodada de hoje. Recebeu apoio declarado de Javier Milei, que voltou a atacar Lula publicamente em 02 e 03/Ago, segundo Folha e O Globo. É favorito folgado do contrato de 2º lugar, com 80,50%, o que descreve um returno tratado como quase certo pelo mercado."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "7,45%",
    poll: "Renan CAI 0,50pp para Poly 7,45% (vol USD 8,86M acumulado) e DESFAZ a alta de 0,35pp de ontem, que tinha interrompido nove rodadas de queda. Nos books de colocação, sobe 0,45pp no 2º lugar do 1º turno, para 9,20%, e CAI 3,00pp no 3º lugar, para 60,50%, onde segue favorito isolado. Na urna, a BTG/Nexus deu 4%, contra 5% na rodada de 27/Jul da mesma casa.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "A SEQUÊNCIA DA URNA É O QUE MAIS PESA E ELA JÁ TEM QUATRO LEITURAS: depois dos 7,8% da AtlasIntel de 29/Jul, quatro nacionais seguidas o mediram entre 3% e 4%, com a PoderData em 4%, a Vox Brasil em 3,0% e a Nexus de hoje em 4%. Uma leitura isolada alta contra quatro baixas é o padrão de fora da curva, e o painel registra assim. A distância entre preço e urna fica em 3,45pp, contra 4,95pp ontem, e ela estreitou pelo lado do PREÇO cedendo, não da urna subindo. Ele perde o returno contra Lula por 47% x 37%, a pior das quatro simulações da rodada. O VOLUME SEGUE SENDO A ANOMALIA: com USD 8,86M acumulados, ele tem mais dinheiro negociado que Lula, que tem USD 7,92M, com preço um oitavo do dele. Volume alto com preço em queda descreve posição antiga que ficou aberta, não convicção de agora. Ressalva de série, e ela é grande: o mínimo é 5,30%, de 26/Abr, e o máximo é 17,90%, de 09/Jun."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0,15%",
    poll: "Haddad RECUA 0,15pp para Poly 0,15% (vol USD 6,64M acumulado) e fica em 0,95% no 2º lugar do 1º turno. A BTG/Nexus não o testa em nenhum cenário, nem de 1º turno nem de returno, então ele segue sem urna própria.",
    position: "Centro-esquerda. Ministro da Fazenda até a desincompatibilização. Foco no maior colégio eleitoral do país.",
    risk: "O agravante de leitura permanece e o painel repete: ele NÃO é candidato à Presidência, disputa o governo de São Paulo, e o cenário que o favorece é hipótese de pesquisa e não candidatura em curso. Nesse nível de preço, queda de 0,15pp tem valor informativo quase nulo, e o painel registra o nível, não a oscilação. O volume acumulado dele, USD 6,64M, é maior que o de vários nomes com preço acima do dele, o que mede história negociada e não convicção atual."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1,15%",
    poll: "Caiado fica ESTÁVEL em Poly 1,15% (vol USD 5,30M) e SOBE 0,50pp no 3º lugar do 1º turno, para 25,00%, onde é o segundo nome atrás de Renan Santos. Na urna, a BTG/Nexus dá 5% no 1º turno, contra 6% na rodada de 27/Jul da mesma casa, e 46% x 42% no returno contra Lula.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Candidato oficializado pelo PSD.",
    risk: "FOI OFICIALIZADO CANDIDATO EM CONVENÇÃO HOJE E O MERCADO NÃO REAGIU. No discurso, chamou a resposta institucional aos atos golpistas de maior desastre da história e prometeu anistiar Bolsonaro e os condenados do 8 de Janeiro, segundo o Valor Econômico. No mesmo dia disputou com Flávio o voto do agronegócio, dizendo ser a raiz e não o sabor agro, segundo o G1. O CRUZAMENTO QUE INTERESSA É ESSE: ele foi buscar exatamente o eleitorado em que Flávio subiu 4pp na urna e 0,90pp no preço, e nem a urna nem o mercado registraram ganho para ele. O preço de 1,15% está acima do piso de 0,90% que a série tocou dentro do dia 02/Ago, já registrado também entre 05 e 09/Jul. A divergência entre institutos sobre ele segue aberta em quatro níveis dentro do mesmo mês: 6% na Nexus de 27/Jul, 5,5% na Vox, 5% na Nexus de hoje e na PoderData, e 3,1% na AtlasIntel."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0,25%",
    poll: "Zema fica ESTÁVEL em Poly 0,25% (vol USD 4,66M) e ESTÁVEL em 4,60% no 3º lugar do 1º turno. A BTG/Nexus o traz em 3% no 1º turno, o mesmo da rodada de 27/Jul da mesma casa, e em 46% x 40% no returno contra Lula.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "FOI OFICIALIZADO CANDIDATO EM CONVENÇÃO HOJE, anunciou mudança de Belo Horizonte para São Paulo por causa da campanha, segundo O Globo, e o preço não se moveu nem no dia da própria convenção. Ressalva de série, e ela é grande: o máximo dele é 10,10%, de 26/Abr, então 0,25% é menos de um quarentavo daquele nível e movimentos nessa faixa têm valor informativo quase nulo. O Globo registra ainda que o Novo perde espaço como partido antissistema e vê Renan Santos se contrapor a ele nesse espaço."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0,05%",
    poll: "Tarcísio fica ESTÁVEL em Poly 0,05% no presidencial, com o maior volume acumulado do book nesta captura, USD 13,72M. Não é testado pela BTG/Nexus em nenhum cenário presidencial. Foi oficializado pelo Republicanos em 01/Ago à REELEIÇÃO no governo de São Paulo, e a convenção nacional do partido, que decide aliança presidencial, é em 04/Ago.",
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
