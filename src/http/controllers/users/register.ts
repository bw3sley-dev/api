import type { FastifyReply, FastifyRequest } from 'fastify'

import { prisma } from '@/lib/prisma'

import { hash } from 'bcryptjs'

import { z } from 'zod'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6).optional(),
    phone: z.string().optional(),
    area: z
      .enum([
        'UNSPECIFIED',
        'PSYCHOLOGY',
        'PHYSIOTHERAPY',
        'NUTRITION',
        'NURSING',
        'PSYCHOPEDAGOGY',
        'PHYSICAL_EDUCATION',
      ])
      .default('UNSPECIFIED'),
    role: z.enum(['ADMINISTRATOR', 'VOLUNTEER']).default('VOLUNTEER'),
    orgId: z.string().uuid(),
  })

  const { name, email, area, role, phone, password, orgId } =
    registerBodySchema.parse(request.body)

  let hashedPassword

  if (password) {
    hashedPassword = await hash(password, 6)
  } else {
    const organization = await prisma.organization.findUnique({
      where: {
        id: orgId,
      },
    })

    if (!organization) {
      return reply.status(404).send({
        message: 'Organização não encontrada.',
      })
    }

    hashedPassword = organization?.default_password

    if (hashedPassword) {
      return reply.status(404).send({
        message: 'Plataforma não possui uma senha padrão.',
      })
    }
  }

  const doesUserExist = await prisma.user.findFirst({
    where: {
      AND: [
        {
          email,
        },

        {
          organization_id: orgId,
        },
      ],
    },
  })

  if (doesUserExist) {
    return reply.status(409).send({
      message: 'Usuário já criado.',
    })
  }

  const isUserAnAdministrator = role === 'ADMINISTRATOR'

  if (!isUserAnAdministrator) {
    return reply.status(401).send({
      message: 'Você não tem permissão para cadastrar um usuário.',
    })
  }

  const { id: addressId } = await prisma.address.create({
    data: {},
  })

  await prisma.user.create({
    data: {
      name,
      password_hash: hashedPassword,
      email,
      role,
      phone,
      area,

      organization_id: orgId,

      address_id: addressId,
    },
  })

  return reply.status(201).send()
}
