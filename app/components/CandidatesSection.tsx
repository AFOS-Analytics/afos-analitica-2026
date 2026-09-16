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
    poll: "A DATATRENDS SAIU EM 16/Set (n=2.000, campo 12 a 14/Set, telefone automatizado, margem de 2,19pp, BR-08691/2026). No 1º turno ele tem 39%, à frente de Flávio Bolsonaro, com 35%. No 2º turno contra Flávio Bolsonaro tem 44% a 45%, 1 ponto atrás, dentro da margem. A Indexa/Broadcast de 15/Set, também por telefone, o punha 1 ponto à frente no mesmo par, e a CNT/MDA de 15/Set, presencial, 7,3 pontos à frente.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "O PREÇO CAIU E O VÃO ABRIU. O contrato de vencedor está em 44,50% (vol USD 11,16M acumulado), leitura confirmada de 16/Set, 12:41 BRT, queda de 2,00pp contra a leitura confirmada de 15/Set, e a distância para Flávio Bolsonaro abriu de 5,45pp para 9,25pp. Os 44,50% ficam 23,00pp abaixo do topo da série dele, de 67,50% em 16/Ago. No contrato de 2º lugar do 1º turno ele sobe 2,00pp, para 23,85%."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "53,75%",
    poll: "A DATATRENDS SAIU EM 16/Set (n=2.000, campo 12 a 14/Set, telefone automatizado, margem de 2,19pp, BR-08691/2026). No 1º turno ele tem 35%, atrás de Lula, com 39%. No 2º turno contra Lula tem 45% a 44%, 1 ponto à frente, dentro da margem. No mesmo par, a Indexa/Broadcast de 15/Set o punha 1 ponto atrás e a CNT/MDA de 15/Set 7,3 pontos atrás.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "SOBE E SEGUE FAVORITO. Os 53,75% (vol USD 10,82M acumulado), leitura confirmada de 16/Set, 12:41 BRT, são uma alta de 1,80pp contra a leitura confirmada de 15/Set e ficam 1,35pp abaixo do topo da série dele, de 55,10% em 10/Set. O vão para o segundo colocado abriu de 5,45pp para 9,25pp. No contrato de 2º lugar do 1º turno ele cede 1,00pp, para 75,50%."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "1,35%",
    poll: "A DATATRENDS SAIU EM 16/Set (n=2.000, campo 12 a 14/Set, telefone automatizado, margem de 2,19pp, BR-08691/2026). No 1º turno ele tem 4%, à frente de Ronaldo Caiado e de Romeu Zema. Nas duas nacionais de 15/Set tinha 3% e 2,7%.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "CEDE 0,30pp NO CONTRATO DE VENCEDOR, para 1,35% (vol USD 13,54M acumulado), leitura confirmada de 16/Set, 12:41 BRT, e fica a 0,15pp do piso da série dele, de 1,20% em 31/Ago. O contrato dele é o segundo maior em volume acumulado do livro presidencial, atrás só do de Tarcísio de Freitas, e paga 1,35%: volume mede interesse acumulado desde a abertura, não probabilidade de agora. No contrato de 3º lugar do 1º turno cai 1,00pp contra o valor publicado de 14/Set, para 36,50%."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0,05%",
    poll: "A DataTrends de 16/Set não o testa em cenário presidencial de 1º turno. NO PREÇO, ele está em 0,05% no contrato de VENCEDOR, no piso do livro e abaixo do corte de 0,5% que o painel usa para tratar preço fino como ruído.",
    position: "Centro-esquerda. Ministro da Fazenda até a desincompatibilização. Foco no maior colégio eleitoral do país.",
    risk: "Parado no piso do livro, 0,05%, leitura confirmada de 16/Set, 12:41 BRT. Não é candidato à Presidência: disputa o governo de São Paulo, e por isso não aparece nos cenários presidenciais de 1º turno. O topo da série dele no contrato de vencedor é de 7,60%, em 26/Mai."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "0,15%",
    poll: "A DATATRENDS SAIU EM 16/Set (n=2.000, campo 12 a 14/Set, telefone automatizado, margem de 2,19pp, BR-08691/2026). No 1º turno ele tem 3%. No par de 2º turno perde para Lula por 41% a 44%, uma distância de 3 pontos que cabe dentro de duas margens.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Candidato oficializado pelo PSD.",
    risk: "Parado em 0,15% no contrato de vencedor, leitura confirmada de 16/Set, 12:41 BRT, abaixo do corte de 0,5%. No contrato de 3º lugar do 1º turno fica em 15,50%, o mesmo valor publicado em 14/Set, com USD 130 mil acumulados."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0,15%",
    poll: "A DATATRENDS SAIU EM 16/Set (n=2.000, campo 12 a 14/Set, telefone automatizado, margem de 2,19pp, BR-08691/2026). No 1º turno ele tem 1%. Perde o par de 2º turno para Lula por 39% a 46%, 7 pontos que ficam fora de duas margens.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Parado em 0,15% no contrato de vencedor, leitura confirmada de 16/Set, 12:41 BRT, abaixo do corte de 0,5%. O topo da série dele no contrato de vencedor é de 12,00%, em 13/Mai."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0,05%",
    poll: "A DataTrends de 16/Set não o testa em cenário presidencial de 1º turno. NO PREÇO, ele está em 0,05% no contrato de VENCEDOR, no piso do livro e abaixo do corte de 0,5%.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Parado no piso do livro, 0,05%, leitura confirmada de 16/Set, 12:41 BRT, e ainda assim o contrato dele é o de maior volume acumulado do livro presidencial, USD 14,07M. Preço no piso com volume alto mede interesse passado, não probabilidade de agora."
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
