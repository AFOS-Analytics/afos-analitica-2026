#!/usr/bin/env python3
"""
PreToolUse hook — valida URLs em public/afos-daily/*.md antes de Write/Edit.

Camada 4 da arquitetura URL-primária. Bloqueia Write se detecta:
  E1. URL gamma-api.polymarket.com (URL de API, não interface humana)
  E2. Linha "Fontes citadas:" no rodapé contém markdown links
       (template renderiza data.sources como texto plano)
  E3. URL Google News redirect truncada (<150 chars — token incompleto)
  E4. URL retornando HTTP 4xx/5xx (HEAD check com User-Agent browser)

Aceita stdin no formato hook do Claude Code:
  { "tool_name": "Write|Edit", "tool_input": { "file_path": "...", "content": "..." } }

E4 valida em paralelo com 8s timeout por URL e ThreadPoolExecutor (max 8 workers).
Domínios em ANTI_BOT_WHITELIST passam mesmo com timeout/connection-refused
(funcionam em browser real, mas bloqueiam curl/requests).

Implementado: 07/Mai/2026 após incidente daily 06/Mai.
E3+E4 adicionados: 07/Mai/2026 após incidente daily 07/Mai (URLs truncadas
de O Globo/Folha causaram links quebrados no preview).
"""

import json
import re
import sys
import urllib.request
import urllib.error
from concurrent.futures import ThreadPoolExecutor, as_completed
from urllib.parse import urlparse


URL_REGEX = re.compile(r'\[([^\]]+)\]\((https?://[^)]+)\)')
FOOTER_SOURCES_RE = re.compile(
    r'\*\*(?:Fontes citadas|Sources cited|Fuentes citadas):?\*\*[^\n]*',
    re.IGNORECASE,
)
FOOTER_MARKDOWN_RE = re.compile(r'\[[^\]]+\]\(https?://[^)]+\)')
GAMMA_API_RE = re.compile(r'^https?://gamma-api\.polymarket\.com', re.IGNORECASE)
GOOGLE_NEWS_RE = re.compile(r'^https?://news\.google\.com/rss/articles/', re.IGNORECASE)

# Browser-like User-Agent para passar anti-bot básico de veículos
BROWSER_UA = (
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
    'AppleWebKit/537.36 (KHTML, like Gecko) '
    'Chrome/120.0.0.0 Safari/537.36'
)

# Domínios cujo curl/urllib falha (anti-bot) mas funcionam em browser real.
# Para esses, NÃO bloqueamos por timeout/000 — só por 4xx/5xx explícito.
ANTI_BOT_WHITELIST = {
    'polymarket.com',
    'www.polymarket.com',
    'eleitor.tse.jus.br',
    'www.tse.jus.br',
    'tse.jus.br',
    # Veículos com Cloudflare strict — funcionam em browser, falham no curl
    'oglobo.globo.com',
    'g1.globo.com',
    'globo.com',
    'www.globo.com',
    'folha.uol.com.br',
    'www1.folha.uol.com.br',
    'estadao.com.br',
    'www.estadao.com.br',
    'valor.globo.com',
}

# AFOS-próprios passam por regex genérico — qualquer subdomínio + qualquer TLD AFOS.
# Não listar mirrors explicitamente: estratégia anti-bloqueio depende dos mirrors
# serem menos discoverable. Lista explícita em repo público entrega lista ao bloqueador.
AFOS_DOMAIN_RE = re.compile(r'^(?:[a-z0-9-]+\.)?afos-analytics\.[a-z]+$', re.IGNORECASE)

# Tamanho mínimo de Google News redirect URL — tokens completos têm ~400 chars,
# mas qualquer URL <150 chars é definitivamente truncada (perde resolução).
GOOGLE_NEWS_MIN_LEN = 150

# HTTP validation: timeout por URL (segundos), max workers paralelos
HTTP_TIMEOUT = 8
HTTP_MAX_WORKERS = 8

