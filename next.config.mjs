import bundleAnalyzer from '@next/bundle-analyzer';

const isDev = process.env.NODE_ENV === 'development';
const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === 'true' });

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  compress: true,

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // OWASP A05:2021 - Security Misconfiguration
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '0' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
          // OWASP A02:2021 - Cryptographic Failures
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          // Content-Language is set dynamically per-locale via middleware.ts,
          // not hardcoded here (would conflict with /en, /es routes).
          // Content Security Policy
          // Em dev, unsafe-eval é necessário para React Fast Refresh (HMR).
          // NOTA (EVAL 02/Jul): script-src mantém 'unsafe-inline' de propósito.
          // CSP com nonce por-request é INCOMPATÍVEL com static generation: o HTML
          // das páginas SSG (daily, país, about, glossary, how-it-works…) é gerado no
          // build, mas o nonce seria novo a cada request → mismatch → o CSP bloquearia
          // os próprios scripts do Next nas estáticas (hidratação morta). Além disso,
          // não há sink de XSS ativo (react-markdown SEM rehype-raw; os únicos scripts
          // inline são JSON-LD estático de dados). object-src/base-uri/frame-ancestors
          // já fecham as vias de injeção que importam.
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              isDev ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'" : "script-src 'self' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob:",
              "font-src 'self'",
              "connect-src 'self' https://gamma-api.polymarket.com https://news.google.com https://api.firecrawl.dev https://*.upstash.io" + (isDev ? " ws://localhost:*" : ""),
              "object-src 'none'",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
      {
        // API routes get additional security headers + noindex (não devem ser
        // descobertas por buscadores; OG image é exceção via headers próprios).
        source: '/api/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        // Alias de marca → dataset público no Hugging Face.
        // 307 (permanent: false) de propósito: destino trocável sem cache duro.
        source: '/dataset',
        destination: 'https://huggingface.co/datasets/AFOS-Analytics1/brazil-2026-electoral-divergence',
        permanent: false,
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
