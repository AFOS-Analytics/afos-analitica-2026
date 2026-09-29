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
    polymarket: "39,50%",
    poll: "QUATRO PESQUISAS NACIONAIS FORAM DIVULGADAS EM 29/Set. AtlasIntel/Bloomberg (n=5.005, online, campo de 23 a 28/Set, margem de 1,0pp, BR-04391/2026): no 1º turno Lula 45,3%, Flávio Bolsonaro 42,2%, Renan Santos 5,2%, Augusto Cury 2,0%, Ronaldo Caiado 1,8% e Romeu Zema 0,9%; no 2º turno Flávio Bolsonaro 47,7% a 47,6%. Palver (n=5.000, online, margem de 2,4pp, BR-02990/2026): no 1º turno empate em 44%, com Renan Santos em 8%; no 2º turno Flávio Bolsonaro 47% a 45%. Vox Brasil (n=2.100, presencial, campo de 26 a 28/Set, margem de 2,15pp, BR-00895/2026): no 1º turno Lula 41,1% e Flávio Bolsonaro 37,8%; no 2º turno Flávio Bolsonaro 45,2% a 44,7%. Gerp (n=2.400, telefone, margem de 2,0pp, BR-03929/2026, registrada para 27/Set): no 1º turno Flávio Bolsonaro 42% e Lula 40%; no 2º turno Flávio Bolsonaro 50% a 43%, a única distância fora da margem. Somadas à Quaest e à BTG/Nexus de 28/Set, Lula lidera o 1º turno em quatro das seis e Flávio Bolsonaro o 2º turno em quatro das seis.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "CAI 2,00pp NO CONTRATO DE VENCEDOR, para 39,50% (vol USD 12,59M acumulado), leitura confirmada de 29/Set, 11:58 BRT, e 1,91pp no normalizado. O vão contra Flávio Bolsonaro abre de 16,55pp para 20,30pp, a quarta abertura seguida entre leituras confirmadas. ⚠️ Não é extremo: o preço dele está a 28,00pp do topo da série, 67,50% de 16 de agosto, e a 5,00pp do piso, 34,50% de 25 de abril. No contrato de 2º lugar do 1º turno cai 0,95pp, para 23,60% (vol USD 1,09M acumulado).",
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "59,80%",
    poll: "QUATRO PESQUISAS NACIONAIS FORAM DIVULGADAS EM 29/Set. AtlasIntel/Bloomberg (n=5.005, online, campo de 23 a 28/Set, margem de 1,0pp, BR-04391/2026): no 1º turno Lula 45,3%, Flávio Bolsonaro 42,2%, Renan Santos 5,2%, Augusto Cury 2,0%, Ronaldo Caiado 1,8% e Romeu Zema 0,9%; no 2º turno Flávio Bolsonaro 47,7% a 47,6%. Palver (n=5.000, online, margem de 2,4pp, BR-02990/2026): no 1º turno empate em 44%, com Renan Santos em 8%; no 2º turno Flávio Bolsonaro 47% a 45%. Vox Brasil (n=2.100, presencial, campo de 26 a 28/Set, margem de 2,15pp, BR-00895/2026): no 1º turno Lula 41,1% e Flávio Bolsonaro 37,8%; no 2º turno Flávio Bolsonaro 45,2% a 44,7%. Gerp (n=2.400, telefone, margem de 2,0pp, BR-03929/2026, registrada para 27/Set): no 1º turno Flávio Bolsonaro 42% e Lula 40%; no 2º turno Flávio Bolsonaro 50% a 43%, a única distância fora da margem. Somadas à Quaest e à BTG/Nexus de 28/Set, Lula lidera o 1º turno em quatro das seis e Flávio Bolsonaro o 2º turno em quatro das seis.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "SOBE 1,75pp NO CONTRATO DE VENCEDOR, para 59,80% (vol USD 12,27M acumulado), leitura confirmada de 29/Set, 11:58 BRT, e 1,91pp no normalizado. O vão sobre Lula abre de 16,55pp para 20,30pp. O preço dele está a 1,90pp do topo da série, 61,70% gravado em 21/Set, e a 37,80pp do piso, 22,00% de 3 de julho. No contrato de 2º lugar do 1º turno sobe 2,00pp, para 76,50% (vol USD 1,27M acumulado). ⚖️ Na noite de 28/Set Luiz Fux suspendeu, a pedido da campanha dele, a decisão de Flávio Dino que liberava as publicações sobre Nossa Senhora Aparecida.",
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "0,25%",
    poll: "QUATRO PESQUISAS NACIONAIS FORAM DIVULGADAS EM 29/Set. AtlasIntel/Bloomberg (n=5.005, online, campo de 23 a 28/Set, margem de 1,0pp, BR-04391/2026): no 1º turno Lula 45,3%, Flávio Bolsonaro 42,2%, Renan Santos 5,2%, Augusto Cury 2,0%, Ronaldo Caiado 1,8% e Romeu Zema 0,9%; no 2º turno Flávio Bolsonaro 47,7% a 47,6%. Palver (n=5.000, online, margem de 2,4pp, BR-02990/2026): no 1º turno empate em 44%, com Renan Santos em 8%; no 2º turno Flávio Bolsonaro 47% a 45%. Vox Brasil (n=2.100, presencial, campo de 26 a 28/Set, margem de 2,15pp, BR-00895/2026): no 1º turno Lula 41,1% e Flávio Bolsonaro 37,8%; no 2º turno Flávio Bolsonaro 45,2% a 44,7%. Gerp (n=2.400, telefone, margem de 2,0pp, BR-03929/2026, registrada para 27/Set): no 1º turno Flávio Bolsonaro 42% e Lula 40%; no 2º turno Flávio Bolsonaro 50% a 43%, a única distância fora da margem. Somadas à Quaest e à BTG/Nexus de 28/Set, Lula lidera o 1º turno em quatro das seis e Flávio Bolsonaro o 2º turno em quatro das seis.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "SOBE 8,50pp NO CRU NO CONTRATO DE 3º LUGAR DO 1º TURNO, para 51,50% (vol USD 0,46M acumulado), leitura confirmada de 29/Set, 11:58 BRT, e 8,86pp no normalizado, e volta à frente de Augusto Cury naquele livro, por 15,65pp. No de vencedor está em 0,25%. 🏆 O contrato dele no livro de vencedor segue sendo o de MAIOR volume acumulado do presidencial, USD 14,68M contra USD 14,10M do de Tarcísio de Freitas. 🗳️ É o terceiro colocado na AtlasIntel e na Palver de 29/Set.",
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0,05%",
    poll: "QUATRO PESQUISAS NACIONAIS FORAM DIVULGADAS EM 29/Set. AtlasIntel/Bloomberg (n=5.005, online, campo de 23 a 28/Set, margem de 1,0pp, BR-04391/2026): no 1º turno Lula 45,3%, Flávio Bolsonaro 42,2%, Renan Santos 5,2%, Augusto Cury 2,0%, Ronaldo Caiado 1,8% e Romeu Zema 0,9%; no 2º turno Flávio Bolsonaro 47,7% a 47,6%. Palver (n=5.000, online, margem de 2,4pp, BR-02990/2026): no 1º turno empate em 44%, com Renan Santos em 8%; no 2º turno Flávio Bolsonaro 47% a 45%. Vox Brasil (n=2.100, presencial, campo de 26 a 28/Set, margem de 2,15pp, BR-00895/2026): no 1º turno Lula 41,1% e Flávio Bolsonaro 37,8%; no 2º turno Flávio Bolsonaro 45,2% a 44,7%. Gerp (n=2.400, telefone, margem de 2,0pp, BR-03929/2026, registrada para 27/Set): no 1º turno Flávio Bolsonaro 42% e Lula 40%; no 2º turno Flávio Bolsonaro 50% a 43%, a única distância fora da margem. Somadas à Quaest e à BTG/Nexus de 28/Set, Lula lidera o 1º turno em quatro das seis e Flávio Bolsonaro o 2º turno em quatro das seis.",
    position: "Centro-esquerda. Ministro da Fazenda até a desincompatibilização. Foco no maior colégio eleitoral do país.",
    risk: "Parado no piso do livro, 0,05%, leitura confirmada de 29/Set, 11:58 BRT, com USD 7,71M acumulados. Não é candidato à Presidência: disputa o governo de São Paulo, e por isso não aparece nos cenários presidenciais das nacionais de 29/Set.",
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "0,05%",
    poll: "QUATRO PESQUISAS NACIONAIS FORAM DIVULGADAS EM 29/Set. AtlasIntel/Bloomberg (n=5.005, online, campo de 23 a 28/Set, margem de 1,0pp, BR-04391/2026): no 1º turno Lula 45,3%, Flávio Bolsonaro 42,2%, Renan Santos 5,2%, Augusto Cury 2,0%, Ronaldo Caiado 1,8% e Romeu Zema 0,9%; no 2º turno Flávio Bolsonaro 47,7% a 47,6%. Palver (n=5.000, online, margem de 2,4pp, BR-02990/2026): no 1º turno empate em 44%, com Renan Santos em 8%; no 2º turno Flávio Bolsonaro 47% a 45%. Vox Brasil (n=2.100, presencial, campo de 26 a 28/Set, margem de 2,15pp, BR-00895/2026): no 1º turno Lula 41,1% e Flávio Bolsonaro 37,8%; no 2º turno Flávio Bolsonaro 45,2% a 44,7%. Gerp (n=2.400, telefone, margem de 2,0pp, BR-03929/2026, registrada para 27/Set): no 1º turno Flávio Bolsonaro 42% e Lula 40%; no 2º turno Flávio Bolsonaro 50% a 43%, a única distância fora da margem. Somadas à Quaest e à BTG/Nexus de 28/Set, Lula lidera o 1º turno em quatro das seis e Flávio Bolsonaro o 2º turno em quatro das seis.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Candidato oficializado pelo PSD.",
    risk: "SEGUE EM 13,50% NO CRU NO CONTRATO DE 3º LUGAR DO 1º TURNO (vol USD 0,19M acumulado), leitura confirmada de 29/Set, 11:58 BRT, e sobe 0,16pp no normalizado. Mantém a terceira posição daquele livro. 🗳️ É o terceiro colocado do 1º turno na Vox Brasil de 29/Set, com 3,8%, e perde para Lula no 2º turno por 41,1% a 45,3% ali. No contrato de vencedor segue em 0,05%, com USD 7,79M acumulados.",
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0,05%",
    poll: "QUATRO PESQUISAS NACIONAIS FORAM DIVULGADAS EM 29/Set. AtlasIntel/Bloomberg (n=5.005, online, campo de 23 a 28/Set, margem de 1,0pp, BR-04391/2026): no 1º turno Lula 45,3%, Flávio Bolsonaro 42,2%, Renan Santos 5,2%, Augusto Cury 2,0%, Ronaldo Caiado 1,8% e Romeu Zema 0,9%; no 2º turno Flávio Bolsonaro 47,7% a 47,6%. Palver (n=5.000, online, margem de 2,4pp, BR-02990/2026): no 1º turno empate em 44%, com Renan Santos em 8%; no 2º turno Flávio Bolsonaro 47% a 45%. Vox Brasil (n=2.100, presencial, campo de 26 a 28/Set, margem de 2,15pp, BR-00895/2026): no 1º turno Lula 41,1% e Flávio Bolsonaro 37,8%; no 2º turno Flávio Bolsonaro 45,2% a 44,7%. Gerp (n=2.400, telefone, margem de 2,0pp, BR-03929/2026, registrada para 27/Set): no 1º turno Flávio Bolsonaro 42% e Lula 40%; no 2º turno Flávio Bolsonaro 50% a 43%, a única distância fora da margem. Somadas à Quaest e à BTG/Nexus de 28/Set, Lula lidera o 1º turno em quatro das seis e Flávio Bolsonaro o 2º turno em quatro das seis.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "CAI PARA 0,25% NO CONTRATO DE 3º LUGAR DO 1º TURNO (vol USD 0,09M acumulado), leitura confirmada de 29/Set, 11:58 BRT. 🗳️ Nas nacionais de 29/Set tem de 0,9% a 1,8%, e na Vox Brasil perde para Lula por 46,1% a 30,3% no par de 2º turno. No de vencedor está em 0,05%, com USD 7,71M acumulados.",
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0,05%",
    poll: "QUATRO PESQUISAS NACIONAIS FORAM DIVULGADAS EM 29/Set. AtlasIntel/Bloomberg (n=5.005, online, campo de 23 a 28/Set, margem de 1,0pp, BR-04391/2026): no 1º turno Lula 45,3%, Flávio Bolsonaro 42,2%, Renan Santos 5,2%, Augusto Cury 2,0%, Ronaldo Caiado 1,8% e Romeu Zema 0,9%; no 2º turno Flávio Bolsonaro 47,7% a 47,6%. Palver (n=5.000, online, margem de 2,4pp, BR-02990/2026): no 1º turno empate em 44%, com Renan Santos em 8%; no 2º turno Flávio Bolsonaro 47% a 45%. Vox Brasil (n=2.100, presencial, campo de 26 a 28/Set, margem de 2,15pp, BR-00895/2026): no 1º turno Lula 41,1% e Flávio Bolsonaro 37,8%; no 2º turno Flávio Bolsonaro 45,2% a 44,7%. Gerp (n=2.400, telefone, margem de 2,0pp, BR-03929/2026, registrada para 27/Set): no 1º turno Flávio Bolsonaro 42% e Lula 40%; no 2º turno Flávio Bolsonaro 50% a 43%, a única distância fora da margem. Somadas à Quaest e à BTG/Nexus de 28/Set, Lula lidera o 1º turno em quatro das seis e Flávio Bolsonaro o 2º turno em quatro das seis.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Parado no piso do livro, 0,05%, leitura confirmada de 29/Set, 11:58 BRT, com USD 14,10M acumulados, e o contrato dele segue atrás do de Renan Santos em volume acumulado no livro presidencial, que tem USD 14,68M.",
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
