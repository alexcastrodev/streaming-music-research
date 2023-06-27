import Fastify from 'fastify'
import { createReadStream } from 'fs'
import { realpath, stat } from 'fs/promises'
const fastify = Fastify({
  logger: true
})
import db from './db.js'

fastify.get('/', function (request, reply) {
    reply.send({ hello: 'world' })
})

fastify.addContentTypeParser('audio/mpeg', function (request, done) {
    done()
})
  

fastify.get('/music/:id', async function (request, reply) {
    const { id } = request.params
    const music = db.find((music) => music.id === id)
    if(!music) {
        reply.status(404).send({ error: 'Music not found' })
    }

    const path = await realpath(`./assets/${music.file}`)
    const audioStream = createReadStream(path);
    const stats = await stat(path)
    const fileSize = stats.size;

    
    reply.headers({
        'Content-Disposition': `attachment; filename="${music.file}"`,
        'Content-Type': 'audio/mpeg',
        'Content-Length': fileSize,
        'Accept-Ranges': 'bytes',
        'Pragma': 'no-cache',
        'Connection': 'keep-alive',
        'Content-Range': `bytes 0-${fileSize}/${fileSize}`
    })
    reply.type('audio/mpeg')

    audioStream.on('data', (chunk) => {
        fastify.log.info(`Sending chunk of size ${chunk.length}`)
        reply.raw.write(chunk)
    })

    audioStream.on('end', () => {
        return reply.send()
    })

    return reply
})

fastify.listen({ port: 3000, host: '0.0.0.0' })
  .then((address) => console.log(`server listening on ${address}`))
  .catch(err => {
    console.log('Error starting server:', err)
    process.exit(1)
})
