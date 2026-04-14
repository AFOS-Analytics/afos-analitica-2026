'use client';

import { useVisitorState } from '../hooks/useVisitorState';
import { useTranslation } from '../i18n/context';
import { SubscribeForm } from './SubscribeForm';

/**
 * Dashboard Gate — Blocks dashboard on 4th+ qualified session.
 *
 * Children always render (parallel data loading).
 * Gate overlay is a sibling portal-style div, NOT inside a relative parent.
 */

export function DashboardGate({ children }: { children: React.ReactNode }) {
  const { visitorId, state, loading, markSubscribed } = useVisitorState();
  const { t } = useTranslation();

  const showGate = !loading && state.eligible === 'gate';

  return (
    <>
      {/* Children always render — no wrapper div that breaks fixed positioning */}
      <div style={showGate ? { filter: 'blur(8px)', pointerEvents: 'none', userSelect: 'none' } : undefined} aria-hidden={showGate || undefined}>
        {children}
      </div>

      {/* Gate overlay — sibling element, fixed to viewport (not inside relative) */}
      {showGate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(4px)' }}>
          <div
            className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl bg-white my-auto"
            style={{ animation: 'afosSlideUp 0.4s ease-out' }}
          >
            <div className="h-1.5 bg-gradient-to-r from-primary to-blue-400" />
            <div className="px-6 py-8 sm:px-8">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0F52BA" strokeWidth="1.8">
                  <path d="M12 2a7 7 0 00-5.6 11.2L12 22l5.6-8.8A7 7 0 0012 2z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
              </div>
              <h2 className="text-dark font-bold text-xl text-center leading-snug mb-2">{t('gate.title')}</h2>
              <p className="text-gray-500 text-sm text-center leading-relaxed mb-5">{t('gate.description')}</p>
              <div className="flex flex-col gap-2 mb-6">
                {(['benefit1', 'benefit2', 'benefit3'] as const).map((key) => (
                  <div key={key} className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M5 13l4 4L19 7" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="text-sm text-dark">{t(`gate.${key}`)}</span>
                  </div>
                ))}
              </div>
              <SubscribeForm visitorId={visitorId} captureSource="gate" variant="gate" onSuccess={markSubscribed} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
