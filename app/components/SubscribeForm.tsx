'use client';

import { useState, useRef, useCallback, useMemo } from 'react';
import { useTranslation } from '../i18n/context';
import { suggestEmailCorrection } from '../../lib/email-typo';

/**
 * Shared subscribe form — used by Popup, Gate, and Landing Page.
 * Honeypot, validation, error handling, i18n, loading state.
 */

interface SubscribeFormProps {
  visitorId?: string;
  captureSource: 'popup' | 'gate' | 'landing';
  onSuccess?: () => void;
  variant?: 'default' | 'gate';
  className?: string;
}

function isEmailValid(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

export function SubscribeForm({ visitorId, captureSource, onSuccess, variant = 'default', className = '' }: SubscribeFormProps) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const submitting = useRef(false);

  const prefix = variant === 'gate' ? 'gate' : 'popup';
  const suggestion = useMemo(() => suggestEmailCorrection(email), [email]);

  const handleSubmit = useCallback(async () => {
    if (submitting.current) return;

    if (!isEmailValid(email)) {
      setErrorMsg(t(`${prefix}.errorInvalid`));
      setStatus('error');
      return;
    }

    if (!consent) {
      setErrorMsg(t(`${prefix}.errorConsent`));
      setStatus('error');
      return;
    }

    if (honeypot) {
      setStatus('success');
      onSuccess?.();
      return;
    }

    submitting.current = true;
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          consent,
          _hp: honeypot,
          visitorId,
          captureSource,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        const errorMap: Record<string, string> = {
          invalid_email: t(`${prefix}.errorInvalid`),
          rate_limited: t(`${prefix}.errorRateLimit`),
          storage_unavailable: t('popup.errorUnavailable'),
        };
        setErrorMsg(errorMap[data.error] || t(`${prefix}.errorGeneric`));
        setStatus('error');
        submitting.current = false;
        return;
      }

      setStatus('success');
      onSuccess?.();
    } catch {
      setErrorMsg(t(`${prefix}.errorConnection`));
      setStatus('error');
    } finally {
      submitting.current = false;
    }
  }, [email, consent, honeypot, visitorId, captureSource, onSuccess, t, prefix]);

  if (status === 'success') {
    return (
      <div className={`text-center py-4 ${className}`}>
        <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="text-dark font-semibold text-lg">{t(variant === 'gate' ? 'gate.success' : 'popup.success')}</p>
        {variant !== 'gate' && (
          <p className="text-gray-500 text-sm mt-1">{t('popup.successDesc')}</p>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="mb-3">
        <input
          type="email"
          value={email}
          onChange={e => { setEmail(e.target.value); if (status === 'error') { setStatus('idle'); setErrorMsg(''); } }}
          placeholder={t(`${prefix}.placeholder`)}
          autoComplete="email"
          disabled={status === 'loading'}
          className="w-full px-4 py-3 rounded-xl text-sm text-dark placeholder-gray-400 bg-white outline-none transition-all focus:ring-2 focus:ring-primary/30 disabled:opacity-50 border border-primary/20 focus:border-primary"
          onKeyDown={e => { if (e.key === 'Enter' && status !== 'loading') handleSubmit(); }}
        />
        {suggestion && status !== 'loading' && (
          <p className="text-xs text-amber-700 mt-1.5 px-1">
            {t('popup.typoSuggestion')}{' '}
            <button
              type="button"
              onClick={() => { setEmail(suggestion); if (status === 'error') { setStatus('idle'); setErrorMsg(''); } }}
              className="font-semibold underline hover:text-amber-900 transition-colors"
            >
              {suggestion}
            </button>
            ?
          </p>
        )}
      </div>

      {/* Honeypot */}
      <input
        type="text"
        name="website"
        value={honeypot}
        onChange={e => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0 }}
      />

      <label className="flex items-start gap-2.5 mb-3 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={consent}
          onChange={e => { setConsent(e.target.checked); if (status === 'error') { setStatus('idle'); setErrorMsg(''); } }}
          className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-primary flex-shrink-0"
        />
        <span className="text-xs text-gray-500 leading-relaxed">
          {t(`${prefix}.consent`)}
        </span>
      </label>

      {status === 'error' && errorMsg && (
        <p className="text-red-500 text-xs mb-3">{errorMsg}</p>
      )}

      <button
        onClick={handleSubmit}
        disabled={status === 'loading' || !email.trim()}
        className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary-dark transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ boxShadow: status === 'loading' ? 'none' : '0 4px 14px rgba(15,82,186,0.25)' }}
      >
        {status === 'loading' ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            {t('popup.submitting')}
          </span>
        ) : (
          t(variant === 'gate' ? 'gate.cta' : 'popup.submit')
        )}
      </button>

      {variant !== 'gate' && (
        <p className="text-center text-[10px] text-gray-400 mt-3">{t('popup.noSpam')}</p>
      )}
    </div>
  );
}
