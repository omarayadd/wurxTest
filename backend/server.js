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
const{errorHandler} = require("./middleware/errorMiddleware")
const connectDB = require('./config/db')
const cors = require('cors');


const port = process.env.port || 8000
const app = express()

app.use(cors())

connectDB() 

//Middleware
app.use(bodyParser.json());
app.use(methodOverride("_method"))  
// Set the views directory to include the 'backend' folder
// Set the views directory
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// create mongo connection
const conn = mongoose.createConnection(process.env.MONGO_URI)
let gfs;

conn.once('open', ()=>{
    //initialize stream
    gfs = Grid(conn.db, mongoose.mongo)
    gfs.collection('uploads')
})

//create storage engine
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

module.exports = upload;


app.get('/', (req, res)=>{
    res.render('upload')
})


app.get('/files', (req, res)=>{
    gfs.files.find().toArray((err, files)=>{
        if(!files||files.length===0){
            return res.status(404).json({
                err:"no files exist"
            })
        }
        return res.json(files)
    })
})

app.get('/files/:filename', (req, res)=>{
    gfs.files.findOne({filename:req.params.filename}, (err, file)=>{
        if(!file||file.length===0){
            return res.status(404).json({
                err:"no file exist"
            })
        }
        return res.json(file)
    })
})

app.use(express.json())
app.use(express.urlencoded({extended:false}))


app.use('/api/users', require('./routes/userRoutes'))

app.use(errorHandler)

app.listen(port, ()=>console.log(`Server started on port ${port}`))
