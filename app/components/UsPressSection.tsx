'use client'

import { useState } from 'react'
import { useTranslation } from '../i18n/context'
import { SectionTitle, Card } from './ui'
import type { UsPressLeitura } from '../../lib/dashboard/us-press-data'

/**
 * Imprensa das midterms.
 *
 * O AFOS NÃO resume e NÃO interpreta: lista o que veículos de uma lista fixa
 * publicaram, com link para a matéria. A leitura é do veículo, não da casa.
 *
 * ⛔ E isso NÃO é dito por escrito na tela. Havia uma tarja abrindo a seção com
 * essa regra, retirada pelo André em 03/Ago/2026: cada manchete já mostra o nome
 * do veículo e leva ao site dele, e a lista fixa está aberta logo abaixo. A
 * estrutura comunica a regra sem precisar enunciá-la.
 *
 * A LISTA FICA VISÍVEL, num detalhe expansível. Escolher veículo é juízo
 * editorial, e juízo editorial escondido é o que o AFOS não faz. Quem discordar
 * da curadoria discorda de uma lista à vista, não de um critério secreto.
 *
 * ⛔ NÃO EXISTE COLUNA DE INCLINAÇÃO, e a remoção foi decisão do André em
 * 01/Ago/2026. Até então cada veículo carregava um rótulo nosso ("centro",
 * "centro-esquerda", "direita"). Duas razões para tirar:
 *
 *  1. O rótulo era NOSSO e não tinha fonte. Ao cruzar contra o AllSides, que é
 *     a referência mais citada, 13 dos 22 divergiam, e para os DOIS lados: nós
 *     púnhamos Fox News e Washington Examiner mais à direita do que eles, e AP,
 *     Politico, ABC e CBS no centro quando eles os põem à esquerda. Rótulo sem
 *     fonte sobre organização de imprensa nomeada é briga comprada.
 *  2. Rotular é PRESUMIR: diz antes da leitura o que esperar do veículo. É o
 *     contrário do método da casa, que mede primeiro e relata depois.
 *
 * 📌 O que FICA é o `tipo` (agência, jornal, especializada, tv/rádio, opinião,
 * análise), porque ele é FATO sobre o que a organização é, não juízo sobre onde
 * ela se posiciona. Reuters é agência; isso não se discute.
 *
 * 🔒 E fica a LISTA FIXA em si, que é a trava de verdade: ela decide no CÓDIGO
 * quais veículos podem entrar, então ninguém escolhe a dedo a cada rodada.
 */

const T = {
  'pt-BR': {
    titulo: 'Imprensa',
    verLista: 'A lista de veículos, e por que ela é equilibrada',
    listaNota: 'Escolher veículo é juízo editorial. Uma lista torta faria este painel ter opinião sem declarar que tem, então ela reúne agência, jornal de referência, imprensa especializada em Congresso, televisão e opinião dos dois lados. A lista é fixa e vale igual em todas as rodadas, então ninguém escolhe veículo a dedo depois de ver a notícia. O AFOS não classifica veículo por inclinação política: quem lê vê o nome de quem publicou e julga por conta própria.',
    colCasa: 'Veículo',
    colTipo: 'Papel',
    semColeta: 'A coleta rodou e não encontrou matéria de veículo da lista nesta janela.',
    indisponivel: 'Não foi possível ler a coleta de imprensa agora. Isto é falha de leitura, não ausência de notícia, e o registro do erro está no log do servidor.',
    rodape: (pub: number, lidos: number, fora: number, casas: number, teto: number) =>
      `${pub} matérias de ${casas} veículos, no máximo ${teto} por veículo. De ${lidos} itens lidos, ${fora} eram de veículos fora da lista e ficaram de fora. Páginas de acompanhamento, como "últimas pesquisas" e "resultados ao vivo", são descartadas: mudam sozinhas e não são notícia do dia.`,
    atualizado: (d: string) => `Coletado em ${d}`,
  },
  en: {
    titulo: 'Press',
    verLista: 'The outlet list, and why it is balanced',
    listaNota: 'Choosing outlets is an editorial judgement. A skewed list would give this panel an opinion without declaring one, so it gathers wire services, newspapers of record, congressional trade press, broadcast, and opinion from both sides. The list is fixed and applies identically on every run, so no outlet is cherry-picked after the news breaks. AFOS does not classify outlets by political leaning: readers see who published and judge for themselves.',
    colCasa: 'Outlet',
    colTipo: 'Role',
    semColeta: 'The collection ran and found no story from a listed outlet in this window.',
    indisponivel: 'The press collection could not be read right now. This is a read failure, not an absence of news, and the error is recorded in the server log.',
    rodape: (pub: number, lidos: number, fora: number, casas: number, teto: number) =>
      `${pub} stories from ${casas} outlets, at most ${teto} per outlet. Of ${lidos} items read, ${fora} came from outlets off the list and were dropped. Tracker pages such as "latest polls" and "live results" are discarded: they change on their own and are not news of the day.`,
    atualizado: (d: string) => `Collected on ${d}`,
  },
  es: {
    titulo: 'Prensa',
    verLista: 'La lista de medios, y por qué está equilibrada',
    listaNota: 'Elegir medios es un juicio editorial. Una lista torcida haría que este panel tuviera opinión sin declararlo, así que reúne agencias, diarios de referencia, prensa especializada en el Congreso, televisión y opinión de ambos lados. La lista es fija y rige igual en todas las rondas, de modo que nadie elige medios a dedo después de conocer la noticia. El AFOS no clasifica a los medios por inclinación política: quien lee ve quién publicó y juzga por su cuenta.',
    colCasa: 'Medio',
    colTipo: 'Papel',
    semColeta: 'La recolección se ejecutó y no encontró notas de medios de la lista en esta ventana.',
    indisponivel: 'No fue posible leer la recolección de prensa ahora. Esto es una falla de lectura, no ausencia de noticias, y el error queda registrado en el log del servidor.',
    rodape: (pub: number, lidos: number, fora: number, casas: number, teto: number) =>
      `${pub} notas de ${casas} medios, como máximo ${teto} por medio. De ${lidos} ítems leídos, ${fora} eran de medios fuera de la lista y quedaron afuera. Las páginas de seguimiento, como "últimas encuestas" y "resultados en vivo", se descartan: cambian solas y no son noticia del día.`,
    atualizado: (d: string) => `Recolectado el ${d}`,
  },
}

