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
  })

  const {
    name,
    birthDate,
    handedness,
    gender,
    bloodType,
    status,
    guardianName,
  } = createBodySchema.parse(request.body)

  const athlete = await prisma.athlete.create({
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

  await prisma.anamnesis.create({
    data: {
      athlete_id: athlete.id,

      sections: {
        create: [
          {
            title: 'Rotina e atividades atuais',
            icon: 'LIST_TODO',

            questions: {
              create: [
                {
                  title:
                    'Descreva como é a rotina atual do atleta (descrever um dia típico do começo ao fim, com as atividades de rotina em casa, outras atividades, retorno a casa, atividades realizadas em casa, período de sono, aulas ou curso realizados, etc)',
                  question_type: 'ESSAY',

                  answers: {
                    create: {
                      value: '',
                    },
                  },
                },

                {
                  title:
                    'Descreva como está a vida do atleta no presente momento:',
                  question_type: 'ESSAY',

                  answers: {
                    create: {
                      value: '',
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    },
  })

  return reply.status(201).send()
}
