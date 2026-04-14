'use client';

import { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';

// ─── Types ──────────────────────────────────────────────────────────

export type Eligible = 'free' | 'gate' | 'subscribed';

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
  qualifiedSessions: 0,
  popupDismissals: 0,
  subscribed: false,
  eligible: 'free',
  showPopup: false,
};

// ─── Visitor ID (cookie + localStorage) ─────────────────────────────

const COOKIE_NAME = 'afos_visitor_id';
const LS_KEY = 'afos_visitor_id';

function getVisitorId(): string {
  // Try cookie first
  if (typeof document !== 'undefined') {
    const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]+)`));
    if (match?.[1]) return match[1];
  }

  // Try localStorage
  try {
    const stored = localStorage.getItem(LS_KEY);
    if (stored) {
      setVisitorCookie(stored);
      return stored;
    }
  } catch {}

  // Generate new
  const id = crypto.randomUUID();
  setVisitorCookie(id);
  try { localStorage.setItem(LS_KEY, id); } catch {}
  return id;
}

function setVisitorCookie(id: string) {
  if (typeof document === 'undefined') return;
  const maxAge = 365 * 24 * 60 * 60;
  document.cookie = `${COOKIE_NAME}=${id}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

// ─── Context ────────────────────────────────────────────────────────

const VisitorStateContext = createContext<VisitorCtx | null>(null);

export function useVisitorState(): VisitorCtx {
  const ctx = useContext(VisitorStateContext);
  if (!ctx) throw new Error('useVisitorState must be used within VisitorStateProvider');
  return ctx;
}

// ─── Provider ───────────────────────────────────────────────────────

export function VisitorStateProvider({ children }: { children: React.ReactNode }) {
  const [visitorId] = useState(() => typeof window !== 'undefined' ? getVisitorId() : '');
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
      .then(data => {
        if (data?.ok) setState(data.state);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [visitorId]);

  // Track interaction (scroll or click)
  useEffect(() => {
    const onInteract = () => { hasInteraction.current = true; };
    window.addEventListener('scroll', onInteract, { passive: true, once: true });
    window.addEventListener('click', onInteract, { once: true });
    return () => {
      window.removeEventListener('scroll', onInteract);
      window.removeEventListener('click', onInteract);
    };
  }, []);

  // Register qualified session after 30s + interaction
  useEffect(() => {
    if (!visitorId || state.subscribed || sessionRegistered.current) return;

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime.current;
      if (elapsed >= 30_000 && hasInteraction.current && !sessionRegistered.current) {
        sessionRegistered.current = true;
        fetch('/api/visitor/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ visitorId, durationMs: elapsed, hasInteraction: true }),
        })
          .then(r => r.ok ? r.json() : null)
          .then(data => {
            if (data?.ok && data.state) setState(data.state);
          })
          .catch(() => {});
      }
    }, 5000); // Check every 5s

    return () => clearInterval(timer);
  }, [visitorId, state.subscribed]);

  // Check sessionStorage for popup dismiss in this session
  useEffect(() => {
    try {
      if (sessionStorage.getItem('afos_popup_dismissed') === '1') {
        setPopupDismissedThisSession(true);
      }
    } catch {}
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
      })
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (data?.ok) {
            setState(prev => ({ ...prev, popupDismissals: data.popupDismissals }));
          }
        })
        .catch(() => {});
    }
  }, [visitorId]);

  const markSubscribed = useCallback(() => {
    setState(prev => ({ ...prev, subscribed: true, eligible: 'subscribed', showPopup: false }));
    // Also set localStorage for backward compat with old popup
    try { localStorage.setItem('afos_popup_subscribed', 'true'); } catch {}
  }, []);

  return (
    <VisitorStateContext.Provider value={{ visitorId, state, loading, popupDismissedThisSession, dismissPopup, markSubscribed }}>
      {children}
    </VisitorStateContext.Provider>
  );
}
