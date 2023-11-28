const  user    = require('../models/userInfoSchema')
const  bcrypt  = require('bcryptjs')
const  jwt     = require("jsonwebtoken")
const  nodemailer = require("nodemailer")
const  Mailgen = require("mailgen")
const  admin = require('../config/firebase.config')
const address = require('../models/addressSchema')


const normalCheck = (req,res)=>{
      res.status(200).json({message:"Route normal check test."})
}


const userSignUp = async (req,res , next)=>{
    const {username , email , password} = req.body
    const hashPassword = await bcrypt.hash(password , 10)


    const resl = await user.findOne({email})
     if(resl){
        return res.status(403).json({message:"Already existed User"})
     }

     try{
         const result = await user.create( { username , email , password : hashPassword})
         if(result){
             req.email = email
             next()
         }
     }
     catch(err){
        res.json(500).json({message:err})
     }

}

const userSignIn = async (req,res)=>{

    const { email , password } = req.body

  
 
    try{
        const result = await user.findOne({email})
    
        if(result){
             if(await bcrypt.compare(password , result.password)){
                 
                const jwtToken = await jwt.sign({id : result._id}, process.env.JWT_SECRET_KEY, {
                     expiresIn:'1h'
                })
                
                res.cookie('jwtTokenid', jwtToken , {
                      expiresIn : 1 * 60 * 60 * 1000,
                      httpOnly:true
                })
        
                res.status(200).json({message:"successfully logged"})
             }   
             else{  
                res.status(404).json({message:"Invalid Email or Password"})
             }
        }
        else{
            res.status(404).json({message:"User Not Found, Please SignUp"})
        }
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
}

const verifyAndGetUser = async (req,res , next)=>{   
     
        const cToken = req.cookies.jwtTokenid
       
         if(cToken === undefined) return

      
        if(!cToken) {
            res.status(403).json({message:"token not found"})
        }
       try{
           const jwtVerifyToken = await jwt.verify(cToken, process.env.JWT_SECRET_KEY)
           if(jwtVerifyToken){         
               req.id = jwtVerifyToken.id
               next()
           }   
           else{
               res.status(403).json({message:"expired"})
           }    
       }
       catch(err){
             res.status(500).json({message: err.meesage})
       }
       

}


const gettingUser = async (req,res)=>{
       
          const id = req.id
          try{
            const result = await user.findById({ _id : id},{password:0})
            if(result){
             res.status(200).json({message:"successfully logged" , data:result}) 
            }    
            else{
              res.status(404).json({message:"Not found user"})
            }
          }
          catch(err){
             res.status(500).json({message:err.message})
          }



}


const AllUserSignUp = async(req,res)=>{
    try{
        const result = await user.find()
        res.status(200).json({data:result})

    }
    catch(err){
         res.status(500).json({message:err.message})
    }
}



const sendingMailVerifyAccount =  async (req,res)=>{
     
       const  getMail  = req.email
       try{
           
       const verifyAccountToken = await jwt.sign({email : getMail} , process.env.JWT_SECRET_KEY, {
        expiresIn:'10m'
    })
    
    const config = {
         service:"gmail",
         auth : {
             user:process.env.EMAIL,
             pass:process.env.EMAIL_PASSWORD
         }
    }

    const transporter = nodemailer.createTransport(config)

    const  mailGenerator = new Mailgen({
          theme:"default",
          product:{
              name:"MyZoneMall",
              link:process.env.HOSTNAME,
          }
    })

    const response = {
        body : { 
           name: getMail,
           intro:"Your welcome",
           action: {
             instructions: 'To get start orders from these application, please click here to verify account',
             button: {
                 color: '#48cfad', 
                 text: 'Verify your account',
                 link: `${process.env.HOSTNAME}/verifyaccount/${verifyAccountToken}`
             }
         },
           outro:"looking forward" 
        }
     }

     const generateMail = mailGenerator.generate(response)

     const message = {
          from: process.env.EMAIL,
          to: getMail,
          subject:"welcome to MyZoneMall",
          html: generateMail 
     }

     const getMessage = await transporter.sendMail(message)
     if(getMessage){
        return res.status(201).json({message:"successfully created", mail:"VerifyMail send To your Mail" , status:true})
     }  
    }
    catch(err){
        return res.status(500).json({message:err}) 
    }
}


const  VerifyAccount  = async (req,res)=>{
       const  { token } = req.body    
       
        try{
            const verifyMailTokenClient  =  await jwt.verify(token , process.env.JWT_SECRET_KEY)
            if(verifyMailTokenClient){
                 const emailClient = verifyMailTokenClient.email
                 const result = await user.findOneAndUpdate({email : emailClient},{$set:{ isVerfied : true}})
                 if(result){
                     res.status(200).json({message:'verified Success'})
                 }
                 else{
                    res.status(404).json({message:"not found"})
                 }
                
            }
            else{
                res.status(404).json({message:"Expired Token", status:false})
            }
        }
        catch(err){
             res.status(500).json({message:err.message})
        }
}


const googleSignUp = async (req,res)=>{
  
    const  tokenClient  = req.cookies.googleTok

  
    try{
        const decoded = await admin.auth().verifyIdToken(tokenClient)
        if(decoded){         
            const  result = await user.findOne({email : decoded.email})
            if(result){
                res.status(403).json({message:"Already Existed"})
              
            }
            else{
               
                const  setData = await user.create({
                     username : decoded.name,
                     email : decoded.email,
                     profile : decoded.picture
                })
             
                if(setData){
                    res.status(201).json({message:"Successfully created" , status:true})
                 
                }
            }
            
        }
        else{
             res.status(404).json({message:"unauthorized user"})
        }
    }
    catch(err){
         res.status(500).json({message:err.message})
    }


}


const googleSignIn = async (req,res)=>{
 
     const tokenClient =  req.cookies.googleTok

     if(!tokenClient) return
    
     try{
         const  decodedToken =  await admin.auth().verifyIdToken(tokenClient)
       
         if(decodedToken){
            const result  = await user.findOne({email  : decodedToken.email})
          

            if(result){
                res.status(200).json({message:"Successfully Logged In" , data : result})
               
            }
            else{
                res.clearCookie('googleTok')
                res.status(404).json({message:"Please register before login"})
         
            }
         }
     }
     catch(err){
       
        res.status(500).json({message:err.message})
     }
}


const UpdateUserInfo = async(req,res)=>{
     const {id }= req.params
     const client  = req.body
     
     try{
         
         const result = await user.findOneAndUpdate({_id:id} , client)
         if(result){
            res.status(200).json({message:"Updated Success"})
         }
         else{
             res.status(404).json({message:"Not Found"})
         }
     }
     catch(err){
        res.status(500).json({message:err.message})
     }
} 


/* forgot password */

const forgetPasswords = async (req,res,next)=>{
        const {email} = req.body 
  
         try{
             const result = await user.findOne({email : email})
             if(result){
              
                 req.email = result.email
                 next()
             }
             else{
                  res.status(404).json({message:"Not Found"})
             }
         }
         catch(err){

         }
       
}


const sendingMailForgetPassword = async (req,res)=>{
   
   
    const  email = req.email

    try{
               
     const tokenPass = await jwt.sign({email : email }, process.env.JWT_SECRET_KEY , {
          expiresIn:'30min'
     })
            const config = {
                service:"gmail",
                auth : {
                    user:process.env.EMAIL,
                    pass:process.env.EMAIL_PASSWORD
                }
            }

            const transporter = nodemailer.createTransport(config)

            const  mailGenerator = new Mailgen({
                theme:"default",
                product:{
                    name:"MyZoneMall",
                    link:process.env.HOSTNAME
                }
            })

            const response = {
                body : { 
                    name: email,
                    intro:"Forget Password",
                    action: {
                    instructions: 'Create new Password by click the link',
                    button: {
                        color: '#48cfad', 
                        text: 'Forget Password',
                        link: `${process.env.HOSTNAME}/createpassword/${tokenPass}`
                    }
                },
                    outro:"looking forward" 
                }
            }

            const generateMail = mailGenerator.generate(response)

            const message = {
                from: process.env.EMAIL,
                to: email,
                subject:"welcome to MyZoneMall",
                html: generateMail 
            }

            const getMessage = await transporter.sendMail(message)
            if(getMessage){
                return res.status(201).json({message:"successfully created", mail:"We sent a link  to your mail" , status:true})
            }  
 }
 catch(err){
     return res.status(500).json({message:err.message}) 
 }
}

const resetPasswords = async(req,res)=>{
       const { token , data} = req.body
    
        
       if(!token){
         res.status(403).json({message:"No token"})
       }
       try{
               const result = await jwt.verify(token , process.env.JWT_SECRET_KEY)
               if(result){
                  if(data.password === data.repassword){
                   
                      const  hashPasswords = await bcrypt.hash(data.password , 10)
                     

                      const finalresult = await user.findOneAndUpdate({email : result.email} , { $set:{ password : hashPasswords }})
                      if(finalresult){
                          res.status(200).json({message : "Updated success" , status : true})
                      }
                      else{
                         res.status(404).json({message:"not found"})
                      }
                  }
               }
               else{
                 res.status(404).json({message:"Unauthourized"})
               }
       }
       catch(err){
           res.status(500).json({message:err.message})
       }
}


const mailverificationAfter = async (req,res,next)=>{
       const { email } = req.body  
    
       try{
          const result = await user.findOne({email:email})
            if(result){
                  
                  req.email = email
                  next()
            }
            else{
                 res.status(404).json({message:'Not Found'})
            }
       }
       catch(err){
            res.status(500).json({message:err.message})
       }   

}



const sendingMailOrderedProducts = async(req,res)=>{
    const { data , payMode , payment , email} = req.body

    const arr = []
    data.length >= 1 ? data.map((itm)=>{
        arr.push({
            title : itm.title,
            price : itm.price,
            quantity : itm.quantity
        })
    }) : arr.push({
        title : data.products[0].title,
        price : data.amount,
        quantity : data.quantity
        
    })
    try{
        
        const mailaddres = await address.findOne({email : email} , {createdAt : 0 , updatedAt : 0 , _id : 0 , email : 0 , __v:0})
        const config = {
            service:"gmail",
            auth : {
                user:process.env.EMAIL,
                pass:process.env.EMAIL_PASSWORD
            }
        }

        const transporter = nodemailer.createTransport(config)

        const  mailGenerator = new Mailgen({
            theme:"default",
            product:{
                name:"MyZoneMall",
                link:process.env.HOSTNAME
            }
        })

        const response = {
            body : { 
                name: email,
                intro:`Your ordered products 
                       Ordered id :  ${payment}
                       Paymode :  ${payMode}
                       Address : ${mailaddres}
                       `,
                table : {
                     data:arr,
                    
                    
                },
                outro:"looking forward" 
            }
        }

        const generateMail = mailGenerator.generate(response)

        const message = {
            from: process.env.EMAIL,
            to: email,
            subject:"welcome to MyZoneMall",
            html: generateMail 
        }

        const getMessage = await transporter.sendMail(message)
        if(getMessage){
            return res.status(201).json({message:"successfully created", mail:"We sent ordered products to your mail" , status:true})
        }  
          
      }
      catch(err){
          return res.status(500).json({message:err.message}) 
      }
   
}



const logOut = async (req,res)=>{

    const   data = req.body
  
  

    try{
        
        const result =   res.clearCookie(data.data)
        if(result){
             res.status(200).json({message:'Logged  Out'})
        }
        else{
            res.status(404).json({message: "Not Found"})
        }
    }
    catch(err){
       res.status(500).json({message:err.message})
    }
}



module.exports = {
     normalCheck,
     AllUserSignUp,
     userSignUp,
     userSignIn,
     verifyAndGetUser,
     gettingUser,
    sendingMailVerifyAccount,
    googleSignUp,
    googleSignIn,
    UpdateUserInfo,
    VerifyAccount,
    forgetPasswords,
    sendingMailForgetPassword,
    resetPasswords,
    mailverificationAfter,
    sendingMailOrderedProducts,
    logOut
}