'use client';

import { useState, useRef, useCallback, useMemo, useId } from 'react';
import { useTranslation } from '../i18n/context';
import { suggestEmailCorrection } from '../../lib/email-typo';
import { trackEvent } from '../lib/analytics/events';

/**
 * Shared subscribe form, used by Popup, Gate, and Landing Page.
 * Honeypot, validation inline, error handling, i18n, loading state.
 * a11y: label associado, ARIA error states, touch targets ≥44px (mobile).
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
  const emailId = useId();
  const consentId = useId();
  const errorId = useId();
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const submitting = useRef(false);

  const prefix = variant === 'gate' ? 'gate' : 'popup';
  const suggestion = useMemo(() => suggestEmailCorrection(email), [email]);
  const emailLooksValid = email.trim().length > 0 && isEmailValid(email);

  const submitEventName = captureSource === 'landing' ? 'landing_subscribe_submit' : (variant === 'gate' ? 'gate_submit' : 'popup_submit');
  const successEventName = captureSource === 'landing' ? 'landing_subscribe_success' : (variant === 'gate' ? 'gate_success' : 'popup_success');
  const errorEventName = captureSource === 'landing' ? 'landing_subscribe_error' : (variant === 'gate' ? 'gate_error' : 'popup_error');

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
    trackEvent(submitEventName, { source: captureSource });

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
        trackEvent(errorEventName, { source: captureSource, reason: data.error || 'unknown' });
        submitting.current = false;
        return;
      }

      setStatus('success');
      trackEvent(successEventName, { source: captureSource, isNew: data.isNew ?? false });
      onSuccess?.();
    } catch {
      setErrorMsg(t(`${prefix}.errorConnection`));
      setStatus('error');
      trackEvent(errorEventName, { source: captureSource, reason: 'network' });
    } finally {
      submitting.current = false;
    }
  }, [email, consent, honeypot, visitorId, captureSource, onSuccess, t, prefix, submitEventName, successEventName, errorEventName]);

  if (status === 'success') {
    return (
      <div className={`text-center py-4 ${className}`} role="status" aria-live="polite">
        <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="text-dark font-semibold text-lg">{t(variant === 'gate' ? 'gate.success' : 'popup.success')}</p>
        {variant !== 'gate' && (
          <p className="text-gray-700 text-sm mt-1">{t('popup.successDesc')}</p>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="mb-3">
        <label htmlFor={emailId} className="sr-only">{t(`${prefix}.placeholder`)}</label>
        <input
          id={emailId}
          type="email"
          value={email}
          onChange={e => {
            const next = e.target.value;
            setEmail(next);
            if (status === 'error') {
              const validNow = isEmailValid(next);
              if (validNow || next.trim() === '') { setStatus('idle'); setErrorMsg(''); }
            }
          }}
          placeholder={t(`${prefix}.placeholder`)}
          autoComplete="email"
          inputMode="email"
          disabled={status === 'loading'}
          aria-invalid={status === 'error'}
          aria-describedby={status === 'error' ? errorId : undefined}
          className="w-full px-4 py-3 rounded-xl text-base sm:text-sm text-dark placeholder-gray-500 bg-white outline-none transition-all focus:ring-2 focus:ring-primary/30 disabled:opacity-50 border border-primary/20 focus:border-primary"
          onKeyDown={e => { if (e.key === 'Enter' && status !== 'loading') handleSubmit(); }}
        />
        {suggestion && status !== 'loading' && (
          <p className="text-xs text-amber-700 mt-1.5 px-1">
            {t('popup.typoSuggestion')}{' '}
            <button
              type="button"
              onClick={() => { setEmail(suggestion); if (status === 'error') { setStatus('idle'); setErrorMsg(''); } }}
              className="font-semibold underline hover:text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded transition-colors"
            >
              {suggestion}
            </button>
            ?
          </p>
        )}
      </div>

      {/* Honeypot — anti-bot, hidden from real users + AT */}
      <input
        type="text"
        name="website"
        value={honeypot}
        onChange={e => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, pointerEvents: 'none' }}
      />

      <div className="flex items-start gap-2.5 mb-3">
        <input
          id={consentId}
          type="checkbox"
          checked={consent}
          onChange={e => { setConsent(e.target.checked); if (status === 'error') { setStatus('idle'); setErrorMsg(''); } }}
          className="mt-0.5 w-5 h-5 sm:w-4 sm:h-4 rounded border-gray-300 accent-primary flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
        />
        <label htmlFor={consentId} className="text-xs text-gray-700 leading-relaxed cursor-pointer select-none">
          {t(`${prefix}.consent`)}
        </label>
      </div>

      {status === 'error' && errorMsg && (
        <p id={errorId} role="alert" className="text-red-600 text-xs mb-3">{errorMsg}</p>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={status === 'loading' || !email.trim() || (email.trim().length > 0 && !emailLooksValid)}
        className="w-full min-h-[44px] py-3 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ boxShadow: status === 'loading' ? 'none' : '0 4px 14px rgba(15,82,186,0.25)' }}
      >
        {status === 'loading' ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
            {t('popup.submitting')}
          </span>
        ) : (
          t(variant === 'gate' ? 'gate.cta' : 'popup.submit')
        )}
      </button>

      {variant !== 'gate' && (
        <p className="text-center text-xs text-gray-600 mt-3">{t('popup.noSpam')}</p>
      )}
    </div>
  );
}
