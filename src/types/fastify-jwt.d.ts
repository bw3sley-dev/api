import '@fastify/jwt'

declare module '@fastify/jwt' {
  export interface FastifyJWT {
    user: {
      sub: string
      role: 'ADMINISTRATOR' | 'VOLUNTEER'
      meta: {
        orgId: string
        area:
          | 'UNSPECIFIED'
          | 'PSYCHOLOGY'
          | 'PHYSIOTHERAPY'
          | 'NUTRITION'
          | 'NURSING'
          | 'PSYCHOPEDAGOGY'
          | 'PHYSICAL_EDUCATION'
      }
    }
  }
}
