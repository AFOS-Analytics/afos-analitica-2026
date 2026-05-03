'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../i18n/context';
import { useVisitorState } from '../hooks/useVisitorState';
import { useFocusTrap, usePrefersReducedMotion } from '../hooks/useFocusTrap';
import { SubscribeForm } from './SubscribeForm';
import { trackEvent } from '../lib/analytics/events';

/**
 * Email Popup, Soft lead capture during free sessions.
 *
 * Rules:
 * - Only shows when eligible === 'free' && showPopup && popupDismissals < 3
 * - Triggers after 30s on page + scroll
 * - If dismissed, doesn't reappear in the same session
 * - Max 3 total dismissals across sessions (server-tracked)
 * - After subscribe: never shows again
 */

import { POPUP_SHOW_DELAY_MS } from '../../lib/visitor/constants';

export function EmailPopup() {
  const { t } = useTranslation();
  const { visitorId, state, loading, popupDismissedThisSession, dismissPopup, markSubscribed } = useVisitorState();
  const [visible, setVisible] = useState(false);
  const hasScrolled = useRef(false);
  const timerFired = useRef(false);
  const impressionTracked = useRef(false);
  const reducedMotion = usePrefersReducedMotion();

  const canShow = !loading && state.eligible === 'free' && state.showPopup && !state.subscribed && !popupDismissedThisSession;

  useEffect(() => {
    if (!canShow) return;

    const scrollThreshold = Math.max(window.innerHeight * 0.3, 100);

    const onScroll = () => {
      if (window.scrollY >= scrollThreshold) {
        hasScrolled.current = true;
        if (timerFired.current) setVisible(true);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const timer = setTimeout(() => {
      timerFired.current = true;
      if (hasScrolled.current) setVisible(true);
    }, POPUP_SHOW_DELAY_MS);

    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(timer);
    };
  }, [canShow]);

  useEffect(() => {
    if (visible && !impressionTracked.current) {
      impressionTracked.current = true;
      trackEvent('popup_impression', { source: 'popup' });
    }
  }, [visible]);

  const handleDismiss = () => {
    setVisible(false);
    trackEvent('popup_dismiss', { source: 'popup' });
    dismissPopup();
  };

  const handleSuccess = () => {
    markSubscribed();
    setTimeout(() => setVisible(false), 2500);
  };

  const dialogRef = useFocusTrap(visible, handleDismiss);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 overflow-y-auto"
      onClick={handleDismiss}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-title"
        aria-describedby="popup-description"
        className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl my-auto"
        onClick={e => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, #e8effc 0%, #f0f4ff 100%)',
          animation: reducedMotion ? undefined : 'afosSlideUp 0.3s ease-out',
        }}
      >
        <div className="h-1 bg-gradient-to-r from-primary to-blue-400" aria-hidden="true" />

        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 w-11 h-11 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-primary/70 hover:text-primary hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
          aria-label={t('common.close')}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <div className="px-6 py-6 sm:px-8 sm:py-7">
          <h3 id="popup-title" className="text-dark font-bold text-lg leading-snug mb-1">
            {t('popup.title')}
          </h3>
          <p id="popup-description" className="text-gray-700 text-sm leading-relaxed mb-5">
            {t('popup.description')}
          </p>

          <SubscribeForm
            visitorId={visitorId}
            captureSource="popup"
            variant="default"
            onSuccess={handleSuccess}
          />
        </div>
      </div>
    </div>
  );
}
