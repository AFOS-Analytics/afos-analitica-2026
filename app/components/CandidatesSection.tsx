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
    polymarket: "38.50%",
    poll: "Lula leve cede 38.50% Poly (↓1.00pp de 39.50%) gap EXPANSÃO COLOSSAL +4.85pp Flávio (vs +1.85pp ontem, ↑3.00pp). 2L Lula DEVOLVE 16.50% (↓3.50pp de 20.00%) perde posição forte. STF IMPEACH COLAPSA 10.50% Poly (↓5.00pp de 15.50%) caminho institucional alternativo abre. EVENTO MAIOR DUPLO: Kassio Nunes Marques + André Mendonça POSSE OFICIAL TSE comandarão eleições 2026 (G1, InfoMoney, Jurinews, Folha BV 12/Mai). Datafolha publica sexta 15/Mai cobertura Trump + STF + Desenrola (G1, InfoMoney 12/Mai). Quaest publicação confirmada 13/Mai D-Day LAUNCH AFOS.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "Gap COLOSSAL +4.85pp Flávio (↑3.00pp em 24h). 2L DEVOLVE 3.50pp perde posição forte. AtlasIntel declínio bônus nordestino Lula reconfigura cenário (Sobral Online 12/Mai). RTB MS Flávio supera Lula 1T e 2T (CNN Brasil 12/Mai). Lula e Flávio sem palanque MG decisivo (G1 12/Mai). PEC Anistia retomada ameaça pauta governo (G1 12/Mai). MAS: Maior gestora mundo vê Lula reeleito ignora Flávio EUA (Revista Fórum 12/Mai) sinal mercado internacional. Mantida Lula rejeição 47,4% × Flávio 43,8% (Poder360 11/Mai). Datafolha publica 15/Mai oportunidade reposicionamento."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "43.35%",
    poll: "Flávio DISPARA 43.35% Poly (↑2.00pp de 41.35%) maior movimento individual 24h. Gap EXPANSÃO COLOSSAL +4.85pp (vs +1.85pp ontem, ↑3.00pp). 2L Flávio consolida 67.50% estável. 3L Flávio DISPARA 5.75% (↑2.45pp recupera). EVENTO MAIOR DUPLO: Kassio + Mendonça POSSE OFICIAL TSE (G1, InfoMoney 12/Mai). Datafolha publica sexta 15/Mai cobertura Trump + STF + Desenrola (G1 12/Mai). Quaest publicação confirmada 13/Mai D-Day LAUNCH AFOS.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "Vorcaro ESCALADA marqueteiro Flávio citado plano contra BC, recebeu R$ 650 mil de dono de agência (Folha 12/Mai). Vorcaro encomendou plano com influencers contra BC empresário confirma PF (O Globo, Estadão 12/Mai). Ciro Nogueira Mensalão Vorcaro (O Globo 12/Mai). Casos Master e Carbono Oculto respingam campanha Flávio (Folha 12/Mai). PGR pede condenação Eduardo Bolsonaro EUA contra STF (Folha 12/Mai). PEC Anistia retomada (G1 12/Mai). Bolsonaristas renovam ofensiva STF cúpula Congresso espera dosimetria (Folha 12/Mai). Valdemar quer Ciro Nogueira palanque Flávio (Estado de Minas 12/Mai). Mantido governo 8 anos (Folha 09/Mai)."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "5.85%",
    poll: "Renan presidencial DISPARA 5.85% Poly (↑0.40pp de 5.45%). 3L 32.00% (↑0.50pp) Zema mantém liderança 32.50% (↓1.00pp). 2L Renan DISPARA 6.75% (↑1.30pp). STF IMPEACH COLAPSA 10.50% Poly (↓5.00pp). Quaest publicação confirmada 13/Mai D-Day LAUNCH AFOS.",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "Caiado 3L 18.50% estável competidor 3ª via consolida. Camilo 3L DISPARA 7.00% (↑2.75pp continua avanço 3 dias) fragmenta espaço 3ª via. Flávio 3L DISPARA 5.75% (↑2.45pp recupera). PEC Anistia retomada (G1 12/Mai) reduz oxigênio impeach narrativa. Quaest publicação confirmada 13/Mai D-Day não deve destacar Renan. Datafolha 15/Mai cobertura ampla."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "3.45%",
    poll: "Haddad presidencial DEVOLVE 3.45% Poly (↓0.50pp de 3.95%). 2L Haddad 2.85% estável (↓0.15pp). 3L 4.25% estável. Camilo presidencial 2.55% (↓0.20pp) Haddad mantém 0.90pp ACIMA Camilo. PT Senado DISPARA 2.90% (↑0.75pp continua recuperação).",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "Datafolha publica sexta 15/Mai cobertura Trump + STF + Desenrola (G1, InfoMoney 12/Mai). Quaest 13/Mai D-Day LAUNCH AFOS. PT Senado DISPARA 2.90% (↑0.75pp) sinal reorganização base governista continua. AtlasIntel declínio bônus nordestino Lula afeta indiretamente Haddad SP (Sobral Online 12/Mai). Lula leve cede presidencial 38.50% (↓1.00pp) gap COLOSSAL +4.85pp. Mantida pesquisa SP Tarcísio frente Haddad."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1.15%",
    poll: "Caiado presidencial 1.15% Poly (↓0.10pp). 3L mantém 18.50% estável consolida posição 3º competidor. PSD Senado 3.05% (↓0.20pp leve). Mantido Caiado lidera 3ª via 1T 5% Real Time. Quaest 13/Mai D-Day deve destacar 3ª via.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "SENADO REORGANIZAÇÃO COLOSSAL OUTRA VEZ 24h: PL DEVOLVE FORTE 75.00% (↓7.00pp maior cessão 24h), MDB DISPARA FORTE 8.65% (↑3.75pp), Republicanos DEVOLVE 5.45% (↓2.70pp), Podemos DEVOLVE 3.05% (↓2.05pp), PT 2.90% (↑0.75pp), Novo 1.00% (↑0.20pp). Camilo 3L DISPARA 7.00% (↑2.75pp continua) fragmenta 3ª via. Flávio 3L DISPARA 5.75% (↑2.45pp). Kassio + Mendonça POSSE OFICIAL TSE (G1 12/Mai)."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "3.85%",
    poll: "Zema presidencial DEVOLVE 3.85% Poly (↓0.60pp de 4.45%). 3L mantém liderança 32.50% (↓1.00pp). NOVO Senado DISPARA 1.00% (↑0.20pp). INFLAÇÃO bandas altas DISPARA COLOSSAL 40.30% (↑11.40pp de 28.90%) banda alta narrativa fiscal extrema reabre. 5.50-5.99% DISPARA COLOSSAL 23.80% (↑12.30pp maior movimento). Zema critica STF frutas podres (Estadão 12/Mai).",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "Caiado 3L 18.50% estável competidor 3ª via consolida. Camilo 3L DISPARA 7.00% (↑2.75pp continua) fragmenta espaço 3ª via. Renan 3L DISPARA 32.00% (↑0.50pp). Lula e Flávio sem palanque MG decisivo (G1 12/Mai) janela Zema MG. PEC Anistia retomada reduz oxigênio impeach (G1 12/Mai). STF IMPEACH COLAPSA 10.50% (↓5.00pp) reduz narrativa anti-STF como caminho único. Quaest 13/Mai D-Day deve destacar 3ª via."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.25%",
    poll: "Tarcísio presidencial 0.25% Poly estável. 3L 0.30% estável. Republicanos Senado DEVOLVE 5.45% (↓2.70pp de 8.15%) corrige movimento de ontem ainda elevado vs 3.85% 10/Mai.",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "MDB Senado DISPARA FORTE 8.65% (↑3.75pp captura espaço PL) reorganização coalizão direita. PL DEVOLVE FORTE 75% (↓7.00pp) maior cessão 24h Senado. Vorcaro escalada marqueteiro Flávio R$ 650 mil (Folha 12/Mai) respinga aliados PL. Mantido Tarcísio+Flávio reportados PG crimes eleitorais (Revista Fórum 02/Mai). Mantido foco reeleição SP."
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
