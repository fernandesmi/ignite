import { FastifyRequest } from 'fastify'

export async function logRequests(request: FastifyRequest) {
  console.log(`[${request.method}] ${request.url}`)
}
