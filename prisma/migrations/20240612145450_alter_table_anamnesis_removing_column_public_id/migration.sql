/*
  Warnings:

  - You are about to drop the column `public_id` on the `anamnesis` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "anamnesis_public_id_key";

-- AlterTable
ALTER TABLE "anamnesis" DROP COLUMN "public_id";
