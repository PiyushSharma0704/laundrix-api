/*
  Warnings:

  - You are about to drop the column `price` on the `ServiceCatalogItem` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[businessId,categoryId,name]` on the table `GarmentType` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[businessId,slug]` on the table `Store` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[businessId,code]` on the table `Store` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[storeId,userId]` on the table `StoreEmployee` will be added. If there are existing duplicate values, this will fail.
  - Made the column `categoryId` on table `GarmentType` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `basePrice` to the `ServiceCatalogItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `Store` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "GarmentType" DROP CONSTRAINT "GarmentType_categoryId_fkey";

-- DropIndex
DROP INDEX "GarmentType_businessId_name_key";

-- DropIndex
DROP INDEX "ServiceCatalogItem_garmentTypeId_idx";

-- DropIndex
DROP INDEX "ServiceCatalogItem_serviceTypeId_idx";

-- DropIndex
DROP INDEX "Store_slug_key";

-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "currencyCode" TEXT NOT NULL DEFAULT 'INR',
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "gstNumber" TEXT;

-- AlterTable
ALTER TABLE "GarmentCategory" ADD COLUMN     "code" TEXT,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "GarmentType" ADD COLUMN     "code" TEXT,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "imageUrl" TEXT,
ALTER COLUMN "categoryId" SET NOT NULL;

-- AlterTable
ALTER TABLE "ServiceCatalogItem" DROP COLUMN "price",
ADD COLUMN     "basePrice" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "code" TEXT,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "gstRate" DECIMAL(5,2);

-- AlterTable
ALTER TABLE "ServiceType" ADD COLUMN     "code" TEXT,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "address" TEXT,
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "email" TEXT,
ADD COLUMN     "phone" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "GarmentType_businessId_categoryId_name_key" ON "GarmentType"("businessId", "categoryId", "name");

-- CreateIndex
CREATE INDEX "ServiceCatalogItem_businessId_serviceTypeId_garmentTypeId_i_idx" ON "ServiceCatalogItem"("businessId", "serviceTypeId", "garmentTypeId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "Store_businessId_slug_key" ON "Store"("businessId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "Store_businessId_code_key" ON "Store"("businessId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "StoreEmployee_storeId_userId_key" ON "StoreEmployee"("storeId", "userId");

-- AddForeignKey
ALTER TABLE "GarmentType" ADD CONSTRAINT "GarmentType_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "GarmentCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
