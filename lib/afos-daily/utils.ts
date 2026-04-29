/**
 * Strips markdown formatting from a string for plain-text contexts
 * (RSS descriptions, llms.txt entries, JSON-LD descriptions, OG tags).
 *
 * Removes: bold (**...**), inline links ([text](url) → text), and
 * collapses any whitespace runs to a single space.
 */
export function cleanMarkdownText(s: string): string {
  return s
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
}
