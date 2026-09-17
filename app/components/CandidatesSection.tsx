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
    polymarket: "44,50%",
    poll: "TRÊS NACIONAIS SAÍRAM EM 17/Set: AtlasIntel (n=5.018, internet, margem de 1,0pp, BR-06221/2026), PoderData (n=3.000, telefone automatizado, margem de 1,8pp, BR-00360/2026) e Gerp (n=2.400, telefone, margem de 2pp, BR-00535/2026). No 1º turno ele tem 44,1% na AtlasIntel, à frente de Flávio Bolsonaro, 37% na PoderData, à frente, e 37% na Gerp, atrás. No 2º turno contra Flávio Bolsonaro fica atrás nas três: 46,8% a 47,2%, 44% a 46% e 43% a 50%, e cada casa repete a distância da própria rodada anterior.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "O PREÇO PAROU E O VÃO ABRIU PELO OUTRO LADO. O contrato de vencedor está em 44,50% (vol USD 11,19M acumulado), leitura confirmada de 17/Set, 13:21 BRT, sem movimento contra o preço confirmado em 16/Set, e a distância para Flávio Bolsonaro abriu de 9,25pp para 10,20pp. Os 44,50% ficam 23,00pp abaixo do topo da série dele, de 67,50% em 16/Ago. No contrato de 2º lugar do 1º turno ele cede 1,20pp, para 22,65%."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "54,70%",
    poll: "TRÊS NACIONAIS SAÍRAM EM 17/Set: AtlasIntel (n=5.018, internet, margem de 1,0pp, BR-06221/2026), PoderData (n=3.000, telefone automatizado, margem de 1,8pp, BR-00360/2026) e Gerp (n=2.400, telefone, margem de 2pp, BR-00535/2026). No 1º turno ele tem 41,7% na AtlasIntel, contra 37,4% em 10/Set, 36% na PoderData e 40% na Gerp, à frente de Lula só nesta. No 2º turno contra Lula fica à frente nas três: 47,2% a 46,8% e 46% a 44%, dentro das margens, e 50% a 43% na Gerp, fora delas.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "SOBE E SEGUE FAVORITO. Os 54,70% (vol USD 10,88M acumulado), leitura confirmada de 17/Set, 13:21 BRT, são uma alta de 0,95pp contra o preço confirmado em 16/Set e ficam 0,40pp abaixo do topo da série dele, de 55,10% em 10/Set. O vão para o segundo colocado abriu de 9,25pp para 10,20pp. No contrato de 2º lugar do 1º turno ele sobe 1,00pp, para 76,50%."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "1,15%",
    poll: "TRÊS NACIONAIS SAÍRAM EM 17/Set: AtlasIntel (n=5.018, internet, margem de 1,0pp, BR-06221/2026), PoderData (n=3.000, telefone automatizado, margem de 1,8pp, BR-00360/2026) e Gerp (n=2.400, telefone, margem de 2pp, BR-00535/2026). No 1º turno ele tem 5,1% na AtlasIntel, à frente de Augusto Cury, e 3% na PoderData e 2% na Gerp, atrás de Cury nas duas.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "CEDE 0,20pp NO CONTRATO DE VENCEDOR, para 1,15% (vol USD 13,60M acumulado), leitura confirmada de 17/Set, 13:21 BRT, abaixo do menor valor das leituras gravadas da série dele, de 1,20% em 31/Ago. O contrato dele é o segundo maior em volume acumulado do livro presidencial, atrás só do de Tarcísio de Freitas: volume mede interesse acumulado desde a abertura, não probabilidade de agora. No contrato de 3º lugar do 1º turno sobe 7,50pp, para 44,00%, e passa à frente de Augusto Cury."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0,05%",
    poll: "As nacionais de 17/Set não o testam em cenário presidencial de 1º turno. NO PREÇO, ele está em 0,05% no contrato de VENCEDOR, no piso do livro e abaixo do corte de 0,5% que o painel usa para tratar preço fino como ruído.",
    position: "Centro-esquerda. Ministro da Fazenda até a desincompatibilização. Foco no maior colégio eleitoral do país.",
    risk: "Parado no piso do livro, 0,05%, leitura confirmada de 17/Set, 13:21 BRT. Não é candidato à Presidência: disputa o governo de São Paulo, e por isso não aparece nos cenários presidenciais de 1º turno. O topo da série dele no contrato de vencedor é de 7,60%, em 26/Mai."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "0,15%",
    poll: "TRÊS NACIONAIS SAÍRAM EM 17/Set: AtlasIntel (n=5.018, internet, margem de 1,0pp, BR-06221/2026), PoderData (n=3.000, telefone automatizado, margem de 1,8pp, BR-00360/2026) e Gerp (n=2.400, telefone, margem de 2pp, BR-00535/2026). No 1º turno ele tem 1,7% na AtlasIntel e 3% na PoderData e na Gerp. Na AtlasIntel perde o par de 2º turno para Lula por 41,7% a 46,0%, fora de duas margens, depois do empate em 45,7% de 10/Set.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Candidato oficializado pelo PSD.",
    risk: "Parado em 0,15% no contrato de vencedor, leitura confirmada de 17/Set, 13:21 BRT, abaixo do corte de 0,5%. No contrato de 3º lugar do 1º turno cai 3,00pp, para 12,50%, com USD 133 mil acumulados."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0,05%",
    poll: "TRÊS NACIONAIS SAÍRAM EM 17/Set: AtlasIntel (n=5.018, internet, margem de 1,0pp, BR-06221/2026), PoderData (n=3.000, telefone automatizado, margem de 1,8pp, BR-00360/2026) e Gerp (n=2.400, telefone, margem de 2pp, BR-00535/2026). No 1º turno ele tem 1,1% na AtlasIntel e 1% na PoderData. Na AtlasIntel perde o par de 2º turno para Lula por 43,7% a 46,3%, fora de duas margens, depois de aparecer 0,2 ponto à frente em 10/Set.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Cede 0,10pp, para 0,05% no contrato de vencedor, leitura confirmada de 17/Set, 13:21 BRT, o piso do livro. O topo da série dele no contrato de vencedor é de 12,00%, em 13/Mai."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0,05%",
    poll: "As nacionais de 17/Set não o testam em cenário presidencial de 1º turno. NO PREÇO, ele está em 0,05% no contrato de VENCEDOR, no piso do livro e abaixo do corte de 0,5%.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Parado no piso do livro, 0,05%, leitura confirmada de 17/Set, 13:21 BRT, e ainda assim o contrato dele é o de maior volume acumulado do livro presidencial, USD 14,08M. Preço no piso com volume alto mede interesse passado, não probabilidade de agora."
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
