import json
import sys
sys.stdout.reconfigure(encoding='utf-8')

urls = json.load(open('C:/Users/afos3/AppData/Local/Temp/urls18b.json', encoding='utf-8'))

# Inject the 4 missing URLs known from previous grep
manual_anchors = {
    'a_oglobo_messias_senado': 'https://oglobo.globo.com/politica/noticia/2026/05/18/ato-do-senado-impede-nova-indicacao-de-messias-ao-stf-mas-governo-ve-negociacao.ghtml',
    'a_valor_atlas_atlas': 'https://valor.globo.com/politica/noticia/2026/05/18/a-pesquisa-atlasintel-que-vai-testar-o-impacto-de-vorcaro-sobre-flavio-bolsonaro.ghtml',
    'a_oglobo_traumann': 'https://oglobo.globo.com/politica/thomas-traumann/coluna/2026/05/candidatura-de-flavio-bolsonaro-depende-da-delacao-de-vorcaro.ghtml',
    'a_folha_30bi_carros': 'https://www1.folha.uol.com.br/mercado/2026/05/lula-anunciara-r-30-bi-para-financiar-carros-de-motoristas.shtml',
}
for k, v in manual_anchors.items():
    if k not in urls:
        urls[k] = v

template = open('C:/Users/afos3/OneDrive/Documentos/MeusProjetos/AFOS-Analitica-2026/scripts/daily-18mai-template.md', encoding='utf-8').read()
for k, v in urls.items():
    template = template.replace('{{' + k + '}}', v)

out_path = 'C:/Users/afos3/OneDrive/Documentos/MeusProjetos/AFOS-Analitica-2026/public/afos-daily/2026-05-18.md'
# Write with LF only line endings to avoid CRLF translator issue
with open(out_path, 'w', encoding='utf-8', newline='\n') as f:
    f.write(template)
print(f'Wrote {len(template)} chars')

# Verify URL lengths
print('URL lengths:')
for k, v in urls.items():
    print(f'  {k}: {len(v)}')
