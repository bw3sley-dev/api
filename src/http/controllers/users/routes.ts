import type { FastifyInstance } from 'fastify'

import { register } from './register'
import { profile } from './profile'
import { update } from './update'

import { updateEmail } from './update-email'
import { updatePassword } from './update-password'

import { deleteUser } from './delete'

import { verifyJWT } from '@/http/middlewares/verify-jwt'

export async function userRoutes(app: FastifyInstance) {
  app.post('/users', register)

  app.get('/me', { onRequest: [verifyJWT] }, profile)

  app.patch('/update-email', { onRequest: [verifyJWT] }, updateEmail)
  app.patch('/update-password', { onRequest: [verifyJWT] }, updatePassword)
  app.patch('/update-status', { onRequest: [verifyJWT] }, deleteUser)

  app.put('/me', { onRequest: [verifyJWT] }, update)
}
