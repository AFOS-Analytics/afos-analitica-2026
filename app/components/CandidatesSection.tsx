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
    poll: "Lula ESTÁVEL no preço: Poly 60.50% (0,00pp, vol USD 7,4M acumulado), a 78 dias do 1º turno, em novo dia sem pesquisa nacional nova. O gap sobre Flávio voltou a abrir, para +34,00pp, por queda do adversário, não por alta dele. As últimas nacionais seguem a Quaest 15/Jul (1T 40x28, 2T 45x37) e a PoderData 16/Jul (1T 40x34, 2T 45x43), e Lula é IDÊNTICO nas duas: 40% no 1T e 45% no 2T. A discordância inteira está no Flávio. Próximas nacionais em 21 e 22/Jul.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTOS 18/Jul: novo dia sem pesquisa nacional nova, e o mercado se moveu sozinho. Lula ficou imóvel a 60,50% (0,00pp); o movimento veio do adversário, com Flávio devolvendo a alta de ontem (queda 0,55pp) e o gap reabrindo para +34,00pp. Sem gatilho de pesquisa nem evento de urna, é momentum, não reação. O pano de fundo do voto não mudou: Lula idêntico nas duas nacionais (40 e 45), a discordância toda no Flávio. A Folha apontou Lula como o vencedor da semana entre os três poderes, mas a agenda dele segue travada no Congresso, com quatro MPs caducadas em julho (CNN). A distância de nível segue a maior do ciclo. STF impeach 3.40% (estável). Volume no presidencial em USD 113,7M."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "26.50%",
    poll: "Flávio RECUA: Poly 26.50% (queda 0,55pp, vol USD 7,5M acumulado), devolvendo a alta de 1,60pp da véspera, e também cede no 2º lugar do 1º turno (81.50%, queda 0,50pp). Não houve pesquisa nem evento de urna por trás: é momentum, o mercado desfazendo o repique técnico de ontem. O pano de fundo do voto, inalterado, segue desfavorável no nível: Quaest 28% e PoderData 34% no 1T, as duas medindo queda dentro de cada casa (Quaest 29 para 28, PoderData 36 para 34). No dia, teve depoimento agendado, resposta ao tarifaço dos EUA e ataque concentrado do PT nas redes.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 18/Jul: Flávio devolveu a alta técnica da véspera, e sem gatilho. Caiu 0,55pp para 26.50%, reabrindo o gap para Lula (de +33,45pp para +34,00pp), num dia sem pesquisa nem fato de urna novo. O repique de ontem, que o AFOS já havia lido como momentum, foi desfeito hoje: é momentum de novo, não reação, e o AFOS não inventa causa onde não há gatilho. O preço é sobre a aposta de adversário certo de Lula no returno, e o 2º lugar do 1º turno também cedeu, a 81.50% (queda 0,50pp). No dia teve depoimento agendado, nova resposta ao tarifaço dos EUA e ataque concentrado do PT nas redes (VEJA), enquanto o desgaste do caso Master seguiu em aberto, agora com a PF acionando a Interpol atrás dos bens de Vorcaro. STF impeach 3.40%."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "8.30%",
    poll: "Renan INTERROMPE a correção: Poly 8.30% (alta 0,45pp, vol USD 8,2M acumulado), depois de três sessões descendo de 10,15% rumo aos 6% da PoderData, e sobe no 3º lugar do 1º turno para 68.50%. A última urna segue os 6% da PoderData 16/Jul, a MAIOR marca dele no ciclo e alta dentro da própria casa (4% em 25/Jun). A convergência bilateral perdeu um passo hoje pelo lado do preço, sem pesquisa nova: de 7,85% x 6% ontem para 8,30% x 6%. A Quaest de 15/Jul deu 3%, atrás de Caiado: as duas casas ainda discordam de quem lidera a 3ª via.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "18/Jul: Renan segue o caso mais limpo do painel, mas hoje a convergência recuou um passo. O preço subiu 0,45pp, para 8,30%, interrompendo a descida de 10,15% rumo aos 6% que a PoderData mediu (a maior marca dele no ciclo, e alta dentro da própria casa, o que caracteriza movimento real, não efeito de casa). A distância entre preço e urna voltou a alargar de leve, de 7,85% x 6% para 8,30% x 6%, sem pesquisa nova por trás: momentum. Segue sendo o que o AFOS existe para mostrar, uma divergência que oscila enquanto as duas medidas se ajustam. A distorção não acabou (vale 8,30% contra 6%), e a Quaest, a de maior confiabilidade, ainda o dá com 3%, atrás de Caiado. STF impeach 3.40%."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0.45%",
    poll: "Haddad estável: Poly 0.45% (0,00pp, vol USD 6,2M acumulado), nome residual sem lastro de urna. Não aparece nos cenários presidenciais das nacionais (foco no governo de SP). Na Datafolha SP 05/Jul, Tarcísio lidera com 46% x Haddad 30%, com Haddad na maior rejeição do estado (47%). Mantém Márcio França (PSB) como vice. O preço aqui é resíduo de nome conhecido, e o recuo de hoje reforça isso.",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "18/Jul: Haddad estável a 0.45% num dia sem pesquisa nem evento por trás. É um nome residual: o mercado não precifica candidatura presidencial dele e nenhuma nacional o testa nesse cargo. O foco é estadual, e no governo de SP a Datafolha 05/Jul deu Tarcísio 46% x Haddad 30%, com Haddad na maior rejeição do estado (47%). O preço aqui sempre foi resíduo de nome conhecido, e o recuo de hoje confirma. STF impeach 3.40%."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1.40%",
    poll: "Caiado sobe de leve: Poly 1.40% (alta 0,15pp, vol USD 5,0M acumulado) e avança no 3º lugar do 1º turno para 16.50% (alta 2,00pp). Sem pesquisa nova, segue a foto da PoderData 16/Jul: 4%, empatado com Zema e ATRÁS de Renan (6%), invertendo a Quaest de ontem (Caiado 4%, Renan 3%). Mede 4% nas duas casas, o número mais estável do pelotão, mas as duas discordam de quem lidera. Chapa pura do PSD (Kassab vice).",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "18/Jul: Caiado subiu de leve a 1.40% num dia sem pesquisa nova, e avançou no 3º lugar do 1º turno para 16.50% (alta 2,00pp). O pano de fundo segue a PoderData 16/Jul, que o pôs em 4%, atrás de Renan (6%) e empatado com Zema. As duas casas discordam da ordem do pelotão e concordam que nenhum decola: a Quaest cravou que Caiado, Zema e Renan não crescem nem com Flávio perdendo 20 pontos na direita não-bolsonarista em dois meses. O contraste com o preço persiste: mede 4% de voto e vale um sétimo de Renan (7,85%) no vencedor. O mercado precifica notoriedade, não intenção de voto. STF impeach 3.40%."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0.80%",
    poll: "Zema sobe de leve: Poly 0.80% (alta 0,25pp, vol USD 4,4M). A última urna, a PoderData 16/Jul, o dá com 4%, DOBRO dos 2% da Quaest, empatado com Caiado. Também marcou 3,7% na Futura/Apex 14/Jul e 4% na BTG/Nexus 13/Jul. Marca dois terços do voto de Renan na MESMA pesquisa e vale cerca de um catorze avos dele (7,85%) no preço. Ainda não anunciou o vice.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "18/Jul: Zema subiu de leve a 0.80% no vencedor num dia sem pesquisa nova. A última urna, a PoderData 16/Jul, o deu com 4%, o dobro dos 2% da Quaest, empatado com Caiado. É a distorção relativa mais gritante do painel na mesma régua: na MESMA pesquisa, Zema marca 4% e Renan 6%, dois terços do voto dele, e vale 0,55% contra 7,85% no preço, cerca de um catorze avos. Não é sobre intenção de voto, é sobre notoriedade e narrativa, que é o que um mercado fino precifica. Na bipolarização Lula x Flávio o Novo não encontra tração, e o vice ainda não saiu. STF impeach 3.40%."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.15%",
    poll: "Tarcísio estável a Poly 0.15% no presidencial (anomalia de legado, vol USD 13,4M acumulado, o maior do book). Não aparece nos cenários presidenciais das nacionais, nem na Quaest 15/Jul nem na PoderData 16/Jul. O foco é a reeleição em SP, onde a Datafolha 05/Jul o dá liderando com 46% x Haddad 30% e aprovação de 45%. No Senado por cadeiras, o PL segue folgado em 85.50% (queda 0,50pp), a liderança do mercado de mais cadeiras.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "18/Jul: Tarcísio segue focado na reeleição em SP, onde lidera (Datafolha 05/Jul: 46% x Haddad 30%, aprovação de 45%). O mercado mantém o presidencial em 0.15% (anomalia de legado, volume herdado de apostas antigas, o maior do book a USD 13,4M). Não é testado no presidencial por nenhuma nacional recente. Nos sub-mercados, o Senado por cadeiras cedeu de leve: o PL recuou 0,50pp para 85.50%, seguindo folgado na semana em que o Senado saiu para o recesso sem votar as prioridades do governo (Estadão), com Alcolumbre segurando a promulgação. Ressalva de método: o volume desse book é de cerca de USD 250 mil, muito abaixo do presidencial, então o sinal é fraco. STF impeach 3.40%."
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
