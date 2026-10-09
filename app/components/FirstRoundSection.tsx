'use client';

/**
 * 🗳️ O 1º turno de 2026 como REGISTRO: o resultado oficial do TSE e, ao lado,
 * o que cada instrumento dizia na véspera, com a hora de cada um.
 *
 * ⛔ Não é placar de acerto. A coluna "bate com a urna" diz se o desfecho mais
 *    pago (ou mais medido) na véspera foi o que a urna deu, e é uma medição: a
 *    leitura do porquê fica com o leitor. Os números saem de
 *    `lib/brz/primeiro-turno-2026.ts`, que declara a fonte de cada um.
 *
 * 🌐 Os textos ficam no dicionário `TXT`, um bloco por idioma, que é o padrão
 *    da casa (`PollsSection`) e o que a trava `check-hardcoded-ptbr` reconhece.
 */

import { Card, SectionTitle } from './ui';
import { useTranslation } from '../i18n/context';
import { fmtDecimal, fmtMilhar } from '../../lib/i18n/numero';
import { RESULTADO_1T, RETROSPECTO_1T, FONTE_TSE, type LinhaRetro } from '../../lib/brz/primeiro-turno-2026';

const POLY = 'https://polymarket.com/event/';

type Textos = {
  secao: string; tse: string; tseSub: string; demais: (v: string) => string
  eleitorado: string; comparecimento: string; abstencao: string; brancos: string; nulos: string
  notaBN: string; fecho: string; vespTitulo: string; vespSub: string
  titulo: Record<LinhaRetro['id'], string>
  divulgadas: string; horaUtc: (h: string) => string
  pesquisas: (lula: number, flavio: number, dl: string, df: string) => string
  urna: { aberto: string; pesquisas: string; segundo: string; terceiro: string; senado: string }
  sim: string; nao: string; emAberto: string; maioria: string; intervalo: string; bate: string
  rotVespera: string; rotUrna: string
}

