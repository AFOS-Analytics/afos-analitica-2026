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
    poll: "Lula estável 45.50% Poly (60h+ pós-AtlasIntel). Gap RECORDE HISTÓRICO +22.15pp LULA sobre Flávio em colapso (vs +17.35pp 19/Mai noite ↑4.80pp 32h). 2L Lula 12.50% (↓2.00pp 32h). STF IMPEACH 7.25% (↑1.20pp 32h leve recuperação sustentada vs mínima 5.30%). VOX BRASIL 20/Mai 2T Lula 46.8% × Flávio 38.1% gap +8.7pp; rejeição Lula 52.8%, Flávio 49.2% (Poder360, Exame, Folha Alphaville). AtlasIntel 19/Mai 1T 47% × 34.3% gap +12.7pp; 2T 48.9% × 41.8% gap +7.1pp. Aprovação Lula 47.4% Atlas / 42.9% Bloomberg. DIVERGÊNCIAS Polymarket × pesquisas crescem: Poly +22.15pp vs AtlasIntel +12.7pp vs Vox +8.7pp vs Datafolha +3pp.",
    position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato presidencial.",
    risk: "EVENTOS 20/Mai D+6: VOX BRASIL PUBLICADA confirma deterioração Flávio Lula 46.8% × Flávio 38.1% 2T gap +8.7pp (Poder360, Exame, Folha Alphaville 20/Mai); Real Time Big Data Ceará Lula ampla vantagem (GCMais 20/Mai); Lula vence 1º e 2º turno no Ceará (Poder360, CartaCapital). PSDB DISCUTE LANÇAR AÉCIO NEVES aproveitando desgaste Flávio (CNN Brasil, Folha 20/Mai). Judicialização tática campanha (JOTA 20/Mai) Lula tem TSE como aliado institucional. Mantidos 19/Mai: AtlasIntel publicada (Flávio caiu 6 pontos); Lula leva Messias a ato eleitoral antes reenvio STF (Folha); ministro 'taxa blusinhas foi erro' + elo Flávio-Master vai pra campanha (Folha); Quaest 32% reeleição Lula melhor (G1). MAS: rejeição Lula 52.8% Vox mantém alta; contradições/desgaste base Lula em estaduais. Próxima Datafolha 22/Mai SEXTA n=2.004 cenário Michelle decisiva. STF IMPEACH 7.25% leve recuperação sustentada."
  },
  {
    name: "Flávio Bolsonaro",
    party: "PL",
    age: 45,
    role: "Senador (RJ)",
    polymarket: "23.35%",
    poll: "Flávio COLAPSA 23.35% Poly (↓4.80pp em 32h mínima absoluta ciclo, ↓8.20pp 6 dias vs 31.55% 18/Mai). Gap RECORDE +22.15pp LULA. 2L Flávio COLAPSA 56.00% (↓6.50pp 32h base PL CEDE pela primeira vez). 3L Flávio DOBRA 8.55% (↑3.75pp 32h vs 4.80% mercado precifica como candidato 3º lugar). PL Senado CEDE 76.00% (↓2.50pp primeira queda do ciclo). VOX BRASIL 20/Mai 2T 38.1%; rejeição 49.2%. AtlasIntel 19/Mai 1T 34.3% / 2T 41.8%; rejeição 52%. Datafolha 16/Mai 1T 35%. Próxima Datafolha 22/Mai SEXTA testa cenário Michelle como substituta.",
    position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.",
    risk: "EVENTOS 20/Mai D+6: VOX BRASIL confirma deterioração 2T Lula 46.8% × Flávio 38.1% gap +8.7pp (Poder360, Exame, Folha Alphaville); PSDB DISCUTE LANÇAR AÉCIO NEVES aproveitando desgaste Flávio (CNN Brasil, Folha 20/Mai) primeira sinalização explícita reorganização direita não-bolsonarista; Caiado: 'contaminado por Vorcaro não pode ser presidente' sem citar Flávio (Folha, Estadão); Zema sobre 'credibilidade liderar país' sem citar Flávio (Folha) movimento simétrico Caiado; Michelle 'chapa ganharia adesão' diz Salles (BBC); MICHELLE ignora Flávio + 'aliança com o mal' (Folha); FLÁVIO TROCA DE MARQUETEIRO após Dark Horse (Folha); ALIADOS PL admitem rever candidatura (Bnews); VALDEMAR pressionado PL pode tirar Flávio das Eleições 2026 (Área VIP); Carlos Bolsonaro sugere Zema 'surfa' crise (Estado de Minas). Mantidos 19/Mai: AtlasIntel Flávio caiu 6 pontos; equipe Flávio acionou TSE pedindo suspensão; Flávio discutiu renúncia com pai (VEJA). MICHELLE DISPARA 3.70% (↑1.45pp) + 2L 3.25% (↑1.70pp) — narrativa substituição GANHA tração no Polymarket pela primeira vez. Datafolha 22/Mai SEXTA cenário Michelle decisiva."
  },
  {
    name: "Renan Santos",
    party: "Missão",
    age: 35,
    role: "Fundador do MBL",
    polymarket: "15.60%",
    poll: "Renan DISPARA 15.60% Poly (↑3.05pp 32h vs 12.55% 19/Mai noite) consolida SEGUNDO no presidencial Poly acima Zema (5.55%) e Haddad (4.70%). 2L Renan 11.40% (↑1.90pp 32h base eleva). 3L Renan 34.50% (↓1.00pp mantém topo). Vox/AtlasIntel não destacam números detalhados 3ª via no recorte publicado. Quaest 22% apontam 3ª via como melhor resultado (G1 19/Mai).",
    position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.",
    risk: "Renan DISPARA 3.05pp presidencial em 32h consolidando SEGUNDO no presidencial Poly. Migração de mercado clara: Flávio em colapso, mercado precifica Renan como receptor principal (não Zema, não Caiado, não Haddad). 3L mantém topo 34.50%. PSDB DISCUTE LANÇAR AÉCIO NEVES (CNN Brasil, Folha 20/Mai) competidor 3ª via direita potencial. MICHELLE DISPARA 3.70% (↑1.45pp) + 2L 3.25% (↑1.70pp) potencial fragmentação base direita. CAIADO/ZEMA posicionam contra Flávio (Folha 20/Mai). Datafolha 22/Mai SEXTA foco Michelle (não Renan no cenário central). Joaquim Barbosa pré-candidato compete espaço 3ª via centro. STF impeach 7.25% leve recuperação reduz combustível anti-establishment Renan."
  },
  {
    name: "Fernando Haddad",
    party: "PT",
    age: 63,
    role: "Pré-candidato Gov. SP",
    polymarket: "4.70%",
    poll: "Haddad DUPLICA presidencial 4.70% Poly (↑2.35pp em 32h vs 2.35% 19/Mai). 2L Haddad 5.05% (↑0.80pp). 3L Haddad 2.30% (↑0.30pp). Camilo 1.55% (↑0.05pp) — Haddad amplia gap acima Camilo para 3.15pp. PT Senado 3.00% estável. Vox/AtlasIntel não destacam Haddad. Próxima Datafolha 22/Mai foco em Michelle Bolsonaro, não Haddad.",
    position: "Centro-esquerda. Indicado a disputar governo de SP. Fora da corrida presidencial direta.",
    risk: "HADDAD DUPLICA Poly em 32h — mercado precifica Haddad como hedge interno PT caso Lula vacile ou cenário mudança. 2L Haddad 5.05% (↑0.80pp 32h) ganha relevância. EVENTOS 20/Mai: Vox Brasil 2T Lula 46.8% × Flávio 38.1% (Poder360, Exame, Folha Alphaville); PSDB discute lançar Aécio Neves (CNN Brasil, Folha); Lula vence Ceará 1º e 2º turnos (Poder360, CartaCapital). Mantidos 19/Mai: AtlasIntel publicada Lula amplia vantagem; Lula leva Messias a ato eleitoral; Quaest 32% Lula reeleição melhor. STF impeach 7.25% leve recuperação. Aprovação Lula 47.4% Atlas / 42.9% Bloomberg. MAS: Mantida Tarcísio crítica Haddad (Folha 05/Mai); Vox SP gap 12pp mantido."
  },
  {
    name: "Ronaldo Caiado",
    party: "PSD",
    age: 76,
    role: "Ex-Gov. Goiás",
    polymarket: "1.25%",
    poll: "Caiado 1.25% Poly (↓0.20pp 32h vs 1.45% 19/Mai estável marginal). 3L Caiado RECUPERA 16.50% (↑3.00pp 32h vs 13.50% mas ainda ↓4.00pp vs pico 20.50% 17/Mai). 2L Caiado 1.35% estável. PSD Senado RECUPERA 6.40% (↑1.45pp 32h). Caiado 'contaminado por Vorcaro não pode ser presidente' sem citar Flávio (Folha, Estadão 20/Mai). Mantida Quaest 13/Mai: Caiado 4% × Zema 4% empate técnico 1T 3ª via.",
    position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.",
    risk: "Caiado 3L RECUPERA 3.00pp em 32h (13.50%→16.50%) recupera posição cedendo terreno anterior. CAIADO 'contaminado por Vorcaro não pode ser presidente' sem citar Flávio (Folha, Estadão 20/Mai) tenta capturar voto direita não-bolsonarista. ZEMA posicionamento simétrico 'credibilidade liderar país' (Folha). RENAN mantém 3L 34.50% topo. SENADO: PL CEDE 76.00% (↓2.50pp primeira queda ciclo), PSD RECUPERA 6.40% (↑1.45pp), Republicanos COLAPSA 2.50% (↓1.70pp), MDB 4.30%, PODEMOS 3.00% (↑1.20pp). EVENTOS 20/Mai: PSDB DISCUTE LANÇAR AÉCIO NEVES competidor 3ª via direita (CNN Brasil, Folha); Carlos Bolsonaro sugere Zema 'surfa' crise (Estado de Minas). Mantidos 17/Mai: Abilio quer CPI Master alfineta Zema; Aécio neutralidade PSDB. MICHELLE 3.70% (↑1.45pp) + 2L 3.25% (↑1.70pp) mantém espaço alternativo direita ampliado."
  },
  {
    name: "Romeu Zema",
    party: "Novo",
    age: 56,
    role: "Ex-Gov. Minas Gerais",
    polymarket: "5.55%",
    poll: "Zema 5.55% Poly (↓0.70pp 32h vs 6.25% 19/Mai) ainda abaixo Renan (15.60%) por gap -10.05pp. 3L Zema 26.00% (↓2.50pp 32h cede mais espaço para Renan no topo 34.50%). 2L Zema 3.60% (↓0.05pp 32h estável baixo). NOVO Senado 0.95% (↓0.05pp 32h). Zema sobre 'credibilidade liderar país' sem citar Flávio (Folha 20/Mai). Carlos Bolsonaro sugere Zema 'surfa' crise Flávio (Estado de Minas 20/Mai).",
    position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.",
    risk: "ZEMA cede 0.70pp presidencial — sinal mercado precificando Renan (15.60% disparando) como receptor 3ª via principal, não Zema. 3L Zema 26.00% (↓2.50pp) ainda cede para Renan (34.50% topo) e Caiado (16.50% recupera). INFLAÇÃO bandas altas (≥6.50%) estabilizadas 8.55% cauda fiscal extrema parou de cair beneficia discurso fiscal Zema. STF impeach 7.25% leve recuperação reduz combustível anti-STF Zema. EVENTOS 20/Mai: ZEMA 'credibilidade' sem citar Flávio (Folha) posicionamento simétrico Caiado; Carlos Bolsonaro sugere Zema 'surfa' crise (Estado de Minas); PSDB DISCUTE LANÇAR AÉCIO NEVES competidor direto 3ª via direita (CNN Brasil, Folha). Mantidos 17/Mai: Abilio alfineta Zema (Rdnews); Pesquisa MG indefinição Pacheco. Mantidos 16/Mai: Zema 'página virada' aliança 3ª via direita preservada."
  },
  {
    name: "Tarcísio de Freitas",
    party: "Republicanos",
    age: 51,
    role: "Governador de São Paulo",
    polymarket: "0.35%",
    poll: "Tarcísio presidencial 0.35% Poly estável (vol acumulado USD 11.49M anomalia histórica — muita aposta para-e-contra desde abertura). 2L Tarcísio 0.35% estável. 3L Tarcísio 0.40% estável. Republicanos Senado COLAPSA 2.50% (↓1.70pp 32h vs 4.20% 19/Mai). PL Senado CEDE 76.00% (↓2.50pp primeira queda do ciclo).",
    position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.",
    risk: "Republicanos Senado COLAPSA 1.70pp em 32h (4.20%→2.50%) — desgaste continuado. Volume USD 11.49M Tarcísio presidencial mantém anomalia (preço baixo + volume alto = convicção concentrada historicamente para-e-contra). EVENTOS 20/Mai: Vox Brasil confirma deterioração Flávio; PSDB discute Aécio Neves (CNN Brasil, Folha); MICHELLE DISPARA 3.70% (↑1.45pp) + 2L 3.25% (↑1.70pp) — narrativa substituição na chapa PL GANHA tração no Polymarket pela primeira vez. Datafolha 22/Mai SEXTA inclui cenário Michelle (Valor Econômico, InfoMoney) — vai oficializar Michelle como hipótese substituição em pesquisa nacional. Tarcísio mantém foco reeleição SP. Mantidos 17/Mai: 'Vento virou favor Lula'; batalha judicial TSE; Pesquisa MG. Mantidos 16/Mai: Derrite pré-Senado SP com Flávio Sorocaba; Tarcísio Sabesp 'mão pesada Estado'; Tarcísio+Flávio reportados PG crimes eleitorais (Revista Fórum). Mantidos 13/Mai: Bolsonaristas debatem substituir Flávio por Michelle (VEJA)."
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
