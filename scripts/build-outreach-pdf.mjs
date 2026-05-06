#!/usr/bin/env node
/**
 * Build outreach contacts PDF with password protection.
 *
 * Pipeline:
 *   1. Read outreach-contacts.md (78 contatos consolidados)
 *   2. Render HTML with custom AFOS CSS theme
 *   3. Edge headless → outreach-contacts.pdf (raw)
 *   4. node-qpdf2 → outreach-contacts-encrypted.pdf (password protected)
 *
 * Usage:
 *   node scripts/build-outreach-pdf.mjs <password>
 */

import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// Bundled qpdf binary (downloaded one-time to .qpdf-bin/)
const QPDF_PATH = resolve(ROOT, '.qpdf-bin', 'qpdf-11.9.1-mingw64', 'bin', 'qpdf.exe');

const password = process.argv[2];
if (!password) {
  console.error('Usage: node scripts/build-outreach-pdf.mjs <password>');
  process.exit(1);
}

const MD_PATH = resolve(ROOT, 'outreach-contacts.md');
const HTML_PATH = resolve(ROOT, 'outreach-contacts.html');
const PDF_RAW = resolve(ROOT, 'outreach-contacts-raw.pdf');
const PDF_OUT = resolve(ROOT, 'outreach-contacts.pdf');

// Categories with brand colors
const CATEGORY_COLORS = {
  'A': '#0F52BA', // primary blue
  'B': '#16a34a', // green
  'B-2': '#0891b2', // teal
  'C': '#7c3aed', // violet
  'D': '#d97706', // amber
  'E': '#475569', // slate
  'F.1': '#dc2626', // red
  'F.2': '#dc2626',
  'G.1': '#059669', // emerald
  'G.2': '#059669',
  'G.3': '#059669',
};

const md = readFileSync(MD_PATH, 'utf-8');

// Parse markdown blocks into structured data
const lines = md.split('\n');
const sections = [];
let currentSection = null;
let currentContact = null;

