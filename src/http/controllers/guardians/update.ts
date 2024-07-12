import type { FastifyReply, FastifyRequest } from 'fastify'

import { z } from 'zod'

import { prisma } from '@/lib/prisma'

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const updateGuardianParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = updateGuardianParamsSchema.parse(request.params)

  const updateGuardianBodySchema = z.object({
    name: z.string().nullable().optional(),
    gender: z.enum(['MALE', 'FEMALE']).nullable().optional(),
    email: z.string().email().nullable().optional(),
    cpf: z.string().nullable().optional(),
    rg: z.string().nullable().optional(),
    relationshipDegree: z.string().nullable().optional(),
    address: z
      .object({
        street: z.string().nullable(),
        city: z.string().nullable(),
        uf: z.string().nullable(),
        zipcode: z.string().nullable(),
        complement: z.string().nullable(),
        neighborhood: z.string().nullable(),
        number: z.string().nullable(),
        country: z.string().default('BRASIL').nullable(),
      })
      .nullable()
      .optional(),
  })

  const _updateGuardian = updateGuardianBodySchema.safeParse(request.body).data

  const guardian = await prisma.guardian.findUnique({
    where: {
      id,
    },
  })

  if (!guardian) {
    return reply.status(404).send({
      message: 'Responsável não encontrado.',
    })
  }

  await prisma.guardian.update({
    where: {
      id,
    },

    data: {
      name: _updateGuardian?.name,
      gender: _updateGuardian?.gender,
      email: _updateGuardian?.email,
      cpf: _updateGuardian?.cpf,
      rg: _updateGuardian?.rg,
      relationship_degree: _updateGuardian?.relationshipDegree,
    },
  })

  if (_updateGuardian?.address) {
    if (guardian.id) {
      await prisma.address.update({
        where: { id: guardian.address_id! },

        data: {
          street: _updateGuardian?.address.street,
          neighborhood: _updateGuardian?.address.neighborhood,
          zipcode: _updateGuardian?.address.zipcode,
          complement: _updateGuardian?.address.complement,
          number: _updateGuardian?.address.number,
          city: _updateGuardian?.address.city,
          uf: _updateGuardian?.address.uf,
          country: _updateGuardian?.address.country,
        },
      })

      return reply.status(204).send()
    }

    const newAddress = await prisma.address.create({
      data: {
        street: _updateGuardian?.address.street,
        neighborhood: _updateGuardian?.address.neighborhood,
        zipcode: _updateGuardian?.address.zipcode,
        complement: _updateGuardian?.address.complement,
        number: _updateGuardian?.address.number,
        city: _updateGuardian?.address.city,
        uf: _updateGuardian?.address.uf,
        country: _updateGuardian?.address.country,
      },
    })

    await prisma.user.update({
      where: {
        id,
      },

      data: {
        address_id: newAddress.id,
      },
    })
  }

  return reply.status(204).send()
}
