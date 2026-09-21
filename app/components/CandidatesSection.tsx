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
    polymarket: "38,50%",
    poll: "AS DUAS NACIONAIS DE 21/Set FECHARAM CAMPO NO MESMO 20/Set E MEDEM SINAIS OPOSTOS: BTG/Nexus (n=2.006, telefone CATI, campo de 18 a 20/Set, margem de 2,0pp, BR-00485/2026) e Palver (n=5.000, internet por anúncios em redes sociais, amostra não probabilística, campo de 15 a 20/Set, margem de 2,8pp, BR-00860/2026). Cada uma testou CINCO pares de 2º turno. A BTG/Nexus o dá à frente nos dois turnos, 40% a 37% no 1º e 46% a 45% no 2º, e ele vence ou empata os cinco pares dela. A Palver o dá atrás no par principal, 41% a 42% no 1º e 43% a 47% no 2º, e ali ele marca 43% nos CINCO pares, perdendo três: para Flávio Bolsonaro, para Romeu Zema e para Ronaldo Caiado.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "CEDE 3,00pp NO CONTRATO DE VENCEDOR, para 38,50% (vol USD 11,66M acumulado), leitura confirmada de 21/Set, 17:01 BRT, contra os 41,50% da leitura confirmada de 21/Set às 00:06 BRT, e o vão para Flávio Bolsonaro abre de 17,55pp para 22,40pp. ⚠️ Não é o piso da série dele, que é 34,50% e é de 25 de abril. No contrato de 2º lugar do 1º turno ele cede 0,15pp, para 29,40% (vol USD 0,88M acumulado).",
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "60,90%",
    poll: "AS DUAS NACIONAIS DE 21/Set FECHARAM CAMPO NO MESMO 20/Set E MEDEM SINAIS OPOSTOS: BTG/Nexus (n=2.006, telefone CATI, campo de 18 a 20/Set, margem de 2,0pp, BR-00485/2026) e Palver (n=5.000, internet por anúncios em redes sociais, amostra não probabilística, campo de 15 a 20/Set, margem de 2,8pp, BR-00860/2026). Cada uma testou CINCO pares de 2º turno. A Palver o dá à frente nos dois turnos, 42% a 41% no 1º e 47% a 43% no 2º, e é o adversário que abre a maior distância sobre Lula naquela casa. A BTG/Nexus o dá atrás nos dois, 37% a 40% no 1º e 45% a 46% no 2º, o par mais apertado dos cinco dela.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "SOBE 1,85pp NO CONTRATO DE VENCEDOR, para 60,90% (vol USD 11,37M acumulado), leitura confirmada de 21/Set, 17:01 BRT. Nas leituras gravadas de hoje o vão dele sobre Lula chegou a 23,80pp às 15:00 BRT, o maior dos 158 dias da série aberta em 14 de abril de 2026, e a leitura certificada traz esse vão em 22,40pp. No contrato de 2º lugar do 1º turno ele cai 2,00pp, para 68,50% (vol USD 1,05M acumulado), o único dos dois livros presidenciais em que cedeu no dia.",
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "0,95%",
    poll: "AS DUAS NACIONAIS DE 21/Set FECHARAM CAMPO NO MESMO 20/Set E MEDEM SINAIS OPOSTOS: BTG/Nexus (n=2.006, telefone CATI, campo de 18 a 20/Set, margem de 2,0pp, BR-00485/2026) e Palver (n=5.000, internet por anúncios em redes sociais, amostra não probabilística, campo de 15 a 20/Set, margem de 2,8pp, BR-00860/2026). Cada uma testou CINCO pares de 2º turno. É o nome de maior divergência entre as duas: 11% e TERCEIRO lugar na Palver, 3% e quinto na BTG/Nexus, oito pontos de distância. No 2º turno contra Lula, 34% a 43% na Palver e 39% a 47% na BTG/Nexus.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "NO CONTRATO DE 3º LUGAR DO 1º TURNO ELE CAI 7,00pp, PARA 45,50% (vol USD 0,36M acumulado), leitura confirmada de 21/Set, 17:01 BRT, a maior queda de qualquer contrato do painel nesta rodada. A dianteira dele sobre Augusto Cury naquele livro encolheu de 19,95pp para 5,25pp. No de vencedor sobe 0,20pp, para 0,95% (vol USD 13,99M acumulado), o segundo maior volume do livro presidencial inteiro: volume mede interesse acumulado desde a abertura, não probabilidade de agora.",
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0,05%",
    poll: "AS DUAS NACIONAIS DE 21/Set FECHARAM CAMPO NO MESMO 20/Set E MEDEM SINAIS OPOSTOS: BTG/Nexus (n=2.006, telefone CATI, campo de 18 a 20/Set, margem de 2,0pp, BR-00485/2026) e Palver (n=5.000, internet por anúncios em redes sociais, amostra não probabilística, campo de 15 a 20/Set, margem de 2,8pp, BR-00860/2026). Cada uma testou CINCO pares de 2º turno. Nenhuma das duas o testa em cenário presidencial: ele não é candidato à Presidência e disputa o governo de São Paulo.",
    position: "Centro-esquerda. Ministro da Fazenda até a desincompatibilização. Foco no maior colégio eleitoral do país.",
    risk: "Parado no piso do livro, 0,05%, leitura confirmada de 21/Set, 17:01 BRT, com USD 7,54M acumulados. Não é candidato à Presidência: disputa o governo de São Paulo, e por isso não aparece nos cenários presidenciais de 1º turno. O topo da série dele no contrato de vencedor é de 7,60%, medido no backup do banco.",
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "0,05%",
    poll: "AS DUAS NACIONAIS DE 21/Set FECHARAM CAMPO NO MESMO 20/Set E MEDEM SINAIS OPOSTOS: BTG/Nexus (n=2.006, telefone CATI, campo de 18 a 20/Set, margem de 2,0pp, BR-00485/2026) e Palver (n=5.000, internet por anúncios em redes sociais, amostra não probabilística, campo de 15 a 20/Set, margem de 2,8pp, BR-00860/2026). Cada uma testou CINCO pares de 2º turno. Tem 5% no 1º turno da BTG/Nexus, quarto colocado, e 1% na Palver. No 2º turno contra Lula a BTG/Nexus mede EMPATE em 45% a 45% e a Palver o dá à frente por 44% a 43%, as duas dentro da margem.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Candidato oficializado pelo PSD.",
    risk: "NO CONTRATO DE 3º LUGAR DO 1º TURNO ELE SOBE 4,00pp, PARA 15,50% (vol USD 0,14M acumulado), leitura confirmada de 21/Set, 17:01 BRT, a terceira maior alta da rodada, e mantém a terceira posição daquele livro. No de vencedor segue em 0,05%, com USD 7,65M acumulados, abaixo do corte de 0,5% que o painel usa para tratar preço fino como ruído.",
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0,15%",
    poll: "AS DUAS NACIONAIS DE 21/Set FECHARAM CAMPO NO MESMO 20/Set E MEDEM SINAIS OPOSTOS: BTG/Nexus (n=2.006, telefone CATI, campo de 18 a 20/Set, margem de 2,0pp, BR-00485/2026) e Palver (n=5.000, internet por anúncios em redes sociais, amostra não probabilística, campo de 15 a 20/Set, margem de 2,8pp, BR-00860/2026). Cada uma testou CINCO pares de 2º turno. Tem 1% no 1º turno nas duas. No 2º turno contra Lula as casas trocam o sinal: a BTG/Nexus dá Lula por 47% a 41%, fora de duas margens, e a Palver o dá à frente por 44% a 43%, dentro da margem.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "No contrato de 3º lugar do 1º turno ele cai 0,55pp, para 0,50% (vol USD 67 mil acumulados), leitura confirmada de 21/Set, 17:01 BRT. No de vencedor segue em 0,15%, com USD 7,65M acumulados, abaixo do corte de 0,5%. O topo da série dele no contrato de vencedor é de 12,00%, em 13/Mai, medido no backup do banco.",
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0,05%",
    poll: "AS DUAS NACIONAIS DE 21/Set FECHARAM CAMPO NO MESMO 20/Set E MEDEM SINAIS OPOSTOS: BTG/Nexus (n=2.006, telefone CATI, campo de 18 a 20/Set, margem de 2,0pp, BR-00485/2026) e Palver (n=5.000, internet por anúncios em redes sociais, amostra não probabilística, campo de 15 a 20/Set, margem de 2,8pp, BR-00860/2026). Cada uma testou CINCO pares de 2º turno. Nenhuma das duas o inclui no cenário estimulado de 1º turno nem em par de 2º turno.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Parado no piso do livro, 0,05%, leitura confirmada de 21/Set, 17:01 BRT, e ainda assim o contrato dele é o de maior volume acumulado do livro presidencial, USD 14,08M contra USD 13,99M do segundo colocado. Preço no piso com volume alto mede interesse passado, não probabilidade de agora.",
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