# Mapa nome-do-veículo -> tokens esperados no hostname final.
# Usado por E5 (misattribution check). Cada token é case-insensitive
# substring match no hostname após resolver redirect.
OUTLET_HOSTNAME_TOKENS = {
    'folha': ['folha.uol', 'folha.com', 'folhadesp'],
    'folha de s.paulo': ['folha.uol', 'folha.com'],
    'folha de são paulo': ['folha.uol', 'folha.com'],
    'o globo': ['oglobo.globo', 'globo.com/oglobo'],
    'globo': ['globo.com'],
    'g1': ['g1.globo'],
    'estadão': ['estadao.com'],
    'estadao': ['estadao.com'],
    'veja': ['veja.abril', 'veja.com'],
    'cnn': ['cnnbrasil.com', 'cnn.com'],
    'cnn brasil': ['cnnbrasil.com'],
    'uol': ['uol.com'],
    'uol notícias': ['noticias.uol', 'uol.com'],
    'poder360': ['poder360.com'],
    'infomoney': ['infomoney.com'],
    'cartacapital': ['cartacapital.com'],
    'carta capital': ['cartacapital.com'],
    'brasil 247': ['brasil247.com'],
    'brasil247': ['brasil247.com'],
    'revista fórum': ['revistaforum.com'],
    'revista forum': ['revistaforum.com'],
    'pleno.news': ['pleno.news'],
    'jovem pan': ['jovempan.com'],
    'metrópoles': ['metropoles.com'],
    'metropoles': ['metropoles.com'],
    'sbt news': ['sbtnews.sbt', 'sbt.com'],
    'r7': ['r7.com'],
    'terra': ['terra.com'],
    'agência brasil': ['agenciabrasil.ebc'],
    'gazeta do povo': ['gazetadopovo.com'],
    'estado de minas': ['em.com'],
    'jornal de brasília': ['jb.com'],
    'jornal de brasilia': ['jb.com'],
    'bem paraná': ['bemparana.com'],
    'jb': ['jb.com'],
    'bbc': ['bbc.com', 'bbc.co.uk'],
    'bbc news brasil': ['bbc.com/portuguese'],
    'reuters': ['reuters.com'],
    'ap': ['apnews.com'],
    'tribuna da bahia': ['tribunadabahia.com'],
    'consultor jurídico': ['conjur.com'],
    'conjur': ['conjur.com'],
    'painel político': ['painelpolitico.com'],
    'a tribuna': ['atribuna.com'],
    't7news': ['t7news.com'],
    'sc em pauta': ['scempauta.com'],
    'gazeta carajás': ['gazetacarajas.com'],
    'plox': ['plox.com'],
    'o povo+': ['opovo.com'],
    'o povo': ['opovo.com'],
    'mais o povo': ['mais.opovo'],
    'quaest': ['quaest.com'],
}


def check_url_http(url):
    """Faz HEAD request com User-Agent browser. Retorna (url, ok, reason, final_host).

    ok=True se status < 400 OU domínio em ANTI_BOT_WHITELIST.
    ok=False se 4xx/5xx (sempre bloqueia, mesmo whitelist).
    Network errors em domínios whitelist passam (true); fora da lista, falham.
    final_host: hostname final após redirects (None se não resolveu).
    """
    try:
        host = urlparse(url).hostname or ''
        host = host.lower()
    except Exception:
        return (url, False, 'URL inválida', None)

    in_whitelist = host in ANTI_BOT_WHITELIST or bool(AFOS_DOMAIN_RE.match(host))

    req = urllib.request.Request(url, method='HEAD', headers={'User-Agent': BROWSER_UA})
    try:
        with urllib.request.urlopen(req, timeout=HTTP_TIMEOUT) as resp:
            status = resp.status
            final_url = resp.geturl()
            final_host = (urlparse(final_url).hostname or '').lower()
            if 400 <= status < 600:
                return (url, False, f'HTTP {status}', final_host)
            return (url, True, f'HTTP {status}', final_host)
    except urllib.error.HTTPError as e:
        return (url, False, f'HTTP {e.code}', None)
    except Exception as e:
        if in_whitelist:
            return (url, True, f'whitelist ({type(e).__name__})', None)
        return (url, False, f'rede falhou ({type(e).__name__})', None)


