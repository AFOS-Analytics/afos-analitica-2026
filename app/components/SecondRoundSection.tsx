'use client';

/**
 * 🗳️ O 2º turno de 2026 como REGISTRO, no molde de `FirstRoundSection`: o
 * resultado do TSE e, ao lado, o que cada instrumento dizia na véspera.
 *
 * ⛔ Não é placar de acerto. "Bate com a urna" diz se o desfecho mais pago (ou
 *    mais medido) na véspera foi o que a urna deu. Os números saem de
 *    `lib/brz/segundo-turno-2026.ts`, gerado do arquivo bruto do TSE; enquanto a
 *    totalização não fechar, o cartão diz que é a parcial e de que hora.
 *
 * 🔢 O selo do intervalo das pesquisas é CALCULADO contra a urna, e não fixo
 *    como no 1º turno, onde a faixa continha a urna: aqui ela não contém.
 *
 * 🌐 Os textos ficam no dicionário `TXT`, um bloco por idioma, o padrão da casa.
 */

import { Card, SectionTitle } from './ui';
import { useTranslation } from '../i18n/context';
import { fmtDecimal, fmtMilhar } from '../../lib/i18n/numero';
import { RESULTADO_2T, RETROSPECTO_2T, URNAS_2T, FONTE_TSE_2T, type LinhaRetro2T } from '../../lib/brz/segundo-turno-2026';

const POLY = 'https://polymarket.com/event/';

type Textos = {
  secao: string; tse: string
  tseSub: (final: boolean, pct: string, st: string, ts: string, data: string, hora: string) => string
  eleitorado: string; comparecimento: string; abstencao: string; brancos: string; nulos: string
  notaBN: string; fecho: string
  urnasVotacao: string; urnasConting: string; urnasSubst: string; manual: string; nenhuma: string
  notaUrnas: (total: string) => string
  vespTitulo: string; vespSub: string
  titulo: Record<LinhaRetro2T['id'], string>
  divulgadas: string; periodoTurno: string; horaUtc: (h: string) => string
  pesqVespera: (lula: number, flavio: number, dl: string, df: string) => string
  pesqTurno: (flavio: number, lula: number, empate: number) => string
  urnaDiff: (v: string) => string; urnaNome: string
  sim: string; nao: string; maioria: string; intervaloSim: string; intervaloNao: string; bate: string
  rotVespera: string; rotUrna: string
}

