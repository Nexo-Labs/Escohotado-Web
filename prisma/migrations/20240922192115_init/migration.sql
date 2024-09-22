-- CreateEnum
CREATE TYPE "StripeSubscriptionStatus" AS ENUM ('INCOMPLETE', 'INCOMPLETE_EXPIRED', 'TRIALING', 'ACTIVE', 'PAST_DUE', 'CANCELED', 'UNPAID');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "roles" TEXT[],
    "stripeRoles" TEXT[],
    "locales" TEXT[],
    "customerId" TEXT,
    "subscriptionId" TEXT,
    "subscriptionStatus" "StripeSubscriptionStatus",
    "priceId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StripeCustomer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "delinquent" BOOLEAN NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "invoicePrefix" TEXT NOT NULL,
    "taxExempt" TEXT NOT NULL,
    "created" INTEGER NOT NULL,
    "balance" INTEGER NOT NULL,
    "subscriptionId" TEXT,

    CONSTRAINT "StripeCustomer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StripeSubscription" (
    "id" TEXT NOT NULL,
    "subscriptionStatus" "StripeSubscriptionStatus" NOT NULL,
    "customerId" TEXT NOT NULL,

    CONSTRAINT "StripeSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StripeCheckoutSession" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "unitAmount" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "lookupKey" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "subscription" TEXT NOT NULL,

    CONSTRAINT "StripeCheckoutSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StripeLineItem" (
    "id" TEXT NOT NULL,
    "ammountDiscount" INTEGER NOT NULL,
    "ammountSubtotal" INTEGER NOT NULL,
    "ammountTotal" INTEGER NOT NULL,
    "ammountTax" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price_active" BOOLEAN NOT NULL,
    "price_billingScheme" TEXT NOT NULL,
    "price_created" INTEGER NOT NULL,
    "price_id" TEXT NOT NULL,
    "price_liveMode" BOOLEAN NOT NULL,
    "price_lookupKey" TEXT NOT NULL,
    "checkoutSessionId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "StripeLineItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StripeProduct" (
    "id" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tax_code" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "created" INTEGER NOT NULL,
    "updated" INTEGER NOT NULL,
    "url" TEXT,

    CONSTRAINT "StripeProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "StripeCustomer_userId_key" ON "StripeCustomer"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "StripeSubscription_customerId_key" ON "StripeSubscription"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StripeCustomer" ADD CONSTRAINT "StripeCustomer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StripeSubscription" ADD CONSTRAINT "StripeSubscription_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "StripeCustomer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StripeCheckoutSession" ADD CONSTRAINT "StripeCheckoutSession_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "StripeCustomer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StripeLineItem" ADD CONSTRAINT "StripeLineItem_checkoutSessionId_fkey" FOREIGN KEY ("checkoutSessionId") REFERENCES "StripeCheckoutSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StripeLineItem" ADD CONSTRAINT "StripeLineItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "StripeProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
