'use client';

import type { ReactNode } from 'react';

/**
 * Renderiza o texto dos cartões do dashboard transformando link de glossário em
 * link de verdade.
 *
 * POR QUE EXISTE
 * O padrão do AFOS, já valendo no Daily e no Tradeoff, é: termo brasileiro sem
 * tradução fica em português e vira link para o verbete, na própria expressão
 * ([centrão](/en/glossary#centrao)). O Daily consegue isso porque passa por
 * react-markdown (app/components/DailyMarkdown.tsx). O dashboard NÃO passava:
 * os cartões faziam `<p>{texto}</p>`, e o React escapa a string, então o link
 * apareceria literal na tela, com colchetes e parênteses à mostra.
 *
 * POR QUE NÃO É react-markdown
 * Duas razões. Primeira: os cartões são componentes 'use client', e o Daily
 * isolou o react-markdown num componente server justamente para manter ~50KB
 * fora do bundle do cliente; trazer a biblioteca para cá desfaria isso no
 * dashboard, que é a página mais visitada. Segunda, e mais séria: markdown
 * interpretaria TUDO. Asterisco, sublinhado, cerquilha e crase viram formatação,
 * e a prosa dos JSONs nunca foi escrita para markdown. O risco de estragar texto
 * que hoje está correto é real e não vale a pena.
 *
 * O QUE ESTE COMPONENTE FAZ
 * Só uma coisa: reconhece `[rótulo](/{locale}/glossary#{id})` e devolve um link.
 * Todo o resto sai como texto puro, exatamente como saía antes. Uma string sem
 * link renderiza caractere por caractere igual ao que renderizava ontem, o que
 * mantém a regra do /atualizar de não usar markdown nos JSONs válida: negrito,
 * itálico e cabeçalho continuam sem efeito, de propósito.
 *
 * Link malformado fica visível como texto em vez de sumir. Erro que aparece é
 * erro que se conserta; erro silencioso vira defeito publicado.
 */

/**
 * Só caminho relativo de glossário, com os três locales do site e id no formato
 * do loader (ID_RE = /^[a-z0-9-]+$/ em lib/glossary/loader.ts). URL externa NÃO
 * casa aqui de propósito: o cartão não é lugar de link para fora, e restringir
 * o alvo elimina a chance de um texto traduzido injetar destino arbitrário.
 */
const LINK_GLOSSARIO = /\[([^\][\n]+)\]\((\/(?:pt-BR|en|es)\/glossary#[a-z0-9-]+)\)/g;

export function GlossaryText({ children }: { children?: string | null }) {
  const texto = children ?? '';

  // Atalho barato: a maioria esmagadora das strings não tem link nenhum
  // (o pt-BR não tem nenhum). Sai antes de montar array e varrer com regex.
  if (!texto.includes('](/')) return <>{texto}</>;

  const partes: ReactNode[] = [];
  let cursor = 0;

  for (const m of texto.matchAll(LINK_GLOSSARIO)) {
    const inicio = m.index ?? 0;
    if (inicio > cursor) partes.push(texto.slice(cursor, inicio));
    partes.push(
      <a
        key={`${inicio}-${m[2]}`}
        href={m[2]}
        target="_blank"
        rel="noopener noreferrer"
        // Pontilhado em vez de sólido: sinaliza "tem explicação" sem competir
        // com os números, que são o que o leitor veio ver no cartão.
        className="underline decoration-dotted underline-offset-2 hover:decoration-solid"
      >
        {m[1]}
      </a>,
    );
    cursor = inicio + m[0].length;
  }

  if (cursor < texto.length) partes.push(texto.slice(cursor));
  return <>{partes}</>;
}
