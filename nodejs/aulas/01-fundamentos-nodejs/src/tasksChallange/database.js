import fs from 'node:fs/promises'

const databasePath = new URL('db.json', import.meta.url)

export class Database {
    #database = {}

    constructor () {
        fs.readFile(databasePath, 'utf8').then(data => {
            this.#database = JSON.parse(data)
        })
        .catch(() => {
            this.#persist()
        })
        
    }

    #persist () {
        fs.writeFile(databasePath, JSON.stringify(this.#database))
    }

    select(table, search) {
        let data = this.#database[table] ?? []

        if(search) {
            data = data.filter( row => {
                return Object.entries(search).some(([key, value]) => {
                    return row[key].toLowerCase().includes(value.toLowerCase())
                })
            })
        }

        return data
    }

    insert (table, data) {
        if(Array.isArray(this.#database[table])) this.#database[table].push(data)
        else this.#database[table] = [data]
    
        this.#persist()
        return data
    }

    delete (table, id) {
        if(Array.isArray(this.#database[table])) {
            const rowIndex = this.#database[table].findIndex(row => row.id === id)
            if(rowIndex > -1) {
                this.#database[table].splice(rowIndex, 1)
                this.#persist()
            } else {
                throw new Error('Registro não encontrado')
            }
        }
    }

    update (table, id, data) {
        if(Array.isArray(this.#database[table])) {
            const rowIndex = this.#database[table].findIndex(row => row.id === id)
            if(rowIndex > -1) {
                const oldData = this.#database[table][rowIndex]
                this.#database[table][rowIndex] = {id, ...oldData, ...data}
                this.#persist()
            }
        }
    }

    complete (table, id) {
        if(Array.isArray(this.#database[table])) {
            const rowIndex = this.#database[table].findIndex(row => row.id === id)
            if(rowIndex > -1) {
                const data = this.#database[table][rowIndex]
                this.#database[table][rowIndex] = {...data, completed_at: new Date()}
                this.#persist()
            }
        }
    }
}