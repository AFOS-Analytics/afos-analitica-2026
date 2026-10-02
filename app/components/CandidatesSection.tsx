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
    poll: "A VOX BRASIL FOI A NACIONAL DIVULGADA EM 02/Out (n=2.100, presencial, campo de 29/Set a 01/Out, margem de 2,15pp, BR-00148/2026): no 1º turno Flávio Bolsonaro 41,2%, Lula 40,4%, Ronaldo Caiado 3,3%, Renan Santos 2,2%, Romeu Zema 1,3% e Augusto Cury 1,2%; no 2º turno Flávio Bolsonaro 48,2% a 45,2%. Nas cinco nacionais de 30/Set e 01/Out: Datafolha (BR-08039/2026) com Lula 42% a 38% e 48% a 45%; Real Time Big Data (BR-09503/2026) com Lula 43% a 39% e Flávio Bolsonaro 46% a 45%; Futura/100% Cidades (BR-01122/2026) com Flávio Bolsonaro 42,2% a 39,4% e 49% a 43,5%; Ideia (BR-08706/2026) com Lula 39,4% a 38,4% e 48,5% a 48%; e Indexa (BR-00698/2026) com Lula 39% a 34% e 43% a 42%. Nas seis, Lula lidera o 1º turno em quatro e o 2º turno se divide em três para cada lado.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "SOBE 5,00pp NO CONTRATO DE VENCEDOR, para 42,50% (vol USD 13,76M acumulado), leitura confirmada de 02/Out, 16:07 BRT, e 4,34pp no normalizado. O vão contra Flávio Bolsonaro fecha de 23,55pp para 15,25pp, depois de cinco aberturas seguidas entre leituras confirmadas. ⚠️ Não é extremo: o preço dele está a 25,00pp do topo da série, 67,50% de 16 de agosto, e a 8,00pp do piso, 34,50% de 25 de abril. No contrato de 2º lugar do 1º turno cai 4,55pp, para 23,70% (vol USD 1,28M acumulado). 📺 Não iria ao debate da TV Globo de 01/Out, que a emissora cancelou atribuindo o cancelamento às decisões judiciais que vetaram o púlpito vazio e as perguntas a ele.",
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "57,75%",
    poll: "A VOX BRASIL FOI A NACIONAL DIVULGADA EM 02/Out (n=2.100, presencial, campo de 29/Set a 01/Out, margem de 2,15pp, BR-00148/2026): no 1º turno Flávio Bolsonaro 41,2%, Lula 40,4%, Ronaldo Caiado 3,3%, Renan Santos 2,2%, Romeu Zema 1,3% e Augusto Cury 1,2%; no 2º turno Flávio Bolsonaro 48,2% a 45,2%. Nas cinco nacionais de 30/Set e 01/Out: Datafolha (BR-08039/2026) com Lula 42% a 38% e 48% a 45%; Real Time Big Data (BR-09503/2026) com Lula 43% a 39% e Flávio Bolsonaro 46% a 45%; Futura/100% Cidades (BR-01122/2026) com Flávio Bolsonaro 42,2% a 39,4% e 49% a 43,5%; Ideia (BR-08706/2026) com Lula 39,4% a 38,4% e 48,5% a 48%; e Indexa (BR-00698/2026) com Lula 39% a 34% e 43% a 42%. Nas seis, Lula lidera o 1º turno em quatro e o 2º turno se divide em três para cada lado.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "CAI 3,30pp NO CONTRATO DE VENCEDOR, para 57,75% (vol USD 13,49M acumulado), leitura confirmada de 02/Out, 16:07 BRT, e 4,34pp no normalizado. O vão sobre Lula fecha de 23,55pp para 15,25pp. O preço dele está a 5,55pp do topo gravado da série, 63,30% de 1º de outubro, e a 35,75pp do piso, 22,00% de 3 de julho. No contrato de 2º lugar do 1º turno sobe 5,00pp, para 76,50% (vol USD 1,51M acumulado). 📺 Anunciou que não iria ao debate da TV Globo de 01/Out depois da liminar do TSE que vetou o púlpito vazio e as perguntas a Lula, citando censura; a emissora cancelou o debate atribuindo o cancelamento às decisões judiciais. 🏦 Segundo O Globo, a Polícia Federal investiga, no inquérito sobre Daniel Vorcaro e a relação do Master com o BRB, o financiamento de R$ 3,1 milhões do banco a Flávio Bolsonaro para a compra de uma mansão de R$ 6 milhões em Brasília; ele diz que a transação foi legal, e o registro é de um grupo só e entra aqui atribuído.",
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "0,15%",
    poll: "A VOX BRASIL FOI A NACIONAL DIVULGADA EM 02/Out (n=2.100, presencial, campo de 29/Set a 01/Out, margem de 2,15pp, BR-00148/2026): no 1º turno Flávio Bolsonaro 41,2%, Lula 40,4%, Ronaldo Caiado 3,3%, Renan Santos 2,2%, Romeu Zema 1,3% e Augusto Cury 1,2%; no 2º turno Flávio Bolsonaro 48,2% a 45,2%. Nas cinco nacionais de 30/Set e 01/Out: Datafolha (BR-08039/2026) com Lula 42% a 38% e 48% a 45%; Real Time Big Data (BR-09503/2026) com Lula 43% a 39% e Flávio Bolsonaro 46% a 45%; Futura/100% Cidades (BR-01122/2026) com Flávio Bolsonaro 42,2% a 39,4% e 49% a 43,5%; Ideia (BR-08706/2026) com Lula 39,4% a 38,4% e 48,5% a 48%; e Indexa (BR-00698/2026) com Lula 39% a 34% e 43% a 42%. Nas seis, Lula lidera o 1º turno em quatro e o 2º turno se divide em três para cada lado.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "SOBE 14,00pp NO CRU NO CONTRATO DE 3º LUGAR DO 1º TURNO, para 62,50% (vol USD 0,62M acumulado), leitura confirmada de 02/Out, 16:07 BRT, e 13,60pp no normalizado, e abre 35,20pp sobre Augusto Cury naquele livro. No de vencedor está em 0,15%. 🏆 O contrato dele no livro de vencedor segue sendo o de MAIOR volume acumulado do presidencial, USD 15,80M contra USD 14,56M do de Tarcísio de Freitas. 📺 Gilmar Mendes, do Supremo, determinou em 01/Out a inclusão dele no debate da TV Globo, cancelado na mesma noite (Gazeta do Povo e Folha de S.Paulo).",
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0,05%",
    poll: "A VOX BRASIL FOI A NACIONAL DIVULGADA EM 02/Out (n=2.100, presencial, campo de 29/Set a 01/Out, margem de 2,15pp, BR-00148/2026): no 1º turno Flávio Bolsonaro 41,2%, Lula 40,4%, Ronaldo Caiado 3,3%, Renan Santos 2,2%, Romeu Zema 1,3% e Augusto Cury 1,2%; no 2º turno Flávio Bolsonaro 48,2% a 45,2%. Nas cinco nacionais de 30/Set e 01/Out: Datafolha (BR-08039/2026) com Lula 42% a 38% e 48% a 45%; Real Time Big Data (BR-09503/2026) com Lula 43% a 39% e Flávio Bolsonaro 46% a 45%; Futura/100% Cidades (BR-01122/2026) com Flávio Bolsonaro 42,2% a 39,4% e 49% a 43,5%; Ideia (BR-08706/2026) com Lula 39,4% a 38,4% e 48,5% a 48%; e Indexa (BR-00698/2026) com Lula 39% a 34% e 43% a 42%. Nas seis, Lula lidera o 1º turno em quatro e o 2º turno se divide em três para cada lado.",
    position: "Centro-esquerda. Ministro da Fazenda até a desincompatibilização. Foco no maior colégio eleitoral do país.",
    risk: "Parado no piso do livro, 0,05%, leitura confirmada de 02/Out, 16:07 BRT, com USD 7,74M acumulados. Não é candidato à Presidência: disputa o governo de São Paulo, e por isso não aparece nos cenários presidenciais das nacionais de 30/Set a 02/Out.",
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "0,05%",
    poll: "A VOX BRASIL FOI A NACIONAL DIVULGADA EM 02/Out (n=2.100, presencial, campo de 29/Set a 01/Out, margem de 2,15pp, BR-00148/2026): no 1º turno Flávio Bolsonaro 41,2%, Lula 40,4%, Ronaldo Caiado 3,3%, Renan Santos 2,2%, Romeu Zema 1,3% e Augusto Cury 1,2%; no 2º turno Flávio Bolsonaro 48,2% a 45,2%. Nas cinco nacionais de 30/Set e 01/Out: Datafolha (BR-08039/2026) com Lula 42% a 38% e 48% a 45%; Real Time Big Data (BR-09503/2026) com Lula 43% a 39% e Flávio Bolsonaro 46% a 45%; Futura/100% Cidades (BR-01122/2026) com Flávio Bolsonaro 42,2% a 39,4% e 49% a 43,5%; Ideia (BR-08706/2026) com Lula 39,4% a 38,4% e 48,5% a 48%; e Indexa (BR-00698/2026) com Lula 39% a 34% e 43% a 42%. Nas seis, Lula lidera o 1º turno em quatro e o 2º turno se divide em três para cada lado.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Candidato oficializado pelo PSD.",
    risk: "CAI 4,50pp NO CRU NO CONTRATO DE 3º LUGAR DO 1º TURNO, para 11,50% (vol USD 0,22M acumulado), leitura confirmada de 02/Out, 16:07 BRT, e 4,42pp no normalizado. Segue em terceiro naquele livro. 🗳️ É o terceiro colocado do 1º turno na Vox Brasil de 02/Out, com 3,3%, e perde para Lula no 2º turno ali por 42,1% a 46,3%. No contrato de vencedor segue em 0,05%, com USD 7,81M acumulados.",
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0,05%",
    poll: "A VOX BRASIL FOI A NACIONAL DIVULGADA EM 02/Out (n=2.100, presencial, campo de 29/Set a 01/Out, margem de 2,15pp, BR-00148/2026): no 1º turno Flávio Bolsonaro 41,2%, Lula 40,4%, Ronaldo Caiado 3,3%, Renan Santos 2,2%, Romeu Zema 1,3% e Augusto Cury 1,2%; no 2º turno Flávio Bolsonaro 48,2% a 45,2%. Nas cinco nacionais de 30/Set e 01/Out: Datafolha (BR-08039/2026) com Lula 42% a 38% e 48% a 45%; Real Time Big Data (BR-09503/2026) com Lula 43% a 39% e Flávio Bolsonaro 46% a 45%; Futura/100% Cidades (BR-01122/2026) com Flávio Bolsonaro 42,2% a 39,4% e 49% a 43,5%; Ideia (BR-08706/2026) com Lula 39,4% a 38,4% e 48,5% a 48%; e Indexa (BR-00698/2026) com Lula 39% a 34% e 43% a 42%. Nas seis, Lula lidera o 1º turno em quatro e o 2º turno se divide em três para cada lado.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "ESTÁ EM 0,20% NO CONTRATO DE 3º LUGAR DO 1º TURNO (vol USD 0,12M acumulado), leitura confirmada de 02/Out, 16:07 BRT. 🗳️ Nas nacionais de 30/Set a 02/Out tem de 1% a 3,5%, e 1,3% na Vox Brasil de 02/Out. No de vencedor está em 0,05%, com USD 7,73M acumulados.",
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0,05%",
    poll: "A VOX BRASIL FOI A NACIONAL DIVULGADA EM 02/Out (n=2.100, presencial, campo de 29/Set a 01/Out, margem de 2,15pp, BR-00148/2026): no 1º turno Flávio Bolsonaro 41,2%, Lula 40,4%, Ronaldo Caiado 3,3%, Renan Santos 2,2%, Romeu Zema 1,3% e Augusto Cury 1,2%; no 2º turno Flávio Bolsonaro 48,2% a 45,2%. Nas cinco nacionais de 30/Set e 01/Out: Datafolha (BR-08039/2026) com Lula 42% a 38% e 48% a 45%; Real Time Big Data (BR-09503/2026) com Lula 43% a 39% e Flávio Bolsonaro 46% a 45%; Futura/100% Cidades (BR-01122/2026) com Flávio Bolsonaro 42,2% a 39,4% e 49% a 43,5%; Ideia (BR-08706/2026) com Lula 39,4% a 38,4% e 48,5% a 48%; e Indexa (BR-00698/2026) com Lula 39% a 34% e 43% a 42%. Nas seis, Lula lidera o 1º turno em quatro e o 2º turno se divide em três para cada lado.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Parado no piso do livro, 0,05%, leitura confirmada de 02/Out, 16:07 BRT, com USD 14,56M acumulados, e o contrato dele segue atrás do de Renan Santos em volume acumulado no livro presidencial, que tem USD 15,80M.",
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
