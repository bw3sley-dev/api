/*
  Warnings:

  - You are about to drop the column `state` on the `addresses` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cpf]` on the table `guardians` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[rg]` on the table `guardians` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `gender` to the `guardians` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "addresses" DROP COLUMN "state";

-- AlterTable
ALTER TABLE "guardians" ADD COLUMN     "cpf" TEXT,
ADD COLUMN     "gender" "Gender" NOT NULL,
ADD COLUMN     "rg" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "guardians_cpf_key" ON "guardians"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "guardians_rg_key" ON "guardians"("rg");
