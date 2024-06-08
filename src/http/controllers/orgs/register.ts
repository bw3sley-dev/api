import type { FastifyReply, FastifyRequest } from 'fastify'

import { hash } from 'bcryptjs'

import { z } from 'zod'

import { prisma } from '@/lib/prisma'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    slug: z.string(),
    domain: z.string(),
    shouldAttachUsersByDomain: z.boolean().default(false),
    defaultPassword: z.string().min(6),
  })

  const { name, slug, domain, shouldAttachUsersByDomain, defaultPassword } =
    registerBodySchema.parse(request.body)

  const hashedPassword = await hash(defaultPassword, 6)

  const doesOrgExist = await prisma.organization.findFirst({
    where: {
      AND: [{ slug }, { domain }],
    },
  })

  if (doesOrgExist) {
    return reply.status(409).send({
      message: 'A organização já existe.',
    })
  }

  const { id: addressId } = await prisma.address.create({
    data: {},
  })

  const org = await prisma.organization.create({
    data: {
      name,
      slug,
      domain,

      should_attach_users_by_domain: shouldAttachUsersByDomain,
      default_password: hashedPassword,

      address_id: addressId,
    },
  })

  return reply.status(201).send({
    org_id: org.id,
  })
}
