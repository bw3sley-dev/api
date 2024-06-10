import type { FastifyReply, FastifyRequest } from 'fastify'

import { prisma } from '@/lib/prisma'

import { compare } from 'bcryptjs'

import { z } from 'zod'

export async function updateEmail(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = request.user.sub
  const orgId = request.user.meta.orgId

  const updateEmailBodySchema = z.object({
    email: z.string().email(),
    currentPassword: z.string().min(6),
  })

  const { email, currentPassword } = updateEmailBodySchema.parse(request.body)

  const isEmailInUse = await prisma.user.findFirst({
    where: {
      email,
      organization_id: orgId,

      id: {
        not: userId,
      },
    },
  })

  if (isEmailInUse) {
    return reply.status(409).send({
      message: 'O e-mail já está sendo usado por outro usuário na organização.',
    })
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
      organization_id: orgId,
    },

    select: {
      email: true,
      password_hash: true,
    },
  })

  if (!user) {
    return reply.status(404).send({
      message: 'Usuário não encontrado.',
    })
  }

  if (email === user.email) {
    return reply.status(409).send({
      message: 'O novo e-mail deve ser diferente do já cadastrado.',
    })
  }

  const doesPasswordMatch = await compare(currentPassword, user.password_hash)

  if (!doesPasswordMatch) {
    return reply.status(409).send({
      message: 'Senha incorreta.',
    })
  }

  await prisma.user.update({
    where: {
      id: userId,
      organization_id: orgId,
    },

    data: {
      email,
    },
  })

  return reply.status(204).send()
}
