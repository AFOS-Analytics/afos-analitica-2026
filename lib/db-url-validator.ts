/**
 * Hardening helper for DATABASE_URL.
 *
 * History: a literal `\n` was once embedded in `.env.local` (escape leak from
 * Vercel CLI). Plain `if (!url)` did not catch it; Prisma + Neon adapter
 * silently hung on connect. This validator fail-closes early with a readable
 * message, before any query is attempted.
 */

const ALLOWED_PREFIXES = ['postgresql://', 'postgres://'] as const;

export function assertDatabaseUrl(url: string | undefined, varName = 'DATABASE_URL'): asserts url is string {
  if (!url) {
    throw new Error(`${varName} is not set`);
  }
  if (url.includes('\\n') || url.includes('\\r')) {
    throw new Error(`${varName} contains literal escape sequence (\\n or \\r). Check .env.local for trailing escape leak.`);
  }
  if (/\s/.test(url)) {
    throw new Error(`${varName} contains whitespace. Strip surrounding quotes or trailing newlines.`);
  }
  if ((url.startsWith('"') && url.endsWith('"')) || (url.startsWith("'") && url.endsWith("'"))) {
    throw new Error(`${varName} is wrapped in quotes. dotenv strips outer quotes — do not double-quote in .env.`);
  }
  if (!ALLOWED_PREFIXES.some((p) => url.startsWith(p))) {
    throw new Error(`${varName} must start with postgresql:// or postgres://. Got: ${url.slice(0, 20)}…`);
  }
  try {
    new URL(url);
  } catch (e) {
    throw new Error(`${varName} is not a valid URL: ${(e as Error).message}`);
  }
}
