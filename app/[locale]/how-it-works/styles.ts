/**
 * Classes Tailwind compartilhadas entre content-pt-BR.tsx, content-en.tsx e content-es.tsx.
 *
 * Centralizar aqui mantém consistência visual nos 3 idiomas e reduz duplicação
 * (cada h2, th, td, etc. aparece 15-40 vezes por arquivo × 3 arquivos).
 */
export const S = {
  // Headings
  h2: 'text-2xl font-bold text-primary mt-12 mb-4 pb-2 border-b-2 border-blue-100',
  h3: 'text-lg font-bold text-gray-800 mt-7 mb-3',
  h3Anchor: 'text-lg font-bold text-gray-800 mt-10 mb-3 scroll-mt-20', // h3 com id (âncora)
  h4: 'text-base font-bold text-gray-700 mt-6 mb-3',

  // Paragraphs
  p: 'mb-4 text-gray-700',
  pTight: 'mb-3 text-gray-700',

  // Tables
  tableWrap: 'overflow-x-auto my-5',
  table: 'w-full bg-white rounded-lg shadow-sm text-sm border-collapse',
  th: 'bg-primary text-white px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide',
  td: 'px-4 py-3',
  tdTop: 'px-4 py-3 align-top',
  trRow: 'border-b border-gray-100',
  trAlt: 'border-b border-gray-100 bg-gray-50/50',

  // Blockquote
  quote: 'border-l-4 border-primary bg-blue-50 px-5 py-4 my-5 italic text-gray-700 text-sm rounded-r',

  // Lists
  ul: 'list-disc pl-6 mb-4 text-gray-700 space-y-2',
  ol: 'list-decimal pl-6 mb-4 text-gray-700 space-y-2',
}
