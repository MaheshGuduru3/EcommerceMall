const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema({

     email:{
         type:String,
         required:true,
         unique:true,
     },
    username:{
         type: String,
         required:true
    },    
    phoneNumber:{
         type: Number,
         unique:true,
         required:true,
    },
    pincode:{
         type: Number,
         required:true
    },
    address:{
         type: String,
         required:true
    }
},{
     timestamps:true     
})

module.exports = mongoose.model('address', addressSchema)