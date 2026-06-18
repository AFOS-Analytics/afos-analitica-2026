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
    polymarket: "50.50%",
    poll: "Lula fica estável no platô do ciclo: Poly 50.50% (vol USD 6.53M acumulado), mas o gap sobre Flávio recua a +24.55pp, abaixo do recorde de ontem (+26.45pp), pela recuperação do adversário. Sem pesquisa nacional nova em 18/Jun, o pano de fundo das urnas segue o das três nacionais de 15-16/Jun: CNT/MDA (n=2.002, campo 10-14/Jun, BR-04256/2026) 2T 49.3% × 36.8% (gap +12.5pp), o maior do recorte; Futura/Apex 2T 48.1% × 42.9%; BTG/Nexus 2T 49% × 43% (aprovação 48% × 47%). Próximo teste: a Datafolha 19/Jun, com Aécio Neves e Joaquim Barbosa (G1).",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTOS 18/Jun D+35: sem pesquisa nova, dia de reversão parcial no mercado. Lula ficou estável a 50.50% e Flávio recuperou a 25.95% (↑1.90pp), estreitando o gap a +24.55pp (abaixo do recorde de ontem). O pano de fundo das urnas segue favorável, com três nacionais de 15-16/Jun (CNT/MDA, Futura/Apex e BTG/Nexus) todas com Lula ampliando. Na política, o caso Master respingou no governo: nova fase da PF mira Jaques Wagner, líder do governo no Senado, mas o Planalto vê dano menor que o de Flávio (Estadão, BBC). O mercado não puniu Lula. Volume total no presidencial USD 101.6M. STF impeach recua a 2.45% (vol baixo)."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "25.95%",
    poll: "Flávio recupera parte da queda da semana em Poly 25.95% (↑1.90pp, vol USD 6.71M acumulado), estreitando o gap para o presidente a +24.55pp, abaixo do recorde de ontem. Sem pesquisa nova, o pano de fundo das urnas segue adverso: CNT/MDA 16/Jun 1T 28.2% (gap -13.6pp); 2T 36.8% (perde 49.3% × 36.8%), o pior 2º turno do recorte; a Futura/Apex é mais branda (2T 42.9%, gap -5.2pp). No dia, lançou um plano de segurança radical (castração química, prisões no modelo Bukele, 500 mil vagas, Money Times, Pleno.News). O PL só pretende oficializar a candidatura no fim de julho em SP (Gazeta do Povo).",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 18/Jun: Flávio recuperou a 25.95% (↑1.90pp), estreitando o gap para Lula a +24.55pp (abaixo do recorde de ontem). O movimento coincide com a simetria do caso Master, que passou a respingar no governo (nova fase da PF mira Jaques Wagner, Estadão). Para reagir, lançou um plano de segurança radical (castração química, prisões Bukele, Money Times), enquanto Caiado dizia que ele 'perdeu a chance' de vencer Lula (G1). No STF, Nunes Marques assumiu a ação de Flávio que pede investigar Lula (Portal VV8). STF impeach recua a 2.45% (↓1.15pp)."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "14.55%",
    poll: "Renan presidencial Poly 14.55% (↓1.20pp, vol USD 7.21M acumulado), devolve parte da alta da semana e recua no posto de favorito ao 3º lugar do 1º turno (46.55% no sub-mercado, ↓7pp), ainda com o maior volume acumulado do mercado presidencial. Com o recuo, a divergência mercado × pesquisa estreita para ~12.55pp (14.55% × 2% da CNT/MDA 16/Jun), mas segue a maior do dashboard. O noticiário resume o paradoxo: Renan cresce, mas não ameaça (Notícias Tudo Aqui), o mercado precifica conversão futura sem lastro nas urnas.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "18/Jun: Renan devolveu parte da alta da semana, a 14.55% (↓1.20pp), recuando no posto de favorito ao 3º lugar do 1º turno (46.55%, ↓7pp); a divergência ante a CNT/MDA (2% no 1T) estreita para ~12.55pp, mas segue a maior do dashboard. A recuperação de Flávio veio junto com o recuo de Renan, sinal de vasos comunicantes na precificação da oposição. O 'paradoxo da direita' (G1) reforça que nenhum nome anti-Lula converteu a fraqueza de Flávio em voto. Sinal a monitorar: a Datafolha 19/Jun, que confirme ou não o patamar de 2-3% no 1T. STF impeach 2.45%."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "1.85%",
    poll: "Haddad fica estável a Poly 1.85% (vol USD 5.78M acumulado), à frente de Camilo Santana (1.75%) como nome do PT depois de Lula no mercado presidencial. CNT/MDA e Futura/Apex 16/Jun não listam Haddad no presidencial nacional (foco SP). Mantida Vox SP 30/Mai 2T estadual Tarcísio 48.3% × Haddad 36.5% (Poder360).",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Haddad segue como nome do PT depois de Lula no mercado presidencial (1.85%, à frente de Camilo Santana 1.75%). Como ministro da Fazenda, no centro da disputa do PIX/tarifaço e do INSS, mas o mercado não precifica candidatura presidencial dele. A nova fase da PF no caso Master alcançou Jaques Wagner, líder do governo no Senado (BBC), o que pressiona a articulação política do PT. A aprovação do governo segue acima da desaprovação (Nexus 48% × 47%). STF impeach 2.45%."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "2.20%",
    poll: "Caiado sobe de leve a Poly 2.20% (↑0.25pp, vol USD 4.18M acumulado), ainda no piso da 3ª via. CNT/MDA 16/Jun: 1T Caiado 4%, à frente da 3ª via com Flávio na disputa; e a Futura/Apex, num cenário SEM Flávio, dá Caiado 16.5% (lidera a 3ª via). No dia, disse que Flávio 'perdeu a chance' de vencer Lula (G1). Caiado domina entre os bolsonaristas em recorte da Quaest (Jornal Opção): é o nome posicionado para herdar o voto da direita se Flávio não for.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "Caiado subiu de leve a 2.20% (↑0.25pp, vol USD 4.18M), ainda no piso das apostas: o mercado precifica baixa a hipótese de Flávio sair da disputa. No dia, foi à ofensiva e disse que Flávio 'perdeu a chance' de vencer Lula (G1). No cenário sem Flávio, a Futura/Apex 16/Jun dá Caiado 16.5%, sinal de quanto voto da direita está represado em Flávio. No cenário com Flávio, o 'paradoxo da direita' (G1) explica o teto. A Datafolha 19/Jun, que passa a testar Aécio e Joaquim Barbosa (G1), acirra a disputa pelo mesmo nicho. STF impeach 2.45%."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "1.45%",
    poll: "Zema fica estável a Poly 1.45% (vol USD 3.72M), segue no piso da 3ª via. CNT/MDA 16/Jun: 1T Zema 2.8% (com Flávio); sem Flávio, a Futura/Apex dá Zema 13.3% (2º da 3ª via, atrás de Caiado). Zema diz ter mais restrições a Lula do que a Flávio após a troca de críticas na direita (G1), atrito que expõe a dificuldade de convergência da direita. O Novo se equilibra entre a candidatura de Zema e alianças com o PL nos estados.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Zema ficou estável a 1.45%, e a 3ª via segue sem tração na disputa bipolarizada Lula × Flávio. No cenário sem Flávio, a Futura/Apex 16/Jun dá Zema 13.3%, fôlego latente. Zema diz ter mais restrições a Lula do que a Flávio após a troca de críticas na direita (G1), sinal do atrito que dificulta qualquer convergência da oposição. STF impeach 2.45%."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.15%",
    poll: "Tarcísio presidencial 0.15% Poly estável (vol USD ~12.7M acumulado, o maior do mercado, anomalia de legado). CNT/MDA e Futura/Apex 16/Jun não destacam Tarcísio no presidencial nacional (foco reeleição SP). Mantida Vox SP 30/Mai 2T estadual Tarcísio 48.3% × Haddad 36.5% (Poder360).",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Tarcísio segue focado na reeleição em SP, onde lidera, e o mercado mantém o presidencial em 0.15% (anomalia de legado, volume herdado de apostas antigas, o maior do book a USD 12.8M). No mercado de Senado por número de cadeiras, o PL amplia a liderança (77.5%, ↑2.5pp), sinal de capilaridade institucional da legenda. STF impeach 2.45%."
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
