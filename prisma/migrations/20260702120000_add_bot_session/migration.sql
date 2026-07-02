-- CreateTable
CREATE TABLE "BotSession" (
    "chatId" TEXT NOT NULL,
    "step" TEXT NOT NULL DEFAULT 'idle',
    "data" TEXT NOT NULL DEFAULT '{}',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "BotSession_pkey" PRIMARY KEY ("chatId")
);
