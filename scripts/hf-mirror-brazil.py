"""
Espelho do dataset Brasil para o Hugging Face, com o CHECKSUMS gerado do que
foi DE FATO publicado.

Reproduz o passo de upload da esteira `.github/workflows/hf-dataset-mirror.yml`,
que roda:
    build-hf-poll-results -> build-tse-registry-full -> export-hf-dataset
    -> build-poll-enrichment -> upload

⚠️ UPLOAD CUMULATIVO, SEM DELETE, igual à esteira. Arquivo que existe no repo e
nao esta no staging NAO e apagado. E o que protege os 160 arquivos de datas
fechadas que este staging nao regenera.

🔴 POR QUE O CHECKSUMS E GERADO DEPOIS DO UPLOAD, e nao sobre o staging: o
staging tem 206 arquivos e o dataset publicado tem 366. Um manifesto feito sobre
o staging cobriria pouco mais da metade e daria a impressao de cobrir tudo. Num
dataset vivo, manifesto incompleto e pior que manifesto ausente. Entao: sobe o
staging, baixa a arvore publicada inteira, e so entao gera o manifesto.

Convencao identica a dos outros bundles padrao-ouro (.cache/standardize_dataset.py):
    sha256, dois espacos, caminho relativo com barra normal, linhas ordenadas,
    pulando CHECKSUMS.txt, datapackage.json e croissant.json.

Uso:
    python scripts/hf-mirror-brazil.py subir       -> upload do staging
    python scripts/hf-mirror-brazil.py checksums   -> gera e sobe o CHECKSUMS
"""
import hashlib
import os
import re
import sys
from pathlib import Path

from huggingface_hub import HfApi, snapshot_download

REPO = "AFOS-Analytics1/brazil-2026-electoral-divergence"
STAGING = Path(".cache/hf-dataset")
PULAR = {"CHECKSUMS.txt", "datapackage.json", "croissant.json"}
INTERNOS = {".cache", ".huggingface", ".git", ".gitattributes"}


def token() -> str:
    """
    Token do ambiente (na esteira vem do secret) ou do .env.local (na maquina).
    NUNCA do chat: o que se digita no chat fica gravado no transcrito, em disco.
    """
    do_ambiente = os.environ.get("HF_TOKEN", "").strip()
    if do_ambiente:
        return do_ambiente
    arq = Path(".env.local")
    if not arq.exists():
        sys.exit("HF_TOKEN ausente: nem no ambiente nem no .env.local")
    m = re.search(r"^HF_TOKEN\s*=\s*(.+)$", arq.read_text(encoding="utf-8", errors="ignore"), re.M)
    if not m:
        sys.exit("HF_TOKEN nao esta no .env.local")
    return m.group(1).strip().strip('"').strip("'")


def sha256(p: Path) -> str:
    h = hashlib.sha256()
    with p.open("rb") as f:
        for bloco in iter(lambda: f.read(1 << 20), b""):
            h.update(bloco)
    return h.hexdigest()


def data_do_dia() -> str:
    try:
        import json

        d = json.loads(Path("public/analysis-criteriosa.json").read_text(encoding="utf-8"))
        m = re.match(r"^(\d{2}/\d{2}/\d{4})", str(d.get("updatedAt", "")))
        if m:
            return m.group(1)
    except Exception:
        pass
    return ""


def subir():
    api = HfApi(token=token())
    if not STAGING.is_dir():
        sys.exit("staging ausente: rode a sequencia de build antes")
    n = sum(1 for p in STAGING.rglob("*") if p.is_file())
    print(f"subindo {n} arquivos de {STAGING} (cumulativo, sem delete)")
    api.upload_folder(
        repo_id=REPO,
        repo_type="dataset",
        folder_path=str(STAGING),
        commit_message=f"daily mirror - {data_do_dia()}".strip(" -"),
    )
    print("upload concluido")


# Colunas do consolidado diario. A 6a, `polymarket_date`, entrou em 05/Ago/2026
# junto da correcao de procedencia do preco: antes dela o export estampava a data
# do PAINEL como se fosse a data da leitura. As fatias anteriores a essa correcao
# nao declaram a data do preco, e por isso saem aqui com o campo VAZIO em vez de
# preenchido por suposicao. Vazio significa "a origem nao declarou", nunca "sem
# preco", e essa distincao e o motivo de nao inventar valor para elas.
COLUNAS_DIARIO = ["date", "candidate", "polymarket_pct", "poll_pct", "divergence_pp", "polymarket_date"]
RE_DIARIO = re.compile(r"^data/divergence-(\d{4}-\d{2}-\d{2})\.csv$")


