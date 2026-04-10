import { defineConfig } from 'prisma/config'
import { config } from 'dotenv'

// Prisma CLI não carrega .env.local — forçar load
config({ path: '.env.local' })

export default defineConfig({
  earlyAccess: true,
  datasource: {
    // Pooled — runtime serverless
    url: process.env.DATABASE_URL!,
  },
  migrate: {
    // Unpooled (direct) — migrations/admin
    url: process.env.DIRECT_DATABASE_URL!,
  },
})
