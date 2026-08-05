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
    poll: "DUAS NACIONAIS PUBLICADAS HOJE, colhidas no mesmo campo, de 31/Jul a 03/Ago, a 60 dias do 1º turno. Genial/Quaest (n=2.004, presencial em 120 municípios, margem 2pp, BR-06591/2026): 39% no 1º turno e 44% x 39% no returno contra Flávio. Meio/Ideia (n=1.500, telefônica, margem 2,5pp, BR-04579/2026): 43% e 48,5% x 43%. Ele vence os OITO cenários de returno das duas somadas. APROVAÇÃO em 48% contra 47% na Quaest. O preço segue sendo o da leitura de 03/Ago, 65,50% (vol USD 7,92M acumulado), porque não há leitura de mercado nova em 04 e 05/Ago.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "AS DUAS CASAS MEDIRAM O MESMO CAMPO E APONTARAM PARA LADOS DIFERENTES PARA ELE, e isso é informação sobre régua, não sobre eleitorado. Na Quaest ele CEDEU, de 40% para 39% no 1º turno e de 45% para 44% no returno, quedas de 1pp dentro da margem de 2pp. Na Ideia ele SUBIU, de 40,4% para 43%. O painel registra as duas sem escolher. O QUE NÃO SE MOVEU FOI A APROVAÇÃO, e o dado é forte pela repetição: a Quaest dá 48% x 47%, os MESMOS 48% x 47% que ela mediu em 15/Jul, e a avaliação da gestão repete a repartição exata de 36% positiva, 26% regular e 36% negativa. A BTG/Nexus de 03/Ago dá o espelho, 47% x 48%, e está em 47% há três rodadas. Duas casas discordam do sinal do saldo, as duas dentro da margem, e nenhuma registra movimento. A JANELA DO PREÇO PRECISA SER DITA: na série diária de 88 dias, de 08/Mai a hoje, o topo dele é 66,50% e o gap máximo é +41,80pp, os dois do fechamento de 01/Ago. REJEIÇÃO em 52% na Quaest, contra 45% que declaram voto, e ela é menor que a do segundo colocado. Fora da disputa, ele se reuniu com Alcolumbre na casa de Moraes depois do rompimento, e aliados admitem desgaste de campanha com as investigações sobre Lulinha e o caso Marcola."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "25,45%",
    poll: "FECHOU CHAPA NO ÚLTIMO DIA DO PRAZO DAS CONVENÇÕES: o vice é Alfredo Gaspar, deputado do PL de Alagoas, relator da CPMI do INSS. Na urna SUBIU dentro das duas casas: 30% na Quaest, contra 28% em 15/Jul, e 35% na Meio/Ideia, contra 32% em 08/Jul. Nos returnos, 39% e 43%, e perde os dois. O gap contra Lula fica em 9pp e 8pp. O preço segue sendo o da leitura de 03/Ago, 25,45% (vol USD 7,86M acumulado), porque não há leitura de mercado nova em 04 e 05/Ago.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "O DIA FOI DE FECHAR A CONTA QUE ESTAVA ABERTA, E ELA FECHOU PELO LADO MAIS ESTREITO. O vice é Alfredo Gaspar, 52 anos, de Maceió, ex-procurador-geral e ex-secretário de Segurança de Alagoas, relator da CPMI do INSS. É CHAPA DE UM PARTIDO SÓ, e chegou a isso depois de Republicanos, PP, Podemos e União Brasil declararem neutralidade, num quadro de sete partidos fora da disputa presidencial. O custo vem junto: com chapa pura ele terá mais de um minuto menos de tempo de TV que Lula. O TAMANHO DA ALTA PRECISA SER EXATO: 2pp na Quaest fica no limite da margem de 2pp e não se separa de ruído com segurança; 3pp na Ideia passa da margem de 2,5pp e é movimento. E A DISPERSÃO ENTRE CASAS RESPONDE A PERGUNTA QUE ESTAVA ABERTA: a BTG/Nexus de 03/Ago mediu gap de 4pp, e com as duas de hoje o quadro das nacionais desde 29/Jul fica em AtlasIntel 9,1pp, PoderData 6pp, Vox Brasil 9,3pp, Nexus 4pp, Quaest 9pp e Ideia 8pp. O patamar de 4pp segue sendo de uma casa só; a direção, essa tem confirmação, porque a Quaest apertou 3pp dentro da própria série. A REJEIÇÃO É O NÚMERO MAIS DURO DELE: 54% não votariam nele, contra 41% que votariam, e é a mais alta entre os dois primeiros colocados, os únicos com rejeição divulgada nesta rodada. Ressalva de série no mercado: na série disponível de 88 dias, o topo dele é 44,30%, de 08/Mai, e o piso é 22,00%, de 03/Jul."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "7,45%",
    poll: "SUBIU NAS DUAS CASAS dentro da própria série: 4% na Quaest, contra 3% em 15/Jul, e 4,7% na Meio/Ideia, contra 2% em 08/Jul. Na Ideia ele passa à frente de Zema, que tem 2,6%, e fica atrás só de Caiado, com 5,7%. Nos returnos é o pior colocado das duas rodadas: perde para Lula por 45% x 35% e por 48% x 34,7%. O preço segue sendo o da leitura de 03/Ago, 7,45% (vol USD 8,86M acumulado), porque não há leitura de mercado nova em 04 e 05/Ago.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "A SEQUÊNCIA DA URNA É O QUE MAIS PESA E ELA JÁ TEM SEIS LEITURAS: depois dos 7,8% da AtlasIntel de 29/Jul, seis nacionais seguidas o mediram entre 3% e 4,7%, incluindo as duas de hoje. Uma leitura isolada alta contra seis na faixa baixa é o padrão de fora da curva, e o painel registra assim em vez de tratar a exceção como cenário. É JUSTO DIZER TAMBÉM O QUE MELHOROU: é a primeira vez neste recorte que as duas casas o movem para cima no mesmo campo. A distância entre o preço de 7,45% e a urna de hoje fica entre 2,75pp e 3,45pp, e ela é do lado do PREÇO, não da urna. NO DISCURSO, fez nesta quarta a declaração mais dura da campanha dele: disse que, se eleito, não cumprirá decisões monocráticas do STF, que vai compor com o Centrão e chamou parlamentares de parasitas, o que tensiona o próprio discurso antissistema. O VOLUME SEGUE SENDO A ANOMALIA: com USD 8,86M acumulados, ele tem mais dinheiro negociado que Lula, que tem USD 7,92M, com preço um oitavo do dele. Volume mede história negociada, não convicção atual. Ressalva de série, e ela é grande: o mínimo é 5,30%, de 26/Abr, e o máximo é 17,90%, de 09/Jun."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0,15%",
    poll: "NENHUMA das duas nacionais de hoje o testa, em nenhum cenário, nem de 1º turno nem de returno, então ele segue sem urna própria. Ausência de teste em duas rodadas no mesmo dia é informação que o painel registra, em vez de repetir dado antigo como se fosse novo. O preço segue sendo o da leitura de 03/Ago, 0,15% (vol USD 6,64M acumulado), porque não há leitura de mercado nova em 04 e 05/Ago.",
    position: "Centro-esquerda. Ministro da Fazenda até a desincompatibilização. Foco no maior colégio eleitoral do país.",
    risk: "O agravante de leitura permanece e o painel repete: ele NÃO é candidato à Presidência, disputa o governo de São Paulo, e qualquer cenário que o inclua é hipótese de pesquisa e não candidatura em curso. Nesse nível de preço, o painel registra o nível e não a oscilação, porque variações de centésimos ali têm valor informativo quase nulo. O volume acumulado dele, USD 6,64M, é maior que o de vários nomes com preço acima do dele, o que mede história negociada e não convicção atual."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1,15%",
    poll: "É O NOME MAIS VOTADO DO PELOTÃO NAS DUAS NACIONAIS DE HOJE: 5,7% na Meio/Ideia, contra 4% em 08/Jul da mesma casa, e 4% na Quaest, o mesmo de 15/Jul. Nos returnos tem 40% contra 48,5% de Lula na Ideia, a MENOR distância entre os quatro adversários testados naquela rodada, e 37% contra 45% na Quaest. O preço segue sendo o da leitura de 03/Ago, 1,15% (vol USD 5,30M), porque não há leitura de mercado nova em 04 e 05/Ago.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Candidato oficializado pelo PSD.",
    risk: "A DIVERGÊNCIA ENTRE INSTITUTOS SOBRE ELE É O DADO MAIS INTERESSANTE DO PELOTÃO, E HOJE ELA FICOU EXPOSTA NO MESMO CAMPO: 4% numa casa e 5,7% na outra, com as duas colhendo de 31/Jul a 03/Ago. No mês inteiro o leque vai de 3,1% na AtlasIntel a 6% na Nexus de 27/Jul. Duas réguas medindo a mesma semana e chegando a números que diferem em 1,7pp é exatamente o tipo de coisa que este painel existe para registrar, em vez de escolher uma e chamar de verdade. No discurso, ironizou Lula e Flávio nesta quarta dizendo que os dois estão mais preocupados em salvar a família do que o país, que é posicionamento de terceira via em estado puro. O CRUZAMENTO QUE INTERESSA CONTINUA ABERTO: a promessa de anistiar Bolsonaro e os condenados do 8 de Janeiro o põe a disputar o mesmo eleitorado de Flávio, que fechou chapa hoje e subiu nas duas casas, e ele não registrou ganho equivalente em nenhuma das duas. Era o segundo nome do contrato de 3º lugar do 1º turno, com 25,00% na leitura de 03/Ago."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0,25%",
    poll: "PARADO NA URNA NAS DUAS CASAS: 2% na Quaest, o mesmo de 15/Jul, e 2,6% na Meio/Ideia, praticamente os 2,5% de 08/Jul. Nos returnos é o adversário que Lula bate com MAIS FOLGA na Quaest, por 46% x 34%, e perde por 48,5% x 37% na Ideia. É o ÚNICO da terceira via com chapa fechada, desde 04/Ago, com o senador Eduardo Girão, do Novo. O preço segue sendo o da leitura de 03/Ago, 0,25% (vol USD 4,66M), porque não há leitura de mercado nova em 04 e 05/Ago.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "RESOLVEU A VICE ANTES DOS OUTROS DOIS E DENTRO DO PRÓPRIO PARTIDO, em 04/Ago, com o senador Eduardo Girão, sem depender de aliança. Isso o deixa como o único nome da terceira via com chapa completa quando o prazo das convenções se encerrou. O QUE NÃO MUDOU FOI A URNA: ele não se move há um mês em nenhuma das duas casas, e segue sendo o adversário mais confortável para Lula entre os testados na Quaest. Ressalva de série, e ela é grande: o máximo dele é 10,10%, de 26/Abr, então 0,25% é uma fração pequena daquele nível e movimentos nessa faixa têm valor informativo quase nulo. O Globo registra ainda que o Novo perde espaço como partido antissistema e vê Renan Santos se contrapor a ele nesse espaço, e hoje a Meio/Ideia mediu Renan Santos à frente dele, com 4,7% contra 2,6%."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0,05%",
    poll: "NENHUMA das duas nacionais de hoje o testa em qualquer cenário presidencial, de 1º turno ou de returno. Ele disputa a REELEIÇÃO no governo de São Paulo, oficializada pelo Republicanos em 01/Ago, e o partido declarou neutralidade na disputa presidencial. O preço segue sendo o da leitura de 03/Ago, 0,05% no presidencial, com o maior volume acumulado do book, USD 13,70M, porque não há leitura de mercado nova em 04 e 05/Ago.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "O presidencial dele em 0,05% com o maior volume acumulado do book é a anomalia de legado que serve de lembrete permanente de método: volume mede história negociada e não convicção atual. O contrato acumulou esse valor ao longo de meses em que ele era tratado como candidato provável, e o preço diz que o mercado não o considera mais na disputa. O painel registra o nível e NÃO o compara com a história dele, e a razão é de coleta: a série do AFOS tem apenas três dias para esse nome, entre 28/Abr e 14/Mai, e não sustenta afirmação de extremo."
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
