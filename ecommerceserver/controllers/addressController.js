const address = require('../models/addressSchema')


const addAddress = async (req,res)=>{
      const { data } = req.body  
   
      try{
         const result = await address.create(data)
         if(result){
            res.status(200).json({message:"success Created"})
         }
      }
      catch(err){
         res.status(500).json({message:err.message})
      }
}

const getAddress = async (req,res)=>{
     const { mail }  = req.params

      try{
         const result  = await address.find({ email : mail})
         if(result){
            res.status(200).json({message:"success" , data:result})
         }
         else{
             res.status(404).json({message:"Not Found"})
         }
      }
      catch(err){
         res.status(500).json({message:err.message})
      }
}


const deleteAddress = async (req,res)=>{
      const { email } = req.body
      try{
            const result = await address.deleteOne({email : email})
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
     addAddress,
     getAddress,
     deleteAddress
}