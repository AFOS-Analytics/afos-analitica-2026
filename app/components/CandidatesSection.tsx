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
    polymarket: "45.50%",
    poll: "Lula 45.50% Poly ESTÁVEL 30h+ (vol USD 5.72M acumulado, sem alteração desde 21/Mai). Gap +17.45pp Lula sobre Flávio (↓3.40pp 24h estreitamento porque Flávio recupera 3.40pp). 2L Lula 11.50% (↓1.00pp 24h, vol USD 68k baixo). STF IMPEACH reverte parcial 6.45% (↑2.10pp ~22h vs colapso 4.35% pós-fechamento 21/Mai 19h valida hipótese distorção liquidez baixa registrada na atualização anterior). DATAFOLHA 22/Mai PUBLICADA HOJE 18+ fontes (BBC, G1, Folha, GZH, SBT News, VEJA, CartaCapital, Estadão, Valor, JOTA, InfoMoney, O Globo): 1T Lula 40% × Flávio 31% gap +9pp Lula amplia 6pp vs 16/Mai; 2T Lula 47% × Flávio 43% gap +4pp Lula vs empate 45×45 anterior; cenário Michelle 2T Lula 48% × Michelle 43% gap +5pp; rejeição Flávio 46% > Lula 45% 1ª vez. Vox 20/Mai 2T 46.8% gap +8.7pp. AtlasIntel 19/Mai 1T 47% gap +12.7pp; 2T 48.9% gap +7.1pp. DIVERGÊNCIAS: Poly +17.45pp vs Datafolha 22/Mai 2T +4pp vs Vox +8.7pp vs Atlas +7.1pp.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTOS 22/Mai D+8: DATAFOLHA PUBLICADA HOJE confirma deterioração Flávio 1T 40%×31% gap +9pp; 2T 47%×43% gap +4pp; cenário Michelle 48%×43% gap +5pp; rejeição Flávio 46% > Lula 45% 1ª vez (BBC, G1, Folha, GZH, SBT News, VEJA, CartaCapital, Estadão, Valor, JOTA, InfoMoney, O Globo, Correio Braziliense, Jornal do Comércio, UOL, Brasil de Fato, Congresso em Foco, Poder360, CBN, SRzd 22/Mai). MENDONÇA vota manter prisão pai+primo Vorcaro (Folha, Amazonas1 22/Mai) eixo STF endurece. GILMAR pede vista suspende julgamentos (Folha 22/Mai) sem derrubar prisão. FLÁVIO NÃO assinou 3 de 5 pedidos CPI Master (Gazeta Mercantil, ND Mais 22/Mai) desmascara narrativa Flávio cobra CPI cobrada em 21/Mai. DELAÇÃO REJEITADA e advogado Vorcaro saiu (Gazeta Mercantil 22/Mai). DATAFOLHA SANCIONA percepção Planalto sobre melhora competitividade Lula (O Globo Fábio Graner 22/Mai). FUTURA/APEX Lula vira 2T (JOTA 22/Mai). PL e Centrão minimizam recuo no Datafolha mas temem queda maior (O Globo). Campanha Lula vê efeito Vorcaro real mas acredita retorno eleitores direita para Flávio (O Globo). Lula veta PL envio massa mensagens (CartaCapital). MAS: rejeição Lula 45% Datafolha próxima Flávio 46%; oposição segue tentando derrubar decretos via Congresso (Gazeta do Povo). Mantidos 21/Mai: Lula ironiza Lei Daniel Vorcaro 4 fontes; Tebet Flávio facilmente derrotado; Aécio Neves PSDB pré-candidatura. STF IMPEACH reverte parcial 6.45%."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "28.05%",
    poll: "Flávio RECUPERA Poly 28.05% (↑3.40pp 24h vs 24.65% fechamento 21/Mai, vol USD 5.92M acumulado); ainda ↓3.25pp 5 dias vs 31.30% 17/Mai. Gap Lula reduz para +17.45pp. 2L Flávio 58.00% mantém topo (↑2.50pp 24h, vol USD 60k baixo). 3L Flávio 11.10% (↑1.80pp 24h mercado continua precificando como candidato com risco 3º). PL Senado 69.00% (↓6.00pp 24h queda relevante mantém trajetória descendente). DATAFOLHA 22/Mai PUBLICADA HOJE: 1T Flávio 31% (↓4pp vs 16/Mai 35%) gap -9pp Lula; 2T 43% gap -4pp; cenário Michelle 2T 43% empate Michelle (Lula 48% gap +5pp Michelle perde mais que Flávio); rejeição Flávio 46% supera Lula 45% numericamente pela 1ª vez. Vox 20/Mai 2T 38.1% rejeição 49.2%. AtlasIntel 19/Mai 1T 34.3% rejeição 52%.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 22/Mai D+8: DATAFOLHA PUBLICADA HOJE confirma deterioração consistente Flávio 1T cai 4pp (31% vs 16/Mai 35%) gap -9pp; 2T 43% gap -4pp vs empate 45×45 anterior; cenário Michelle 2T 43% empate (Lula 48%); rejeição Flávio 46% supera Lula 45% 1ª vez (BBC, G1, Folha, GZH, SBT News, VEJA, CartaCapital, Estadão, Valor, JOTA, InfoMoney, O Globo 22/Mai). MENDONÇA vota manter prisão pai+primo Vorcaro (Folha, Amazonas1) eixo STF endurece. GILMAR pede vista suspende julgamentos (Folha) sem derrubar prisão. FLÁVIO NÃO assinou 3 de 5 pedidos CPI Master (Gazeta Mercantil, ND Mais 22/Mai) contradição desmascara narrativa Flávio cobra CPI cobrada em 21/Mai. DELAÇÃO REJEITADA e advogado Vorcaro saiu pressão aumenta (Gazeta Mercantil). PL e Centrão minimizam recuo no Datafolha mas temem queda maior caso surjam novos fatos (O Globo). Campanha Lula vê efeito Vorcaro real mas acredita retorno eleitores direita para Flávio (O Globo). ANÁLISE VALOR: dano potencial Dark Horse sobre Flávio não se esgotou. VEJA COLUNA: Flávio caiu no Datafolha mas subiu 13 pontos no ano. FOLHA: Equipe de Flávio minimiza efeito Dark Horse aliados de Lula esperavam mais. MICHELLE Poly cede 3.35% (↓0.40pp 24h, vol USD 6.51M segunda maior volume terceira via) — Datafolha testa Michelle como substituta mas resultado pior (gap +5pp vs Flávio gap +4pp) inviabiliza narrativa. Mantidos 21/Mai: Aécio PSDB; Caiado contaminado; Zema credibilidade; Michelle aliança com o mal; Flávio troca marqueteiro; aliados PL admitem rever candidatura."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "11.75%",
    poll: "Renan presidencial 11.75% (↓0.80pp 24h vs 12.55% fechamento 21/Mai, vol USD 5.64M acumulado mantém liquidez forte). Mantém SEGUNDO presidencial Poly acima Zema (5.05%), Haddad (4.55%) e Michelle (3.35%). 2L Renan 16.25% (↑1.75pp 24h, vol USD 1.0M consolida base 2L com maior volume entre sub-mercados secundários). 3L Renan 33.00% (↓4.00pp 24h cede topo absoluto vs 37.00% fechamento). DATAFOLHA 22/Mai não destaca 3ª via no recorte publicado (foco bipolar Lula × Flávio + cenário Michelle). Mantido Sou candidato da direita (BBC 28/Abr).",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "Renan cede 0.80pp presidencial em 24h — Flávio recupera 3.40pp reduz espaço outsider. 3L Renan cede 4.00pp (37.00%→33.00%) mas mantém liderança 3L absoluta acima Zema 23.00%, Caiado 15.00%, Flávio 11.10%. 2L Renan sobe 1.75pp (14.50%→16.25%) consolida base sub-mercado. EVENTOS 22/Mai: ESTADÃO Terceira via tem janela estreita para se viabilizar com discurso anticorrupção. Datafolha 22/Mai foco bipolar + cenário Michelle (não Renan). MICHELLE cede 3.35% (↓0.40pp 24h) mas perde mais que Flávio no cenário 2T (gap +5pp vs +4pp) narrativa substituição direita não consolida. STF impeach 6.45% reverte parcial colapso véspera (↑2.10pp vs 4.35% valida hipótese distorção liquidez baixa). Joaquim Barbosa pré-candidato compete espaço 3ª via centro. PSDB Aécio Neves pré-candidatura (mantido 21/Mai)."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "4.55%",
    poll: "Haddad cede presidencial 4.55% (↓0.85pp 24h vs 5.40% fechamento 21/Mai, vol USD 4.87M). 2L Haddad 4.30% (↓0.10pp 24h). 3L Haddad 4.25% estável. Camilo 1.45% estável — Haddad amplia gap acima Camilo para 3.10pp. PT Senado 3.05% (↑0.20pp 24h leve alta). Datafolha 22/Mai não destaca Haddad cenário principal. Líder PSB defende Haddad SP (Congresso em Foco 22/Mai). PT mira aumento bancadas em MG (O TEMPO 22/Mai).",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Haddad cede 0.85pp Poly em 24h — mercado realinha hedge interno PT após pico 5.40% fechamento 21/Mai. EVENTOS 22/Mai: Líder PSB vê Haddad forte em SP defende França ao Senado (Congresso em Foco 22/Mai); PT mira aumento bancadas em MG (O TEMPO 22/Mai); Painel Folha governador quer transformar Piauí no principal reduto eleitoral de Lula; Tarcísio SP 47.3% (Poder360 22/Mai); Lula veta PL envio massa mensagens (CartaCapital). STF impeach reverte parcial 6.45% (↑2.10pp vs colapso véspera). DATAFOLHA 22/Mai PUBLICADA: 1T Lula 40%×31% gap +9pp; 2T 47%×43% gap +4pp — base PT beneficiada por extensão. Aprovação Lula 47.4% AtlasIntel mantida. Mantidos 21/Mai: Lula recusa Motta canal BRB; Lula medida cada 3,5 dias acelera gastos; Lula diz Senado vai aprovar Jorge Messias STF. MAS: Mantida Tarcísio crítica Haddad (Folha 05/Mai); Vox SP Tarcísio 38% × Haddad 26% mantido."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1.05%",
    poll: "Caiado presidencial 1.05% (↓0.10pp 24h vs 1.15% fechamento 21/Mai, vol USD 3.04M). 3L Caiado 15.00% (↓0.50pp 24h estável). 2L Caiado 1.75% estável. PSD Senado 4.15% (↓1.60pp 24h cede aliada). Datafolha 22/Mai não destaca Caiado headline central. Mantida Quaest 13/Mai: Caiado 4% × Zema 4% empate técnico 1T 3ª via. Mantidos 20/Mai: Caiado contaminado por Vorcaro não pode ser presidente sem citar Flávio (Folha, Estadão).",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "Caiado 3L cede leve 15.00% (↓0.50pp 24h) mantém posição estável. Zema 3L 23.00% (↓1.50pp 24h) mantém liderança 3L acima Caiado; Renan 3L 33.00% topo absoluto. PSD Senado 4.15% cede 1.60pp 24h. EVENTOS 22/Mai: ESTADÃO Terceira via tem janela estreita para se viabilizar com discurso anticorrupção — Caiado posicionado nessa janela. Datafolha 22/Mai foco bipolar + cenário Michelle (sem 3ª via no headline central). PL e Centrão temem queda maior Flávio mas não buscam Caiado especificamente (O Globo 22/Mai). Mantidos 20-21/Mai: Caiado contaminado por Vorcaro (Folha, Estadão 20/Mai); Aécio Neves pré-candidatura PSDB defendida dirigentes (AJN1 continuidade); pesquisa CartaCapital MG; Joaquim Barbosa pré-candidato. STF impeach reverte parcial 6.45%."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "5.05%",
    poll: "Zema presidencial 5.05% (↓0.30pp 24h vs 5.35% fechamento 21/Mai, vol USD 2.75M) ainda abaixo Renan (11.75%) por gap -6.70pp. 3L Zema 23.00% (↓1.50pp 24h cede mais espaço) Renan 3L 33.00% topo. 2L Zema 2.90% (↓0.35pp 24h vs 3.25% fechamento). NOVO Senado 1.10% estável. Datafolha 22/Mai não destaca Zema. Mantida Quaest 13/Mai: Zema 4% × Caiado 4% empate técnico 1T.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Zema cede 0.30pp Poly — Flávio recupera 3.40pp e Renan mantém 11.75% reduzem espaço Zema. 3L Zema cede 1.50pp (24.50%→23.00%) Renan 3L 33.00% topo. INFLAÇÃO banda 5.50-5.99% DISPARA 23.05% (↑11pp 24h migração massiva da 4.50-4.99% que cede 5.90pp) narrativa fiscal precificada cresce pode favorecer discurso Zema. Bandas altas (≥6.50%) 7.55% estável. STF impeach 6.45% reverte parcial colapso véspera (↑2.10pp vs 4.35% valida hipótese distorção liquidez baixa) combustível anti-STF Zema modesto. EVENTOS 22/Mai: ESTADÃO Terceira via tem janela estreita para se viabilizar com discurso anticorrupção. Mantidos 20-21/Mai: Zema credibilidade para liderar país (Folha 20/Mai); Zema página virada não houve ruptura (Estadão 16/Mai); Carlos Bolsonaro sugere Zema surfa crise. Mantido Zema RADICALIZA impeachment STF + privatizar tudo (Estadão 03/Mai)."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.15%",
    poll: "Tarcísio presidencial 0.15% Poly (↓0.20pp 24h vs 0.35% fechamento 21/Mai, vol USD 11.81M maior volume mercado mas precificação baixíssima anomalia histórica muita aposta para-e-contra desde abertura). 2L Tarcísio 0.30% estável. 3L Tarcísio 0.35% estável. Republicanos Senado 4.05% (↓0.30pp 24h leve cedência). PL Senado 69.00% (↓6.00pp 24h queda relevante). Tarcísio SP 47.3% (Poder360 22/Mai) consolida reeleição estadual.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Tarcísio presidencial cede 0.20pp Poly mantém anomalia volume USD 11.81M com preço baixíssimo (convicção concentrada historicamente para-e-contra). PL Senado 69.00% (↓6.00pp 24h queda relevante mantém trajetória descendente). Republicanos Senado 4.05% (↓0.30pp). EVENTOS 22/Mai: Tarcísio SP 47.3% Poder360 consolida foco reeleição estadual; Datafolha 22/Mai cenário Michelle 2T Lula 48% × Michelle 43% gap +5pp Michelle perde mais que Flávio inviabiliza narrativa substituição. PL e Centrão minimizam recuo no Datafolha mas temem queda maior (O Globo 22/Mai). VEJA coluna Flávio caiu mas subiu 13 pontos no ano. Mantidos 17/Mai: Vento virou favor Lula; batalha judicial TSE. Mantidos 16/Mai: Derrite pré-Senado SP com Flávio Sorocaba; Tarcísio Sabesp mão pesada Estado."
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
