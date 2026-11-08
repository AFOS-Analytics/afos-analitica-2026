# -*- coding: utf-8 -*-
"""Banner OG do bundle FRANCE 2027 presidential, 1200x630. Criado 08/Nov/2026.

Copia a estrutura do banner dos EUA (safira da casa; quem declara o pais e a
BANDEIRA desenhada mais o rotulo escrito). Sem numero nenhum, como o cartao do
painel: o banner fica no topo do cartao para sempre e numero envelheceria.

Rodar: python scripts/build-fr-2027-banner.py
Saida: .cache/fr2027-dataset/banner.png
"""
import os
from PIL import Image, ImageDraw, ImageFont

OUT = os.environ.get('FR2027_OUT', os.path.join('.cache', 'fr2027-dataset'))
W, H = 1200, 630
C_ESQ = (15, 82, 186)
C_DIR = (8, 42, 98)
BRANCO = (255, 255, 255)
SUAVE = (183, 203, 240)


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

# ── tricolor da Franca, 96x64, cantos arredondados ─────────────────────────────
BX, BY, BW, BH = 72, 150, 96, 64
band = Image.new('RGBA', (BW * 4, BH * 4), (0, 0, 0, 0))
bd = ImageDraw.Draw(band)
for i, cor in enumerate([(0, 35, 149), BRANCO, (237, 41, 57)]):
    bd.rectangle([i * BW * 4 / 3, 0, (i + 1) * BW * 4 / 3, BH * 4], fill=cor)
mask = Image.new('L', (BW * 4, BH * 4), 0)
ImageDraw.Draw(mask).rounded_rectangle([0, 0, BW * 4 - 1, BH * 4 - 1], radius=28, fill=255)
band.putalpha(mask)
img.paste(band.resize((BW, BH), Image.LANCZOS), (BX, BY), band.resize((BW, BH), Image.LANCZOS))

d.text((72, 68), 'AFOS ANALYTICS', font=fonte(22, True), fill=SUAVE)
topo_dir = 'Open dataset · CC BY 4.0'
f_td = fonte(22)
d.text((W - 72 - d.textlength(topo_dir, font=f_td), 68), topo_dir, font=f_td, fill=SUAVE)

d.text((72, 240), 'France 2027 Presidential', font=fonte(62, True), fill=BRANCO)
d.text((72, 312), 'Electoral Divergence', font=fonte(62, True), fill=BRANCO)
d.text((72, 410), 'Two prediction markets × polls, before the vote.', font=fonte(28), fill=(222, 233, 250))

x = 72
for texto in ['Polymarket', 'Kalshi', 'Pre-electoral', 'EN · PT · ES']:
    f = fonte(21)
    larg = d.textlength(texto, font=f) + 42
    d.rounded_rectangle([x, 522, x + larg, 568], radius=23, outline=(126, 158, 219), width=2)
    d.text((x + 21, 534), texto, font=f, fill=(214, 228, 249))
    x += larg + 16

os.makedirs(OUT, exist_ok=True)
caminho = os.path.join(OUT, 'banner.png')
img.save(caminho, 'PNG')
print('banner:', caminho, img.size)
