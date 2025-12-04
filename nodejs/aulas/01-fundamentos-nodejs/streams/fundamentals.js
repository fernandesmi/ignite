// process.stdin.pipe(process.stdout)

import { Readable, Transform, Writable } from 'node:stream'

class OneToHundredStream extends Readable {
    index = 1
    
    _read() {
        const i = this.index++

        setTimeout(() => {
            if(i>100) this.push(null)
            else {
                const buff = Buffer.from(String(i))
                this.push(buff)
            }
        }, 1000)
    }
}


class MultiplyByTen extends Writable {


    _write(chunk, encoding, callback) {
        console.log(Number(chunk?.toString()) * 10)
        callback()
    }
}


class TransformToNegative extends Transform {

    _transform(chunk, encoding, callback) {
        const transformed = Number(chunk.toString()) * -1

        callback(null, transformed.toString())
    }

}

new OneToHundredStream()
.pipe(new TransformToNegative())
.pipe(new MultiplyByTen())