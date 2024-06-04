import fastify from 'fastify'

import { env } from './env'

import { ZodError } from 'zod'

import { fastifyCors } from '@fastify/cors'

import { fastifyJwt } from '@fastify/jwt'

import fastifyCookie from '@fastify/cookie'

import { authRoutes } from './http/controllers/auth/routes'
import { metricsRoutes } from './http/controllers/metrics/routes'

export const app = fastify()

app.register(fastifyCors, {
  origin: 'http://localhost:5173',
  credentials: true,
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,

  cookie: {
    cookieName: 'auth',
    signed: false,
  },
})

app.register(fastifyCookie)

app.register(authRoutes)
app.register(metricsRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Erro de validação',
      issues: error.format(),
    })
  }

  if (env.NODE_ENV !== 'production') {
    console.log(error)
  } else {
    // TODO: Here we should log to an external tool like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: 'Error interno de servidor' })
})
