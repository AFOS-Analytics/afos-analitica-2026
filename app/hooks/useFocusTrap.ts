'use client';

import { useEffect, useRef } from 'react';

/**
 * Focus trap WCAG 2.2 AA: prende foco dentro do container enquanto open=true.
 * - Captura primeiro elemento tabbable e foca nele
 * - Tab no último volta ao primeiro; Shift+Tab no primeiro vai pro último
 * - ESC dispara onClose
 * - Restaura foco ao elemento que abriu o dialog quando fecha
 */
export function useFocusTrap(open: boolean, onClose: () => void) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement;
    const container = containerRef.current;
    if (!container) return;

    const focusable = container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); return; }
      if (e.key !== 'Tab' || focusable.length === 0) return;
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      previouslyFocused.current?.focus?.();
    };
  }, [open, onClose]);

  return containerRef;
}

/**
 * Hook que detecta prefers-reduced-motion via media query.
 * Retorna true se o usuário prefere movimento reduzido (acessibilidade).
 */
export function usePrefersReducedMotion(): boolean {
  const ref = useRef(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    ref.current = mq.matches;
  }, []);
  return ref.current;
}
