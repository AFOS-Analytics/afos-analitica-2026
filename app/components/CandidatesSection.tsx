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
    polymarket: "37.50%",
    poll: "Lula estável 37.50% Poly (mantém piso). Gap COMPRIME +6.35pp Flávio (vs +7.50pp ontem) Flávio devolve liderança. 2L Lula estável 19.50%. Quaest nova pesquisa publicada hoje 08/Mai pós-Messias e encontro Trump (VEJA 08/Mai). Paraná Pesquisas MT: Flávio 44,6% × Lula 29,8% (Poder360 08/Mai). Mantida Genial/Quaest 10 estados (Lula em 5 Nordeste × Flávio em 5 SP/RJ/Sul) e Meio/Ideia 2T 45,3% × 44,7%.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "Lula declarou que disse a Trump não querer guerra, disputa é narrativa (G1, O Globo, Valor 08/Mai). Tarifas dominaram conversa Lula × Trump, minerais e big techs em 2º plano (Folha 08/Mai). Operação Ciro Nogueira desdobramentos: Pimenta cobra CPI Master rejeita acordão (Jornal O Sul 08/Mai). Mendonça aguarda PF/PGR para decidir Papuda ou domiciliar Vorcaro (O Globo 08/Mai)."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "43.85%",
    poll: "Flávio DEVOLVE 43.85% Poly (↓1.15pp de 45.00%) entrega parte do gap. 2L Flávio 65.50% (estável consolida). 3L Flávio 5.10% (↑0.90pp leve recupera). Paraná Pesquisas MT 08/Mai: Flávio 44,6% × Lula 29,8% (Poder360). Quaest nova 08/Mai pós-Messias e Trump (VEJA). Mantida Genial/Quaest Flávio em SP, RJ + 3 estados.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "Flávio e Tarcísio se descolam de Ciro Nogueira após nova operação Master (Gazeta do Povo 08/Mai). PP cancela ato apoio eleitoral SP (Folha 08/Mai). Flávio diz elogiou Ciro como vice por cortesia, prefere mulher para chapa (Valor 08/Mai). Operação Ciro Nogueira inaugura chegada investigações Master ao Congresso (Estadão Andreazza 08/Mai). Master deixa Flávio Bolsonaro desnorteado (Hora do Povo 08/Mai). Flávio vai pregar união em viagem para lançar Carlos ao Senado (Estadão 08/Mai)."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "5.95%",
    poll: "Renan presidencial leve avança 5.95% Poly (↑0.10pp de 5.85%). 3L estável 32.50% Renan firme em 2º na disputa por terceiro lugar (Zema recupera liderança 35.00%). STF impeach DEVOLVE 13.00% Poly (↓1.00pp de 14.00%). Mantido 'Sou candidato direita' (BBC 28/Abr).",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "Caiado 3L DISPARA 16.00% (↑1.50pp DISPARA de 14.50%) competidor 3ª via avança. Operação Ciro Nogueira impacto centrão e Lula × Trump rescaldo (G1, Folha, Valor 08/Mai) capturam ciclo institucional reduz oxigênio outsider. Quaest nova 08/Mai não destaca Renan competitivo."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "4.05%",
    poll: "Haddad presidencial DISPARA 4.05% Poly (↑0.70pp de 3.35%) maior movimento individual presidencial do dia. 2L 3.25% (↓0.30pp leve cede). 3L 4.15% (estável). Camilo presidencial 2.55% (↑0.30pp recupera) Haddad agora 1.50pp ACIMA Camilo gap presidencial expande favorável.",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Tarcísio nega prejuízo com operação, e PP de Ciro Nogueira cancela ato para apoio eleitoral em SP (Folha 08/Mai). Paraná Pesquisas MT mostra Flávio 44,6% × Lula 29,8% extrapolação favorece Tarcísio em SP (Poder360 08/Mai) Haddad enfraquece estadual. PT Senado leve cede 3.15% (↓0.15pp). Flávio pregar união em viagem para lançar Carlos ao Senado (Estadão 08/Mai)."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1.45%",
    poll: "Caiado presidencial DISPARA 1.45% Poly (↑0.30pp de 1.15%) consolida acima 1%. 3L DISPARA 16.00% (↑1.50pp DISPARA de 14.50%) reaproxima Renan 32.50% e Zema 35.00%. PSD Senado estável 4.25%. Mantido 'Caiado lidera 3ª via 1T 5%' (Real Time Big Data 05/Mai). Genial/Quaest GO Caiado lidera (O Globo Pulso 06/Mai mantida).",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "Senado REORGANIZAÇÃO HOJE: PL estável 81.50%, Republicanos COLAPSA 0.75% (↓4.60pp DEVOLVE COLOSSAL de 5.35%) reprecificação massiva, MDB DISPARA 6.40% (↑0.60pp). 'Caiado sem apoio explícito governadores PSD na corrida' (Gazeta do Povo 04/Mai mantida) PSD fragmentado. União Senado leve cede 4.65% (↓0.65pp)."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "4.25%",
    poll: "Zema DISPARA presidencial 4.25% Poly (↑0.30pp de 3.95% recupera). 3L RECUPERA LIDERANÇA 35.00% (↑1.50pp DISPARA de 33.50% volta ao topo). NOVO Senado leve cede 0.80% (↓0.20pp leve). INFLAÇÃO REORGANIZAÇÃO HOJE: bandas altas (≥6.50%) DEVOLVEM 44.70% (↓15.95pp DEVOLVE FORTE de 60.65%) revertendo movimento ontem. Banda 5.00-5.49% DISPARA 33.60% (↑12.85pp DISPARA recupera liderança).",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Renan 3L estável 32.50% empata virtualmente com Zema. Caiado 3L DISPARA 16.00% (↑1.50pp). Operação Ciro Nogueira fragmenta direita interna PP cancela ato SP (Folha 08/Mai). Vorcaro quer devolver R$ 40 bilhões em 10 anos (Poder360 08/Mai). Quaest nova 08/Mai não destaca Zema."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.15%",
    poll: "Tarcísio presidencial 0.15% Poly (estável). 3L 0.25% (↓0.20pp leve cede). Republicanos Senado COLAPSA 0.75% (↓4.60pp DEVOLVE COLOSSAL de 5.35%) reprecificação massiva.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Tarcísio nega prejuízo com operação, e PP cancela ato apoio (Folha 08/Mai). Tarcísio e Flávio reportados PG por crimes eleitorais (Revista Fórum 02/Mai mantido). Paraná Pesquisas MT extrapola favoritismo direita (Poder360 08/Mai). Foco mantido na reeleição SP."
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
