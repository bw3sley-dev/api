import type { FastifyReply, FastifyRequest } from 'fastify'

import { z } from 'zod'

import { prisma } from '@/lib/prisma'

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const updateGuardianParamsSchema = z.object({
    guardianId: z.string().uuid(),
  })

  const { guardianId } = updateGuardianParamsSchema.parse(request.params)

  const updateGuardianBodySchema = z.object({
    name: z.string().optional(),
    gender: z.enum(['MALE', 'FEMALE']).optional(),
    email: z.string().email().optional(),
    cpf: z.string().optional(),
    rg: z.string().optional(),
    relationshipDegree: z.string().optional(),
    address: z
      .object({
        street: z.string().optional(),
        city: z.string().optional(),
        uf: z.string().optional(),
        zipcode: z.string().optional(),
        complement: z.string().optional(),
        neighborhood: z.string().optional(),
        number: z.string().optional(),
        country: z.string().default('BRASIL').optional(),
      })
      .optional(),
  })

  const { name, gender, email, cpf, rg, relationshipDegree, address } =
    updateGuardianBodySchema.parse(request.body)

  const guardian = await prisma.guardian.findUnique({
    where: {
      id: guardianId,
    },
  })

  if (!guardian) {
    return reply.status(404).send({
      message: 'Responsável não encontrado.',
    })
  }

  await prisma.guardian.update({
    where: {
      id: guardianId,
    },

    data: {
      name,
      gender,
      email,
      cpf,
      rg,
      relationship_degree: relationshipDegree,
    },
  })

  if (address) {
    if (guardian.id) {
      await prisma.address.update({
        where: { id: guardian.address_id! },

        data: {
          street: address.street,
          neighborhood: address.neighborhood,
          zipcode: address.zipcode,
          complement: address.complement,
          number: address.number,
          city: address.city,
          uf: address.uf,
          country: address.country,
        },
      })

      return reply.status(204).send()
    }

    const newAddress = await prisma.address.create({
      data: {
        street: address.street,
        neighborhood: address.neighborhood,
        zipcode: address.zipcode,
        complement: address.complement,
        number: address.number,
        city: address.city,
        uf: address.uf,
        country: address.country,
      },
    })

    await prisma.user.update({
      where: {
        id: guardianId,
      },

      data: {
        address_id: newAddress.id,
      },
    })
  }

  return reply.status(204).send()
}
