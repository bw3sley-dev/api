import type { FastifyInstance } from 'fastify'

import { getAthletesAmount } from './get-athletes-amount'
import { getAnamnesisAmount } from './get-anamnesis-amount'
import { getAverageAgeAmount } from './get-average-age-amount'
import { getGuardiansAmount } from './get-guardians-amount'

import { getAthletesByGenderAmount } from './get-athletes-by-gender-amount'
import { getAthletesLastWeekAmount } from './get-last-week-athletes-amount'

import { verifyJWT } from '@/http/middlewares/verify-jwt'

export async function metricsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/metrics/athletes-amount', getAthletesAmount)
  app.get('/metrics/anamnesis-amount', getAnamnesisAmount)
  app.get('/metrics/guardians-amount', getGuardiansAmount)
  app.get('/metrics/average-age-amount', getAverageAgeAmount)

  app.get('/metrics/athletes-gender-amount', getAthletesByGenderAmount)
  app.get('/metrics/last-week-athletes-amount', getAthletesLastWeekAmount)
}
