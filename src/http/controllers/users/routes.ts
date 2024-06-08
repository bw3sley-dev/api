import type { FastifyInstance } from 'fastify'

import { register } from './register'
import { profile } from './profile'

import { verifyJWT } from '@/http/middlewares/verify-jwt'

export async function userRoutes(app: FastifyInstance) {
  app.post('/users', register)

  app.get('/me', { onRequest: [verifyJWT] }, profile)
}
