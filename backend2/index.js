import express from 'express'
import { createReadStream } from 'fs'
import { realpath, stat } from 'fs/promises'
import db from './db.js'

const app = express()
const port = 3001;

app.get('/', (req, res) => {
    res.send('hello world')
})
  
app.get('/music/:id', async function (req, res) {
    const { id } = req.params
    const music = db.find((music) => music.id === id)
    if(!music) {
       return res.status(404).json({ error: 'Music not found' })
    }

    const path = await realpath(`./assets/${music.file}`)
    const audioStream = createReadStream(path);
    const stats = await stat(path)
    const fileSize = stats.size;

    res.set({
        'Content-Disposition': `attachment; filename=${music.file}`,
        'Content-Type': 'audio/mpeg',
        'Content-Length': fileSize,
        'Accept-Ranges': 'bytes',
        'Pragma': 'no-cache',
        'Connection': 'keep-alive',
        'Content-Range': `bytes 0-${fileSize}/${fileSize}`
    })
    // res.status(206)
    audioStream.pipe(res);
})
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
  