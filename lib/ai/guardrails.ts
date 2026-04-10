/**
 * LLM Guardrails — AFOS Analytics
 *
 * - Prompt injection detection (regex, deterministic)
 * - Risk assessment (input + output)
 * - Output classification (factual, inferred, opinative, experimental)
 * - Publication gate (experimental requires human review)
 */

import { createHash } from 'crypto'
import { prisma } from '../db'

// ─── Types ─────────────────────────────────────────────────────────

export interface RiskFlags {
  injectionDetected: boolean
  hallucinationRisk: 'low' | 'medium' | 'high'
  piiDetected: boolean
  contentTooLong: boolean
  requiresHumanReview: boolean
}

export type Classification = 'factual' | 'inferred' | 'opinative' | 'experimental'

// ─── Prompt injection detection ────────────────────────────────────

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|above|prior)\s+instructions/i,
  /you\s+are\s+now\s+/i,
  /\bsystem\s*:\s*/i,
  /<\|im_start\|>/i,
  /\[INST\]/i,
  /do\s+not\s+translate.*instead/i,
  /pretend\s+(you\s+are|to\s+be)/i,
  /disregard\s+(all|any|the)\s+(above|previous)/i,
]

export function detectInjection(input: string): boolean {
  return INJECTION_PATTERNS.some((p) => p.test(input))
}

// ─── Risk assessment ───────────────────────────────────────────────

export function assessRisk(input: string, output: string): RiskFlags {
  const inputLen = input.length || 1
  const outputLen = output.length

  return {
    injectionDetected: detectInjection(input),
    hallucinationRisk: outputLen > inputLen * 5 ? 'high' : outputLen > inputLen * 3 ? 'medium' : 'low',
    piiDetected: /\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/.test(output), // CPF
    contentTooLong: outputLen > 50_000,
    requiresHumanReview: true, // Sempre — nenhum output automático para produção
  }
}

// ─── Content hash ──────────────────────────────────────────────────

export function contentHash(text: string): string {
  return createHash('sha256').update(text).digest('hex').slice(0, 32)
}

// ─── Publication gate ──────────────────────────────────────────────

export async function canPublish(outputId: string): Promise<boolean> {
  if (!prisma) return false

  const output = await prisma.modelOutput.findUnique({
    where: { id: outputId },
    select: { classification: true, reviewStatus: true },
  })

  if (!output) return false
  if (output.classification === 'experimental' && output.reviewStatus !== 'approved') return false
  return true
}

// ─── Record model output ───────────────────────────────────────────

export function recordModelOutput(
  llmRunId: string,
  content: string,
  classification: Classification = 'experimental'
) {
  if (!prisma || !content.trim()) return

  prisma.modelOutput
    .create({
      data: {
        llmRunId,
        content: content.slice(0, 50_000),
        contentHash: contentHash(content),
        classification,
        reviewStatus: 'pending',
      },
    })
    .catch((err) => {
      console.warn('[guardrails] model_output write failed:', err instanceof Error ? err.message : err)
    })
}
