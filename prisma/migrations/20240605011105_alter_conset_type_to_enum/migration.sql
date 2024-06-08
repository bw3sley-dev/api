/*
  Warnings:

  - Changed the type of `type` on the `consents` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ConsentType" AS ENUM ('IMAGE', 'RESPONSIBILITY');

-- AlterTable
ALTER TABLE "consents" DROP COLUMN "type",
ADD COLUMN     "type" "ConsentType" NOT NULL;
