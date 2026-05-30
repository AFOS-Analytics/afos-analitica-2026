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
    poll: "Lula estável Poly 40.50% (↔ 24h vs 40.50% véspera, vol USD 5.99M acumulado). Gap Lula × Flávio mantém +11.85pp. 2L Lula 9.50% (vol USD 74k). STF IMPEACH 5.45% estável (vol USD 80k baixo). Sem pesquisa nacional 1T/2T nova em 30/Mai. Mantida PoderData/AYA 29/Mai: Lula EMPATA tecnicamente com Flávio, Joaquim Barbosa, Caiado e Zema no 2T (CNN Brasil, Revista Oeste, Estado de Minas, Gazeta do Povo) — primeiro Tier 1+2 do ciclo MENOS favorável a Lula vs Datafolha 22/Mai (gap +4pp), Indexa 27/Mai (gap +5pp), Meio/Ideia 28/Mai (gap +5.1pp). Mantida Datafolha 22/Mai 1T 40%×31% gap +9pp; 2T 47%×43% gap +4pp; aprovação 32% ótimo/bom. Meio/Ideia 28/Mai 1T 38.5%×31.5% gap +7pp; 2T 46.5%×41.4% gap +5.1pp.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTOS 30/Mai D+16: sábado de baixa atividade nacional, sem fato político novo de peso — o Polymarket move por dinâmica própria (leitura técnica). CONTINUIDADE 29/Mai: Lula reeditou o discurso de soberania após a decisão dos EUA de classificar PCC/CV como organizações terroristas, 'não aceitamos ser tratados como moleques' (Poder360); Moro lançou pré-candidatura ao governo do PR ao lado de Flávio, em ato com Dallagnol e Filipe Barros (Poder360, CNN Brasil). Vox SP (cenário estadual): Flávio e Lula empatam no 2T paulista (Poder360). MANTIDOS 29/Mai: 🌎 EUA CLASSIFICAM PCC/CV TERRORISTAS (BBC, G1, O Globo, Valor, Folha), bandeira que Flávio pediu publicamente 28/Mai. Mitigantes: porta-voz do Departamento de Estado EUA NEGA influência de Flávio (G1); Valor 'NÃO reverte crise Master'; PF envia parecer à PGR para investigar remessa Vorcaro aos EUA a pedido de Flávio (Valor). 🏛️ PACHECO encerra carreira e fica fora de MG (G1, Gazeta do Povo) — frustra projeto do PT no 2º maior colégio eleitoral; Lula reenvia Messias ao STF após rejeição do Senado (Portal iG). JOTA Agregador 29/Mai: 'favoritismo Lula em pico do ciclo' (síntese 11 institutos). STF impeach 5.45% estável. MAS rejeição Lula 45% próxima de Flávio 46% (Datafolha 22/Mai mantida)."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "28.65%",
    poll: "Flávio estável Poly 28.65% (↔ 24h vs 28.65% véspera, vol USD 6.13M acumulado). Gap Lula × Flávio mantém +11.85pp. 2L Flávio 62.00% topo absoluto (↑1.50pp vs 60.50% véspera, vol USD 60k). 🔥 SENADO PL sobe 68.00% (↑0.50pp 24h vs 67.50% véspera). Reshuffle nas legendas de baixo volume: MDB 15.20%, UNIÃO 14.45%, PSD recua a 7.45%, Podemos 4.75% (mercados de book fino, leitura cautelosa). Mantida PoderData/AYA 29/Mai: EMPATE técnico 2T Lula × Flávio (CNN Brasil, Revista Oeste, Estado de Minas, Gazeta do Povo) — cenário menos pior que Datafolha 22/Mai (gap +4pp Lula), Indexa 27/Mai (gap +5pp), Meio/Ideia 28/Mai (gap +5.1pp). Mantida Datafolha 22/Mai 1T 31% gap -9pp; 2T 43% gap -4pp; rejeição 46% > Lula 45% 1ª vez. Meio/Ideia 28/Mai 1T 31.5% gap -7pp; quedas -19pp alta renda, -18pp centro-direita, -16pp jovens.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 30/Mai D+16: sábado de baixa atividade nacional, sem fato novo de peso sobre Flávio. CONTINUIDADE 29/Mai: Moro lançou pré-candidatura ao governo do PR ao lado de Flávio, consolidando o palanque, em ato com Dallagnol e Filipe Barros (Poder360, CNN Brasil); Lula reeditou o discurso de soberania após a decisão dos EUA sobre PCC/CV (Poder360). Vox SP (cenário estadual): Flávio empata com Lula no 2T paulista (Poder360). MANTIDOS 29/Mai: 🌎 EUA CLASSIFICAM PCC/CV TERRORISTAS (BBC, G1, O Globo, Valor, Folha), bandeira que Flávio pediu 28/Mai; Bolsonaro orienta Flávio a explorar o tema (O Globo). Mitigantes críticos: porta-voz do Departamento de Estado EUA NEGA influência de Flávio (G1); Valor 'decisão ajuda nas redes mas NÃO reverte crise Master'; PF envia parecer à PGR para investigar remessa Vorcaro aos EUA a pedido de Flávio (Valor). Cláudio Castro confirma desistência do Senado RJ (Congresso em Foco). MICHELLE segue caindo no Poly, agora 0.65% (↓0.40pp 24h). Mantidos 22-23/Mai: rejeição Flávio 46% > Lula 45%; JOTA antipetismo como amortecedor no 2T. STF impeach 5.45% estável."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "17.20%",
    poll: "Renan presidencial 17.20% (↑1.60pp 24h vs 15.60% véspera, vol USD 6.19M acumulado mantém liquidez forte). 5º dia consecutivo de alta presidencial, maior salto diário da série. Consolida SEGUNDO presidencial Poly bem acima de Haddad (5.20%), Zema (2.55%), Caiado (1.35%). 2L Renan 17.20%; 3L Renan 41.50% (favorito a 3º lugar). PoderData/AYA 29/Mai não destaca Renan no cenário principal (foco bipolar Lula × Flávio/Caiado/Zema/Barbosa). Meio/Ideia 28/Mai 1T Renan 2.1% — divergência Polymarket × pesquisa agora ~15pp absolutos, ponto mais largo do dashboard. Mantida ausência Datafolha 22/Mai. Mantido Sou candidato direita (BBC 28/Abr).",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "Renan acelera ↑1.60pp no 5º dia consecutivo de alta, sem evento triggador claro em 30/Mai — leitura técnica de continuidade de tendência iniciada 25/Mai, não reação a fato novo. MICHELLE segue caindo no Poly, agora 0.65% (↓0.40pp 24h) — esvaziamento da narrativa de substituição abre espaço para o outsider de direita. Mantidos 29/Mai: Eduardo Leite (Novo) 'há espaço para uma alternativa' (VEJA) sinaliza competição interna no Novo; Aécio Neves pode concorrer com aceno a Ciro Gomes (VEJA) — fragmentação da 3ª via de centro. 🌎 decisão EUA sobre PCC/CV pode reabsorver oxigênio anti-establishment se Flávio capitalizar. INFLAÇÃO 2026: banda modal 5.00-5.49% sobe a 40.55% (↑2.80pp), curva ainda concentrada na faixa 5-6% — incerteza fiscal de fundo que pode reanimar discurso anti-establishment. STF impeach 5.45% estável. Mantidos 22-23/Mai: Estadão 'terceira via tem janela estreita'; Joaquim Barbosa pré-candidato (incluído no empate 2T da PoderData/AYA 29/Mai)."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "5.20%",
    poll: "Haddad CEDE Poly 5.20% (↓1.25pp 24h vs 6.45% véspera, vol USD 5.27M acumulado) — devolve a recuperação dos dias anteriores; mercado fino, sem evento triggador claro em 30/Mai (leitura técnica). 2L Haddad 4.75%; 3L Haddad 7.40%. PoderData/AYA 29/Mai não destaca Haddad no cenário principal. Vox SP 30/Mai 2T estadual: Tarcísio 48.3% × Haddad 36.5% (Poder360) — Tarcísio amplia vantagem na disputa paulista. Mantido líder do PSB defende Haddad em SP (Congresso em Foco 22/Mai); PSB lança Márcio França ao Senado SP (G1 28/Mai).",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Haddad cede 1.25pp no Poly presidencial (mercado de baixa convicção, sem fato novo 30/Mai). EVENTOS 30/Mai: Vox SP 2T Tarcísio 48.3% × Haddad 36.5% (Poder360) — disputa estadual desfavorável ao petista. MANTIDOS 29/Mai: 🏛️ PACHECO encerra carreira e fica fora de MG (G1, Estadão, Gazeta do Povo) frustra o projeto do PT no 2º maior colégio eleitoral; 🌎 Haddad enquadra decisão dos EUA sobre PCC/CV como autogol da direita, 'deram um tiro no pé' (O Globo); AtlasIntel RN PT à frente de governo+Senado (CartaCapital, Revista Fórum); JOTA Agregador 'favoritismo Lula em pico do ciclo'. Mantidos 28/Mai: Câmara aprova fim da escala 6x1, segue ao Senado (BBC). Mantida crítica O Globo 28/Mai: Lula erra articulação em SP e MG, os dois maiores colégios. STF impeach 5.45% estável. Mantido Tarcísio crítica Haddad (Folha 05/Mai)."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1.35%",
    poll: "Caiado presidencial Poly estável 1.35% (↔ 24h vs 1.35% véspera, vol USD 3.48M acumulado) — não converteu o empate técnico da PoderData/AYA 29/Mai 2T em ganho de probabilidade individual no mercado. 3L Caiado 13.00%. PSD Senado recua forte a 7.45% (vs 16.50% véspera) em mercado de book fino e volátil — leitura cautelosa. Mantida PoderData/AYA 29/Mai: Lula empata tecnicamente com Caiado no 2T (CNN, Oeste). Mantida Meio/Ideia 28/Mai 1T Caiado 5.5% LIDERA a 3ª via. Mantida Quaest 13/Mai: Caiado 4% × Zema 4% empate técnico 1T.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "Caiado estável no Poly presidencial apesar do empate técnico no 2T. MANTIDOS 29/Mai: Caiado declara que a decisão dos EUA sobre facções 'deveria ter sido tomada mais cedo pelo próprio governo brasileiro' (G1) — posicionamento tardio, 24h após Flávio assumir a pauta. Eduardo Leite (Novo) 'há espaço para alternativa' (VEJA); Aécio Neves pode concorrer com aceno a Ciro Gomes (VEJA) — fragmentação da 3ª via de centro disputa o mesmo nicho de Caiado. Pacheco fora de MG (G1) cria vácuo que o PT precisará preencher. Mantidos 22/Mai: Estadão 'terceira via tem janela estreita' com discurso anticorrupção; reunião Caiado-Zema 27/Mai sobre aliança 2026. STF impeach 5.45% estável."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "2.55%",
    poll: "Zema presidencial CEDE 5º dia consecutivo 2.55% (↓0.20pp 24h vs 2.75% véspera, vol USD 3.17M) — total ↓2.50pp em 5 dias desde 25/Mai (era 5.05%). 2L Zema 3.50%; 3L Zema 17.00% (vice-favorito a 3º lugar atrás de Renan). Mantida PoderData/AYA 29/Mai: Lula empata tecnicamente com Zema no 2T (CNN, Oeste) — competitividade 2T similar à de Caiado. Mantida Meio/Ideia 28/Mai 1T Zema 2.4% (menor que Caiado 5.5%, validando lógica de vice). Mantida Quaest 13/Mai: Zema 4% × Caiado 4% empate técnico 1T.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Zema cede no 5º dia consecutivo do Poly presidencial — erosão estrutural lenta, sem fato novo 30/Mai. MANTIDOS 29/Mai: Eduardo Leite (Novo) 'há espaço para uma alternativa' (VEJA) — competição interna no próprio Novo dilui a base solo de Zema; reunião Caiado-Zema 27/Mai sobre aliança 2026 segue como leitura de saída da disputa solo. INFLAÇÃO 2026: banda modal 5.00-5.49% sobe a 40.55% (↑2.80pp), curva concentrada na faixa 5-6% — incerteza fiscal que pode reanimar o discurso estrutural de Zema. STF impeach 5.45% estável. Mantidos 20-22/Mai: Estadão 'terceira via tem janela estreita'; Zema 'credibilidade para liderar país' (Folha 20/Mai); Zema radicaliza impeachment STF + privatizar tudo (Estadão 03/Mai); Cleitinho líder em MG."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.15%",
    poll: "Tarcísio presidencial 0.15% Poly estável (vol USD 12.31M acumulado, maior volume do mercado mas precificação baixíssima, anomalia histórica de convicção concentrada). 🔥 PL Senado sobe 68.00% (↑0.50pp 24h vs 67.50% véspera), segue dominante na disputa por mais cadeiras. Vox SP 30/Mai 2T estadual: Tarcísio 48.3% × Haddad 36.5% (Poder360) — amplia a vantagem na reeleição paulista.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Tarcísio presidencial 0.15% estável, anomalia de vol USD 12.31M com preço baixíssimo (convicção concentrada para-e-contra). EVENTOS 30/Mai: Vox SP 2T Tarcísio 48.3% × Haddad 36.5% (Poder360) consolida favoritismo estadual. MANTIDOS 29/Mai: Haddad tenta enquadrar a decisão dos EUA sobre PCC/CV como problema para Tarcísio, 'deram um tiro no pé' (O Globo); porta-voz do Departamento de Estado EUA NEGA influência de Flávio (G1, Estadão). PoderData/AYA 29/Mai, de foco bipolar, não destaca Tarcísio. Mantidos 22-23/Mai: PL e Centrão minimizam recuo no Datafolha mas temem queda maior de Flávio (O Globo). Mantidos 17/Mai: 'vento virou a favor de Lula'; batalha judicial no TSE."
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
