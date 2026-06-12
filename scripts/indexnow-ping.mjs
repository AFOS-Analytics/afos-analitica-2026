#!/usr/bin/env node
/**
 * IndexNow ping — Bing, Yandex, IndexNow.org partners
 *
 * Anuncia URLs atualizadas para indexação acelerada após rebrand/republish.
 * Key file deve estar acessível em https://afos-analytics.com/<KEY>.txt
 * contendo APENAS a string da key (sem newline final adicional além do natural).
 *
 * Uso:
 *   node scripts/indexnow-ping.mjs                # ping URLs principais
 *   node scripts/indexnow-ping.mjs --url=<URL>    # ping single URL
 *
 * Documentação: https://www.indexnow.org/documentation
 */

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const HOST = 'www.afos-analytics.com';
const KEY = 'e2fc7313c168995ef8cc3fde4457253c';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = 'https://api.indexnow.org/IndexNow';

// Build URL list:
//  - landing 3 locales
//  - dashboard 3 locales
//  - daily index 3 locales
//  - about 3 locales
//  - how-it-works 3 locales
//  - latest published daily × 3 locales
const LOCALES = ['pt-BR', 'en', 'es'];

function getLatestPublishedDate() {
  const dir = join(process.cwd(), 'public', 'afos-daily');
  const files = readdirSync(dir).filter(f => /^\d{4}-\d{2}-\d{2}\.md$/.test(f));
  files.sort();
  // walk backwards until we find one with `status: published`
  for (let i = files.length - 1; i >= 0; i--) {
    const content = readFileSync(join(dir, files[i]), 'utf8').slice(0, 400);
    if (/^status:\s*published/m.test(content)) {
      return files[i].replace('.md', '');
    }
  }
  return null;
}

function buildUrlList() {
  const urls = [];
  for (const loc of LOCALES) {
    urls.push(`https://${HOST}/${loc}`);
    urls.push(`https://${HOST}/${loc}/dashboard`);
    urls.push(`https://${HOST}/${loc}/daily`);
    urls.push(`https://${HOST}/${loc}/about`);
    urls.push(`https://${HOST}/${loc}/how-it-works`);
  }
  const latest = getLatestPublishedDate();
  if (latest) {
    for (const loc of LOCALES) {
      urls.push(`https://${HOST}/${loc}/daily/${latest}`);
    }
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
  const arg = process.argv.find(a => a.startsWith('--url='));
  const urls = arg ? [arg.slice('--url='.length)] : buildUrlList();

  console.log(`[indexnow] pinging ${urls.length} URL(s)`);
  for (const u of urls) console.log(`  - ${u}`);
  console.log(`[indexnow] keyLocation: ${KEY_LOCATION}`);
  console.log(`[indexnow] endpoint:    ${ENDPOINT}\n`);

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
