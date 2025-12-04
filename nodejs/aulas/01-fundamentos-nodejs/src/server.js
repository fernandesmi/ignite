import http from 'node:http'
import { json } from './middlewares/json.js'
import { routes } from './routes.js'
import { extractQueryParams } from './utils/extract-query-params.js'

// Query Parameters: URL Stateful => Filtros, paginação, não-obrigatório, nada sensível ex: ?userId=x&name=y
// Router Parameters: Identificação de recurso => ex: users/1
// Request Body: Envio de informações de um formulário (HTTPs) => criptografado, sensível, muitos parametros

const server = http.createServer(async (req, res) => {
    const {method, url} = req

    await json(req, res)

    const route = routes.find((route) => route.method === method && route.path.test(url))



    if(route) {
        const routeParams = req.url.match(route.path)

        const { query, ...params } = routeParams.groups

        req.params = params
        req.query = query ? extractQueryParams(query) : {}

        return route.handler(req,res)
    }
    
    return res.writeHead(404).end()
})

server.listen(3333)