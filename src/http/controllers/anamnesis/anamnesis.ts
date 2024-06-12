import type { FastifyReply, FastifyRequest } from 'fastify'

import { prisma } from '@/lib/prisma'

import { z } from 'zod'

export async function anamnesis(request: FastifyRequest, reply: FastifyReply) {
  const anamnesisParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = anamnesisParamsSchema.parse(request.params)

  const anamnesis = await prisma.anamnesis.findUnique({
    where: {
      id,
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

      athlete: true,
    },
  })

  if (!anamnesis) {
    return reply.status(404).send({
      message: 'Anamnese não encontrada.',
    })
  }

  return reply.send(anamnesis)
}
