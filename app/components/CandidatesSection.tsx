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
    poll: "Lula estável 37.50% Poly (mantém piso). Gap leve compressão +6.15pp Flávio (vs +6.35pp ontem). 2L Lula estável 19.50%. STF IMPEACH RECUPERA 14.00% Poly (↑1.00pp de 13.00%) coincide com decisão Moraes suspendendo Lei da Dosimetria (Folha, O Globo, G1, Estadão, Valor, VEJA 09/Mai). Mantida Quaest INICIA rodada nacional pós-Messias e Trump (publicação prevista 13/Mai).",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "Moraes suspende aplicação Lei da Dosimetria até STF julgar (Folha, G1, VEJA 09/Mai) decisão monocrática reabre tensão STF × Congresso. Folha analise Três Poderes Lula vencedor da semana, Ciro Nogueira perdedor (Folha 09/Mai). Bondades governo Lula somam R$ 144 bilhões ano eleitoral (Folha 09/Mai). Flávio fala governo de até 8 anos após acenar com fim de reeleição (Folha, O Globo, Valor 09/Mai)."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "43.65%",
    poll: "Flávio leve cede 43.65% Poly (↓0.20pp de 43.85%) mantém liderança forte. 2L Flávio DISPARA 66.50% (↑1.00pp consolida de 65.50%). 3L Flávio leve cede 4.85%. Mantida Percent Brasil MT 08/Mai Flávio 44,6% × Lula 29,8% (Poder360). Mantida Quaest INICIA quinta rodada nacional, publicação 13/Mai. Mantida Genial/Quaest 10 estados Flávio em SP, RJ + 3 estados.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "Flávio lança pré-candidatura sábado 09/Mai em estado do Sul (Gazeta do Povo). Flávio exclui Amin e escolhe Carlos Bolsonaro vaga Senado SC (Poder360 09/Mai). Flávio fala governo de até 8 anos após acenar com fim de reeleição (Folha, O Globo, Valor 09/Mai). Flávio promete acabar com esquerda próximos 40 anos (VEJA 09/Mai). Flávio Pix é do Bolsonaro e Master é do Lula (Poder360 09/Mai). Flávio critica decisão Moraes suspender Lei da Dosimetria como jogo combinado (O Globo, Valor 09/Mai). Operação contra Ciro Nogueira e disputa Senado antecipam embate Lula × Flávio sobre Master (Folha 09/Mai)."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "5.85%",
    poll: "Renan presidencial estável 5.85% Poly (após avanço leve ontem 5.95%). 3L estável 32.50% Renan firme em 2º na disputa por terceiro lugar (Zema mantém liderança 35.00%). 2L Renan leve avança 5.05% (↑0.20pp de 4.85%). STF impeach RECUPERA 14.00% Poly (↑1.00pp). Mantido 'Sou candidato direita' (BBC 28/Abr).",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "Caiado 3L DEVOLVE 13.50% (↓2.50pp DEVOLVE de 16.00%) competidor 3ª via cede. Decisão Moraes suspender Lei da Dosimetria reabre narrativa anti-STF favorável outsider mas Flávio captura espaço com pré-candidatura SC e governo 8 anos. Quaest nova rodada pós-Messias e Trump iniciada 08/Mai não destaca Renan (VEJA 09/Mai)."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "4.05%",
    poll: "Haddad presidencial estável 4.05% Poly (após ↑0.70pp DISPARA ontem). 2L Haddad leve cede 2.95% (↓0.30pp de 3.25%). 3L 3.95% (↓0.20pp leve). Camilo presidencial 2.55% (estável) Haddad mantém 1.50pp ACIMA Camilo gap presidencial mantido favorável.",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Flávio Bolsonaro lança pré-candidatura SC sábado 09/Mai (Gazeta do Povo) consolida coalizão direita Sul. Flávio governo de até 8 anos após acenar com fim de reeleição (Folha 09/Mai) reposicionamento. PT Senado leve cede 2.55% (↓0.60pp leve). Decisão Moraes suspender Lei da Dosimetria 09/Mai polariza base PT vê 'vitória democracia' oposição diz 'STF fechou Congresso' (Estadão 09/Mai)."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1.45%",
    poll: "Caiado presidencial estável 1.45% Poly (após DISPARA ontem). 3L DEVOLVE 13.50% (↓2.50pp DEVOLVE de 16.00%) corrige movimento ontem. PSD Senado estável 4.25%. Mantido 'Caiado lidera 3ª via 1T 5%' (Real Time Big Data 05/Mai). Mantida Genial/Quaest GO Caiado lidera (O Globo Pulso 06/Mai mantida).",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "Senado REORGANIZAÇÃO HOJE: PL estável 81.50%, MDB DEVOLVE FORTE 3.30% (↓3.10pp DEVOLVE de 6.40%) corrige movimento ontem, PSB DEVOLVE FORTE 1.25% (↓2.35pp DEVOLVE de 3.60%), União leve cede 4.25% (↓0.40pp). Flávio lança pré-candidatura SC e escolhe Carlos para Senado SC excluindo Amin (Poder360 09/Mai) consolida direita Sul. 'Caiado sem apoio explícito governadores PSD' (Gazeta do Povo 04/Mai mantida)."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "4.35%",
    poll: "Zema DISPARA leve presidencial 4.35% Poly (↑0.10pp de 4.25%). 3L mantém liderança 35.00% (estável). NOVO Senado leve 0.85% (estável). INFLAÇÃO REORGANIZAÇÃO COLOSSAL: bandas altas (≥6.50%) DEVOLVEM 27.60% (↓17.10pp DEVOLVE COLOSSAL de 44.70%) movimento sem paralelo dia. Banda 5.00-5.49% mantém liderança 32.75%.",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Decisão Moraes suspender Lei da Dosimetria (Folha, G1, VEJA 09/Mai) reabre narrativa anti-STF mas Flávio captura espaço com pré-candidatura SC e governo 8 anos (Folha, O Globo, Valor 09/Mai). Caiado 3L DEVOLVE 13.50% (↓2.50pp). Flávio promete acabar com esquerda 40 anos (VEJA 09/Mai). Quaest rodada pós-Messias e Trump iniciada 08/Mai não destaca Zema (VEJA 09/Mai)."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.15%",
    poll: "Tarcísio presidencial 0.15% Poly (estável). 3L 0.25% (estável). Republicanos Senado leve recupera 1.00% (↑0.25pp de 0.75%) movimento técnico após colapso ontem.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Tarcísio+Flávio reportados PG por crimes eleitorais (Revista Fórum 02/Mai mantido). Foco mantido na reeleição SP. Flávio lança pré-candidatura SC sábado 09/Mai (Gazeta do Povo) consolida coalizão direita Sul. Operação Ciro Nogueira impacta Centrão e PP de Ciro Nogueira cancela ato apoio SP (Folha 08/Mai mantida)."
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
