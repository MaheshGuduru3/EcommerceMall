const cartlist = require('../models/cartlistSchema')



const cartlistProd = async (req,res)=>{
    const  { email } = req.params
     try{
         const result = await cartlist.find({email})
         if(result){
            res.status(200).json({message:"cartlist present" , data:result})
         }
         else{
            res.status(404).json({message:"Empty Cartlist product"})
         }
     }
     catch(err){
         res.status(500).json({message:err})
     }
}


const cartlistaddProd = async(req,res)=>{
     const  client = req.body
     try{
          const result = await cartlist.create(client)
          if(result){
            res.status(200).json({message:"Add to cart"})
          }
     }
     catch(err){
          res.status(500).json({message:err})
     }
}


const cartlistdeleteProd = async (req,res)=>{
    const  {title}  = req.body
   
    try{
         const result = await cartlist.deleteOne({title})
         if(result){
            res.status(200).json({message:"Removed cartlist"})
         }
    }
    catch(err){
         res.status(500).json({message:err})
    }
}



const cartUpdateQuantity = async (req,res)=>{
        const { id ,  value } = req.body

        try{
             const result = await cartlist.findByIdAndUpdate({_id: id } , { $set:{ quantity : value}})
             if(result){
                res.status(200).json({message:"success"})
             }
             else{
                res.status(404).json({message:"Not found"})
             }
        }
        catch(err){
           res.status(500).json({message:err.message})
        }
 }

 const cartlistAllDelete = async (req,res)=>{
        const { email } = req.body
     
        try{
             const  result = await cartlist.deleteMany({email : email})
             if(result){
                res.status(200).json({message:"success"})
             }
             else{
               res.status(404).json({message:"Not Found"})
             }
        }
        catch(err){
            res.status(500).json({message:err.message})
        }
 }

module.exports = {
     cartlistProd,
     cartlistaddProd,
     cartlistdeleteProd,
     cartUpdateQuantity,
     cartlistAllDelete
}