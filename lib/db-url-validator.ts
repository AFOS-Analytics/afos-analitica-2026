/**
 * Hardening helper for DATABASE_URL.
 *
 * History: a literal `\n` was once embedded in `.env.local` (escape leak from
 * Vercel CLI). Plain `if (!url)` did not catch it; Prisma + Neon adapter
 * silently hung on connect. This validator fail-closes early with a readable
 * message, before any query is attempted.
 */

/** Mask password in URL-shaped strings so errors can be logged without leaks. */
function mask(url: string): string {
  return url.replace(/^(postgres(?:ql)?:\/\/[^:@]+):[^@]+(@)/, '$1:***$2').slice(0, 80);
}

export function assertDatabaseUrl(url: string | undefined, varName = 'DATABASE_URL'): asserts url is string {
  if (!url) throw new Error(`${varName} is not set`);
  if (/\\[nrt]/.test(url)) throw new Error(`${varName} contains a literal escape sequence (\\n, \\r, or \\t). Check .env.local for escape leak.`);
  if (/\s/.test(url)) throw new Error(`${varName} contains whitespace. Strip surrounding quotes or trailing newlines.`);
  if (/^['"].*['"]$/.test(url)) throw new Error(`${varName} is wrapped in quotes. dotenv strips outer quotes — do not double-quote in .env.`);
  if (!/^postgres(?:ql)?:\/\//.test(url)) throw new Error(`${varName} must start with postgresql:// or postgres://. Got: ${mask(url)}`);
  try { new URL(url); } catch (e) {
    throw new Error(`${varName} is not a valid URL (${mask(url)}): ${(e as Error).message}`);
  }
}
