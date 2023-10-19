const Razorpay = require('razorpay');
const crypto = require('crypto')

const instance = new Razorpay({
     key_id: process.env.RAZORPAY_KEYID,
     key_secret: process.env.RAZPORPAY_SECRETID
 })


const orderCreation = async(req,res)=>{
    
    const {amount} = req.body
    
   

    const options = {
      amount : amount*100,  // amount in the smallest currency unit
      currency: "INR",
      receipt: "order_rcptid_11"
    };
    try{
        const orders = await instance.orders.create(options)
         res.status(200).json({message:"success" , data:orders})
    }
    catch(err){
         res.status(500).json({message:err.message})
    }
}

const verifypaymentOrder = async (req,res)=>{
        const  { data } = req.body


        const { razorpay_order_id , razorpay_payment_id } = data

        const body = data.razorpay_order_id + "|" + data.razorpay_payment_id
            const exceptedSign = crypto.createHmac("sha256" , process.env.RAZPORPAY_SECRETID)
                                        .update(body.toString())
                                        .digest("hex")
           
        if(data.razorpay_signature === exceptedSign){

          res.status(200).json({message:"success" , data:{ razorpay_order_id , razorpay_payment_id}})
        }
        else{
           res.status(500).json({message:err.message})
        }

}


module.exports = {
     orderCreation,
     verifypaymentOrder
}