-- CreateTable
CREATE TABLE "crm"."visitor_states" (
    "id" UUID NOT NULL,
    "visitor_id" TEXT NOT NULL,
    "qualified_sessions" INTEGER NOT NULL DEFAULT 0,
    "popup_dismissals" INTEGER NOT NULL DEFAULT 0,
    "subscribed" BOOLEAN NOT NULL DEFAULT false,
    "subscribed_at" TIMESTAMPTZ(6),
    "lead_id" UUID,
    "last_session_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "visitor_states_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "visitor_states_visitor_id_key" ON "crm"."visitor_states"("visitor_id");

-- CreateIndex
CREATE INDEX "visitor_states_subscribed_idx" ON "crm"."visitor_states"("subscribed");

-- CreateIndex
CREATE INDEX "visitor_states_created_at_idx" ON "crm"."visitor_states"("created_at");
