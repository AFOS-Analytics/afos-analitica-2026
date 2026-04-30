// Localized month names. Centralized here to avoid duplication across
// DailyHeroCard.tsx, AfosDailyTemplate.tsx and translate-afos-daily.ts.
// All arrays are 0-indexed (January = 0, December = 11) to match the
// JavaScript Date API, even though the script accepts MM 1-12 inputs
// (consumers must subtract 1 before indexing).

export const MONTHS = {
  'pt-BR': ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  es: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
} as const

export type MonthsLocale = keyof typeof MONTHS
