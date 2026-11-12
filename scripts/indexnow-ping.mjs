#!/usr/bin/env node
/**
 * IndexNow ping — Bing, Yandex, IndexNow.org partners
 *
 * Anuncia URLs atualizadas para indexação acelerada após rebrand/republish.
 * Key file deve estar acessível em https://afos-analytics.com/<KEY>.txt
 * contendo APENAS a string da key (sem newline final adicional além do natural).
 *
 * Uso:
 *   node scripts/indexnow-ping.mjs                       # URLs principais (ver buildUrlList)
 *   node scripts/indexnow-ping.mjs --url=<URL> [--url=<URL> ...]
 *   node scripts/indexnow-ping.mjs --edicao=weekly/fr/AAAA-MM-DD [--edicao=...]
 *        expande para os idiomas que existem em disco e inclui o índice do produto.
 *        Produtos: weekly/{pais}, tradeoff/{pais} e daily.
 *   --dry-run   só lista as URLs, sem enviar nada.
 *
 * Documentação: https://www.indexnow.org/documentation
 * O protocolo pede para enviar só o que MUDOU: por isso a lista padrão traz só
 * os painéis AO VIVO e só traz a Daily quando há Daily nova.
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { PAINEIS } from '../lib/paineis.mjs';

const HOST = 'www.afos-analytics.com';
const KEY = 'e2fc7313c168995ef8cc3fde4457253c';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = 'https://api.indexnow.org/IndexNow';

// Lista padrão:
//  - landing, about e how-it-works nos 3 idiomas
//  - painéis AO VIVO de `lib/paineis.mjs` nos 3 idiomas (painel encerrado não muda)
//  - Daily (índice e última edição) só se a última publicada tiver até
//    DAILY_NOVA_DIAS dias
const LOCALES = ['pt-BR', 'en', 'es'];
const DAILY_NOVA_DIAS = 2;

function statusPublicado(path) {
  if (!existsSync(path)) return false;
  const content = readFileSync(path, 'utf8').slice(0, 400);
  return /^status:\s*published/m.test(content);
}

function getLatestPublishedDate() {
  const dir = join(process.cwd(), 'public', 'afos-daily');
  const files = readdirSync(dir).filter(f => /^\d{4}-\d{2}-\d{2}\.md$/.test(f));
  files.sort();
  // walk backwards until we find one with `status: published`
  for (let i = files.length - 1; i >= 0; i--) {
    if (statusPublicado(join(dir, files[i]))) {
      return files[i].replace('.md', '');
    }
  }
  return null;
}

function dailyENova(date) {
  const idadeMs = Date.now() - new Date(`${date}T00:00:00-03:00`).getTime();
  return idadeMs <= DAILY_NOVA_DIAS * 24 * 60 * 60 * 1000;
}

function buildUrlList() {
  const urls = [];
  const vivos = PAINEIS.filter(p => p.estado === 'ao-vivo');
  for (const loc of LOCALES) {
    urls.push(`https://${HOST}/${loc}`);
    for (const p of vivos) urls.push(`https://${HOST}/${loc}/dashboard/${p.code}`);
    urls.push(`https://${HOST}/${loc}/about`);
    urls.push(`https://${HOST}/${loc}/how-it-works`);
  }
  const latest = getLatestPublishedDate();
  if (latest && dailyENova(latest)) {
    for (const loc of LOCALES) {
      urls.push(`https://${HOST}/${loc}/daily`);
      urls.push(`https://${HOST}/${loc}/daily/${latest}`);
    }
  }
  return urls;
}

// Arquivo de cada idioma, por produto. Weekly: origem `.md` em inglês, traduções
// `.pt-BR.md` e `.es.md`. Tradeoff e Daily: `.md` em pt-BR, `.en.md` e `.es.md`.
// Tradeoff do Brasil fica na raiz da pasta; os demais países, em subpasta.
function arquivoDaEdicao(produto, pais, date, loc) {
  const pub = join(process.cwd(), 'public');
  if (produto === 'weekly') {
    const dir = join(pub, 'afos-weekly', pais);
    const nome = loc === 'en' ? `${date}.md` : `${date}.${loc}.md`;
    return { arquivo: join(dir, nome), origem: join(dir, `${date}.md`) };
  }
  const nome = loc === 'pt-BR' ? `${date}.md` : `${date}.${loc}.md`;
  const dir = produto === 'tradeoff'
    ? (pais === 'br' ? join(pub, 'afos-tradeoff') : join(pub, 'afos-tradeoff', pais))
    : join(pub, 'afos-daily');
  return { arquivo: join(dir, nome), origem: join(dir, `${date}.md`) };
}

/** `weekly/fr/2026-11-23`, `tradeoff/us/2026-11-09` ou `daily/2026-10-25`. */
function expandirEdicao(spec) {
  const partes = spec.split('/');
  const produto = partes[0];
  const date = partes[partes.length - 1];
  const pais = produto === 'daily' ? null : partes[1];
  const formaOk = /^\d{4}-\d{2}-\d{2}$/.test(date) && (
    (produto === 'daily' && partes.length === 2) ||
    ((produto === 'weekly' || produto === 'tradeoff') && partes.length === 3 && /^[a-z]{2}$/.test(pais))
  );
  if (!formaOk) {
    throw new Error(`--edicao inválida: "${spec}" (use weekly/{pais}/AAAA-MM-DD, tradeoff/{pais}/AAAA-MM-DD ou daily/AAAA-MM-DD)`);
  }
  const base = produto === 'daily' ? 'daily' : `${produto}/${pais}`;
  const { origem } = arquivoDaEdicao(produto, pais, date, LOCALES[0]);
  if (!statusPublicado(origem)) {
    throw new Error(`--edicao ${spec}: a origem não existe ou não está com status: published`);
  }
  const urls = [];
  for (const loc of LOCALES) {
    if (!existsSync(arquivoDaEdicao(produto, pais, date, loc).arquivo)) continue;
    urls.push(`https://${HOST}/${loc}/${base}/${date}`);
    urls.push(`https://${HOST}/${loc}/${base}`);
  }
  return urls;
}

