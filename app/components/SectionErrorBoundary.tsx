'use client';

import { Component, type ReactNode } from 'react';

interface Props {
  name: string;
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

// Camada 4 — isolamento por seção. Antes deste boundary, uma exceção em qualquer
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
      return (
        <section className="bg-amber-50 border border-amber-200 rounded-xl p-4 my-4">
          <p className="text-sm text-amber-800">
            ⚠️ Seção <strong>{this.props.name}</strong> temporariamente indisponível.
            As outras seções continuam funcionando normalmente.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-2 text-xs text-amber-900 underline hover:text-amber-700"
          >
            Tentar novamente
          </button>
        </section>
      );
    }
    return this.props.children;
  }
}
