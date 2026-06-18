/*
  Warnings:

  - A unique constraint covering the columns `[customerCode]` on the table `CustomerStore` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CustomerStore_customerCode_key" ON "CustomerStore"("customerCode");
