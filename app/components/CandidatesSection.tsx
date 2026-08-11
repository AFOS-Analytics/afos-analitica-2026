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
    poll: "TRÊS NACIONAIS EM 11/Ago E ELAS DISCORDAM. CNT/MDA (n=2.002, presencial, campo 05 a 08/Ago, margem 2,2pp, BR-06935/2026): 42,4% no 1º turno e 48% x 39% no returno. Futura Inteligência (n=2.000, telefônica, campo 03 a 07/Ago, margem 2,2pp): 38,8% e 46,5% x 44%. Gerp (n=2.400, telefônica, campo 06 a 10/Ago, margem 2pp, BR-08045/2026): EMPATE em 38% x 38% e derrota por 45% x 43%. Nas sete rodadas desde 05/Ago ele vai de 38% a 44%. APROVAÇÃO com 47,3% x 49,9% na Futura e 53% de desaprovação na Gerp. NO PREÇO, PARADO pelo QUARTO pregão em 63,50% (vol USD 8,21M acumulado) na leitura confirmada de 11/Ago, 18:22 BRT.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "O DIA TROUXE TRÊS PESQUISAS E ELAS NÃO CONTAM A MESMA HISTÓRIA. No returno, o resultado vai de nove pontos a favor, na CNT/MDA, a dois pontos contra, na Gerp, passando por 2,5 pontos a favor na Futura. São onze pontos de distância sobre a mesma pergunta, medida na mesma semana. É A PRIMEIRA VEZ NA JANELA QUE UMA NACIONAL O PÕE ATRÁS NAQUELE CENÁRIO. No 1º turno a dispersão é de 9,3 pontos sobre o adversário, entre 28,7% e 38%. NO PREÇO NÃO HOUVE MOVIMENTO: 63,50% pelo quarto pregão seguido, com USD 8,21M acumulados, e o gap FECHOU O DIA em +36,25pp, exatamente o valor de 10/Ago. ⭐ O CRUZAMENTO DO DIA É DE REGIME, E NÃO DE NÍVEL: três institutos abriram onze pontos entre si e o book presidencial fechou onde começou. Os dois instrumentos mediram a mesma semana e um deles está muito mais incerto que o outro, e o painel registra a diferença sem dizer qual está certo. RESSALVA DE SÉRIE: 17 dos 90 dias tiveram preço igual ou maior que 63,50%, com topo de 66,50% em 01/Ago."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "27,25%",
    poll: "O MELHOR E O PIOR DADO DA JANELA SAÍRAM NO MESMO DIA. A Gerp o põe À FRENTE no returno, com 45% contra 43%, primeira vez no período, e a própria divulgação trata a diferença de 2pp como empate técnico. A CNT/MDA o põe nove pontos atrás, com 39% contra 48%. A Futura fica no meio, com 44% contra 46,5%. No 1º turno vai de 28,7% na CNT/MDA a 38% na Gerp, e a amplitude da janela chegou a 11,3pp. REJEIÇÃO de 47,1% na Futura, empate técnico com o líder. NO PREÇO marcou 26,95% às 16:27 e fechou em 27,25% (vol USD 8,12M acumulado) na leitura confirmada de 11/Ago, 18:22 BRT, sem variação contra 10/Ago.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "A AMPLITUDE DELE CRESCEU PARA 11,3pp E É QUASE O DOBRO DA DO LÍDER. Nas sete nacionais desde 05/Ago ele aparece com 28,7%, 30%, 34,1%, 35%, 35%, 38% e 40%, e os 28,7% da CNT/MDA abriram um piso novo na janela. A incerteza de medição está concentrada nele, e escolher uma das três de hoje é escolher a conclusão. O DADO QUE MAIS MUDA A LEITURA É A GERP, primeira nacional do período a pô-lo à frente no returno. Somada à Palver de 10/Ago, são duas rodadas em dois dias em que ele não perde aquele cenário, depois de uma janela inteira de derrotas. NO PREÇO O DIA FOI DE IDA E VOLTA E TERMINOU EM ZERO: marcou 26,95% na leitura confirmada das 16:27 e fechou em 27,25%, onde já estava em 10/Ago. No contrato de 2º lugar está em 80,50%, contra 82,00% ontem. NO TABULEIRO, ele afirmou em 11/Ago que irá aos debates e que não deve explicações sobre o caso Master, gravou propaganda com Michelle Bolsonaro afirmando que Moraes é articulador do adversário, e acenou com o fim da reeleição para atrair partidos. 📌 O slogan da campanha saiu em 10/Ago, e não hoje. RESSALVA DE SÉRIE: 25 dos 90 dias tiveram valor igual ou maior, com topo de 34,40% em 13/Mai e piso de 22,00% em 03/Jul."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "7,75%",
    poll: "A Gerp lhe dá 5% no 1º turno, segundo maior valor da janela, atrás só dos 10% que a Palver mediu pela internet em 10/Ago. Seguem valendo os 4% da Genial/Quaest presencial, os 4,7% da Meio/Ideia e os 4% da BTG/Nexus, todos por telefone ou presencial. A CNT/MDA e a Futura não publicaram o campo completo. NO PREÇO marcou 8,40% às 16:27 e fechou em 7,75% (vol USD 9,44M acumulado) na leitura confirmada de 11/Ago, 18:22 BRT, 0,10pp acima de 10/Ago.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "ELE FOI O ÚNICO NOME A SE MEXER NO DIA, E O MOVIMENTO VOLTOU. Na leitura confirmada das 16:27 marcava 8,40%, alta de 0,75pp sobre 10/Ago; no fechamento, às 18:22, estava em 7,75%, ou seja, 0,10pp acima de ontem. ⚠️ AS DUAS LEITURAS FORAM CONFIRMADAS, cada uma por duas capturas com oito minutos de intervalo, então nenhuma está errada: o dia continuou depois da primeira. O painel publica o fechamento e registra o caminho, porque esconder o caminho faria uma oscilação de 1,4pp parecer um dia parado. NA URNA a Gerp lhe dá 5%, e o intervalo entre métodos segue aberto: de 4% a 5% por telefone e presencial contra 10% pela internet. A ressalva não é deste painel, foi declarada pela própria Palver, que informou testar abordagens para reduzir o efeito do formato digital. O PREÇO CONTINUA ENTRE OS DOIS MÉTODOS. ⚠️ O PAINEL NÃO ATRIBUI NENHUMA DAS DUAS PONTAS DO VAIVÉM À DISCUSSÃO PÚBLICA SOBRE MÉTODO que a imprensa fez em 10 e 11/Ago: não há medição que ligue as duas coisas. Ele segue com o maior volume acumulado do book entre os nomes acima de 1%, e a BBC publicou em 11/Ago reportagem sobre a adesão de parte do mercado financeiro à campanha dele. RESSALVA DE SÉRIE: 78 dos 90 dias tiveram valor igual ou maior, com piso de 6,80% em 06/Ago."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0,05%",
    poll: "Nenhuma das três rodadas de 11/Ago o testa em cenário presidencial. Ele segue sem urna. NO PREÇO caiu 0,10pp, para 0,05% (vol USD 7,01M acumulado), na leitura confirmada de 11/Ago, 18:22 BRT, de volta ao piso depois de um único dia acima dele.",
    position: "Centro-esquerda. Ministro da Fazenda até a desincompatibilização. Foco no maior colégio eleitoral do país.",
    risk: "O AGRAVANTE PERMANECE E PRECISA SER DITO COM CLAREZA: ele NÃO é candidato à Presidência e disputa o governo de São Paulo, então qualquer cenário presidencial que o inclua é hipótese de pesquisa, e não candidatura em curso. Nenhuma das três nacionais de 11/Ago o testa. No preço voltou ao piso de 0,05%, faixa em que variação não tem valor informativo, e é por isso que o painel registra o número sem construir leitura sobre ele. A cobertura de 11/Ago o traz em pesquisa estadual paulista, testando o cenário de São Paulo depois do primeiro debate na Band."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1,05%",
    poll: "A Gerp de hoje lhe dá 4% no 1º turno, mesmo valor da Genial/Quaest de 05/Ago, e a Meio/Ideia segue com 5,7%. A CNT/MDA e a Futura não publicaram o campo completo, então a base de comparação sobre ele encolheu justamente no dia de maior dispersão. Segue valendo o empate de Lula com ele no returno da BTG/Nexus de 10/Ago. NO PREÇO CAIU 0,10pp, para 1,05% (vol USD 5,63M acumulado), na leitura confirmada de 11/Ago, 18:22 BRT.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Candidato oficializado pelo PSD.",
    risk: "O DADO DELE HOJE É UMA AUSÊNCIA, E AUSÊNCIA TAMBÉM É INFORMAÇÃO. Das três nacionais publicadas em 11/Ago, apenas a Gerp divulgou o campo completo, com ele em 4%. As outras duas publicaram só os dois primeiros colocados, e a base de comparação entre casas sobre o pelotão ficou menor no dia em que a dispersão entre institutos foi a maior da janela. NO PREÇO caiu 0,10pp pelo TERCEIRO pregão seguido, para 1,05%. A DISTÂNCIA ENTRE URNA E PREÇO SEGUE SENDO A MAIOR DO PELOTÃO: de 4% a 5,7% de intenção declarada contra 1,05% de probabilidade precificada. O painel registra a distância sem subtrair uma grandeza da outra, porque a urna mede intenção agora e o contrato mede probabilidade de vencer no fim, e a diferença entre elas é o objeto do painel, não um erro a corrigir."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0,35%",
    poll: "A Gerp de hoje lhe dá 2% no 1º turno, e a BTG/Nexus de 10/Ago tinha dado 3%. Seguem valendo os 2% da Genial/Quaest e os 2,6% da Meio/Ideia, de 05/Ago. NO PREÇO CAIU 0,10pp, para 0,35% (vol USD 5,05M acumulado), na leitura confirmada de 11/Ago, 18:22 BRT, afundando mais abaixo do corte de 0,5% que o painel usa para separar preço de ruído.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "A LEITURA SOBRE ELE SEGUE SUSPENSA POR TAMANHO DE PREÇO, e hoje ele afundou mais: cedeu 0,10pp, para 0,35%, quando o corte que o painel usa para separar preço de ruído é 0,5%. Enquanto estiver nessa faixa, a variação não sustenta interpretação. NA URNA a Gerp lhe dá 2%, e ele segue sendo o nome do pelotão com a menor intenção declarada entre os que as casas testam. NO TABULEIRO ele é o único do pelotão com registro de candidatura já apresentado ao TSE, feito em 06/Ago, com R$ 178,7 milhões de patrimônio declarado. O prazo de registro se encerra em 15/Ago, e a partir dali a ausência de registro dos demais passa a ser fato, e não pendência. RESSALVA DE SÉRIE: a janela que este painel confere começa em 13/Mai, então o pico dele de abril fica fora dela."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0,05%",
    poll: "Nenhuma das três rodadas de 11/Ago o testa em cenário presidencial, e o mesmo valia para as de 10 e de 05/Ago. Ausência de teste é informação que o painel registra, em vez de repetir dado antigo como se fosse novo. Ele disputa a REELEIÇÃO no governo de São Paulo, oficializada pelo Republicanos em 01/Ago. NO PREÇO segue em 0,05% (vol USD 13,90M acumulado) na leitura confirmada de 11/Ago, 18:22 BRT.",
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
