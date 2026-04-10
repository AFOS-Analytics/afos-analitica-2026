-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "market";

-- CreateTable
CREATE TABLE "market"."market_events" (
    "id" UUID NOT NULL,
    "polymarket_event_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "closed" BOOLEAN NOT NULL DEFAULT false,
    "event_start" TIMESTAMPTZ(6),
    "event_end" TIMESTAMPTZ(6),
    "raw_payload" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "market_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "market"."markets" (
    "id" UUID NOT NULL,
    "polymarket_market_id" TEXT NOT NULL,
    "event_id" UUID,
    "slug" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "closed" BOOLEAN NOT NULL DEFAULT false,
    "archived" BOOLEAN,
    "category" TEXT,
    "end_date" TIMESTAMPTZ(6),
    "raw_payload" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "markets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "market"."market_outcomes" (
    "id" UUID NOT NULL,
    "market_id" UUID NOT NULL,
    "outcome_key" TEXT NOT NULL,
    "outcome_name" TEXT NOT NULL,
    "token_id" TEXT,
    "raw_payload" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "market_outcomes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "market"."market_prices" (
    "id" UUID NOT NULL,
    "market_id" UUID NOT NULL,
    "outcome_id" UUID,
    "price" DOUBLE PRECISION NOT NULL,
    "volume" DOUBLE PRECISION,
    "liquidity" DOUBLE PRECISION,
    "snapshot_at" TIMESTAMPTZ(6) NOT NULL,
    "source_type" TEXT NOT NULL DEFAULT 'cron',
    "dedup_hash" TEXT NOT NULL,

    CONSTRAINT "market_prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "market"."forecast_snapshots" (
    "id" UUID NOT NULL,
    "market_id" UUID NOT NULL,
    "snapshot_date" DATE NOT NULL,
    "probability_yes" DOUBLE PRECISION,
    "probability_no" DOUBLE PRECISION,
    "spread" DOUBLE PRECISION,
    "confidence" DOUBLE PRECISION,
    "raw_payload" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "forecast_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "market_events_polymarket_event_id_key" ON "market"."market_events"("polymarket_event_id");

-- CreateIndex
CREATE INDEX "market_events_slug_idx" ON "market"."market_events"("slug");

-- CreateIndex
CREATE INDEX "market_events_active_idx" ON "market"."market_events"("active");

-- CreateIndex
CREATE INDEX "market_events_created_at_idx" ON "market"."market_events"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "markets_polymarket_market_id_key" ON "market"."markets"("polymarket_market_id");

-- CreateIndex
CREATE INDEX "markets_slug_idx" ON "market"."markets"("slug");

-- CreateIndex
CREATE INDEX "markets_active_idx" ON "market"."markets"("active");

-- CreateIndex
CREATE INDEX "markets_category_idx" ON "market"."markets"("category");

-- CreateIndex
CREATE INDEX "markets_created_at_idx" ON "market"."markets"("created_at");

-- CreateIndex
CREATE INDEX "market_outcomes_market_id_idx" ON "market"."market_outcomes"("market_id");

-- CreateIndex
CREATE UNIQUE INDEX "market_outcomes_market_id_outcome_key_key" ON "market"."market_outcomes"("market_id", "outcome_key");

-- CreateIndex
CREATE UNIQUE INDEX "market_prices_dedup_hash_key" ON "market"."market_prices"("dedup_hash");

-- CreateIndex
CREATE INDEX "market_prices_market_id_snapshot_at_idx" ON "market"."market_prices"("market_id", "snapshot_at");

-- CreateIndex
CREATE INDEX "market_prices_outcome_id_snapshot_at_idx" ON "market"."market_prices"("outcome_id", "snapshot_at");

-- CreateIndex
CREATE INDEX "market_prices_snapshot_at_idx" ON "market"."market_prices"("snapshot_at");

-- CreateIndex
CREATE INDEX "forecast_snapshots_market_id_snapshot_date_idx" ON "market"."forecast_snapshots"("market_id", "snapshot_date");

-- CreateIndex
CREATE UNIQUE INDEX "forecast_snapshots_market_id_snapshot_date_key" ON "market"."forecast_snapshots"("market_id", "snapshot_date");

-- AddForeignKey
ALTER TABLE "market"."markets" ADD CONSTRAINT "markets_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "market"."market_events"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "market"."market_outcomes" ADD CONSTRAINT "market_outcomes_market_id_fkey" FOREIGN KEY ("market_id") REFERENCES "market"."markets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "market"."market_prices" ADD CONSTRAINT "market_prices_market_id_fkey" FOREIGN KEY ("market_id") REFERENCES "market"."markets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "market"."market_prices" ADD CONSTRAINT "market_prices_outcome_id_fkey" FOREIGN KEY ("outcome_id") REFERENCES "market"."market_outcomes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "market"."forecast_snapshots" ADD CONSTRAINT "forecast_snapshots_market_id_fkey" FOREIGN KEY ("market_id") REFERENCES "market"."markets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
