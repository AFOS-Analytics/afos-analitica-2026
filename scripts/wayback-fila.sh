#!/usr/bin/env bash
# Fila do passivo do Wayback, do mais ANTIGO para o mais NOVO.
#
# 🔴 POR QUE ISTO EXISTE. Rodar 12 dailies a mao e caro em atencao, e o risco
# real nao e a lentidao: e a fila continuar batendo depois que a borda voltou a
# bloquear, o que aprofunda o bloqueio. A regra da casa diz "se der 429, NAO
# rodar e NAO insistir", e uma fila desatendida nao le regra nenhuma.
#
# ✅ Por isso o pre-check no /save/ roda ANTES DE CADA DIA, nunca so no comeco:
#    - 200 ou 302 -> a borda aceita, segue
#    - 429 ou 000 -> PARA A FILA INTEIRA e diz onde parou
#
# ⛔ Bate no /save/, nunca na raiz: a raiz responde 200 com o save bloqueado.
set -u

DIAS=("$@")
if [ ${#DIAS[@]} -eq 0 ]; then
  echo "uso: bash scripts/wayback-fila.sh 2026-08-05 2026-08-06 ..."
  exit 1
fi

ok=0
falhou=0
parou=""

for d in "${DIAS[@]}"; do
  code=$(curl -s -o /dev/null -w "%{http_code}" -m 45 "https://web.archive.org/save/https://example.com" 2>/dev/null || echo 000)
  if [ "$code" != "200" ] && [ "$code" != "302" ]; then
    parou="$d"
    echo ""
    echo "⛔ PRE-CHECK devolveu $code antes de $d. PARANDO A FILA, sem insistir."
    break
  fi
  echo ""
  echo "=============== $d (pre-check $code) ==============="
  if npx tsx scripts/wayback-archive.ts "$d" 2>&1 | tail -6; then
    ok=$((ok+1))
  else
    ok=$((ok+1))   # o exit code do ambiente nao vale; o resumo impresso e a fonte
  fi
done

echo ""
echo "=============== FIM DA FILA ==============="
echo "dias processados: $ok de ${#DIAS[@]}"
if [ -n "$parou" ]; then
  echo "⛔ parou em $parou. Os dias a partir dele NAO foram tentados."
else
  echo "✅ a fila inteira foi percorrida."
fi
