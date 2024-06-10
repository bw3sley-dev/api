import { FastifyRequest, FastifyReply } from 'fastify'

import { prisma } from '@/lib/prisma'

import { z } from 'zod'

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const orgId = request.user.meta.orgId

  const updateVolunteerParamsSchema = z.object({
    userId: z.string().uuid(),
  })

  const { userId } = updateVolunteerParamsSchema.parse(request.params)

  const updateVolunteerBodySchema = z.object({
    name: z.string(),
    area: z.enum([
      'UNSPECIFIED',
      'PSYCHOLOGY',
      'PHYSIOTHERAPY',
      'NUTRITION',
      'NURSING',
      'PSYCHOPEDAGOGY',
      'PHYSICAL_EDUCATION',
    ]),
  })

  const { name, area } = updateVolunteerBodySchema.parse(request.body)

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
      organization_id: orgId,
      role: 'VOLUNTEER',
    },
  })

  if (!user) {
    return reply.status(404).send({
      message: 'Voluntário não encontrado.',
    })
  }

  await prisma.user.update({
    where: {
      id: userId,
      organization_id: orgId,
    },

    data: {
      name,
      area,
    },
  })

  return reply.status(204).send()
}