const TXT: Record<'pt-BR' | 'en' | 'es', Textos> = {
  'pt-BR': {
    secao: '2º turno · resultado oficial e retrospecto',
    tse: 'Totalização do TSE',
    tseSub: (final, pct, st, ts, data, hora) =>
      final
        ? `100% das seções, votos válidos, gerada em ${data} às ${hora} (Brasília).`
        : `Parcial: ${pct}% das seções (${st} de ${ts}), votos válidos, gerada em ${data} às ${hora} (Brasília).`,
    eleitorado: 'Eleitorado', comparecimento: 'Comparecimento', abstencao: 'Abstenção', brancos: 'Brancos', nulos: 'Nulos',
    notaBN: 'Brancos e nulos sobre os votos comparecidos.',
    urnasVotacao: 'Urnas eletrônicas de votação', urnasConting: 'Urnas de contingência', urnasSubst: 'Urnas substituídas no dia', manual: 'Seções com votação manual', nenhuma: 'nenhuma',
    notaUrnas: (total) => `Percentual sobre as ${total} urnas, somando as de contingência, como no relatório do TSE com as ocorrências registradas até as 20h de 25/10.`,
    fecho: 'Lula é reeleito para o 4º mandato. No 1º turno, Flávio Bolsonaro tinha terminado à frente, com 47,03% a 45,16%.',
    vespTitulo: 'O que cada instrumento dizia na véspera',
    vespSub: 'Preços do último ponto gravado de 24/Out, lidos no backup diário e não na interface. As pesquisas medem votos totais e a urna conta votos válidos, então a comparação é de ordem e de distância.',
    titulo: {
      pesquisasVespera: 'Pesquisas nacionais divulgadas na véspera (10)',
      pesquisasTurno: 'Nacionais feitas depois do 1º turno (55)',
      vencedor: 'Contrato de vencedor da eleição',
    },
    divulgadas: 'divulgadas em 24/Out',
    periodoTurno: 'divulgadas de 08/Out a 25/Out',
    horaUtc: (h) => `24/Out, ${h} UTC`,
    pesqVespera: (lula, flavio, dl, df) => `Flávio Bolsonaro à frente em ${flavio}, Lula em ${lula}. Distância de Lula +${dl} a Flávio Bolsonaro +${df}`,
    pesqTurno: (flavio, lula, empate) => `Flávio Bolsonaro à frente em ${flavio}, Lula em ${lula}, empate em ${empate}`,
    urnaDiff: (v) => `Lula +${v}`,
    urnaNome: 'Lula',
    sim: 'sim', nao: 'não',
    maioria: 'maioria das casas', intervaloSim: 'intervalo: contém a urna', intervaloNao: 'intervalo: não contém a urna', bate: 'bate com a urna',
    rotVespera: 'Véspera', rotUrna: 'Urna',
  },
  en: {
    secao: 'Second round · official result and retrospective',
    tse: 'TSE official tally',
    tseSub: (final, pct, st, ts, data, hora) =>
      final
        ? `100% of polling stations, valid votes, generated on ${data} at ${hora} (Brasília).`
        : `Partial: ${pct}% of polling stations (${st} of ${ts}), valid votes, generated on ${data} at ${hora} (Brasília).`,
    eleitorado: 'Electorate', comparecimento: 'Turnout', abstencao: 'Abstention', brancos: 'Blank', nulos: 'Null',
    notaBN: 'Blank and null as a share of votes cast.',
    urnasVotacao: 'Electronic voting machines', urnasConting: 'Backup machines', urnasSubst: 'Machines replaced on the day', manual: 'Polling stations voting on paper', nenhuma: 'none',
    notaUrnas: (total) => `Share of the ${total} machines, including backups, as in the TSE report of incidents recorded up to 8 p.m. on 25 Oct.`,
    fecho: 'Lula is re-elected to a fourth term. In the first round, Flávio Bolsonaro had finished ahead, by 47.03% to 45.16%.',
    vespTitulo: 'What each instrument said on the eve',
    vespSub: 'Prices from the last recorded point of 24 Oct, read from the daily backup and not from the interface. Polls measure total votes and the official count uses valid votes, so the comparison is of order and distance.',
    titulo: {
      pesquisasVespera: 'National polls released on the eve (10)',
      pesquisasTurno: 'National polls conducted after the first round (55)',
      vencedor: 'Election winner contract',
    },
    divulgadas: 'released 24 Oct',
    periodoTurno: 'released from 8 Oct to 25 Oct',
    horaUtc: (h) => `24 Oct, ${h} UTC`,
    pesqVespera: (lula, flavio, dl, df) => `Flávio Bolsonaro ahead in ${flavio}, Lula in ${lula}. Distance from Lula +${dl} to Flávio Bolsonaro +${df}`,
    pesqTurno: (flavio, lula, empate) => `Flávio Bolsonaro ahead in ${flavio}, Lula in ${lula}, tie in ${empate}`,
    urnaDiff: (v) => `Lula +${v}`,
    urnaNome: 'Lula',
    sim: 'yes', nao: 'no',
    maioria: 'majority of pollsters', intervaloSim: 'range: contains the count', intervaloNao: 'range: does not contain the count', bate: 'matches the count',
    rotVespera: 'Eve', rotUrna: 'Count',
  },
  es: {
    secao: '2ª vuelta · resultado oficial y retrospectiva',
    tse: 'Totalización del TSE',
    tseSub: (final, pct, st, ts, data, hora) =>
      final
        ? `100% de las secciones, votos válidos, generada el ${data} a las ${hora} (Brasilia).`
        : `Parcial: ${pct}% de las secciones (${st} de ${ts}), votos válidos, generada el ${data} a las ${hora} (Brasilia).`,
    eleitorado: 'Electorado', comparecimento: 'Participación', abstencao: 'Abstención', brancos: 'En blanco', nulos: 'Nulos',
    notaBN: 'Blancos y nulos sobre los votos emitidos.',
    urnasVotacao: 'Urnas electrónicas de votación', urnasConting: 'Urnas de contingencia', urnasSubst: 'Urnas sustituidas en el día', manual: 'Secciones con votación manual', nenhuma: 'ninguna',
    notaUrnas: (total) => `Porcentaje sobre las ${total} urnas, sumando las de contingencia, como en el informe del TSE con las incidencias registradas hasta las 20 h del 25 de oct.`,
    fecho: 'Lula es reelegido para un cuarto mandato. En la primera vuelta, Flávio Bolsonaro había terminado al frente, con 47,03% a 45,16%.',
    vespTitulo: 'Lo que cada instrumento decía en la víspera',
    vespSub: 'Precios del último punto registrado del 24 de oct, leídos en el respaldo diario y no en la interfaz. Las encuestas miden votos totales y el escrutinio cuenta votos válidos, así que la comparación es de orden y de distancia.',
    titulo: {
      pesquisasVespera: 'Encuestas nacionales divulgadas en la víspera (10)',
      pesquisasTurno: 'Encuestas nacionales hechas después de la 1ª vuelta (55)',
      vencedor: 'Contrato de ganador de la elección',
    },
    divulgadas: 'divulgadas el 24 de oct',
    periodoTurno: 'divulgadas del 8 al 25 de oct',
    horaUtc: (h) => `24 de oct, ${h} UTC`,
    pesqVespera: (lula, flavio, dl, df) => `Flávio Bolsonaro adelante en ${flavio}, Lula en ${lula}. Distancia de Lula +${dl} a Flávio Bolsonaro +${df}`,
    pesqTurno: (flavio, lula, empate) => `Flávio Bolsonaro adelante en ${flavio}, Lula en ${lula}, empate en ${empate}`,
    urnaDiff: (v) => `Lula +${v}`,
    urnaNome: 'Lula',
    sim: 'sí', nao: 'no',
    maioria: 'mayoría de las casas', intervaloSim: 'intervalo: contiene la urna', intervaloNao: 'intervalo: no contiene la urna', bate: 'coincide con el escrutinio',
    rotVespera: 'Víspera', rotUrna: 'Urna',
  },
};

