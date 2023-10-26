const allproducts = require('../models/allProductSchema')
const offerproducts = require('../models/offerProductSchema')
const orderproduct = require('../models/orderSchema')
const crypto = require('crypto')  

const ordersAdd = async(req,res)=>{
      const { Data , results , email , payMode , quantity  } = req.body
     
     
       const orderDatas = {
          email : email,
          conform_order_id:crypto.randomUUID(),
          productid: Data._id,
          paymentMode : payMode,
          quantity : quantity,
          amount : Data.price,
          tamount : Data.price * quantity,
          ispaid:true,
          products : [{
               title:Data.title,
               thumbnail:Data.thumbnail
            }],
          razorPayment_orderid: results?.razorpay_order_id || null,
          razorPayment_paymentid: results?.razorpay_payment_id || null,
       }
    
      try{
           const result1 = await allproducts.findByIdAndUpdate({_id:Data._id} , { $set:{ stock : Data.stock - quantity }}) || await offerproducts.findByIdAndUpdate({_id:Data._id} , { $set:{ stock : Data.stock - quantity }})
           if(result1) {
               const result = await orderproduct.create(orderDatas)
               if(result){
                   
                    res.status(200).json({message:"success" ,  data:orderDatas , payment: results?.razorpay_order_id ? results?.razorpay_order_id : orderDatas.conform_order_id })
               }
           }
           else{
              
                res.status(404).json({message:"Not Found"})
           }
      }
      catch(err){
           res.status(500).json({message:err.message})
      }
      
}


const ordersCartAdd  = async(req , res)=>{
        const { Data , payMode , results , tAmount , email} = req.body  
          
     try{
 
          let count = 0
      Data.map(async (itm)=>{
          const result = await allproducts.findOneAndUpdate({title:itm.title}, { $set:{ stock : itm.stock - itm.quantity}})
                 if(result){
                   const arr = {
                    email : email,
                    conform_order_id:crypto.randomUUID(),
                    productid: result.id,
                    paymentMode : payMode,
                    quantity : itm.quantity,
                    amount : itm.price,
                    tamount : tAmount,
                    ispaid:true,
                    products : [{
                       title:itm.title,
                       thumbnail:itm.thumbnail
                    }],
                    razorPayment_orderid: results?.razorpay_order_id || null,
                    razorPayment_paymentid: results?.razorpay_payment_id || null,
                 }
                
                 const resultval = await orderproduct.create(arr)
                 if( resultval ){
                     count++
                     if( count === Data.length){
                       
                         res.status(200).json({message:"success", data:Data , payment: results?.razorpay_order_id ? results?.razorpay_order_id : arr.conform_order_id })
                     }
                 }
               
                 }
                 else{
                   return new Error('Not Found') 
                 } 
            
          
        })
        
     }

     catch(err){
         res.status(500).json({message:err}) 
     }
     
     
     
     
}


const orderSingleUser = async(req,res)=>{
      const { email }= req.params
     
       
      try{
           const result = await orderproduct.find({email : email}).sort({ createdAt: -1})
           if(result){
               res.status(200).json({message:"success" , data:result})
           }
           else{
               res.status(404).json({message:"Not found" })
           }
        }
     catch(err){
          res.status(500).json({message:err.message})
     }
}


const orderproductDelete = async (req,res)=>{
        try{
           const result = await orderproduct.deleteMany()
           if(result){
                res.status(200).json({message:"sucees"})
           }

        }
        catch(err){
           res.status(500).json({message:err.message})
        }
}



module.exports = {
     ordersAdd,
     orderSingleUser,
     ordersCartAdd,
     orderproductDelete,
}