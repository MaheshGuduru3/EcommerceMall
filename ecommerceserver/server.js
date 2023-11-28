const express = require('express')
const app = express()
const dotenv = require('dotenv').config()
const cors = require('cors')
const   dbConnect   = require('./database/db')
const Allapis = require('./routers/routes')

const port  = process.env.PORT


//middleware

app.use(cors({
      credentials:true,
      origin:process.env.HOSTNAME
}))
app.use(express.json())
app.use('/api' , Allapis)



//database connection 
dbConnect()

app.get('/',(req,res)=>{
  
 
     res.send("Hello Ecommerce application")
})



const connection = ()=>{
    app.listen(port,()=>{
        console.log("server connected succesfully and " , port)
   })
}

connection()