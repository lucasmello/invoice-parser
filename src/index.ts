import express from 'express'
import dotenv from 'dotenv'
import fileUpload, { UploadedFile } from 'express-fileupload'


dotenv.config()

const app = express()
const port = process.env.PORT

app.use(fileUpload())

app.get('/', (req, res) => {
    res.send('WORKED!!!')
})

app.post('/upload', (req, res) => {
    let sampleFile
    let uploadPath: string

    // console.log(req)
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    sampleFile = req.files.invoice as UploadedFile
    uploadPath = __dirname + '/uploads/' + sampleFile.name
    console.log('Upload path is ', uploadPath)
    sampleFile.mv(uploadPath, (err) => {
        if (err) {
            return res.status(500).send(err)
        }
        res.send(`File uploaded to ${uploadPath}`)
    })
})


app.listen(port, () => {
    console.log('Server is running on port ', port)
})