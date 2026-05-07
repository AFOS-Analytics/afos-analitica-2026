#!/usr/bin/env python3
"""
PreToolUse hook — valida URLs em public/afos-daily/*.md antes de Write/Edit.

Camada 4 da arquitetura URL-primária. Bloqueia Write se detecta:
  E1. URL gamma-api.polymarket.com (URL de API, não interface humana)
  E2. Linha "Fontes citadas:" no rodapé contém markdown links
       (template renderiza data.sources como texto plano)

Aceita stdin no formato hook do Claude Code:
  { "tool_name": "Write|Edit", "tool_input": { "file_path": "...", "content": "..." } }

Reproduz lógica de lib/afos-daily/validator.ts em Python para evitar
dependência de Node/tsx no PreToolUse (latência alta).

Implementado: 07/Mai/2026 após incidente daily 06/Mai.
"""

import json
import re
import sys


URL_REGEX = re.compile(r'\[([^\]]+)\]\((https?://[^)]+)\)')
FOOTER_SOURCES_RE = re.compile(
    r'\*\*(?:Fontes citadas|Sources cited|Fuentes citadas):?\*\*[^\n]*',
    re.IGNORECASE,
)
FOOTER_MARKDOWN_RE = re.compile(r'\[[^\]]+\]\(https?://[^)]+\)')
GAMMA_API_RE = re.compile(r'^https?://gamma-api\.polymarket\.com', re.IGNORECASE)


def extract_content_from_hook_input(payload):
    """Extrai content do tool_input. Para Write retorna content; Edit retorna new_string."""
    tool = payload.get('tool_name', '')
    tool_input = payload.get('tool_input', {})
    file_path = tool_input.get('file_path', '')
    if tool == 'Write':
        return file_path, tool_input.get('content', '')
    if tool in ('Edit', 'MultiEdit'):
        # Para Edit, valida o new_string (conteúdo que está sendo escrito)
        return file_path, tool_input.get('new_string', '')
    return file_path, ''


def validate_body(content):
    """Retorna lista de erros críticos (vazio = OK)."""
    errors = []

    # E1. gamma-api.polymarket.com em qualquer link
    for m in URL_REGEX.finditer(content):
        url = m.group(2)
        if GAMMA_API_RE.match(url):
            errors.append(
                f'gamma-api.polymarket.com é URL de API REST, não interface humana. '
                f'Use polymarket.com/event/{{slug}}. URL: {url}'
            )

    # E2. Linha "Fontes citadas" tem markdown links
    footer_match = FOOTER_SOURCES_RE.search(content)
    if footer_match:
        footer_line = footer_match.group(0)
        if FOOTER_MARKDOWN_RE.search(footer_line):
            errors.append(
                'A linha "Fontes citadas:" contém markdown [Texto](URL) que aparece '
                'como texto literal no template (data.sources é renderizado plain). '
                'Use texto plano separado por vírgulas.'
            )

    return errors


def main():
    try:
        payload = json.load(sys.stdin)
    except json.JSONDecodeError:
        # Sem stdin válido — não bloqueia (fail-open, hook sem input não é nosso caso)
        sys.exit(0)

    file_path, content = extract_content_from_hook_input(payload)

    # Aplica apenas em public/afos-daily/*.md (não bloqueia outros files)
    if 'public/afos-daily/' not in file_path.replace('\\', '/'):
        sys.exit(0)
    if not file_path.endswith('.md'):
        sys.exit(0)
    if not content:
        sys.exit(0)

    errors = validate_body(content)

    if errors:
        print(json.dumps({
            'decision': 'block',
            'reason': (
                f'AFOS Daily URL Gate bloqueou Write em {file_path.split("/")[-1]} '
                f'com {len(errors)} erro(s) crítico(s):\n\n'
                + '\n'.join(f'  • {e}' for e in errors)
                + '\n\nCorreção: substitua URLs de API/gamma por polymarket.com/event/{slug} '
                'e remova markdown links da linha "Fontes citadas:" (use texto plano).'
            ),
            'systemMessage': f'AFOS Daily URL Gate: {len(errors)} erro(s) crítico(s) bloquearam Write.',
        }))
        sys.exit(0)

    sys.exit(0)


if __name__ == '__main__':
    main()
