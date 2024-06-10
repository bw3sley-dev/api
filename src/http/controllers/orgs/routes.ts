import type { FastifyInstance } from 'fastify'

import { register } from './register'
import { update } from './update'
import { organization } from './organization'

import { deleteOrg } from './delete'

import { verifyJWT } from '@/http/middlewares/verify-jwt'

export async function orgRoutes(app: FastifyInstance) {
  app.post('/orgs', register)

  app.get('/orgs', { onRequest: [verifyJWT] }, organization)

  app.put('/orgs', { onRequest: [verifyJWT] }, update)

  app.patch('/orgs', { onRequest: [verifyJWT] }, deleteOrg)
}
