import type { FastifyInstance } from 'fastify'

import { anamnesis } from './anamnesis'
import { update } from './update'

export async function anamnesisRoutes(app: FastifyInstance) {
  app.get('/anamnesis/:id', anamnesis)

  app.patch(
    '/anamnesis/:id/section/:sectionId/question/:questionId/answer',
    update,
  )
}
