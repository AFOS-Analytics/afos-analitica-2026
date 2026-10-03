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
    polymarket: "35,50%",
    poll: "SETE PESQUISAS NACIONAIS FORAM DIVULGADAS EM 03/Out, VÉSPERA DO 1º TURNO: Datafolha (BR-01708/2026, n=4.006) dá Lula 42% a 40% e 47% a 46%; Quaest (BR-02197/2026, n=3.702) dá Lula 40% a 38% e Flávio Bolsonaro 44% a 42%; PoderData (BR-03519/2026, n=4.000) dá Lula 42% a 41% e empate em 46%; CNT/MDA (BR-04756/2026, n=2.007) dá Lula 43,1% a 38% e 47,3% a 43,1%; Palver (BR-00198/2026, n=5.000, online) dá Flávio Bolsonaro 47% a 43% e 49% a 44%; Gerp (BR-00509/2026, n=2.400) dá Flávio Bolsonaro 43% a 41% e 49% a 44%; e Futura/100% Cidades (BR-02431/2026, n=2.000) dá Flávio Bolsonaro 42,5% a 40,5% e 48% a 45,1%. Lula lidera o 1º turno em quatro e Flávio Bolsonaro em três; no 2º turno Flávio Bolsonaro lidera em quatro, Lula em duas e a PoderData dá empate.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "CAI 7,00pp NO CONTRATO DE VENCEDOR, para 35,50% (vol USD 14,46M acumulado), leitura confirmada de 03/Out, 20:23 BRT, e 6,91pp no normalizado. O vão de Flávio Bolsonaro sobre ele abre de 15,25pp para 29,05pp. O preço dele está a 1,00pp do piso da série, 34,50% de 25 de abril, e a 32,00pp do topo, 67,50% de 16 de agosto. No contrato de 2º lugar do 1º turno sobe 17,30pp, para 41,00% (vol USD 1,46M acumulado).",
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "64,55%",
    poll: "SETE PESQUISAS NACIONAIS FORAM DIVULGADAS EM 03/Out, VÉSPERA DO 1º TURNO: Datafolha (BR-01708/2026, n=4.006) dá Lula 42% a 40% e 47% a 46%; Quaest (BR-02197/2026, n=3.702) dá Lula 40% a 38% e Flávio Bolsonaro 44% a 42%; PoderData (BR-03519/2026, n=4.000) dá Lula 42% a 41% e empate em 46%; CNT/MDA (BR-04756/2026, n=2.007) dá Lula 43,1% a 38% e 47,3% a 43,1%; Palver (BR-00198/2026, n=5.000, online) dá Flávio Bolsonaro 47% a 43% e 49% a 44%; Gerp (BR-00509/2026, n=2.400) dá Flávio Bolsonaro 43% a 41% e 49% a 44%; e Futura/100% Cidades (BR-02431/2026, n=2.000) dá Flávio Bolsonaro 42,5% a 40,5% e 48% a 45,1%. Lula lidera o 1º turno em quatro e Flávio Bolsonaro em três; no 2º turno Flávio Bolsonaro lidera em quatro, Lula em duas e a PoderData dá empate.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "SOBE 6,80pp NO CONTRATO DE VENCEDOR, para 64,55% (vol USD 14,08M acumulado), leitura confirmada de 03/Out, 20:23 BRT, e 6,91pp no normalizado. O vão sobre Lula abre de 15,25pp para 29,05pp, e o preço dele fica 1,25pp acima do topo gravado da série, 63,30% de 1º de outubro. No contrato de 2º lugar do 1º turno cai 18,00pp, para 58,50% (vol USD 1,75M acumulado).",
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "0,15%",
    poll: "SETE PESQUISAS NACIONAIS FORAM DIVULGADAS EM 03/Out, VÉSPERA DO 1º TURNO: Datafolha (BR-01708/2026, n=4.006) dá Lula 42% a 40% e 47% a 46%; Quaest (BR-02197/2026, n=3.702) dá Lula 40% a 38% e Flávio Bolsonaro 44% a 42%; PoderData (BR-03519/2026, n=4.000) dá Lula 42% a 41% e empate em 46%; CNT/MDA (BR-04756/2026, n=2.007) dá Lula 43,1% a 38% e 47,3% a 43,1%; Palver (BR-00198/2026, n=5.000, online) dá Flávio Bolsonaro 47% a 43% e 49% a 44%; Gerp (BR-00509/2026, n=2.400) dá Flávio Bolsonaro 43% a 41% e 49% a 44%; e Futura/100% Cidades (BR-02431/2026, n=2.000) dá Flávio Bolsonaro 42,5% a 40,5% e 48% a 45,1%. Lula lidera o 1º turno em quatro e Flávio Bolsonaro em três; no 2º turno Flávio Bolsonaro lidera em quatro, Lula em duas e a PoderData dá empate.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "CAI 10,00pp NO CRU NO CONTRATO DE 3º LUGAR DO 1º TURNO, para 52,50% (vol USD 0,68M acumulado), leitura confirmada de 03/Out, 20:23 BRT, e 9,67pp no normalizado, e segue à frente naquele livro, 27,50pp sobre Ronaldo Caiado. No de vencedor está em 0,15%. 🏆 O contrato dele no livro de vencedor segue sendo o de MAIOR volume acumulado do presidencial, USD 16,14M contra USD 14,65M do de Tarcísio de Freitas.",
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "0,05%",
    poll: "SETE PESQUISAS NACIONAIS FORAM DIVULGADAS EM 03/Out, VÉSPERA DO 1º TURNO: Datafolha (BR-01708/2026, n=4.006) dá Lula 42% a 40% e 47% a 46%; Quaest (BR-02197/2026, n=3.702) dá Lula 40% a 38% e Flávio Bolsonaro 44% a 42%; PoderData (BR-03519/2026, n=4.000) dá Lula 42% a 41% e empate em 46%; CNT/MDA (BR-04756/2026, n=2.007) dá Lula 43,1% a 38% e 47,3% a 43,1%; Palver (BR-00198/2026, n=5.000, online) dá Flávio Bolsonaro 47% a 43% e 49% a 44%; Gerp (BR-00509/2026, n=2.400) dá Flávio Bolsonaro 43% a 41% e 49% a 44%; e Futura/100% Cidades (BR-02431/2026, n=2.000) dá Flávio Bolsonaro 42,5% a 40,5% e 48% a 45,1%. Lula lidera o 1º turno em quatro e Flávio Bolsonaro em três; no 2º turno Flávio Bolsonaro lidera em quatro, Lula em duas e a PoderData dá empate.",
    position: "Centro-esquerda. Ministro da Fazenda até a desincompatibilização. Foco no maior colégio eleitoral do país.",
    risk: "Parado no piso do livro, 0,05%, leitura confirmada de 03/Out, 20:23 BRT, com USD 7,74M acumulados. Não é candidato à Presidência: disputa o governo de São Paulo, e por isso não aparece nos cenários presidenciais das nacionais de 03/Out.",
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "0,05%",
    poll: "SETE PESQUISAS NACIONAIS FORAM DIVULGADAS EM 03/Out, VÉSPERA DO 1º TURNO: Datafolha (BR-01708/2026, n=4.006) dá Lula 42% a 40% e 47% a 46%; Quaest (BR-02197/2026, n=3.702) dá Lula 40% a 38% e Flávio Bolsonaro 44% a 42%; PoderData (BR-03519/2026, n=4.000) dá Lula 42% a 41% e empate em 46%; CNT/MDA (BR-04756/2026, n=2.007) dá Lula 43,1% a 38% e 47,3% a 43,1%; Palver (BR-00198/2026, n=5.000, online) dá Flávio Bolsonaro 47% a 43% e 49% a 44%; Gerp (BR-00509/2026, n=2.400) dá Flávio Bolsonaro 43% a 41% e 49% a 44%; e Futura/100% Cidades (BR-02431/2026, n=2.000) dá Flávio Bolsonaro 42,5% a 40,5% e 48% a 45,1%. Lula lidera o 1º turno em quatro e Flávio Bolsonaro em três; no 2º turno Flávio Bolsonaro lidera em quatro, Lula em duas e a PoderData dá empate.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Candidato oficializado pelo PSD.",
    risk: "SOBE 13,50pp NO CRU NO CONTRATO DE 3º LUGAR DO 1º TURNO, para 25,00% (vol USD 0,23M acumulado), leitura confirmada de 03/Out, 20:23 BRT, e 13,23pp no normalizado, e passa Augusto Cury naquele livro. 🗳️ É o terceiro colocado do 1º turno na Datafolha de 03/Out, com 4%. No contrato de vencedor segue em 0,05%, com USD 7,81M acumulados.",
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "0,05%",
    poll: "SETE PESQUISAS NACIONAIS FORAM DIVULGADAS EM 03/Out, VÉSPERA DO 1º TURNO: Datafolha (BR-01708/2026, n=4.006) dá Lula 42% a 40% e 47% a 46%; Quaest (BR-02197/2026, n=3.702) dá Lula 40% a 38% e Flávio Bolsonaro 44% a 42%; PoderData (BR-03519/2026, n=4.000) dá Lula 42% a 41% e empate em 46%; CNT/MDA (BR-04756/2026, n=2.007) dá Lula 43,1% a 38% e 47,3% a 43,1%; Palver (BR-00198/2026, n=5.000, online) dá Flávio Bolsonaro 47% a 43% e 49% a 44%; Gerp (BR-00509/2026, n=2.400) dá Flávio Bolsonaro 43% a 41% e 49% a 44%; e Futura/100% Cidades (BR-02431/2026, n=2.000) dá Flávio Bolsonaro 42,5% a 40,5% e 48% a 45,1%. Lula lidera o 1º turno em quatro e Flávio Bolsonaro em três; no 2º turno Flávio Bolsonaro lidera em quatro, Lula em duas e a PoderData dá empate.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "ESTÁ EM 0,35% NO CONTRATO DE 3º LUGAR DO 1º TURNO (vol USD 0,12M acumulado), leitura confirmada de 03/Out, 20:23 BRT. 🗳️ Nas nacionais de 03/Out que o pontuam tem de 0,8% a 1%. No de vencedor está em 0,05%, com USD 7,73M acumulados.",
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0,05%",
    poll: "SETE PESQUISAS NACIONAIS FORAM DIVULGADAS EM 03/Out, VÉSPERA DO 1º TURNO: Datafolha (BR-01708/2026, n=4.006) dá Lula 42% a 40% e 47% a 46%; Quaest (BR-02197/2026, n=3.702) dá Lula 40% a 38% e Flávio Bolsonaro 44% a 42%; PoderData (BR-03519/2026, n=4.000) dá Lula 42% a 41% e empate em 46%; CNT/MDA (BR-04756/2026, n=2.007) dá Lula 43,1% a 38% e 47,3% a 43,1%; Palver (BR-00198/2026, n=5.000, online) dá Flávio Bolsonaro 47% a 43% e 49% a 44%; Gerp (BR-00509/2026, n=2.400) dá Flávio Bolsonaro 43% a 41% e 49% a 44%; e Futura/100% Cidades (BR-02431/2026, n=2.000) dá Flávio Bolsonaro 42,5% a 40,5% e 48% a 45,1%. Lula lidera o 1º turno em quatro e Flávio Bolsonaro em três; no 2º turno Flávio Bolsonaro lidera em quatro, Lula em duas e a PoderData dá empate.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Parado no piso do livro, 0,05%, leitura confirmada de 03/Out, 20:23 BRT, com USD 14,65M acumulados, e o contrato dele segue atrás do de Renan Santos em volume acumulado no livro presidencial, que tem USD 16,14M.",
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
