/**
 * Bandeira do Brasil em SVG: campo verde, losango amarelo, globo azul e a
 * faixa branca em arco. Desenhada e não baixada porque cartão OG não pode
 * depender de imagem externa. As estrelas viram pontos brancos: em 62px de
 * largura, desenhar as 27 de verdade vira sujeira em vez de detalhe.
 */
export function bandeira(w) {
  const h = w * 0.7
  const cx = w / 2, cy = h / 2
  const r = w * 0.175
  const estrelas = [[-0.45, -0.30], [0.28, -0.42], [0.50, 0.10], [-0.20, 0.46], [0.05, -0.05], [-0.62, 0.18], [0.62, -0.15]]
    .map(([dx, dy]) => `<circle cx="${(cx + dx * r).toFixed(2)}" cy="${(cy + dy * r).toFixed(2)}" r="${(r * 0.075).toFixed(2)}" fill="#FFFFFF"/>`)
    .join('')
  return `<svg class="flag" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <defs><clipPath id="globo"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath></defs>
    <rect x="0" y="0" width="${w}" height="${h}" fill="#009B3A"/>
    <polygon points="${w * 0.05},${cy} ${cx},${h * 0.07} ${w * 0.95},${cy} ${cx},${h * 0.93}" fill="#FEDF00"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#002776"/>
    <g clip-path="url(#globo)">${estrelas}
      <circle cx="${cx}" cy="${cy + r * 1.35}" r="${r * 1.5}" fill="none" stroke="#FFFFFF" stroke-width="${r * 0.26}"/>
    </g>
  </svg>`
}
