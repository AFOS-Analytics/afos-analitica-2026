'use client';

import { track } from '@vercel/analytics';

/**
 * Custom analytics events para o popup de coleta de email.
 * Wrapper sobre Vercel Analytics que aceita falha silenciosa em SSR/dev.
 */
type EventName =
  | 'popup_impression'
  | 'popup_dismiss'
  | 'popup_submit'
  | 'popup_success'
  | 'popup_error'
  | 'gate_impression'
  | 'gate_submit'
  | 'gate_success'
  | 'gate_error'
  | 'landing_subscribe_submit'
  | 'landing_subscribe_success'
  | 'landing_subscribe_error';

type Props = Record<string, string | number | boolean | null>;

export function trackEvent(name: EventName, props?: Props) {
  try {
    if (typeof window === 'undefined') return;
    track(name, props as Record<string, string | number | boolean | null>);
  } catch {
    // silent fail — analytics não pode quebrar UX
  }
}
