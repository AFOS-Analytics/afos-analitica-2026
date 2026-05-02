#!/usr/bin/env python3
"""
check-factcheck-emitted.py — PreToolUse hook (Python, sem dependência de jq)

Bloqueia Write/Edit em public/afos-daily/*.md se o "## Fact-check gate — log"
não foi emitido na sessão atual de Claude.

Origem: Fase 2.1 do guardrail anti-incidente Vorcaro (01/Mai/2026).
Esta é a única camada NÃO-TEATRAL do gate — harness Claude Code executa este
script, não Claude. Garante mecanicamente que ETAPA 1.5 do skill /afos-daily
não pode ser pulada.

Input: JSON via stdin (PreToolUse hook payload):
  { "session_id": "...", "tool_name": "Write|Edit",
    "tool_input": { "file_path": "...", "content": "..." } }

Output:
  exit 0 + stdout vazio                  → permite write
  exit 0 + JSON com permissionDecision   → bloqueia write com mensagem
"""
import io
import json
import os
import re
import sys
from pathlib import Path

# Force UTF-8 stdout — Windows default cp1252 cannot encode emojis or accents
# in the deny message, which would crash the hook with UnicodeEncodeError.
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
else:
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")


def main() -> int:
    try:
        payload = json.loads(sys.stdin.read())
    except (json.JSONDecodeError, ValueError):
        # Input malformado — falhar aberto (não bloquear writes legítimos)
        print("[factcheck-hook] WARN: malformed JSON input, allowing write", file=sys.stderr)
        return 0

    tool_input = payload.get("tool_input", {}) or {}
    file_path = tool_input.get("file_path", "") or ""
    session_id = payload.get("session_id", "") or ""
    content = tool_input.get("content", "") or ""

    # Filtro 1: só fire em afos-daily markdown writes
    if not re.search(r"public[/\\]afos-daily[/\\][^/\\]+\.md$", file_path):
        return 0

    # Filtro 2: edits pontuais sem headers (typo fix, link rot) podem passar
    # Heurística: se o content NÃO tem '## ' (header de seção), é edit menor
    if not re.search(r"^## ", content, re.MULTILINE):
        return 0

    # Localizar transcript da sessão atual
    if not session_id:
        print("[factcheck-hook] WARN: no session_id in input, allowing write", file=sys.stderr)
        return 0

    home = Path(os.environ.get("HOME") or os.environ.get("USERPROFILE") or "")
    projects_dir = home / ".claude" / "projects"

    transcript: Path | None = None
    if projects_dir.is_dir():
        # Busca recursiva pelo .jsonl da sessão
        for candidate in projects_dir.rglob(f"{session_id}.jsonl"):
            transcript = candidate
            break

    if transcript is None or not transcript.is_file():
        print(
            f"[factcheck-hook] WARN: transcript not found for session {session_id}, allowing write",
            file=sys.stderr,
        )
        return 0

    # Verificar se "Fact-check gate" foi emitido
    try:
        with transcript.open("r", encoding="utf-8", errors="ignore") as f:
            for line in f:
                if "Fact-check gate" in line:
                    return 0  # OK, gate emitido
    except OSError as exc:
        print(f"[factcheck-hook] WARN: cannot read transcript ({exc}), allowing write", file=sys.stderr)
        return 0

    # BLOQUEAR — emitir JSON de denial
    decision = {
        "hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "permissionDecision": "deny",
            "permissionDecisionReason": (
                "FACT-CHECK GATE BLOQUEIO: nenhum '## Fact-check gate -- log' foi emitido "
                "nesta sessao antes de escrever em public/afos-daily/. A ETAPA 1.5 do skill "
                "/afos-daily e obrigatoria -- emita o log de fact-check (Verificacao 1 + "
                "Verificacao 2 + Self-check pre-deploy) ANTES de tentar Write novamente. "
                "Origem: guardrail Fase 2.1, instalado apos incidente Vorcaro de 01/Mai/2026."
            ),
        }
    }
    print(json.dumps(decision, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main())
