# -*- coding: utf-8 -*-
"""
Sobe o staging `.cache/us2026-dataset` para o dataset US 2026 no Hugging Face.

O `build-us-2026-dataset.mjs` diz, no cabecalho, que "a subida ao HF e passo
separado e manual". Este script E esse passo, e ele existe para o passo parar
de ser improvisado a cada vez.

⚠️ UPLOAD CUMULATIVO, SEM DELETE, igual a esteira do Brasil. Arquivo que existe
no repositorio e nao no staging (o `banner.png`, gerado por outro script) fica
intocado. Nunca passar `delete_patterns` aqui.

🔴 PORTAO ANTES DE SUBIR: nenhum arquivo de dados pode ENCOLHER em relacao ao
que ja esta publicado. Serie que encolhe e leitura quebrada, nao noticia. Rodar
o modo `conferir` antes do `subir`, ou usar `subir` que ja confere sozinho.

Uso:
    python scripts/hf-upload-us2026.py conferir
    python scripts/hf-upload-us2026.py subir
"""
import os
import re
import sys
from pathlib import Path

REPO = "AFOS-Analytics1/usa-2026-midterms-divergence"
RAIZ = Path(__file__).resolve().parent.parent
STAGING = Path(os.environ.get("US2026_OUT", RAIZ / ".cache" / "us2026-dataset"))
BASE = "https://huggingface.co/datasets/%s/resolve/main" % REPO


def token() -> str:
    """Token do ambiente (na esteira vem do secret) ou do .env.local (na maquina)."""
    do_ambiente = os.environ.get("HF_TOKEN", "").strip()
    if do_ambiente:
        return do_ambiente
    arq = RAIZ / ".env.local"
    if not arq.exists():
        sys.exit("HF_TOKEN ausente: nem no ambiente nem no .env.local")
    m = re.search(r"^HF_TOKEN\s*=\s*(.+)$", arq.read_text(encoding="utf-8", errors="ignore"), re.M)
    if not m:
        sys.exit("HF_TOKEN nao esta no .env.local")
    return m.group(1).strip().strip('"').strip("'")


def linhas_publicadas(rel: str) -> int:
    """Conta as linhas do arquivo COMO ESTA no HF. 307 exige seguir redirecionamento."""
    import urllib.request
    req = urllib.request.Request("%s/%s" % (BASE, rel), headers={"User-Agent": "afos-upload"})
    try:
        with urllib.request.urlopen(req, timeout=90) as r:
            return r.read().decode("utf-8", "ignore").count("\n")
    except Exception:
        return -1  # arquivo novo, ainda nao publicado


def conferir() -> bool:
    """Nenhum arquivo de dados pode encolher. Retorna True se aprovado."""
    alvos = sorted(
        p for p in STAGING.rglob("*.csv")
    )
    if not alvos:
        sys.exit("staging vazio em %s: rodar build-us-2026-dataset.mjs antes" % STAGING)
    print("  %-44s %8s %8s %8s" % ("arquivo", "no HF", "staging", "delta"))
    ok = True
    for p in alvos:
        rel = p.relative_to(STAGING).as_posix()
        s = p.read_text(encoding="utf-8", errors="ignore").count("\n")
        h = linhas_publicadas(rel)
        if h < 0:
            print("  %-44s %8s %8d %8s  NOVO" % (rel, "-", s, "-"))
            continue
        d = s - h
        marca = "ok" if d >= 0 else "<<< ENCOLHEU"
        if d < 0:
            ok = False
        print("  %-44s %8d %8d %+8d  %s" % (rel, h, s, d, marca))
    print()
    print("  VEREDITO: %s" % ("APROVADO" if ok else "BLOQUEADO, arquivo encolheu"))
    return ok


def subir(mensagem: str) -> None:
    from huggingface_hub import HfApi
    if not conferir():
        sys.exit("nao subiu: o portao reprovou")
    api = HfApi(token=token())
    api.upload_folder(
        folder_path=str(STAGING),
        repo_id=REPO,
        repo_type="dataset",
        commit_message=mensagem,
    )
    print()
    print("  subido: https://huggingface.co/datasets/%s" % REPO)


if __name__ == "__main__":
    modo = sys.argv[1] if len(sys.argv) > 1 else "conferir"
    if modo == "conferir":
        sys.exit(0 if conferir() else 1)
    elif modo == "subir":
        msg = sys.argv[2] if len(sys.argv) > 2 else "Atualiza serie de mercado, imprensa e metadados"
        subir(msg)
    else:
        sys.exit("modo desconhecido: %s (use conferir ou subir)" % modo)
