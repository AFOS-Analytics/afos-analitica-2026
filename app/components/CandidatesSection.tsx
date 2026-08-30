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
    polymarket: "55,50%",
    poll: "SEM PESQUISA NACIONAL NOVA neste domingo. A mais recente segue sendo a Vox Brasil de 29/Ago (n=2.100, presencial, campo 25 a 27/Ago, BR-05519/2026), que lhe dá 37,1% no 1º turno contra 34,8%, distância de 2,3 pontos, e 44,5% no 2º turno contra 45,1%, atrás por 0,6 ponto dentro da margem de 2,15pp. Rejeição de 52,7%, segundo CNN Brasil. O registro do TSE traz oito nacionais com divulgação prevista entre 31/Ago e 03/Set. NO PREÇO, leitura confirmada de 30/Ago, 16:40 BRT (19:40 UTC), em 55,50% (vol USD 9,50M acumulado), SEM VARIAÇÃO.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "SEM VARIAÇÃO, em 55,50% (vol USD 9,50M acumulado), leitura confirmada de 30/Ago, 16:40 BRT (19:40 UTC). O preço dele não sai de 55,50% desde a tarde de 29/Ago, em nove capturas seguidas da série. A distância para o segundo colocado caiu para 14,40pp, a mais estreita desde 10/Jun, e todo o estreitamento das últimas 24 horas veio do lado do adversário. Na campanha, a equipe dele abriu ofensiva no TSE contra o rival, Caiado e Zema por postagens e discursos, segundo Folha de S.Paulo, e pediu a inelegibilidade do adversário por abuso econômico, segundo Metrópoles."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "41,10%",
    poll: "SEM PESQUISA NACIONAL NOVA neste domingo. A mais recente segue sendo a Vox Brasil de 29/Ago (n=2.100, presencial, campo 25 a 27/Ago, BR-05519/2026), que o dá em 34,8% no 1º turno, a 2,3 pontos do líder, e em 45,1% no 2º turno, à frente por 0,6 ponto dentro da margem de 2,15pp. Na janela de 30 dias do painel ele já aparecia à frente do returno na Gerp de 26/Ago, na Veritá de 21/Ago e na Gerp de 11/Ago. NO PREÇO, leitura confirmada de 30/Ago, 16:40 BRT (19:40 UTC), em 41,10% (vol USD 9,31M acumulado), ALTA de 1,75pp.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "ALTA de 1,75pp, de 39,35% para 41,10% (vol USD 9,31M acumulado), leitura confirmada de 30/Ago, 16:40 BRT (19:40 UTC). É a MAIOR variação do painel neste domingo e o preço mais alto dele desde 13/Mai, sem ser máximo da série, que segue em 45,50% de 06/Mai. A subida correu de forma quase contínua ao longo do dia. No contrato de 2º lugar do 1º turno está em 85,50%. Encontrou o ministro da Justiça de Bukele, disse se inspirar no modelo de El Salvador e afirmou que o Brasil tem pouco preso, segundo Estadão e Folha de S.Paulo."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "2,25%",
    poll: "SEM PESQUISA NACIONAL NOVA neste domingo. A mais recente segue sendo a Vox Brasil de 29/Ago (n=2.100, presencial, campo 25 a 27/Ago, BR-05519/2026), que o mede em 3,3% no 1º turno, o quarto nome da tabela, à frente de Romeu Zema, com 2,8%, e de Augusto Cury, com 2,6%, e atrás de Ronaldo Caiado, com 5,0%. NO PREÇO, leitura confirmada de 30/Ago, 16:40 BRT (19:40 UTC), em 2,25% (vol USD 11,88M acumulado), SEM VARIAÇÃO.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "SEM VARIAÇÃO, em 2,25% (vol USD 11,88M acumulado), leitura confirmada de 30/Ago, 16:40 BRT (19:40 UTC). O DADO DO DIA É A AUSÊNCIA DE MOVIMENTO: Dias Toffoli citou indícios de ilicitude no registro de candidatura dele e adiou o julgamento da chapa, com sete veículos publicando entre 15h47 e 18h56 de Brasília, e o preço não reagiu, inclusive na captura posterior à notícia. O livro dele acumula USD 11,88M, o maior entre os candidatos do painel, num contrato que hoje paga menos de 3%. O TSE começa a julgar os registros de candidatura nesta segunda, segundo Veja."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0,05%",
    poll: "Nenhuma nacional da janela o testa em cenário presidencial de 1º turno, inclusive a Vox Brasil de 29/Ago. NO PREÇO, leitura confirmada de 30/Ago, 16:40 BRT (19:40 UTC), em 0,05% (vol USD 7,41M acumulado), estável e abaixo do corte de 0,5% que o painel usa para separar preço de ruído.",
    position: "Centro-esquerda. Ministro da Fazenda até a desincompatibilização. Foco no maior colégio eleitoral do país.",
    risk: "Sem variação, em 0,05% (vol USD 7,41M acumulado), leitura confirmada de 30/Ago, 16:40 BRT (19:40 UTC), abaixo do corte de 0,5% que o painel usa para separar preço de ruído. Não é candidato à Presidência: disputa o governo de São Paulo. O preço presidencial dele é resíduo de livro, não medida de campanha."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "0,15%",
    poll: "SEM PESQUISA NACIONAL NOVA neste domingo. A mais recente segue sendo a Vox Brasil de 29/Ago (n=2.100, presencial, campo 25 a 27/Ago, BR-05519/2026), que o coloca em 5,0% no 1º turno, o TERCEIRO nome da tabela, à frente de Renan Santos, de Romeu Zema e de Augusto Cury. No 2º turno perde para o líder por 45,5% a 41,1%, distância de 4,4 pontos. NO PREÇO, leitura confirmada de 30/Ago, 16:40 BRT (19:40 UTC), em 0,15% (vol USD 6,97M acumulado), queda de 0,10pp e abaixo do corte de 0,5%.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Candidato oficializado pelo PSD.",
    risk: "QUEDA de 0,10pp, para 0,15% (vol USD 6,97M acumulado), leitura confirmada de 30/Ago, 16:40 BRT (19:40 UTC), abaixo do corte de 0,5%. E A DISTÂNCIA ENTRE OS INSTRUMENTOS FICA MAIS NÍTIDA NESTA RODADA: a urna declarada lhe dá 5,0% no 1º turno, o contrato de vencedor paga 0,15% e o contrato de 3º lugar do 1º turno o coloca em PRIMEIRO, com 43,50%. As três grandezas não se subtraem, porque medem coisas diferentes. Está entre os alvos da ofensiva que a campanha do líder abriu no TSE, segundo Folha de S.Paulo."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0,05%",
    poll: "SEM PESQUISA NACIONAL NOVA neste domingo. A mais recente segue sendo a Vox Brasil de 29/Ago (n=2.100, presencial, campo 25 a 27/Ago, BR-05519/2026), que o mede em 2,8% no 1º turno e testa um cenário de 2º turno em que ele perde para o líder por 45,5% a 39,3%, distância de 6,2 pontos. NO PREÇO, leitura confirmada de 30/Ago, 16:40 BRT (19:40 UTC), em 0,05% (vol USD 6,37M acumulado), sem variação e abaixo do corte de 0,5%.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Sem variação, em 0,05% (vol USD 6,37M acumulado), leitura confirmada de 30/Ago, 16:40 BRT (19:40 UTC), abaixo do corte de 0,5%. No contrato de 3º lugar do 1º turno está em 2,15%. Está entre os alvos da ofensiva que a campanha do líder abriu no TSE por postagens e discursos, segundo Folha de S.Paulo, e o registro de candidatura dele entra em julgamento no TSE nesta segunda, segundo Veja."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0,05%",
    poll: "Nenhuma nacional da janela o inclui em cenário presidencial, inclusive a Vox Brasil de 29/Ago. A ressalva do painel segue valendo como ato datado: ele abriu campanha ao GOVERNO DE SÃO PAULO em 16/Ago, segundo O Globo e o Times Brasil. NO PREÇO, leitura confirmada de 30/Ago, 16:40 BRT (19:40 UTC), em 0,05% (vol USD 14,06M acumulado), estável, abaixo do corte de 0,5% e sobre o MAIOR volume acumulado de todo o livro presidencial.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Sem variação, em 0,05% (vol USD 14,06M acumulado), leitura confirmada de 30/Ago, 16:40 BRT (19:40 UTC). Não é candidato à Presidência: disputa a reeleição em São Paulo. É o MAIOR volume acumulado de todo o livro presidencial sustentando o menor preço, e isso é fato sobre o histórico do contrato, não sobre a candidatura de hoje."
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
