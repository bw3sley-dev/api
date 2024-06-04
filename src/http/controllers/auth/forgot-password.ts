import type { FastifyReply, FastifyRequest } from 'fastify'

import { z } from 'zod'

import { prisma } from '@/lib/prisma'

import { compare, hash } from 'bcryptjs'

export async function forgot(request: FastifyRequest, reply: FastifyReply) {
  const forgotBodySchema = z.object({
    email: z.string().email(),
    newPassword: z.string().min(6),
  })

  const { email, newPassword } = forgotBodySchema.parse(request.body)

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (!user) {
    return reply.status(404).send({
      message: 'Usuário não encontrado',
    })
  }

  const doesPasswordMatch = await compare(newPassword, user.password_hash)

  if (doesPasswordMatch) {
    return reply.status(400).send({
      message: 'A senha é a mesma da anterior',
    })
  }

  const hashedPassword = await hash(newPassword, 6)

  await prisma.user.update({
    where: {
      email,
    },

    data: {
      password_hash: hashedPassword,
    },
  })

  return reply.status(204).send()
}
