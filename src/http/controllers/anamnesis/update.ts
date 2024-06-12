import type { FastifyReply, FastifyRequest } from 'fastify'

import { z } from 'zod'

import { prisma } from '@/lib/prisma'

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const updateAnswerParamsSchema = z.object({
    id: z.string().uuid(),
    sectionId: z.string(),
    questionId: z.string(),
  })

  const { id, sectionId, questionId } = updateAnswerParamsSchema.parse(
    request.params,
  )

  const updateAnswerBodySchema = z.object({
    value: z.string().optional(),
    observation: z.string().optional(),
  })

  const { value, observation } = updateAnswerBodySchema.parse(request.body)

  const question = await prisma.question.findFirst({
    where: {
      id: Number(questionId),

      section: {
        id: Number(sectionId),
        anamnesis_id: id,
      },
    },

    include: {
      answers: true,
    },
  })

  if (!question) {
    return reply.status(404).send({
      message: 'Questão não encontrada para determinada anamnese e/ou seção.',
    })
  }

  await prisma.question.update({
    where: {
      id: Number(questionId),
    },

    data: {
      observation,
    },
  })

  await prisma.answer.update({
    where: {
      question_id: Number(questionId),
    },

    data: {
      value: value || question.answers?.value,
    },
  })

  return reply.status(204).send()
}
