# -*- coding: utf-8 -*-
"""
Teste do portao de encolhimento do `hf-upload-us2026.py`, sem rede.

🔴 O caso que motivou, de 13/Set/2026: qualquer excecao na leitura do HF virava
"arquivo NOVO", e o portao APROVAVA sem ter comparado nada. Certificado recusado
ou rede caida faziam o `subir` seguir justamente quando nao se enxergava o que
estava publicado. Metade dos casos e desse lado: o portao que NAO pode aprovar.

Uso:  python scripts/testar-hf-upload-us2026.py
"""
import importlib.util
import io
import os
import sys
import tempfile
import urllib.error
from contextlib import redirect_stdout
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
# Importar o script geraria scripts/__pycache__/ na arvore compartilhada.
sys.dont_write_bytecode = True
spec =importlib.util.spec_from_file_location("hfup", RAIZ / "scripts" / "hf-upload-us2026.py")
hfup = importlib.util.module_from_spec(spec)
spec.loader.exec_module(hfup)

falhas = 0
passes = 0


def ok(nome, cond, detalhe=""):
    global falhas, passes
    if cond:
        passes += 1
        print("  ✅ %s" % nome)
    else:
        falhas += 1
        print("  ❌ %s%s" % (nome, (" — " + detalhe) if detalhe else ""))


class Resposta:
    def __init__(self, texto):
        self.texto = texto

    def read(self):
        return self.texto.encode("utf-8")

    def __enter__(self):
        return self

    def __exit__(self, *a):
        return False


def publicado(mapa):
    """urlopen falso. Valor str = conteudo publicado; int = HTTPError; Exception = levanta."""
    def urlopen(req, timeout=None):
        rel = req.full_url.split("/resolve/main/", 1)[1]
        v = mapa.get(rel, 404)
        if isinstance(v, BaseException):
            raise v
        if isinstance(v, int):
            raise urllib.error.HTTPError(req.full_url, v, "x", {}, None)
        return Resposta(v)
    return urlopen


def linhas(n):
    return "".join("l%d\n" % i for i in range(n))


def rodar(staging, mapa, **kw):
    import urllib.request
    original = urllib.request.urlopen
    urllib.request.urlopen = publicado(mapa)
    hfup.STAGING = staging
    buf = io.StringIO()
    try:
        with redirect_stdout(buf):
            r = hfup.conferir(**kw)
    finally:
        urllib.request.urlopen = original
    return r, buf.getvalue()


with tempfile.TemporaryDirectory() as tmp:
    st = Path(tmp)
    (st / "markets").mkdir()
    (st / "markets" / "house-control.csv").write_text(linhas(10), encoding="utf-8")
    (st / "polls.csv").write_text(linhas(5), encoding="utf-8")
    AMBOS_OK = {"markets/house-control.csv": linhas(8), "polls.csv": linhas(5)}

    print("\n🔴 o portao que NAO pode aprovar sem enxergar")
    r, out = rodar(st, {"markets/house-control.csv": urllib.error.URLError("CERTIFICATE_VERIFY_FAILED"), "polls.csv": linhas(5)})
    ok("certificado recusado BLOQUEIA", r is False, out)
    ok("e diz que nao leu", "NAO LIDO" in out)
    r, _ = rodar(st, {"markets/house-control.csv": TimeoutError("timed out"), "polls.csv": urllib.error.URLError("x")})
    ok("rede caida em todos BLOQUEIA", r is False)
    r, _ = rodar(st, {"markets/house-control.csv": 500, "polls.csv": linhas(5)})
    ok("HTTP 500 BLOQUEIA", r is False)
    r, _ = rodar(st, {"markets/house-control.csv": 403, "polls.csv": linhas(5)})
    ok("HTTP 403 BLOQUEIA", r is False)

    print("\n✅ o que continua aprovando")
    r, out = rodar(st, {"markets/house-control.csv": 404, "polls.csv": linhas(5)})
    ok("404 e arquivo NOVO, aprova", r is True, out)
    ok("e aparece como NOVO", "NOVO" in out)
    r, _ = rodar(st, AMBOS_OK)
    ok("serie que cresceu aprova", r is True)

    print("\n📉 encolhimento")
    r, _ = rodar(st, {"markets/house-control.csv": linhas(12), "polls.csv": linhas(5)})
    ok("encolheu sem declarar BLOQUEIA", r is False)
    r, _ = rodar(st, {"markets/house-control.csv": linhas(12), "polls.csv": linhas(5)}, declarados={"markets/house-control.csv": -2})
    ok("encolheu o declarado exato aprova", r is True)
    r, _ = rodar(st, {"markets/house-control.csv": linhas(12), "polls.csv": linhas(5)}, declarados={"markets/house-control.csv": -1})
    ok("encolheu diferente do declarado BLOQUEIA", r is False)
    r, _ = rodar(st, AMBOS_OK, declarados={"polls.csv": -3})
    ok("declarado que nao encolheu BLOQUEIA", r is False)

    print("\n🔁 depois de subir: --exato")
    r, _ = rodar(st, {"markets/house-control.csv": linhas(10), "polls.csv": linhas(5)}, exato=True)
    ok("publicado igual ao staging confere", r is True)
    r, out = rodar(st, AMBOS_OK, exato=True)
    ok("publicado MENOR que o staging nao confere (subida nao chegou)", r is False, out)
    r, out = rodar(st, {"markets/house-control.csv": 404, "polls.csv": linhas(5)}, exato=True)
    ok("arquivo ausente depois de subir nao confere", r is False)
    ok("e diz NAO CHEGOU", "NAO CHEGOU" in out)
    r, _ = rodar(st, {"markets/house-control.csv": urllib.error.URLError("x"), "polls.csv": linhas(5)}, exato=True)
    ok("nao lido depois de subir tambem nao confere", r is False)

print("\n🔐 confiar_no_sistema")
antes = dict(os.environ)
os.environ["SSL_CERT_FILE"] = "ja-definido.pem"
hfup.confiar_no_sistema()
ok("SSL_CERT_FILE ja definido nao e sobrescrito", os.environ["SSL_CERT_FILE"] == "ja-definido.pem")
del os.environ["SSL_CERT_FILE"]
plataforma = sys.platform
try:
    sys.platform = "linux"
    hfup.confiar_no_sistema()
    ok("fora do Windows nao faz nada", "SSL_CERT_FILE" not in os.environ)
finally:
    sys.platform = plataforma
os.environ.clear()
os.environ.update(antes)

print("\n%s %d passaram, %d falharam\n" % ("❌" if falhas else "✅", passes, falhas))
sys.exit(1 if falhas else 0)
