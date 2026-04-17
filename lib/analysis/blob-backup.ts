/**
 * Backup redundante de snapshots de análise no Vercel Blob.
 *
 * Fire-and-forget: não bloqueia persistência no Neon.
 * Se BLOB_READ_WRITE_TOKEN não estiver configurado, pula silenciosamente.
 *
 * Path pattern: analysis-archive/{tipo}/{yyyy-mm-dd}.json
 * Ex: analysis-archive/analysis-cards/2026-04-17.json
 */

export async function backupToBlob(
  type: 'analysis-cards' | 'analysis-criteriosa',
  data: Record<string, unknown>,
): Promise<{ ok: boolean; url?: string; error?: string }> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return { ok: false, error: 'BLOB_READ_WRITE_TOKEN not configured' }
  }

  try {
    const { put } = await import('@vercel/blob')

    const updatedAt = (data.updatedAt as string) || new Date().toISOString()
    const iso = updatedAt.includes('/')
      ? updatedAt.slice(0, 10).split('/').reverse().join('-')
      : updatedAt.slice(0, 10)

    const path = `analysis-archive/${type}/${iso}.json`

    const blob = await put(path, JSON.stringify(data, null, 2), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
    })

    return { ok: true, url: blob.url }
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err)
    return { ok: false, error }
  }
}
