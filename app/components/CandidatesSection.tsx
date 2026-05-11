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
    polymarket: "39.50%",
    poll: "Lula leve cede 39.50% Poly (↓1.00pp de 40.50%) gap leve expansão +1.85pp Flávio (vs +1.10pp ontem). 2L Lula 20.00% (↑0.50pp leve). STF IMPEACH leve cede 15.50% Poly (↓1.00pp). EVENTO MAIOR: Futura/Apex publicada hoje 2T Flávio 46,9% × Lula 44,4% empate técnico (CNN Brasil, JOTA, Poder360, UOL, O TEMPO 11/Mai). Lula rejeição 47,4% × Flávio 43,8% (Poder360 11/Mai). Datafolha nova pesquisa anunciada esta semana (VEJA, O Globo 11/Mai). Quaest publicação confirmada 13/Mai D-Day LAUNCH AFOS.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "Futura/Apex publicada hoje empate técnico (CNN Brasil, JOTA 11/Mai) reduz vantagem psicológica. Lula rejeição 47,4% acima Flávio 43,8% (Poder360 11/Mai). PT campanha terrorismo fiscal vs Flávio contra-ataque (Gazeta do Povo 11/Mai). Ciro Gomes descarta Presidência anuncia governo Ceará (O Dia, Terra 11/Mai) reduz fragmentação esquerda fora-PT. Kassio Nunes Marques assume TSE oficialmente (Terra 11/Mai). Mantida Estadão analítica Lula competitivo desgastado (10/Mai). Mantido Bondades R$ 144bi (Folha 09/Mai)."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "41.35%",
    poll: "Flávio leve cede 41.35% Poly (↓0.25pp de 41.60%) gap leve expansão +1.85pp Flávio. 2L Flávio 67.50% (↑1.00pp consolida). 3L Flávio DEVOLVE 3.30% (↓1.50pp). EVENTO MAIOR: Futura/Apex publicada hoje 2T Flávio 46,9% × Lula 44,4% empate técnico (CNN Brasil, JOTA, Poder360, UOL, O TEMPO, Estado de Minas, Exame 11/Mai). 1T também empate técnico Futura/Apex. Flávio rejeição 43,8% abaixo Lula 47,4% (Poder360 11/Mai). Datafolha nova pesquisa anunciada esta semana (VEJA, O Globo 11/Mai). Quaest publicação confirmada 13/Mai D-Day.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "Futura/Apex publicada hoje empate técnico 2T 46,9% × 44,4% confirma cenário competitivo (CNN Brasil 11/Mai). 'Empate técnico Lula cresce Flávio cai em pesquisa que deu vitória Bolsonaro 2022' (Revista Fórum 11/Mai) framing crítico. PT campanha terrorismo fiscal vs Flávio (Gazeta do Povo 11/Mai). Mantidos 10/Mai: PL 5 mil Florianópolis (WH3), Publicitário coordena comunicação (Folha), Flávio aposentar Lula (Poder360), camiseta Pix-Master (Pleno.News), fim reeleição (Muita Informação). Mantido governo 8 anos (Folha 09/Mai), acabar esquerda 40 anos (VEJA 09/Mai). Centrão preço apoio (Diário Carioca 10/Mai)."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "5.45%",
    poll: "Renan presidencial leve cede 5.45% Poly (↓0.10pp de 5.55%). 3L 31.50% estável Zema mantém liderança 33.50% (↓1.00pp). 2L Renan DISPARA 5.45% (↑0.50pp). STF impeach leve cede 15.50% Poly (↓1.00pp). Futura/Apex publicada hoje não destaca Renan (CNN Brasil 11/Mai). Ciro Gomes descarta Presidência sai do páreo (O Dia, Terra 11/Mai).",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "Caiado 3L DISPARA 18.50% (↑2.00pp continua avanço 2 dias seguidos) competidor 3ª via avança. Camilo 3L DISPARA 4.25% (↑3.20pp NOVO movimento) fragmenta espaço 3ª via. Futura/Apex publicada hoje empate técnico Lula × Flávio reduz oxigênio outsider (CNN Brasil 11/Mai). Quaest publicação confirmada 13/Mai D-Day não deve destacar Renan."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "3.95%",
    poll: "Haddad presidencial 3.95% estável Poly. 2L Haddad 3.00% estável (↓0.05pp leve). 3L 4.15% (↑0.25pp leve). Camilo presidencial 2.75% estável Haddad mantém 1.20pp ACIMA Camilo. PT Senado DISPARA COLOSSAL 2.15% (↑1.90pp recupera de COLAPSO 0.25% ontem) reorganização governista.",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Futura/Apex publicada hoje empate técnico nacional (CNN Brasil 11/Mai). Datafolha nova pesquisa anunciada esta semana (VEJA, O Globo 11/Mai). PT Senado DISPARA COLOSSAL recupera (↑1.90pp) sinal reorganização base governista. PSB Senado DEVOLVE COLOSSAL 0.75% (↓4.05pp). Lula leve cede presidencial 39.50% (↓1.00pp) gap leve expansão +1.85pp. Mantida pesquisa SP Tarcísio frente Haddad."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1.25%",
    poll: "Caiado presidencial 1.25% estável Poly. 3L DISPARA 18.50% (↑2.00pp DISPARA continua avanço 2 dias seguidos de 16.50%) consolida posição 3º lugar. PSD Senado DISPARA 3.25% (↑1.00pp recupera de 2.25%). Mantido Caiado lidera 3ª via 1T 5% Real Time. Ciro Gomes descarta Presidência reduz competidor 3ª via (O Dia, Terra 11/Mai).",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "SENADO REORGANIZAÇÃO TOTAL OUTRA VEZ 24h: Republicanos DISPARA FORTE 8.15% (↑4.30pp MAIOR MOVIMENTO 24h), Podemos DEVOLVE 5.10% (↓2.85pp), MDB DISPARA 4.90% (↑0.85pp), PSD DISPARA 3.25% (↑1.00pp), PT DISPARA COLOSSAL 2.15% (↑1.90pp recupera), PSB DEVOLVE COLOSSAL 0.75% (↓4.05pp), Novo DISPARA 0.80% (↑0.55pp). Camilo 3L DISPARA 4.25% (↑3.20pp NOVO movimento) fragmenta 3ª via. Futura/Apex publicada hoje empate técnico nacional (CNN Brasil 11/Mai)."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "4.45%",
    poll: "Zema presidencial DISPARA 4.45% Poly (↑0.30pp de 4.15%) recupera leve. 3L mantém liderança 33.50% (↓1.00pp leve cede). NOVO Senado DISPARA 0.80% (↑0.55pp recupera de 0.25%). INFLAÇÃO 5.00-5.49% DISPARA 36.60% dominante (↑1.65pp), 6.50-6.99% DISPARA FORTE 16.05% (↑6.65pp recupera), bandas altas (≥6.50%) DISPARA 28.90% (↑2.40pp recupera).",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Caiado 3L DISPARA 18.50% (↑2.00pp continua avanço 2 dias) competidor 3ª via ameaça. Camilo 3L DISPARA 4.25% (↑3.20pp NOVO) fragmenta espaço 3ª via. Futura/Apex publicada hoje empate técnico nacional reduz outsider (CNN Brasil 11/Mai). Ciro Gomes descarta Presidência (O Dia, Terra 11/Mai). Quaest publicação 13/Mai D-Day não deve destacar Zema. STF IMPEACH leve cede 15.50% (↓1.00pp) reduz narrativa anti-STF."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.25%",
    poll: "Tarcísio presidencial 0.25% Poly estável. 3L 0.25% estável. Republicanos Senado DISPARA FORTE 8.15% (↑4.30pp DISPARA de 3.85%) MAIOR MOVIMENTO Senado 24h consolida coalizão direita estadual.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Republicanos Senado DISPARA FORTE 8.15% (↑4.30pp MAIOR MOVIMENTO 24h) sinaliza coalizão direita estadual consolidando-se rapidamente. Frente a Frente Folha/UOL entrevista Kassab segunda 11/Mai (Folha 11/Mai). Mantido Tarcísio+Flávio reportados PG crimes eleitorais (Revista Fórum 02/Mai). Mantido foco reeleição SP."
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
