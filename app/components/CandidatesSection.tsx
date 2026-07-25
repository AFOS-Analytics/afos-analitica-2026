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
    poll: "Lula ROMPE o teto da série: Poly 62,50% (alta 1,00pp, vol USD 7,64M acumulado), a 71 dias do 1º turno, o maior preço dele em toda a base do AFOS, que cobre 99 dias desde 14/Abr e tinha topo de 61,50% (03/Jul, repetido em 24/Jul). A urna VOLTOU: a Datafolha saiu na noite de 24/Jul (n=2.004, campo 22 a 24/Jul, margem 2pp, BR-01166/2026) e o dá com 40% no 1º turno e 48% no returno direto contra 43% de Flávio, vencendo também Caiado (47x40) e Zema (48x40). Contra a Datafolha de junho, caiu 1pp no 1º turno e subiu 1pp no 2º, os dois dentro da margem: é estabilidade. Aprovação pessoal 49% x 48%, gestão 32% ótimo ou bom contra 38% ruim ou péssimo. O gap sobre Flávio foi a +39,65pp, o maior dos 99 dias de série.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTOS 25/Jul: o Itamaraty negou visto a dois funcionários do Departamento de Estado americano, o secretário-assistente Riley M. Barnes e o vice-secretário-assistente Samuel Samson, que pediram entrada em 20/Jul e pretendiam tratar do sistema eleitoral brasileiro (Washington Post, Correio Braziliense, Estadão, SBT News). Lula respondeu em convenção do PT que quem vier de fora se meter na eleição vai apanhar muito, lembrando que 157 milhões de eleitores decidem. No mercado, subiu 1,00pp para 62,50% e o gap foi a +39,65pp, acima do pico anterior de +39,50pp de 03/Jul, virando o maior da série de 99 dias. RESSALVA DE JANELA, e ela importa: a API pública de histórico trava a consulta em 90 dias, então superlativo conferido por ali mede 90 dias e chama de ciclo. A conferência foi feita direto na base, e o que a base não prova é o que houve antes de 14/Abr. Sobre causa, nada se afirma: a captura é das 15:51, a convenção do adversário correu na tarde e o gap já subia desde 20/Jul (+33,60pp). STF impeach 3,50% (queda 0,05pp). Volume no presidencial em USD 115,79M."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "22,85%",
    poll: "Flávio CAI no dia da própria convenção: Poly 22,85% (queda 0,10pp, vol USD 7,65M acumulado), a 0,85pp do piso de 22,00% que a série de 99 dias registra em 03/Jul. A urna, medida ANTES do evento, é a parte boa dele: a Datafolha de 24/Jul o põe em 32% no 1º turno, um ponto acima de junho, e mantém os 43% do returno direto. O número que não se mexeu é o que mais pesa: rejeição de 48%, idêntica à de junho e a MAIS ALTA entre todos os nomes testados, acima dos 46% de Lula. A Gerp 22/Jul, casa outlier pró-Flávio, segue sendo a leitura mais favorável do recorte (empate no 1T 38x38, à frente no 2T 46x45). Recuperou 2,50pp no 2º lugar do 1º turno, para 76,50%, num book de apenas USD 202 mil.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 25/Jul: o PL oficializou a candidatura em São Paulo, com vídeo de Jair Bolsonaro gerado por inteligência artificial, apoio de Michelle e discurso de cerca de 30 minutos do presidente argentino Javier Milei, que disse confiar nele para parar Lula e chamou Alexandre de Moraes de lixo careca por não ter autorizado sua visita a Jair na prisão domiciliar (Folha de S.Paulo, O Globo, CartaCapital, Metrópoles). Dois problemas atravessaram a convenção sem solução: chegou ao lançamento SEM vice, depois de Tereza Cristina recusar o convite, e a federação União Progressista segue neutra desde 22/Jul. No mercado, o preço caiu 0,10pp no próprio dia do lançamento. O contraste fica registrado sem juízo de valor: a candidatura foi lançada com respaldo de um chefe de Estado estrangeiro e o dinheiro real moveu-se na direção oposta no mesmo pregão. No caso Master, a Justiça do Rio bloqueou até R$ 135 milhões do banco e de sócios por perdas do Rioprevidência."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "10,35%",
    poll: "Renan LEVA o teste que faltava: Poly 10,35% no vencedor (queda 1,40pp, vol USD 8,50M acumulado), a maior queda do book presidencial no dia. A Datafolha de 24/Jul o mediu em 3% no 1º turno, confirmando Gerp 22/Jul e Indexa 21/Jul: três das quatro nacionais recentes o põem em 3%, e os 9% da Real Time 21/Jul ficam isolados. A distorção contra a urna ESTREITOU, mas por movimento do preço e não da pesquisa, e segue sendo a maior do painel. Rejeição de 12%, um quarto da de Flávio, o que preserva espaço de crescimento. Nos sub-mercados subiu 0,60pp no 2º lugar (12,00%) e cedeu 1,00pp no 3º lugar (66,00%). Tem o maior volume acumulado entre os nomes competitivos do book.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "25/Jul: o teste chegou e foi na direção do que as outras pesquisas já diziam. Com a Datafolha medindo 3%, a nacional de maior peso do recorte se juntou à Gerp e à Indexa, e o mercado respondeu no mesmo dia com a maior queda do book, 1,40pp. RESSALVA DE SÉRIE, medida na base inteira e não na janela curta: 10,35% não é máximo nem mínimo dele. O pico foi 17,90% em 09/Jun e o piso é 5,30% em 26/Abr, então o preço de hoje é recuo de um patamar já perdido, não ponto alto. Vale lembrar que a comparação entre 10,35% e 3% é entre grandezas diferentes, probabilidade de vitória contra intenção de voto, o que pede cautela em qualquer leitura de erro. STF impeach 3,50%."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0,65%",
    poll: "Haddad SOBE 0,30pp: Poly 0,65% (vol USD 6,35M acumulado), nome residual sem lastro de urna no cargo presidencial. Não aparece nos cenários presidenciais das nacionais, incluindo a Datafolha de 24/Jul: nenhuma pesquisa o testa para presidente. O foco é a disputa estadual de São Paulo, cuja chapa foi oficializada em convenção do PT em Campinas neste 25/Jul, com Márcio França (PSB) de vice e presença de Lula. Disputa estadual não entra neste painel, que é de escopo nacional.",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "25/Jul: a convenção do PT em Campinas oficializou a chapa dele ao governo de São Paulo, com Márcio França de vice, e foi nesse palanque que Lula disse que quem vier de fora se meter na eleição brasileira vai apanhar muito (Poder360, Estadão, CartaCapital). No book presidencial ele subiu 0,30pp, para 0,65%, mas registra-se a coincidência de data sem atribuição de causa, até porque o cargo precificado aqui é outro. O preço dele segue sendo resíduo de nome conhecido. STF impeach 3,50%."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1,90%",
    poll: "Caiado DEVOLVE a queda da véspera: Poly 1,90% (alta 0,15pp, vol USD 5,12M acumulado) e mantém 16,00% no 3º lugar do 1º turno, sem variação. A Datafolha de 24/Jul o dá com 4% no 1º turno, o melhor do pelotão, e o mostra perdendo o returno para Lula por 47% a 40%, margem MAIOR que os 5pp de Flávio, o que contraria a tese de que um nome do centro seria adversário mais competitivo. A rejeição de 12% é das mais baixas do páreo e é o dado que sustenta a leitura contrária, porque indica espaço de crescimento. Chapa pura do PSD (Kassab vice).",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "25/Jul: a Datafolha deu a Caiado a melhor medição do pelotão, 4%, e ao mesmo tempo o cenário de returno menos favorável do que a narrativa do campo sugeria, com Lula vencendo por 7pp. O contraste com o preço persiste: mede 4% de voto declarado e vale 1,90% no vencedor. O PSD teve convenções estaduais no fim de semana, com Sandro Alex lançado ao governo do Paraná. STF impeach 3,50%."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0,75%",
    poll: "Zema DEVOLVE parte do salto: Poly 0,75% (queda 0,20pp, vol USD 4,53M), o ÚNICO nome do pelotão a recuar num dia de alta espalhada, depois de ter mais que dobrado em 24/Jul. A Datafolha de 24/Jul o mede em 3% no 1º turno e o mostra perdendo o returno para Lula por 48% a 40%, a maior margem entre os três cenários de 2º turno testados. A rejeição de 13% é baixa para o padrão do páreo, ainda que a mais alta do pelotão. Vinha marcando 3% na Gerp 22/Jul e na Indexa 21/Jul, 3,7% na Futura/Apex 14/Jul e 4% na BTG/Nexus 13/Jul. A chapa entra nas convenções ainda sem vice definido.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "25/Jul: Zema foi o único do pelotão a cair, devolvendo 0,20pp do salto da véspera, num dia em que Caiado, Michelle, Jair e Haddad subiram. A Datafolha o manteve em 3%, mesmo patamar das duas nacionais anteriores, então o descolamento entre preço e voto declarado aqui é de direção oposta à de Renan: ele mede pouco e vale pouco. Chega às convenções ainda sem vice, depois de Michelle Bolsonaro ter descartado publicamente a hipótese. STF impeach 3,50%."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0,15%",
    poll: "Tarcísio estável a Poly 0,15% no presidencial (anomalia de legado, o maior volume individual do book presidencial). Não aparece nos cenários presidenciais das nacionais, incluindo a Datafolha de 24/Jul. O foco é a reeleição em São Paulo, disputa estadual que não entra neste painel de escopo nacional. No Senado por cadeiras, o PL subiu de 68,50% para 70,50% e o MDB de 15,45% para 17,25%.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "25/Jul: o mercado mantém o presidencial dele em 0,15%, anomalia de legado que serve de lembrete permanente de método, porque volume acumulado mede história negociada e não convicção atual. Nos sub-mercados, o Senado por cadeiras subiu para o campo de Flávio: o PL ganhou 2,00pp, indo a 70,50%, e o MDB 1,80pp, indo a 17,25%. RESSALVA DE BASE, e ela é decisiva: o book inteiro do Senado soma USD 290 mil de volume acumulado contra USD 115,79M do presidencial, então movimento em percentual não significa dinheiro grande. As convenções correm até 05/Ago. STF impeach 3,50%."
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