function fmtData(iso: string, locale: string): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  const dia = String(d.getUTCDate()).padStart(2, '0')
  const mes = String(d.getUTCMonth() + 1).padStart(2, '0')
  return locale === 'en' ? `${mes}/${dia}` : `${dia}/${mes}`
}

export function UsPressSection({ leitura }: { leitura: UsPressLeitura }) {
  const { locale } = useTranslation()
  const k = (locale === 'en' || locale === 'es' ? locale : 'pt-BR') as keyof typeof T
  const t = T[k]
  const [verLista, setVerLista] = useState(false)

  const { estado, data } = leitura

  // Os dois estados vazios dizem coisas DIFERENTES, e essa é a correção de
  // 03/Ago/2026: antes qualquer um dos dois virava "sem matéria disponível", e
  // banco fora do ar ficava indistinguível de janela sem notícia.
  if (estado !== 'ok' || !data) {
    return (
      <section>
        <SectionTitle>{t.titulo}</SectionTitle>
        <Card>
          <p className="text-sm text-gray-600">
            {estado === 'vazio' ? t.semColeta : t.indisponivel}
          </p>
        </Card>
      </section>
    )
  }

  const q = data.qualidade

  return (
    <section>
      <SectionTitle>{t.titulo}</SectionTitle>

      {/* ⛔ DUAS TARJAS SAÍRAM DAQUI em 03/Ago/2026, as duas por decisão do André,
          e as duas pelo mesmo motivo: diziam ao leitor coisa que a própria tela
          já mostra.

          1. "Exibindo a última coleta arquivada": o rodapé já imprime
             "Coletado em DD/MM" em toda rodada, então a data nunca esteve
             escondida. A origem da leitura segue registrada no log do servidor,
             que é onde ela serve para alguma coisa.
          2. A regra de que o AFOS não resume nem interpreta: o leitor vê
             manchete com nome do veículo e link para o veículo, e a lista fixa
             continua aberta no detalhe expansível logo abaixo. Explicar por
             escrito o que a estrutura já diz é ruído. */}

      <Card>
        <ul className="divide-y divide-light-border">
          {data.itens.map((i) => (
            <li key={i.url} className="py-2.5 first:pt-0 last:pb-0">
              <a
                href={i.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium leading-snug text-dark hover:text-primary hover:underline"
              >
                {i.titulo}
              </a>
              <div className="mt-0.5 text-[11px] text-gray-500">
                {i.casa} · {fmtData(i.publicadoEm, locale)}
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-4 border-t border-light-border pt-3 text-[11px] leading-snug text-gray-500">
          {t.rodape(q.publicados, q.lidos, q.foraDaLista, q.veiculosRepresentados, q.tetoPorVeiculo)}{' '}
          {t.atualizado(fmtData(data.fetchedAt, locale))}.
        </p>

        <button
          type="button"
          onClick={() => setVerLista((v) => !v)}
          className="mt-2 text-xs font-semibold text-primary hover:underline"
          aria-expanded={verLista}
        >
          {verLista ? '▾' : '▸'} {t.verLista}
        </button>

        {verLista && (
          <div className="mt-2">
            <p className="mb-2 text-xs leading-snug text-gray-700">{t.listaNota}</p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-[10px] uppercase tracking-wider text-gray-500">
                    <th scope="col" className="py-1 pr-3 font-semibold">{t.colCasa}</th>
                    <th scope="col" className="py-1 font-semibold">{t.colTipo}</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {data.veiculos.map((v) => (
                    <tr key={v.casa} className="border-t border-light-border">
                      <td className="py-1 pr-3">{v.casa}</td>
                      <td className="py-1 text-gray-500">{v.tipo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Card>
    </section>
  )
}