def check_misattribution(text, url, final_host):
    """E5: Para Google News redirect URLs, valida que o veículo no [Text]
    corresponde ao hostname final.

    Retorna mensagem de erro se mismatch detectado, None se OK ou inconclusivo.

    Fail-open quando final_host é news.google.com — Google News usa JS-redirect
    para a matéria final, e urllib HEAD para nesse intermediário sem seguir o
    JS. Browser real segue normalmente. Bloquear aqui produz falso positivo.
    Quando E4 (HTTP 4xx/5xx) já validou que a URL responde 200, e o veículo
    no texto consta da fonte do news-cache, a atribuição é considerada válida.
    """
    # Só checa Google News redirects (URL primária já casa por construção)
    if not GOOGLE_NEWS_RE.match(url):
        return None
    if not final_host:
        # Não resolveu — fail-open
        return None
    # Quando HEAD para no intermediário Google News (não conseguiu seguir
    # JS-redirect até o veículo), não dá pra validar attribution. Fail-open
    # preserva fallback Google News legítimo. Misattribution real é capturada
    # quando HEAD CONSEGUE seguir até o domínio final (ex: Folha resolvendo
    # para veja.abril.com.br — caso real do incidente 07/Mai).
    if 'news.google.com' in final_host:
        return None

    text_lower = text.lower().strip()
    # Procura veículo no texto que tenha mapeamento conhecido
    for outlet_name, expected_tokens in OUTLET_HOSTNAME_TOKENS.items():
        if outlet_name in text_lower:
            # Verifica se hostname final contém algum dos tokens esperados
            host_match = any(tok in final_host for tok in expected_tokens)
            if not host_match:
                return (
                    f'Misattribution: link rotulado "{text}" mas Google News '
                    f'redirect resolve para "{final_host}". '
                    f'Esperado tokens: {expected_tokens}. '
                    f'Releia URL correto do news-cache para esse veículo.'
                )
            return None  # match — OK
    # Veículo no texto não está no mapa — não consigo validar, fail-open
    return None


def extract_content_from_hook_input(payload):
    """Extrai content do tool_input.

    - Write: tool_input.content (string)
    - Edit:  tool_input.new_string (string)
    - MultiEdit: tool_input.edits[].new_string (array de objetos);
                 concatenamos todos new_strings para validação.
    """
    tool = payload.get('tool_name', '')
    tool_input = payload.get('tool_input', {})
    file_path = tool_input.get('file_path', '')
    if tool == 'Write':
        return file_path, tool_input.get('content', '')
    if tool == 'Edit':
        return file_path, tool_input.get('new_string', '')
    if tool == 'MultiEdit':
        # MultiEdit estrutura: { file_path, edits: [{old_string, new_string}, ...] }
        edits = tool_input.get('edits', [])
        if isinstance(edits, list):
            return file_path, '\n'.join(
                e.get('new_string', '') for e in edits if isinstance(e, dict)
            )
    return file_path, ''


