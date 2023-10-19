const mongoose = require('mongoose')


const wishlistSchema = new mongoose.Schema({
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
      isWishlist:{
        type:Boolean,
        default:true
      }
},{
     timestamps:true
})


module.exports = mongoose.model("wishlist", wishlistSchema)