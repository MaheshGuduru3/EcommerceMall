const categorys = require("../models/CategorySchema")

const categorySchemaAllProductsGet = async (req,res)=>{
    try{
         const result = await categorys.find()
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


const categorySchemaAllProductsPost = async(req,res)=>{
    const  clientoutcome = req.body
    try{     
        const result = await categorys.create(clientoutcome)
        if(result){
          res.status(200).json({message:"created success"})
        }
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
}



module.exports = {
     categorySchemaAllProductsGet,
     categorySchemaAllProductsPost
}