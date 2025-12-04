import { Database } from "./database.js"
import { buidRoutePath } from '../utils/build-route-path.js'
import { randomUUID } from 'node:crypto'


const database = new Database()

export const routes = [
    {
        path: buidRoutePath('/tasks'),
        method: 'GET',
        handler : ((req,res) => {

            const { search } = req.query

            const tasks = database.select('tasks', search ? {
                title: search,
                description: search
            } : null)
            

            res
            .setHeader('Content-Type', 'application/json')
            .end(JSON.stringify(tasks))
        })
    },
    {  
        path: buidRoutePath('/tasks'),
        method: 'POST',
        handler : ((req,res) => {

            const {title, description} = req.body

            const tasks = database.insert('tasks',{
                title,
                description,
                id: randomUUID(),
                completed_at: null,
                created_at: new Date(),
                updated_at: new Date(),
            })
            

            res
            .setHeader('Content-Type', 'application/json')
            .end(JSON.stringify(tasks))
        })
    },
    {
        path: buidRoutePath('/tasks/:id'),
        method: 'PUT',
        handler:((req,res) => {
            const { id } = req.params
            const { title, description } = req.body

            database.update('tasks', id, {title, description})
            
            return res.writeHead(204).end()
        })
    },
    {
        path: buidRoutePath('/tasks/:id'),
        method: 'DELETE',
        handler:((req, res) => {
            const { id } = req.params
            try {
                database.delete('tasks', id)
    
                return res.writeHead(204).end()
            }
            catch(e) {
                return res.writeHead(404).end(JSON.stringify({message: e.message}))
            }
        })
    },
    {
        path: buidRoutePath('/tasks/:id'),
        method: 'PATCH',
        handler:((req,res) => {
            const { id } = req.params

            database.complete('tasks', id)

            return res.writeHead(204).end()
        })
    }
]