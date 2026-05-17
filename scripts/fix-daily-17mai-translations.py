#!/usr/bin/env python3
"""Fix translation artifacts in 2026-05-17 EN/ES files:
1. Restore table separator (em-dashes → hyphens)
2. Restore \n\n before ## headers (sections 3, 4)
3. Restore \n\n before ### headers
4. Restore \n\n between paragraphs that lost breaks
5. Restore \n\n before --- footer separator
"""
import re

for locale_suffix in ['.en.md', '.es.md']:
    path = f'C:/Users/afos3/OneDrive/Documentos/MeusProjetos/AFOS-Analitica-2026/public/afos-daily/2026-05-17{locale_suffix}'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    original_len = len(content)

    # 1. Fix table separator row — replace any sequence of em-dashes/hyphens between pipes with proper format
    # The proper format for our 6-column table is: |------|-----------|---------|--------|---------------|-------|
    content = re.sub(
        r'\|[—\-–\s]+\|[—\-–\s]+\|[—\-–\s]+\|[—\-–\s]+\|[—\-–\s]+\|[—\-–\s]+\|',
        '|------|-----------|---------|--------|---------------|-------|',
        content
    )

    # 2. Restore \n\n before ## sections (when missing)
    # Pattern: text.## N. or text).## N. → text.\n\n## N.
    content = re.sub(r'([^\n])\s*(## [0-9]\. )', r'\1\n\n\2', content)

    # 3. Restore \n\n before ### subsections (when missing)
    content = re.sub(r'([^\n])\s*(### )', r'\1\n\n\2', content)

    # 4. Restore \n\n between paragraphs joined by translator
    # Common patterns: ").(Capital letter)" or "]).(Capital letter)" or text glued
    # Specifically: end of a paragraph followed by sentence start without break
    # Pattern: ).A or ).I or ).O or ).T etc. that should be ).\n\n
    # Careful: don't break sentences within paragraphs
    # Best heuristic: ")." followed by capital letter that starts a paragraph topic
    # Looking for specific telltale sequences from the corrupted output

    # In our specific case, look for these joined patterns:
    join_patterns = [
        # paragraph end before "In the electoral arena"
        (r'\)\.(In the electoral arena|On the opposition flank|On the economic front)', r').\n\n\1'),
        # ES equivalents
        (r'\)\.(En la arena electoral|En el flanco opositor|En el plano económico)', r').\n\n\1'),
    ]
    for pat, repl in join_patterns:
        content = re.sub(pat, repl, content)

    # 5. Fix "↑4,00pp in 18h).—" → "↑4,00pp in 18h).\n\n---\n\n" (footer separator)
    # The em-dash before footer should be a horizontal rule
    content = re.sub(r'\)\.[—–]\s*\*\*Consulted sources', r').\n\n---\n\n**Consulted sources', content)
    content = re.sub(r'\)\.[—–]\s*\*\*Fuentes consultadas', r').\n\n---\n\n**Fuentes consultadas', content)
    content = re.sub(r'\)\.[—–]\s*\*\*Method', r').\n\n---\n\n**Method', content)
    content = re.sub(r'\)\.[—–]\s*\*\*Método', r').\n\n---\n\n**Método', content)

    # 6. Ensure paragraph break before "**Consulted sources..." if missing
    content = re.sub(r'([^\n])\n?(\*\*Consulted sources)', r'\1\n\n\2', content)
    content = re.sub(r'([^\n])\n?(\*\*Fuentes consultadas)', r'\1\n\n\2', content)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f'{locale_suffix}: {original_len} -> {len(content)} chars (delta {len(content)-original_len:+d})')
