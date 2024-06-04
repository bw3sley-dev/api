import type { FastifyInstance } from 'fastify'

import { logout } from './logout'
import { forgot } from './forgot-password'
import { authenticate } from './authenticate'
import { verifyAuthentication } from './verify-authentication'

export async function authRoutes(app: FastifyInstance) {
  app.post('/sessions', authenticate)

  app.post('/logout', logout)

  app.get('/verify-auth', verifyAuthentication)

  app.patch('/forgot-password', forgot)
}
