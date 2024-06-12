/*
  Warnings:

  - You are about to drop the column `observation` on the `answers` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[question_id]` on the table `answers` will be added. If there are existing duplicate values, this will fail.
  - Made the column `question_id` on table `answers` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "answers" DROP CONSTRAINT "answers_question_id_fkey";

-- AlterTable
ALTER TABLE "answers" DROP COLUMN "observation",
ALTER COLUMN "question_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "questions" ADD COLUMN     "observation" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "answers_question_id_key" ON "answers"("question_id");

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
