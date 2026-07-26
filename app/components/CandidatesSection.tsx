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
    polymarket: "62,50%",
    poll: "Lula SEGURA o topo da série: Poly 62,50% (estável, vol USD 7,65M acumulado), a 70 dias do 1º turno, sem variação nenhuma no domingo e no mesmo patamar que alcançou em 25/Jul. O gap sobre Flávio recuou para +38,85pp, abaixo do pico de +39,65pp da véspera, ou seja, o topo do gap durou um pregão. Não houve urna nova: a Datafolha de 24/Jul (n=2.004, campo 22 a 24/Jul, margem 2pp, BR-01166/2026) segue sendo a referência, com 40% no 1º turno e 48% no returno direto contra 43% de Flávio, vencendo também Caiado (47x40) e Zema (48x40). Aprovação pessoal 49% x 48%, gestão 32% ótimo ou bom contra 38% ruim ou péssimo. O patamar entra em teste imediato: quatro nacionais têm publicação declarada ao TSE entre 27 e 31 de julho.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTOS 26/Jul: o governo convocou o embaixador brasileiro na Argentina para consultas depois de Javier Milei ter chamado Alexandre de Moraes de lixo careca em palanque no Brasil (Folha de S.Paulo). Antes disso, no sábado, o presidente do STF, Edson Fachin, já havia respondido em público que a fala é incompatível com a civilidade, e o governo americano negou ter intenção de minar as eleições brasileiras, respondendo à recusa de vistos pelo Itamaraty. No mercado, nada disso teve contrapartida: ele ficou EXATAMENTE parado em 62,50%, e todo o movimento do book aconteceu entre Flávio, que subiu 0,80pp, e Renan Santos, que caiu exatamente 0,80pp. Movimento de mesmo tamanho e sinal contrário entre dois nomes do mesmo campo, com o favorito imóvel, descreve disputa DENTRO de um campo e não transferência entre campos. STF impeach 3,40% (queda 0,10pp). Volume no presidencial em USD 115,95M."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "23,65%",
    poll: "Flávio RECUPERA um dia depois: Poly 23,65% (alta 0,80pp, vol USD 7,67M acumulado), a maior alta do book, afastando-se do piso de 22,00% que a série registra em 03/Jul. Sobe também 1,50pp no 2º lugar do 1º turno, para 78,00%, num book de USD 4,27M. O detalhe que importa é a origem do ganho: Renan Santos caiu exatamente 0,80pp no mesmo pregão e Lula não se moveu, o que descreve realocação dentro do campo e não avanço sobre o favorito. Sem urna nova posterior à convenção do PL. A Datafolha de 24/Jul o põe em 32% no 1º turno e 43% no returno, com rejeição de 48%, idêntica à de junho e a MAIS ALTA entre todos os nomes testados.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 26/Jul: a alta dele veio um dia DEPOIS da convenção de lançamento, não no dia dela, o que enfraquece qualquer leitura de que o mercado tenha lido o evento como ganho. O entorno recuou no mesmo pregão em que ele subiu: Jair caiu 0,20pp para 1,05% e Michelle caiu 0,40pp para 0,75%, saindo da casa de 1%. E todo o pelotão cedeu preço no dia em que o PSD oficializou Caiado, com o dinheiro aparecendo concentrado num nome só, que foi ele. O que o dado descreve é consolidação do campo não governista, não avanço sobre Lula, que ficou imóvel. Segue sem vice definida depois da recusa de Tereza Cristina, cujo preço no book presidencial continua em 0,15%, com as convenções correndo até 05/Ago. A federação União Progressista permanece neutra desde 22/Jul."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "9,55%",
    poll: "Renan CAI pelo segundo pregão: Poly 9,55% no vencedor (queda 0,80pp, vol USD 8,53M acumulado), saindo de 11,75% para 9,55% em dois dias e perdendo a casa dos 10%. A queda de hoje tem contrapartida EXATA na alta de Flávio, com Lula imóvel, o que descreve um mercado escolhendo outro nome dentro do mesmo campo. Cede 1,50pp no 3º lugar do 1º turno, indo a 64,50%, e sobe 0,10pp no 2º lugar, para 11,85%. Sem urna nova: a Datafolha de 24/Jul o mede em 3% no 1º turno, e três das quatro nacionais recentes o põem nesse patamar, isolando os 9% da Real Time. Rejeição de 12%, um quarto da de Flávio. Tem o maior volume acumulado entre os nomes competitivos do book.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "26/Jul: dois pregões seguidos de perda, e o de hoje tem origem identificável. Flávio subiu exatamente 0,80pp no mesmo intervalo em que ele caiu 0,80pp, e o favorito não se moveu, o que descarta a leitura de encolhimento do campo contra Lula. Circulou no fim de semana a avaliação de que o PT enxerga Renan como ameaça direta a Flávio e não a Lula: o AFOS registra a coincidência de enquadramento e NÃO afirma que uma coisa causou a outra. RESSALVA DE SÉRIE, medida na base inteira: 9,55% não é máximo nem mínimo dele. O pico foi 17,90% em 09/Jun e o piso é 5,30% em 26/Abr. A comparação entre 9,55% e 3% segue sendo entre grandezas diferentes, probabilidade de vitória contra intenção de voto, o que pede cautela em qualquer leitura de erro. STF impeach 3,40%."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0,35%",
    poll: "Haddad DEVOLVE a alta da véspera: Poly 0,35% (queda 0,30pp, vol USD 6,36M acumulado), saindo da casa de meio ponto. Segue sendo nome residual sem lastro de urna no cargo presidencial: não aparece nos cenários presidenciais das nacionais, incluindo a Datafolha de 24/Jul, e nenhuma pesquisa o testa para presidente. O foco é a disputa estadual de São Paulo, cuja chapa foi oficializada em convenção do PT em Campinas em 25/Jul, com Márcio França (PSB) de vice e presença de Lula. Disputa estadual não entra neste painel, que é de escopo nacional.",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "26/Jul: devolveu inteiramente a alta de 0,30pp da véspera e voltou para 0,35%. A leitura de ontem já registrava que aquela alta coincidia com uma convenção ESTADUAL e que o cargo precificado neste book é outro, e a devolução no dia seguinte é consistente com isso: era ruído de evento, não reprecificação. Ele foi um dos cinco nomes do pelotão a recuar no mesmo pregão, junto com Caiado, Jair, Michelle e Zema, num dia em que o dinheiro apareceu concentrado em Flávio. STF impeach 3,40%."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1,75%",
    poll: "Caiado é OFICIALIZADO e o preço cai: Poly 1,75% (queda 0,15pp, vol USD 5,14M acumulado) no próprio dia da convenção nacional do PSD que o lançou candidato à Presidência, com Gilberto Kassab de vice e chapa pura do partido. Cede também 0,50pp no 3º lugar do 1º turno, indo a 15,50%. Sem urna nova: a Datafolha de 24/Jul o dá com 4% no 1º turno, o melhor do pelotão, e o mostra perdendo o returno para Lula por 47% a 40%, margem MAIOR que os 5pp de Flávio, o que contraria a tese de que um nome do centro seria adversário mais competitivo. A rejeição de 12% é das mais baixas do páreo e indica espaço de crescimento.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Candidato oficializado pelo PSD.",
    risk: "EVENTOS 26/Jul: a convenção nacional do PSD oficializou a chapa Caiado e Kassab, sem depender de federação, e no primeiro discurso como candidato ele atacou os dois primeiros colocados ao mesmo tempo, dizendo que Lula provoca Trump e que Flávio ataca autoridades (Folha de S.Paulo, G1, Times Brasil). O mercado respondeu com queda de 0,15pp. É o SEGUNDO lançamento seguido do calendário em que o candidato oficializado termina o pregão em queda, depois de Flávio ter caído 0,10pp no dia da própria convenção. Duas ocorrências não fazem padrão e a causa não é afirmada em nenhuma delas: são books pequenos e capturas de um instante. Vale acompanhar nas convenções que faltam, até 05/Ago. O contraste com o preço persiste: mede 4% de voto declarado e vale 1,75% no vencedor. STF impeach 3,40%."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0,65%",
    poll: "Zema recua pelo terceiro pregão em quatro: Poly 0,65% (queda 0,10pp, vol USD 4,53M), o menor patamar dele desde o salto de 24/Jul, e marca 4,75% no 3º lugar do 1º turno. Sem urna nova: a Datafolha de 24/Jul o mede em 3% no 1º turno e o mostra perdendo o returno para Lula por 48% a 40%, a maior margem entre os três cenários de 2º turno testados. A rejeição de 13% é baixa para o padrão do páreo, ainda que a mais alta do pelotão. Vinha marcando 3% na Gerp 22/Jul e na Indexa 21/Jul, 3,7% na Futura/Apex 14/Jul e 4% na BTG/Nexus 13/Jul. Segue sem vice definido.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "26/Jul: caiu junto com todo o pelotão no dia em que o PSD oficializou Caiado, e agora tem um concorrente direto no mesmo espaço já formalizado, enquanto ele próprio segue sem vice e sem convenção, com o calendário correndo até 05/Ago. O descolamento entre preço e voto declarado aqui é de direção oposta à de Renan Santos: ele mede pouco na urna e vale pouco no book, o que é coerência e não distorção. Michelle Bolsonaro já havia descartado publicamente ser vice dele. STF impeach 3,40%."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0,15%",
    poll: "Tarcísio estável a Poly 0,15% no presidencial (anomalia de legado, com o maior volume individual do book, USD 13,63M). Não aparece nos cenários presidenciais das nacionais, incluindo a Datafolha de 24/Jul. O foco é a reeleição em São Paulo, disputa estadual que não entra neste painel de escopo nacional. No Senado por cadeiras, o PL oscilou entre 69,00% e 70,00% dentro da própria janela de captura e o MDB ficou em 18,10%.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "26/Jul: o mercado mantém o presidencial dele em 0,15%, anomalia de legado que serve de lembrete permanente de método, porque volume acumulado mede história negociada e não convicção atual. No Senado por cadeiras, o registro honesto do dia é a INSTABILIDADE do próprio book: o PL variou 1,00pp em treze minutos dentro da janela de captura, entre 70,00% e 69,00%. RESSALVA DE BASE, e ela é decisiva: o book inteiro do Senado soma USD 292 mil de volume acumulado contra USD 115,95M do presidencial, então movimento em percentual não significa dinheiro grande, e oscilação dessa ordem em minutos é o próprio argumento para não construir leitura sobre esse mercado. As convenções correm até 05/Ago. STF impeach 3,40%."
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
