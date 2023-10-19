const mongoose = require('mongoose')

const userInfoSchema = mongoose.Schema({
       username:{
         type: String,
         required:true,
       },
       email:{
        type:String,
        required:true,
        unique:true
       },
       profile:{
        type : String,
        default:''
       },
       isVerfied:{
         type : Boolean,
         default:false
       },
       password:{
         type:String,
       },
       phonenumber:{
         type:Number,
         default:0
       }
},
{ timestamps: true }
)


module.exports = mongoose.model('user' , userInfoSchema)