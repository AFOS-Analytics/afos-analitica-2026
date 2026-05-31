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
    poll: "Lula estável Poly 40.50% (↔ 24h, vol USD 6.01M acumulado). Gap Lula × Flávio ABRE pra +12.15pp (↑0.30pp, porque Flávio cedeu). 2L Lula 10.00%. STF IMPEACH 5.45% estável (vol USD 80k baixo). Sem pesquisa nacional 1T/2T nova em 31/Mai (as recentes registradas são estaduais). Mantida PoderData/AYA 29/Mai: Lula EMPATA tecnicamente com Flávio, Joaquim Barbosa, Caiado e Zema no 2T (CNN Brasil, Revista Oeste, Estado de Minas, Gazeta do Povo). Mantida Datafolha 22/Mai 1T 40%×31% gap +9pp; 2T 47%×43% gap +4pp; aprovação 32% ótimo/bom. Meio/Ideia 28/Mai 1T 38.5%×31.5% gap +7pp; 2T 46.5%×41.4% gap +5.1pp.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTOS 31/Mai D+17: domingo de baixa atividade nacional, sem fato político novo de peso — o Polymarket move por dinâmica própria (leitura técnica). A decisão dos EUA de classificar PCC/CV como terroristas seguiu como arma eleitoral Lula × Flávio (Jornal Opção; análise da revista piauí). CONTINUIDADE 29-30/Mai: Lula reeditou o discurso de soberania (Poder360); Moro lançou pré-candidatura ao governo do PR ao lado de Flávio (Poder360, CNN Brasil). MANTIDOS 29/Mai: 🌎 EUA CLASSIFICAM PCC/CV TERRORISTAS (BBC, G1, O Globo, Valor, Folha), bandeira que Flávio pediu 28/Mai. Mitigantes: porta-voz do Departamento de Estado EUA NEGA influência de Flávio (G1); Valor 'NÃO reverte crise Master'; PF envia parecer à PGR para investigar remessa Vorcaro aos EUA a pedido de Flávio (Valor). 🏛️ PACHECO encerra carreira e fica fora de MG (G1, Gazeta do Povo) — frustra projeto do PT no 2º maior colégio eleitoral; Lula reenvia Messias ao STF após rejeição do Senado (Portal iG). JOTA Agregador 29/Mai: 'favoritismo Lula em pico do ciclo'. STF impeach 5.45% estável. MAS rejeição Lula 45% próxima de Flávio 46% (Datafolha 22/Mai mantida)."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "28.35%",
    poll: "Flávio CEDE Poly 28.35% (↓0.30pp 24h vs 28.65% véspera, vol USD 6.14M acumulado). Gap Lula × Flávio ABRE pra +12.15pp. 2L Flávio 62.50% topo absoluto (↑0.50pp). 🔥 SENADO PL mantém 68.00%; UNIÃO sobe a 14.90%, PSB salta a 14.30% (spike de book fino, leitura cautelosa), MDB 15.20%, PSD recua a 6.55%. Mantida PoderData/AYA 29/Mai: EMPATE técnico 2T Lula × Flávio (CNN Brasil, Revista Oeste, Estado de Minas, Gazeta do Povo). Mantida Datafolha 22/Mai 1T 31% gap -9pp; 2T 43% gap -4pp; rejeição 46% > Lula 45% 1ª vez. Meio/Ideia 28/Mai 1T 31.5% gap -7pp; quedas -19pp alta renda, -18pp centro-direita, -16pp jovens.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 31/Mai D+17: domingo calmo, sem fato novo de peso sobre Flávio; cede 0.30pp no Poly (leitura técnica). A decisão dos EUA sobre PCC/CV seguiu como arma eleitoral Lula × Flávio (Jornal Opção). CONTINUIDADE 29-30/Mai: Moro lançou pré-candidatura ao governo do PR ao lado de Flávio, consolidando o palanque (Poder360, CNN Brasil). MANTIDOS 29/Mai: 🌎 EUA CLASSIFICAM PCC/CV TERRORISTAS (BBC, G1, O Globo, Valor, Folha), bandeira que Flávio pediu 28/Mai; Bolsonaro orienta Flávio a explorar o tema (O Globo). Mitigantes críticos: porta-voz do Departamento de Estado EUA NEGA influência de Flávio (G1); Valor 'decisão ajuda nas redes mas NÃO reverte crise Master'; PF envia parecer à PGR para investigar remessa Vorcaro aos EUA a pedido de Flávio (Valor). Cláudio Castro confirma desistência do Senado RJ (Congresso em Foco). MICHELLE segue caindo no Poly. Mantidos 22-23/Mai: rejeição Flávio 46% > Lula 45%; JOTA antipetismo como amortecedor no 2T. STF impeach 5.45% estável."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "16.85%",
    poll: "Renan presidencial 16.85% (↓0.35pp 24h vs 17.20% véspera, vol USD 6.25M acumulado) — devolve parte do salto de 30/Mai após 5 dias de alta; segue SEGUNDO presidencial Poly, bem acima de Haddad (5.30%), Zema (2.75%), Caiado (1.45%). 2L Renan 17.15%; 3L Renan favorito a 3º lugar. PoderData/AYA 29/Mai não destaca Renan no cenário principal. Meio/Ideia 28/Mai 1T Renan 2.1% — divergência Polymarket × pesquisa ~15pp absolutos, ponto mais largo do dashboard. Mantida ausência Datafolha 22/Mai. Mantido Sou candidato direita (BBC 28/Abr).",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "Renan devolve 0.35pp após o pico de 30/Mai — correção técnica, sem fato novo. Mantidos 29/Mai: Eduardo Leite (Novo) 'há espaço para uma alternativa' (VEJA) sinaliza competição interna no Novo; Aécio Neves vira trunfo do PSDB contra a cláusula de barreira (Gazeta do Povo 31/Mai) e pode concorrer com aceno a Ciro Gomes — fragmentação da 3ª via de centro. 🌎 decisão EUA sobre PCC/CV virou arma eleitoral (Jornal Opção) e pode reabsorver oxigênio anti-establishment se Flávio capitalizar. INFLAÇÃO 2026: curva desloca pra cima — banda 6.00-6.49% sobe a 23.70% (↑6.75pp) e 6.50-6.99% a 14.90%; mercado precifica inflação mais alta, incerteza fiscal de fundo que pode reanimar discurso anti-establishment. STF impeach 5.45% estável. Mantidos 22-23/Mai: Estadão 'terceira via tem janela estreita'; Joaquim Barbosa pré-candidato."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "5.30%",
    poll: "Haddad recupera leve Poly 5.30% (↑0.10pp 24h vs 5.20% véspera, vol USD 5.29M acumulado) — ruído de mercado fino. 2L Haddad 4.80%. PoderData/AYA 29/Mai não destaca Haddad no cenário principal. Mantida Vox SP 30/Mai 2T estadual: Tarcísio 48.3% × Haddad 36.5% (Poder360). Mantido líder do PSB defende Haddad em SP (Congresso em Foco 22/Mai); PSB lança Márcio França ao Senado SP (G1 28/Mai).",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Haddad recupera leve 0.10pp no Poly (ruído de mercado fino, sem fato novo 31/Mai). MANTIDOS 29-30/Mai: Vox SP 2T Tarcísio 48.3% × Haddad 36.5% (Poder360) — disputa estadual desfavorável ao petista; 🏛️ PACHECO fora de MG frustra o projeto do PT no 2º maior colégio; 🌎 Haddad enquadra decisão dos EUA sobre PCC/CV como autogol da direita, 'deram um tiro no pé' (O Globo); JOTA Agregador 'favoritismo Lula em pico do ciclo'. Mantidos 28/Mai: Câmara aprova fim da escala 6x1, segue ao Senado (BBC). Mantida crítica O Globo: Lula erra articulação em SP e MG. STF impeach 5.45% estável."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1.45%",
    poll: "Caiado presidencial Poly 1.45% (↑0.10pp 24h vs 1.35% véspera, vol USD 3.50M acumulado) — ruído de mercado fino. 3L Caiado favorito intermediário. PSD Senado recua a 6.55% (book fino, leitura cautelosa). Mantida PoderData/AYA 29/Mai: Lula empata tecnicamente com Caiado no 2T (CNN, Oeste). Mantida Meio/Ideia 28/Mai 1T Caiado 5.5% LIDERA a 3ª via. Mantida Quaest 13/Mai: Caiado 4% × Zema 4% empate técnico 1T.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "Caiado 1.45% no Poly (ruído). 🤝 ALIANÇA CAIADO-ZEMA ganha tração: Jornal Opção 31/Mai aponta que a união pode criar alternativa de centro-direita a Flávio contra Lula (continuidade da reunião 27/Mai). Aécio Neves vira trunfo do PSDB (Gazeta do Povo 31/Mai) — 3ª via de centro se mexe. MANTIDOS 29/Mai: Caiado diz que a decisão dos EUA sobre facções 'deveria ter sido tomada mais cedo' (G1), posicionamento tardio; Pacheco fora de MG (G1) abre vácuo. Mantidos 22/Mai: Estadão 'terceira via tem janela estreita' com discurso anticorrupção. STF impeach 5.45% estável."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "2.75%",
    poll: "Zema presidencial SOBE 2.75% (↑0.20pp 24h vs 2.55% véspera, vol USD 3.24M) — interrompe a sequência de quedas. 2L Zema 3.15%; 3L Zema vice-favorito a 3º lugar atrás de Renan. Mantida PoderData/AYA 29/Mai: Lula empata tecnicamente com Zema no 2T (CNN, Oeste) — competitividade 2T similar à de Caiado. Mantida Meio/Ideia 28/Mai 1T Zema 2.4% (menor que Caiado 5.5%, validando lógica de vice). Mantida Quaest 13/Mai: Zema 4% × Caiado 4% empate técnico 1T.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Zema sobe 0.20pp, interrompendo a erosão dos dias anteriores. 🤝 ALIANÇA CAIADO-ZEMA: Jornal Opção 31/Mai aponta que pode criar alternativa de centro-direita a Flávio (continuidade da reunião 27/Mai) — leitura de saída da disputa solo. INFLAÇÃO 2026: curva desloca pra cima — banda 6.00-6.49% sobe a 23.70% (↑6.75pp); mercado precifica inflação mais alta, terreno fértil pro discurso fiscal estrutural de Zema. MANTIDOS 29/Mai: Eduardo Leite (Novo) 'há espaço para uma alternativa' (VEJA) — competição interna no Novo. STF impeach 5.45% estável. Mantidos 20-22/Mai: Zema 'credibilidade para liderar país' (Folha 20/Mai); Zema radicaliza impeachment STF + privatizar tudo (Estadão 03/Mai); Cleitinho líder em MG."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.15%",
    poll: "Tarcísio presidencial 0.15% Poly estável (vol USD 12.3M acumulado, maior volume do mercado mas precificação baixíssima, anomalia histórica de convicção concentrada). 🔥 PL Senado mantém 68.00%, dominante na disputa por mais cadeiras. Mantida Vox SP 30/Mai 2T estadual: Tarcísio 48.3% × Haddad 36.5% (Poder360) — favoritismo estadual consolidado.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Tarcísio presidencial 0.15% estável, anomalia de vol USD 12.3M com preço baixíssimo (convicção concentrada para-e-contra). EVENTOS 31/Mai: domingo calmo. MANTIDOS 29-30/Mai: Haddad tenta enquadrar a decisão dos EUA sobre PCC/CV como problema para Tarcísio, 'deram um tiro no pé' (O Globo); Vox SP 2T Tarcísio 48.3% × Haddad 36.5%. PoderData/AYA 29/Mai, de foco bipolar, não destaca Tarcísio. Mantidos 22-23/Mai: PL e Centrão temem queda maior de Flávio (O Globo). Mantidos 17/Mai: 'vento virou a favor de Lula'; batalha judicial no TSE."
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
