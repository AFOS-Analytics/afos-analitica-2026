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
    poll: "Lula DEVOLVE Poly 40.50% (↓1.00pp 24h vs 41.50% véspera, vol USD 5.98M acumulado) — devolve a totalidade do ganho do dia anterior. Gap Lula × Flávio ESTREITA pra +11.85pp (↓1.00pp). 2L Lula 10.50% estável. STF IMPEACH 5.45% estável 3º dia (vol USD 79k baixo). PT Senado 2.90% estável. PoderData/AYA 29/Mai: Lula EMPATA tecnicamente com Flávio, Joaquim Barbosa, Caiado e Zema no 2T (CNN Brasil, Revista Oeste, Estado de Minas, Gazeta do Povo) — primeiro Tier 1+2 do ciclo MENOS favorável a Lula vs Datafolha 22/Mai (gap +4pp), Indexa 27/Mai (gap +5pp), Meio/Ideia 28/Mai (gap +5.1pp). Contrapesos regionais: AtlasIntel RN PT à frente governo+Senado, Lula vence todos 2T (CartaCapital, Poder360, Revista Fórum); em PE Lula abre 32pp sobre Flávio (Jamildo); JOTA Agregador 'favoritismo Lula em pico do ciclo'. Mantida Datafolha 22/Mai 1T 40%×31% gap +9pp; 2T 47%×43% gap +4pp; aprovação 32% ótimo/bom. Meio/Ideia 28/Mai 1T 38.5%×31.5% gap +7pp; 2T 46.5%×41.4% gap +5.1pp.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTOS 29/Mai D+15: 🌎 EUA CLASSIFICAM PCC E CV COMO ORGANIZAÇÕES TERRORISTAS (BBC, G1, O Globo, Estadão, Valor, Folha) — Trump entrega bandeira que Flávio pediu publicamente 28/Mai. Estadão (Lourival Sant'Anna): 'Trump dá contribuição à agenda Flávio à qual Lula terá dificuldade de contrapor'. BBC: 'Vitória para Flávio, derrota para Lula?'. Bomba redes >7M interações (VEJA). MITIGANTES TRIPLOS: (1) porta-voz Departamento Estado EUA NEGA influência Flávio: 'Presidente do Brasil é escolha dos brasileiros' (G1, Estadão); (2) Valor citando consultoria: 'NÃO reverte crise Master'; (3) PF envia parecer à PGR INVESTIGAR remessa Vorcaro EUA a pedido de Flávio (Valor) — nova frente investigativa direta. Aliados Lula acusam Flávio de articular interferência EUA, Boulos fala em milícia (Folha). Lula aposta 'bis tarifaço' acusando Flávio de 'traidor' (Valor). Bastidores: menção à família Bolsonaro em nota do governo foi sugerida por Sidônio e avalizada por Lula (O Globo). 🏛️ PACHECO CONFIRMA fora MG e ENCERRA carreira política (G1, Estadão, Gazeta do Povo, Folha PE) — FRUSTRA Lula projeto PT estadual; presidente PT vai a MG tentar viabilizar nova chapa (O Globo). MG é 2º maior colégio eleitoral. AtlasIntel RN: PT à frente governo+Senado. JOTA Agregador 29/Mai: 'favoritismo Lula em pico do ciclo' (síntese 11 institutos). Lula reenvia indicação Messias ao STF após rejeição (Portal iG, ac24horas). RioPrevidência foi único cotista 2 fundos ligados Banco Master (G1, Valor). Ibovespa cai (Valor) maior queda mensal desde fev/2023. STF impeach 5.45% estável 3º dia. MAS: rejeição Lula 45% próxima Flávio 46% (Datafolha 22/Mai mantida)."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "28.65%",
    poll: "Flávio estável Poly 28.65% (↔ 24h vs 28.65% véspera, vol USD 6.10M acumulado). Gap Lula ESTREITA pra +11.85pp (↓1.00pp porque Lula devolveu ganho). 2L Flávio 60.50% topo absoluto (vol USD 187k). 🔥 SENADO PL RECUPERA 67.50% (↑9.00pp 24h vs 58.50% véspera, vol USD 242k). PODEMOS 22.10% (anomalia vol baixo); PSD CEDE 16.50% (↓1.80pp 24h); MDB 15.35% estável. PoderData/AYA 29/Mai EMPATA 2T Lula × Flávio (CNN Brasil, Revista Oeste, Estado de Minas, Gazeta do Povo) — primeiro Tier 1+2 do ciclo com 2T tecnicamente empatado, cenário menos pior que Datafolha 22/Mai (gap +4pp Lula), Indexa 27/Mai (gap +5pp), Meio/Ideia 28/Mai (gap +5.1pp). Mantida Datafolha 22/Mai 1T 31% gap -9pp; 2T 43% gap -4pp; rejeição 46% > Lula 45% 1ª vez. Meio/Ideia 28/Mai 1T 31.5% gap -7pp; quedas -19pp alta renda, -18pp centro-direita, -16pp jovens. Em PE Lula abre 32pp sobre Flávio (Jamildo 29/Mai). Estado de Minas 29/Mai: 'Lula amplia vantagem 2T após Dark Horse'.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 29/Mai D+15: 🌎 EUA CLASSIFICAM PCC E CV COMO ORGANIZAÇÕES TERRORISTAS (BBC, G1, O Globo, Estadão, Valor, Folha) — Trump entrega bandeira que Flávio pediu publicamente 28/Mai (Folha, BBC). Bolsonaro orienta Flávio explorar tema (O Globo). Decisão bomba redes >7M interações (VEJA). Estadão (Lourival Sant'Anna): 'Trump dá contribuição à agenda Flávio à qual Lula terá dificuldade de contrapor'. PoderData/AYA 29/Mai EMPATA 2T Lula × Flávio (CNN, Oeste, EM, Gazeta do Povo). 🔥 SENADO PL RECUPERA Polymarket 67.50% (↑9.00pp 24h). MITIGANTES CRÍTICOS: (1) porta-voz Departamento Estado EUA NEGA influência Flávio: 'Presidente do Brasil é escolha dos brasileiros' (G1, Estadão); (2) Valor citando consultoria: 'Decisão EUA ajuda Flávio nas redes, mas NÃO reverte crise Master'; (3) PF envia parecer à PGR INVESTIGAR remessa Vorcaro EUA a pedido de Flávio (Valor 29/Mai) — nova frente investigativa direta sobre Flávio; (4) PF avalia que decisão pode prejudicar investigações dos próprios EUA (G1); (5) Estadão: 'Porta-voz EUA nega influência Flávio e diz que é improvável reverter decisão'; (6) VEJA: 'É um erro atribuir isso ao Flávio', diz ex-embaixador. Aliados Lula ACUSAM Flávio de articular interferência EUA, Boulos fala em milícia (Folha). Lula aposta 'bis tarifaço' acusando Flávio de 'traidor' (Valor). Haddad tenta colar decisão PCC/CV em Tarcísio: 'Deram um tiro no pé' (O Globo). 🏛️ CLÁUDIO CASTRO confirma desistência candidatura Senado RJ (Congresso em Foco, JOTA, VEJA); PL paga salário Castro (VEJA); Fux nega Douglas Ruas assumir governo RJ (O Globo, Valor, VEJA); cobertura onde Castro mora passou 2 anos em obra (O Globo). MICHELLE Poly CEDE 1.05% (↓0.60pp 24h, total ↓1.85pp 48h). Mantidos 22-23/Mai: rejeição Flávio 46% > Lula 45%; 48% defendem Flávio abdicar candidatura (G1); Folha PL enredado nos maus lençóis Bolsonaro; JOTA antipetismo amortecedor 2T. STF impeach 5.45% estável 3º dia."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "15.60%",
    poll: "Renan presidencial 15.60% (↑0.55pp 24h vs 15.05% véspera, vol USD 6.08M acumulado mantém liquidez forte). 4º dia consecutivo de alta presidencial. Mantém SEGUNDO presidencial Poly acima Haddad (6.45%), Zema (2.75%), Caiado (1.35%) e Michelle (1.05%). PoderData/AYA 29/Mai não destaca Renan no cenário principal (foco bipolar Lula × Flávio/Caiado/Zema/Barbosa). Meio/Ideia 28/Mai 1T Renan 2.1% — divergência Polymarket × pesquisa de mais de 13pp absolutos segue ponto mais largo do dashboard. Mantida ausência Datafolha 22/Mai. Mantido Sou candidato direita (BBC 28/Abr).",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "Renan consolida ↑0.55pp 4º dia consecutivo de alta. EVENTOS 29/Mai: MICHELLE CEDE Poly 1.05% (↓0.60pp 24h, total ↓1.85pp 48h vs 2.90% 27/Mai) — narrativa substituição se esvazia, abre espaço outsider direita pra Renan. Eduardo Leite (Novo) declara 'Há espaço para uma alternativa' após crise envolvendo Flávio com Vorcaro (VEJA 29/Mai) — embora 3ª via Novo, sinal de COMPETIÇÃO INTERNA Novo + reforço narrativa de 3ª via disponível. Aécio Neves pode concorrer com aceno Ciro Gomes às pretensões presidenciais (VEJA 29/Mai) — fragmentação 3ª via centro intensifica. Caiado declara decisão EUA sobre facções 'deveria ter sido tomada mais cedo pelo próprio governo brasileiro' (G1 29/Mai) — posicionamento tardio. 🌎 EUA classificam PCC/CV terroristas (BBC, G1, O Globo, Estadão) pode reabsorver oxigênio anti-establishment se Flávio capitalizar. STF impeach 5.45% estável 3º dia. INFLAÇÃO 2026 calda gorda VOLTA todas as bandas: 5.00-5.49% dispara 37.75% (↑7.15pp); 5.50-5.99% sobe 25.60% (↑4.20pp); 6.00-6.49% recupera 22.25% (↑4.40pp) — sinal aumento incerteza inflacionária pode reanimar discurso fiscal anti-establishment. Mantidos 22-23/Mai: Estadão Terceira via tem janela estreita; JOTA antipetismo amortecedor; Joaquim Barbosa pré-candidato (PoderData/AYA 29/Mai inclui Barbosa no empate 2T)."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "6.45%",
    poll: "Haddad recupera Poly 6.45% (↑0.25pp 24h vs 6.20% véspera, vol USD 5.23M acumulado). Lula DEVOLVE Poly 40.50% (↓1.00pp) base PT desfavorecida por extensão. PT Senado 2.90% estável Poly. Camilo Santana 1.15% estável. PoderData/AYA 29/Mai não destaca Haddad cenário principal. Mantido Líder PSB defende Haddad SP (Congresso em Foco 22/Mai). Mantida Vox SP Tarcísio 38% × Haddad 26%. PSB lança Márcio França ao Senado SP — proposta a Lula (G1 28/Mai mantido).",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Haddad recupera leve 0.25pp Poly em 24h. EVENTOS 29/Mai: 🏛️ PACHECO CONFIRMA fora MG e ENCERRA carreira política (G1, Estadão, Gazeta do Povo, Folha PE) — FRUSTRA LULA projeto PT estadual MG (2º maior colégio eleitoral); presidente PT vai a MG tentar viabilizar nova chapa (O Globo). Plano A PT desmoronou. 🌎 Haddad tenta colar decisão de classificar PCC/CV em Tarcísio: 'Deram um tiro no pé' (O Globo 29/Mai) — base PT articulada vê tema como autogol direita. AtlasIntel RN: PT à frente governo+Senado (CartaCapital, Revista Fórum 29/Mai); em PE Lula abre 32pp sobre Flávio (Jamildo) — regionais favorecem PT por extensão. JOTA Agregador 'favoritismo Lula em pico do ciclo'. Mantidos 28/Mai: Câmara aprova fim escala 6x1 vai ao Senado (BBC); PSB lança Márcio França ao Senado SP (G1). Ibovespa cai com rebalanceamento (Valor 29/Mai) maior queda mensal desde fev/2023. RioPrevidência ligado Banco Master 2 fundos (G1, Valor 29/Mai). Mantida crítica O Globo 28/Mai: Lula erra articulação em SP e MG dois maiores colégios eleitorais. STF impeach 5.45% estável 3º dia. PoderData/AYA 29/Mai não destaca Haddad. MAS: Mantida Tarcísio crítica Haddad (Folha 05/Mai); Vox SP Tarcísio 38% × Haddad 26% mantido."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1.35%",
    poll: "Caiado presidencial Poly CEDE 1.35% (↓0.10pp 24h vs 1.45% véspera, vol USD 3.45M acumulado) — não capitalizou empate técnico PoderData/AYA 29/Mai 2T como ganho de probabilidade individual no mercado. PSD Senado CEDE 16.50% (↓1.80pp 24h vs 18.30% véspera). PoderData/AYA 29/Mai: Lula empata tecnicamente com Caiado no 2T (CNN, Oeste 29/Mai) — primeiro Tier 1+2 do ciclo sinalizando competitividade Caiado vs Lula 2T. Mantida Meio/Ideia 28/Mai 1T Caiado 5.5% LIDERA 3ª via. Mantida Quaest 13/Mai: Caiado 4% × Zema 4% empate técnico 1T.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "Caiado CEDE Poly 0.10pp em 24h apesar de empate técnico PoderData/AYA 2T. EVENTOS 29/Mai: Caiado declara decisão EUA sobre facções 'deveria ter sido tomada mais cedo pelo próprio governo brasileiro' (G1 29/Mai) — posicionamento explícito sobre pauta segurança, mas TARDIO (24h após Flávio pedir publicamente). Mídia já reconheceu Flávio como autor da pauta. Eduardo Leite (Novo) 'Há espaço para alternativa' (VEJA 29/Mai); Aécio Neves pode concorrer com aceno Ciro Gomes (VEJA 29/Mai) — fragmentação 3ª via centro intensifica, disputa mesmo nicho Caiado. Pacheco fora política (G1 29/Mai) cria vácuo em MG que PT precisará preencher, talvez beneficie Caiado mas demais governadores PSD não se manifestam. PSD Senado CEDE 16.50% (↓1.80pp 24h). Mantidos 22/Mai: ESTADÃO Terceira via tem janela estreita para se viabilizar com discurso anticorrupção; PL e Centrão temem queda Flávio mas não buscam Caiado especificamente (O Globo). Reunião Caiado-Zema 27/Mai aliança 2026 mantida. STF impeach 5.45% estável 3º dia."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "2.75%",
    poll: "Zema presidencial CEDE 4º dia consecutivo 2.75% (↓0.10pp 24h vs 2.85% véspera, vol USD 3.12M) — total ↓2.30pp em 4 dias desde 25/Mai (era 5.05%). NOVO Senado CEDE 0.90% (↓0.10pp 24h vs 1.00% véspera). PoderData/AYA 29/Mai: Lula empata tecnicamente com Zema no 2T (CNN, Oeste 29/Mai) — sinaliza competitividade Zema 2T similar Caiado. Mantida Meio/Ideia 28/Mai 1T Zema 2.4% (menor que Caiado 5.5%, validando lógica vice). Mantida Quaest 13/Mai: Zema 4% × Caiado 4% empate técnico 1T.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Zema CEDE 4º dia consecutivo Poly presidencial. EVENTOS 29/Mai: Eduardo Leite (Novo) declara 'Há espaço para uma alternativa' após crise envolvendo Flávio com Vorcaro (VEJA 29/Mai) — embora reforce 3ª via Novo, sinal COMPETIÇÃO INTERNA Novo, dilui base solo Zema. PoderData/AYA 29/Mai EMPATA 2T Lula × Zema (CNN, Oeste). Reunião Caiado-Zema 27/Mai aliança 2026 segue como leitura de saída disputa solo. INFLAÇÃO 2026 calda gorda VOLTA todas as bandas: 5.00-5.49% dispara 37.75% (↑7.15pp 24h vs 30.60% véspera); 5.50-5.99% sobe 25.60% (↑4.20pp); 6.00-6.49% recupera 22.25% (↑4.40pp); cauda ≥7% 4.35%. Spike geral simétrico indica REPRECIFICAÇÃO de incerteza inflacionária, pode reanimar discurso fiscal Zema estrutural. STF impeach 5.45% estável 3º dia. Mantida Meio/Ideia 28/Mai Zema 2.4% (validando lógica vice). Mantidos 22/Mai: ESTADÃO Terceira via tem janela estreita. Mantidos 20-21/Mai: Zema credibilidade para liderar país (Folha 20/Mai); Zema página virada não houve ruptura (Estadão 16/Mai). Mantido Zema RADICALIZA impeachment STF + privatizar tudo (Estadão 03/Mai). Mantido Cleitinho líder MG."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.15%",
    poll: "Tarcísio presidencial 0.15% Poly estável (vol USD 12.29M acumulado maior volume mercado mas precificação baixíssima anomalia histórica). Republicanos Senado 2.75% (vol USD ~1k baixo). 🔥 PL Senado RECUPERA 67.50% (↑9.00pp 24h vs 58.50% véspera). Tarcísio SP 47.3% (Poder360 22/Mai mantido) consolida reeleição estadual.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Tarcísio presidencial 0.15% estável Poly mantém anomalia volume USD 12.29M com preço baixíssimo (convicção concentrada historicamente para-e-contra). 🔥 PL Senado RECUPERA 67.50% (↑9.00pp 24h). EVENTOS 29/Mai: Haddad tenta colar decisão de classificar PCC/CV em Tarcísio: 'Deram um tiro no pé' (O Globo 29/Mai) — base PT articulada tenta enquadrar Tarcísio como cúmplice da decisão. 🌎 EUA classificam PCC/CV terroristas: porta-voz Departamento Estado EUA NEGA influência Flávio (G1, Estadão); Estadão 'Porta-voz EUA improvável reverter decisão'. PoderData/AYA 29/Mai foco bipolar Lula × Flávio/Caiado/Zema/Barbosa não destaca Tarcísio. Mantidos 22-23/Mai: Tarcísio SP 47.3% Poder360 consolida reeleição estadual; PL e Centrão minimizam recuo no Datafolha mas temem queda maior Flávio (O Globo); VEJA coluna Flávio caiu mas subiu 13 pontos no ano. Castro confirma desistência Senado RJ (Congresso em Foco 29/Mai). Mantidos 17/Mai: Vento virou favor Lula; batalha judicial TSE."
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
