# -*- coding: utf-8 -*-
"""
Sobe o staging `.cache/fr2027-dataset` para o dataset FRANCE 2027 no Hugging Face.
Criado 08/Nov/2026. Reaproveita o portao do dos EUA (`hf-upload-us2026.py`):
nenhum arquivo de dados pode ENCOLHER, upload cumulativo e SEM delete.

A unica diferenca: o repositorio e criado se ainda nao existir (1a subida).

Uso:
    python scripts/hf-upload-fr2027.py criar      (1a vez: cria o repositorio vazio, publico)
    python scripts/hf-upload-fr2027.py conferir
    python scripts/hf-upload-fr2027.py subir "mensagem"
    python scripts/hf-upload-fr2027.py conferir --exato    (DEPOIS de subir)
"""
import importlib.util
import os
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location("hfus", RAIZ / "scripts" / "hf-upload-us2026.py")
hf = importlib.util.module_from_spec(spec)
spec.loader.exec_module(hf)

hf.REPO = "AFOS-Analytics1/france-2027-presidential-divergence"
hf.STAGING = Path(os.environ.get("FR2027_OUT", RAIZ / ".cache" / "fr2027-dataset"))
hf.BASE = "https://huggingface.co/datasets/%s/resolve/main" % hf.REPO


def criar_se_preciso() -> None:
    hf.confiar_no_sistema()
    from huggingface_hub import HfApi
    HfApi(token=hf.token()).create_repo(hf.REPO, repo_type="dataset", exist_ok=True, private=False)


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    modo = args[0] if args else "conferir"
    # Encolhimento DECLARADO, mesmo mecanismo do portao dos EUA (desde 12/Nov/2026):
    # a lista de fichas pendentes encolhe quando a base estrutura uma pesquisa.
    decl_arg = next((a[len("--declarado="):] for a in sys.argv[1:] if a.startswith("--declarado=")), None)
    declarados, motivo = hf.ler_declarados(decl_arg)
    if modo == "conferir":
        sys.exit(0 if hf.conferir(declarados, motivo, exato="--exato" in sys.argv[1:]) else 1)
    elif modo == "criar":
        criar_se_preciso()
        print("  repositorio pronto: https://huggingface.co/datasets/%s" % hf.REPO)
    elif modo == "subir":
        criar_se_preciso()
        hf.subir(args[1] if len(args) > 1 else "Atualiza o bundle France 2027", declarados, motivo)
    else:
        sys.exit("modo desconhecido: %s (use criar, conferir ou subir)" % modo)
