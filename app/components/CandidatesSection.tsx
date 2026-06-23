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
    polymarket: "53.50%",
    poll: "Lula recua do pico de ontem: Poly 53.50% (↓2.00pp, vol USD 6.7M acumulado), com o gap sobre Flávio fechando a +27.95pp (vinha do recorde +31.75pp). A reversão veio no mesmo dia em que uma pesquisa nacional nova ampliou Lula no 1º turno: a Indexa 23/Jun (n=2.000) deu 1T Lula 42% × Flávio 31% (gap +11pp), com Lula a 48.8% dos válidos, e 2T Lula 47% × Flávio 40% (gap +7pp), vence todos os rivais (JOTA, Bnews, UOL/Carla Araújo). Reforça a Datafolha 20/Jun (1T 41% × 31%; 2T 47% × 43%) e as nacionais de 15-16/Jun (CNT/MDA 2T 49.3% × 36.8%, BTG/Nexus 49% × 43%, aprovação 48% × 47%).",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTOS 23/Jun D+40: reversão parcial no mercado. Depois do gap recorde de ontem, o Polymarket devolveu parte do movimento e voltou um pouco para Flávio: Lula recuou a 53.50% (↓2.00pp) e o gap fechou a +27.95pp. A divergência do dia: a reprecificação a favor de Flávio veio no dia em que a Indexa 23/Jun ampliou Lula no 1º turno (42% × 31%, 48.8% dos válidos). O que moveu o mercado foi a frente estadual (RS, onde a Real Time Big Data dá Flávio 51% × Lula 42% no 2º turno) e a externa (Flávio se inscreveu em audiência nos EUA sobre o tarifaço, Estadão), não uma piora de Lula nas urnas. No governo, a operação da PF sobre Jaques Wagner segue em curso (CartaCapital). Volume total no presidencial acima de USD 100M. STF impeach a 4.30% (↑0.55pp)."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "25.55%",
    poll: "Flávio recupera terreno em Poly 25.55% (↑1.80pp, vol USD 6.9M acumulado) na sessão de reversão parcial, e o gap para Lula fecha a +27.95pp (vinha do recorde +31.75pp). A alta veio apesar de a nova nacional Indexa 23/Jun ampliar Lula no 1º turno (42% × 31%): o que o sustentou foi o RS, onde a Real Time Big Data deu Flávio 51% × Lula 42% no 2º turno e 42% × 39% no 1º (CNN Brasil, Poder360, UOL), e a inscrição em audiência nos EUA sobre o tarifaço (Estadão, Folha). A rejeição (48% na Datafolha, 52% na Nexus) segue a maior do páreo. Mantém isolado o 2º lugar do 1º turno (71.5%).",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 23/Jun: Flávio recupera no mercado. Na sessão de reversão parcial, subiu a 25.55% (↑1.80pp) e o gap para Lula fechou a +27.95pp. A divergência do dia: a alta veio apesar de a Indexa 23/Jun ampliar Lula no 1º turno nacional (42% × 31%, gap +11pp). O que sustentou Flávio foi o RS (RTBD 2º turno 51% × 42%) e a frente externa (audiência nos EUA sobre o tarifaço, onde deve pedir a suspensão do processo de sanções até a eleição, Estadão/Folha). O mercado corrigiu o gap esticado de ontem, não virou a tendência nacional. O TSE mandou retirar posts que o ligam ao crime organizado e à rachadinha (Pleno.News, CartaCapital), e a pré-campanha teme que o STF esvazie o TSE (Folha). STF impeach a 4.30% (↑0.55pp)."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "13.35%",
    poll: "Renan presidencial Poly 13.35% (↓0.35pp, vol USD 7.4M acumulado) no mercado de vencedor, e segue cravado como favorito ao 3º lugar do 1º turno (60.5% no sub-mercado), com o maior volume acumulado do presidencial. As nacionais o mantêm na faixa de 3% no 1º turno (Datafolha 20/Jun 3%, CNT/MDA 16/Jun 2%, Genial/Quaest 10/Jun 3%), embolado com Caiado e à frente de Zema/Aécio (2%). A divergência mercado × pesquisa segue a maior do dashboard, em ~10.35pp (13.35% × 3%). A Gazeta do Povo discute se ele é 'nome de terceira via para o futuro'.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "23/Jun: na sessão de reversão parcial, Renan recuou de leve no vencedor (13.35%, ↓0.35pp) e seguiu cravado como favorito ao 3º lugar do 1º turno (60.5% no sub-mercado), com o maior volume do presidencial. As pesquisas o medem a 3% no 1T, mantendo a divergência mais larga do dashboard (~10.35pp). A leitura é de um mercado que o precifica como provável 3º colocado, mas sem chance real de vencer (capital de nicho, não de vitória). A polarização que a Indexa descreve por 'voto fiel' (UOL) cristaliza Lula × Flávio e fragmenta o espaço da 3ª via. A Gazeta do Povo discute se Renan é nome de terceira via 'para o futuro'. STF impeach 4.30%."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "1.55%",
    poll: "Haddad recua de leve a Poly 1.55% (↓0.20pp, vol USD 5.9M acumulado), na faixa de Camilo Santana (1.65%) como nome do PT depois de Lula no mercado presidencial. As nacionais (Indexa 23/Jun, Datafolha 20/Jun) não testam Haddad no presidencial nacional (foco SP). A aprovação do governo segue acima da desaprovação na série BTG/Nexus (15/Jun 48% × 47%). Mantida Vox SP 30/Mai 2T estadual Tarcísio 48.3% × Haddad 36.5% (Poder360).",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Haddad recuou de leve a 1.55% (↓0.20pp) na sessão de reversão parcial, na faixa de Camilo Santana (1.65%), como nome do PT depois de Lula. Como ministro da Fazenda, no centro do PIX/tarifaço e do INSS, mas o mercado não precifica candidatura presidencial dele. A operação da PF no caso Master sobre Jaques Wagner, líder do governo no Senado, segue em curso (CartaCapital), o que pressiona a articulação do PT no Congresso. A aprovação do governo segue acima da desaprovação na série BTG/Nexus (48% × 47%). STF impeach 4.30%."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1.65%",
    poll: "Caiado sobe de leve a Poly 1.65% (↑0.10pp, vol USD 4.3M acumulado), ainda no piso da 3ª via, na sessão de reversão parcial. A Datafolha 20/Jun deu Caiado 3% no 1T (empatado com Renan) e 2T Lula 47% × Caiado 41% (gap -6pp, competitivo). A CNT/MDA deu 4% no 1T; e a Futura/Apex, num cenário SEM Flávio, dá Caiado 16.5% (lidera a 3ª via). Caiado domina entre os bolsonaristas em recorte da Quaest (Jornal Opção): é o nome posicionado para herdar o voto da direita se Flávio não for.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "Caiado subiu de leve a 1.65% (↑0.10pp, vol USD 4.3M), ainda no piso das apostas: o mercado precifica baixa a hipótese de Flávio sair da disputa. As nacionais o mantêm a 3% no 1T. No cenário sem Flávio, a Futura/Apex dá Caiado 16.5%, sinal de quanto voto da direita está represado em Flávio. No cenário com Flávio, o 'paradoxo da direita' (G1) explica o teto. A presença de Aécio nas nacionais disputa o mesmo nicho. STF impeach 4.30%."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "1.15%",
    poll: "Zema estável em Poly 1.15% (vol USD 3.8M), segue no piso da 3ª via. A Datafolha 20/Jun deu Zema 2% no 1T e 2T Lula 48% × Zema 39% (gap -9pp, o mais largo da 3ª via testada). Sem Flávio, a Futura/Apex dá Zema 13.3% (2º da 3ª via, atrás de Caiado). O Novo se equilibra entre a candidatura de Zema e alianças com o PL nos estados, atrito que dificulta a convergência da oposição.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Zema estável a 1.15% (vol USD 3.8M), e a 3ª via segue sem tração na disputa bipolarizada Lula × Flávio. A Datafolha 20/Jun o mediu a 2% no 1T e deu 2T Lula 48% × Zema 39%. No cenário sem Flávio, a Futura/Apex dá Zema 13.3%, fôlego latente, mas na disputa com Flávio o Novo não encontra tração. O partido se equilibra entre a candidatura dele e alianças com o PL nos estados. STF impeach 4.30%."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.15%",
    poll: "Tarcísio presidencial 0.15% Poly estável (vol USD ~12.9M acumulado, o maior do mercado, anomalia de legado). As nacionais (Indexa 23/Jun, Datafolha 20/Jun) não destacam Tarcísio no presidencial nacional (foco reeleição SP). Lula e Flávio intensificam a 'batalha por São Paulo' com agendas no estado (VEJA). Mantida Vox SP 30/Mai 2T estadual Tarcísio 48.3% × Haddad 36.5% (Poder360).",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Tarcísio segue focado na reeleição em SP, onde lidera, e o mercado mantém o presidencial em 0.15% (anomalia de legado, volume herdado de apostas antigas, o maior do book a USD 12.9M). SP virou praça decisiva: Lula e Flávio intensificam a batalha pelo estado (VEJA). No mercado de Senado por número de cadeiras, o PL segue na liderança (76.5%), sinal de capilaridade institucional da legenda. STF impeach 4.30%."
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
