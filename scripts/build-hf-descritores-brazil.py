"""
Descritores legiveis por maquina do dataset Brasil 2026 FECHADO:
`datapackage.json` (Frictionless) e `croissant.json` (MLCommons Croissant 1.0).

POR QUE EXISTE (01/Nov/2026): os dois descritores tinham sido escritos a mao em
25/Jul, com o hash SHA-256 de sete tabelas, e nunca mais regerados. O dataset
seguiu mudando todo dia, e em 01/Nov os sete hashes estavam velhos: o validador
Frictionless REPROVAVA o pacote por `hash-count`, embora as sete tabelas fossem
validas. Descritor velho e pior que descritor ausente, porque quem confere conclui
adulteracao. Agora eles saem da ARVORE PUBLICADA, no mesmo passo do CHECKSUMS.

Com a eleicao encerrada o dataset foi congelado (espelho diario desligado em
01/Nov/2026), entao os descritores passam a cobrir TODAS as tabelas finais, e
nao so as sete "estaveis": pesquisas, series de divergencia e de mercado,
resultado oficial dos dois turnos, noites da apuracao e os PDFs do relatorio.

⛔ FALHA FECHADO: se o pacote gerado nao passar no `frictionless validate`, nada
e gravado. Os esquemas das sete tabelas originais sao PRESERVADOS (tipos e
descricoes escritos a mao); os demais sao inferidos pelo Frictionless.

Uso:
    python scripts/build-hf-descritores-brazil.py <raiz-da-arvore-publicada>
"""
import hashlib
import json
import sys
from pathlib import Path

VERSAO = "2.0.0"
CONGELADO = "2026-11-01"

TABELAS = [
    "polls/tse-registry.csv",
    "polls/national-poll-results-firstround.csv",
    "polls/national-poll-results-secondround.csv",
    "polls/sample-demographics.csv",
    "data/poll-divergence.csv",
    "data/divergence-timeseries.csv",
    "data/divergence-daily-timeseries.csv",
    "data/market-odds-timeseries.csv",
    "results/first-round-2026-candidates.csv",
    "results/first-round-2026-summary.csv",
    "results/first-round-2026-retrospective.csv",
    "results/first-round-2026-retrospective-summary.csv",
    "results/second-round-2026-candidates.csv",
    "results/second-round-2026-summary.csv",
    "results/second-round-2026-retrospective.csv",
    "results/second-round-2026-retrospective-summary.csv",
    "election-night/first-round-2026-live.csv",
    "election-night/second-round-2026-live.csv",
    "election-night/second-round-2026-trades.csv",
    "election-night/second-round-2026-holders.csv",
]
PDFS = [
    "final-report/relatorio-final-brasil-2026-v1.1-31out.pdf",
    "final-report/brazil-2026-closing-report-v1.1-31oct.pdf",
    "final-report/informe-de-cierre-brasil-2026-v1.1-31oct.pdf",
    "final-report/relatorio-final-brasil-2026-v1.0-26out.pdf",
]

DESCRICAO = (
    "Brazil's 2026 presidential election (first round 2026-10-04, runoff 2026-10-25), closed dataset. "
    "It cross-references opinion polls registered with the Tribunal Superior Eleitoral (TSE), Polymarket "
    "prices recorded by AFOS every 30 minutes and the press record, and adds the official TSE result of "
    "both rounds, the two election nights and the AFOS closing report in Portuguese, English and Spanish. "
    f"Frozen on {CONGELADO}: no files are added after this version. These descriptors cover every final "
    "table and the report PDFs; the dated daily files under snapshots/, news/, polls/ and data/ are covered "
    "file by file by CHECKSUMS.txt."
)
FONTES = [
    {"title": "Tribunal Superior Eleitoral (TSE): poll registry (Open Data) and official result files of both rounds",
     "path": "https://dadosabertos.tse.jus.br"},
    {"title": "Polymarket prices and trades, read by AFOS from the public API and the Polygon blockchain. "
              "AFOS is not affiliated with Polymarket; see DATASHEET.md, section 6",
     "path": "https://polymarket.com"},
    {"title": "Public news links, named outlets"},
]
TIPOS_CROISSANT = {
    "string": "sc:Text", "integer": "sc:Integer", "number": "sc:Float", "boolean": "sc:Boolean",
    "date": "sc:Date", "datetime": "sc:DateTime", "time": "sc:Text", "year": "sc:Integer",
}


def sha256(p: Path) -> str:
    h = hashlib.sha256()
    with p.open("rb") as f:
        for bloco in iter(lambda: f.read(1 << 20), b""):
            h.update(bloco)
    return h.hexdigest()


def nome(caminho: str) -> str:
    return caminho.rsplit(".", 1)[0].replace("/", "-").replace("_", "-").lower()


