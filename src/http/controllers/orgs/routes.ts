import type { FastifyInstance } from 'fastify'

import { register } from './register'
import { organization } from './organization'

export async function orgRoutes(app: FastifyInstance) {
  app.post('/orgs', register)

  app.get('/orgs', organization)
}
