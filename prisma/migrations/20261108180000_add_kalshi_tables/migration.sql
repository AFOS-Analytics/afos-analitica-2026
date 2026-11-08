-- Kalshi, o segundo livro de mercado (painel da França, 08/Nov/2026).
-- Tabelas PRÓPRIAS: nenhuma tabela market_* da Polymarket é alterada.

-- CreateTable
CREATE TABLE "market"."kalshi_capturas" (
    "id" UUID NOT NULL,
    "started_at" TIMESTAMPTZ(6) NOT NULL,
    "finished_at" TIMESTAMPTZ(6),
    "pais" TEXT NOT NULL,
    "event_ticker" TEXT NOT NULL,
    "ok" BOOLEAN NOT NULL,
    "defeitos" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "avisos" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "contratos" INTEGER NOT NULL DEFAULT 0,
    "gravados" INTEGER NOT NULL DEFAULT 0,
    "soma_precos" DOUBLE PRECISION,
    "origem" TEXT NOT NULL DEFAULT 'cron',

    CONSTRAINT "kalshi_capturas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "market"."kalshi_precos" (
    "id" UUID NOT NULL,
    "captura_id" UUID NOT NULL,
    "event_ticker" TEXT NOT NULL,
    "ticker" TEXT NOT NULL,
    "candidato" TEXT NOT NULL,
    "preco" DOUBLE PRECISION NOT NULL,
    "compra" DOUBLE PRECISION,
    "venda" DOUBLE PRECISION,
    "volume_contratos" DOUBLE PRECISION,
    "contratos_em_aberto" DOUBLE PRECISION,
    "ultima_negociacao_em" TIMESTAMPTZ(6),
    "snapshot_at" TIMESTAMPTZ(6) NOT NULL,
    "dedup_hash" TEXT NOT NULL,

    CONSTRAINT "kalshi_precos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "kalshi_capturas_started_at_idx" ON "market"."kalshi_capturas"("started_at");

-- CreateIndex
CREATE INDEX "kalshi_capturas_pais_started_at_idx" ON "market"."kalshi_capturas"("pais", "started_at");

-- CreateIndex
CREATE UNIQUE INDEX "kalshi_precos_dedup_hash_key" ON "market"."kalshi_precos"("dedup_hash");

-- CreateIndex
CREATE INDEX "kalshi_precos_ticker_snapshot_at_idx" ON "market"."kalshi_precos"("ticker", "snapshot_at");

-- CreateIndex
CREATE INDEX "kalshi_precos_event_ticker_snapshot_at_idx" ON "market"."kalshi_precos"("event_ticker", "snapshot_at");

-- CreateIndex
CREATE INDEX "kalshi_precos_snapshot_at_idx" ON "market"."kalshi_precos"("snapshot_at");

-- AddForeignKey
ALTER TABLE "market"."kalshi_precos" ADD CONSTRAINT "kalshi_precos_captura_id_fkey" FOREIGN KEY ("captura_id") REFERENCES "market"."kalshi_capturas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- A coluna "livro": junta os dois livros numa visão só de LEITURA, para
-- comparar Polymarket e Kalshi sem que um leitor antigo das market_* veja a
-- Kalshi. Preço em pontos (0 a 100) nos dois lados.
CREATE VIEW "market"."precos_por_livro" AS
SELECT
    'polymarket'::TEXT AS "livro",
    m."slug"           AS "contrato",
    o."outcome_name"   AS "candidato",
    p."price"          AS "preco",
    p."snapshot_at"    AS "snapshot_at"
FROM "market"."market_prices" p
JOIN "market"."markets" m ON m."id" = p."market_id"
LEFT JOIN "market"."market_outcomes" o ON o."id" = p."outcome_id"
UNION ALL
SELECT
    'kalshi'::TEXT     AS "livro",
    k."event_ticker"   AS "contrato",
    k."candidato"      AS "candidato",
    k."preco"          AS "preco",
    k."snapshot_at"    AS "snapshot_at"
FROM "market"."kalshi_precos" k;
