# Fontes do resultado oficial do 2º turno (25/10/2026)

Os documentos do TSE de onde saem `lib/brz/segundo-turno-2026.ts` e os cartões do 2º turno no painel. O resultado é gerado por script direto do arquivo oficial, sem número digitado à mão.

| documento | onde | SHA-256 |
|---|---|---|
| Totalização final da Presidência, 100% das seções, gerada em 25/10/2026 23:27:02 (Brasília), andamento `f` | `br-c0001-e006258-u.json`, nesta pasta, baixado de https://resultados.tse.jus.br/oficial/ele2026/6258/dados/br/br-c0001-e006258-u.json em 25/10/2026 | `67fae708b0c7977fc9847d36100c63313621bff971178c48f2da99969707c263` |
| "Relatório de Ocorrências de Urnas Substituídas e Votação Manual", 5º Boletim Informativo do 2º turno, ocorrências registradas até 25/10/2026 20:00, relatório gerado às 20:01:27 | https://www.tse.jus.br/eleicoes/eleicoes-2026-content/boletim-de-urna-2o-turno/20-00/relatorio_ocorrencias_urnas_substituidas_votacao_manual, baixado em 25/10/2026. Não está no repositório porque o `.gitignore` exclui todo PDF; a impressão digital ao lado identifica o arquivo lido | `16f1a531a93ea29b1e0b7a8c2a3b20cdfae436305cc2f36309333bbb0c2f7569` |
| "Quadro Geral de Quantitativos", mesmo boletim, gerado em 25/10/2026 20:01:27 | https://www.tse.jus.br/eleicoes/eleicoes-2026-content/boletim-de-urna-2o-turno/20-00/relatorio_quadro_geral_quantitativos, baixado em 25/10/2026, fora do repositório pelo mesmo motivo | `93d404f6f7c1a368cc823a71ef41658668a69401597d08ee0d05c0c49ac7bb29` |

Do relatório de ocorrências saem quatro números: urnas de votação 499.248, urnas de contingência 48.815, urnas substituídas 1.551 ("0,28%", sobre as 548.063 urnas somando as de contingência, a mesma base do 1º turno) e nenhuma seção com votação manual. O quadro geral confere 499.248 e 48.815. A página do boletim é https://www.tse.jus.br/comunicacao/noticias/2026/Outubro/5o-boletim-confira-as-principais-informacoes-das-eleicoes-neste-domingo-25

Às 18h o TSE tinha divulgado 1.516 substituições; o relatório das 20h soma 35 a mais. A votação terminou às 17h, então o relatório das 20h cobre o dia inteiro.
