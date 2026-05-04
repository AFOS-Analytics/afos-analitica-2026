/**
 * Hardening helper for DATABASE_URL.
 *
 * History: a literal `\n` was once embedded in `.env.local` (escape leak from
 * Vercel CLI). Plain `if (!url)` did not catch it; Prisma + Neon adapter
 * silently hung on connect. This validator fail-closes early with a readable
 * message, before any query is attempted.
 */

const ALLOWED_PREFIXES = ['postgresql://', 'postgres://'] as const;

/**
 * Mask a connection-string-shaped value so error messages can include enough
 * context to debug without leaking the password to logs/Sentry/CI.
 * `postgresql://user:secret@host/db` → `postgresql://user:***@host/db`.
 * Falls back to first 12 chars + `…` if the URL doesn't parse.
 */
function maskUrl(url: string): string {
  const m = url.match(/^(postgres(?:ql)?:\/\/[^:@]+):[^@]+(@.+)$/);
  if (m) return `${m[1]}:***${m[2]}`;
  return url.slice(0, 12) + '…';
}

export function assertDatabaseUrl(url: string | undefined, varName = 'DATABASE_URL'): asserts url is string {
  if (!url) {
    throw new Error(`${varName} is not set`);
  }
  // Catches literal `\n`, `\r`, `\t` from escape leaks (e.g. Vercel CLI export).
  if (/\\[nrt]/.test(url)) {
    throw new Error(`${varName} contains a literal escape sequence (\\n, \\r, or \\t). Check .env.local for trailing escape leak.`);
  }
  if (/\s/.test(url)) {
    throw new Error(`${varName} contains whitespace (space, tab, or newline). Strip surrounding quotes or trailing newlines.`);
  }
  if ((url.startsWith('"') && url.endsWith('"')) || (url.startsWith("'") && url.endsWith("'"))) {
    throw new Error(`${varName} is wrapped in quotes. dotenv strips outer quotes — do not double-quote in .env.`);
  }
  if (!ALLOWED_PREFIXES.some((p) => url.startsWith(p))) {
    throw new Error(`${varName} must start with postgresql:// or postgres://. Got: ${maskUrl(url)}`);
  }
  try {
    new URL(url);
  } catch (e) {
    throw new Error(`${varName} is not a valid URL (${maskUrl(url)}): ${(e as Error).message}`);
  }
}
