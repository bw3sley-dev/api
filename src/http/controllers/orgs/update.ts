import type { FastifyReply, FastifyRequest } from 'fastify'

import { prisma } from '@/lib/prisma'

import { z } from 'zod'

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const orgId = request.user.meta.orgId

  const updateAddressBodySchema = z.object({
    street: z.string().optional(),
    neighborhood: z.string().optional(),
    zipcode: z.string().optional(),
    complement: z.string().optional(),
    number: z.string().optional(),
    city: z.string().optional(),
    uf: z.string().optional(),
    country: z.string().optional(),
  })

  const {
    street,
    neighborhood,
    zipcode,
    complement,
    number,
    city,
    uf,
    country,
  } = updateAddressBodySchema.parse(request.body)

  const organization = await prisma.organization.findUnique({
    where: {
      id: orgId,
    },

    select: {
      address_id: true,
    },
  })

  if (!organization) {
    return reply.status(404).send({
      message: 'Organização não encontrada.',
    })
  }

  if (!organization.address_id) {
    const newAddress = await prisma.address.create({
      data: {
        street,
        neighborhood,
        zipcode,
        complement,
        number,
        city,
        uf,
        country,
      },
    })

    await prisma.organization.update({
      where: {
        id: orgId,
      },

      data: {
        address_id: newAddress.id,
      },
    })

    return reply.status(201).send()
  }

  await prisma.address.update({
    where: { id: organization.address_id },

    data: {
      street,
      neighborhood,
      zipcode,
      complement,
      number,
      city,
      uf,
      country,
    },
  })

  return reply.status(204).send()
}
