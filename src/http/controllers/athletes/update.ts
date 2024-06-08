import type { FastifyReply, FastifyRequest } from 'fastify'

import { prisma } from '@/lib/prisma'

import { z } from 'zod'

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const updateParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const updateBodySchema = z.object({
    name: z.string().optional(),
    birthDate: z
      .string()
      .optional()
      .refine((date) => date && !isNaN(Date.parse(date)), {
        message: 'Formato da data inválido',
      }),
    handedness: z.enum(['RIGHT', 'LEFT']).optional(),
    gender: z.enum(['MALE', 'FEMALE']).optional(),
    bloodType: z
      .enum([
        'A_POSITIVE',
        'A_NEGATIVE',
        'B_POSITIVE',
        'B_NEGATIVE',
        'AB_POSITIVE',
        'AB_NEGATIVE',
        'O_POSITIVE',
        'O_NEGATIVE',
      ])
      .optional(),
  })

  const { id } = updateParamsSchema.parse(request.params)

  const { name, birthDate, bloodType, gender, handedness } =
    updateBodySchema.parse(request.body)

  const athlete = await prisma.athlete.findUnique({
    where: { id },
  })

  if (!athlete) {
    return reply.status(404).send({
      message: 'Atleta não encontrado.',
    })
  }

  await prisma.athlete.update({
    where: {
      id,
    },

    data: {
      name,
      birth_date: birthDate && new Date(birthDate),
      blood_type: bloodType,
      gender,
      handedness,
    },
  })

  return reply.status(204).send()
}
