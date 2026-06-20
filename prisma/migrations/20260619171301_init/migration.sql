-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('PLATFORM_SUPER_ADMIN', 'PLATFORM_ADMIN', 'PLATFORM_SUPPORT', 'BUSINESS_OWNER', 'STORE_MANAGER', 'CASHIER', 'DRIVER', 'STAFF');

-- CreateEnum
CREATE TYPE "PricingUnit" AS ENUM ('PIECE', 'KG', 'SQ_FT');

-- CreateTable
CREATE TABLE "Business" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "currencyCode" TEXT NOT NULL DEFAULT 'INR',
    "gstNumber" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Store" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "customerSequence" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "refreshToken" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "role" "UserRole" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoreEmployee" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "removedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoreEmployee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "phone" TEXT NOT NULL,
    "dialCode" TEXT NOT NULL DEFAULT '+91',
    "email" TEXT,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "label" TEXT,
    "buildingName" TEXT,
    "landmark" TEXT,
    "locality" TEXT,
    "city" TEXT,
    "state" TEXT,
    "pincode" TEXT,
    "countryCode" TEXT DEFAULT 'IN',
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerStore" (
    "customerId" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "customerCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomerStore_pkey" PRIMARY KEY ("customerId","storeId")
);

-- CreateTable
CREATE TABLE "GarmentCategory" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "code" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "GarmentCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GarmentType" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "code" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "GarmentType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceType" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "code" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ServiceType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceCatalogItem" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "serviceTypeId" TEXT NOT NULL,
    "garmentTypeId" TEXT NOT NULL,
    "code" TEXT,
    "description" TEXT,
    "pricingUnit" "PricingUnit" NOT NULL DEFAULT 'PIECE',
    "basePrice" DECIMAL(10,2) NOT NULL,
    "minimumPrice" DECIMAL(10,2),
    "gstRate" DECIMAL(5,2),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ServiceCatalogItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Business_slug_key" ON "Business"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Business_ownerId_key" ON "Business"("ownerId");

-- CreateIndex
CREATE INDEX "Store_businessId_idx" ON "Store"("businessId");

-- CreateIndex
CREATE UNIQUE INDEX "Store_businessId_slug_key" ON "Store"("businessId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "Store_businessId_code_key" ON "Store"("businessId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "StoreEmployee_storeId_idx" ON "StoreEmployee"("storeId");

-- CreateIndex
CREATE INDEX "StoreEmployee_userId_idx" ON "StoreEmployee"("userId");

-- CreateIndex
CREATE INDEX "StoreEmployee_isActive_idx" ON "StoreEmployee"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "StoreEmployee_storeId_userId_key" ON "StoreEmployee"("storeId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_phone_dialCode_key" ON "Customer"("phone", "dialCode");

-- CreateIndex
CREATE INDEX "Address_customerId_idx" ON "Address"("customerId");

-- CreateIndex
CREATE INDEX "CustomerStore_storeId_idx" ON "CustomerStore"("storeId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerStore_storeId_customerCode_key" ON "CustomerStore"("storeId", "customerCode");

-- CreateIndex
CREATE INDEX "GarmentCategory_businessId_idx" ON "GarmentCategory"("businessId");

-- CreateIndex
CREATE UNIQUE INDEX "GarmentCategory_businessId_name_key" ON "GarmentCategory"("businessId", "name");

-- CreateIndex
CREATE INDEX "GarmentType_businessId_idx" ON "GarmentType"("businessId");

-- CreateIndex
CREATE INDEX "GarmentType_categoryId_idx" ON "GarmentType"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "GarmentType_businessId_categoryId_name_key" ON "GarmentType"("businessId", "categoryId", "name");

-- CreateIndex
CREATE INDEX "ServiceType_businessId_idx" ON "ServiceType"("businessId");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceType_businessId_name_key" ON "ServiceType"("businessId", "name");

-- CreateIndex
CREATE INDEX "ServiceCatalogItem_businessId_serviceTypeId_garmentTypeId_i_idx" ON "ServiceCatalogItem"("businessId", "serviceTypeId", "garmentTypeId", "isActive");

-- CreateIndex
CREATE INDEX "ServiceCatalogItem_businessId_idx" ON "ServiceCatalogItem"("businessId");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceCatalogItem_businessId_serviceTypeId_garmentTypeId_key" ON "ServiceCatalogItem"("businessId", "serviceTypeId", "garmentTypeId");

-- AddForeignKey
ALTER TABLE "Business" ADD CONSTRAINT "Business_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Store" ADD CONSTRAINT "Store_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoreEmployee" ADD CONSTRAINT "StoreEmployee_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoreEmployee" ADD CONSTRAINT "StoreEmployee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerStore" ADD CONSTRAINT "CustomerStore_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerStore" ADD CONSTRAINT "CustomerStore_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GarmentCategory" ADD CONSTRAINT "GarmentCategory_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GarmentType" ADD CONSTRAINT "GarmentType_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GarmentType" ADD CONSTRAINT "GarmentType_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "GarmentCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceType" ADD CONSTRAINT "ServiceType_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceCatalogItem" ADD CONSTRAINT "ServiceCatalogItem_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceCatalogItem" ADD CONSTRAINT "ServiceCatalogItem_serviceTypeId_fkey" FOREIGN KEY ("serviceTypeId") REFERENCES "ServiceType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceCatalogItem" ADD CONSTRAINT "ServiceCatalogItem_garmentTypeId_fkey" FOREIGN KEY ("garmentTypeId") REFERENCES "GarmentType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
