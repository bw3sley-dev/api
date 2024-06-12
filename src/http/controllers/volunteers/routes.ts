import type { FastifyInstance } from 'fastify'

import { volunteers } from './volunteers'
import { create } from './create'
import { update } from './update'
import { deleteVolunteer } from './delete'

import { verifyJWT } from '@/http/middlewares/verify-jwt'

export async function volunteerRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/volunteers', volunteers)

  app.post('/volunteers', create)

  app.put('/volunteers/:id', update)

  app.delete('/volunteers/:id', deleteVolunteer)
}
