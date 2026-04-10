import { defineConfig } from 'prisma/config'
import { config } from 'dotenv'

config({ path: '.env.local' })

export default defineConfig({
  earlyAccess: true,
  datasource: {
    url: process.env.DATABASE_URL!,
  },
  migrate: {
    url: process.env.DATABASE_URL_UNPOOLED!,
  },
})
