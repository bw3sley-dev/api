import type { FastifyInstance } from 'fastify'

import { update } from './update'

export async function guardianRoutes(app: FastifyInstance) {
  app.patch('/guardians/:id', update)
}
