import type { FastifyReply, FastifyRequest } from 'fastify'

import { prisma } from '@/lib/prisma'

import { z } from 'zod'

export async function anamnesis(request: FastifyRequest, reply: FastifyReply) {
  const anamnesisParamsSchema = z.object({
    anamnesisId: z.string().uuid(),
  })

  const { anamnesisId } = anamnesisParamsSchema.parse(request.params)

  const anamnesis = await prisma.anamnesis.findUnique({
    where: {
      id: anamnesisId,
    },

    include: {
      sections: {
        include: {
          questions: {
            include: {
              answers: true,
            },
          },
        },
      },
    },
  })

  if (!anamnesis) {
    return reply.status(404).send({
      message: 'Anamnese não encontrada.',
    })
  }

  return reply.send(anamnesis)
}
