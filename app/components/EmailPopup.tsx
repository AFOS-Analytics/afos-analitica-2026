'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../i18n/context';
import { useVisitorState } from '../hooks/useVisitorState';
import { SubscribeForm } from './SubscribeForm';

/**
 * Email Popup — Soft lead capture during free sessions.
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

  const handleDismiss = () => {
    setVisible(false);
    dismissPopup();
  };

  const handleSuccess = () => {
    markSubscribed();
    setTimeout(() => setVisible(false), 2500);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 overflow-y-auto" onClick={handleDismiss}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl my-auto"
        onClick={e => e.stopPropagation()}
        style={{ background: 'linear-gradient(135deg, #e8effc 0%, #f0f4ff 100%)', animation: 'afosSlideUp 0.3s ease-out' }}
      >
        <div className="h-1 bg-gradient-to-r from-primary to-blue-400" />

        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full text-primary/50 hover:text-primary hover:bg-primary/10 transition-colors"
          aria-label={t('common.close')}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <div className="px-6 py-6 sm:px-8 sm:py-7">
          <h3 className="text-dark font-bold text-lg leading-snug mb-1">
            {t('popup.title')}
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-5">
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
