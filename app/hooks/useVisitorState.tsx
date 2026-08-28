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

/**
 * 🔴 O FUNIL NAO PODE FALHAR PARA DESLIGADO EM SILENCIO.
 *
 * Medido em 28/Ago/2026. O `DEFAULT_STATE` tem `showPopup: false`, e TRES
 * caminhos do cliente caiam nele sem log e sem retentativa: `visitorId` vazio,
 * resposta nao-ok (503 do banco, 400 de id invalido, 429 do limite de taxa) e
 * erro de rede ou estouro do timeout de 3s.
 *
 * Em qualquer um deles o popup E o portao simplesmente nao existiam, numa
 * pagina que parecia perfeitamente normal. E popup + portao produziram **62%
 * de todos os leads da base** (18 de 29 medidos em 28/Ago), entao a falha
 * silenciosa apagava a maior parte da captacao sem deixar rastro.
 *
 * ⭐ A REGRA: o popup e a OPORTUNIDADE de captura e deve falhar para LIGADO; o
 * portao BLOQUEIA e deve falhar para ABERTO. Estado desconhecido nunca barra
 * ninguem, e nunca some com a chance de captar.
 */
const CONTINGENCIA_LS_KEY = 'afos_popup_dismissals';
const MAX_DISMISSALS_CONTINGENCIA = 3;

function estadoDeContingencia(): VisitorState {
  // Respeita o teto de descartes mesmo sem o servidor, lendo o espelho local.
  let descartes = 0;
  try { descartes = parseInt(localStorage.getItem(CONTINGENCIA_LS_KEY) || '0', 10) || 0; } catch {}
  return {
    ...DEFAULT_STATE,
    popupDismissals: descartes,
    showPopup: descartes < MAX_DISMISSALS_CONTINGENCIA,
    eligible: 'free', // ⛔ NUNCA 'gate' sem estado confirmado: nao se bloqueia no escuro.
  };
}

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

  // Fetch state from backend (3s timeout, fallback to free on error)
  // Also sync old localStorage subscribers → backend (one-time migration)
  useEffect(() => {
    if (!visitorId) {
      // 🔴 Este caminho tambem apagava o funil em silencio. Sem id nao ha estado
      // de servidor, mas isso NAO e motivo para deixar de oferecer o cadastro.
      console.warn('[visitor] sem visitorId, seguindo em contingencia')
      setState(estadoDeContingencia());
      setLoading(false);
      return;
    }

    // Check if user was subscribed via the OLD popup system (pre-migration)
    let wasOldSubscriber = false;
    try { wasOldSubscriber = localStorage.getItem(SUBSCRIBED_LS_KEY) === 'true'; } catch {}

    // Uma retentativa, com folga maior: banco frio mais lambda fria passam de
    // 3s com facilidade, e perder o funil por lentidao e caro demais.
    async function buscarEstado(): Promise<{ ok?: boolean; state?: VisitorState } | null> {
      for (const ms of [3000, 5000]) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), ms);
        try {
          const r = await fetch('/api/visitor/state', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ visitorId }),
            signal: controller.signal,
          });
          if (r.ok) return await r.json();
        } catch {}
        finally { clearTimeout(timeout); }
      }
      return null;
    }

    buscarEstado()
      .then(data => {
        if (!data?.ok || !data.state) {
          // 🔴 Aqui morava o defeito: `return` seco deixava o estado no padrao,
          // com showPopup false, e o funil sumia calado.
          if (wasOldSubscriber) {
            setState(prev => ({ ...prev, subscribed: true, eligible: 'subscribed', showPopup: false }));
          } else {
            console.warn('[visitor] estado indisponivel, seguindo em contingencia (popup ligado, portao aberto)');
            setState(estadoDeContingencia());
          }
          return;
        }

        // If old subscriber but backend doesn't know → migrate to new system
        if (wasOldSubscriber && !data.state.subscribed) {
          fetch('/api/visitor/migrate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ visitorId }),
          }).catch(() => {});

          // Immediately update local state to prevent popup/gate
          setState({ ...data.state, subscribed: true, eligible: 'subscribed', showPopup: false });
          return;
        }

        setState(data.state);
      })
      .catch(() => {
        if (wasOldSubscriber) {
          setState(prev => ({ ...prev, subscribed: true, eligible: 'subscribed', showPopup: false }));
        } else {
          setState(estadoDeContingencia());
        }
      })
      .finally(() => { setLoading(false); });
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
    // 📌 ESPELHO LOCAL do contador. Sem ele, a contingencia nao teria como
    // respeitar o teto de 3 descartes e mostraria o popup de novo a quem ja
    // disse nao tres vezes, justamente durante uma falha do servidor.
    try {
      const atual = parseInt(localStorage.getItem(CONTINGENCIA_LS_KEY) || '0', 10) || 0;
      localStorage.setItem(CONTINGENCIA_LS_KEY, String(atual + 1));
    } catch {}
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