async function ping(urls) {
  const body = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  };

  const resp = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(body),
  });

  const text = await resp.text();
  return { status: resp.status, statusText: resp.statusText, body: text };
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const avulsas = args.filter(a => a.startsWith('--url=')).map(a => a.slice('--url='.length));
  const edicoes = args.filter(a => a.startsWith('--edicao=')).map(a => a.slice('--edicao='.length));

  let urls;
  try {
    urls = avulsas.length || edicoes.length
      ? [...new Set([...avulsas, ...edicoes.flatMap(expandirEdicao)])]
      : buildUrlList();
  } catch (err) {
    console.error(`[indexnow] ${err.message}`);
    process.exit(1);
  }

  console.log(`[indexnow] pinging ${urls.length} URL(s)`);
  for (const u of urls) console.log(`  - ${u}`);
  console.log(`[indexnow] keyLocation: ${KEY_LOCATION}`);
  console.log(`[indexnow] endpoint:    ${ENDPOINT}\n`);

  if (dryRun) {
    console.log('[indexnow] --dry-run: nada enviado');
    process.exit(0);
  }

  try {
    const result = await ping(urls);
    console.log(`[indexnow] status: ${result.status} ${result.statusText}`);
    if (result.body) console.log(`[indexnow] body:   ${result.body}`);

    // 200 = OK; 202 = Accepted (pending validation); 422 = Unprocessable (URLs don't match host)
    // 403 = Key not valid (key file mismatch); 429 = Too many requests
    if (result.status === 200 || result.status === 202) {
      console.log('\n[indexnow] OK — URLs accepted for indexing');
      process.exit(0);
    } else {
      console.error(`\n[indexnow] FAILED with status ${result.status}`);
      process.exit(1);
    }
  } catch (err) {
    console.error('[indexnow] error:', err.message);
    process.exit(1);
  }
}

main();
