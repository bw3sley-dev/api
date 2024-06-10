import type { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middlewares/verify-jwt'

import { volunteers } from './volunteers'

import { update } from './update'

import { deleteVolunteer } from './delete'

export async function volunteerRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/volunteers', volunteers)

  app.put('/volunteers/:id', update)

  app.patch('/volunteers/:id', deleteVolunteer)
}
