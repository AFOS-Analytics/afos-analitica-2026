/**
 * Testa o alerta de PESQUISA NACIONAL NOVA de ponta a ponta, sem tocar na
 * caixa de produção.
 *
 * 🔴 POR QUE O DESTINATÁRIO É OBRIGATÓRIO E POR QUE `alerts@` É RECUSADO
 *
 * Em 13/Ago/2026 verifiquei o caminho positivo mandando para a caixa real. O
 * alerta falso chegou no `alerts@afos-analytics.com` e ali ficou: o correio do
 * domínio é Zoho, o projeto só tem chave de ENVIO (Resend) e não existe API que
 * apague mensagem já entregue. Ou seja, o teste sujou a caixa que ele deveria
 * proteger, e a sujeira era irreversível pelo nosso lado.
 *
 * Por isso aqui não há padrão. Sem `--para=` o script não roda.
 *
 * Uso:
 *   npx tsx scripts/testa-alerta-pesquisa.ts --para=voce+teste@gmail.com
 *
 * O QUE ELE PROVA, numa execução só, os três comportamentos:
 *   1. NACIONAL nova gera aviso
 *   2. ESTADUAL junto é descartada pelo filtro de escopo
 *   3. a mesma entrada repetida NÃO gera segundo aviso (trava do Redis)
 *
 * ⚠️ O protocolo sintético leva carimbo de tempo, então cada execução testa o
 * envio de verdade em vez de bater na trava da execução anterior. Foi esse o
 * detalhe que fez minha primeira asserção acusar falso: ela esperava 1 na
 * segunda rodada, quando 0 era o certo.
 */
import { config } from 'dotenv'
config({ path: '.env.local' })
config({ path: '.env' })

import { alertNewNationalPolls } from '../app/lib/cron/poll-alerts'
import { EMAIL_ALERTS } from '../app/lib/contacts'
import type { InsertedPoll } from '../lib/tse/persist'

const para = process.argv.find((a) => a.startsWith('--para='))?.split('=')[1]?.trim()

if (!para) {
  console.error('❌ falta --para=<email>. Sem destinatário este script não roda.')
  console.error('   Use um endereço descartável. Ver o cabeçalho do arquivo.')
  process.exit(1)
}
if (para.toLowerCase() === EMAIL_ALERTS.toLowerCase()) {
  console.error(`❌ ${EMAIL_ALERTS} é a caixa de PRODUÇÃO e está recusada de propósito.`)
  console.error('   Alerta de teste entregue lá não tem como ser apagado (Zoho, sem API de leitura).')
  process.exit(1)
}

// Carimbo de tempo: cada execução usa protocolo novo, senão a trava do Redis
// da rodada anterior mascararia uma quebra no envio.
const carimbo = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14)

const base = {
  registroDate: '2026-01-01',
  institutoFantasia: 'TESTE',
  cnpj: '00.000.000/0001-00',
  cargo: 'Presidente',
  campoInicio: '2026-01-01',
  campoFim: '2026-01-02',
  divulgacao: '2026-01-03',
  uf: 'BR',
  conre: 'TESTE',
  metodologia: 'teste',
  planoAmostral: 'teste',
  controlSystem: 'teste',
  dadoMunicipio: '',
  valorPesquisa: 0,
  estatistico: 'TESTE',
}

const amostra: InsertedPoll[] = [
  {
    ...base,
    protocolo: `TESTE-${carimbo}-NACIONAL`,
    instituto: 'INSTITUTO DE TESTE (ignore este email)',
    amostra: 2000,
    scope: 'national',
  },
  {
    ...base,
    protocolo: `TESTE-${carimbo}-ESTADUAL`,
    instituto: 'INSTITUTO DE TESTE ESTADUAL (nao deve aparecer)',
    amostra: 800,
    scope: 'state',
  },
]

async function main() {
  console.log(`destinatário: ${para}`)
  console.log(`protocolo desta rodada: TESTE-${carimbo}-*\n`)

  const primeira = await alertNewNationalPolls(amostra, para)
  const segunda = await alertNewNationalPolls(amostra, para)

  const okPrimeira = primeira === 1
  const okSegunda = segunda === 0

  console.log(`1ª chamada: ${primeira}  ${okPrimeira ? '✅' : '❌'}  esperado 1 (nacional avisa, estadual é filtrada)`)
  console.log(`2ª chamada: ${segunda}  ${okSegunda ? '✅' : '❌'}  esperado 0 (a trava do Redis segura a repetição)`)

  if (!okPrimeira || !okSegunda) {
    console.error('\n❌ REPROVADO. Não publicar mudança no alerta enquanto isto não fechar.')
    process.exitCode = 1
    return
  }
  console.log(`\n✅ APROVADO. Um email deve ter chegado em ${para}, e apenas um.`)
}

main().catch((e) => {
  console.error('❌ erro:', e)
  process.exitCode = 1
})
