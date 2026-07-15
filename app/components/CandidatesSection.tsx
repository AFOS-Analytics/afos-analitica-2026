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
    polymarket: "61.50%",
    poll: "Lula VOLTA a subir: Poly 61.50% (alta 1,00pp, vol USD 7,4M acumulado), no topo do intervalo de duas semanas, a 81 dias do 1º turno. O dado do dia é a Genial/Quaest (n=2.004, campo 10-13/Jul, margem 2pp), a pesquisa de maior confiabilidade do recorte: 1º turno Lula 40% x Flávio 28% (gap +12pp) e 2º turno Lula 45% x Flávio 37% (gap +8pp), a maior folga de julho. Ela QUEBRA a sequência de estreitamento de Gerp 08/Jul, BTG/Nexus 13/Jul e Futura/Apex 14/Jul. Aprovação do governo em leve melhora: 48% contra 47% de desaprovação.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTOS 15/Jul D+62: a 81 dias do 1º turno, a pesquisa mais confiável da semana reabriu a folga de Lula e o mercado subiu junto. A Genial/Quaest põe o 2º turno em 45% x 37% (Lula +8), a maior vantagem de julho, depois de três nacionais que sugeriam empate (Gerp, BTG/Nexus, Futura/Apex). O mercado leu na mesma direção: Lula 61,50% (alta 1,00pp) e Renan corrigido para baixo. Fica a divergência de NÍVEL: 61,50% de probabilidade é muito para uma vantagem de 8pp a 81 dias. A pergunta deixou de ser se o mercado acerta a direção, e passou a ser se exagera na convicção. Próximo teste: PoderData 16/Jul (n=2.400). STF impeach no piso a 2.80%. Volume no presidencial acima de USD 113M."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "25.30%",
    poll: "Flávio sobe de leve: Poly 25.30% (alta 0,45pp, vol USD 7,4M acumulado) e segue líder do 2º lugar do 1º turno (83.00%). Mas a Genial/Quaest 15/Jul foi a pior pesquisa da semana para ele: 1T 28% e 2T 37%, a 8pp de Lula, com 57% de rejeição, a maior do páreo. A VEJA falou em tempestade negativa perfeita. O preço no vencedor não recuou, sustentado pela condição de adversário certo no returno.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 15/Jul: Flávio subiu de leve a 25.30% apesar da pior pesquisa da semana. Na Quaest aparece a 8pp de Lula no 2º turno (45 x 37) e com 57% de rejeição, e aliados admitem que ele precisa recuperar espaço na direita não-bolsonarista e entre independentes (G1). Ele detonou a pesquisa, ironizou que o povo está feliz com Lula e chamou o PT de Partido do Tarifaço. No STF, o dia foi adverso: Bolsonaro CONTRADISSE o filho e disse a Moraes que a carta foi lida sem sua autorização, e Moraes pediu manifestação da PGR sobre possível descumprimento. Segue suspenso por 90 dias das visitas ao pai. Organizou a chapa ao Senado no RJ com Carlos Portinho. STF impeach 2.80%."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "8.50%",
    poll: "Renan CAI: Poly 8.50% (queda 1,65pp, vol USD 8,1M acumulado), o maior movimento do dia, e recua no 3º lugar do 1º turno para 69.00%. As urnas seguem discordando, e o mercado começou a ceder: a Genial/Quaest 15/Jul o mede em 3% no 1º turno, ATRÁS de Caiado (4%). O preço de dois dígitos que sobreviveu a semanas de pesquisas fracas cedeu quando veio a mais forte.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "15/Jul: Renan teve o maior movimento do dia, e foi de queda: 8.50% (baixa 1,65pp) no vencedor e 69.00% no 3º lugar do 1º turno. A Genial/Quaest o pôs em 3%, atrás de Caiado (4%), e o mercado respondeu tirando 1,65pp do preço. É a tese do AFOS funcionando: diante de dado novo e crível, o mercado ajustou a convicção que as pesquisas não sustentavam. A divergência segue a mais larga do painel (8,50% contra 3%), mas estreitou pela primeira vez em semanas. Se a PoderData 16/Jul confirmar a faixa de 2 a 4%, a correção tende a continuar. STF impeach 2.80%."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "1.10%",
    poll: "Haddad sobe de leve: Poly 1.10% (alta 0,30pp, vol USD 6,2M acumulado), como nome do PT depois de Lula. Não aparece nos cenários presidenciais das nacionais (foco no governo de SP). Na Datafolha SP 05/Jul, Tarcísio lidera com 46% x Haddad 30%, com Haddad na maior rejeição do estado (47%). Mantém Márcio França (PSB) como vice.",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Haddad subiu de leve a 1.10%, como nome do PT depois de Lula. O mercado não precifica candidatura presidencial dele; o foco é estadual. Não é testado no presidencial por nenhuma nacional recente. No governo de SP, a Datafolha 05/Jul deu Tarcísio 46% x Haddad 30%, com Haddad na maior rejeição do estado (47%). Lula organizou chapas ao Senado, com Cid Gomes no Ceará. STF impeach 2.80%."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1.40%",
    poll: "Caiado praticamente estável no vencedor: Poly 1.40% (vol USD 4,9M acumulado) e sobe no 3º lugar do 1º turno para 13.50%. É de NOVO o melhor da 3ª via na urna: a Genial/Quaest 15/Jul o dá com 4% no 1º turno, à frente de Renan (3%) e de Zema (2%), a terceira pesquisa seguida na liderança do pelotão. Chapa pura do PSD (Kassab vice).",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "15/Jul: Caiado ficou estável no vencedor (1.40%) e o contraste que o define persiste, embora tenha encolhido. Ele é o MELHOR da 3ª via na urna declarada pela terceira pesquisa seguida (4% na Quaest, à frente de Renan e Zema) e vale um sexto de Renan no mercado (1,40% contra 8,50%). O mercado precifica notoriedade, não intenção de voto. Foi protagonista político: saiu em defesa de Damares após ataques e criticou os tarifaços de EUA, UE e China (Correio Braziliense). STF impeach 2.80%."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0.80%",
    poll: "Zema no piso: Poly 0.80% (vol USD 4,3M). A Genial/Quaest 15/Jul o dá com 2% no 1º turno. Em pesquisas anteriores marcou voto igual ou acima de Renan (Futura/Apex 14/Jul 3,7%, BTG/Nexus 13/Jul 4%), o que mantém latente a distorção entre urna declarada e preço. Ainda não anunciou o vice.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "15/Jul: Zema segue no piso a 0.80% no vencedor. A Genial/Quaest o dá com 2% no 1º turno, atrás de Caiado (4%) e Renan (3%). Em nacionais anteriores marcou voto próximo ou acima de Renan, o que sustenta a leitura de distorção entre urna declarada e preço de mercado. Na bipolarização Lula x Flávio o Novo não encontra tração, e o vice ainda não saiu. STF impeach 2.80%."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.15%",
    poll: "Tarcísio estável a Poly 0.15% no presidencial (anomalia de legado, vol USD 13,4M acumulado, o maior do book). Não aparece nos cenários presidenciais das nacionais. O foco é a reeleição em SP, onde a Datafolha 05/Jul o dá liderando com 46% x Haddad 30% e aprovação de 45%. No Senado por cadeiras, o PL segue líder (84.50%).",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Tarcísio segue focado na reeleição em SP, onde lidera (Datafolha 05/Jul: 46% x Haddad 30%, aprovação de 45%). O mercado mantém o presidencial em 0.15% (anomalia de legado, volume herdado de apostas antigas, o maior do book a USD 13,4M). Não é testado no presidencial por nenhuma nacional recente. No mercado de Senado por número de cadeiras, o PL segue na liderança (84.50%), sinal de capilaridade da legenda num dia de rearranjo de chapas ao Senado nos estados. STF impeach 2.80%."
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
