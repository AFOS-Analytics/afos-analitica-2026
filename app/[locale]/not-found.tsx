import type { Metadata } from 'next'
import { metadataNaoEncontrada } from '../components/layout/PaginaNaoEncontrada'
import { NaoEncontradaNoIdioma } from '../components/layout/NaoEncontradaNoIdioma'

// 404 de `notFound()` chamado por uma página de /[idioma]. Renderiza dentro do
// layout raiz do idioma, então `<html lang>` vem certo sem ler cabeçalho.
// Endereço que não casa com rota nenhuma (/en/xyz) vai para app/global-not-found.tsx.
export const metadata: Metadata = metadataNaoEncontrada

export default function NotFound() {
  return <NaoEncontradaNoIdioma />
}