export function SecondRoundSection() {
  const { locale } = useTranslation();
  const tx = TXT[locale === 'en' ? 'en' : locale === 'es' ? 'es' : 'pt-BR'];
  const pc = (n: number, casas = 2) => `${fmtDecimal(n, locale, casas)}%`;
  const U = URNAS_2T;
  const urnasTotal = U.votacao + U.contingencia;
  const R = RESULTADO_2T;
  const max = Math.max(...R.candidatos.map((c) => c.pct));
  const lula = R.candidatos.find((c) => c.nome === 'Lula')!;
  const flavio = R.candidatos.find((c) => c.nome === 'Flávio Bolsonaro')!;
  // Diferença Flávio menos Lula na urna, na mesma convenção das pesquisas da véspera.
  const urnaDiff = +(flavio.pct - lula.pct).toFixed(2);

  const [d, h] = R.geradoEm.split('T');
  const [ano, mes, dia] = d.split('-');
  const dataGerado = locale === 'en' ? `${Number(dia)} Oct ${ano}` : locale === 'es' ? `${Number(dia)} de oct de ${ano}` : `${dia}/${mes}/${ano}`;
  const horaGerado = h.slice(0, 5);

  const hora = (iso: string) => (iso.length === 10 ? tx.divulgadas : tx.horaUtc(iso.slice(11, 16)));

  const vespera = (l: LinhaRetro2T) => {
    if (l.id === 'pesquisasVespera') {
      const nL = l.vespera.filter((v) => v.valor < 0).length;
      const nF = l.vespera.filter((v) => v.valor > 0).length;
      const min = Math.min(...l.vespera.map((v) => v.valor));
      const maxv = Math.max(...l.vespera.map((v) => v.valor));
      return tx.pesqVespera(nL, nF, fmtDecimal(-min, locale, 1), fmtDecimal(maxv, locale, 1));
    }
    if (l.id === 'pesquisasTurno') {
      const v = (n: string) => l.vespera.find((x) => x.nome === n)?.valor ?? 0;
      return tx.pesqTurno(v('Flávio Bolsonaro'), v('Lula'), v('empate'));
    }
    return l.vespera.map((v) => `${v.nome} ${pc(v.valor)}`).join(' · ');
  };

  const urna = (l: LinhaRetro2T) => (l.id === 'pesquisasVespera' ? tx.urnaDiff(fmtDecimal(-urnaDiff, locale, 2)) : tx.urnaNome);

  const selo = (c: boolean) => (c ? { txt: tx.sim, cls: 'bg-emerald-50 text-emerald-700' } : { txt: tx.nao, cls: 'bg-amber-50 text-amber-800' });

  return (
    <section id="sec-2turno" className="scroll-mt-20">
      <SectionTitle icon="🗳️">{tx.secao}</SectionTitle>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <h3 className="font-bold text-lg text-dark mb-1">{tx.tse}</h3>
          <p className="text-xs text-gray-500 mb-4">
            {tx.tseSub(R.final, fmtDecimal(R.totalizacao, locale, 2), fmtMilhar(R.secoes.totalizadas, locale), fmtMilhar(R.secoes.total, locale), dataGerado, horaGerado)}{' '}
            <a href={FONTE_TSE_2T} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">TSE ↗</a>
          </p>
          {/* Barra própria, como no 1º turno: o resultado oficial tem duas casas. */}
          {R.candidatos.map((c) => (
            <div key={c.nome} className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold text-dark">{c.nome} ({c.partido})</span>
                <span className="font-bold" style={{ color: c.eleito ? '#0F52BA' : '#94A3B8' }}>{pc(c.pct)}</span>
              </div>
              <div className="h-3 rounded-full bg-gray-200 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${(c.pct / (max * 1.1)) * 100}%`, background: c.eleito ? '#0F52BA' : '#94A3B8' }} />
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5 text-right">{fmtMilhar(c.votos, locale)}</p>
            </div>
          ))}
          <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600 mt-4">
            <dt>{tx.eleitorado}</dt><dd className="text-right">{fmtMilhar(R.eleitorado, locale)}</dd>
            <dt>{tx.comparecimento}</dt><dd className="text-right">{fmtMilhar(R.comparecimento.votos, locale)} ({pc(R.comparecimento.pct)})</dd>
            <dt>{tx.abstencao}</dt><dd className="text-right">{fmtMilhar(R.abstencao.votos, locale)} ({pc(R.abstencao.pct)})</dd>
            <dt>{tx.brancos}</dt><dd className="text-right">{fmtMilhar(R.brancos.votos, locale)} ({pc(R.brancos.pct)})</dd>
            <dt>{tx.nulos}</dt><dd className="text-right">{fmtMilhar(R.nulos.votos, locale)} ({pc(R.nulos.pct)})</dd>
          </dl>
          <p className="text-[11px] text-gray-400 mt-2">{tx.notaBN}</p>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600 mt-4">
            <dt>{tx.urnasVotacao}</dt><dd className="text-right">{fmtMilhar(U.votacao, locale)}</dd>
            <dt>{tx.urnasConting}</dt><dd className="text-right">{fmtMilhar(U.contingencia, locale)}</dd>
            <dt>{tx.urnasSubst}</dt><dd className="text-right">{fmtMilhar(U.substituidas, locale)} ({pc((U.substituidas / urnasTotal) * 100)})</dd>
            <dt>{tx.manual}</dt><dd className="text-right">{U.votacaoManual === 0 ? tx.nenhuma : fmtMilhar(U.votacaoManual, locale)}</dd>
          </dl>
          <p className="text-[11px] text-gray-400 mt-2">
            {tx.notaUrnas(fmtMilhar(urnasTotal, locale))}{' '}
            <a href={U.fonte} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">TSE ↗</a>
          </p>
          <p className="text-sm text-dark font-semibold mt-4 pt-3 border-t border-light-border">{tx.fecho}</p>
        </Card>

        <Card>
          <h3 className="font-bold text-lg text-dark mb-1">{tx.vespTitulo}</h3>
          <p className="text-xs text-gray-500 mb-4">{tx.vespSub}</p>
          <ul className="space-y-3">
            {RETROSPECTO_2T.map((l) => {
              const c = selo(l.confere);
              const faixa = l.vespera.map((v) => v.valor);
              const contem = urnaDiff >= Math.min(...faixa) && urnaDiff <= Math.max(...faixa);
              const sF = selo(contem);
              return (
                <li key={l.id} className="border-b border-light-border pb-3 last:border-0 last:pb-0">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-dark">
                      {l.slug ? (
                        <a href={`${POLY}${l.slug}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary">{tx.titulo[l.id]} ↗</a>
                      ) : tx.titulo[l.id]}
                    </p>
                    {l.id === 'pesquisasVespera' ? (
                      <span className="flex flex-col items-end gap-1">
                        <span className={`text-[11px] font-semibold rounded px-2 py-0.5 whitespace-nowrap ${c.cls}`}>{tx.maioria}: {c.txt}</span>
                        <span className={`text-[11px] font-semibold rounded px-2 py-0.5 whitespace-nowrap ${sF.cls}`}>{contem ? tx.intervaloSim : tx.intervaloNao}</span>
                      </span>
                    ) : l.id === 'pesquisasTurno' ? (
                      <span className={`text-[11px] font-semibold rounded px-2 py-0.5 whitespace-nowrap ${c.cls}`}>{tx.maioria}: {c.txt}</span>
                    ) : (
                      <span className={`text-[11px] font-semibold rounded px-2 py-0.5 whitespace-nowrap ${c.cls}`}>{tx.bate}: {c.txt}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-1"><span className="text-gray-400">{tx.rotVespera}, {l.id === 'pesquisasTurno' ? tx.periodoTurno : hora(l.vesperaEm)}:</span> {vespera(l)}</p>
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
