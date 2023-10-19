const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
       
      email:{
           type:String,
           required:true,
        },
        conform_order_id:{
            type: String,
            required:true,
            unique:true
        },
        productid : {
           type:String,
        },
        paymentMode:{
            type:String,
        },
        quantity:{
           type:Number,
        },
        amount:{
           type:Number,
        },
        razorPayment_orderid:{
           type:String,
           default:null
        },
        razorPayment_paymentid:{
            type:String,
            default:null
        },
        status:{
           type:String,
           default:"ordered"
        },
        tamount:{
         type:Number,
        },
        ispaid:{
          type:Boolean,
        },
        products:{
         type:Array
        }
},
{
      timestamps:true
})


module.exports = mongoose.model('orderproduct' , orderSchema)