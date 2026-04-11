-- CreateIndex
CREATE INDEX "audit_logs_actor_type_actor_id_idx" ON "governance"."audit_logs"("actor_type", "actor_id");
