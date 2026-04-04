import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'AFOS Analytics — Eleições Presidenciais Brasil 2026';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0F52BA 0%, #0a3d8f 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          color: 'white',
          padding: '60px',
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 800, letterSpacing: '-2px', marginBottom: 16, display: 'flex' }}>
          AFOS Analytics
        </div>
        <div style={{ fontSize: 32, opacity: 0.9, textAlign: 'center', maxWidth: 900, lineHeight: 1.4, display: 'flex' }}>
          Plataforma de Inteligência Eleitoral
        </div>
        <div style={{ fontSize: 24, opacity: 0.7, marginTop: 24, display: 'flex', gap: 24 }}>
          <span>📊 Polymarket</span>
          <span>📋 17 Institutos</span>
          <span>📰 Notícias ao Vivo</span>
          <span>🔬 Análises</span>
        </div>
        <div style={{ fontSize: 28, marginTop: 40, fontWeight: 700, display: 'flex' }}>
          Eleições Presidenciais Brasil 2026
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            fontSize: 18,
            opacity: 0.5,
            display: 'flex',
          }}
        >
          afos-analitica-2026.vercel.app
        </div>
      </div>
    ),
    { ...size }
  );
}
