-- CreateTable
CREATE TABLE "user_keys" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_keys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_keys_key_key" ON "user_keys"("key");

-- CreateIndex
CREATE UNIQUE INDEX "user_keys_userId_key" ON "user_keys"("userId");

-- AddForeignKey
ALTER TABLE "user_keys" ADD CONSTRAINT "user_keys_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
