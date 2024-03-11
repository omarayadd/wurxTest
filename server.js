const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv').config()
const path = require('path');
const bodyParser = require('body-parser')
const crypto = require('crypto')
const multer = require('multer')
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream')
const methodOverride = require('method-override')
const mongoose = require('mongoose');
const{errorHandler} = require("./backend/middleware/errorMiddleware")
const connectDB = require('./backend/config/db')
const cors = require('cors');



const app = express()

app.use(cors())

connectDB() 

// create mongo connection
const conn = mongoose.createConnection(process.env.MONGO_URI)
let gfs;

conn.once('open', ()=>{
    gfs = Grid(conn.db, mongoose.mongo)
    gfs.collection('uploads')
    // console.log(gfs.files.find().toArray())
})


app.use(bodyParser.json());
app.use(methodOverride("_method"))  
app.set('views', path.join(__dirname, 'backend/views'));
app.set('view engine', 'ejs');




const storage = new GridFsStorage({
    url: process.env.MONGO_URI,
    file: (req, file)=>{
        return new Promise((resolve, reject)=>{
            crypto.randomBytes(16, (err, buf)=>{
                if(err){
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo ={
                    filename: filename,
                    bucketName:'uploads'
                };
                resolve(fileInfo)
            })
        })
    }
}) 

const upload = multer({storage})

module.exports = { upload, gfs, app }; 


app.get('/', (req, res)=>{
    res.render('upload')
})


app.get('/files', (req, res)=>{
    console.log(gfs.files.find().toArray())
    gfs.files.find().toArray((err, files)=>{
        if(!files||files.length===0){
            return res.status(404).json({
                err:"no files exist"
            })
        }
        return res.json(files)
    })
})

const port = process.env.port || 8000
app.use(express.json())
app.use(express.urlencoded({extended:false}))


app.use('/api/users', require('./backend/routes/userRoutes'))

app.use(errorHandler)

app.listen(port, ()=>console.log(`Server started on port ${port}`))
