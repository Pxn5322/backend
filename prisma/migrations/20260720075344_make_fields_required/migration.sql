/*
  Warnings:

  - A unique constraint covering the columns `[companyCode]` on the table `Tenant` will be added. If there are existing duplicate values, this will fail.
  - Made the column `companyCode` on table `Tenant` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Tenant` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Tenant" ALTER COLUMN "companyCode" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_companyCode_key" ON "Tenant"("companyCode");
