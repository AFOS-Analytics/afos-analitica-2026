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
    polymarket: "40,50%",
    poll: "AS TRÊS NACIONAIS COM CAMPO FECHANDO NO MESMO 20/Set MEDEM DISTÂNCIAS DIFERENTES: Quaest (n=2.004, presencial, campo de 17 a 20/Set, margem de 2,0pp, BR-06004/2026), BTG/Nexus (n=2.006, telefone CATI, campo de 18 a 20/Set, margem de 2,0pp, BR-00485/2026) e Palver (n=5.000, internet por anúncios em redes sociais, amostra não probabilística, campo de 15 a 20/Set, margem de 2,8pp, BR-00860/2026). No 1º turno a distância entre Lula e Flávio Bolsonaro sai de 4 pontos a favor de Lula na Quaest, 3 pontos a favor dele na BTG/Nexus e 1 ponto a favor de Flávio Bolsonaro na Palver. No par de 2º turno entre os dois, a Quaest dá 42% a 41% para Flávio Bolsonaro, a BTG/Nexus dá 46% a 45% para Lula e a Palver dá 47% a 43% para Flávio Bolsonaro. A divergência é maior na terceira via: Renan Santos tem 11% na Palver e 3% nas outras duas, e Augusto Cury tem 6% na Quaest e na BTG/Nexus e 2% na Palver.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "SOBE 2,00pp NO CONTRATO DE VENCEDOR, para 40,50% (vol USD 11,87M acumulado), leitura confirmada de 22/Set, 14:40 BRT, contra os 38,50% da leitura confirmada de 21/Set às 17:01 BRT, e o vão para Flávio Bolsonaro fecha de 22,40pp para 19,05pp. ⚖️ No normalizado pela soma do par, que foi de 99,40 para 100,05, a alta é de 1,75pp. ⚠️ Não é extremo: o preço dele está a 27,00pp do topo da série, 67,50% de 16 de agosto, e a 6,00pp do piso, 34,50% de 25 de abril. No contrato de 2º lugar do 1º turno ele sobe 0,40pp, para 29,80% (vol USD 0,89M acumulado).",
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "59,55%",
    poll: "AS TRÊS NACIONAIS COM CAMPO FECHANDO NO MESMO 20/Set MEDEM DISTÂNCIAS DIFERENTES: Quaest (n=2.004, presencial, campo de 17 a 20/Set, margem de 2,0pp, BR-06004/2026), BTG/Nexus (n=2.006, telefone CATI, campo de 18 a 20/Set, margem de 2,0pp, BR-00485/2026) e Palver (n=5.000, internet por anúncios em redes sociais, amostra não probabilística, campo de 15 a 20/Set, margem de 2,8pp, BR-00860/2026). No 1º turno a distância entre Lula e Flávio Bolsonaro sai de 4 pontos a favor de Lula na Quaest, 3 pontos a favor dele na BTG/Nexus e 1 ponto a favor de Flávio Bolsonaro na Palver. No par de 2º turno entre os dois, a Quaest dá 42% a 41% para Flávio Bolsonaro, a BTG/Nexus dá 46% a 45% para Lula e a Palver dá 47% a 43% para Flávio Bolsonaro. A divergência é maior na terceira via: Renan Santos tem 11% na Palver e 3% nas outras duas, e Augusto Cury tem 6% na Quaest e na BTG/Nexus e 2% na Palver.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "CEDE 1,35pp NO CONTRATO DE VENCEDOR, para 59,55% (vol USD 11,50M acumulado), leitura confirmada de 22/Set, 14:40 BRT, e 1,75pp no normalizado pela soma do par. O vão sobre Lula fecha de 22,40pp para 19,05pp, e os 22,40pp da véspera eram o maior dos 158 dias em que a série tem os dois lados. O preço dele está a 2,15pp do topo da série, 61,70% gravado em 21/Set. ⚠️ No contrato de 2º lugar do 1º turno ele foi na direção oposta e SOBE 1,00pp, para 69,50% (vol USD 1,06M acumulado).",
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "0,75%",
    poll: "AS TRÊS NACIONAIS COM CAMPO FECHANDO NO MESMO 20/Set MEDEM DISTÂNCIAS DIFERENTES: Quaest (n=2.004, presencial, campo de 17 a 20/Set, margem de 2,0pp, BR-06004/2026), BTG/Nexus (n=2.006, telefone CATI, campo de 18 a 20/Set, margem de 2,0pp, BR-00485/2026) e Palver (n=5.000, internet por anúncios em redes sociais, amostra não probabilística, campo de 15 a 20/Set, margem de 2,8pp, BR-00860/2026). No 1º turno a distância entre Lula e Flávio Bolsonaro sai de 4 pontos a favor de Lula na Quaest, 3 pontos a favor dele na BTG/Nexus e 1 ponto a favor de Flávio Bolsonaro na Palver. No par de 2º turno entre os dois, a Quaest dá 42% a 41% para Flávio Bolsonaro, a BTG/Nexus dá 46% a 45% para Lula e a Palver dá 47% a 43% para Flávio Bolsonaro. A divergência é maior na terceira via: Renan Santos tem 11% na Palver e 3% nas outras duas, e Augusto Cury tem 6% na Quaest e na BTG/Nexus e 2% na Palver.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "NO CONTRATO DE 3º LUGAR DO 1º TURNO ELE CAI 3,00pp, PARA 42,50% (vol USD 0,39M acumulado), leitura confirmada de 22/Set, 14:40 BRT, a maior queda de qualquer contrato do painel nesta rodada, e a dianteira dele sobre Augusto Cury encolhe de 5,25pp para 3,05pp. No contrato de vencedor cede 0,20pp, para 0,75%, a 0,05pp do piso da série, 0,70% de 21/Set. O contrato dele tem USD 14,07M acumulados, a 0,02M do maior do livro presidencial, o de Tarcísio de Freitas.",
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0,05%",
    poll: "AS TRÊS NACIONAIS COM CAMPO FECHANDO NO MESMO 20/Set MEDEM DISTÂNCIAS DIFERENTES: Quaest (n=2.004, presencial, campo de 17 a 20/Set, margem de 2,0pp, BR-06004/2026), BTG/Nexus (n=2.006, telefone CATI, campo de 18 a 20/Set, margem de 2,0pp, BR-00485/2026) e Palver (n=5.000, internet por anúncios em redes sociais, amostra não probabilística, campo de 15 a 20/Set, margem de 2,8pp, BR-00860/2026). No 1º turno a distância entre Lula e Flávio Bolsonaro sai de 4 pontos a favor de Lula na Quaest, 3 pontos a favor dele na BTG/Nexus e 1 ponto a favor de Flávio Bolsonaro na Palver. No par de 2º turno entre os dois, a Quaest dá 42% a 41% para Flávio Bolsonaro, a BTG/Nexus dá 46% a 45% para Lula e a Palver dá 47% a 43% para Flávio Bolsonaro. A divergência é maior na terceira via: Renan Santos tem 11% na Palver e 3% nas outras duas, e Augusto Cury tem 6% na Quaest e na BTG/Nexus e 2% na Palver.",
    position: "Centro-esquerda. Ministro da Fazenda até a desincompatibilização. Foco no maior colégio eleitoral do país.",
    risk: "Parado no piso do livro, 0,05%, leitura confirmada de 22/Set, 14:40 BRT, com USD 7,55M acumulados. Não é candidato à Presidência: disputa o governo de São Paulo, e por isso não aparece nos cenários das três nacionais.",
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "0,05%",
    poll: "AS TRÊS NACIONAIS COM CAMPO FECHANDO NO MESMO 20/Set MEDEM DISTÂNCIAS DIFERENTES: Quaest (n=2.004, presencial, campo de 17 a 20/Set, margem de 2,0pp, BR-06004/2026), BTG/Nexus (n=2.006, telefone CATI, campo de 18 a 20/Set, margem de 2,0pp, BR-00485/2026) e Palver (n=5.000, internet por anúncios em redes sociais, amostra não probabilística, campo de 15 a 20/Set, margem de 2,8pp, BR-00860/2026). No 1º turno a distância entre Lula e Flávio Bolsonaro sai de 4 pontos a favor de Lula na Quaest, 3 pontos a favor dele na BTG/Nexus e 1 ponto a favor de Flávio Bolsonaro na Palver. No par de 2º turno entre os dois, a Quaest dá 42% a 41% para Flávio Bolsonaro, a BTG/Nexus dá 46% a 45% para Lula e a Palver dá 47% a 43% para Flávio Bolsonaro. A divergência é maior na terceira via: Renan Santos tem 11% na Palver e 3% nas outras duas, e Augusto Cury tem 6% na Quaest e na BTG/Nexus e 2% na Palver.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Candidato oficializado pelo PSD.",
    risk: "SEM PREÇO NOVO NO CONTRATO DE 3º LUGAR DO 1º TURNO, em 15,50% (vol USD 0,16M acumulado), leitura confirmada de 22/Set, 14:40 BRT, onde mantém a terceira posição. No contrato de vencedor segue em 0,05%, com USD 7,66M acumulados.",
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0,05%",
    poll: "AS TRÊS NACIONAIS COM CAMPO FECHANDO NO MESMO 20/Set MEDEM DISTÂNCIAS DIFERENTES: Quaest (n=2.004, presencial, campo de 17 a 20/Set, margem de 2,0pp, BR-06004/2026), BTG/Nexus (n=2.006, telefone CATI, campo de 18 a 20/Set, margem de 2,0pp, BR-00485/2026) e Palver (n=5.000, internet por anúncios em redes sociais, amostra não probabilística, campo de 15 a 20/Set, margem de 2,8pp, BR-00860/2026). No 1º turno a distância entre Lula e Flávio Bolsonaro sai de 4 pontos a favor de Lula na Quaest, 3 pontos a favor dele na BTG/Nexus e 1 ponto a favor de Flávio Bolsonaro na Palver. No par de 2º turno entre os dois, a Quaest dá 42% a 41% para Flávio Bolsonaro, a BTG/Nexus dá 46% a 45% para Lula e a Palver dá 47% a 43% para Flávio Bolsonaro. A divergência é maior na terceira via: Renan Santos tem 11% na Palver e 3% nas outras duas, e Augusto Cury tem 6% na Quaest e na BTG/Nexus e 2% na Palver.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "No contrato de 3º lugar do 1º turno ele cai 0,15pp, para 0,35% (vol USD 0,08M acumulado), leitura confirmada de 22/Set, 14:40 BRT, no piso daquele livro. No de vencedor está em 0,05%, com USD 7,66M acumulados.",
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0,05%",
    poll: "AS TRÊS NACIONAIS COM CAMPO FECHANDO NO MESMO 20/Set MEDEM DISTÂNCIAS DIFERENTES: Quaest (n=2.004, presencial, campo de 17 a 20/Set, margem de 2,0pp, BR-06004/2026), BTG/Nexus (n=2.006, telefone CATI, campo de 18 a 20/Set, margem de 2,0pp, BR-00485/2026) e Palver (n=5.000, internet por anúncios em redes sociais, amostra não probabilística, campo de 15 a 20/Set, margem de 2,8pp, BR-00860/2026). No 1º turno a distância entre Lula e Flávio Bolsonaro sai de 4 pontos a favor de Lula na Quaest, 3 pontos a favor dele na BTG/Nexus e 1 ponto a favor de Flávio Bolsonaro na Palver. No par de 2º turno entre os dois, a Quaest dá 42% a 41% para Flávio Bolsonaro, a BTG/Nexus dá 46% a 45% para Lula e a Palver dá 47% a 43% para Flávio Bolsonaro. A divergência é maior na terceira via: Renan Santos tem 11% na Palver e 3% nas outras duas, e Augusto Cury tem 6% na Quaest e na BTG/Nexus e 2% na Palver.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Parado no piso do livro, 0,05%, leitura confirmada de 22/Set, 14:40 BRT, e ainda assim o contrato dele é o de maior volume acumulado do livro presidencial, USD 14,09M, com o de Renan Santos a 0,02M dele.",
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
