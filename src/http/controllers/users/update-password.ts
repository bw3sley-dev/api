import type { FastifyReply, FastifyRequest } from 'fastify'

import { prisma } from '@/lib/prisma'

import { compare, hash } from 'bcryptjs'

import { z } from 'zod'

export async function updatePassword(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = request.user.sub
  const orgId = request.user.meta.orgId

  const updateEmailBodySchema = z.object({
    currentPassword: z.string().min(6),
    newPassword: z.string().min(6),
  })

  const { currentPassword, newPassword } = updateEmailBodySchema.parse(
    request.body,
  )

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
      organization_id: orgId,
    },

    select: {
      password_hash: true,
    },
  })

  if (!user) {
    return reply.status(403).send({
      message: 'Usuário não possui permissão.',
    })
  }

  if (newPassword === user.password_hash) {
    return reply.status(409).send({
      message: 'A nova senha deve ser diferente do já cadastrada.',
    })
  }

  const doesPasswordMatch = await compare(currentPassword, user.password_hash)

  if (!doesPasswordMatch) {
    return reply.status(409).send({
      message: 'Senha incorreta.',
    })
  }

  const hashedPassword = await hash(newPassword, 6)

  await prisma.user.update({
    where: {
      id: userId,
      organization_id: orgId,
    },

    data: {
      password_hash: hashedPassword,
    },
  })

  return reply.status(204).send()
}
