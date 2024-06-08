import type { FastifyInstance } from 'fastify'

import { logout } from './sign-out'
import { forgot } from './forgot-password'
import { authenticate } from './authenticate'
import { verifyAuthentication } from './verify-auth'

export async function authRoutes(app: FastifyInstance) {
  app.post('/sessions', authenticate)

  app.post('/sign-out', logout)

  app.get('/verify-auth', verifyAuthentication)

  app.patch('/forgot-password', forgot)
}
