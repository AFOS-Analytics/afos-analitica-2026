/** /llms.es.txt — Spanish variant of the AI manifest. See lib/llms/llms-txt.ts. */
import { buildLlmsTxt, llmsResponse } from '../../lib/llms/llms-txt'

export const dynamic = 'force-static'
export const revalidate = 3600

export function GET() {
  return llmsResponse(buildLlmsTxt('es'))
}