const TXT: Record<'pt-BR' | 'en' | 'es', Textos> = {
  'pt-BR': {
    secao: '1º turno · resultado oficial e retrospecto',
    tse: 'Totalização do TSE',
    tseSub: '100% das seções, votos válidos, gerada em 05/10/2026 às 12:51 (Brasília).',
    demais: (v) => `Demais nomes: ${v}.`,
    eleitorado: 'Eleitorado', comparecimento: 'Comparecimento', abstencao: 'Abstenção', brancos: 'Brancos', nulos: 'Nulos',
    notaBN: 'Brancos e nulos sobre os votos comparecidos.',
    fecho: '2º turno em 25 de outubro: Flávio Bolsonaro × Lula.',
    vespTitulo: 'O que cada instrumento dizia na véspera',
    vespSub: 'Preços do último ponto gravado de 03/Out, lidos no backup diário e não na interface. As pesquisas medem votos totais e a urna conta votos válidos, então a comparação é de ordem e de distância.',
    titulo: {
      pesquisas: 'Pesquisas nacionais da véspera (9)',
      segundo: 'Livro de 2º lugar do 1º turno',
      terceiro: 'Livro de 3º lugar do 1º turno',
      senado: 'Livro do partido com mais cadeiras no Senado',
      vencedor: 'Contrato de vencedor da eleição',
    },
    divulgadas: 'divulgadas em 03/Out',
    horaUtc: (h) => `03/Out, ${h} UTC`,
    pesquisas: (lula, flavio, dl, df) => `Lula à frente em ${lula}, Flávio Bolsonaro em ${flavio}. Distância de Lula +${dl} a Flávio Bolsonaro +${df}`,
    urna: {
      aberto: 'em aberto, decide em 25/Out',
      pesquisas: 'Flávio Bolsonaro +1,87',
      segundo: 'Lula em 2º',
      terceiro: 'Augusto Cury em 3º (2,89%), Renan Santos em 4º',
      senado: 'PL, com 19 das 54 vagas',
    },
    sim: 'sim', nao: 'não', emAberto: 'em aberto',
    maioria: 'maioria das casas', intervalo: 'intervalo: contém a urna', bate: 'bate com a urna',
    rotVespera: 'Véspera', rotUrna: 'Urna',
  },
  en: {
    secao: 'First round · official result and retrospective',
    tse: 'TSE official tally',
    tseSub: '100% of polling stations, valid votes, generated on 5 Oct 2026 at 12:51 (Brasília).',
    demais: (v) => `Other names: ${v}.`,
    eleitorado: 'Electorate', comparecimento: 'Turnout', abstencao: 'Abstention', brancos: 'Blank', nulos: 'Null',
    notaBN: 'Blank and null as a share of votes cast.',
    fecho: 'Second round on 25 October: Flávio Bolsonaro × Lula.',
    vespTitulo: 'What each instrument said on the eve',
    vespSub: 'Prices from the last recorded point of 3 Oct, read from the daily backup and not from the interface. Polls measure total votes and the official count uses valid votes, so the comparison is of order and distance.',
    titulo: {
      pesquisas: 'Eve-of-vote national polls (9)',
      segundo: 'First-round 2nd-place book',
      terceiro: 'First-round 3rd-place book',
      senado: 'Book on the party with most Senate seats',
      vencedor: 'Election winner contract',
    },
    divulgadas: 'released 3 Oct',
    horaUtc: (h) => `3 Oct, ${h} UTC`,
    pesquisas: (lula, flavio, dl, df) => `Lula ahead in ${lula}, Flávio Bolsonaro in ${flavio}. Distance from Lula +${dl} to Flávio Bolsonaro +${df}`,
    urna: {
      aberto: 'open, decided on 25 Oct',
      pesquisas: 'Flávio Bolsonaro +1.87',
      segundo: 'Lula 2nd',
      terceiro: 'Augusto Cury 3rd (2.89%), Renan Santos 4th',
      senado: 'PL, with 19 of the 54 seats',
    },
    sim: 'yes', nao: 'no', emAberto: 'open',
    maioria: 'majority of pollsters', intervalo: 'range: contains the count', bate: 'matches the count',
    rotVespera: 'Eve', rotUrna: 'Count',
  },
  es: {
    secao: '1ª vuelta · resultado oficial y retrospectiva',
    tse: 'Totalización del TSE',
    tseSub: '100% de las secciones, votos válidos, generada el 5 de oct de 2026 a las 12:51 (Brasilia).',
    demais: (v) => `Demás nombres: ${v}.`,
    eleitorado: 'Electorado', comparecimento: 'Participación', abstencao: 'Abstención', brancos: 'En blanco', nulos: 'Nulos',
    notaBN: 'Blancos y nulos sobre los votos emitidos.',
    fecho: 'Segunda vuelta el 25 de octubre: Flávio Bolsonaro × Lula.',
    vespTitulo: 'Lo que cada instrumento decía en la víspera',
    vespSub: 'Precios del último punto registrado del 3 de oct, leídos en el respaldo diario y no en la interfaz. Las encuestas miden votos totales y el escrutinio cuenta votos válidos, así que la comparación es de orden y de distancia.',
    titulo: {
      pesquisas: 'Encuestas nacionales de la víspera (9)',
      segundo: 'Libro de 2º lugar de la 1ª vuelta',
      terceiro: 'Libro de 3er lugar de la 1ª vuelta',
      senado: 'Libro del partido con más escaños en el Senado',
      vencedor: 'Contrato de ganador de la elección',
    },
    divulgadas: 'divulgadas el 3 de oct',
    horaUtc: (h) => `3 de oct, ${h} UTC`,
    pesquisas: (lula, flavio, dl, df) => `Lula adelante en ${lula}, Flávio Bolsonaro en ${flavio}. Distancia de Lula +${dl} a Flávio Bolsonaro +${df}`,
    urna: {
      aberto: 'abierto, se decide el 25 de oct',
      pesquisas: 'Flávio Bolsonaro +1,87',
      segundo: 'Lula 2º',
      terceiro: 'Augusto Cury 3º (2,89%), Renan Santos 4º',
      senado: 'PL, con 19 de las 54 vacantes',
    },
    sim: 'sí', nao: 'no', emAberto: 'abierto',
    maioria: 'mayoría de las casas', intervalo: 'intervalo: contiene la urna', bate: 'coincide con el escrutinio',
    rotVespera: 'Víspera', rotUrna: 'Urna',
  },
};

