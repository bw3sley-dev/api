/* eslint-disable @typescript-eslint/no-unused-vars */
import type { FastifyReply, FastifyRequest } from 'fastify'

import { prisma } from '@/lib/prisma'

import { z } from 'zod'

import { transformNameToInitials } from '@/utils/transform-name-to-initials'

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

  const {
    address_id: _,
    guardian_id: __,

    ..._athlete
  } = athlete

  return reply.send({
    ..._athlete,

    initials: transformNameToInitials(athlete.name),
  })
}