for (const line of lines) {
  // Section header (## A. ...)
  const sectionMatch = line.match(/^##\s+([A-G](?:[-.]\d+)?)\.?\s+(.+?)(?:\s*\((.+?)\))?$/);
  if (sectionMatch) {
    if (currentSection) sections.push(currentSection);
    if (currentContact) currentSection?.contacts.push(currentContact);
    currentSection = {
      id: sectionMatch[1],
      title: sectionMatch[2].trim(),
      meta: sectionMatch[3] || '',
      contacts: [],
    };
    currentContact = null;
    continue;
  }

  // Contact header (**N. Nome** or **N. Nome — TAG**)
  const contactMatch = line.match(/^\*\*(\d+)\.\s+(.+?)\*\*\s*$/);
  if (contactMatch) {
    if (currentContact) currentSection?.contacts.push(currentContact);
    currentContact = {
      num: contactMatch[1],
      name: contactMatch[2],
      veiculo: '',
      porQue: '',
      twitter: '',
      email: '',
      linkedin: '',
    };
    continue;
  }

  // Field lines
  if (currentContact && line.startsWith('Veículo:')) currentContact.veiculo = line.replace(/^Veículo:\s*/, '').trim();
  else if (currentContact && line.startsWith('Por quê:')) currentContact.porQue = line.replace(/^Por quê:\s*/, '').trim();
  else if (currentContact && line.startsWith('Twitter:')) currentContact.twitter = line.replace(/^Twitter:\s*/, '').trim();
  else if (currentContact && line.startsWith('Email:')) currentContact.email = line.replace(/^Email:\s*/, '').trim();
  else if (currentContact && line.startsWith('LinkedIn:')) currentContact.linkedin = line.replace(/^LinkedIn:\s*/, '').trim();
}
if (currentContact) currentSection?.contacts.push(currentContact);
if (currentSection) sections.push(currentSection);

// Filter out resumo/non-data sections
const dataSections = sections.filter(s => s.contacts.length > 0);
const totalContacts = dataSections.reduce((acc, s) => acc + s.contacts.length, 0);

// Build HTML
function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>AFOS Analytics — Lista de Contatos Outreach</title>
<style>
  @page { size: A4; margin: 18mm 16mm 18mm 16mm; }
  * { box-sizing: border-box; }
  html, body {
    margin: 0; padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #1a202c;
    font-size: 10.5pt;
    line-height: 1.45;
  }

  /* Cover */
  .cover {
    page-break-after: always;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    padding: 60px 40px;
  }
  .cover-brand {
    font-size: 11pt;
    color: #0F52BA;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    margin-bottom: 28px;
  }
  .cover-title {
    font-size: 36pt;
    font-weight: 800;
    color: #0F52BA;
    margin: 0 0 8px;
    letter-spacing: -0.02em;
  }
  .cover-sub {
    font-size: 14pt;
    color: #475569;
    font-weight: 500;
    margin-bottom: 40px;
  }
  .cover-meta {
    font-size: 10pt;
    color: #64748b;
    border-top: 1px solid #e2e8f0;
    border-bottom: 1px solid #e2e8f0;
    padding: 16px 0;
    margin: 0 auto;
    width: 70%;
  }
  .cover-meta strong { color: #1a202c; }
  .cover-stats {
    display: flex;
    justify-content: center;
    gap: 48px;
    margin-top: 36px;
  }
  .cover-stat {
    text-align: center;
  }
  .cover-stat-num {
    font-size: 28pt;
    font-weight: 800;
    color: #0F52BA;
    line-height: 1;
  }
  .cover-stat-label {
    font-size: 9pt;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-top: 6px;
  }
  .cover-confidential {
    margin-top: auto;
    padding-top: 40px;
    font-size: 8.5pt;
    color: #94a3b8;
    font-style: italic;
  }

  /* TOC */
  .toc {
    page-break-after: always;
    padding: 20px 0;
  }
  .toc h2 {
    color: #0F52BA;
    font-size: 18pt;
    margin: 0 0 24px;
    border-bottom: 2px solid #0F52BA;
    padding-bottom: 8px;
  }
  .toc ul { list-style: none; padding: 0; }
  .toc li {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: 8px 0;
    border-bottom: 1px dotted #cbd5e1;
    font-size: 11pt;
  }
  .toc-id {
    display: inline-block;
    min-width: 36px;
    font-weight: 700;
    color: #0F52BA;
    margin-right: 12px;
  }
  .toc-name { flex: 1; }
  .toc-count {
    color: #64748b;
    font-size: 10pt;
    margin-left: 12px;
  }

  /* Sections */
  .section {
    page-break-inside: avoid;
    margin-top: 24px;
  }
  .section-header {
    border-left: 4px solid var(--cat-color);
    padding: 4px 0 4px 14px;
    margin-bottom: 16px;
  }
  .section-id {
    display: inline-block;
    background: var(--cat-color);
    color: white;
    font-weight: 700;
    padding: 2px 10px;
    border-radius: 4px;
    font-size: 10pt;
    margin-right: 10px;
  }
  .section-title {
    font-size: 14pt;
    font-weight: 700;
    color: #1a202c;
    display: inline;
  }
  .section-meta {
    font-size: 9.5pt;
    color: #64748b;
    margin-top: 4px;
    margin-left: 0;
  }

  /* Contact cards */
  .contact {
    page-break-inside: avoid;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-left: 3px solid var(--cat-color);
    border-radius: 6px;
    padding: 12px 14px;
    margin-bottom: 10px;
  }
  .contact-head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 6px;
  }
  .contact-name {
    font-size: 11pt;
    font-weight: 700;
    color: #1a202c;
  }
  .contact-num {
    font-size: 9pt;
    color: var(--cat-color);
    font-weight: 700;
    background: white;
    padding: 1px 7px;
    border-radius: 10px;
    border: 1px solid var(--cat-color);
  }
  .contact-veiculo {
    font-size: 10pt;
    color: var(--cat-color);
    font-weight: 600;
    margin-bottom: 6px;
  }
  .contact-porque {
    font-size: 9.5pt;
    color: #475569;
    font-style: italic;
    margin-bottom: 8px;
    line-height: 1.4;
  }
  .contact-fields {
    display: grid;
    grid-template-columns: 1fr;
    gap: 4px;
    font-size: 9.5pt;
  }
  .contact-field {
    display: flex;
    align-items: baseline;
  }
  .contact-field-label {
    font-weight: 600;
    color: #64748b;
    min-width: 64px;
    font-size: 9pt;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .contact-field-value {
    color: #1a202c;
    word-break: break-all;
  }
  .empty { color: #cbd5e1; font-style: italic; }

  /* Resumo final */
  .resumo {
    page-break-before: always;
    padding: 20px 0;
  }
  .resumo h2 {
    color: #0F52BA;
    font-size: 18pt;
    margin: 0 0 24px;
    border-bottom: 2px solid #0F52BA;
    padding-bottom: 8px;
  }
  .resumo table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 8px;
  }
  .resumo th, .resumo td {
    text-align: left;
    padding: 10px 12px;
    border-bottom: 1px solid #e2e8f0;
    font-size: 10.5pt;
  }
  .resumo th {
    background: #0F52BA;
    color: white;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 9.5pt;
    letter-spacing: 0.05em;
  }
  .resumo td:last-child { text-align: right; font-weight: 600; }
  .resumo tr.total td {
    background: #f1f5f9;
    font-weight: 700;
    font-size: 11pt;
    color: #0F52BA;
  }
</style>
</head>
<body>

<!-- COVER -->
<section class="cover">
  <div class="cover-brand">AFOS Analytics</div>
  <h1 class="cover-title">Lista de Contatos</h1>
  <div class="cover-sub">Outreach Pré-Launch · Multi-Canal</div>

  <div class="cover-meta">
    <strong>Documento interno</strong> · Gerado em 03/Mai/2026 · Lançamento agendado: <strong>12/Mai/2026 (terça-feira)</strong> [reagendado em 05/Mai/2026 de 07/Mai]
  </div>

  <div class="cover-stats">
    <div class="cover-stat">
      <div class="cover-stat-num">${totalContacts}</div>
      <div class="cover-stat-label">Contatos</div>
    </div>
    <div class="cover-stat">
      <div class="cover-stat-num">${dataSections.length}</div>
      <div class="cover-stat-label">Categorias</div>
    </div>
    <div class="cover-stat">
      <div class="cover-stat-num">$0</div>
      <div class="cover-stat-label">Custo Outreach</div>
    </div>
  </div>

  <div class="cover-confidential">
    Confidencial — distribuir apenas para equipe interna AFOS Analytics
  </div>
</section>

<!-- TOC -->
<section class="toc">
  <h2>Sumário</h2>
  <ul>
    ${dataSections.map(s => `<li>
      <span><span class="toc-id">${s.id}</span><span class="toc-name">${escapeHtml(s.title)}</span></span>
      <span class="toc-count">${s.contacts.length} contatos</span>
    </li>`).join('')}
  </ul>
</section>

<!-- SECTIONS -->
${dataSections.map(s => {
  const cat = s.id.split('.')[0];
  const color = CATEGORY_COLORS[s.id] || CATEGORY_COLORS[cat] || '#475569';
  return `
<section class="section" style="--cat-color: ${color};">
  <div class="section-header">
    <span class="section-id">${s.id}</span>
    <span class="section-title">${escapeHtml(s.title)}</span>
    ${s.meta ? `<div class="section-meta">${escapeHtml(s.meta)}</div>` : ''}
  </div>
  ${s.contacts.map(c => `
    <div class="contact">
      <div class="contact-head">
        <span class="contact-name">${escapeHtml(c.name)}</span>
        <span class="contact-num">#${c.num}</span>
      </div>
      ${c.veiculo ? `<div class="contact-veiculo">${escapeHtml(c.veiculo)}</div>` : ''}
      ${c.porQue ? `<div class="contact-porque">${escapeHtml(c.porQue)}</div>` : ''}
      <div class="contact-fields">
        <div class="contact-field"><span class="contact-field-label">Twitter</span><span class="contact-field-value">${c.twitter && c.twitter !== '—' ? escapeHtml(c.twitter) : '<span class="empty">—</span>'}</span></div>
        <div class="contact-field"><span class="contact-field-label">Email</span><span class="contact-field-value">${escapeHtml(c.email)}</span></div>
        ${c.linkedin ? `<div class="contact-field"><span class="contact-field-label">LinkedIn</span><span class="contact-field-value">${escapeHtml(c.linkedin)}</span></div>` : ''}
      </div>
    </div>
  `).join('')}
</section>
  `;
}).join('')}

<!-- RESUMO -->
<section class="resumo">
  <h2>Resumo por Categoria</h2>
  <table>
    <thead><tr><th>Categoria</th><th style="text-align:right">Contatos</th></tr></thead>
    <tbody>
      ${dataSections.map(s => `<tr><td><strong>${s.id}.</strong> ${escapeHtml(s.title)}</td><td>${s.contacts.length}</td></tr>`).join('')}
      <tr class="total"><td>TOTAL</td><td>${totalContacts}</td></tr>
    </tbody>
  </table>
</section>

</body>
</html>`;

writeFileSync(HTML_PATH, html, 'utf-8');
console.log(`✓ HTML gerado: ${HTML_PATH}`);

// Find Edge
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
if (!existsSync(EDGE_PATH)) {
  console.error(`✗ Edge não encontrado em ${EDGE_PATH}`);
  process.exit(1);
}

console.log('Convertendo HTML → PDF via Edge headless...');
execFileSync(EDGE_PATH, [
  '--headless',
  '--disable-gpu',
  '--no-pdf-header-footer',
  `--print-to-pdf=${PDF_RAW}`,
  `file:///${HTML_PATH.replace(/\\/g, '/')}`,
], { stdio: 'inherit' });

if (!existsSync(PDF_RAW)) {
  console.error('✗ PDF raw não foi gerado');
  process.exit(1);
}
console.log(`✓ PDF raw gerado: ${PDF_RAW}`);

console.log(`Encriptando com senha "${password}"...`);
execFileSync(QPDF_PATH, [
  '--encrypt', password, password, '256',
  '--print=full', '--modify=none', '--extract=n',
  '--', PDF_RAW, PDF_OUT,
], { stdio: 'inherit' });

unlinkSync(PDF_RAW);
unlinkSync(HTML_PATH);

console.log(`\n✓ PDF protegido pronto: ${PDF_OUT}`);
console.log(`  Senha: ${password}`);
console.log(`  Total: ${totalContacts} contatos em ${dataSections.length} categorias`);