def validate_body(content):
    """Retorna lista de erros críticos (vazio = OK).

    E1: gamma-api URL    — bloqueia
    E2: footer markdown  — bloqueia
    E3: Google News URL truncada (<150 chars) — bloqueia
    E4: HTTP 4xx/5xx em qualquer URL não-whitelist — bloqueia
    E5: Misattribution — link [Folha](url) onde url resolve para outro veículo — bloqueia
    """
    errors = []
    all_urls = []  # coleta para E4
    text_url_pairs = []  # coleta (text, url) para E5

    # E1. gamma-api.polymarket.com em qualquer link
    for m in URL_REGEX.finditer(content):
        text = m.group(1)
        url = m.group(2)
        all_urls.append(url)
        text_url_pairs.append((text, url))
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

    # E3. Google News redirect truncada (<150 chars). Token completo tem ~400.
    # URLs truncadas retornam 400/404 quando o usuário clica.
    for url in all_urls:
        if GOOGLE_NEWS_RE.match(url) and len(url) < GOOGLE_NEWS_MIN_LEN:
            errors.append(
                f'URL Google News redirect truncada (len={len(url)}, mínimo {GOOGLE_NEWS_MIN_LEN}). '
                f'Token incompleto não resolve para a matéria. '
                f'Releia URL completa do news-cache. URL: {url[:80]}...'
            )

    # E4. HTTP 4xx/5xx em paralelo (HEAD com browser UA, 8s timeout, 8 workers).
    # Whitelist: polymarket, TSE, paywalls Cloudflare (Globo/Folha/Estadão) — passam por timeout.
    # Bloqueia em 4xx/5xx explícito mesmo whitelist (URL claramente quebrada).
    # E5. Misattribution: para Google News redirects, valida que veículo no
    # texto bate com hostname final após resolver redirect.
    final_hosts = {}  # url -> final_host (None se não resolveu)
    if all_urls:
        unique_urls = list(set(all_urls))
        with ThreadPoolExecutor(max_workers=HTTP_MAX_WORKERS) as ex:
            futures = {ex.submit(check_url_http, u): u for u in unique_urls}
            for fut in as_completed(futures):
                url, ok, reason, final_host = fut.result()
                final_hosts[url] = final_host
                if not ok:
                    errors.append(
                        f'URL retornou erro: {reason}. URL: {url}'
                    )

    # E5. Misattribution check (só para Google News URLs onde resolvemos final_host)
    for text, url in text_url_pairs:
        final_host = final_hosts.get(url)
        misattr = check_misattribution(text, url, final_host)
        if misattr:
            errors.append(misattr)

    return errors


def main():
    # Fail-open em qualquer falha de leitura/parsing — hook nunca deve quebrar workflow.
    try:
        payload = json.load(sys.stdin)
        if not isinstance(payload, dict):
            sys.exit(0)
        file_path, content = extract_content_from_hook_input(payload)
    except Exception:
        sys.exit(0)

    if not isinstance(file_path, str) or not file_path:
        sys.exit(0)
    normalized_path = file_path.replace('\\', '/')

    # Escopo: apenas markdown em public/afos-daily/, sem path traversal.
    if 'public/afos-daily/' not in normalized_path:
        sys.exit(0)
    if '..' in normalized_path:
        sys.exit(0)
    if not normalized_path.endswith('.md'):
        sys.exit(0)
    if not isinstance(content, str) or not content:
        sys.exit(0)
    # Provavelmente binary se passar de 5MB — fora do escopo deste validator.
    if len(content) > 5_000_000:
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


def cli():
    """Modo CLI para validação manual: python script.py path/to/file.md

    Sai com exit 1 se erros, 0 se OK. Uso interativo (não-hook).
    """
    if len(sys.argv) < 2:
        print('Uso: python precommit-afos-daily-urls.py public/afos-daily/YYYY-MM-DD.md')
        sys.exit(2)
    path = sys.argv[1]
    try:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f'Erro lendo {path}: {e}')
        sys.exit(2)

    print(f'Validando {path} ({len(content)} chars)...')
    errors = validate_body(content)
    if errors:
        print(f'\n[FAIL] {len(errors)} erro(s) critico(s):')
        for i, e in enumerate(errors, 1):
            # Encode ASCII-safe para Windows console (cp1252)
            print(f'  {i}. {e.encode("ascii", "replace").decode("ascii")}')
        sys.exit(1)
    else:
        print('[OK] Nenhum erro detectado.')
        sys.exit(0)


if __name__ == '__main__':
    # Se há argv[1] é CLI mode; caso contrário stdin = hook mode
    if len(sys.argv) > 1:
        cli()
    else:
        main()
