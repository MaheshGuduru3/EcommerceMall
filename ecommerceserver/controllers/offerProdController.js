const offerproducts = require('../models/offerProductSchema')




const offerAddProduct = async(req,res)=>{
    const addProd = req.body
      try{
       const result = await offerproducts.create(addProd)
       if(result){
        res.status(200).json({message:"successfully added"})
       }
      }
      catch(err){
        res.status(500).json({message:err.message})
      }
}


const getOfferProd = async (req,res)=>{
      try{
          const result = await offerproducts.find()
          if(result){
            res.status(200).json({message:"success" , data:result})
          }
          else{
            res.status(404).json({message:"not found"})
          }
      }
      catch(err){
        res.status(500).json({message:err.message})
      }
}



module.exports ={
      getOfferProd,
      offerAddProduct
}