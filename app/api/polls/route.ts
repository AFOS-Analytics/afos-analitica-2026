import { NextResponse } from 'next/server';

export const revalidate = 7200;

export async function GET() {
  const data = {
    lastUpdate: "2026-04-01",
    institutes: [
      // ★★★★★ Referência nacional
      { name: "Datafolha", reliability: 5, type: "Presencial", note: "Mais tradicional do Brasil. Grupo Folha." },
      { name: "Quaest/Genial", reliability: 5, type: "Presencial", note: "Encomendada por bancos/investidores. Alta precisão." },
      // ★★★★ Alta confiabilidade
      { name: "AtlasIntel", reliability: 4, type: "Online/Big Data", note: "Metodologia digital. Parceria Bloomberg." },
      { name: "Paraná Pesquisas", reliability: 4, type: "Presencial", note: "Forte em estaduais e nacionais." },
      { name: "MDA", reliability: 4, type: "Presencial", note: "Um dos que mais acertou historicamente." },
      { name: "Ipec (ex-Ibope)", reliability: 4, type: "Presencial", note: "Herdeiro do Ibope. Menos dominante atualmente." },
      // ★★★ Confiável
      { name: "Real Time Big Data", reliability: 3, type: "Telefônica", note: "Séries frequentes, amostra menor." },
      { name: "Ideia/Canal Meio", reliability: 3, type: "Misto", note: "Parceria editorial Canal Meio." },
      { name: "Futura Inteligência", reliability: 3, type: "Misto", note: "Pesquisas nacionais e regionais." },
      { name: "Gerp", reliability: 3, type: "Misto", note: "Frequente em rodadas semanais 2026." },
      { name: "PoderData", reliability: 3, type: "Telefônica/Online", note: "Foco em tendências políticas." },
      { name: "Methodus", reliability: 3, type: "Presencial", note: "Atuação regional forte." },
      { name: "Ipespe", reliability: 3, type: "Presencial", note: "Menos frequente atualmente." },
      // ★★ Usar com cautela
      { name: "Veritá", reliability: 2, type: "Presencial", note: "⚠️ Erros metodológicos documentados. Usar com cautela." },
      { name: "Ranking Brasil", reliability: 2, type: "Misto", note: "Menos histórico disponível." },
      { name: "Alfa Inteligência", reliability: 2, type: "Misto", note: "Instituto mais recente." },
      { name: "Colectta", reliability: 2, type: "Online", note: "Metodologia digital." },
    ],
    polls: [
      {
        institute: "Paraná Pesquisas",
        date: "2026-03-30",
        sample: 2080,
        margin: 2.2,
        register: "BR-00873/2026",
        reliability: 4,
        method: "Presencial",
        scenarios: [
          {
            name: "Cenário Único (com Caiado/PSD)",
            results: [
              { candidate: "Lula (PT)", percent: 41.3 },
              { candidate: "Flávio Bolsonaro (PL)", percent: 37.8 },
              { candidate: "Ronaldo Caiado (PSD)", percent: 3.6 },
              { candidate: "Romeu Zema (Novo)", percent: 3.0 },
              { candidate: "Renan Santos (Missão)", percent: 1.2 },
              { candidate: "Aldo Rebelo (Novo)", percent: 1.1 },
            ]
          }
        ],
        secondRound: [
          { matchup: "Flávio vs Lula", candidate1: "Flávio Bolsonaro", percent1: 45.2, candidate2: "Lula", percent2: 44.1 },
        ]
      },
      {
        institute: "Nexus/BTG Pactual",
        date: "2026-03-30",
        sample: 2000,
        margin: 2,
        register: "BR-07875/2026",
        reliability: 4,
        method: "Telefônica",
        scenarios: [
          {
            name: "Cenário 1 (com Caiado)",
            results: [
              { candidate: "Lula (PT)", percent: 41 },
              { candidate: "Flávio Bolsonaro (PL)", percent: 38 },
              { candidate: "Romeu Zema (Novo)", percent: 4 },
              { candidate: "Ronaldo Caiado (PSD)", percent: 4 },
              { candidate: "Renan Santos (Missão)", percent: 2 },
              { candidate: "Aldo Rebelo (DC)", percent: 0 },
            ]
          },
          {
            name: "Cenário 2 (com Eduardo Leite)",
            results: [
              { candidate: "Lula (PT)", percent: 39 },
              { candidate: "Flávio Bolsonaro (PL)", percent: 39 },
              { candidate: "Romeu Zema (Novo)", percent: 5 },
              { candidate: "Eduardo Leite (PSD)", percent: 4 },
              { candidate: "Renan Santos (Missão)", percent: 3 },
              { candidate: "Aldo Rebelo (DC)", percent: 1 },
            ]
          },
          {
            name: "Cenário 3 (sem 3ª via PSD)",
            results: [
              { candidate: "Lula (PT)", percent: 42 },
              { candidate: "Flávio Bolsonaro (PL)", percent: 39 },
              { candidate: "Romeu Zema (Novo)", percent: 6 },
              { candidate: "Renan Santos (Missão)", percent: 3 },
              { candidate: "Aldo Rebelo (DC)", percent: 1 },
            ]
          }
        ],
        secondRound: [
          { matchup: "Flávio vs Lula", candidate1: "Flávio Bolsonaro", percent1: 46, candidate2: "Lula", percent2: 46 },
          { matchup: "Lula vs Zema", candidate1: "Lula", percent1: 46, candidate2: "Zema", percent2: 40 },
          { matchup: "Lula vs Caiado", candidate1: "Lula", percent1: 46, candidate2: "Caiado", percent2: 41 },
          { matchup: "Lula vs Eduardo Leite", candidate1: "Lula", percent1: 46, candidate2: "Eduardo Leite", percent2: 36 },
        ]
      },
      {
        institute: "AtlasIntel/Bloomberg",
        date: "2026-03-25",
        sample: 5028,
        margin: 1,
        register: "BR-04227/2026",
        reliability: 4,
        method: "Online/Big Data",
        scenarios: [
          {
            name: "Cenário Principal",
            results: [
              { candidate: "Lula (PT)", percent: 45.9 },
              { candidate: "Flávio Bolsonaro (PL)", percent: 40.1 },
              { candidate: "Renan Santos (Missão)", percent: 4.4 },
              { candidate: "Ronaldo Caiado (PSD)", percent: 3.7 },
              { candidate: "Romeu Zema (Novo)", percent: 3.1 },
            ]
          },
          {
            name: "Com Tarcísio (sem Flávio)",
            results: [
              { candidate: "Lula (PT)", percent: 45.6 },
              { candidate: "Tarcísio de Freitas (Rep)", percent: 33.3 },
              { candidate: "Romeu Zema (Novo)", percent: 6.2 },
              { candidate: "Renan Santos (Missão)", percent: 4.6 },
              { candidate: "Ronaldo Caiado (PSD)", percent: 4.2 },
            ]
          },
          {
            name: "Com Haddad (sem Lula)",
            results: [
              { candidate: "Flávio Bolsonaro (PL)", percent: 40.1 },
              { candidate: "Fernando Haddad (PT)", percent: 37.6 },
              { candidate: "Renan Santos (Missão)", percent: 4.5 },
              { candidate: "Ronaldo Caiado (PSD)", percent: 3.9 },
              { candidate: "Romeu Zema (Novo)", percent: 3.0 },
            ]
          },
          {
            name: "Flávio + Tarcísio divididos",
            results: [
              { candidate: "Lula (PT)", percent: 45.7 },
              { candidate: "Flávio Bolsonaro (PL)", percent: 35.8 },
              { candidate: "Tarcísio de Freitas (Rep)", percent: 7.9 },
              { candidate: "Renan Santos (Missão)", percent: 4.3 },
              { candidate: "Ronaldo Caiado (PSD)", percent: 2.8 },
              { candidate: "Romeu Zema (Novo)", percent: 1.6 },
            ]
          }
        ],
        secondRound: [
          { matchup: "Flávio vs Lula", candidate1: "Flávio Bolsonaro", percent1: 47.6, candidate2: "Lula", percent2: 46.6 },
          { matchup: "Tarcísio vs Lula", candidate1: "Tarcísio", percent1: 47.2, candidate2: "Lula", percent2: 46.3 },
          { matchup: "Zema vs Lula", candidate1: "Lula", percent1: 46.6, candidate2: "Zema", percent2: 43.7 },
          { matchup: "Caiado vs Lula", candidate1: "Lula", percent1: 46.2, candidate2: "Caiado", percent2: 36.7 },
        ]
      },
      {
        institute: "Datafolha",
        date: "2026-03-07",
        sample: 2004,
        margin: 2,
        register: "Folha de S.Paulo",
        reliability: 5,
        method: "Presencial",
        scenarios: [
          {
            name: "Cenário com Eduardo Leite",
            results: [
              { candidate: "Lula (PT)", percent: 39 },
              { candidate: "Flávio Bolsonaro (PL)", percent: 34 },
              { candidate: "Romeu Zema (Novo)", percent: 4 },
              { candidate: "Eduardo Leite (PSD)", percent: 3 },
              { candidate: "Renan Santos (Missão)", percent: 3 },
            ]
          },
          {
            name: "Cenário com Caiado",
            results: [
              { candidate: "Lula (PT)", percent: 39 },
              { candidate: "Flávio Bolsonaro (PL)", percent: 33 },
              { candidate: "Romeu Zema (Novo)", percent: 5 },
              { candidate: "Ronaldo Caiado (PSD)", percent: 4 },
              { candidate: "Renan Santos (Missão)", percent: 3 },
            ]
          },
          {
            name: "Cenário com Tarcísio + Ratinho",
            results: [
              { candidate: "Lula (PT)", percent: 39 },
              { candidate: "Tarcísio de Freitas (Rep)", percent: 21 },
              { candidate: "Ratinho Jr (PSD)", percent: 11 },
              { candidate: "Romeu Zema (Novo)", percent: 5 },
              { candidate: "Renan Santos (Missão)", percent: 3 },
            ]
          },
          {
            name: "Com Haddad (sem Lula)",
            results: [
              { candidate: "Flávio Bolsonaro (PL)", percent: 33 },
              { candidate: "Fernando Haddad (PT)", percent: 21 },
              { candidate: "Ratinho Jr (PSD)", percent: 11 },
              { candidate: "Romeu Zema (Novo)", percent: 5 },
              { candidate: "Renan Santos (Missão)", percent: 4 },
            ]
          }
        ],
        secondRound: [
          { matchup: "Flávio vs Lula", candidate1: "Lula", percent1: 46, candidate2: "Flávio Bolsonaro", percent2: 43 },
          { matchup: "Tarcísio vs Lula", candidate1: "Lula", percent1: 45, candidate2: "Tarcísio", percent2: 42 },
          { matchup: "Caiado vs Lula", candidate1: "Lula", percent1: 46, candidate2: "Caiado", percent2: 36 },
          { matchup: "Flávio vs Haddad", candidate1: "Flávio Bolsonaro", percent1: 43, candidate2: "Haddad", percent2: 41 },
        ]
      },
      {
        institute: "Quaest/Genial Investimentos",
        date: "2026-03-11",
        sample: 2004,
        margin: 2,
        register: "Genial Investimentos",
        reliability: 5,
        method: "Presencial",
        scenarios: [
          {
            name: "Cenário com Ratinho e Zema",
            results: [
              { candidate: "Lula (PT)", percent: 37 },
              { candidate: "Flávio Bolsonaro (PL)", percent: 30 },
              { candidate: "Ratinho Jr (PSD)", percent: 7 },
              { candidate: "Romeu Zema (Novo)", percent: 3 },
              { candidate: "Renan Santos (Missão)", percent: 1 },
            ]
          },
          {
            name: "Cenário com Caiado e Zema",
            results: [
              { candidate: "Lula (PT)", percent: 39 },
              { candidate: "Flávio Bolsonaro (PL)", percent: 32 },
              { candidate: "Ronaldo Caiado (PSD)", percent: 4 },
              { candidate: "Romeu Zema (Novo)", percent: 2 },
              { candidate: "Renan Santos (Missão)", percent: 1 },
            ]
          },
          {
            name: "Cenário com Leite",
            results: [
              { candidate: "Lula (PT)", percent: 36 },
              { candidate: "Flávio Bolsonaro (PL)", percent: 35 },
              { candidate: "Eduardo Leite (PSD)", percent: 3 },
              { candidate: "Renan Santos (Missão)", percent: 2 },
            ]
          }
        ],
        secondRound: [
          { matchup: "Flávio vs Lula", candidate1: "Lula", percent1: 46, candidate2: "Flávio Bolsonaro", percent2: 42 },
        ]
      },
      {
        institute: "Gerp/AESP",
        date: "2026-03-27",
        sample: 2000,
        margin: 2.24,
        register: "AESP (Assoc. Emissoras SP)",
        reliability: 3,
        method: "Presencial",
        scenarios: [
          {
            name: "Cenário com Ratinho e Zema",
            results: [
              { candidate: "Lula (PT)", percent: 38 },
              { candidate: "Flávio Bolsonaro (PL)", percent: 36 },
              { candidate: "Ciro Gomes (PSDB)", percent: 7 },
              { candidate: "Ratinho Jr (PSD)", percent: 4 },
              { candidate: "Romeu Zema (Novo)", percent: 3 },
              { candidate: "Ronaldo Caiado (PSD)", percent: 3 },
              { candidate: "Renan Santos (Missão)", percent: 1 },
            ]
          },
          {
            name: "Cenário com Caiado e Zema",
            results: [
              { candidate: "Lula (PT)", percent: 38 },
              { candidate: "Flávio Bolsonaro (PL)", percent: 37 },
              { candidate: "Ciro Gomes (PSDB)", percent: 7 },
              { candidate: "Ronaldo Caiado (PSD)", percent: 5 },
              { candidate: "Romeu Zema (Novo)", percent: 5 },
              { candidate: "Renan Santos (Missão)", percent: 1 },
            ]
          },
          {
            name: "Empate numérico",
            results: [
              { candidate: "Flávio Bolsonaro (PL)", percent: 37 },
              { candidate: "Lula (PT)", percent: 37 },
              { candidate: "Ciro Gomes (PSDB)", percent: 7 },
              { candidate: "Ratinho Jr (PSD)", percent: 5 },
              { candidate: "Romeu Zema (Novo)", percent: 4 },
              { candidate: "Renan Santos (Missão)", percent: 1 },
            ]
          },
          {
            name: "Flávio lidera com Eduardo Leite",
            results: [
              { candidate: "Flávio Bolsonaro (PL)", percent: 40 },
              { candidate: "Lula (PT)", percent: 38 },
              { candidate: "Ciro Gomes (PSDB)", percent: 7 },
              { candidate: "Romeu Zema (Novo)", percent: 5 },
              { candidate: "Eduardo Leite (PSD)", percent: 3 },
              { candidate: "Renan Santos (Missão)", percent: 1 },
            ]
          }
        ],
        secondRound: [
          { matchup: "Flávio vs Lula", candidate1: "Flávio Bolsonaro", percent1: 48, candidate2: "Lula", percent2: 45 },
          { matchup: "Caiado vs Lula", candidate1: "Lula", percent1: 44, candidate2: "Caiado", percent2: 37 },
          { matchup: "Zema vs Lula", candidate1: "Lula", percent1: 45, candidate2: "Zema", percent2: 41 },
        ]
      },
      {
        institute: "Real Time Big Data/Record",
        date: "2026-03-03",
        sample: 2000,
        margin: 2,
        register: "Encomendada pela Record",
        reliability: 3,
        method: "Telefônica",
        scenarios: [
          {
            name: "Cenário com Ratinho Jr",
            results: [
              { candidate: "Lula (PT)", percent: 39 },
              { candidate: "Flávio Bolsonaro (PL)", percent: 32 },
              { candidate: "Ratinho Jr (PSD)", percent: 9 },
              { candidate: "Romeu Zema (Novo)", percent: 2 },
              { candidate: "Renan Santos (Missão)", percent: 2 },
            ]
          },
          {
            name: "Cenário com Eduardo Leite",
            results: [
              { candidate: "Lula (PT)", percent: 40 },
              { candidate: "Flávio Bolsonaro (PL)", percent: 34 },
              { candidate: "Eduardo Leite (PSD)", percent: 4 },
              { candidate: "Romeu Zema (Novo)", percent: 3 },
              { candidate: "Renan Santos (Missão)", percent: 2 },
            ]
          },
          {
            name: "Cenário com Caiado",
            results: [
              { candidate: "Lula (PT)", percent: 40 },
              { candidate: "Flávio Bolsonaro (PL)", percent: 33 },
              { candidate: "Ronaldo Caiado (PSD)", percent: 5 },
              { candidate: "Romeu Zema (Novo)", percent: 3 },
              { candidate: "Renan Santos (Missão)", percent: 2 },
            ]
          }
        ],
        secondRound: [
          { matchup: "Flávio vs Lula", candidate1: "Lula", percent1: 42, candidate2: "Flávio Bolsonaro", percent2: 41 },
          { matchup: "Ratinho vs Lula", candidate1: "Lula", percent1: 43, candidate2: "Ratinho Jr", percent2: 39 },
          { matchup: "Caiado vs Lula", candidate1: "Lula", percent1: 45, candidate2: "Caiado", percent2: 36 },
        ]
      }
    ],
    approvalData: {
      note: "Nexus/BTG Pactual (27-29/Mar/2026) + PoderData (21-23/Mar/2026): Avaliação do governo Lula",
      source: "Nexus/BTG Pactual via CNN Brasil + PoderData via Gazeta do Povo",
      date: "2026-03-30",
      results: {
        otimoBom: 35,
        regular: 21,
        ruimPessimo: 44,
        aprovacao: 45,
        desaprovacao: 51,
        nota: "Nexus: 35% positivo (20% ótimo + 15% bom), 44% negativo (8% ruim + 36% péssimo), 21% regular. Aprovação binária: 45% aprovam, 51% desaprovam. PoderData (semana anterior): 26% ótimo/bom, 51% ruim/péssimo, 61% desaprovação.",
      },
      historicalComparison: [
        { president: "FHC (2002)", approval6m: 38, disapproval6m: 21 },
        { president: "Lula (2006)", approval6m: 44, disapproval6m: 17 },
        { president: "Dilma (2014)", approval6m: 51, disapproval6m: 43 },
        { president: "Bolsonaro (2022)", approval6m: 29, disapproval6m: 50 },
        { president: "Lula (2026)", approval6m: 26, disapproval6m: 51 },
      ]
    },
    polymarketComparison: {
      note: "Comparação Pesquisas Nacionais vs Polymarket (dinheiro real)",
      candidates: [
        { name: "Lula", pesquisaRange: "37-46%", polymarket: "41.5%", tendenciaPesquisa: "Estável/leve queda. Nexus/BTG 41-42%, Paraná Pesq 41.3%, Gerp 38%, AtlasIntel 45.9%", tendenciaPolymarket: "↑ RETOMOU LIDERANÇA — 41.5% vs Flávio 40.0%" },
        { name: "Flávio Bolsonaro", pesquisaRange: "30-40%", polymarket: "39.45%", tendenciaPesquisa: "Subindo em pesquisas. Nexus/BTG 38-39%, Paraná Pesq 37.8%, Gerp 36-40%, AtlasIntel 40.1%", tendenciaPolymarket: "↓ Recua de 40.2% para 39.45% — contra-ataque Lula (Alckmin+reforma) teve efeito" },
        { name: "Renan Santos", pesquisaRange: "1-4.5%", polymarket: "5.5%", tendenciaPesquisa: "Baixo em pesquisas formais. Nexus/BTG 2-3%, Paraná Pesq 1.2%", tendenciaPolymarket: "↓ Leve recuo para 5.5% — voto protesto resiliente" },
        { name: "Ronaldo Caiado", pesquisaRange: "2-5%", polymarket: "2.55%", tendenciaPesquisa: "Nexus/BTG 4%, Paraná Pesq 3.6%. PSD lançou candidatura 30/Mar", tendenciaPolymarket: "Estável em 2.55% — mercado cético com 3ª via" },
        { name: "Tarcísio", pesquisaRange: "21-33%", polymarket: "1.0%", tendenciaPesquisa: "Só em cenários sem Flávio. 53% aprovação em SP (AtlasIntel)", tendenciaPolymarket: "Estável em 1.0% — foco na reeleição SP" },
        { name: "Romeu Zema", pesquisaRange: "2-6%", polymarket: "1.4%", tendenciaPesquisa: "Nexus/BTG 4-6%, Paraná Pesq 3.0%. 2° turno: perde de Lula 46x40 (Nexus)", tendenciaPolymarket: "↓ Recuo para 1.4%" },
        { name: "Fernando Haddad", pesquisaRange: "21-38% (sem Lula)", polymarket: "5.6%", tendenciaPesquisa: "Só como Plano B. Lula confirmou candidatura.", tendenciaPolymarket: "↑ Recupera para 5.6% — hedge de mercado apesar de Lula confirmado" },
      ]
    }
  };

  return NextResponse.json(data);
}
