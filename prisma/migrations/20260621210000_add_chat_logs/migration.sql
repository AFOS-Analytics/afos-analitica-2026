-- CreateTable
CREATE TABLE "ai"."chat_conversations" (
    "id" UUID NOT NULL,
    "session_id" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'pt-BR',
    "message_count" INTEGER NOT NULL DEFAULT 0,
    "started_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_message_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai"."chat_messages" (
    "id" UUID NOT NULL,
    "conversation_id" UUID NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "tools" JSONB,
    "sequence" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "chat_conversations_session_id_idx" ON "ai"."chat_conversations"("session_id");

-- CreateIndex
CREATE INDEX "chat_conversations_started_at_idx" ON "ai"."chat_conversations"("started_at");

-- CreateIndex
CREATE INDEX "chat_messages_conversation_id_idx" ON "ai"."chat_messages"("conversation_id");

-- CreateIndex
CREATE INDEX "chat_messages_created_at_idx" ON "ai"."chat_messages"("created_at");

-- AddForeignKey
ALTER TABLE "ai"."chat_messages" ADD CONSTRAINT "chat_messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "ai"."chat_conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
