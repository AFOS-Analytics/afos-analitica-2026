# -*- coding: utf-8 -*-
"""Banner OG do bundle US 2026 midterms, 1200x630.

Estrutura espelha o banner do Brasil; a COR nao, porque a regua da casa e que a
cor separa PAIS: Brasil ambar/azul, EUA verde-azulado.

A bandeira e DESENHADA em vez de renderizada como emoji: fonte de emoji varia
entre maquinas e um banner que sai diferente em cada build nao e reproduzivel.

Rodar: python scripts/build-us-2026-banner.py
Saida: .cache/us2026-dataset/banner.png
"""
import os
from PIL import Image, ImageDraw, ImageFont

OUT = os.environ.get('US2026_OUT', os.path.join('.cache', 'us2026-dataset'))
W, H = 1200, 630

# paleta verde-azulada: EUA
C_ESQ = (12, 74, 78)
C_DIR = (7, 46, 58)
BRANCO = (255, 255, 255)
SUAVE = (168, 205, 208)


def fonte(tamanho, negrito=False):
    candidatos = (
        ['C:/Windows/Fonts/segoeuib.ttf', 'C:/Windows/Fonts/arialbd.ttf']
        if negrito else
        ['C:/Windows/Fonts/segoeui.ttf', 'C:/Windows/Fonts/arial.ttf']
    )
    for c in candidatos:
        if os.path.exists(c):
            return ImageFont.truetype(c, tamanho)
    return ImageFont.load_default()


img = Image.new('RGB', (W, H), C_DIR)
d = ImageDraw.Draw(img)

# gradiente diagonal suave
for y in range(H):
    for faixa in range(1):
        t = y / H
        cor = tuple(int(C_ESQ[i] + (C_DIR[i] - C_ESQ[i]) * t) for i in range(3))
        d.line([(0, y), (W, y)], fill=cor)

# ── bandeira dos EUA, 96x64, cantos arredondados ───────────────────────────────
BX, BY, BW, BH = 72, 150, 96, 64
band = Image.new('RGBA', (BW * 4, BH * 4), (0, 0, 0, 0))
bd = ImageDraw.Draw(band)
VERMELHO = (178, 34, 52)
AZUL = (60, 59, 110)
listra = (BH * 4) / 13.0
for i in range(13):
    bd.rectangle([0, i * listra, BW * 4, (i + 1) * listra],
                 fill=VERMELHO if i % 2 == 0 else BRANCO)
cantao_h = listra * 7
bd.rectangle([0, 0, BW * 4 * 0.42, cantao_h], fill=AZUL)
# estrelas simplificadas em grade 6x5, pontos e nao poligonos: em 24px de altura
# real, uma estrela de 5 pontas vira mancha, e o ponto le melhor
for lin in range(5):
    for col in range(6):
        cx = (BW * 4 * 0.42) * (col + 0.5) / 6
        cy = cantao_h * (lin + 0.5) / 5
        r = 3.4
        bd.ellipse([cx - r, cy - r, cx + r, cy + r], fill=BRANCO)
mask = Image.new('L', (BW * 4, BH * 4), 0)
ImageDraw.Draw(mask).rounded_rectangle([0, 0, BW * 4 - 1, BH * 4 - 1], radius=28, fill=255)
band.putalpha(mask)
img.paste(band.resize((BW, BH), Image.LANCZOS), (BX, BY), band.resize((BW, BH), Image.LANCZOS))

# ── textos ─────────────────────────────────────────────────────────────────────
d.text((72, 68), 'AFOS ANALYTICS', font=fonte(22, True), fill=SUAVE)
topo_dir = 'Open dataset · CC BY 4.0'
f_td = fonte(22)
d.text((W - 72 - d.textlength(topo_dir, font=f_td), 68), topo_dir, font=f_td, fill=SUAVE)

d.text((72, 240), 'US 2026 Midterms', font=fonte(62, True), fill=BRANCO)
d.text((72, 312), 'Electoral Divergence', font=fonte(62, True), fill=BRANCO)
d.text((72, 410), 'Prediction market × polls, before the vote.', font=fonte(28), fill=(226, 242, 243))

# ── pilulas ────────────────────────────────────────────────────────────────────
x = 72
for texto in ['Reproducible', 'Pre-electoral', 'EN']:
    f = fonte(21)
    larg = d.textlength(texto, font=f) + 42
    d.rounded_rectangle([x, 522, x + larg, 568], radius=23, outline=(120, 170, 175), width=2)
    d.text((x + 21, 534), texto, font=f, fill=(214, 235, 236))
    x += larg + 16

rodape = 'huggingface.co/AFOS-Analytics1'
f_r = fonte(22)
d.text((W - 72 - d.textlength(rodape, font=f_r), 534), rodape, font=f_r, fill=SUAVE)

os.makedirs(OUT, exist_ok=True)
caminho = os.path.join(OUT, 'banner.png')
img.save(caminho, 'PNG')
print('banner:', caminho, img.size)