export function FirstRoundSection() {
  const { locale } = useTranslation();
  const tx = TXT[locale === 'en' ? 'en' : locale === 'es' ? 'es' : 'pt-BR'];
  const pc = (n: number, casas = 2) => `${fmtDecimal(n, locale, casas)}%`;
  const R = RESULTADO_1T;
  const max = Math.max(...R.candidatos.map((c) => c.pct));

  const hora = (iso: string) => (iso.length === 10 ? tx.divulgadas : tx.horaUtc(iso.slice(11, 16)));

  const vespera = (l: LinhaRetro) => {
    if (l.id === 'pesquisas') {
      const lula = l.vespera.filter((v) => v.valor < 0).length;
      const flavio = l.vespera.filter((v) => v.valor > 0).length;
      const min = Math.min(...l.vespera.map((v) => v.valor));
      const maxv = Math.max(...l.vespera.map((v) => v.valor));
      return tx.pesquisas(lula, flavio, fmtDecimal(-min, locale, 1), fmtDecimal(maxv, locale, 1));
    }
    return l.vespera.map((v) => `${v.nome} ${pc(v.valor)}`).join(' · ');
  };

  const urna = (l: LinhaRetro) => {
    if (l.urna === null) return tx.urna.aberto;
    if (l.id === 'pesquisas') return tx.urna.pesquisas;
    if (l.id === 'segundo') return tx.urna.segundo;
    if (l.id === 'terceiro') return tx.urna.terceiro;
    return tx.urna.senado;
  };

  const confere = (c: boolean | null) =>
    c === null
      ? { txt: tx.emAberto, cls: 'bg-gray-100 text-gray-600' }
      : c
        ? { txt: tx.sim, cls: 'bg-emerald-50 text-emerald-700' }
        : { txt: tx.nao, cls: 'bg-amber-50 text-amber-800' };

  return (
    <section id="sec-1turno" className="scroll-mt-20">
      <SectionTitle icon="🗳️">{tx.secao}</SectionTitle>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <h3 className="font-bold text-lg text-dark mb-1">{tx.tse}</h3>
          <p className="text-xs text-gray-500 mb-4">
            {tx.tseSub}{' '}
            <a href={FONTE_TSE} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">TSE ↗</a>
          </p>
          {/* Barra própria e não o HBar: ele arredonda para UMA casa, e o
              resultado oficial tem duas (47,03 viraria 47,0). */}
          {R.candidatos.map((c) => (
            <div key={c.nome} className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold text-dark">{c.nome} ({c.partido})</span>
                <span className="font-bold" style={{ color: c.segundoTurno ? '#0F52BA' : '#94A3B8' }}>{pc(c.pct)}</span>
              </div>
              <div className="h-3 rounded-full bg-gray-200 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${(c.pct / (max * 1.1)) * 100}%`, background: c.segundoTurno ? '#0F52BA' : '#94A3B8' }} />
              </div>
            </div>
          ))}
          <p className="text-xs text-gray-500 mt-2">{tx.demais(pc(R.demais))}</p>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600 mt-4">
            <dt>{tx.eleitorado}</dt><dd className="text-right">{fmtMilhar(R.eleitorado, locale)}</dd>
            <dt>{tx.comparecimento}</dt><dd className="text-right">{fmtMilhar(R.comparecimento.votos, locale)} ({pc(R.comparecimento.pct)})</dd>
            <dt>{tx.abstencao}</dt><dd className="text-right">{fmtMilhar(R.abstencao.votos, locale)} ({pc(R.abstencao.pct)})</dd>
            <dt>{tx.brancos}</dt><dd className="text-right">{fmtMilhar(R.brancos.votos, locale)} ({pc(R.brancos.pct)})</dd>
            <dt>{tx.nulos}</dt><dd className="text-right">{fmtMilhar(R.nulos.votos, locale)} ({pc(R.nulos.pct)})</dd>
          </dl>
          <p className="text-[11px] text-gray-400 mt-2">{tx.notaBN}</p>
          {/* Fecho do cartão, a pedido do André em 05/Out: no meio, a frase
              cortava o resultado dos números de comparecimento. */}
          <p className="text-sm text-dark font-semibold mt-4 pt-3 border-t border-light-border">{tx.fecho}</p>
        </Card>

        <Card>
          <h3 className="font-bold text-lg text-dark mb-1">{tx.vespTitulo}</h3>
          <p className="text-xs text-gray-500 mb-4">{tx.vespSub}</p>
          <ul className="space-y-3">
            {RETROSPECTO_1T.map((l) => {
              const c = confere(l.confere);
              return (
                <li key={l.id} className="border-b border-light-border pb-3 last:border-0 last:pb-0">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-dark">
                      {l.slug ? (
                        <a href={`${POLY}${l.slug}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary">{tx.titulo[l.id]} ↗</a>
                      ) : tx.titulo[l.id]}
                    </p>
                    {l.id === 'pesquisas' ? (
                      // A maioria das casas e o INTERVALO delas respondem diferente,
                      // e um "não" seco apagaria o segundo, que continha a urna.
                      <span className="flex flex-col items-end gap-1">
                        <span className={`text-[11px] font-semibold rounded px-2 py-0.5 whitespace-nowrap ${c.cls}`}>{tx.maioria}: {c.txt}</span>
                        <span className="text-[11px] font-semibold rounded px-2 py-0.5 whitespace-nowrap bg-emerald-50 text-emerald-700">{tx.intervalo}</span>
                      </span>
                    ) : (
                      <span className={`text-[11px] font-semibold rounded px-2 py-0.5 whitespace-nowrap ${c.cls}`}>{tx.bate}: {c.txt}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-1"><span className="text-gray-400">{tx.rotVespera}, {hora(l.vesperaEm)}:</span> {vespera(l)}</p>
                  <p className="text-xs text-gray-600"><span className="text-gray-400">{tx.rotUrna}:</span> {urna(l)}</p>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
    </section>
  );
}
