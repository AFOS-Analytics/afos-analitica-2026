/**
 * Glossário Central de Termos — AFOS Analytics
 *
 * Padroniza termos-chave entre pt-BR, en e es.
 * Source of truth: pt-BR (idioma primário do produto).
 *
 * Regras:
 * - Termos de marca NUNCA são traduzidos (AFOS Analytics, Polymarket)
 * - Termos técnicos mantêm consistência em cada idioma
 * - Nomes próprios, siglas e acrônimos permanecem iguais
 * - Odds, dashboard, open source são termos globais (não traduzir)
 *
 * Fluxo editorial:
 * 1. Escrever conteúdo em pt-BR (source of truth)
 * 2. Traduzir para en e es usando este glossário como referência
 * 3. Validar termos antes de publicar
 */

export const GLOSSARY = {
  // ─── Marca (nunca traduzir) ─────────────────────────────────────
  brand: {
    'pt-BR': 'AFOS Analytics',
    en: 'AFOS Analytics',
    es: 'AFOS Analytics',
  },
  polymarket: {
    'pt-BR': 'Polymarket',
    en: 'Polymarket',
    es: 'Polymarket',
  },
  openSource: {
    'pt-BR': 'Open Source',
    en: 'Open Source',
    es: 'Open Source',
  },
  dashboard: {
    'pt-BR': 'Dashboard',
    en: 'Dashboard',
    es: 'Dashboard',
  },

  // ─── Conceitos centrais ─────────────────────────────────────────
  predictionMarkets: {
    'pt-BR': 'mercados de previsão',
    en: 'prediction markets',
    es: 'mercados de predicción',
  },
  realMoney: {
    'pt-BR': 'dinheiro real',
    en: 'real money',
    es: 'dinero real',
  },
  electionIntelligence: {
    'pt-BR': 'inteligência eleitoral',
    en: 'election intelligence',
    es: 'inteligencia electoral',
  },
  politicalRisk: {
    'pt-BR': 'risco político',
    en: 'political risk',
    es: 'riesgo político',
  },
  odds: {
    'pt-BR': 'odds',
    en: 'odds',
    es: 'odds',
  },
  electionPolls: {
    'pt-BR': 'pesquisas eleitorais',
    en: 'election polls',
    es: 'encuestas electorales',
  },
  publicSentiment: {
    'pt-BR': 'sentimento popular',
    en: 'public sentiment',
    es: 'sentimiento popular',
  },
  socialSentiment: {
    'pt-BR': 'sentimento das redes sociais',
    en: 'social media sentiment',
    es: 'sentimiento de redes sociales',
  },
  marketSignals: {
    'pt-BR': 'sinais de mercado',
    en: 'market signals',
    es: 'señales de mercado',
  },

  // ─── Termos eleitorais ──────────────────────────────────────────
  firstRound: {
    'pt-BR': '1º turno',
    en: 'first round',
    es: 'primera vuelta',
  },
  secondRound: {
    'pt-BR': '2º turno',
    en: 'runoff',
    es: 'segunda vuelta',
  },
  candidate: {
    'pt-BR': 'candidato',
    en: 'candidate',
    es: 'candidato',
  },
  impeachment: {
    'pt-BR': 'impeachment',
    en: 'impeachment',
    es: 'impeachment',
  },
  approval: {
    'pt-BR': 'aprovação',
    en: 'approval',
    es: 'aprobación',
  },
  rejection: {
    'pt-BR': 'rejeição',
    en: 'rejection',
    es: 'rechazo',
  },

  // ─── Termos técnicos/financeiros ────────────────────────────────
  volume: {
    'pt-BR': 'volume',
    en: 'volume',
    es: 'volumen',
  },
  probability: {
    'pt-BR': 'probabilidade',
    en: 'probability',
    es: 'probabilidad',
  },
  inflation: {
    'pt-BR': 'inflação',
    en: 'inflation',
    es: 'inflación',
  },
  volatility: {
    'pt-BR': 'volatilidade',
    en: 'volatility',
    es: 'volatilidad',
  },

  // ─── Instituições brasileiras (nunca traduzir) ──────────────────
  stf: {
    'pt-BR': 'STF',
    en: 'STF',
    es: 'STF',
  },
  inss: {
    'pt-BR': 'INSS',
    en: 'INSS',
    es: 'INSS',
  },
  tse: {
    'pt-BR': 'TSE',
    en: 'TSE',
    es: 'TSE',
  },

  // ─── Plataforma ─────────────────────────────────────────────────
  realTime: {
    'pt-BR': 'em tempo real',
    en: 'in real time',
    es: 'en tiempo real',
  },
  liveData: {
    'pt-BR': 'dados ao vivo',
    en: 'live data',
    es: 'datos en vivo',
  },
  freeAccess: {
    'pt-BR': 'acesso gratuito',
    en: 'free access',
    es: 'acceso gratuito',
  },
} as const;

export type GlossaryKey = keyof typeof GLOSSARY;

// Usa tipo Locale de config.ts (fonte única)
import type { Locale } from './config';

/** Busca termo do glossário por chave e locale. Retorna chave se não encontrar. */
export function term(key: string, locale: Locale): string {
  const entry = GLOSSARY[key as GlossaryKey];
  if (!entry) return key;
  return entry[locale] || entry['pt-BR'] || key;
}
