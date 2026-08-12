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
    polymarket: "63,50%",
    poll: "SEM PESQUISA NACIONAL NOVA EM 12/Ago. Seguem em vigor as três de 11/Ago: CNT/MDA (n=2.002, presencial, BR-06935/2026) com 42,4% no 1º turno e 48% x 39% no returno; Futura Inteligência (n=2.000, telefônica, BR-08109/2026) com 38,8% e 46,5% x 44%; e Gerp (n=2.400, telefônica, BR-08045/2026) com empate em 38% e derrota por 45% x 43%. NO PREÇO, o QUARTO dia seguido em 63,50% (vol USD 8,22M acumulado) na leitura confirmada de 12/Ago, 16:41 BRT.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "O DIA NÃO TROUXE PESQUISA NOVA, e no preço ele não se moveu pelo quarto dia seguido, desde 09/Ago. O gap caiu 0,40pp, para 35,85pp, e a queda veio inteira da ponta do adversário. ⭐ O QUE MUDOU FOI EM OUTRO CONTRATO: o de quem termina em 2º lugar no 1º turno teve a maior variação do dia, com o adversário subindo 3,50pp, enquanto o de quem vence mal andou. São perguntas diferentes e o painel não as soma. RESSALVA DE SÉRIE: 17 dos 88 dias tiveram preço igual ou maior que 63,50%, com topo de 66,50% em 01/Ago."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "27,65%",
    poll: "SEM PESQUISA NOVA EM 12/Ago. Seguem os 28,7% da CNT/MDA, os 34,1% da Futura e os 38% da Gerp no 1º turno, com a Gerp o pondo à frente no returno por 45% x 43%, a CNT/MDA nove pontos atrás e a Futura no meio. NO PREÇO subiu 0,40pp, para 27,65% (vol USD 8,13M acumulado) na leitura confirmada de 12/Ago, 16:41 BRT.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "O MOVIMENTO DELE HOJE FOI DE POSIÇÃO, NÃO DE VITÓRIA. No presidencial subiu 0,40pp, para 27,65%. ⭐ No contrato de quem termina em 2º lugar no 1º turno subiu 3,50pp, de 80,50% para 84,00%, e essa foi a MAIOR variação do dia em qualquer book acompanhado. Vencer a eleição e chegar ao returno são perguntas distintas. NO TABULEIRO, o Estadão informou que Tereza Cristina se reuniu com a equipe dele para avaliar participação na campanha, e que ele busca lideranças de partidos neutros para montar um palanque feminino, já que a vice não é mulher. RESSALVA DE SÉRIE: 22 dos 88 dias tiveram valor igual ou maior, com topo de 33,20% em 02/Jun e piso de 22,00% em 02/Jul."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "7,45%",
    poll: "SEM PESQUISA NOVA EM 12/Ago. Seguem os 5% da Gerp, os 4% da Genial/Quaest e da BTG/Nexus, os 4,7% da Meio/Ideia e os 10% da Palver pela internet. NO PREÇO caiu 0,30pp, para 7,45% (vol USD 9,48M acumulado) na leitura confirmada de 12/Ago, 16:41 BRT.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "CEDEU NOS DOIS CONTRATOS em que aparece, e pouco nos dois: 0,30pp no presidencial e 1,50pp no de 3º lugar do 1º turno, para 62,50%. O EFEITO DE MÉTODO SEGUE SENDO A LEITURA sobre ele, com o mesmo nome indo de 4% a 10% conforme o ambiente da entrevista, e a ressalva foi declarada pela própria Palver. O preço continua ENTRE os dois métodos. Ele mantém o maior volume acumulado do book entre os nomes acima de 1%. RESSALVA DE SÉRIE: mais de 80 dos 88 dias tiveram valor igual ou maior, com piso de 6,80% em 06/Ago."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0,15%",
    poll: "Nenhuma das três rodadas de 11/Ago o testa em cenário presidencial. Ele segue sem urna. NO PREÇO caiu 0,10pp, para 0,05% (vol USD 7,01M acumulado), na leitura confirmada de 12/Ago, 16:41 BRT, de volta ao piso depois de um único dia acima dele.",
    position: "Centro-esquerda. Ministro da Fazenda até a desincompatibilização. Foco no maior colégio eleitoral do país.",
    risk: "O AGRAVANTE PERMANECE E PRECISA SER DITO COM CLAREZA: ele NÃO é candidato à Presidência e disputa o governo de São Paulo, então qualquer cenário presidencial que o inclua é hipótese de pesquisa, e não candidatura em curso. Nenhuma das três nacionais de 11/Ago o testa. No preço voltou ao piso de 0,05%, faixa em que variação não tem valor informativo, e é por isso que o painel registra o número sem construir leitura sobre ele. A cobertura de 11/Ago o traz em pesquisa estadual paulista, testando o cenário de São Paulo depois do primeiro debate na Band."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "0,95%",
    poll: "SEM PESQUISA NOVA EM 12/Ago. Seguem os 4% da Gerp e da Genial/Quaest, os 5,7% da Meio/Ideia e os 5% da BTG/Nexus. NO PREÇO caiu 0,10pp, para 0,95% (vol USD 5,66M acumulado) na leitura confirmada de 12/Ago, 16:41 BRT, e no contrato de 3º lugar do 1º turno SUBIU 2,00pp, para 31,50%.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Candidato oficializado pelo PSD.",
    risk: "⭐ O CRUZAMENTO DELE APONTA PARA DOIS LADOS NO MESMO DIA. No contrato de vitória caiu 0,10pp e ficou ABAIXO de 1%, a 0,05pp do piso da série, que é 0,90% de 07/Jul. No de 3º lugar do 1º turno subiu 2,00pp, para 31,50%. O mercado baixou a chance de ele vencer e levantou a de ele terminar em terceiro, e as duas coisas podem ser verdadeiras ao mesmo tempo. A DISTÂNCIA ENTRE URNA E PREÇO SEGUE SENDO A MAIOR DO PELOTÃO: de 4% a 5,7% declarados contra 0,95% precificado. ⚠️ E vale registrar que Jair Bolsonaro, inelegível, é precificado em 1,20%, acima dele."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0,35%",
    poll: "A Gerp de hoje lhe dá 2% no 1º turno, e a BTG/Nexus de 10/Ago tinha dado 3%. Seguem valendo os 2% da Genial/Quaest e os 2,6% da Meio/Ideia, de 05/Ago. NO PREÇO CAIU 0,10pp, para 0,35% (vol USD 5,05M acumulado), na leitura confirmada de 12/Ago, 16:41 BRT, afundando mais abaixo do corte de 0,5% que o painel usa para separar preço de ruído.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "A LEITURA SOBRE ELE SEGUE SUSPENSA POR TAMANHO DE PREÇO, e hoje ele afundou mais: cedeu 0,10pp, para 0,35%, quando o corte que o painel usa para separar preço de ruído é 0,5%. Enquanto estiver nessa faixa, a variação não sustenta interpretação. NA URNA a Gerp lhe dá 2%, e ele segue sendo o nome do pelotão com a menor intenção declarada entre os que as casas testam. NO TABULEIRO ele é o único do pelotão com registro de candidatura já apresentado ao TSE, feito em 06/Ago, com R$ 178,7 milhões de patrimônio declarado. O prazo de registro se encerra em 15/Ago, e a partir dali a ausência de registro dos demais passa a ser fato, e não pendência. RESSALVA DE SÉRIE: a janela que este painel confere começa em 13/Mai, então o pico dele de abril fica fora dela."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0,05%",
    poll: "Nenhuma das três rodadas de 11/Ago o testa em cenário presidencial, e o mesmo valia para as de 10 e de 05/Ago. Ausência de teste é informação que o painel registra, em vez de repetir dado antigo como se fosse novo. Ele disputa a REELEIÇÃO no governo de São Paulo, oficializada pelo Republicanos em 01/Ago. NO PREÇO segue em 0,05% (vol USD 13,90M acumulado) na leitura confirmada de 12/Ago, 16:41 BRT.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "O CONTRASTE DELE SEGUE SENDO O MAIS EXTREMO DO BOOK: com USD 13,90M acumulados, este é o MAIOR volume de todo o mercado presidencial, e o preço está no piso, em 0,05%. Volume alto com probabilidade no piso não é movimento, é convicção já precificada: muito dinheiro passou por ali para chegar à conclusão de que ele não disputa. Variações nesta faixa têm valor informativo quase nulo. Ele disputa a reeleição em São Paulo, e a cobertura de 11/Ago traz pesquisa estadual testando aquele cenário depois do primeiro debate na Band. Nenhuma nacional da janela o testa no cenário presidencial."
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
