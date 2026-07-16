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
    poll: "Lula RECUA no preço e fica IDÊNTICO na urna: Poly 60.50% (queda 1,00pp, vol USD 7,4M acumulado), devolvendo a alta de ontem, a 80 dias do 1º turno. O dado do dia é a PoderData/Aya (n=2.400, campo 12-15/Jul, BR-00059/2026), que CONTRADIZ a Quaest de ontem: 1º turno Lula 40% x Flávio 34% (gap +6pp, contra +12pp da Quaest) e 2º turno 45% x 43%, empate técnico pela margem de 2pp, contra os +8pp da Quaest. Mas Lula marca 40% no 1T e 45% no 2T nas DUAS: a discordância inteira está no Flávio. Aprovação diverge: 48% x 47% na Quaest, 42% x 51% na PoderData.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTOS 16/Jul D+63: a 80 dias do 1º turno, a PoderData contradisse a Quaest e o mercado recuou junto. O teste anunciado aqui ontem veio e deu no contrário: 2º turno de volta ao empate técnico (45% x 43%), e Lula cedeu 1,00pp para 60,50% em horas. Isso importa: durante semanas o preço sustentou Lula acima de 60% ignorando nacionais de empate, e hoje leu a pesquisa e se moveu na direção dela. O achado, porém, é o que as duas concordam: Lula é IDÊNTICO nas duas (40 e 45), a discordância está toda no Flávio (28 contra 34), seis pontos. Isso é efeito de casa, não viragem, e as duas séries provam: Flávio cai dentro de cada casa (Quaest 29 para 28, PoderData 36 para 34). A divergência de NÍVEL segue: 60,50% de probabilidade contra um returno em empate técnico. STF impeach 3.35% (alta 0,55pp). Volume no presidencial acima de USD 113M."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "25.45%",
    poll: "Flávio praticamente parado: Poly 25.45% (alta 0,15pp, vol USD 7,4M acumulado) e segue líder folgado do 2º lugar do 1º turno (83.50%, alta 0,50pp). É NELE que as duas melhores pesquisas da semana discordam, e por seis pontos: Quaest 15/Jul deu 1T 28% e 2T 37%, com rejeição de 57%; a PoderData/Aya 16/Jul deu 1T 34% e 2T 43%, empate técnico com Lula, com rejeição de 48%, empatada com a dele. Em 24h recebeu a pior e a melhor leitura da semana e o preço não se moveu em nenhuma direção.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 16/Jul: Flávio ficou parado a 25.45% depois de receber, em 24 horas, a pior e a melhor leitura da semana. A imobilidade é informativa: o mercado precifica a condição de adversário certo de Lula no returno (83.50% no 2º lugar do 1º turno), não o nível de voto dele. O que se pode afirmar com firmeza é que as duas casas concordam que ele CAI, cada uma no seu patamar: Quaest de 29% (Jun) para 28%, PoderData de 36% (25/Jun) para 34%. A direção é robusta, o nível não. O dia foi adverso: o novo tarifaço de 25% de Trump virou munição, e a Quaest mediu que a maioria culpa ele, não Lula, e que o episódio reduz a vontade de votar nele (Estadão, CartaCapital). Retuitou Rubio, culpou Lula e virou tariflávio (Folha). Saiu foto dele ao lado de Sicário, capanga apontado de Vorcaro no caso Master (Estadão). Chamou Dino de ministro comunista e disse não ter relação com Michelle. STF impeach 3.35%."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "8.40%",
    poll: "Renan CONVERGE pelos dois lados: Poly 8.40% (queda 0,10pp, vol USD 8,1M acumulado), acumulando descida de 10,15% para 8,40% em duas sessões, e recua no 3º lugar do 1º turno para 68.50%. Do outro lado, a urna SUBIU: a PoderData/Aya 16/Jul o mede em 6% no 1º turno, a MAIOR marca dele em qualquer nacional do ciclo (teto anterior 4%), e alta dentro da própria casa (4% em 25/Jun). A Quaest de ontem deu 3%, atrás de Caiado: as duas casas discordam de quem lidera a 3ª via.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "16/Jul: Renan entregou o caso mais limpo do painel, e ele contraria a expectativa registrada aqui ontem. O texto de 15/Jul dizia que se a PoderData confirmasse a faixa de 2 a 4% a correção do preço tenderia a continuar. A PoderData NÃO confirmou: deu 6%, a maior marca dele no ciclo, e alta também dentro da própria casa (4% em 25/Jun), o que descarta efeito de casa e caracteriza movimento real. O resultado é uma CONVERGÊNCIA BILATERAL, a primeira do ciclo: o preço veio de 10,15% para 8,40% em duas sessões e a urna subiu de 3% (Quaest) para 6% (PoderData). De 8,50% contra 3% ontem para 8,40% contra 6% hoje. Os dois lados caminharam um na direção do outro, por motivos independentes. É o que o AFOS existe para mostrar: uma divergência nem sempre se resolve com um lado se rendendo, às vezes as duas medidas estavam parcialmente certas. A distorção não acabou: mesmo na melhor leitura que já recebeu, ele vale 8,40% no vencedor. STF impeach 3.35%."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "1.25%",
    poll: "Haddad sobe de leve: Poly 1.25% (alta 0,15pp, vol USD 6,2M acumulado), como nome do PT depois de Lula. Não aparece nos cenários presidenciais das nacionais, nem na Quaest 15/Jul nem na PoderData 16/Jul (foco no governo de SP). Na Datafolha SP 05/Jul, Tarcísio lidera com 46% x Haddad 30%, com Haddad na maior rejeição do estado (47%). Mantém Márcio França (PSB) como vice.",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "16/Jul: Haddad subiu de leve a 1.25%, como nome do PT depois de Lula. O preço dele aqui é resíduo de nome conhecido, não sinal de candidatura: o mercado não precifica candidatura presidencial dele e nenhuma nacional recente o testa nesse cargo. O foco é estadual, e no governo de SP a Datafolha 05/Jul deu Tarcísio 46% x Haddad 30%, com Haddad na maior rejeição do estado (47%). No pano de fundo, o Senado aprovou a pauta-bomba e saiu para o recesso sem votar as prioridades do governo (Estadão), com a equipe econômica temendo o precedente da aposentadoria especial dos agentes de saúde. STF impeach 3.35%."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1.25%",
    poll: "Caiado recua no vencedor: Poly 1.25% (queda 0,15pp, vol USD 4,9M acumulado) e sobe no 3º lugar do 1º turno para 14.00%. A PoderData/Aya 16/Jul QUEBRA a sequência em que ele liderava a 3ª via: 4%, empatado com Zema (4%) e ATRÁS de Renan (6%), invertendo a Quaest de ontem (Caiado 4%, Renan 3%, Zema 2%). Mede 4% nas duas casas, o número mais estável do pelotão, mas as duas discordam de quem está na frente. Chapa pura do PSD (Kassab vice).",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "16/Jul: Caiado recuou a 1.25% e perdeu a liderança da 3ª via na urna. A PoderData o pôs em 4%, empatado com Zema e atrás de Renan (6%), invertendo a ordem que a Quaest deu ontem. As duas casas discordam sobre quem lidera o pelotão e concordam que nenhum deles decola: a Quaest cravou o diagnóstico ao medir que Caiado, Zema e Renan não crescem nem com Flávio perdendo 20 pontos na direita não-bolsonarista em dois meses. O eleitor que sai de Flávio não está indo para eles, e esse é o dado estrutural do grupo, que sobrevive à divergência de casa. O contraste com o preço persiste: mede 4% de voto nas DUAS nacionais da semana e vale 1,25% no vencedor, um sétimo de Renan. O mercado precifica notoriedade, não intenção de voto. STF impeach 3.35%."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0.65%",
    poll: "Zema no piso: Poly 0.65% (queda 0,15pp, vol USD 4,4M). A PoderData/Aya 16/Jul o dá com 4%, DOBRO do que a Quaest lhe deu ontem (2%), e empatado com Caiado. Também marcou 3,7% na Futura/Apex 14/Jul e 4% na BTG/Nexus 13/Jul. Marca dois terços do voto de Renan na MESMA pesquisa e vale um treze avos dele no preço. Ainda não anunciou o vice.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "16/Jul: Zema recuou a 0.65% no vencedor no dia em que a urna lhe deu o DOBRO. A PoderData o mediu em 4%, contra 2% da Quaest de ontem, e o empatou com Caiado. É a distorção relativa mais gritante do painel quando se usa a mesma régua: na MESMA pesquisa, Zema marca 4% e Renan 6%, ou seja, dois terços do voto dele, e vale 0,65% contra 8,40% no preço, um treze avos. Isso não é sobre intenção de voto, é sobre notoriedade e narrativa, que é o que um mercado fino precifica. Na bipolarização Lula x Flávio o Novo não encontra tração, e o vice ainda não saiu. STF impeach 3.35%."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.15%",
    poll: "Tarcísio estável a Poly 0.15% no presidencial (anomalia de legado, vol USD 13,4M acumulado, o maior do book). Não aparece nos cenários presidenciais das nacionais, nem na Quaest 15/Jul nem na PoderData 16/Jul. O foco é a reeleição em SP, onde a Datafolha 05/Jul o dá liderando com 46% x Haddad 30% e aprovação de 45%. No Senado por cadeiras, o PL SOBE a 86.00% (alta 1,50pp).",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "16/Jul: Tarcísio segue focado na reeleição em SP, onde lidera (Datafolha 05/Jul: 46% x Haddad 30%, aprovação de 45%). O mercado mantém o presidencial em 0.15% (anomalia de legado, volume herdado de apostas antigas, o maior do book a USD 13,4M). Não é testado no presidencial por nenhuma nacional recente. O movimento do dia entre os sub-mercados foi o Senado por cadeiras: o PL subiu 1,50pp para 86.00%, a maior variação do painel, no dia em que o Senado aprovou a pauta-bomba e saiu para o recesso sem votar as prioridades do governo (Estadão), com Alcolumbre segurando a promulgação à espera de conversa com Lula. Ressalva de método: o volume desse book é de cerca de USD 250 mil, muito abaixo do presidencial, então o sinal é fraco. STF impeach 3.35%."
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
