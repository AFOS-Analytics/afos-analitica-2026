'use client'

import { Card } from '../ui'

/**
 * Texto editorial do painel da FRANÇA. O texto NÃO mora aqui: vem de
 * `public/fr/analise.{locale}.json`, escrito e traduzido pelo `/atualizar-fra`
 * (regra da casa: componente é layout, conteúdo editorial é JSON). Este
 * componente só desenha, e só entende negrito no formato `**assim**`.
 */

export interface FrAnalise {
  updatedAt: string
  titulo: string
  paragrafos: string[]
}

function comNegrito(p: string) {
  return p.split(/(\*\*[^*]+\*\*)/g).map((trecho, i) =>
    trecho.startsWith('**') && trecho.endsWith('**') ? (
      <strong key={i} className="font-semibold text-dark">{trecho.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{trecho}</span>
    ),
  )
}

export function FrAnaliseSection({ analise }: { analise: FrAnalise | null }) {
  if (!analise || analise.paragrafos.length === 0) return null
  return (
    <section>
      <Card>
        <h2 className="text-xl font-bold text-dark mb-3">{analise.titulo}</h2>
        <div className="space-y-3 text-[15px] leading-relaxed text-gray-700">
          {analise.paragrafos.map((p, i) => (
            <p key={i}>{comNegrito(p)}</p>
          ))}
        </div>
      </Card>
    </section>
  )
}
