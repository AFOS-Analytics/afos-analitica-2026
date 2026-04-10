-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "ai";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "crm";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "governance";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "iam";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "research";

-- CreateTable
CREATE TABLE "iam"."users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "locale" TEXT NOT NULL DEFAULT 'pt-BR',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "iam"."user_preferences" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'pt-BR',
    "timezone" TEXT NOT NULL DEFAULT 'America/Sao_Paulo',
    "marketing_opt_in" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "iam"."user_consents" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "email" TEXT,
    "consent_type" TEXT NOT NULL,
    "granted" BOOLEAN NOT NULL,
    "granted_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revoked_at" TIMESTAMPTZ(6),
    "policy_version" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'pt-BR',

    CONSTRAINT "user_consents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm"."leads" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "locale" TEXT,
    "capture_source" TEXT NOT NULL,
    "campaign" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "first_seen_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_seen_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm"."contact_events" (
    "id" UUID NOT NULL,
    "lead_id" UUID,
    "user_id" UUID,
    "event_type" TEXT NOT NULL,
    "event_payload" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "research"."sources" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "origin_url" TEXT NOT NULL,
    "credibility_score" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "research"."research_runs" (
    "id" UUID NOT NULL,
    "run_type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "locale" TEXT NOT NULL DEFAULT 'pt-BR',
    "started_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finished_at" TIMESTAMPTZ(6),
    "summary" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "research_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "research"."research_findings" (
    "id" UUID NOT NULL,
    "research_run_id" UUID NOT NULL,
    "source_id" UUID,
    "title" TEXT NOT NULL,
    "raw_payload" JSONB NOT NULL,
    "normalized_payload" JSONB NOT NULL,
    "language" TEXT NOT NULL,
    "country_code" TEXT NOT NULL,
    "event_date" TIMESTAMPTZ(6),
    "confidence_score" DOUBLE PRECISION,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "research_findings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "research"."analysis_reports" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'pt-BR',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "executive_summary" TEXT NOT NULL,
    "body_markdown" TEXT NOT NULL,
    "created_by" TEXT,
    "published_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "analysis_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "research"."cross_signal_links" (
    "id" UUID NOT NULL,
    "reference_type_a" TEXT NOT NULL,
    "reference_id_a" TEXT NOT NULL,
    "reference_type_b" TEXT NOT NULL,
    "reference_id_b" TEXT NOT NULL,
    "relationship_type" TEXT NOT NULL,
    "strength_score" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cross_signal_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "governance"."audit_logs" (
    "id" UUID NOT NULL,
    "actor_type" TEXT NOT NULL,
    "actor_id" TEXT,
    "action" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "before_data" JSONB,
    "after_data" JSONB,
    "ip_hash" TEXT,
    "user_agent_hash" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "governance"."deletion_requests" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "user_id" UUID,
    "request_type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "requested_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed_at" TIMESTAMPTZ(6),
    "notes" TEXT,

    CONSTRAINT "deletion_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai"."llm_runs" (
    "id" UUID NOT NULL,
    "run_type" TEXT NOT NULL,
    "model_name" TEXT NOT NULL,
    "prompt_version" TEXT NOT NULL,
    "input_hash" TEXT NOT NULL,
    "output_hash" TEXT,
    "risk_flags" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "llm_runs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "iam"."users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "iam"."users"("email");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "iam"."users"("status");

-- CreateIndex
CREATE UNIQUE INDEX "user_preferences_user_id_key" ON "iam"."user_preferences"("user_id");

-- CreateIndex
CREATE INDEX "user_consents_email_idx" ON "iam"."user_consents"("email");

-- CreateIndex
CREATE INDEX "user_consents_consent_type_idx" ON "iam"."user_consents"("consent_type");

-- CreateIndex
CREATE INDEX "user_consents_user_id_idx" ON "iam"."user_consents"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "leads_email_key" ON "crm"."leads"("email");

-- CreateIndex
CREATE INDEX "leads_email_idx" ON "crm"."leads"("email");

-- CreateIndex
CREATE INDEX "leads_status_idx" ON "crm"."leads"("status");

-- CreateIndex
CREATE INDEX "leads_capture_source_idx" ON "crm"."leads"("capture_source");

-- CreateIndex
CREATE INDEX "contact_events_lead_id_idx" ON "crm"."contact_events"("lead_id");

-- CreateIndex
CREATE INDEX "contact_events_event_type_idx" ON "crm"."contact_events"("event_type");

-- CreateIndex
CREATE INDEX "contact_events_created_at_idx" ON "crm"."contact_events"("created_at");

-- CreateIndex
CREATE INDEX "sources_type_idx" ON "research"."sources"("type");

-- CreateIndex
CREATE INDEX "sources_active_idx" ON "research"."sources"("active");

-- CreateIndex
CREATE INDEX "research_runs_run_type_idx" ON "research"."research_runs"("run_type");

-- CreateIndex
CREATE INDEX "research_runs_status_idx" ON "research"."research_runs"("status");

-- CreateIndex
CREATE INDEX "research_runs_created_at_idx" ON "research"."research_runs"("created_at");

-- CreateIndex
CREATE INDEX "research_findings_research_run_id_idx" ON "research"."research_findings"("research_run_id");

-- CreateIndex
CREATE INDEX "research_findings_country_code_idx" ON "research"."research_findings"("country_code");

-- CreateIndex
CREATE INDEX "research_findings_created_at_idx" ON "research"."research_findings"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "analysis_reports_slug_key" ON "research"."analysis_reports"("slug");

-- CreateIndex
CREATE INDEX "analysis_reports_slug_idx" ON "research"."analysis_reports"("slug");

-- CreateIndex
CREATE INDEX "analysis_reports_locale_idx" ON "research"."analysis_reports"("locale");

-- CreateIndex
CREATE INDEX "analysis_reports_status_idx" ON "research"."analysis_reports"("status");

-- CreateIndex
CREATE INDEX "analysis_reports_created_at_idx" ON "research"."analysis_reports"("created_at");

-- CreateIndex
CREATE INDEX "cross_signal_links_reference_type_a_reference_id_a_idx" ON "research"."cross_signal_links"("reference_type_a", "reference_id_a");

-- CreateIndex
CREATE INDEX "cross_signal_links_reference_type_b_reference_id_b_idx" ON "research"."cross_signal_links"("reference_type_b", "reference_id_b");

-- CreateIndex
CREATE INDEX "cross_signal_links_created_at_idx" ON "research"."cross_signal_links"("created_at");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "governance"."audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_entity_type_entity_id_idx" ON "governance"."audit_logs"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "governance"."audit_logs"("created_at");

-- CreateIndex
CREATE INDEX "deletion_requests_email_idx" ON "governance"."deletion_requests"("email");

-- CreateIndex
CREATE INDEX "deletion_requests_status_idx" ON "governance"."deletion_requests"("status");

-- CreateIndex
CREATE INDEX "deletion_requests_requested_at_idx" ON "governance"."deletion_requests"("requested_at");

-- CreateIndex
CREATE INDEX "llm_runs_run_type_idx" ON "ai"."llm_runs"("run_type");

-- CreateIndex
CREATE INDEX "llm_runs_model_name_idx" ON "ai"."llm_runs"("model_name");

-- CreateIndex
CREATE INDEX "llm_runs_created_at_idx" ON "ai"."llm_runs"("created_at");

-- AddForeignKey
ALTER TABLE "iam"."user_preferences" ADD CONSTRAINT "user_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "iam"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "iam"."user_consents" ADD CONSTRAINT "user_consents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "iam"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm"."contact_events" ADD CONSTRAINT "contact_events_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "crm"."leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "research"."research_findings" ADD CONSTRAINT "research_findings_research_run_id_fkey" FOREIGN KEY ("research_run_id") REFERENCES "research"."research_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "research"."research_findings" ADD CONSTRAINT "research_findings_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "research"."sources"("id") ON DELETE SET NULL ON UPDATE CASCADE;
