-- CreateIndex
CREATE INDEX "llm_calls_created_at_idx" ON "ai"."llm_calls"("created_at");

-- CreateIndex
CREATE INDEX "audit_log_created_at_idx" ON "governance"."audit_log"("created_at");

-- CreateIndex
CREATE INDEX "market_snapshots_fetched_at_idx" ON "market"."market_snapshots"("fetched_at");
