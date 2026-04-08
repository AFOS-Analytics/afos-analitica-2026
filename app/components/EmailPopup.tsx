'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const STORAGE_KEYS = {
  SUBSCRIBED: 'afos_email_popup_subscribed',
  DISMISSED_SESSION: 'afos_email_popup_dismissed_session',
} as const;

const DELAY_MS = 30_000;
const MIN_SCROLL_PX = 200;

function isEmailValid(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

export function EmailPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(true);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const hasScrolled = useRef(false);
  const timerFired = useRef(false);
  const submitting = useRef(false);

  // Verificar se deve mostrar o popup
  const shouldShow = useCallback((): boolean => {
    if (typeof window === 'undefined') return false;
    // Já se inscreveu permanentemente
    if (localStorage.getItem(STORAGE_KEYS.SUBSCRIBED) === 'true') return false;
    // Já dispensou nesta sessão
    if (sessionStorage.getItem(STORAGE_KEYS.DISMISSED_SESSION) === 'true') return false;
    return true;
  }, []);

  useEffect(() => {
    if (!shouldShow()) return;

    // Detectar scroll (engajamento)
    const onScroll = () => {
      if (window.scrollY >= MIN_SCROLL_PX) {
        hasScrolled.current = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // Timer de 30 segundos
    const timer = setTimeout(() => {
      timerFired.current = true;
      if (hasScrolled.current && shouldShow()) {
        setVisible(true);
      }
    }, DELAY_MS);

    // Verificação extra: se o scroll acontecer depois do timer
    const scrollCheck = setInterval(() => {
      if (timerFired.current && hasScrolled.current && shouldShow() && !visible) {
        setVisible(true);
      }
    }, 2000);

    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(timer);
      clearInterval(scrollCheck);
    };
  }, [shouldShow, visible]);

  const handleDismiss = useCallback(() => {
    setVisible(false);
    sessionStorage.setItem(STORAGE_KEYS.DISMISSED_SESSION, 'true');
  }, []);

  const handleSubmit = useCallback(async () => {
    if (submitting.current) return;
    if (!isEmailValid(email)) {
      setErrorMsg('Insira um email válido.');
      setStatus('error');
      return;
    }

    submitting.current = true;
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), consent }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        const msgs: Record<string, string> = {
          invalid_email: 'Email inválido. Verifique e tente novamente.',
          storage_unavailable: 'Serviço temporariamente indisponível.',
        };
        setErrorMsg(msgs[data.error] || 'Não foi possível concluir. Tente novamente.');
        setStatus('error');
        submitting.current = false;
        return;
      }

      setStatus('success');
      localStorage.setItem(STORAGE_KEYS.SUBSCRIBED, 'true');

      // Fechar popup após 2.5s de sucesso
      setTimeout(() => setVisible(false), 2500);
    } catch {
      setErrorMsg('Erro de conexão. Tente novamente.');
      setStatus('error');
    } finally {
      submitting.current = false;
    }
  }, [email, consent]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" onClick={handleDismiss}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Popup */}
      <div
        className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-in"
        onClick={e => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, #0b1728 0%, #0f1f3a 100%)',
          border: '1px solid rgba(148,163,184,0.16)',
          animation: 'slideUp 0.3s ease-out',
        }}
      >
        {/* Barra azul decorativa */}
        <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-400" />

        {/* Botão fechar */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Fechar popup"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <div className="px-6 py-6 sm:px-8 sm:py-7">
          {status === 'success' ? (
            /* Estado de sucesso */
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-white font-semibold text-lg">Cadastro realizado</p>
              <p className="text-gray-400 text-sm mt-1">Você receberá alertas e resumos do AFOS Analytics.</p>
            </div>
          ) : (
            /* Formulário */
            <>
              <h3 className="text-white font-bold text-lg leading-snug mb-1">
                Receba alertas do AFOS Analytics
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-5">
                Mudanças nas odds, resumo diário, eventos críticos e novidades — direto no seu email.
              </p>

              {/* Input */}
              <div className="mb-3">
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); if (status === 'error') setStatus('idle'); }}
                  placeholder="Seu melhor e-mail"
                  autoComplete="email"
                  disabled={status === 'loading'}
                  className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-500 outline-none transition-all focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: `1px solid ${status === 'error' ? 'rgba(239,68,68,0.5)' : 'rgba(148,163,184,0.16)'}`,
                  }}
                  onKeyDown={e => { if (e.key === 'Enter' && status !== 'loading') handleSubmit(); }}
                />
              </div>

              {/* Checkbox de consentimento */}
              <label className="flex items-start gap-2.5 mb-4 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={e => setConsent(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-gray-600 accent-blue-500 flex-shrink-0"
                />
                <span className="text-xs text-gray-400 leading-relaxed">
                  Quero receber alertas, resumos e comunicações do AFOS Analytics por e-mail.
                </span>
              </label>

              {/* Erro */}
              {status === 'error' && errorMsg && (
                <p className="text-red-400 text-xs mb-3">{errorMsg}</p>
              )}

              {/* Botão */}
              <button
                onClick={handleSubmit}
                disabled={status === 'loading' || !email.trim()}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: status === 'loading'
                    ? 'rgba(37,99,235,0.5)'
                    : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  boxShadow: status === 'loading' ? 'none' : '0 4px 14px rgba(37,99,235,0.3)',
                }}
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

              <p className="text-center text-[10px] text-gray-500 mt-3">
                Sem spam. Cancele quando quiser.
              </p>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
