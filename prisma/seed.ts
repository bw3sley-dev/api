import { PrismaClient } from '@prisma/client'

import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const organization = await prisma.organization.create({
    data: {
      name: 'T21 Arena Park',
      slug: 't21-arena-park',
      domain: 't21arenapark.com',
      should_attach_users_by_domain: false,
      default_password: 'default_password123',
      status: true,
      created_at: new Date(),
    },
  })

  await prisma.user.create({
    data: {
      name: 'Administrador',
      email: 'config@dev.com',
      password_hash: await hash('password123', 10),
      status: true,
      birth_date: new Date('1990-01-01'),
      gender: 'MALE',
      cpf: '12345678900',
      phone: '3198765-4321',
      role: 'ADMINISTRATOR',
      created_at: new Date(),
      area: 'UNSPECIFIED',
      organization_id: organization.id,
    },
  })

  console.log('✅ Seed data has been successfully created!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
