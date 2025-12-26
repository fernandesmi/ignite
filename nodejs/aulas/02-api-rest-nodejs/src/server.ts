import fastify from 'fastify'
import { env } from './env'
import { transactionRoutes } from './routes/transactions'
import cookie from '@fastify/cookie'
import { logRequests } from './middlewares/log-requests'

const app = fastify()

app.addHook('preHandler', logRequests)

app.register(cookie)
app.register(transactionRoutes, {
  prefix: '/transactions',
})

app.listen({ port: env.PORT }).then(() => {
  console.log('HTTP Server Running')
})
