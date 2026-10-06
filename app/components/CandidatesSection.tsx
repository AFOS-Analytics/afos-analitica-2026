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
    polymarket: "15,50%",
    poll: "45,16% na urna do 1º turno",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "CAI 1,00pp NO CONTRATO DE VENCEDOR, em 15,50% (vol USD 18,45M acumulado), leitura confirmada de 06/Out, 15:05 BRT, contra a leitura confirmada de 05/Out às 17:31 BRT, publicada na rodada anterior. O vão de Flávio Bolsonaro sobre ele vai de 66,60pp para 68,80pp. Terminou o 1º turno 1,87 ponto atrás.",
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "84,30%",
    poll: "47,03% na urna do 1º turno",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "SOBE 1,20pp NO CONTRATO DE VENCEDOR, em 84,30% (vol USD 17,47M acumulado), leitura confirmada de 06/Out, 15:05 BRT, contra a leitura confirmada de 05/Out às 17:31 BRT, publicada na rodada anterior. Terminou o 1º turno 1,87 ponto à frente. Zema e Temer declararam voto nele, e Caiado fez pronunciamento conjunto com ele em Goiânia em 06/Out.",
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "fechado",
    poll: "2,24% na urna do 1º turno, eliminado",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "Contrato de vencedor fechado pela Polymarket depois do 1º turno e resolvido em zero, com USD 17,12M acumulados. Na noite de 04/Out disse que não apoia nenhum dos dois no 2º turno (Gazeta do Povo e Agência Brasil).",
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "fechado",
    poll: "não disputou a Presidência",
    position: "Centro-esquerda. Ministro da Fazenda até a desincompatibilização. Foco no maior colégio eleitoral do país.",
    risk: "Contrato de vencedor fechado pela Polymarket depois do 1º turno e resolvido em zero, com USD 7,74M acumulados.",
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "fechado",
    poll: "2,18% na urna do 1º turno, eliminado",
    position: "Centro-direita. Agronegócio, gestão fiscal. Candidato oficializado pelo PSD.",
    risk: "Contrato de vencedor fechado pela Polymarket depois do 1º turno e resolvido em zero, com USD 7,82M acumulados. O PSD ficou neutro no 2º turno, e ele fez pronunciamento conjunto com Flávio Bolsonaro em Goiânia em 06/Out (Poder360).",
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "fechado",
    poll: "0,27% na urna do 1º turno, eliminado",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Contrato de vencedor fechado pela Polymarket depois do 1º turno e resolvido em zero, com USD 7,74M acumulados. Declarou voto em Flávio Bolsonaro em 05/Out (G1 e Folha de S.Paulo).",
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "fechado",
    poll: "não disputou a Presidência; reeleito em SP com 62,65%",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Contrato de vencedor fechado pela Polymarket depois do 1º turno e resolvido em zero, com USD 14,96M acumulados.",
  },
];

/**
 * 🗳️ 2º turno, decisão do André em 05/Out/2026: os dois do 2º turno ficam em
 * destaque, e os demais vão para um bloco RECOLHIDO no fim da seção, com o
 * texto preservado. Sai da vitrine, fica no registro.
 */
const NO_2T = ['Lula', 'Flávio Bolsonaro'];

export function CandidatesSection() {
  const { t, locale } = useTranslation();
  const L = (pt: string, en: string, es: string) => (locale === 'en' ? en : locale === 'es' ? es : pt);
  const ativos = candidates.filter(c => NO_2T.includes(c.name));
  const fora = candidates.filter(c => !NO_2T.includes(c.name));
  const cartao = (c: CandidateProfile) => (
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
  );
  return (
    <section>
      <SectionTitle icon="👤" rightSlot={<LogicLink anchor="perfil-candidatos" />}>{t('sections.candidates')}</SectionTitle>
      <h3 className="font-semibold text-sm text-gray-600 mb-3">{L('No 2º turno', 'In the second round', 'En la segunda vuelta')}</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {ativos.map(cartao)}
      </div>
      {fora.length > 0 && (
        <details className="mt-6 group">
          <summary className="cursor-pointer text-sm font-semibold text-gray-600 hover:text-primary">
            {L(
              `Fora do 2º turno (${fora.length}): eliminados no 1º turno e nomes que não disputaram a Presidência`,
              `Out of the second round (${fora.length}): eliminated in the first round and names who did not run for president`,
              `Fuera de la segunda vuelta (${fora.length}): eliminados en la primera vuelta y nombres que no disputaron la Presidencia`,
            )}
          </summary>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {fora.map(cartao)}
          </div>
        </details>
      )}
    </section>
  );
}
