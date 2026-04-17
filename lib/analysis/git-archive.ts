/**
 * Arquivamento redundante em branch Git `archive` via GitHub Contents API.
 *
 * Zero custo: usa o próprio GitHub do projeto.
 * Fire-and-forget: não bloqueia persistência no Neon.
 * Se GITHUB_TOKEN não estiver configurado, pula silenciosamente.
 *
 * Path pattern: archive/{yyyy-mm-dd}/{tipo}.json
 * Ex: archive/2026-04-17/analysis-cards.json
 *
 * Branch `archive` é criada automaticamente a partir do `main` se não existir.
 * Mesmo dia re-commita (overwrite via sha) — últimos dados do dia ganham.
 */

const OWNER = process.env.GITHUB_ARCHIVE_OWNER || 'AFOS-Analytics'
const REPO = process.env.GITHUB_ARCHIVE_REPO || 'afos-analitica-2026'
const BRANCH = 'archive'
const API = 'https://api.github.com'

type ArchiveResult = { ok: boolean; url?: string; error?: string }

function authHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
}

async function ensureBranchExists(token: string): Promise<void> {
  const headers = authHeaders(token)
  const branchRes = await fetch(`${API}/repos/${OWNER}/${REPO}/git/refs/heads/${BRANCH}`, { headers })
  if (branchRes.ok) return

  const mainRes = await fetch(`${API}/repos/${OWNER}/${REPO}/git/refs/heads/main`, { headers })
  if (!mainRes.ok) throw new Error(`Cannot read main ref: ${mainRes.status}`)
  const mainRef = await mainRes.json()

  const createRes = await fetch(`${API}/repos/${OWNER}/${REPO}/git/refs`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ ref: `refs/heads/${BRANCH}`, sha: mainRef.object.sha }),
  })
  if (!createRes.ok && createRes.status !== 422) {
    throw new Error(`Cannot create ${BRANCH}: ${createRes.status} ${await createRes.text()}`)
  }
}

async function getExistingSha(path: string, token: string): Promise<string | undefined> {
  const res = await fetch(
    `${API}/repos/${OWNER}/${REPO}/contents/${path}?ref=${BRANCH}`,
    { headers: authHeaders(token) },
  )
  if (!res.ok) return undefined
  const data = await res.json()
  return data.sha
}

function deriveIsoDate(data: Record<string, unknown>): string {
  const updatedAt = data.updatedAt as string | undefined
  if (updatedAt && /^\d{2}\/\d{2}\/\d{4}/.test(updatedAt)) {
    return updatedAt.slice(0, 10).split('/').reverse().join('-')
  }
  return new Date().toISOString().slice(0, 10)
}

export async function archiveToGit(
  type: 'analysis-cards' | 'analysis-criteriosa',
  data: Record<string, unknown>,
): Promise<ArchiveResult> {
  const token = process.env.GITHUB_ARCHIVE_TOKEN
  if (!token) return { ok: false, error: 'GITHUB_ARCHIVE_TOKEN not configured' }

  try {
    await ensureBranchExists(token)

    const date = deriveIsoDate(data)
    const path = `archive/${date}/${type}.json`
    const content = Buffer.from(JSON.stringify(data, null, 2)).toString('base64')
    const sha = await getExistingSha(path, token)

    const body: Record<string, unknown> = {
      message: `archive: ${date} ${type}`,
      content,
      branch: BRANCH,
      committer: { name: 'AFOS Archive Bot', email: 'archive@afos-analytics.com' },
    }
    if (sha) body.sha = sha

    const res = await fetch(`${API}/repos/${OWNER}/${REPO}/contents/${path}`, {
      method: 'PUT',
      headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      return { ok: false, error: `${res.status} ${await res.text()}` }
    }
    const json = await res.json()
    return { ok: true, url: json.content?.html_url }
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err)
    return { ok: false, error }
  }
}
