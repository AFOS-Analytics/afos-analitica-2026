# AFOS Analytics — Atualização de Pesquisas Eleitorais (TSE)

Executar ingestão de pesquisas eleitorais do TSE e cruzamento com Polymarket.

## Passos

1. Acionar o endpoint `/api/cron/refresh-polls` para baixar pesquisas do TSE
2. Verificar resultado: total de pesquisas, novas inseridas, cruzamento com Polymarket
3. Consultar `/api/polls/tse?days=15` para ver pesquisas recentes
4. Reportar ao usuário:
   - Quantas pesquisas novas foram registradas
   - Quais institutos publicaram recentemente
   - Cruzamento com odds Polymarket atuais
   - Pesquisas com campo ativo ou publicação prevista

## Comando

```bash
curl -s https://www.afos-analytics.com/api/cron/refresh-polls \
  -H "Authorization: Bearer $CRON_SECRET" | jq .
```

## Consulta

```bash
curl -s "https://www.afos-analytics.com/api/polls/tse?days=15" | jq .
```
