# Contributing to AFOS Analytics

Thank you for your interest in contributing to AFOS Analytics! This document explains how to get started.

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- A Neon Postgres database ([console.neon.tech](https://console.neon.tech))
- An Upstash Redis instance ([console.upstash.com](https://console.upstash.com))

### Local Setup

```bash
git clone https://github.com/AFOS-Analytics/afos-analitica-2026.git
cd afos-analitica-2026
npm install
cp .env.example .env.local
# Fill in your env vars (see .env.example for details)
npx prisma migrate dev
npx tsx scripts/seed-dev.ts
npm run dev
```

The app runs at `http://localhost:3000`.

### Environment Variables

See `.env.example` for all required and optional variables. At minimum you need:
- `DATABASE_URL` — Neon Postgres (pooled)
- `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` — Redis cache

## How to Contribute

### Reporting Bugs

1. Check if the issue already exists in [GitHub Issues](https://github.com/AFOS-Analytics/afos-analitica-2026/issues)
2. Open a new issue using the **Bug Report** template
3. Include: what happened, what you expected, steps to reproduce

### Suggesting Features

1. Open an issue using the **Feature Request** template
2. Explain what you want and why it would be useful

### Submitting Code

1. Fork the repository
2. Create a branch from `main` (`git checkout -b feat/your-feature`)
3. Make your changes
4. Run `npm run build` to verify the build passes
5. Commit with a clear message (see conventions below)
6. Open a Pull Request against `main`

### Adding a New Country

One of the most impactful contributions is adding election data for a new country:

1. Add the country's prediction market mapping in `lib/polymarket/country-market-map.ts`
2. Add country metadata in `lib/seo/countries.ts`
3. Create translation keys in `messages/` (pt-BR, en, es)
4. Add the country page route in `app/[locale]/country/`
5. Open a PR with the country name in the title

### Adding a New Data Source

To add a new polling institute or prediction market:

1. Create the client in `lib/` (follow the pattern in `lib/polymarket/client.ts`)
2. Add normalize and persist functions
3. Connect to the cron pipeline if needed
4. Document the source in your PR

## Code Conventions

- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Validation**: Zod schemas for all inputs
- **Database**: Prisma ORM, snake_case in DB, camelCase in code
- **Commits**: Use conventional format — `feat:`, `fix:`, `docs:`, `chore:`, `security:`
- **No secrets**: Never commit API keys, tokens, or passwords

## Project Structure

```
app/           — Next.js App Router (pages, API routes, components)
lib/           — Core libraries (polymarket, tse, email, cache, db)
prisma/        — Database schema and migrations
messages/      — i18n translation files (pt-BR, en, es)
public/        — Static assets (flags, geo data)
docs/          — Documentation (DATABASE.md, LGPD.md, OPERATIONS.md)
```

## Questions?

Open an issue with the `question` label or start a discussion.

## License

By contributing, you agree that your contributions will be licensed under the [Apache License 2.0](LICENSE).
