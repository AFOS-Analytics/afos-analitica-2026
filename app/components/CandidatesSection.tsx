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
    polymarket: "37,50%",
    poll: "CINCO PESQUISAS NACIONAIS FORAM DIVULGADAS EM 30/Set E 01/Out. Datafolha (n=2.506, presencial, campo de 28/Set a 01/Out, margem de 2pp, BR-08039/2026): no 1º turno Lula 42%, Flávio Bolsonaro 38%, Augusto Cury 4%, Ronaldo Caiado 3%, Renan Santos 3% e Romeu Zema 1%; no 2º turno Lula 48% a 45%. Real Time Big Data (n=2.000, telefone, campo de 26 a 30/Set, margem de 2pp, BR-09503/2026): no 1º turno Lula 43%, Flávio Bolsonaro 39% e Renan Santos 4%; no 2º turno Flávio Bolsonaro 46% a 45%. Futura/100% Cidades (n=2.000, telefone, margem de 2,2pp, BR-01122/2026): no 1º turno Flávio Bolsonaro 42,2% e Lula 39,4%; no 2º turno Flávio Bolsonaro 49% a 43,5%, a única distância fora da margem. Ideia para o Canal Meio (n=2.000, margem de 2,2pp, BR-08706/2026): no 1º turno Lula 39,4% e Flávio Bolsonaro 38,4%; no 2º turno Lula 48,5% a 48%. Indexa para o Broadcast (n=2.000, margem de 2,2pp, BR-00698/2026): no 1º turno Lula 39% e Flávio Bolsonaro 34%; no 2º turno Lula 43% a 42%. Lula lidera o 1º turno em quatro das cinco e o 2º turno em três.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "CAI 2,00pp NO CONTRATO DE VENCEDOR, para 37,50% (vol USD 13,00M acumulado), leitura confirmada de 01/Out, 19:29 BRT, e 1,73pp no normalizado. O vão contra Flávio Bolsonaro abre de 20,30pp para 23,55pp, a quinta abertura seguida entre leituras confirmadas. ⚠️ Não é extremo: o preço dele está a 30,00pp do topo da série, 67,50% de 16 de agosto, e a 3,00pp do piso, 34,50% de 25 de abril. No contrato de 2º lugar do 1º turno sobe 4,65pp, para 28,25% (vol USD 1,20M acumulado). 📺 Anunciou que não vai ao debate da TV Globo de 01/Out, e a ministra Estela Aranha, do TSE, proibiu em liminar a emissora de exibir o púlpito vazio dele.",
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "61,05%",
    poll: "CINCO PESQUISAS NACIONAIS FORAM DIVULGADAS EM 30/Set E 01/Out. Datafolha (n=2.506, presencial, campo de 28/Set a 01/Out, margem de 2pp, BR-08039/2026): no 1º turno Lula 42%, Flávio Bolsonaro 38%, Augusto Cury 4%, Ronaldo Caiado 3%, Renan Santos 3% e Romeu Zema 1%; no 2º turno Lula 48% a 45%. Real Time Big Data (n=2.000, telefone, campo de 26 a 30/Set, margem de 2pp, BR-09503/2026): no 1º turno Lula 43%, Flávio Bolsonaro 39% e Renan Santos 4%; no 2º turno Flávio Bolsonaro 46% a 45%. Futura/100% Cidades (n=2.000, telefone, margem de 2,2pp, BR-01122/2026): no 1º turno Flávio Bolsonaro 42,2% e Lula 39,4%; no 2º turno Flávio Bolsonaro 49% a 43,5%, a única distância fora da margem. Ideia para o Canal Meio (n=2.000, margem de 2,2pp, BR-08706/2026): no 1º turno Lula 39,4% e Flávio Bolsonaro 38,4%; no 2º turno Lula 48,5% a 48%. Indexa para o Broadcast (n=2.000, margem de 2,2pp, BR-00698/2026): no 1º turno Lula 39% e Flávio Bolsonaro 34%; no 2º turno Lula 43% a 42%. Lula lidera o 1º turno em quatro das cinco e o 2º turno em três.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "SOBE 1,25pp NO CONTRATO DE VENCEDOR, para 61,05% (vol USD 12,79M acumulado), leitura confirmada de 01/Out, 19:29 BRT, e 1,73pp no normalizado. O vão sobre Lula abre de 20,30pp para 23,55pp. Nos pontos gravados de 01/Out o preço dele variou de 61,05% a 63,30%, e esse 63,30% é o topo da série gravada desde 14 de abril; o piso é 22,00% de 3 de julho. No contrato de 2º lugar do 1º turno cai 5,00pp, para 71,50% (vol USD 1,42M acumulado). ⚖️ Na noite de 30/Set o plenário do TSE manteve a remoção das publicações falsas sobre ele e Nossa Senhora Aparecida e liberou o post do humorista Antonio Tabet, e em 01/Out Edson Fachin negou o pedido dele para afastar Flávio Dino dos processos ligados ao senador.",
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "0,25%",
    poll: "CINCO PESQUISAS NACIONAIS FORAM DIVULGADAS EM 30/Set E 01/Out. Datafolha (n=2.506, presencial, campo de 28/Set a 01/Out, margem de 2pp, BR-08039/2026): no 1º turno Lula 42%, Flávio Bolsonaro 38%, Augusto Cury 4%, Ronaldo Caiado 3%, Renan Santos 3% e Romeu Zema 1%; no 2º turno Lula 48% a 45%. Real Time Big Data (n=2.000, telefone, campo de 26 a 30/Set, margem de 2pp, BR-09503/2026): no 1º turno Lula 43%, Flávio Bolsonaro 39% e Renan Santos 4%; no 2º turno Flávio Bolsonaro 46% a 45%. Futura/100% Cidades (n=2.000, telefone, margem de 2,2pp, BR-01122/2026): no 1º turno Flávio Bolsonaro 42,2% e Lula 39,4%; no 2º turno Flávio Bolsonaro 49% a 43,5%, a única distância fora da margem. Ideia para o Canal Meio (n=2.000, margem de 2,2pp, BR-08706/2026): no 1º turno Lula 39,4% e Flávio Bolsonaro 38,4%; no 2º turno Lula 48,5% a 48%. Indexa para o Broadcast (n=2.000, margem de 2,2pp, BR-00698/2026): no 1º turno Lula 39% e Flávio Bolsonaro 34%; no 2º turno Lula 43% a 42%. Lula lidera o 1º turno em quatro das cinco e o 2º turno em três.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "CAI 3,00pp NO CRU NO CONTRATO DE 3º LUGAR DO 1º TURNO, para 48,50% (vol USD 0,52M acumulado), leitura confirmada de 01/Out, 19:29 BRT, e 3,13pp no normalizado, e segue à frente de Augusto Cury naquele livro, por 11,80pp. No de vencedor está em 0,25%. 🏆 O contrato dele no livro de vencedor segue sendo o de MAIOR volume acumulado do presidencial, USD 15,12M contra USD 14,36M do de Tarcísio de Freitas. 🗳️ É o terceiro colocado na Real Time Big Data de 01/Out, com 4%. 📺 Kassio Nunes Marques negou no TSE o pedido de Renan Santos para entrar no debate da TV Globo de 01/Out, e Cármen Lúcia rejeitou a ação dele no Supremo (Valor e Folha de S.Paulo).",
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0,05%",
    poll: "CINCO PESQUISAS NACIONAIS FORAM DIVULGADAS EM 30/Set E 01/Out. Datafolha (n=2.506, presencial, campo de 28/Set a 01/Out, margem de 2pp, BR-08039/2026): no 1º turno Lula 42%, Flávio Bolsonaro 38%, Augusto Cury 4%, Ronaldo Caiado 3%, Renan Santos 3% e Romeu Zema 1%; no 2º turno Lula 48% a 45%. Real Time Big Data (n=2.000, telefone, campo de 26 a 30/Set, margem de 2pp, BR-09503/2026): no 1º turno Lula 43%, Flávio Bolsonaro 39% e Renan Santos 4%; no 2º turno Flávio Bolsonaro 46% a 45%. Futura/100% Cidades (n=2.000, telefone, margem de 2,2pp, BR-01122/2026): no 1º turno Flávio Bolsonaro 42,2% e Lula 39,4%; no 2º turno Flávio Bolsonaro 49% a 43,5%, a única distância fora da margem. Ideia para o Canal Meio (n=2.000, margem de 2,2pp, BR-08706/2026): no 1º turno Lula 39,4% e Flávio Bolsonaro 38,4%; no 2º turno Lula 48,5% a 48%. Indexa para o Broadcast (n=2.000, margem de 2,2pp, BR-00698/2026): no 1º turno Lula 39% e Flávio Bolsonaro 34%; no 2º turno Lula 43% a 42%. Lula lidera o 1º turno em quatro das cinco e o 2º turno em três.",
    position: "Centro-esquerda. Ministro da Fazenda até a desincompatibilização. Foco no maior colégio eleitoral do país.",
    risk: "Parado no piso do livro, 0,05%, leitura confirmada de 01/Out, 19:29 BRT, com USD 7,73M acumulados. Não é candidato à Presidência: disputa o governo de São Paulo, e por isso não aparece nos cenários presidenciais das nacionais de 30/Set e 01/Out.",
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "0,05%",
    poll: "CINCO PESQUISAS NACIONAIS FORAM DIVULGADAS EM 30/Set E 01/Out. Datafolha (n=2.506, presencial, campo de 28/Set a 01/Out, margem de 2pp, BR-08039/2026): no 1º turno Lula 42%, Flávio Bolsonaro 38%, Augusto Cury 4%, Ronaldo Caiado 3%, Renan Santos 3% e Romeu Zema 1%; no 2º turno Lula 48% a 45%. Real Time Big Data (n=2.000, telefone, campo de 26 a 30/Set, margem de 2pp, BR-09503/2026): no 1º turno Lula 43%, Flávio Bolsonaro 39% e Renan Santos 4%; no 2º turno Flávio Bolsonaro 46% a 45%. Futura/100% Cidades (n=2.000, telefone, margem de 2,2pp, BR-01122/2026): no 1º turno Flávio Bolsonaro 42,2% e Lula 39,4%; no 2º turno Flávio Bolsonaro 49% a 43,5%, a única distância fora da margem. Ideia para o Canal Meio (n=2.000, margem de 2,2pp, BR-08706/2026): no 1º turno Lula 39,4% e Flávio Bolsonaro 38,4%; no 2º turno Lula 48,5% a 48%. Indexa para o Broadcast (n=2.000, margem de 2,2pp, BR-00698/2026): no 1º turno Lula 39% e Flávio Bolsonaro 34%; no 2º turno Lula 43% a 42%. Lula lidera o 1º turno em quatro das cinco e o 2º turno em três.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Candidato oficializado pelo PSD.",
    risk: "SOBE 2,50pp NO CRU NO CONTRATO DE 3º LUGAR DO 1º TURNO, para 16,00% (vol USD 0,21M acumulado), leitura confirmada de 01/Out, 19:29 BRT, e 2,39pp no normalizado. Mantém a terceira posição daquele livro. 🗳️ É o terceiro colocado do 1º turno na Futura de 30/Set, com 4%, e vence Lula no 2º turno ali, por 45,6% a 42,4%; na Datafolha de 01/Out perde por 42% a 48%. No contrato de vencedor segue em 0,05%, com USD 7,81M acumulados.",
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0,05%",
    poll: "CINCO PESQUISAS NACIONAIS FORAM DIVULGADAS EM 30/Set E 01/Out. Datafolha (n=2.506, presencial, campo de 28/Set a 01/Out, margem de 2pp, BR-08039/2026): no 1º turno Lula 42%, Flávio Bolsonaro 38%, Augusto Cury 4%, Ronaldo Caiado 3%, Renan Santos 3% e Romeu Zema 1%; no 2º turno Lula 48% a 45%. Real Time Big Data (n=2.000, telefone, campo de 26 a 30/Set, margem de 2pp, BR-09503/2026): no 1º turno Lula 43%, Flávio Bolsonaro 39% e Renan Santos 4%; no 2º turno Flávio Bolsonaro 46% a 45%. Futura/100% Cidades (n=2.000, telefone, margem de 2,2pp, BR-01122/2026): no 1º turno Flávio Bolsonaro 42,2% e Lula 39,4%; no 2º turno Flávio Bolsonaro 49% a 43,5%, a única distância fora da margem. Ideia para o Canal Meio (n=2.000, margem de 2,2pp, BR-08706/2026): no 1º turno Lula 39,4% e Flávio Bolsonaro 38,4%; no 2º turno Lula 48,5% a 48%. Indexa para o Broadcast (n=2.000, margem de 2,2pp, BR-00698/2026): no 1º turno Lula 39% e Flávio Bolsonaro 34%; no 2º turno Lula 43% a 42%. Lula lidera o 1º turno em quatro das cinco e o 2º turno em três.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "ESTÁ EM 0,15% NO CONTRATO DE 3º LUGAR DO 1º TURNO (vol USD 0,11M acumulado), leitura confirmada de 01/Out, 19:29 BRT. 🗳️ Nas nacionais de 30/Set e 01/Out tem de 1% a 3,5%, e na Datafolha de 01/Out perde para Lula por 40% a 49% no par de 2º turno. No de vencedor está em 0,05%, com USD 7,72M acumulados.",
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0,05%",
    poll: "CINCO PESQUISAS NACIONAIS FORAM DIVULGADAS EM 30/Set E 01/Out. Datafolha (n=2.506, presencial, campo de 28/Set a 01/Out, margem de 2pp, BR-08039/2026): no 1º turno Lula 42%, Flávio Bolsonaro 38%, Augusto Cury 4%, Ronaldo Caiado 3%, Renan Santos 3% e Romeu Zema 1%; no 2º turno Lula 48% a 45%. Real Time Big Data (n=2.000, telefone, campo de 26 a 30/Set, margem de 2pp, BR-09503/2026): no 1º turno Lula 43%, Flávio Bolsonaro 39% e Renan Santos 4%; no 2º turno Flávio Bolsonaro 46% a 45%. Futura/100% Cidades (n=2.000, telefone, margem de 2,2pp, BR-01122/2026): no 1º turno Flávio Bolsonaro 42,2% e Lula 39,4%; no 2º turno Flávio Bolsonaro 49% a 43,5%, a única distância fora da margem. Ideia para o Canal Meio (n=2.000, margem de 2,2pp, BR-08706/2026): no 1º turno Lula 39,4% e Flávio Bolsonaro 38,4%; no 2º turno Lula 48,5% a 48%. Indexa para o Broadcast (n=2.000, margem de 2,2pp, BR-00698/2026): no 1º turno Lula 39% e Flávio Bolsonaro 34%; no 2º turno Lula 43% a 42%. Lula lidera o 1º turno em quatro das cinco e o 2º turno em três.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Parado no piso do livro, 0,05%, leitura confirmada de 01/Out, 19:29 BRT, com USD 14,36M acumulados, e o contrato dele segue atrás do de Renan Santos em volume acumulado no livro presidencial, que tem USD 15,12M.",
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
