const mongoose = require('mongoose')


const  offerProductSchema = new mongoose.Schema({
      typeofProduct:{
          type:String,
          default:"offerproduct"
      },
      title:{
        type:String,
        required:true,
        unique:true
      },
      description:{
        type:String,
        required:true
      },
      price:{
        type:Number,
        required:true
      },
      rating:{
        type:Number,
        required:true
      },
      stock:{
        type:Number,
        required:true
      },
      category:{
        type:String,
        required:true
      },
      thumbnail:{
        type:String,
        required:true
      },
      images:{
        type:Array,
        required:true,
      }
},{
     timestamps:true
})


module.exports = mongoose.model("offerproducts", offerProductSchema)