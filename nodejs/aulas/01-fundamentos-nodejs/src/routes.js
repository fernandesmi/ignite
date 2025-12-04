import { randomUUID } from 'node:crypto'
import { Database } from './middlewares/database.js'
import { buidRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
    {
        method: 'GET',
        path: buidRoutePath('/users'),
        handler: (req, res) => {

            const { search } = req.query

            const users = database.select('users', search ? {
                name: search,
                email: search
            } : null)

            return res
            .setHeader('Content-Type', 'application/json')
            .end(JSON.stringify(users))
        }
    },
    {
        method: 'POST',
        path: buidRoutePath('/users'),
        handler: (req, res) => {
            const { name, email } = req.body

            const users = {
                id: randomUUID(),
                name,
                email
            }

            database.insert('users', users)
            res.writeHead(201).end()
        }
    }, 
    {
        method: 'PUT',
        path: buidRoutePath(`/users/:id`),
        handler: (req, res) => {
            const { name, email } = req.body
            const { id } = req.params

            database.update('users', id, {name, email})
            return res.writeHead(204).end()
        }
    },
    {
        method: 'DELETE',
        path: buidRoutePath(`/users/:id`),
        handler: (req, res) => {
            const { id } = req.params
            database.delete('users', id)
            return res.writeHead(204).end()
        }
    }
]