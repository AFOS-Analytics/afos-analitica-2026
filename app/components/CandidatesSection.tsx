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
    polymarket: "40.50%",
    poll: "Lula devolve 1pp Poly 40.50% (↓1.0pp 24h, vol USD 6.16M acumulado). Gap Lula × Flávio ESTREITA a +12.35pp (de +13.30pp), mas segue o mais largo do ciclo recente. Sem pesquisa nacional nova: Vox Brasil 05/Jun (n=2.100, BR-08016/2026) segue referência — 1T Lula 42.1% × Flávio 33.6% (gap +8.5pp), Lula +7.8pp desde meados de maio; 2T 47.8 × 41.3, e Lula empata Caiado e Zema.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTOS 06/Jun D+22: dia de continuidade — Lula devolve 1pp e o gap estreita a +12.35pp, ainda o mais largo do ciclo. O tarifaço/PIX (TariFlávio) segue como ganho do governo e passivo de Flávio. Contraponto: rejeição da indicação de Messias ao STF lida como 'cacetada' em Lula (Gazeta do Povo); PoderData aponta 52% de desaprovação à participação de Janja. STF impeach 5.25% estável."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "28.15%",
    poll: "Flávio ~estável: Poly 28.15% (↓0.05pp 24h, vol USD 6.43M acumulado) — segue bem abaixo do patamar pré-salto de 02/Jun. Gap para Lula estreita a +12.35pp. Vox Brasil 05/Jun: 1T 33.6% (gap -8.5pp, caiu 2.9pp desde meados de maio); 2T 41.3% × Lula 47.8. SENADO PL 73.50% (vol USD 243k). Rejeição 46% > Lula 45% (Datafolha 22/Mai).",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 06/Jun: o tarifaço/PIX (TariFlávio) segue como PASSIVO — a visita a Trump foi lida como 'gol contra' (Intercept) e Flávio caiu nos rankings de engajamento nas redes após o caso Vorcaro (Exame, Revista Fórum). No STF, Flávio pede que Moraes seja declarado suspeito no caso Master (Estadão, Terra) e Fachin nega afastar Nunes Marques da relatoria da CPI (Jornal do Brasil, UOL). Mantida rejeição Flávio 46% > Lula 45%. STF impeach 5.25% estável."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "16.70%",
    poll: "Renan presidencial Poly 16.70% (↑0.3pp 24h, vol USD 6.62M acumulado), 3º no mercado presidencial à frente de Haddad (3.25%), Zema (3.05%), Caiado (1.95%). Favorito a terminar em 3º lugar no 1º turno (44.50%) e 2º colocado no mercado do 2º lugar (18.35%, atrás de Flávio 62.50%). Vox Brasil 05/Jun não destaca Renan no 1T; divergência mercado × pesquisa (~10pp) persiste como a mais larga do dashboard.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "Renan subiu levemente e segue, nas apostas, muito acima do que as pesquisas lhe dão (~10pp, a maior divergência do dashboard — a Vox 05/Jun sequer o destaca no recorte principal de 1º turno). É favorito ao 3º lugar (44.50%) e 2º no mercado do 2º colocado, atrás de Flávio. A VEJA fala em 'candidato que cresce nas pesquisas e vira dor de cabeça para a direita' no duelo Lula × Flávio. STF impeach 5.25% estável."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "3.25%",
    poll: "Haddad RECUPERA Poly 3.25% (↑0.6pp 24h, vol USD 5.56M acumulado) — retoma o prêmio e a 3ª posição presidencial do mercado que havia devolvido. Vox Brasil 05/Jun não lista Haddad no presidencial nacional. Mantida Vox SP 30/Mai 2T estadual Tarcísio 48.3% × Haddad 36.5% (Poder360).",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Haddad recuperou terreno no mercado (↑0.6pp). Como ministro da Fazenda, segue no centro da disputa do PIX/tarifaço, em que o governo cravou 'O PIX é do Brasil' como bandeira, mas o mercado não precifica candidatura presidencial dele. Disputa estadual SP desfavorável (Vox 30/Mai Tarcísio 48.3% × Haddad 36.5%). STF impeach 5.25% estável."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1.95%",
    poll: "Caiado leve recuo no piso: Poly 1.95% (↓0.4pp 24h, vol USD 3.87M acumulado). Vox Brasil 05/Jun: 1T Caiado 6.9% (LIDERA a 3ª via na pesquisa); 2T Lula empata Caiado — aqui o poll vê MUITO MAIS que o mercado (inversão rara, em 2 pesquisas seguidas, com RTBD 01/Jun 6% e empate 43×43).",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "Caiado segue no piso do mercado, mas é o líder da 3ª via nas pesquisas: a Vox 05/Jun dá 6.9% no 1T e empate com Lula no 2T, leitura que o mercado não precifica (mantém abaixo de 2%). É a inversão rara em que duas pesquisas seguidas veem mais que o Polymarket. STF impeach 5.25% estável."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "3.05%",
    poll: "Zema presidencial Poly 3.05% (↓0.2pp 24h, vol USD 3.47M), ainda no piso da 3ª via. Vox Brasil 05/Jun: 2T Lula empata Zema (poll vê mais que o mercado). 3ª via sem tração com a disputa bipolarizada Lula × Flávio. Mantida Quaest 13/Mai Zema 4% empate Caiado.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Zema com leve recuo, segue no piso — a 3ª via não reabre com a disputa bipolarizada. A Vox 05/Jun dá Lula empatando Zema no 2º turno, leitura mais favorável que a do mercado. STF impeach 5.25% estável."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.15%",
    poll: "Tarcísio presidencial 0.15% Poly estável (vol USD ~12.4M acumulado, anomalia de legado). PL Senado em 73.50% (vol USD 243k). Vox Brasil 05/Jun não destaca Tarcísio nacional (foco reeleição SP). Mantida Vox SP 30/Mai 2T estadual Tarcísio 48.3% × Haddad 36.5% (Poder360).",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Tarcísio foi o fiador do realinhamento de 02/Jun (apoio a Flávio), mas o salto que ele destravou já reverteu inteiro com o tarifaço virando passivo (TariFlávio). Foco na reeleição em SP, onde lidera. STF impeach 5.25% estável."
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
