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
    poll: "Lula DISPARA 40.50% Poly (↑3.00pp de 37.50%) maior movimento individual presidencial em 24h. Gap COLAPSA para +1.10pp Flávio (vs +6.15pp ontem) compressão sem precedentes. 2L Lula 19.50% estável. STF IMPEACH DISPARA 16.50% Poly (↑2.50pp de 14.00%) continuação repercussão decisão Moraes Lei Dosimetria. Mantida Quaest às vésperas publicação 13/Mai (VEJA 10/Mai).",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "Estadão analítica dados explicam por que mesmo desgastado Lula segue competitivo (Estadão 10/Mai). Lula mensagem Dia das Mães acena eleitorado feminino (BOL, Poder360, R7 10/Mai). Lula e Flávio buscam apoio feminino no Dia das Mães (diário do estado 10/Mai). Centrão define preço para apoiar Lula ou Flávio (Diário Carioca 10/Mai). Mantido decisão Moraes Lei Dosimetria 09/Mai polariza base Lula vs oposição. Mantido Bondades governo Lula R$ 144 bilhões ano eleitoral (Folha 09/Mai)."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "41.60%",
    poll: "Flávio DEVOLVE 41.60% Poly (↓2.05pp de 43.65%) primeira queda significativa após série de altas. Gap COLAPSA para +1.10pp (vs +6.15pp ontem). 2L Flávio 66.50% estável consolida liderança forte. 3L Flávio leve cede 4.80%. Mantida Quaest publicação 13/Mai (VEJA 10/Mai). Pesquisa MS mostra Flávio à frente Lula governo Riedel lidera (Enfoque MS 10/Mai). Disputa apertada Lula × Flávio segue acirrada (Real Time Big Data 10/Mai recap).",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "Flávio diz Brasil vai aposentar Lula em 2026 (Poder360 10/Mai). PL reúne 5 mil apoiadores Florianópolis lança pré-candidaturas 2026 (WH3 10/Mai) consolida ato sábado. Publicitário amigo Flávio vai coordenar comunicação campanha (Folha 10/Mai) profissionalização. Flávio camiseta Pix é Bolsonaro Master é Lula (Pleno.News 10/Mai) consolida narrativa. Flávio Jovens mal sabem interpretar texto Lula educação (Poder360 10/Mai). Flávio defende fim reeleição mandato 4 anos muito pouco (Muita Informação 10/Mai). Mantido governo de até 8 anos (Folha 09/Mai), acabar com esquerda 40 anos (VEJA 09/Mai). Centrão preço apoio Lula ou Flávio (Diário Carioca 10/Mai)."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "5.55%",
    poll: "Renan presidencial leve cede 5.55% Poly (↓0.30pp de 5.85%). 3L 31.50% (↓1.00pp de 32.50%) Zema mantém liderança 34.50%. 2L Renan leve cede 4.95% (↓0.10pp). STF impeach DISPARA 16.50% Poly (↑2.50pp) maior repercussão Moraes Dosimetria favorece narrativa anti-establishment.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "Caiado 3L DISPARA 16.50% (↑3.00pp recupera de 13.50%) competidor 3ª via avança forte. Lula DISPARA presidencial 40.50% (↑3.00pp) reduz oxigênio outsider. Quaest às vésperas publicação 13/Mai não destaca Renan (VEJA 10/Mai). Mantido sem destaque pesquisas estaduais MS, SC."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "3.95%",
    poll: "Haddad presidencial leve cede 3.95% Poly (↓0.10pp de 4.05%). 2L Haddad leve avança 3.05% (↑0.10pp). 3L 3.90% leve cede. Camilo presidencial DISPARA leve 2.75% (↑0.20pp) Haddad mantém 1.20pp ACIMA Camilo gap presidencial estreitando. PT Senado DEVOLVE COLOSSAL 0.25% (↓2.30pp DEVOLVE de 2.55%) movimento extraordinário.",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Lula DISPARA presidencial 40.50% (↑3.00pp) consolida vetor PT central. PT Senado COLAPSA 0.25% (↓2.30pp DEVOLVE COLOSSAL) reorganização contra direita estadual. PSB DISPARA FORTE Senado 4.80% (↑3.55pp). Mantida pesquisa SP Tarcísio frente Haddad. Estadão analítica Lula segue competitivo mesmo desgastado (10/Mai)."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1.25%",
    poll: "Caiado presidencial leve cede 1.25% Poly (↓0.20pp de 1.45%). 3L DISPARA 16.50% (↑3.00pp DISPARA recupera de 13.50%) maior salto individual 3º lugar 24h. PSD Senado DEVOLVE FORTE 2.25% (↓2.00pp DEVOLVE de 4.25%). Mantido Caiado lidera 3ª via 1T 5% (Real Time Big Data 05/Mai recap 10/Mai). Caiado em rodeios palanques Flávio Caiado Zema (diário do estado 10/Mai).",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "Senado REORGANIZAÇÃO TOTAL HOJE: PL DISPARA 83.00% (↑1.50pp), Podemos DISPARA COLOSSAL 7.95% (↑6.55pp de 1.40%), PSB DISPARA FORTE 4.80% (↑3.55pp), Republicanos DISPARA FORTE 3.85% (↑2.85pp), MDB ↑0.75pp 4.05%, União leve cede 3.65% (↓0.60pp), PSD DEVOLVE FORTE 2.25% (↓2.00pp), PT DEVOLVE COLOSSAL 0.25% (↓2.30pp). Movimento sem paralelo Senado 24h. Flávio Caiado Zema rodeios palanques (diário do estado 10/Mai)."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "4.15%",
    poll: "Zema presidencial leve cede 4.15% Poly (↓0.20pp de 4.35%). 3L mantém liderança 34.50% (↓0.50pp leve cede). NOVO Senado DEVOLVE 0.25% (↓0.60pp) movimento técnico. INFLAÇÃO 5.00-5.49% DISPARA 34.95% (↑2.20pp dominante), 7.00%+ DISPARA 17.10% (↑2.35pp), bandas altas (≥6.50%) leve cedem 26.50% (↓1.10pp).",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Lula DISPARA 40.50% (↑3.00pp) reduz oxigênio outsider. Caiado 3L DISPARA 16.50% (↑3.00pp recupera) competidor 3ª via avança. STF IMPEACH DISPARA 16.50% (↑2.50pp) reabre narrativa anti-STF mas Zema não captura. Quaest às vésperas publicação 13/Mai não destaca Zema (VEJA 10/Mai). Zema rodeios palanques Flávio Caiado Zema (diário do estado 10/Mai)."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.25%",
    poll: "Tarcísio presidencial DISPARA leve 0.25% Poly (↑0.10pp de 0.15%). 3L 0.25% (estável). Republicanos Senado DISPARA FORTE 3.85% (↑2.85pp DISPARA de 1.00%) movimento extraordinário consolidação direita.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Republicanos Senado DISPARA FORTE 3.85% sinaliza coalizão direita estadual em construção. Flávio recebe articulação Centrão preço apoio (Diário Carioca 10/Mai). Mantido Tarcísio+Flávio reportados PG crimes eleitorais (Revista Fórum 02/Mai). Mantido foco reeleição SP."
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
