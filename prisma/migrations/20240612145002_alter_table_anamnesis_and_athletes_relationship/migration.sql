/*
  Warnings:

  - A unique constraint covering the columns `[athlete_id]` on the table `anamnesis` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "anamnesis_athlete_id_key" ON "anamnesis"("athlete_id");
