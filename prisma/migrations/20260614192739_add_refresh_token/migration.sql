/*
  Warnings:

  - You are about to drop the column `email` on the `Store` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Store` table. All the data in the column will be lost.
  - You are about to drop the column `storeId` on the `User` table. All the data in the column will be lost.
  - Added the required column `ownerId` to the `Store` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_storeId_fkey";

-- AlterTable
ALTER TABLE "public"."Store" DROP COLUMN "email",
DROP COLUMN "phone",
ADD COLUMN     "ownerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "storeId",
ADD COLUMN     "managedStoreId" TEXT,
ALTER COLUMN "role" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "public"."Store" ADD CONSTRAINT "Store_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_managedStoreId_fkey" FOREIGN KEY ("managedStoreId") REFERENCES "public"."Store"("id") ON DELETE SET NULL ON UPDATE CASCADE;
