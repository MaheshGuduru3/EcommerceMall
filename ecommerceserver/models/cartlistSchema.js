const mongoose = require('mongoose')


const cartlistSchema = new mongoose.Schema({
      email : {
         type:String,
         required:true
      },
      title:{
        type:String,
        required:true
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
      isCartlist:{
        type:Boolean,
        default:true
      },
      quantity:{
        type:Number,
        default:1
      }
},{
     timestamps:true
})


module.exports = mongoose.model("cartlist", cartlistSchema)