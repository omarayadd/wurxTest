const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv').config()
const port = process.env.port || 8000
const app = express()
const{errorHandler} = require("./middleware/errorMiddleware")
const connectDB = require('./config/db')

connectDB()

app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use('/api/users', require('./routes/userRoutes'))

app.use(errorHandler)
app.listen(port, ()=>console.log(`Server started on port ${port}`))