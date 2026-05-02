import type { CandidateProfile } from '../types';
import { partyColor } from '../lib/utils';
import { SectionTitle, Card } from './ui';
import { LogicLink } from './LogicLink';
import { useTranslation } from '../i18n/context';

// Os campos `polymarket`, `poll` e `risk` são atualizados pela skill /atualizar
// (a cada execução, o markdown dos JSONs e este arquivo são reescritos com
// dados frescos). O conteúdo abaixo é um snapshot evergreen, substituído na
// primeira execução de /atualizar pós-deploy.
const candidates: CandidateProfile[] = [
  {
    name: "Lula",
    party: "PT",
    age: 80,
    role: "Presidente da República",
    polymarket: "—",
    poll: "Atualizado pela rotina /atualizar com dados de Polymarket, AtlasIntel, Quaest e demais institutos TSE.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "Os indicadores de risco e cruzamento com pesquisas eleitorais e mercados de previsão são atualizados periodicamente. Veja o card de Sentimento e a síntese AFOS Daily para o quadro do dia."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "—",
    poll: "Atualizado pela rotina /atualizar com dados de Polymarket, AtlasIntel, Quaest e demais institutos TSE.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "Os indicadores de risco e cruzamento com pesquisas eleitorais e mercados de previsão são atualizados periodicamente. Veja o card de Sentimento e a síntese AFOS Daily para o quadro do dia."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "—",
    poll: "Atualizado pela rotina /atualizar com dados de Polymarket, AtlasIntel, Quaest e demais institutos TSE.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "Os indicadores de risco e cruzamento com pesquisas eleitorais e mercados de previsão são atualizados periodicamente. Veja o card de Sentimento e a síntese AFOS Daily para o quadro do dia."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "—",
    poll: "Atualizado pela rotina /atualizar com dados de Polymarket, AtlasIntel, Quaest e demais institutos TSE.",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Os indicadores de risco e cruzamento com pesquisas eleitorais e mercados de previsão são atualizados periodicamente. Veja o card de Sentimento e a síntese AFOS Daily para o quadro do dia."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "—",
    poll: "Atualizado pela rotina /atualizar com dados de Polymarket, AtlasIntel, Quaest e demais institutos TSE.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "Os indicadores de risco e cruzamento com pesquisas eleitorais e mercados de previsão são atualizados periodicamente. Veja o card de Sentimento e a síntese AFOS Daily para o quadro do dia."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "—",
    poll: "Atualizado pela rotina /atualizar com dados de Polymarket, AtlasIntel, Quaest e demais institutos TSE.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Os indicadores de risco e cruzamento com pesquisas eleitorais e mercados de previsão são atualizados periodicamente. Veja o card de Sentimento e a síntese AFOS Daily para o quadro do dia."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "—",
    poll: "Atualizado pela rotina /atualizar com dados de Polymarket, AtlasIntel, Quaest e demais institutos TSE.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Os indicadores de risco e cruzamento com pesquisas eleitorais e mercados de previsão são atualizados periodicamente. Veja o card de Sentimento e a síntese AFOS Daily para o quadro do dia."
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
