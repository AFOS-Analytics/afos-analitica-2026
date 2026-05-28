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
    polymarket: "41.50%",
    poll: "Lula 45.50% Poly ESTÁVEL 48h+ (vol USD 5.73M acumulado, sem alteração desde 21/Mai). Gap +17.75pp Lula sobre Flávio (↑0.30pp 24h Lula amplia leve porque Flávio cede 0.30pp). 2L Lula 11.50% estável. STF IMPEACH continua correção 6.65% (↑0.20pp 24h vs 6.45% véspera trajetória upward sustentada). REVERBERAÇÃO DATAFOLHA 23/Mai: 48% defendem Flávio abdicar candidatura (G1 23/Mai); APROVAÇÃO governo Lula MELHORA 32% ótimo/bom vs 28% anterior, rejeição cai 38% vs 41% (G1, Folha, O Globo 23/Mai); PT e PL pregam cautela (O Globo). Mantida Datafolha 22/Mai 1T Lula 40% × Flávio 31% gap +9pp; 2T 47%×43% gap +4pp; cenário Michelle 48%×43% gap +5pp; rejeição Flávio 46% > Lula 45% 1ª vez. Vox 20/Mai 2T 46.8% gap +8.7pp. AtlasIntel 19/Mai 1T 47% gap +12.7pp; 2T 48.9% gap +7.1pp. DIVERGÊNCIAS: Poly +17.75pp vs Datafolha 22/Mai 2T +4pp vs Vox +8.7pp vs Atlas +7.1pp.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTOS 23/Mai D+9: REVERBERAÇÃO DATAFOLHA consolida narrativa Dark Horse + efeito Lula: 48% defendem Flávio abdicar candidatura (G1); aprovação governo Lula MELHORA 32% ótimo/bom vs 28%, rejeição cai 38% (G1, Folha, O Globo, Muita Informação, Metropolitana FM 23/Mai); Integrantes campanha Lula dizem pacote pesou na melhora avaliação (O Globo); PT e PL pregam cautela após Lula abrir vantagem (O Globo); Folha mercado O rachadão dos Bolsonaros embalado pelo pancadão do debate ruim. EVENTOS 23/Mai: Fux vota manter prisão pai+primo Vorcaro (CBN, O Globo) continua decisão Mendonça véspera; Congresso trava CPI Master 7 iniciativas (G1); Flávio vai aos EUA buscar Trump (BBC) sob olhar atento Lula; Lula no RJ ataca Cláudio Castro Trabalhe para prender ladrões que governaram o Rio (Folha); Lula e Motta preparam reunião 2ª 26/Mai fim 6x1 (Folha); Justiça EUA autoriza Moraes notificado por email Rumble Trump Media (O Globo). Mantida Datafolha 22/Mai: 1T 40%×31% gap +9pp; 2T 47%×43% gap +4pp; cenário Michelle 48%×43% gap +5pp; rejeição Flávio 46% > Lula 45% 1ª vez. Mantidos 22/Mai: Mendonça vota manter prisão Vorcaro; Gilmar pede vista; Flávio NÃO assinou 3 de 5 CPI Master desmascara narrativa; delação rejeitada Vorcaro; análise Valor dano Dark Horse não se esgotou; Futura/Apex Lula vira 2T (JOTA); Lula veta PL envio massa mensagens (CartaCapital). MAS: rejeição Lula 45% Datafolha próxima Flávio 46%; oposição segue tentando derrubar decretos via Congresso. STF IMPEACH continua correção 6.65%."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "28.65%",
    poll: "Flávio cede leve Poly 27.75% (↓0.30pp 24h vs 28.05% fechamento 22/Mai, vol USD 5.94M acumulado); ainda ↓3.55pp 5 dias vs 31.30% 17/Mai. Gap Lula amplia leve +17.75pp. 2L Flávio 57.00% topo absoluto (↓1.00pp 24h, vol USD 57k baixo). 3L Flávio 11.15% estável. PL Senado RECUPERA 70.00% (↑1.00pp 24h vs 69.00% véspera, vol USD 243k). REVERBERAÇÃO DATAFOLHA 23/Mai: 48% defendem Flávio abdicar candidatura (G1); PT e PL pregam cautela após Lula abrir vantagem (O Globo); Folha PL enredado nos maus lençóis Bolsonaro; Folha 15:00 Flávio Bolsonaro na casa de Vorcaro; JOTA Eleitorado antipetista mantém Flávio firme como opção; Folha Dark Horse abala Flávio mas antipetismo é amortecedor 2T. Mantida Datafolha 22/Mai: 1T Flávio 31% (↓4pp vs 16/Mai 35%) gap -9pp Lula; 2T 43% gap -4pp; cenário Michelle 2T 43% empate (Lula 48% gap +5pp Michelle perde mais que Flávio); rejeição Flávio 46% supera Lula 45% numericamente pela 1ª vez. Vox 20/Mai 2T 38.1% rejeição 49.2%. AtlasIntel 19/Mai 1T 34.3% rejeição 52%.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 23/Mai D+9: REVERBERAÇÃO DATAFOLHA consolida narrativa Dark Horse: 48% defendem Flávio abdicar candidatura após divulgação áudios Vorcaro (G1 23/Mai) número de calibre eleitoral; PT e PL pregam cautela após Lula abrir vantagem (O Globo); Folha PL enredado nos maus lençóis Bolsonaro; Folha 15:00 Flávio Bolsonaro na casa de Vorcaro; Folha mercado O rachadão dos Bolsonaros embalado pelo pancadão do debate ruim; Bolsonarinho virou azarão e terminará como pangaré deputado PT (Folha); Coluna Correio Braziliense O sobrevivente na UTI sobre Flávio. EVENTOS 23/Mai: Flávio vai aos EUA em busca de Trump e agenda positiva em meio à crise (BBC) sob olhar atento Lula; Fux vota manter prisão pai+primo Vorcaro (CBN, O Globo) continua decisão Mendonça véspera; Congresso trava instalação CPI Banco Master 7 iniciativas aguardam (G1); Dona produtora Dark Horse buscou Lei Rouanet R$ 8,6 mi (Folha) entorno empresarial sob escrutínio. JOTA: Eleitorado antipetista mantém Flávio firme como opção para vencer Lula (amortecedor 2T). Mantida Datafolha 22/Mai: 1T 31% gap -9pp; 2T 43% gap -4pp; rejeição Flávio 46% supera Lula 45% 1ª vez. Mantidos 22/Mai: Mendonça vota manter prisão Vorcaro; Gilmar pede vista; Flávio NÃO assinou 3 de 5 CPI Master desmascara narrativa Flávio cobra CPI cobrada 21/Mai; delação rejeitada Vorcaro; análise Valor dano Dark Horse não se esgotou; VEJA coluna Flávio caiu mas subiu 13 pontos no ano; Folha Equipe de Flávio minimiza efeito Dark Horse. MICHELLE Poly cede 2.90% (↓0.45pp 24h, vol USD 6.56M) narrativa substituição enfraquece pós-Datafolha. Mantidos 21/Mai: Aécio PSDB; Caiado contaminado; Zema credibilidade; Michelle aliança com o mal; Flávio troca marqueteiro; aliados PL admitem rever candidatura."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "15.05%",
    poll: "Renan presidencial 11.95% (↑0.20pp 24h vs 11.75% véspera, vol USD 5.67M acumulado mantém liquidez forte). Mantém SEGUNDO presidencial Poly acima Zema (4.65%), Haddad (4.65%) e Michelle (2.90%). 2L Renan 15.55% (↓0.70pp 24h vs 16.25% véspera, vol USD 1.0M consolida base). 3L Renan 33.00% estável topo absoluto. Reverberação Datafolha 23/Mai mantém foco bipolar Lula × Flávio + cenário Michelle, sem destaque 3ª via. Mantido Sou candidato da direita (BBC 28/Abr).",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "Renan recupera leve 0.20pp presidencial em 24h. 3L Renan 33.00% estável mantém liderança 3L absoluta acima Zema 24.50% (↑1.50pp recupera), Caiado 15.00% estável, Flávio 11.15% estável. 2L Renan cede 0.70pp (16.25%→15.55%). EVENTOS 23/Mai: Reverberação Datafolha mantém foco bipolar sem destaque 3ª via; JOTA Eleitorado antipetista mantém Flávio firme como opção (amortecedor 2T); Folha Dark Horse abala Flávio mas antipetismo é amortecedor 2T — base PL resiste migração outsiders. MICHELLE cede 2.90% (↓0.45pp 24h) narrativa substituição enfraquece pós-Datafolha. STF impeach continua correção 6.65% (↑0.20pp 24h trajetória upward). Mantidos 22/Mai: Estadão Terceira via tem janela estreita para se viabilizar com discurso anticorrupção. Joaquim Barbosa pré-candidato compete espaço 3ª via centro. PSDB Aécio Neves pré-candidatura (mantido 21/Mai)."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "6.20%",
    poll: "Haddad recupera leve presidencial 4.65% (↑0.10pp 24h vs 4.55% véspera, vol USD 4.90M). 2L Haddad 4.15% (↓0.15pp 24h). 3L Haddad 4.20% estável. Camilo 1.35% estável — Haddad amplia gap acima Camilo para 3.30pp. PT Senado 3.05% estável Poly. APROVAÇÃO Lula MELHORA Datafolha 32% ótimo/bom vs 28%, rejeição cai 38% (G1, Folha, O Globo 23/Mai) base petista fortalecida. Reverberação Datafolha 23/Mai não destaca Haddad cenário principal. Mantido Líder PSB defende Haddad SP (Congresso em Foco 22/Mai). PT mira aumento bancadas em MG (O TEMPO 22/Mai).",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Haddad recupera leve 0.10pp Poly em 24h. EVENTOS 23/Mai: APROVAÇÃO Lula MELHORA Datafolha 32% ótimo/bom vs 28%, rejeição cai 38% (G1, Folha, O Globo); Integrantes campanha Lula dizem pacote pesou na melhora avaliação (O Globo); Lula e Motta preparam reunião 2ª 26/Mai para definir fim 6x1 (Folha) agenda institucional positiva favorece Haddad por extensão; Lula no RJ ataca Cláudio Castro (Folha). Mantidos 22/Mai: Líder PSB vê Haddad forte em SP defende França ao Senado (Congresso em Foco); PT mira aumento bancadas em MG (O TEMPO); Painel Folha governador quer transformar Piauí no principal reduto eleitoral de Lula; Tarcísio SP 47.3% (Poder360); Lula veta PL envio massa mensagens (CartaCapital). STF impeach continua correção 6.65% (↑0.20pp 24h). DATAFOLHA 22/Mai 1T Lula 40%×31% gap +9pp; 2T 47%×43% gap +4pp — base PT beneficiada por extensão. Mantidos 21/Mai: Lula recusa Motta canal BRB; Lula medida cada 3,5 dias acelera gastos; Lula diz Senado vai aprovar Jorge Messias STF. MAS: Mantida Tarcísio crítica Haddad (Folha 05/Mai); Vox SP Tarcísio 38% × Haddad 26% mantido."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1.45%",
    poll: "Caiado RECUPERA presidencial 1.65% (↑0.60pp 24h vs 1.05% véspera, vol USD 3.15M) MOVIMENTO RELEVANTE na faixa centro-direita. 3L Caiado 15.00% estável. 2L Caiado 1.75% estável. PSD Senado 16.45% estável forte. Reverberação Datafolha 23/Mai não destaca Caiado headline central. Mantida Quaest 13/Mai: Caiado 4% × Zema 4% empate técnico 1T 3ª via. Mantidos 20/Mai: Caiado contaminado por Vorcaro não pode ser presidente sem citar Flávio (Folha, Estadão).",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "Caiado RECUPERA presidencial 0.60pp em 24h — movimento relevante. Zema 3L 24.50% (↑1.50pp recupera) mantém liderança 3L acima Caiado 15.00%; Renan 3L 33.00% topo absoluto. PSD Senado 16.45% estável forte. EVENTOS 23/Mai: Folha 23/Mai Caiado no podcast Folha PE programado 26/Mai presença midiática programada. Mantidos 22/Mai: ESTADÃO Terceira via tem janela estreita para se viabilizar com discurso anticorrupção — Caiado posicionado nessa janela; PL e Centrão temem queda maior Flávio mas não buscam Caiado especificamente (O Globo). Mantidos 20-21/Mai: Caiado contaminado por Vorcaro (Folha, Estadão 20/Mai); Aécio Neves pré-candidatura PSDB defendida dirigentes (AJN1 continuidade); pesquisa CartaCapital MG; Joaquim Barbosa pré-candidato. STF impeach continua correção 6.65% (↑0.20pp 24h)."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "2.85%",
    poll: "Zema presidencial cede 4.65% (↓0.40pp 24h vs 5.05% véspera, vol USD 2.79M empata Haddad 4.65% pela 1ª vez recente) ainda abaixo Renan (11.95%) por gap -7.30pp. 3L Zema RECUPERA 24.50% (↑1.50pp 24h vs 23.00% véspera) Renan 3L 33.00% topo. 2L Zema 2.90% estável. NOVO Senado 1.00% estável. Reverberação Datafolha 23/Mai não destaca Zema. Mantida Quaest 13/Mai: Zema 4% × Caiado 4% empate técnico 1T.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Zema cede 0.40pp Poly presidencial empatando Haddad mas RECUPERA 1.50pp no 3L — espaço 3ª via direita migra parcialmente para Zema enquanto Michelle cede. INFLAÇÃO normaliza: banda 5.00-5.49% volta líder 30.00% (banda modal); banda 5.50-5.99% RECOLHE 12.05% (↓11pp vs anomalia 23.05% véspera) — disparo de 22/Mai foi anomalia transitória, não migração estrutural. Bandas altas (≥6.50%) 7.70% (↑0.15pp). STF impeach continua correção 6.65% (↑0.20pp 24h trajetória upward sustentada) combustível anti-STF Zema modesto. EVENTOS 23/Mai: Reverberação Datafolha mantém foco bipolar sem destaque Zema. Mantidos 22/Mai: ESTADÃO Terceira via tem janela estreita para se viabilizar com discurso anticorrupção. Mantidos 20-21/Mai: Zema credibilidade para liderar país (Folha 20/Mai); Zema página virada não houve ruptura (Estadão 16/Mai); Carlos Bolsonaro sugere Zema surfa crise. Mantido Zema RADICALIZA impeachment STF + privatizar tudo (Estadão 03/Mai)."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.15%",
    poll: "Tarcísio presidencial 0.15% Poly estável (vol USD 11.89M acumulado maior volume mercado mas precificação baixíssima anomalia histórica). 2L Tarcísio 0.25% estável. 3L Tarcísio 0.35% estável. Republicanos Senado RECUPERA 4.45% (↑0.40pp 24h vs 4.05% véspera). PL Senado RECUPERA 70.00% (↑1.00pp 24h vs 69.00% véspera). Tarcísio SP 47.3% (Poder360 22/Mai) consolida reeleição estadual.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Tarcísio presidencial 0.15% estável Poly mantém anomalia volume USD 11.89M com preço baixíssimo (convicção concentrada historicamente para-e-contra). PL Senado RECUPERA 70.00% (↑1.00pp 24h). Republicanos Senado 4.45% (↑0.40pp 24h recupera). EVENTOS 23/Mai: Reverberação Datafolha consolida narrativa Dark Horse Flávio mas Michelle perde mais (gap +5pp vs +4pp) inviabiliza substituição direita; PT e PL pregam cautela (O Globo); Folha mercado O rachadão dos Bolsonaros embalado pelo pancadão do debate ruim. Mantidos 22/Mai: Tarcísio SP 47.3% Poder360 consolida foco reeleição estadual; PL e Centrão minimizam recuo no Datafolha mas temem queda maior (O Globo); VEJA coluna Flávio caiu mas subiu 13 pontos no ano. Mantidos 17/Mai: Vento virou favor Lula; batalha judicial TSE. Mantidos 16/Mai: Derrite pré-Senado SP com Flávio Sorocaba; Tarcísio Sabesp mão pesada Estado."
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
