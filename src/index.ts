import express from 'express'
import dotenv from 'dotenv'
import fileUpload, { UploadedFile } from 'express-fileupload'
import path from 'path'
import { parseInvoice } from './invoice-parser'


dotenv.config()

const app = express()
const port = process.env.PORT

app.use(fileUpload())

app.post('/upload', (req, res) => {
    let sampleFile
    let uploadPath: string

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    sampleFile = req.files.invoice as UploadedFile
    uploadPath = path.join(__dirname, '..', '/uploads/', sampleFile.name)
    sampleFile.mv(uploadPath, async (err) => {
        if (err) {
            return res.status(500).send(err)
        }
        const parsedInvoice = await parseInvoice(uploadPath)
        res.setHeader('Content-Type', 'application/json')
        res.send(parsedInvoice)
    })    
})


app.listen(port, () => {
    console.log('Server is running on port ', port)
})