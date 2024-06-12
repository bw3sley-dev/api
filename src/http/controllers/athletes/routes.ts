import type { FastifyInstance } from 'fastify'

import { search } from './search'
import { create } from './create'
import { profile } from './profile'
import { update } from './update'

import { updateStatus } from './update-status'

import { verifyJWT } from '@/http/middlewares/verify-jwt'

export async function athleteRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/athletes', search)
  app.get('/athletes/:id', profile)

  app.post('/athletes', create)

  app.patch('/athletes/:id/status', updateStatus)

  app.patch('/athletes/:id', update)
}
