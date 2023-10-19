const allproducts = require('../models/allProductSchema')
const offerproducts = require('../models/offerProductSchema')

const  addManyProducts = async (req,res)=>{
        const clientOutcome = req.body
        try{
          const result = await allproducts.insertMany(clientOutcome)
          if(result){
              res.status(200).json({message:"Successfully inserted"})
          }
        }
        catch(err){
             res.status(500).json({message:err.message})
        }
}

const getLatestProds = async(req,res)=>{
     try{
         const result = await allproducts.find({ typeofProduct : "latestproduct"})
         if(result){
          res.status(200).json({message:"success" , data:result})
         }
         else{
          res.status(404).json({message:"No Latest products"})
         }
     }
     catch(err){
      res.status(500).json({message:err.message})
     }
}

const  getproducts = async(req,res)=>{
          
      try{
        
          const  result = await allproducts.find()
          if(result){
             res.status(200).json({message:"success" , data:result})
          }    
       }
       catch(err){
        res.status(500).json({message:err.message})
       }
}

const singleProd = async (req,res)=>{

    const { id }= req.params

    try{
        const result = await allproducts.findById(id) || await offerproducts.findById(id) 
        if(result){
           res.status(200).json({message:"success" , data:result})
        }
        else{
          res.status(404).json({message:"Not found"})
        }
    }
    catch(err){
           res.status(500).json({message:err.message})
    } 
}

const getsingleCategoryProds = async (req,res)=>{
     const  { id } = req.params
  
     try{
       const result = await allproducts.findById(id) || await offerproducts.findById(id) 
       if(result){
          const result1 = await allproducts.find({ $and : [ { category : { $eq : result.category}} , { _id : { $ne : id }}] }) 
          if(result1){
            res.status(200).json({message:"Found" , data:result1})
          }
          else{
            res.status(404).json({message:"Not Found"})
          }
       }
       
       else{
        res.status(404).json({message:"Not Found Id"})
       }
     }
     catch(err){
        res.status(500).json({message:err.mesage}) 
    }
}



// aggregatio function 

const getCatergory = async(req,res)=>{
        try{
            const result = await allproducts.aggregate([{$group:{ _id : { category : "$category"}}}])
            if(result){
                res.status(200).json({message:"Found", data:result , total:result.length})
            }
            else{
               res.status(404).json({message:"Not Found"})
            }
        }
        catch(err){
          res.status(500).json({message:err.message})
        }
}


const filterCategories = async(req,res)=>{
    const clientSend = req.params   
  
   try{
          const result = await allproducts.find({category : clientSend.category})
          if(result){
              res.status(200).json({message:"success", data:result})
          }
          else{
            res.status(404).json({message:"Not found"})
          }
      }
      catch(err){
         res.status(500).json({message:err.message})
      }
}


const productTitleName = async (req,res)=>{
        const {titles} = req.body
      
        try{
            const result = await allproducts.find({title : { $regex: titles , $options:"i"}})
            if(result){
               res.status(200).json({message:"success" ,  data:result , len : result.length})
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
     addManyProducts,
     getproducts,
     getCatergory,
     singleProd,
     getsingleCategoryProds,
     getLatestProds,
     filterCategories,
     productTitleName
}