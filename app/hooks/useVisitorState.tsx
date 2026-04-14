'use client';

import { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { getOrCreateVisitorId } from '../../lib/visitor/id';
import { SUBSCRIBED_LS_KEY, POPUP_SHOW_DELAY_MS } from '../../lib/visitor/constants';
import type { Eligible } from '../../lib/visitor/constants';

// ─── Types ──────────────────────────────────────────────────────────

export type { Eligible };

export interface VisitorState {
  qualifiedSessions: number;
  popupDismissals: number;
  subscribed: boolean;
  eligible: Eligible;
  showPopup: boolean;
}

interface VisitorCtx {
  visitorId: string;
  state: VisitorState;
  loading: boolean;
  popupDismissedThisSession: boolean;
  dismissPopup: () => void;
  markSubscribed: () => void;
}

const DEFAULT_STATE: VisitorState = {
  qualifiedSessions: 0, popupDismissals: 0, subscribed: false, eligible: 'free', showPopup: false,
};

const VisitorStateContext = createContext<VisitorCtx | null>(null);

export function useVisitorState(): VisitorCtx {
  const ctx = useContext(VisitorStateContext);
  if (!ctx) throw new Error('useVisitorState must be used within VisitorStateProvider');
  return ctx;
}

// ─── Provider ───────────────────────────────────────────────────────

export function VisitorStateProvider({ children }: { children: React.ReactNode }) {
  const [visitorId] = useState(() => typeof window !== 'undefined' ? getOrCreateVisitorId() : '');
  const [state, setState] = useState<VisitorState>(DEFAULT_STATE);
  const [loading, setLoading] = useState(true);
  const [popupDismissedThisSession, setPopupDismissedThisSession] = useState(false);
  const sessionRegistered = useRef(false);
  const startTime = useRef(Date.now());
  const hasInteraction = useRef(false);

  // Fetch state from backend
  useEffect(() => {
    if (!visitorId) return;
    fetch('/api/visitor/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitorId }),
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.ok) setState(data.state); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [visitorId]);

  // Track interaction (scroll or click — once)
  useEffect(() => {
    const onInteract = () => { hasInteraction.current = true; };
    window.addEventListener('scroll', onInteract, { passive: true, once: true });
    window.addEventListener('click', onInteract, { once: true });
    return () => {
      window.removeEventListener('scroll', onInteract);
      window.removeEventListener('click', onInteract);
    };
  }, []);

  // Register qualified session (30s + interaction, single attempt)
  useEffect(() => {
    if (!visitorId || state.subscribed || sessionRegistered.current) return;

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime.current;
      if (elapsed >= POPUP_SHOW_DELAY_MS && hasInteraction.current && !sessionRegistered.current) {
        sessionRegistered.current = true;
        clearInterval(timer);
        fetch('/api/visitor/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ visitorId, durationMs: Math.min(elapsed, 86_400_000), hasInteraction: true }),
        })
          .then(r => r.ok ? r.json() : null)
          .then(data => { if (data?.ok && data.state) setState(data.state); })
          .catch(() => { sessionRegistered.current = false; });
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [visitorId, state.subscribed]);

  // Check sessionStorage for popup dismiss
  useEffect(() => {
    try { if (sessionStorage.getItem('afos_popup_dismissed') === '1') setPopupDismissedThisSession(true); } catch {}
  }, []);

  const dismissPopup = useCallback(() => {
    setPopupDismissedThisSession(true);
    try { sessionStorage.setItem('afos_popup_dismissed', '1'); } catch {}
    setState(prev => ({ ...prev, showPopup: false }));

    if (visitorId) {
      fetch('/api/visitor/dismiss', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitorId }),
      }).then(r => r.ok ? r.json() : null)
        .then(data => { if (data?.ok) setState(prev => ({ ...prev, popupDismissals: data.popupDismissals })); })
        .catch(() => {});
    }
  }, [visitorId]);

  const markSubscribed = useCallback(() => {
    setState(prev => ({ ...prev, subscribed: true, eligible: 'subscribed', showPopup: false }));
    try { localStorage.setItem(SUBSCRIBED_LS_KEY, 'true'); } catch {}
  }, []);

  return (
    <VisitorStateContext.Provider value={{ visitorId, state, loading, popupDismissedThisSession, dismissPopup, markSubscribed }}>
      {children}
    </VisitorStateContext.Provider>
  );
}
