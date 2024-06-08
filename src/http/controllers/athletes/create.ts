import type { FastifyReply, FastifyRequest } from 'fastify'

import { prisma } from '@/lib/prisma'

import { z } from 'zod'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.sub

  const createBodySchema = z.object({
    name: z.string(),
    birthDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: 'Formato da data inválido',
    }),
    handedness: z.enum(['RIGHT', 'LEFT']),
    gender: z.enum(['MALE', 'FEMALE']),
    bloodType: z.enum([
      'A_POSITIVE',
      'A_NEGATIVE',
      'B_POSITIVE',
      'B_NEGATIVE',
      'AB_POSITIVE',
      'AB_NEGATIVE',
      'O_POSITIVE',
      'O_NEGATIVE',
    ]),
    status: z.boolean().default(true),
    guardianName: z.string(),
    guardianEmail: z.string().email().optional(),
  })

  const {
    name,
    birthDate,
    handedness,
    gender,
    bloodType,
    status,
    guardianName,
    guardianEmail,
  } = createBodySchema.parse(request.body)

  await prisma.athlete.create({
    data: {
      name,
      birth_date: new Date(birthDate),
      handedness,
      gender,
      blood_type: bloodType,
      status,

      address: {
        create: {},
      },

      guardian: {
        create: {
          name: guardianName,
          email: guardianEmail,
        },
      },

      consents: {
        create: [
          {
            type: 'IMAGE',
            is_agreed: false,
            agreed_at: new Date(),
          },

          {
            type: 'RESPONSIBILITY',
            is_agreed: false,
            agreed_at: new Date(),
          },
        ],
      },

      athleteAssociations: {
        create: {
          user_id: userId,
        },
      },
    },
  })

  return reply.status(201).send()
}
