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
    polymarket: "42,50%",
    poll: "A NACIONAL QUE ENTRA É A ATLASINTEL EM PARCERIA COM A BLOOMBERG, divulgada em 10/Set (n=5.000, campo 04 a 09/Set, margem de 1,0pp, BR-01452/2026), e o valor dela é ser da MESMA CASA que mediu em 31/Ago, com o mesmo método e a mesma margem. No 1º turno a vantagem de Lula caiu de 9,7 pontos para 5,6: ele foi de 43,4% para 43,0% e Flávio Bolsonaro foi de 33,7% para 37,4%. 🔁 OS CINCO PARES DE 2º TURNO ANDARAM TODOS NA MESMA DIREÇÃO, dois invertendo o sinal: contra Flávio, de 47,1% a 42,6% para 46,4% a 46,2%; contra Zema, de 47,0% a 40,7% para 46,2% a 46,0%; contra Caiado, de 46,6% a 41,0% para empate exato em 45,7%; contra Renan Santos, de 47,5% a 26,0% para 46,0% a 33,8%. ⚠️ Nos três primeiros a diferença cabe em duas margens de 1,0, então é EMPATE TÉCNICO. Os dois pares fora da margem são o de Augusto Cury, por 2,7 pontos, e o de Renan Santos, por 12,2. É a oitava nacional seguida desde 06/Set em que Lula não aparece à frente no par contra Flávio Bolsonaro. NO PREÇO, o contrato de vencedor CEDEU 1,00pp e está em 42,50% (vol USD 10,69M acumulado), leitura confirmada de 11/Set, 13:41 BRT, no segundo dia seguido de queda, e a distância para o segundo passou de 9,35pp para 11,45pp. No contrato de 2º lugar do 1º turno ele CAIU 1,60pp e está em 22,90% (vol USD 601 mil).",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "AS DUAS MEDIÇÕES ANDARAM PARA O MESMO LADO, E COM TAMANHOS MUITO DIFERENTES. O contrato de vencedor cedeu 1,00pp e está em 42,50% (vol USD 10,69M acumulado), leitura confirmada de 11/Set, 13:41 BRT, contra uma queda de 9,00pp na véspera, ou seja um décimo do movimento de ontem. ⭐ NA PESQUISA ELE ESTÁ PRATICAMENTE PARADO: 43,4% para 43,0% em onze dias dentro da mesma casa. A vantagem dele encolheu porque o adversário subiu 3,7 pontos, não porque ele caiu. São grandezas diferentes e não se subtraem: a pesquisa mede intenção de voto declarada e o contrato mede probabilidade. Em 11/Set elogiou Fachin por colocar ordem na casa, reclamou de vazamentos e defendeu a investigação de ministros do Supremo, segundo Valor Econômico e Folha de S.Paulo."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "53,95%",
    poll: "A NACIONAL QUE ENTRA É A ATLASINTEL EM PARCERIA COM A BLOOMBERG, divulgada em 10/Set (n=5.000, campo 04 a 09/Set, margem de 1,0pp, BR-01452/2026), e o valor dela é ser da MESMA CASA que mediu em 31/Ago, com o mesmo método e a mesma margem. No 1º turno a vantagem de Lula caiu de 9,7 pontos para 5,6: ele foi de 43,4% para 43,0% e Flávio Bolsonaro foi de 33,7% para 37,4%. 🔁 OS CINCO PARES DE 2º TURNO ANDARAM TODOS NA MESMA DIREÇÃO, dois invertendo o sinal: contra Flávio, de 47,1% a 42,6% para 46,4% a 46,2%; contra Zema, de 47,0% a 40,7% para 46,2% a 46,0%; contra Caiado, de 46,6% a 41,0% para empate exato em 45,7%; contra Renan Santos, de 47,5% a 26,0% para 46,0% a 33,8%. ⚠️ Nos três primeiros a diferença cabe em duas margens de 1,0, então é EMPATE TÉCNICO. Os dois pares fora da margem são o de Augusto Cury, por 2,7 pontos, e o de Renan Santos, por 12,2. É a oitava nacional seguida desde 06/Set em que Lula não aparece à frente no par contra Flávio Bolsonaro. Ele está em 37,4% no 1º turno e em 46,4% contra 46,2% no par de 2º turno, vantagem de dois décimos que cabe na margem. NO PREÇO, o contrato de vencedor SUBIU 1,10pp e está em 53,95% (vol USD 10,36M acumulado), leitura confirmada de 11/Set, 13:41 BRT, novo ponto mais alto da série dele, que começa em 14/Abr/2026. No contrato de 2º lugar do 1º turno SUBIU 3,00pp e está em 74,50% (vol USD 725 mil).",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "SEGUNDO DIA SEGUIDO DE ALTA NO CONTRATO DE VENCEDOR, agora 1,10pp, e os 53,95% renovam o topo da própria série. No contrato de 2º lugar do 1º turno ele subiu 3,00pp, desfazendo a queda de 7,00pp da véspera. 🔴 E O ATO DO DIA É SOBRE ELE: a queda do sigilo de 14 procedimentos do caso Master, decidida às 23h44 de 10/Set, tornou público que ele é investigado pela Polícia Federal DESDE JULHO de 2026, com autorização de André Mendonça, por lavagem de dinheiro, evasão de divisas e corrupção no financiamento do filme Dark Horse, segundo Gazeta do Povo, Poder360 e CartaCapital. ⚠️ A investigação não começou em 11/Set: o que mudou é que ela deixou de ser sigilosa. E a leitura de preço desta página é das 13:41 BRT, portanto POSTERIOR à divulgação. O AFOS registra a ordem dos fatos e não atribui causa ao preço."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "1,95%",
    poll: "A NACIONAL QUE ENTRA É A ATLASINTEL EM PARCERIA COM A BLOOMBERG, divulgada em 10/Set (n=5.000, campo 04 a 09/Set, margem de 1,0pp, BR-01452/2026), e o valor dela é ser da MESMA CASA que mediu em 31/Ago, com o mesmo método e a mesma margem. No 1º turno a vantagem de Lula caiu de 9,7 pontos para 5,6: ele foi de 43,4% para 43,0% e Flávio Bolsonaro foi de 33,7% para 37,4%. 🔁 OS CINCO PARES DE 2º TURNO ANDARAM TODOS NA MESMA DIREÇÃO, dois invertendo o sinal: contra Flávio, de 47,1% a 42,6% para 46,4% a 46,2%; contra Zema, de 47,0% a 40,7% para 46,2% a 46,0%; contra Caiado, de 46,6% a 41,0% para empate exato em 45,7%; contra Renan Santos, de 47,5% a 26,0% para 46,0% a 33,8%. ⚠️ Nos três primeiros a diferença cabe em duas margens de 1,0, então é EMPATE TÉCNICO. Os dois pares fora da margem são o de Augusto Cury, por 2,7 pontos, e o de Renan Santos, por 12,2. É a oitava nacional seguida desde 06/Set em que Lula não aparece à frente no par contra Flávio Bolsonaro. Ele está em 6,5% no 1º turno, contra 7,6% na mesma casa em 31/Ago, e perde o par de 2º turno por 46,0% a 33,8%, distância que encurtou 9,3 pontos em onze dias. NO PREÇO, o contrato de vencedor CEDEU 0,20pp e está em 1,95% (vol USD 13,26M acumulado), o segundo maior volume individual do livro presidencial, leitura confirmada de 11/Set, 13:41 BRT. No contrato de 3º LUGAR do 1º turno CAIU 4,00pp e está em 38,50% (vol USD 297 mil).",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "A MAIOR QUEDA DE QUALQUER CONTRATO DO PAINEL NESTA RODADA É DELE: 4,00pp no contrato de 3º lugar do 1º turno, de 42,50% para 38,50%, leitura confirmada de 11/Set, 13:41 BRT. No contrato de vencedor cedeu 0,20pp e está em 1,95%. ⭐ NA PESQUISA O SINAL VAI NA DIREÇÃO CONTRÁRIA: dentro da mesma casa e em onze dias, o par de 2º turno contra Lula encurtou 9,3 pontos. A dispersão entre casas segue sendo o traço dele, de 3% na PoderData a 11% na Palver sobre campos que se sobrepõem. Atribuiu a crise do Supremo ao centrão, segundo Valor Econômico."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0,05%",
    poll: "A AtlasIntel de 10/Set não o testa em cenário presidencial. NO PREÇO, ele está em 0,05% (vol USD 7,53M acumulado) no contrato de VENCEDOR, no piso do livro e abaixo do corte de 0,5% que o painel usa para separar preço de ruído, leitura confirmada de 11/Set, 13:41 BRT.",
    position: "Centro-esquerda. Ministro da Fazenda até a desincompatibilização. Foco no maior colégio eleitoral do país.",
    risk: "Parado no piso do livro, 0,05%, leitura confirmada de 11/Set, 13:41 BRT. Não é candidato à Presidência: disputa o governo de São Paulo, e por isso não aparece nos cenários presidenciais da nacional do dia."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "0,30%",
    poll: "A NACIONAL QUE ENTRA É A ATLASINTEL EM PARCERIA COM A BLOOMBERG, divulgada em 10/Set (n=5.000, campo 04 a 09/Set, margem de 1,0pp, BR-01452/2026), e o valor dela é ser da MESMA CASA que mediu em 31/Ago, com o mesmo método e a mesma margem. No 1º turno a vantagem de Lula caiu de 9,7 pontos para 5,6: ele foi de 43,4% para 43,0% e Flávio Bolsonaro foi de 33,7% para 37,4%. 🔁 OS CINCO PARES DE 2º TURNO ANDARAM TODOS NA MESMA DIREÇÃO, dois invertendo o sinal: contra Flávio, de 47,1% a 42,6% para 46,4% a 46,2%; contra Zema, de 47,0% a 40,7% para 46,2% a 46,0%; contra Caiado, de 46,6% a 41,0% para empate exato em 45,7%; contra Renan Santos, de 47,5% a 26,0% para 46,0% a 33,8%. ⚠️ Nos três primeiros a diferença cabe em duas margens de 1,0, então é EMPATE TÉCNICO. Os dois pares fora da margem são o de Augusto Cury, por 2,7 pontos, e o de Renan Santos, por 12,2. É a oitava nacional seguida desde 06/Set em que Lula não aparece à frente no par contra Flávio Bolsonaro. ⭐ NO PAR DE 2º TURNO CONTRA LULA ELE EMPATA EXATAMENTE EM 45,7%, e em 31/Ago a mesma casa o punha atrás por 41,0% a 46,6%. No 1º turno tem 1,1%. NO PREÇO, ele SUBIU 0,05pp e está em 0,30% no contrato de VENCEDOR, leitura confirmada de 11/Set, 13:41 BRT, ainda abaixo do corte de 0,5%. No contrato de 3º LUGAR do 1º turno está em 5,00%, sem variação.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Candidato oficializado pelo PSD.",
    risk: "O CONTRASTE ENTRE OS DOIS INSTRUMENTOS É O DADO DELE. A casa com a menor margem da janela o mede EMPATADO com Lula num par de 2º turno, 45,7% a 45,7%, e ao mesmo tempo o contrato de vencedor o põe em 0,30%, abaixo do corte de 0,5% que separa preço de ruído, leitura confirmada de 11/Set, 13:41 BRT. No contrato de 3º lugar do 1º turno ele fica parado em 5,00%, o único contrato vigiado que não se move nesta rodada. Sem ato individual novo em 11/Set no noticiário coletado."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0,15%",
    poll: "A NACIONAL QUE ENTRA É A ATLASINTEL EM PARCERIA COM A BLOOMBERG, divulgada em 10/Set (n=5.000, campo 04 a 09/Set, margem de 1,0pp, BR-01452/2026), e o valor dela é ser da MESMA CASA que mediu em 31/Ago, com o mesmo método e a mesma margem. No 1º turno a vantagem de Lula caiu de 9,7 pontos para 5,6: ele foi de 43,4% para 43,0% e Flávio Bolsonaro foi de 33,7% para 37,4%. 🔁 OS CINCO PARES DE 2º TURNO ANDARAM TODOS NA MESMA DIREÇÃO, dois invertendo o sinal: contra Flávio, de 47,1% a 42,6% para 46,4% a 46,2%; contra Zema, de 47,0% a 40,7% para 46,2% a 46,0%; contra Caiado, de 46,6% a 41,0% para empate exato em 45,7%; contra Renan Santos, de 47,5% a 26,0% para 46,0% a 33,8%. ⚠️ Nos três primeiros a diferença cabe em duas margens de 1,0, então é EMPATE TÉCNICO. Os dois pares fora da margem são o de Augusto Cury, por 2,7 pontos, e o de Renan Santos, por 12,2. É a oitava nacional seguida desde 06/Set em que Lula não aparece à frente no par contra Flávio Bolsonaro. ⭐ ELE APARECE À FRENTE DE LULA NO PAR DE 2º TURNO, por 46,2% a 46,0%, e em 31/Ago a mesma casa o punha atrás por 40,7% a 47,0%, ou seja o par andou 6,5 pontos em onze dias. No 1º turno tem 2,1%, o maior valor dele na janela. ⚠️ A vantagem de dois décimos cabe na margem, então é empate técnico. NO PREÇO, está em 0,15% (vol USD 6,92M acumulado) no contrato de VENCEDOR, leitura confirmada de 11/Set, 13:41 BRT, abaixo do corte de 0,5%. No contrato de 3º LUGAR do 1º turno está em 0,80%.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Parado em 0,15% no contrato de vencedor (vol USD 6,92M acumulado), leitura confirmada de 11/Set, 13:41 BRT, abaixo do corte de 0,5%. ⭐ E ele é, junto com Ronaldo Caiado, o caso em que os dois instrumentos desta página mais divergem: a casa o mede à frente de Lula num par de 2º turno, dentro da margem, e o mercado o põe em 0,15% para vencer a eleição. O AFOS descreve a divergência e não decide qual dos dois está certo."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0,05%",
    poll: "A AtlasIntel de 10/Set não o testa em cenário presidencial de 1º turno. NO PREÇO, ele está em 0,05% (vol USD 14,07M acumulado) no contrato de VENCEDOR, no piso do livro e abaixo do corte de 0,5%, leitura confirmada de 11/Set, 13:41 BRT.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Parado no piso do livro, 0,05%, leitura confirmada de 11/Set, 13:41 BRT, e ainda assim o contrato dele é o de maior volume acumulado do painel presidencial, USD 14,07M. Preço no piso com volume alto mede quanto já se negociou, não quanto se espera dele agora."
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
