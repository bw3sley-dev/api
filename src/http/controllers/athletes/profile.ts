import { prisma } from '@/lib/prisma'
import type { FastifyReply, FastifyRequest } from 'fastify'

import { z } from 'zod'

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const profileParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = profileParamsSchema.parse(request.params)

  const athlete = await prisma.athlete.findUnique({
    where: {
      id,
    },

    include: {
      address: true,
      guardian: true,
      consents: true,
      anamnesis: true,
    },
  })

  if (!athlete) {
    return reply.status(404).send({
      message: 'Atleta não encontrado.',
    })
  }

  return reply.send(athlete)
}
