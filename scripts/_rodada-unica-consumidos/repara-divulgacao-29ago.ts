import { config } from 'dotenv'
config({ path: '.env.local' }); config({ path: '.env' })
import { fetchTSEPolls } from '../../lib/tse/ingest'

const APLICAR = process.argv.includes('--apply')

async function main() {
  const { getPrisma } = await import('../../lib/db')
  const prisma = getPrisma()!
  const arq: any[] = (await fetchTSEPolls()) as any
  const porProt = new Map(arq.map((p: any) => [p.protocolo, p]))
  const banco = await prisma.researchFinding.findMany({ select: { id: true, title: true, rawPayload: true, normalizedPayload: true } })

  const consertos: any[] = []
  for (const f of banco) {
    const n: any = porProt.get(f.title); if (!n) continue
    const raw: any = f.rawPayload, nor: any = f.normalizedPayload
    const certo = String(n.divulgacao)
    const mudaRaw = String(raw?.divulgacao) !== certo
    const mudaNor = String(nor?.publicationDate) !== certo
    if (!mudaRaw && !mudaNor) continue
    // ⛔ só corrige o desvio de UM DIA. Revisão real do TSE (delta != 1) fica de fora.
    const d = (Date.parse(String(raw?.divulgacao)) - Date.parse(certo)) / 86400000
    if (d !== 1) { console.log(`  ⏭️ ${f.title}: delta ${d}d, NAO e o off-by-one, deixado como esta`); continue }
    consertos.push({ id: f.id, prot: f.title, de: raw.divulgacao, para: certo, raw, nor })
  }

  console.log(`\n${consertos.length} linha(s) a corrigir (só o desvio de +1 dia):`)
  for (const c of consertos) console.log(`  ${c.prot}  ${c.de} -> ${c.para}`)

  if (!APLICAR) { console.log('\n🔵 ENSAIO. Repita com --apply para gravar.'); return }

  let n = 0
  for (const c of consertos) {
    await prisma.researchFinding.update({
      where: { id: c.id },
      data: {
        rawPayload: { ...c.raw, divulgacao: c.para },
        normalizedPayload: { ...c.nor, publicationDate: c.para },
      },
    })
    n++
  }
  console.log(`\n✅ ${n} linha(s) corrigida(s).`)

  // reconferência: o banco passa a bater com o TSE?
  const depois = await prisma.researchFinding.findMany({ select: { title: true, rawPayload: true, normalizedPayload: true } })
  let resta = 0
  for (const f of depois) {
    const nn: any = porProt.get(f.title); if (!nn) continue
    const r: any = f.rawPayload, no: any = f.normalizedPayload
    if (String(r?.divulgacao) !== String(nn.divulgacao) || String(no?.publicationDate) !== String(nn.divulgacao)) resta++
  }
  console.log(`divergências de data restantes contra o TSE: ${resta}`)
}
main().catch((e) => { console.error(e); process.exit(1) })
