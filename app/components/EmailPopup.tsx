'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const STORAGE = {
  SUBSCRIBED: 'afos_popup_subscribed',
  DISMISSED_UNTIL: 'afos_popup_dismissed_until',
} as const;

const DELAY_MS = 30_000;
const DISMISS_TTL_MS = 24 * 60 * 60 * 1000; // 24 horas

function isEmailValid(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

export function EmailPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const hasScrolled = useRef(false);
  const timerFired = useRef(false);
  const submitting = useRef(false);

  const shouldShow = useCallback((): boolean => {
    if (typeof window === 'undefined') return false;
    if (localStorage.getItem(STORAGE.SUBSCRIBED) === 'true') return false;
    const dismissedUntil = localStorage.getItem(STORAGE.DISMISSED_UNTIL);
    if (dismissedUntil && Date.now() < Number(dismissedUntil)) return false;
    return true;
  }, []);

  useEffect(() => {
    if (!shouldShow()) return;

    // Scroll: 30% da viewport height (funciona em mobile e desktop)
    const scrollThreshold = Math.max(window.innerHeight * 0.3, 100);

    const onScroll = () => {
      if (window.scrollY >= scrollThreshold) {
        hasScrolled.current = true;
        // Se timer já disparou, mostrar imediatamente
        if (timerFired.current && shouldShow()) setVisible(true);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const timer = setTimeout(() => {
      timerFired.current = true;
      if (hasScrolled.current && shouldShow()) setVisible(true);
    }, DELAY_MS);

    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(timer);
    };
  }, [shouldShow]);

  const handleDismiss = useCallback(() => {
    setVisible(false);
    // localStorage com TTL de 24h (funciona entre abas)
    localStorage.setItem(STORAGE.DISMISSED_UNTIL, String(Date.now() + DISMISS_TTL_MS));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (submitting.current) return;

    if (!isEmailValid(email)) {
      setErrorMsg('Insira um email válido.');
      setStatus('error');
      return;
    }

    if (!consent) {
      setErrorMsg('Marque a caixa de consentimento para continuar.');
      setStatus('error');
      return;
    }

    // Honeypot — bot detected, fake success without submitting
    if (honeypot) {
      setStatus('success');
      localStorage.setItem(STORAGE.SUBSCRIBED, 'true');
      setTimeout(() => setVisible(false), 2500);
      return;
    }

    submitting.current = true;
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), consent, _hp: honeypot }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        const msgs: Record<string, string> = {
          invalid_email: 'Email inválido. Verifique e tente novamente.',
          storage_unavailable: 'Serviço temporariamente indisponível.',
          rate_limited: 'Muitas tentativas. Tente novamente em 1 hora.',
        };
        setErrorMsg(msgs[data.error] || 'Não foi possível concluir. Tente novamente.');
        setStatus('error');
        submitting.current = false;
        return;
      }

      setStatus('success');
      localStorage.setItem(STORAGE.SUBSCRIBED, 'true');
      setTimeout(() => setVisible(false), 2500);
    } catch {
      setErrorMsg('Erro de conexão. Tente novamente.');
      setStatus('error');
    } finally {
      submitting.current = false;
    }
  }, [email, consent, honeypot]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" onClick={handleDismiss}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
        style={{ animation: 'afosSlideUp 0.3s ease-out' }}
      >
        <div className="h-1 bg-gradient-to-r from-primary to-blue-400" />

        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="Fechar popup"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <div className="px-6 py-6 sm:px-8 sm:py-7">
          {status === 'success' ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-dark font-semibold text-lg">Cadastro realizado</p>
              <p className="text-gray-500 text-sm mt-1">Você receberá alertas e resumos do AFOS Analytics.</p>
            </div>
          ) : (
            <>
              <h3 className="text-dark font-bold text-lg leading-snug mb-1">
                Receba alertas do AFOS Analytics
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-5">
                Mudanças nas odds, resumo diário, eventos críticos e novidades — direto no seu email.
              </p>

              <div className="mb-3">
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); if (status === 'error') setStatus('idle'); }}
                  placeholder="Seu melhor e-mail"
                  autoComplete="email"
                  disabled={status === 'loading'}
                  className="w-full px-4 py-3 rounded-xl text-sm text-dark placeholder-gray-400 bg-gray-50 outline-none transition-all focus:ring-2 focus:ring-primary/30 disabled:opacity-50 border border-gray-200 focus:border-primary"
                  onKeyDown={e => { if (e.key === 'Enter' && status !== 'loading') handleSubmit(); }}
                />
              </div>

              {/* Honeypot — hidden from humans, bots fill it */}
              <input
                type="text"
                name="website"
                value={honeypot}
                onChange={e => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0 }}
              />

              <label className="flex items-start gap-2.5 mb-4 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={e => { setConsent(e.target.checked); if (status === 'error') setStatus('idle'); }}
                  className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-primary flex-shrink-0"
                />
                <span className="text-xs text-gray-500 leading-relaxed">
                  Quero receber alertas, resumos e comunicações do AFOS Analytics por e-mail.
                </span>
              </label>

              {status === 'error' && errorMsg && (
                <p className="text-red-500 text-xs mb-3">{errorMsg}</p>
              )}

              <button
                onClick={handleSubmit}
                disabled={status === 'loading' || !email.trim() || !consent}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary-dark transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ boxShadow: status === 'loading' ? 'none' : '0 4px 14px rgba(15,82,186,0.25)' }}
              >
                {status === 'loading' ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Cadastrando...
                  </span>
                ) : (
                  'Cadastrar'
                )}
              </button>

              <p className="text-center text-[10px] text-gray-400 mt-3">
                Sem spam. Cancele quando quiser.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
