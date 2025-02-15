-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "imageUrl" TEXT,
    "nickname" TEXT,
    "rg" TEXT,
    "cpf" TEXT,
    "birthDate" TIMESTAMP(3),
    "email" TEXT,
    "phone" TEXT,
    "maritalStatus" TEXT,
    "profession" TEXT,
    "numberOfChildren" INTEGER,
    "postalCode" TEXT,
    "address" TEXT,
    "addressNumber" TEXT,
    "neighborhood" TEXT,
    "complement" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "family" TEXT[],
    "accommodationPreference" TEXT[],
    "airPreference" TEXT[],
    "travelStyle" TEXT[],
    "interestedExperiences" TEXT[],
    "dreamTrips" TEXT[],
    "recentTrips" TEXT[],
    "tags" TEXT[],
    "observation" TEXT,
    "referralSource" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_documents" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT,
    "issueDate" TIMESTAMP(3),
    "expirationDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "customerId" TEXT,

    CONSTRAINT "customer_documents_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_documents" ADD CONSTRAINT "customer_documents_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
