import http from 'node:http'


class TransformToNegative extends Transform {

    _transform(chunk, encoding, callback) {
        const transformed = Number(chunk.toString()) * -1

        console.log(transformed)

        callback(null, transformed.toString())
    }

}

//req => readablestream
//res => writableStream
const server = http.createServer(async (req, res) => {

    const buffers = []
    
    ///espera finalizar ter todos os pedaços da stream do req
    for await (const chunk of req) { 
        buffers.push(chunk)
    }

    const fullStream = Buffer.concat(buffers).toString()
    console.log(fullStream)

    res.end(fullStream)

    // req.pipe(new TransformToNegative())
    // .pipe(res)
})

server.listen(3333)