def consolidar(raiz: Path):
    """
    Une as fatias diarias `data/divergence-AAAA-MM-DD.csv` num unico
    `data/divergence-daily-timeseries.csv`.

    POR QUE ELE EXISTE: as fatias sao a serie por DIA DE CAPTURA do mercado, e
    sao coisa DIFERENTE da `divergence-timeseries.csv`, que e indexada por DATA
    DE PESQUISA. Uma nao substitui a outra. Sao dezenas de arquivos, e nem o
    visualizador do HF nem um pesquisador abrem dezenas de arquivos: sem um
    consolidado, a serie mais longa do bundle fica publicada e ilegivel.

    🔴 AS FATIAS ESTAO EM DOIS FORMATOS, de 5 e de 6 colunas, e e por isso que
    declarar um glob unico no README NAO resolveria: o visualizador tenta
    empilhar esquemas diferentes e derruba o dataset inteiro. Quem uniformiza e
    esta funcao, no unico lugar onde da para fazer isso sem reescrever historico.

    ⛔ NAO reescreve nenhuma fatia. Todas continuam publicadas byte a byte e este
    arquivo e ADITIVO. Data encerrada nao se reescreve: erro em fatia antiga se
    corrige por ERRATA, como manda o contrato do bundle.
    """
    import csv

    linhas = []
    fatias = 0
    for p in sorted(raiz.glob("data/divergence-*.csv")):
        rel = p.relative_to(raiz).as_posix()
        if not RE_DIARIO.match(rel):
            continue  # pula divergence-timeseries.csv, que e a OUTRA serie
        fatias += 1
        with p.open(encoding="utf-8", newline="") as f:
            for reg in csv.DictReader(f):
                linhas.append([(reg.get(c) or "").strip() for c in COLUNAS_DIARIO])

    if not linhas:
        print("consolidado: nenhuma fatia diaria encontrada, nada a fazer")
        return None

    linhas.sort(key=lambda l: (l[0], l[1]))
    saida = raiz / "data" / "divergence-daily-timeseries.csv"
    with saida.open("w", encoding="utf-8", newline="") as f:
        w = csv.writer(f, lineterminator="\n")
        w.writerow(COLUNAS_DIARIO)
        w.writerows(linhas)

    dias = len({l[0] for l in linhas})
    sem_data = sum(1 for l in linhas if not l[5])
    print(
        f"consolidado: {len(linhas)} linhas de {fatias} fatias, {dias} dias distintos, "
        f"{sem_data} linhas sem polymarket_date declarada na origem"
    )
    return saida


def checksums():
    api = HfApi(token=token())
    destino = Path(".cache/hf-publicado")
    print("baixando a arvore publicada para conferir...")
    caminho = snapshot_download(
        repo_id=REPO, repo_type="dataset", local_dir=str(destino), token=token()
    )
    raiz = Path(caminho)

    # O consolidado diario roda AQUI e nao no export, pelo mesmo motivo do
    # manifesto: o staging tem so a fatia do dia, e a serie inteira so existe na
    # arvore PUBLICADA. Sobe antes do manifesto para entrar nele.
    consolidado = consolidar(raiz)
    if consolidado is not None:
        api.upload_file(
            path_or_fileobj=str(consolidado),
            path_in_repo="data/divergence-daily-timeseries.csv",
            repo_id=REPO,
            repo_type="dataset",
            commit_message="divergence-daily-timeseries: fatias diarias unidas numa serie navegavel",
        )
        print("divergence-daily-timeseries.csv publicado")

    arquivos = []
    for p in sorted(raiz.rglob("*")):
        if not p.is_file():
            continue
        rel = p.relative_to(raiz).as_posix()
        if rel in PULAR or any(seg in INTERNOS for seg in rel.split("/")):
            continue
        arquivos.append((rel, p))

    linhas = sorted(f"{sha256(p)}  {rel}" for rel, p in arquivos)
    saida = raiz / "CHECKSUMS.txt"
    saida.write_text("\n".join(linhas) + "\n", encoding="utf-8")
    print(f"CHECKSUMS.txt: {len(linhas)} arquivos, {saida.stat().st_size} bytes")

    api.upload_file(
        path_or_fileobj=str(saida),
        path_in_repo="CHECKSUMS.txt",
        repo_id=REPO,
        repo_type="dataset",
        commit_message="CHECKSUMS.txt: manifesto SHA-256 da arvore publicada",
    )
    print("CHECKSUMS.txt publicado")


if __name__ == "__main__":
    acao = sys.argv[1] if len(sys.argv) > 1 else ""
    if acao == "subir":
        subir()
    elif acao == "checksums":
        checksums()
    else:
        sys.exit("uso: python scripts/hf-mirror-brazil.py [subir|checksums]")
