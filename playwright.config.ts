import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 1,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    // Idioma FIXO. Sem isto o Chromium anuncia en-US, a negociacao manda o
    // visitante para /en (que e o comportamento correto depois do conserto de
    // 19/Ago) e os casos de rota em pt-BR falhariam por motivo errado. Teste de
    // i18n tem de declarar o idioma que testa.
    extraHTTPHeaders: { 'Accept-Language': 'pt-BR,pt;q=0.9' },
  },
  webServer: {
    // No CI sobe o servidor de PRODUCAO: e o que o leitor recebe, e o modo de
    // desenvolvimento tem outro comportamento de cache e de pagina de erro.
    command: process.env.CI ? 'npm start' : 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
