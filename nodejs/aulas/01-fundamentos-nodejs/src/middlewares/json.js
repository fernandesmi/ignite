export async function json(req, res){
        const buffers = []
    
    ///espera finalizar ter todos os pedaços da stream do req
    for await (const chunk of req) { 
        buffers.push(chunk)
    }



    try {
        req.body = JSON.parse(Buffer.concat(buffers).toString())
    } catch {
        req.body = null
    }

}