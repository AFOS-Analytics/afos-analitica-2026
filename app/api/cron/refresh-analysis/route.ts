/**
 * Cron: /api/cron/refresh-analysis
 *
 * Roda a cada 4 horas. Busca dados frescos do Polymarket + Google News,
 * gera draft dos 5 cards de analise, salva no Redis e envia email
 * para aprovacao com link de 1 clique.
 */

import { NextResponse } from 'next/server';
import { saveDraft } from '../../../lib/draft';
import { buildNoCacheHeaders } from '../../../lib/cache/headers';
import { Resend } from 'resend';

const ADMIN_EMAIL = 'afos2100@gmail.com';
const BASE_URL = 'https://afos-analitica-2026.vercel.app';

// Buscar odds do Polymarket
async function fetchPolymarketOdds(): Promise<Record<string, { name: string; odds: number }[]>> {
  try {
    const slugs = [
      { key: 'presidential', slug: 'brazil-presidential-election' },
      { key: 'stf', slug: 'any-brazil-stf-justice-removed-by-impeachment-before-2027' },
      { key: 'senate', slug: 'next-brazil-senate-election-most-seats-won' },
      { key: 'inflation', slug: 'brazil-annual-inflation-2026' },
    ];

    const results: Record<string, { name: string; odds: number }[]> = {};

    for (const { key, slug } of slugs) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);
        const res = await fetch(`https://gamma-api.polymarket.com/events?slug=${slug}&limit=1`, { signal: controller.signal });
        clearTimeout(timeout);

        if (!res.ok) continue;
        const data = await res.json();
        if (!data?.[0]?.markets) continue;

        const candidates: { name: string; odds: number }[] = [];
        for (const m of data[0].markets) {
          if (m.closed) continue;
          let prices = m.outcomePrices;
          if (typeof prices === 'string') try { prices = JSON.parse(prices); } catch { continue; }
          const yesPrice = Number(prices?.[0]) || 0;
          if (yesPrice < 0.005) continue;

          const q = m.question || '';
          let name = q;
          const match = q.match(/Will (.+?) (?:win|finish|be)/);
          if (match) {
            name = match[1];
            if (name.includes('Luiz Inácio Lula')) name = 'Lula';
            if (name.includes('Carlos Roberto Massa')) name = 'Ratinho Jr.';
          }
          if (/STF|impeachment/i.test(q)) name = 'Impeachment STF';
          const partyMatch = q.match(/\((\w+)\) win the most/);
          if (partyMatch) name = partyMatch[1];
          const inflMatch = q.match(/between (\d+\.\d+%) and (\d+\.\d+%)/);
          if (inflMatch) name = `${inflMatch[1]}-${inflMatch[2]}`;

          candidates.push({ name, odds: Math.round(yesPrice * 1000) / 10 });
        }
        candidates.sort((a, b) => b.odds - a.odds);
        results[key] = candidates.slice(0, 8);
      } catch { /* skip individual failures */ }
    }
    return results;
  } catch {
    return {};
  }
}

// Buscar manchetes do Google News
async function fetchHeadlines(): Promise<string[]> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(
      'https://news.google.com/rss/search?q=eleições+2026+presidente+Brasil+when:4h&hl=pt-BR&gl=BR&ceid=BR:pt-419',
      { signal: controller.signal }
    );
    clearTimeout(timeout);

    if (!res.ok) return [];
    const text = await res.text();
    const titles: string[] = [];
    const regex = /<title><!\[CDATA\[(.+?)\]\]><\/title>/g;
    let match;
    while ((match = regex.exec(text)) !== null && titles.length < 5) {
      if (!match[1].includes('Google News')) titles.push(match[1]);
    }
    return titles;
  } catch {
    return [];
  }
}

