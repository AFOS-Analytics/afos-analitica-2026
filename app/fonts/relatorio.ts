import localFont from 'next/font/local'

// Fontes das páginas de relatório final (Brasil e EUA): as mesmas famílias do PDF.
// Desde 13/Nov/2026 moram no repositório em vez de vir de next/font/google: no
// servidor do GitHub Actions o build não conseguia ler a resposta do Google Fonts
// e o CI quebrava. Os arquivos são os MESMOS que o Google servia ao site (subconjunto
// latino, fonte variável que cobre os pesos 400 a 700), baixados em 12/Nov/2026,
// sob a SIL Open Font License 1.1 (textos em app/fonts/relatorio/OFL-*.txt).
// O texto dos relatórios só usa caracteres desse subconjunto (conferido nos 6 HTML).
export const relatorioSans = localFont({
  src: './relatorio/source-sans-3-latin.woff2',
  weight: '400 700',
  style: 'normal',
  variable: '--rel-sans',
  display: 'swap',
})

export const relatorioSerif = localFont({
  src: './relatorio/source-serif-4-latin.woff2',
  weight: '400 700',
  style: 'normal',
  variable: '--rel-serif',
  display: 'swap',
  // Reserva serifada enquanto a fonte carrega, como fazia o next/font/google.
  adjustFontFallback: 'Times New Roman',
})
