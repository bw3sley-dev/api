/*
  Warnings:

  - You are about to drop the column `question_type_id` on the `questions` table. All the data in the column will be lost.
  - You are about to drop the `question_types` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `question_type` to the `questions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('ESSAY', 'MULTIPLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER', 'RATING', 'DATE', 'TIME', 'NUMBER', 'MULTI_SELECT', 'DROPDOWN');

-- DropForeignKey
ALTER TABLE "questions" DROP CONSTRAINT "questions_question_type_id_fkey";

-- AlterTable
ALTER TABLE "questions" DROP COLUMN "question_type_id",
ADD COLUMN     "question_type" "QuestionType" NOT NULL;

-- DropTable
DROP TABLE "question_types";
