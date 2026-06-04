/**
 * Classes Tailwind compartilhadas entre content-pt-BR.tsx, content-en.tsx e content-es.tsx.
 *
 * Centralizar aqui mantém consistência visual nos 3 idiomas e reduz duplicação
 * (cada h2, th, td, etc. aparece 15-40 vezes por arquivo × 3 arquivos).
 */
export const S = {
  // Headings
  h2: 'text-2xl font-bold text-primary dark:text-white mt-12 mb-4 pb-2 border-b-2 border-blue-100 dark:border-blue-400/40 scroll-mt-24',
  h3: 'text-lg font-bold text-gray-800 dark:text-blue-50 mt-7 mb-3',
  h3Anchor: 'text-lg font-bold text-gray-800 dark:text-blue-50 mt-10 mb-3 scroll-mt-24', // h3 com id (âncora)
  h4: 'text-base font-bold text-gray-700 dark:text-blue-100 mt-6 mb-3',

  // Paragraphs
  p: 'mb-4 text-gray-700 dark:text-blue-50',
  pTight: 'mb-3 text-gray-700 dark:text-blue-50',

  // Tables
  tableWrap: 'overflow-x-auto my-5',
  table: 'w-full bg-white dark:bg-blue-900/40 rounded-lg shadow-sm text-sm border-collapse',
  th: 'bg-primary dark:bg-yellow-400 text-white dark:text-blue-950 px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide',
  td: 'px-4 py-3 dark:text-blue-50',
  tdTop: 'px-4 py-3 align-top dark:text-blue-50',
  trRow: 'border-b border-gray-100 dark:border-blue-800',
  trAlt: 'border-b border-gray-100 dark:border-blue-800 bg-gray-50/50 dark:bg-blue-900/30',

  // Blockquote
  quote: 'border-l-4 border-primary dark:border-amber-300 bg-blue-50 dark:bg-blue-900/40 px-5 py-4 my-5 italic text-gray-700 dark:text-blue-50 text-sm rounded-r',

  // Lists
  ul: 'list-disc pl-6 mb-4 text-gray-700 dark:text-blue-50 space-y-2',
  ol: 'list-decimal pl-6 mb-4 text-gray-700 dark:text-blue-50 space-y-2',
}
