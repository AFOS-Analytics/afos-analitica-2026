-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "ai";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "crm";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "governance";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "iam";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "market";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "research";

-- CreateTable
CREATE TABLE "governance"."audit_log" (
    "id" TEXT NOT NULL,
    "actor" TEXT,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "detail" JSONB,
    "ip" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "governance"."system_events" (
    "id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "system_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "governance"."data_versions" (
    "id" TEXT NOT NULL,
    "table_name" TEXT NOT NULL,
    "record_id" TEXT NOT NULL,
    "old_data" JSONB,
    "new_data" JSONB,
    "changed_by" TEXT,
    "changed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "data_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm"."leads" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "consent_version" TEXT NOT NULL DEFAULT '1.0',
    "consent_hash" TEXT,
    "ip" TEXT,
    "user_agent" TEXT,
    "locale" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm"."lead_events" (
    "id" TEXT NOT NULL,
    "lead_id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lead_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "iam"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "locale" TEXT NOT NULL DEFAULT 'pt-BR',
    "role" TEXT NOT NULL DEFAULT 'viewer',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "iam"."user_preferences" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "iam"."consents" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "granted" BOOLEAN NOT NULL,
    "consent_hash" TEXT,
    "ip" TEXT,
    "user_agent" TEXT,
    "granted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "consents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "research"."institutes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "reliability" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "note" TEXT,

    CONSTRAINT "institutes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "research"."polls" (
    "id" TEXT NOT NULL,
    "institute_id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "sample" INTEGER NOT NULL,
    "margin" DOUBLE PRECISION NOT NULL,
    "register" TEXT NOT NULL,
    "method" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "polls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "research"."poll_scenarios" (
    "id" TEXT NOT NULL,
    "poll_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "poll_scenarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "research"."poll_results" (
    "id" TEXT NOT NULL,
    "scenario_id" TEXT NOT NULL,
    "candidate" TEXT NOT NULL,
    "percent" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "poll_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "research"."second_rounds" (
    "id" TEXT NOT NULL,
    "poll_id" TEXT NOT NULL,
    "matchup" TEXT NOT NULL,
    "candidate1" TEXT NOT NULL,
    "percent1" DOUBLE PRECISION NOT NULL,
    "candidate2" TEXT NOT NULL,
    "percent2" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "second_rounds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "research"."analyses" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "published_at" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "market"."market_snapshots" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "country" TEXT,
    "fetched_at" TIMESTAMP(3) NOT NULL,
    "raw_data" JSONB NOT NULL,

    CONSTRAINT "market_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "market"."candidates_odds" (
    "id" TEXT NOT NULL,
    "snapshot_id" TEXT NOT NULL,
    "candidate" TEXT NOT NULL,
    "probability" DOUBLE PRECISION NOT NULL,
    "volume" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "candidates_odds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "market"."market_signals" (
    "id" TEXT NOT NULL,
    "signal_type" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "detected_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "market_signals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "market"."cross_analytics" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "left_source" TEXT NOT NULL,
    "right_source" TEXT NOT NULL,
    "result" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cross_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai"."translations" (
    "id" TEXT NOT NULL,
    "source_locale" TEXT NOT NULL,
    "target_locale" TEXT NOT NULL,
    "source_hash" TEXT NOT NULL,
    "source_text" TEXT NOT NULL,
    "translated_text" TEXT NOT NULL,
    "provider" TEXT,
    "cached" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai"."translation_validations" (
    "id" TEXT NOT NULL,
    "translation_id" TEXT NOT NULL,
    "check_name" TEXT NOT NULL,
    "passed" BOOLEAN NOT NULL,
    "detail" TEXT,

    CONSTRAINT "translation_validations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai"."llm_calls" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "tokens_in" INTEGER NOT NULL,
    "tokens_out" INTEGER NOT NULL,
    "latency_ms" INTEGER NOT NULL,
    "cost_usd" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "llm_calls_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "audit_log_action_created_at_idx" ON "governance"."audit_log"("action", "created_at");

-- CreateIndex
CREATE INDEX "audit_log_resource_created_at_idx" ON "governance"."audit_log"("resource", "created_at");

-- CreateIndex
CREATE INDEX "system_events_event_type_created_at_idx" ON "governance"."system_events"("event_type", "created_at");

-- CreateIndex
CREATE INDEX "system_events_severity_created_at_idx" ON "governance"."system_events"("severity", "created_at");

-- CreateIndex
CREATE INDEX "data_versions_table_name_record_id_idx" ON "governance"."data_versions"("table_name", "record_id");

-- CreateIndex
CREATE UNIQUE INDEX "leads_email_key" ON "crm"."leads"("email");

-- CreateIndex
CREATE INDEX "leads_status_created_at_idx" ON "crm"."leads"("status", "created_at");

-- CreateIndex
CREATE INDEX "lead_events_lead_id_created_at_idx" ON "crm"."lead_events"("lead_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "iam"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_preferences_user_id_key_key" ON "iam"."user_preferences"("user_id", "key");

-- CreateIndex
CREATE INDEX "consents_user_id_type_idx" ON "iam"."consents"("user_id", "type");

-- CreateIndex
CREATE UNIQUE INDEX "institutes_name_key" ON "research"."institutes"("name");

-- CreateIndex
CREATE INDEX "polls_institute_id_date_idx" ON "research"."polls"("institute_id", "date");

-- CreateIndex
CREATE INDEX "analyses_type_published_at_idx" ON "research"."analyses"("type", "published_at");

-- CreateIndex
CREATE INDEX "market_snapshots_slug_fetched_at_idx" ON "market"."market_snapshots"("slug", "fetched_at");

-- CreateIndex
CREATE INDEX "market_snapshots_country_fetched_at_idx" ON "market"."market_snapshots"("country", "fetched_at");

-- CreateIndex
CREATE INDEX "candidates_odds_candidate_probability_idx" ON "market"."candidates_odds"("candidate", "probability");

-- CreateIndex
CREATE INDEX "market_signals_signal_type_detected_at_idx" ON "market"."market_signals"("signal_type", "detected_at");

-- CreateIndex
CREATE INDEX "market_signals_country_detected_at_idx" ON "market"."market_signals"("country", "detected_at");

-- CreateIndex
CREATE INDEX "cross_analytics_type_created_at_idx" ON "market"."cross_analytics"("type", "created_at");

-- CreateIndex
CREATE INDEX "translations_source_locale_target_locale_idx" ON "ai"."translations"("source_locale", "target_locale");

-- CreateIndex
CREATE UNIQUE INDEX "translations_source_hash_target_locale_key" ON "ai"."translations"("source_hash", "target_locale");

-- CreateIndex
CREATE INDEX "llm_calls_provider_created_at_idx" ON "ai"."llm_calls"("provider", "created_at");

-- CreateIndex
CREATE INDEX "llm_calls_purpose_created_at_idx" ON "ai"."llm_calls"("purpose", "created_at");

-- AddForeignKey
ALTER TABLE "crm"."lead_events" ADD CONSTRAINT "lead_events_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "crm"."leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "iam"."user_preferences" ADD CONSTRAINT "user_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "iam"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "iam"."consents" ADD CONSTRAINT "consents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "iam"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "research"."polls" ADD CONSTRAINT "polls_institute_id_fkey" FOREIGN KEY ("institute_id") REFERENCES "research"."institutes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "research"."poll_scenarios" ADD CONSTRAINT "poll_scenarios_poll_id_fkey" FOREIGN KEY ("poll_id") REFERENCES "research"."polls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "research"."poll_results" ADD CONSTRAINT "poll_results_scenario_id_fkey" FOREIGN KEY ("scenario_id") REFERENCES "research"."poll_scenarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "research"."second_rounds" ADD CONSTRAINT "second_rounds_poll_id_fkey" FOREIGN KEY ("poll_id") REFERENCES "research"."polls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "market"."candidates_odds" ADD CONSTRAINT "candidates_odds_snapshot_id_fkey" FOREIGN KEY ("snapshot_id") REFERENCES "market"."market_snapshots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai"."translation_validations" ADD CONSTRAINT "translation_validations_translation_id_fkey" FOREIGN KEY ("translation_id") REFERENCES "ai"."translations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
