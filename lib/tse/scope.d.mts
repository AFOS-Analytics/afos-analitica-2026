export type PollScope = 'national' | 'state' | 'unknown'
export type ScopeSource = 'methodology' | 'sampling_plan' | 'dado_municipio' | 'none'

export function classifyScope(
  methodology: string,
  samplingPlan: string,
  dadoMunicipio?: string,
): { scope: PollScope; source: ScopeSource }

export function detectScope(
  methodology: string,
  samplingPlan: string,
  dadoMunicipio?: string,
): PollScope
