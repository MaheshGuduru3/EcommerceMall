const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
      
      category:{
         type:String,
         required:true,
         unique:true
      },
      thumbnails:{
          type:String,
          required:true
      }
})


module.exports = mongoose.model("categorys" , categorySchema)