const mongoose = require('mongoose')

const url = process.env.MONGODB_URL 


const dbConnect = async ()=>{
      try{
         const  dbOnline = await mongoose.connect(url)
         if(dbOnline){
             console.log("connected to Database Successfully....")
         }
      }
      catch(err){
        console.log(err.message)
      }
}


module.exports = dbConnect