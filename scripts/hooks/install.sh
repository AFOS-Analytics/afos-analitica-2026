#!/bin/sh
# Instala os git hooks do AFOS Analytics em .git/hooks/.
# Re-rodar após clone fresca ou se .git/hooks for resetado.

set -e

REPO_ROOT="$(git rev-parse --show-toplevel)"
HOOK_SRC="$REPO_ROOT/scripts/hooks/pre-commit"
HOOK_DST="$REPO_ROOT/.git/hooks/pre-commit"

if [ ! -f "$HOOK_SRC" ]; then
  echo "❌ Hook source not found: $HOOK_SRC"
  exit 1
fi

cp "$HOOK_SRC" "$HOOK_DST"
chmod +x "$HOOK_DST"
echo "✅ Pre-commit hook installed at $HOOK_DST"
echo "   Validates public/polls-data.json on every commit that touches it."
