import type { FastifyReply, FastifyRequest } from 'fastify'

import { prisma } from '@/lib/prisma'

import { z } from 'zod'

import { compare } from 'bcryptjs'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (!user) {
    return reply.status(404).send({
      message:
        'Usuário não encontrado, verifique as credenciais e tente novamente!',
    })
  }

  const doesPasswordMatch = await compare(password, user.password_hash)

  if (!doesPasswordMatch) {
    return reply.status(400).send({
      message: 'Credenciais inválidas.',
    })
  }

  const token = await reply.jwtSign(
    {
      sub: user.id,
      role: user.role,

      meta: {
        orgId: user.organization_id,
        area: user.area,
      },
    },

    {
      expiresIn: '7d',
    },
  )

  return reply.send({
    token,
  })
}
