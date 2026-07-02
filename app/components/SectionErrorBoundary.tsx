'use client';

import { Component, type ReactNode } from 'react';

interface Props {
  name: string;
  children: ReactNode;
  locale?: string;
}

const FALLBACK_MSG = {
  'pt-BR': { pre: 'Seção', post: 'temporariamente indisponível. As outras seções continuam funcionando normalmente.', retry: 'Tentar novamente' },
  en: { pre: 'Section', post: 'temporarily unavailable. The other sections keep working normally.', retry: 'Try again' },
  es: { pre: 'Sección', post: 'temporalmente no disponible. Las demás secciones siguen funcionando normalmente.', retry: 'Intentar de nuevo' },
} as const;

interface State {
  hasError: boolean;
}

// Camada 4, isolamento por seção. Antes deste boundary, uma exceção em qualquer
// .map() de dado degradado (ex: poll sem scenarios[]) propagava até app/error.tsx
// e derrubava o dashboard inteiro. Agora a seção quebrada vira um aviso "Seção
// indisponível", e o resto da página continua renderizando.
export class SectionErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    if (typeof window !== 'undefined') {
      // Log estruturado pra inspeção via DevTools ou error tracker (quando habilitarmos).
      console.error(`[SectionErrorBoundary:${this.props.name}]`, error);
    }
  }

  render() {
    if (this.state.hasError) {
      const loc = this.props.locale === 'en' || this.props.locale === 'es' ? this.props.locale : 'pt-BR';
      const m = FALLBACK_MSG[loc];
      return (
        <section className="bg-amber-50 border border-amber-200 rounded-xl p-4 my-4">
          <p className="text-sm text-amber-800">
            ⚠️ {m.pre} <strong>{this.props.name}</strong> {m.post}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-2 text-xs text-amber-900 underline hover:text-amber-700"
          >
            {m.retry}
          </button>
        </section>
      );
    }
    return this.props.children;
  }
}
