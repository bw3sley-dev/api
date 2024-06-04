import type { FastifyReply, FastifyRequest } from 'fastify'

export async function verifyAuthentication(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    await request.jwtVerify()
    reply.send({ authenticated: true })
  } catch (error) {
    reply.send({ authenticated: false })
  }
}
