-- CreateTable
CREATE TABLE "ai"."model_outputs" (
    "id" UUID NOT NULL,
    "llm_run_id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "content_hash" TEXT NOT NULL,
    "classification" TEXT NOT NULL DEFAULT 'experimental',
    "review_status" TEXT NOT NULL DEFAULT 'pending',
    "reviewed_by" TEXT,
    "reviewed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "model_outputs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "model_outputs_llm_run_id_idx" ON "ai"."model_outputs"("llm_run_id");

-- CreateIndex
CREATE INDEX "model_outputs_classification_idx" ON "ai"."model_outputs"("classification");

-- CreateIndex
CREATE INDEX "model_outputs_review_status_idx" ON "ai"."model_outputs"("review_status");

-- CreateIndex
CREATE INDEX "model_outputs_created_at_idx" ON "ai"."model_outputs"("created_at");

-- AddForeignKey
ALTER TABLE "ai"."model_outputs" ADD CONSTRAINT "model_outputs_llm_run_id_fkey" FOREIGN KEY ("llm_run_id") REFERENCES "ai"."llm_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
