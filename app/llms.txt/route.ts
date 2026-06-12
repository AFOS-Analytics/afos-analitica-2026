/**
 * /llms.txt — canonical English manifest for AI engines (ChatGPT, Perplexity,
 * Claude, Gemini). Emerging standard, analogous to robots.txt but for LLMs.
 *
 * Locale variants: /llms.pt-BR.txt and /llms.es.txt (same structure, prose and
 * content links in the respective language). All three share lib/llms/llms-txt.ts
 * and auto-update as new dailies/tradeoffs are published.
 */

import { buildLlmsTxt, llmsResponse } from '../../lib/llms/llms-txt'

export const dynamic = 'force-static'
export const revalidate = 3600

export function GET() {
  return llmsResponse(buildLlmsTxt('en'))
}
