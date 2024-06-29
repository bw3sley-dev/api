import { FastifyReply, FastifyRequest } from 'fastify'

import { z } from 'zod'

import { prisma } from '@/lib/prisma'

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.sub
  const orgId = request.user.meta.orgId

  const updateSchema = z.object({
    name: z.string(),
    cpf: z.string(),
    gender: z.enum(['MALE', 'FEMALE']).optional(),
    phone: z.string().optional(),
    birthDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: 'Formato da data inválido',
    }),
    address: z
      .object({
        street: z.string().optional(),
        city: z.string().optional(),
        uf: z.string().optional(),
        zipcode: z.string().optional(),
        complement: z.string().optional(),
        neighborhood: z.string().optional(),
        number: z.string(),
        country: z.string().default('BRASIL').optional(),
      })
      .optional(),
  })

  const { name, cpf, gender, birthDate, address, phone } = updateSchema.parse(
    request.body,
  )

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
      organization_id: orgId,
    },
  })

  if (!user) {
    return reply.status(403).send({
      message: 'Usuário não possui permissão.',
    })
  }

  await prisma.user.update({
    where: {
      id: userId,
      organization_id: orgId,
    },

    data: {
      name,
      cpf,
      gender,
      phone,
      birth_date: birthDate && new Date(birthDate),
    },
  })

  if (address) {
    if (user.address_id) {
      await prisma.address.update({
        where: { id: user.address_id },

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
        id: userId,
      },

      data: {
        address_id: newAddress.id,
      },
    })
  }

  return reply.status(204).send()
}
