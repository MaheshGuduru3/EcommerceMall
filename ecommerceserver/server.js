const express = require('express')
const app = express()
const dotenv = require('dotenv').config()
const cors = require('cors')
const cookieParser = require("cookie-parser")
const   dbConnect   = require('./database/db')
const Allapis = require('./routers/routes')



//middleware
app.use(cors({
      credentials:true,
      origin:process.env.HOSTNAME
}))
app.use(express.json())
app.use('/api' , Allapis)
app.use(cookieParser())

//database connection 
dbConnect()

app.get('/',(req,res)=>{
     
     res.cookie('name' , 'ddtfcvgv')
     res.cookie('full' , 'ko')
     console.log(req.cookies.name)
     res.send("Hello Ecommerce application")
})



const connection = ()=>{
    app.listen(3007,()=>{
        console.log("server connected succesfully and ")
   })
}

connection()