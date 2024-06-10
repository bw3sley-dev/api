import type { FastifyInstance } from 'fastify'

import { register } from './register'
import { profile } from './profile'

import { updateEmail } from './update-email'
import { updatePassword } from './update-password'

import { verifyJWT } from '@/http/middlewares/verify-jwt'

export async function userRoutes(app: FastifyInstance) {
  app.post('/users', register)

  app.get('/me', { onRequest: [verifyJWT] }, profile)

  app.patch('/update-email', { onRequest: [verifyJWT] }, updateEmail)
  app.patch('/update-password', { onRequest: [verifyJWT] }, updatePassword)
}
