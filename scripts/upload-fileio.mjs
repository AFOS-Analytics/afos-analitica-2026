#!/usr/bin/env node
/**
 * Upload encrypted PDF to file.io.
 * Auto-delete after first download. 14-day max expiry.
 */

import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const PDF_PATH = resolve(ROOT, 'outreach-contacts.pdf');

const buf = readFileSync(PDF_PATH);

// litterbox.catbox.moe: anonymous, 24-72h auto-delete
console.log('Uploading to litterbox.catbox.moe (72h expiry)...');
const blob = new Blob([buf], { type: 'application/pdf' });
const form = new FormData();
form.append('reqtype', 'fileupload');
form.append('time', '72h'); // 1h, 12h, 24h, 48h, 72h
form.append('fileToUpload', blob, 'outreach-contacts.pdf');

const res = await fetch('https://litterbox.catbox.moe/resources/internals/api.php', {
  method: 'POST',
  body: form,
});
const text = await res.text();
console.log('Status:', res.status);
console.log('URL:', text.trim());