// Gerar texto do draft baseado em dados frescos
function generateDraft(
  odds: Record<string, { name: string; odds: number }[]>,
  headlines: string[],
  now: string
) {
  const pres = odds.presidential || [];
  const stf = odds.stf || [];
  const senate = odds.senate || [];
  const inflation = odds.inflation || [];

  const lula = pres.find(c => c.name === 'Lula');
  const flavio = pres.find(c => c.name.includes('Flávio') || c.name.includes('Bolsonaro'));
  const gap = lula && flavio ? (lula.odds - flavio.odds).toFixed(1) : '?';
  const stfPct = stf[0]?.odds || '?';
  const plSenate = senate.find(c => c.name === 'PL');
  const inflTop = inflation[0];

  const headlineText = headlines.length > 0
    ? headlines.map(h => `- ${h}`).join('. ')
    : 'Sem manchetes recentes.';

  const topCandidates = pres.slice(0, 5).map(c => `${c.name}: ${c.odds}%`).join(' | ');

  // Cards (analysis-data.json format)
  const cardsData = {
    updatedAt: now,
    cards: {
      sentimento: {
        text1: `POLYMARKET (${now}): ${topCandidates}. Gap Lula-Flavio: ${gap}pp. STF impeachment: ${stfPct}%. PL Senado: ${plSenate?.odds || '?'}%. Inflacao: faixa dominante ${inflTop?.name || '?'} (${inflTop?.odds || '?'}%).`,
        text2: `Manchetes recentes: ${headlineText}`,
        text3: `Dados atualizados automaticamente via cron. Cruzamento Polymarket ao vivo com Google News.`,
        direita: `Flavio Bolsonaro: ${flavio?.odds || '?'}% no Polymarket. PL Senado: ${plSenate?.odds || '?'}%.`,
        esquerda: `Lula: ${lula?.odds || '?'}% no Polymarket. Gap de ${gap}pp.`,
        terceiraVia: pres.filter(c => !['Lula'].includes(c.name) && !c.name.includes('Flávio') && !c.name.includes('Bolsonaro')).slice(0, 3).map(c => `${c.name}: ${c.odds}%`).join(', ') || 'Sem dados.',
        polymarket: `POLYMARKET (${now}): ${topCandidates}. STF impeach: ${stfPct}%. Senado PL: ${plSenate?.odds || '?'}%.`,
      },
      inss: { text1: 'Dados mantidos da ultima atualizacao manual. Execute /atualizar para analise completa.', conclusao: 'Aguardando proxima analise manual.' },
      bancoMaster: { text1: 'Dados mantidos da ultima atualizacao manual. Execute /atualizar para analise completa.', conclusao: 'Aguardando proxima analise manual.' },
      stf: {
        toffoli: 'Dados mantidos da ultima atualizacao.',
        moraes: 'Dados mantidos da ultima atualizacao.',
        gilmar: 'Dados mantidos da ultima atualizacao.',
        dino: 'Dados mantidos da ultima atualizacao.',
        nexo: 'Dados mantidos da ultima atualizacao.',
        analise: `STF impeachment: ${stfPct}% no Polymarket (atualizado ${now}).`,
      },
    },
  };

  // Criteriosa (analysis-criteriosa.json format)
  const critData = {
    updatedAt: now,
    subtitle: `Cruzamento: Polymarket (ao vivo ${now}) - Dados gerados automaticamente pelo cron`,
    candidates: pres.slice(0, 3).map((c, i) => ({
      rank: String(i + 1),
      name: c.name,
      party: i === 0 ? 'PT' : i === 1 ? 'PL' : 'Missão',
      color: i === 0 ? '#DC2626' : i === 1 ? '#0F52BA' : '#8B5CF6',
      header: `${c.name} - Polymarket: ${c.odds}%`,
      fortes: [`Polymarket: ${c.odds}%`],
      fracos: ['Dados automaticos - execute /atualizar para analise completa'],
      analise: `${c.name} com ${c.odds}% no Polymarket (${now}).`,
    })),
    quadroComparativo: pres.slice(0, 5).map(c => ({
      n: c.name, p: '—', m: `${c.odds}%`, t: '—', s: '—', pc: '', mc: '',
    })),
    cruzamento: `Polymarket ao vivo (${now}): ${topCandidates}. Gap: ${gap}pp. STF: ${stfPct}%.`,
  };

  return { cardsData, critData };
}

