import type { Metadata, Viewport } from "next";
import "./globals.css";

const inter = { className: "font-sans" };

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://afos-analitica-2026.vercel.app'),
  title: "AFOS Analytics — Eleições Presidenciais Brasil 2026",
  description: "Dashboard de inteligência eleitoral com pesquisas de +17 institutos, Polymarket, notícias ao vivo e análises estratégicas das eleições presidenciais do Brasil 2026.",
  openGraph: {
    title: "AFOS Analytics — Eleições Presidenciais Brasil 2026",
    description: "Plataforma de inteligência eleitoral: Polymarket + pesquisas + notícias + análises em tempo real.",
    url: "https://afos-analitica-2026.vercel.app",
    siteName: "AFOS Analytics",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AFOS Analytics — Eleições 2026",
    description: "Dashboard eleitoral: Polymarket + 17 institutos de pesquisa + notícias ao vivo.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=2" />
        <link rel="shortcut icon" href="/favicon.svg?v=2" />
        <link rel="apple-touch-icon" href="/favicon.svg?v=2" />
      </head>
      <body className={`${inter.className} bg-white text-[#1a1a1a] antialiased`}>{children}</body>
    </html>
  );
}
