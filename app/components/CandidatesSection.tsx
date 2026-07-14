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
    poll: "Lula PARADO pelo 5º dia: Poly 60.50% (vol USD 7,3M acumulado), com o gap sobre Flávio caindo a +35.65pp (↓1,00pp), a 82 dias do 1º turno. E o gap caiu porque Flávio subiu, não porque ele cedeu. O dado do dia é a TERCEIRA pesquisa seguida a apontar estreitamento: a Futura/Apex (n=2.000, campo 07-11/Jul, margem 2,2pp, BR-07294/2026) o dá com 40,1% no 1º turno contra 36,8% de Flávio, intervalos sobrepostos, e com 46,3% x 46,1% no 2º turno. São 0,2 ponto, o empate mais apertado do ciclo.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTOS 14/Jul D+61: a 82 dias do 1º turno, a terceira nacional consecutiva apontou estreitamento e o mercado não se moveu um centavo. A Futura/Apex põe o 2º turno em 46,3% x 46,1%, diferença de 0,2 ponto, depois da BTG/Nexus de 13/Jul (47 x 44, empate técnico) e da Gerp de 08/Jul (Flávio VENCENDO o returno). Em 12/Jul a ressalva obrigatória era que a Gerp é instituto pequeno e outlier conhecido. Essa ressalva ACABOU: são três institutos, três metodologias, uma direção. E o Polymarket segue dando 60.50%, exatamente o mesmo número de cinco dias atrás. Ele não reagiu a nenhuma das três. Sustentar 60,50% de probabilidade com um returno empatado em 0,2 ponto exige uma convicção que a urna declarada não sustenta, e ela sobreviveu a três dados que a contradizem. Próximo teste: Quaest 15/Jul (n=2.004) e PoderData 16/Jul (n=2.400). STF impeach no piso a 2.75%. Volume no presidencial USD 112,8M."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "24.85%",
    poll: "Flávio sobe: Poly 24.85% (↑1,00pp, vol USD 7,4M acumulado) e amplia o 2º lugar do 1º turno para 84.50% (↑1,00pp). Foi o ÚNICO movimento relevante do presidencial no dia. Nas urnas, a Futura/Apex 14/Jul o põe a 0,2 ponto de Lula no 2º turno (46,1% x 46,3%), o mais perto que ele já chegou. Somada à BTG/Nexus (44 x 47) e à Gerp (45 x 42, VENCENDO), são três nacionais consecutivas que o colocam a 3pp ou menos. Rejeição segue a maior do páreo.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 14/Jul: Flávio subiu a 24.85% e ampliou o 2º lugar do 1º turno para 84.50%. Nas urnas, três nacionais consecutivas o põem a 3pp ou menos de Lula no returno, e a Futura/Apex quase zera a distância (46,1% x 46,3%). No institucional, ele MUDOU DE ESTRATÉGIA após o veto de Moraes às visitas a Jair Bolsonaro (suspensas por 90 dias, até meados de outubro) e ampliou os ataques ao STF para reagir ao desgaste. Zema classificou a decisão como perseguição política. Mourão cobrou dele prestação de contas sobre a Dark Horse e criticou a ala bolsonarista. Michelle ganhou protagonismo no partido após a decisão e Damares saiu publicamente em sua defesa, embora diga que Flávio ainda é sua pré-candidata. STF impeach 2.75%."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "10.15%",
    poll: "Renan sobe de leve: Poly 10.15% (↑0,10pp, vol USD 8,1M acumulado, o maior volume individual entre os contendores vivos) e amplia o 3º lugar do 1º turno para 71.00% (↑0,50pp). As urnas seguem discordando: a Futura/Apex 14/Jul o mede em 2,6% no 1º turno, ATRÁS de Caiado (5,0%) E de Zema (3,7%). O favorito folgado do mercado ao 3º lugar é o TERCEIRO nome da 3ª via na pesquisa mais recente.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "14/Jul: Renan subiu de leve a 10.15% e ampliou o 3º lugar do 1º turno a 71.00%. A divergência voltou a se APROFUNDAR: mercado 10,15% contra 2,6% na Futura/Apex, onde ele cai para TERCEIRO na 3ª via, atrás de Caiado (5,0%) e Zema (3,7%). É a divergência mais larga do dashboard, e a pior medição dele em nacional no ciclo. Nenhuma nacional o mediu acima de 4% até hoje. Segue com o maior volume acumulado individual entre os contendores vivos (USD 8,1M), o que dá densidade ao preço mas não substitui lastro eleitoral. Faltam duas nacionais nesta semana (Quaest 15/Jul, PoderData 16/Jul): se ele não aparecer acima de 4% em nenhuma, o preço de dois dígitos fica descoberto. STF impeach 2.75%."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0.80%",
    poll: "Haddad estável a Poly 0.80% (vol USD 6,2M acumulado), como nome do PT depois de Lula. Não aparece nos cenários presidenciais da Futura/Apex 14/Jul nem da BTG/Nexus 13/Jul: as pesquisas não o testam no presidencial (foco no governo de SP). Na Datafolha SP 05/Jul, Tarcísio lidera com 46% x Haddad 30%, com Haddad na maior rejeição do estado (47%).",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Haddad estável a 0.80%, como nome do PT depois de Lula. O mercado não precifica candidatura presidencial dele; o foco é estadual. Não é testado no presidencial por nenhuma das nacionais recentes (Futura/Apex 14/Jul, BTG/Nexus 13/Jul, Gerp e Meio/Ideia 08/Jul). No governo de SP, a Datafolha 05/Jul deu Tarcísio 46% x Haddad 30%, com Haddad na maior rejeição do estado (47%). Mantém França vice na chapa de SP. Lula fechou palanques em 25 estados e no DF, com sacrifícios locais. STF impeach 2.75%."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1.35%",
    poll: "Caiado recua de leve no vencedor: Poly 1.35% (↓0,10pp, vol USD 4,9M acumulado) e cai no 3º lugar do 1º turno (16.50%). Mas é de NOVO o melhor da 3ª via na urna: a Futura/Apex 14/Jul o dá com 5,0% no 1º turno, à frente de Zema (3,7%) e de Renan (2,6%), repetindo o padrão da BTG/Nexus 13/Jul (5%). Chapa pura do PSD (Kassab vice).",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "14/Jul: Caiado recuou de leve no vencedor (1.35%) e o contraste que o define ficou ainda mais nítido. Ele é o MELHOR da 3ª via na urna declarada pela segunda pesquisa seguida (5,0% na Futura/Apex, à frente de Zema e Renan) e vale um sétimo de Renan no mercado (1,35% contra 10,15%). O mercado precifica notoriedade, não intenção de voto. No campo político, ele SUBIU O TOM para se firmar como alternativa a Flávio, num momento em que o adversário sofre desgaste institucional (Moraes suspendeu por 90 dias suas visitas a Jair Bolsonaro). Na Gerp 08/Jul tem a menor margem de derrota no 2º turno contra Lula (40 x 36). STF impeach 2.75%."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0.85%",
    poll: "Zema no piso: Poly 0.85% (vol USD 4,3M). Mas marca 3,7% no 1º turno da Futura/Apex 14/Jul, à FRENTE de Renan Santos (2,6%), que vale 10.15% no mercado. É a maior distorção relativa entre urna declarada e preço no painel da 3ª via. Ainda não anunciou o vice.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "14/Jul: Zema segue no piso a 0.85% no vencedor. A Futura/Apex o dá com 3,7% no 1º turno, ou seja, À FRENTE de Renan Santos (2,6%), que o mercado precifica em 10,15%. Mais intenção de voto declarada e um doze avos do preço. É a maior distorção relativa do painel e um caso limpo da tese do AFOS, porque a divergência aqui não é entre mercado e pesquisa em geral, é entre dois candidatos cuja medição de urna se INVERTEU sem que os preços se mexessem. Classificou como perseguição política a decisão de Moraes que suspendeu as visitas de Flávio ao pai. Sem vice anunciado. STF impeach 2.75%."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.15%",
    poll: "Tarcísio estável a Poly 0.15% no presidencial (anomalia de legado, vol USD 13,4M acumulado, o maior do book). Não aparece nos cenários presidenciais da Futura/Apex 14/Jul nem da BTG/Nexus 13/Jul. O foco é a reeleição em SP, onde a Datafolha 05/Jul o dá liderando com 46% x Haddad 30% e aprovação de 45%. No Senado por cadeiras, o PL segue líder (86.50%).",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Tarcísio segue focado na reeleição em SP, onde lidera (Datafolha 05/Jul: 46% x Haddad 30%, aprovação de 45%). O mercado mantém o presidencial em 0.15% (anomalia de legado, volume herdado de apostas antigas, o maior do book a USD 13,4M). Não é testado no presidencial por nenhuma nacional recente. No mercado de Senado por número de cadeiras, o PL segue na liderança (86.50%), sinal de capilaridade da legenda num dia em que Michelle ganha protagonismo interno e Mourão cobra prestação de contas de Flávio. STF impeach 2.75%."
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
