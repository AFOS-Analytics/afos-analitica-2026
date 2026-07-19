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
    polymarket: "60.50%",
    poll: "Lula ESTÁVEL no preço: Poly 60.50% (0,00pp, vol USD 7,5M acumulado), a 77 dias do 1º turno, no segundo pregão seguido imóvel e no terceiro dia sem pesquisa nacional nova. O gap sobre Flávio foi a +34,85pp, o mais largo do ciclo, inteiramente por queda do adversário. As últimas nacionais seguem a Quaest 15/Jul (1T 40x28, 2T 45x37) e a PoderData 16/Jul (1T 40x34, 2T 45x43), e Lula é IDÊNTICO nas duas: 40% no 1T e 45% no 2T. A discordância inteira está no Flávio. Próximas nacionais em 21, 22 e 24/Jul.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTOS 19/Jul: terceiro dia sem pesquisa nacional nova, e o mercado se moveu sozinho pela quarta sessão. Lula ficou imóvel a 60,50% (0,00pp) pelo segundo pregão seguido; toda a variação veio do adversário, com Flávio caindo 0,85pp e o gap indo a +34,85pp, o mais largo do ciclo. O ponto que importa: o gap alargou por queda do adversário, não por alta do favorito, e essas duas coisas não são a mesma informação. Sem gatilho de pesquisa nem evento de urna, é momentum, não reação. A agenda segue travada no Congresso, com mais de 20 derrotas no 3º mandato (Poder360) e pacote de crédito de R$ 145 bi por fora do arcabouço (Estadão). As convenções partidárias abrem em 20/Jul. STF impeach 3.75% (alta 0,35pp). Volume no presidencial em USD 113,8M."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "25.65%",
    poll: "Flávio RECUA forte: Poly 25.65% (queda 0,85pp, vol USD 7,5M acumulado), a maior queda diária da semana e a terceira sessão seguida de perda, e também cede no 2º lugar do 1º turno (81.00%, queda 0,50pp). Não houve pesquisa nem evento de urna por trás. O repique de 17/Jul foi inteiramente devolvido e algo mais, o que sugere erosão lenta de convicção, não ruído simétrico. O pano de fundo do voto, inalterado, segue desfavorável no nível: Quaest 28% e PoderData 34% no 1T, as duas medindo queda dentro de cada casa (Quaest 29 para 28, PoderData 36 para 34).",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 19/Jul: Flávio entregou o movimento do dia de novo, e de novo sem gatilho. Caiu 0,85pp para 25.65%, a maior queda diária da semana e terceira sessão seguida de perda, e o gap para Lula abriu de +34,00pp para +34,85pp, o mais largo do ciclo. O sinal político novo veio de fora do campo dele e reforça o problema: Ciro Gomes citou Caiado e Renan Santos como possibilidades de voto e o deixou de fora (Folha, Gazeta do Povo), expondo que o voto anti-Lula de centro não migra automaticamente para o nome do PL. Michelle descartou ser vice de Zema, mantendo aberto o atrito familiar. E a semana é a mais estrutural do ciclo: as convenções abrem em 20/Jul e vão até 05/Ago, com o PL precisando fechar chapa com Jair preso e Flávio suspenso das visitas ao pai até outubro. STF impeach 3.75%."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "8.15%",
    poll: "Renan cede pouco no vencedor e DESABA no sub-mercado: Poly 8.15% (queda 0,15pp, vol USD 8,2M acumulado), mas o 3º lugar do 1º turno caiu 4,00pp, de 68.50% para 64.50%, a maior variação isolada do painel hoje. A última urna segue os 6% da PoderData 16/Jul, a MAIOR marca dele no ciclo e alta dentro da própria casa (4% em 25/Jun). No mesmo pregão, Ciro Gomes o citou como possibilidade de voto. A Quaest de 15/Jul deu 3%, atrás de Caiado: as duas casas ainda discordam de quem lidera a 3ª via.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "19/Jul: Renan entregou a divergência mais interessante do dia. No vencedor cedeu pouco (0,15pp, para 8.15%), mas no 3º lugar do 1º turno desabou 4,00pp, de 68.50% para 64.50%, a maior variação isolada de todo o painel. O detalhe que faz o número valer: isso aconteceu no MESMO dia em que Ciro Gomes o citou nominalmente como possibilidade de voto, ao lado de Caiado, ignorando Flávio (Folha, Gazeta do Povo). Aceno político de um lado, dinheiro real reduzindo a aposta na colocação dele do outro. O AFOS não costura causa entre as duas coisas, não há evidência de que o mercado tenha reagido ao Ciro e o mais provável é que sejam eventos independentes, mas o registro importa porque é exatamente isso que o painel existe para mostrar: narrativa e preço em direções opostas no mesmo pregão. A distorção no vencedor não acabou (vale 8,15% contra 6% na melhor urna). STF impeach 3.75%."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0.55%",
    poll: "Haddad devolve parte da queda: Poly 0.55% (alta 0,10pp, vol USD 6,3M acumulado), nome residual sem lastro de urna. Não aparece nos cenários presidenciais das nacionais (foco no governo de SP). Na Datafolha SP 05/Jul, Tarcísio lidera com 46% x Haddad 30%, com Haddad na maior rejeição do estado (47%). Mantém Márcio França (PSB) como vice. Cair 0,80pp ontem e subir 0,10pp hoje, sem nada entre as duas pontas, é a assinatura de um book fino.",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "19/Jul: Haddad subiu 0,10pp para 0.55%, devolvendo parte da queda de 0,80pp de ontem sem que nada tenha acontecido entre as duas pontas. Essa oscilação é a melhor evidência de que o preço dele é resíduo de nome conhecido num mercado fino, não sinal de candidatura: o mercado não precifica candidatura presidencial dele e nenhuma nacional o testa nesse cargo. O foco é estadual, e no governo de SP a Datafolha 05/Jul deu Tarcísio 46% x Haddad 30%, com Haddad na maior rejeição do estado (47%). STF impeach 3.75%."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1.35%",
    poll: "Caiado praticamente parado: Poly 1.35% (queda 0,05pp, vol USD 5,0M acumulado) e recua no 3º lugar do 1º turno para 16.00% (queda 0,50pp). Sem pesquisa nova, segue a foto da PoderData 16/Jul: 4%, empatado com Zema e ATRÁS de Renan (6%), invertendo a Quaest (Caiado 4%, Renan 3%). Mede 4% nas duas casas, o número mais estável do pelotão, mas as duas discordam de quem lidera. Ciro Gomes o citou como possibilidade de voto e o preço não se mexeu. Chapa pura do PSD (Kassab vice).",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "19/Jul: Caiado ficou praticamente parado (queda 0,05pp, para 1.35%) num dia em que recebeu o aceno político mais explícito do ciclo: Ciro Gomes o citou nominalmente como possibilidade de voto, ao lado de Renan, deixando Flávio de fora (Folha, Gazeta do Povo). O preço não reagiu em direção nenhuma, o que sugere que o mercado não trata declaração de apoio como fato precificável a 77 dias da urna. O pano de fundo segue a PoderData 16/Jul, que o pôs em 4%, atrás de Renan (6%) e empatado com Zema. As duas casas discordam da ordem do pelotão e concordam que nenhum decola: a Quaest cravou que Caiado, Zema e Renan não crescem nem com Flávio perdendo 20 pontos na direita não-bolsonarista em dois meses. O contraste com o preço persiste: mede 4% de voto e vale um sexto de Renan (8,15%) no vencedor. STF impeach 3.75%."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0.65%",
    poll: "Zema sobe de leve: Poly 0.65% (alta 0,10pp, vol USD 4,4M). A última urna, a PoderData 16/Jul, o dá com 4%, DOBRO dos 2% da Quaest, empatado com Caiado. Também marcou 3,7% na Futura/Apex 14/Jul e 4% na BTG/Nexus 13/Jul. Marca dois terços do voto de Renan na MESMA pesquisa e vale cerca de um doze avos dele (8,15%) no preço. Michelle Bolsonaro descartou ser vice dele, e a chapa segue sem vice a um dia da abertura das convenções.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "19/Jul: Zema subiu 0,10pp para 0.65% no vencedor, num dia em que o fato relevante foi político: Michelle Bolsonaro descartou publicamente ser vice dele, sem nenhuma possibilidade nas palavras dela, e a chapa chega à abertura das convenções (20/Jul) ainda sem vice definido. Defende privatização de Petrobras e Banco do Brasil em eventual governo (Jornal do Brasil), posição que o diferencia no pelotão. Segue a distorção relativa mais gritante do painel na mesma régua: na MESMA PoderData, Zema marca 4% e Renan 6%, dois terços do voto dele, e vale 0,65% contra 8,15% no preço, cerca de um doze avos. Não é sobre intenção de voto, é sobre notoriedade e narrativa, que é o que um mercado fino precifica. STF impeach 3.75%."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.15%",
    poll: "Tarcísio estável a Poly 0.15% no presidencial (anomalia de legado, vol USD 13,5M acumulado, o maior do book). Não aparece nos cenários presidenciais das nacionais, nem na Quaest 15/Jul nem na PoderData 16/Jul. O foco é a reeleição em SP, onde a Datafolha 05/Jul o dá liderando com 46% x Haddad 30% e aprovação de 45%. No Senado por cadeiras, o PL segue folgado em 85.50% (estável), a liderança do mercado de mais cadeiras.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "19/Jul: Tarcísio segue focado na reeleição em SP, onde lidera (Datafolha 05/Jul: 46% x Haddad 30%, aprovação de 45%). O mercado mantém o presidencial em 0.15% (anomalia de legado, volume herdado de apostas antigas, o maior do book a USD 13,5M), e essa combinação de volume máximo com preço de piso é o melhor lembrete do painel de que volume acumulado mede história negociada, não convicção atual. Não é testado no presidencial por nenhuma nacional recente. Nos sub-mercados, o Senado por cadeiras ficou estável, com o PL em 85.50%, folgado. Ressalva de método: o volume desse book é de cerca de USD 280 mil, muito abaixo do presidencial, então o sinal é fraco. As convenções partidárias abrem em 20/Jul e vão definir a chapa dele em SP. STF impeach 3.75%."
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
