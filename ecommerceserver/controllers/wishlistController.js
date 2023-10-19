const wishlist = require('../models/wishlistSchema')



const wishlistProd = async (req,res)=>{
    const  { email }  = req.params

    try{
         const result = await wishlist.find({email})
         if(result){
            res.status(200).json({message:"wishlist present" , data:result})
         }
         else{
            res.status(404).json({message:"Empty wishlist product"})
         }
     }
     catch(err){
         res.status(500).json({message:err})
     }
}

const wishlistaddProd = async (req,res)=>{
     const  outcome = req.body
     try{
        const result = await wishlist.create(outcome)
        if(result){
            res.status(200).json({message:"wishlist added"})
        }
     }
     catch(err){
         res.status(500).json({message:err})
     }
}

const wishlistdeleteProd = async(req,res)=>{
   
    const { title } = req.body
   
   
    try{
         const result = await wishlist.deleteOne({title})
         if(result){
             res.status(200).json({message:"Removed From Wishlist"})
         }
     }
     catch(err){  
         res.status(500).json({message:err})
     }
}

module.exports = {
     wishlistProd,
     wishlistaddProd,
     wishlistdeleteProd
}