def gerar(raiz: Path):
    from frictionless import Resource, validate

    antigos = {}
    dp_antigo = raiz / "datapackage.json"
    if dp_antigo.exists():
        for r in json.loads(dp_antigo.read_text(encoding="utf-8")).get("resources", []):
            if r.get("path") and r.get("schema"):
                antigos[r["path"]] = r["schema"]

    faltando = [c for c in TABELAS + PDFS if not (raiz / c).is_file()]
    if faltando:
        sys.exit(f"descritores: arquivos ausentes na arvore publicada: {faltando}")

    recursos = []
    for c in TABELAS:
        p = raiz / c
        if c in antigos:
            esquema = antigos[c]
        else:
            r = Resource(path=c, basepath=str(raiz))
            r.infer(stats=False)
            esquema = r.schema.to_descriptor()
        recursos.append({
            "name": nome(c), "type": "table", "path": c, "scheme": "file", "format": "csv",
            "mediatype": "text/csv", "encoding": "utf-8", "bytes": p.stat().st_size,
            "hash": "sha256:" + sha256(p), "schema": esquema,
        })
    for c in PDFS:
        p = raiz / c
        recursos.append({
            "name": nome(c), "type": "file", "path": c, "scheme": "file", "format": "pdf",
            "mediatype": "application/pdf", "bytes": p.stat().st_size, "hash": "sha256:" + sha256(p),
        })

    dp = {
        "name": "brazil-2026-electoral-divergence",
        "title": "Brazil 2026 Electoral Divergence Dataset",
        "description": DESCRICAO,
        "version": VERSAO,
        "created": "2026-07-25T00:00:00Z",
        "homepage": "https://huggingface.co/datasets/AFOS-Analytics1/brazil-2026-electoral-divergence",
        "keywords": ["elections", "prediction-markets", "opinion-polls", "electoral-divergence", "open-data", "brazil"],
        "licenses": [{"name": "CC-BY-4.0", "title": "Creative Commons Attribution 4.0",
                      "path": "https://creativecommons.org/licenses/by/4.0/"}],
        "contributors": [{"title": "AFOS Analytics", "role": "author", "path": "https://afos-analytics.com"}],
        "sources": FONTES,
        "resources": recursos,
    }

    # Valida ANTES de gravar: o candidato vai para um arquivo provisorio, e so
    # substitui o datapackage.json publicado se passar.
    candidato = raiz / ".datapackage.candidato.json"
    candidato.write_text(json.dumps(dp, ensure_ascii=False, indent=2), encoding="utf-8")
    try:
        relatorio = validate(str(candidato))
    finally:
        candidato.unlink()
    if not relatorio.valid:
        for t in relatorio.tasks:
            if not t.valid:
                for e in t.errors[:5]:
                    print(f"  {t.name}: {e.type}: {e.message}")
        sys.exit("descritores: frictionless REPROVOU o pacote, nada gravado")

    distrib, conjuntos = [], []
    for r in recursos:
        distrib.append({
            "@type": "cr:FileObject", "@id": r["path"], "name": r["path"], "contentUrl": r["path"],
            "encodingFormat": r["mediatype"], "sha256": r["hash"].split(":", 1)[1],
        })
        if r["type"] != "table":
            continue
        conjuntos.append({
            "@type": "cr:RecordSet", "@id": r["name"], "name": r["name"],
            "field": [{
                "@type": "cr:Field", "@id": f"{r['name']}/{f['name']}", "name": f["name"],
                "dataType": TIPOS_CROISSANT.get(f.get("type", "string"), "sc:Text"),
                "source": {"fileObject": {"@id": r["path"]}, "extract": {"column": f["name"]}},
            } for f in r["schema"]["fields"]],
        })
    cr = {
        "@context": {
            "@vocab": "https://schema.org/", "cr": "http://mlcommons.org/croissant/", "sc": "https://schema.org/",
            "dataType": {"@id": "cr:dataType", "@type": "@vocab"}, "field": "cr:field",
            "fileObject": "cr:fileObject", "recordSet": "cr:recordSet", "source": "cr:source",
            "extract": "cr:extract", "column": "cr:column",
        },
        "@type": "sc:Dataset",
        "cr:conformsTo": "http://mlcommons.org/croissant/1.0",
        "name": dp["name"], "description": DESCRICAO,
        "license": "https://creativecommons.org/licenses/by/4.0/",
        "url": dp["homepage"], "version": VERSAO, "dateModified": CONGELADO,
        "citation": "AFOS Analytics (2026). Brazil 2026 Electoral Divergence Dataset. Harvard Dataverse, "
                    "https://doi.org/10.7910/DVN/2D0UK7",
        "keywords": dp["keywords"],
        "distribution": distrib, "recordSet": conjuntos,
    }

    (raiz / "datapackage.json").write_text(json.dumps(dp, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (raiz / "croissant.json").write_text(json.dumps(cr, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"descritores: {len(TABELAS)} tabelas e {len(PDFS)} PDFs, frictionless VALIDO, versao {VERSAO}")
    return raiz / "datapackage.json", raiz / "croissant.json"


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit("uso: python scripts/build-hf-descritores-brazil.py <raiz>")
    gerar(Path(sys.argv[1]))