export async function GET(request: Request) {
  const startTime = Date.now();

  // Autenticacao
  const isVercelCron = request.headers.get('x-vercel-cron') === '1';
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  const isAuthorized = !process.env.VERCEL || isVercelCron || (cronSecret && authHeader === `Bearer ${cronSecret}`);

  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('[cron/analysis] Iniciando geracao de draft...');

    // 1. Buscar dados frescos
    const [odds, headlines] = await Promise.all([
      fetchPolymarketOdds(),
      fetchHeadlines(),
    ]);

    const presCount = odds.presidential?.length || 0;
    if (presCount === 0) {
      console.warn('[cron/analysis] Zero candidatos - abortando draft');
      return NextResponse.json({ ok: false, reason: 'no-data' }, { status: 200, headers: buildNoCacheHeaders() });
    }

    // 2. Gerar draft
    const now = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    const { cardsData, critData } = generateDraft(odds, headlines, now);

    // 3. Salvar no Redis
    const { token, error } = await saveDraft(cardsData, critData);
    if (error || !token) {
      console.error('[cron/analysis] Erro ao salvar draft:', error);
      return NextResponse.json({ ok: false, error }, { status: 500, headers: buildNoCacheHeaders() });
    }

    // 4. Enviar email de aprovacao
    const approveUrl = `${BASE_URL}/api/approve-draft?token=${token}`;
    const topCandidates = (odds.presidential || []).slice(0, 5).map(c => `${c.name}: ${c.odds}%`).join(' | ');

    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: 'AFOS Analytics <onboarding@resend.dev>',
        to: ADMIN_EMAIL,
        subject: `AFOS Draft - ${now} - Aprovar?`,
        html: [
          '<!DOCTYPE html><html><head><meta charset="UTF-8"></head>',
          '<body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,sans-serif;">',
          '<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:32px 16px;">',
          '<tr><td align="center">',
          '<table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:12px;overflow:hidden;">',
          '<tr><td style="background:#0F52BA;padding:24px 32px;">',
          '<h1 style="margin:0;color:#fff;font-size:20px;font-weight:700;">AFOS Analytics</h1>',
          '<p style="margin:4px 0 0;color:rgba(255,255,255,0.7);font-size:12px;">Novo rascunho para aprovacao</p>',
          '</td></tr>',
          '<tr><td style="padding:32px;">',
          '<h2 style="margin:0 0 16px;color:#1a1a1a;font-size:18px;">Rascunho pronto para revisao</h2>',
          `<p style="color:#666;font-size:13px;margin:0 0 8px;">Gerado em: ${now}</p>`,
          `<p style="color:#666;font-size:13px;margin:0 0 20px;">Manchetes: ${headlines.length} encontradas</p>`,
          '<div style="background:#f8fafc;border-radius:8px;padding:16px;border-left:4px solid #0F52BA;margin:0 0 24px;">',
          '<p style="margin:0 0 4px;color:#1a1a1a;font-size:14px;font-weight:700;">Polymarket ao vivo</p>',
          `<p style="margin:0;color:#333;font-size:13px;">${topCandidates}</p>`,
          '</div>',
          `<a href="${approveUrl}" style="display:inline-block;background:#16a34a;color:#fff;padding:14px 36px;border-radius:8px;text-decoration:none;font-size:16px;font-weight:700;">`,
          'APROVAR E PUBLICAR</a>',
          '<p style="margin:16px 0 0;color:#999;font-size:11px;">Se nao aprovar, os dados anteriores continuam no ar. O link expira em 24 horas.</p>',
          '</td></tr>',
          '</table></td></tr></table></body></html>',
        ].join(''),
      }).catch(err => console.error('[cron/analysis] Email falhou:', err));
    }

    const elapsed = Date.now() - startTime;
    console.log(`[cron/analysis] Draft gerado em ${elapsed}ms - ${presCount} candidatos, ${headlines.length} manchetes`);

    return NextResponse.json({
      ok: true,
      candidates: presCount,
      headlines: headlines.length,
      elapsed,
    }, { status: 200, headers: buildNoCacheHeaders() });
  } catch (error) {
    console.error('[cron/analysis] Erro fatal:', error);
    return NextResponse.json({ ok: false, error: 'internal' }, { status: 500, headers: buildNoCacheHeaders() });
  }
}
