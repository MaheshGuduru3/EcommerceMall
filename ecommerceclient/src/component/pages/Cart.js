import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast , ToastContainer } from 'react-toastify'
import { useSelector } from 'react-redux'
import { BiRupee } from 'react-icons/bi'
import { useFormik } from 'formik'
import { validationAddress } from '../../formValidateSchema/forms'
import { RxCross2 } from 'react-icons/rx'
import { useAddorderscartproductsMutation, useGetCartlistQuery, useGetMailOrderedProductsMutation, useGetPaymentOrderMutation, useGetPaymentVerifyMutation, useGetUpdateQuantityCartlistMutation, useGetdeleteCartlistMutation } from '../../features/products/productApi'
import { useAddUserAddressMutation, useGetDeleteAddressMutation, useGetUserAddressQuery } from '../../features/userInfo/userApi'

const Cart = () => {
   const param = useParams()
   const { User } = useSelector(state=>state.userslice)
   
   const navigate = useNavigate()

   const {data} = useGetCartlistQuery(param.email)
   const [updateQuantity] = useGetUpdateQuantityCartlistMutation()

   const [removecart] = useGetdeleteCartlistMutation()
   const deleteHandler1 = async (title)=>{
    try{
      const result = await removecart(title).unwrap()
      if(result){
         toast.error(result.message)
      }
    }
    catch(err){
       toast.error(err)
    }
   } 
   

   const quantityUpdateHandler = async (id , value)=>{
           try{
            const result = await updateQuantity({id, value}).unwrap()
            if(result){
               //  success
            }
           }
           catch(err){
            //   failure
           }

   }


   const [payment , setPayment] = useState(false)
   const [payMode , setPayMode ]  =useState('')
   const { data:datacart , isLoading } = useGetCartlistQuery(User.email)
 
   
   const initialInfo = {
      username : '',
      email: User?.email,   
      pincode:'',
      phonenumber:'',
      address:''
   }
   
    const [address , setAddress] = useState(false)
 
    const [addAddr] = useAddUserAddressMutation()
    const { data:Addr } = useGetUserAddressQuery(User?.email)
    const [verify] = useGetPaymentVerifyMutation()
    const [order , {isLoading:orderload }] = useGetPaymentOrderMutation()
    const [ordercart ] = useAddorderscartproductsMutation()
    const [mailOrdered , {isLoading:load}] = useGetMailOrderedProductsMutation()

 
    const { values ,  handleChange , handleSubmit , errors}  = useFormik({
          initialValues: initialInfo,
          validationSchema: validationAddress,
          onSubmit :  async (data)=>{
              const {  username , email , phonenumber , pincode , address } =  data
              const  sendData = {
                    username,
                    email:User.email,
                    phoneNumber : Number(phonenumber),
                    pincode: Number(pincode),
                    address
              }
               try{
                    const  result = await addAddr(sendData).unwrap()
                    if(result){
                       toast.success(result.message)
                    }              
                 } 
                 catch(err){
                    toast.error("only one address will take if you another please delete these present address then add another")
                 }
          
             } 
 
    })


    const placeOrderCartHandler = async ()=>{
      if(payMode === "cash"){
        console.log(payMode)
               try{
                  const Data = data?.data
                  const email = User?.email
                  const res = await ordercart({ Data, payMode , tAmount , email}).unwrap()

                  if(res.message === "success"){ 
                     const data = res.data
                     const payment = res.payment
                     const mailOrder = await mailOrdered({ data , payMode , payment , email  }).unwrap()     
                      if(mailOrder){
                         
                          toast.success(mailOrder.mail)
                        }  
                        navigate('/purchased')
                  }
            }
            catch(err){
                  
                  toast.error(err.message)
            }
     }
     if(payMode === "online"){
       
         try{
              const result = await order(tAmount).unwrap()
               if(result){ 

                  const options = {
         "key": process.env.REACT_APP_RAZORPAY_KEYID , 
         "amount": result?.data?.amount, 
         "currency": "INR",
         "name": "MyZoneMall",
         "description": "Test Transaction",
         "order_id": result?.data?.id, 
          "handler": async function (response){
               try{
                   const result1 = await verify(response).unwrap()
                   if(result1.message === "success"){
                     try{
                        const Data = data?.data
                        const results = result1?.data
                        const email = User?.email
                        const res = await ordercart({ Data, payMode , results , tAmount , email}).unwrap()
                       

                        if(res.message === "success"){
                           const data = res.data
                           const payment = res.payment
                          
                           const mailOrder = await mailOrdered({ data , payMode , payment , email  }).unwrap()     
                            if(mailOrder){
                               
                                toast.success(mailOrder.mail)
                              }   
                              navigate('/purchased')
                        }
                    }
                    catch(err){                   
                         toast.error(err.message)
                    }
                     
                   }
               }
               catch(err){
                 toast.error(err.message)
               }
          },
         "theme": {
             "color": "#3399cc"
         }
     }
     const razorPayment = new window.Razorpay(options);
     razorPayment.open()     
               }    
         }
         catch(err){
            toast.error(err.message)  
         }
      
}
  if(payMode === ''){
    toast.warning("choose payment method")
  }

}

  

   const [tAmount , setTAmount ] = useState(0)

   const [delAdd] = useGetDeleteAddressMutation() 

   const addressDeleteHandler = async ()=>{
          try{
              const res = await delAdd(User.email).unwrap()
              if(res){
                  toast.success(res.message)
              }
          }
          catch(err){
                toast.error(err.message)
          } 
  }  

   useEffect(()=>{
     let total = 0
      data?.data?.map((itm)=>{
        total +=  itm.price * itm.quantity
     })
       setTAmount(total) 
   },[quantityUpdateHandler])

  
 return (
  
    <div className=''>
        <div className='w-[96rem] m-auto relative top-14 p-2 dark:bg-slate-950'>
          
           {
                orderload && 
               <div className='absolute   top-28 w-[90rem] flex justify-center z-20 dark:text-white'>  
               <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                 <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                 <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
               <span className='font-mono text-xl '>Loding...</span>
               </div>
            }
          
          
          
          
          
           {
                load && 
               <div className='absolute   top-28 w-[90rem] flex justify-center z-20 dark:text-white'>  
               <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                 <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                 <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
               <span className='font-mono text-xl'>Loding...</span>
               </div>
            }

{
                isLoading && 
               <div className='absolute   top-28 w-[90rem] flex justify-center z-20 dark:text-white'>  
               <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                 <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                 <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
               <span className='font-mono text-xl'>Loding...</span>
               </div>
            }
            
             {
                
                data?.data?.length > 0 ?
                <div className='w-[90rem] m-auto flex gap-10'>
                <div className='flex flex-col  gap-5'>                
                {
                  data?.data?.map((itm , index)=>( 
 
                   <div className='w-[60rem]  h-48 shadow-md p-2 border  flex  gap-2  items-center justify-evenly dark:bg-slate-900 dark:text-white dark:border-slate-500' key={index}>
                         <div>
                           <img  src={itm.thumbnail} alt='thumbnail' className='w-[15rem] h-44'/>
                         </div>
                         <div className='w-[20rem]'>
                           <h4 className='text-lg font-mono truncate'>{itm.title}</h4>
                           <h4 className='text-md font-extralight'>Rating:{itm.rating}</h4>
                           <div className='flex justify-between p-0.5'>
                           <h4 className={itm.stock > 0 ? "text-green-500 font-mono text-lg" : ""}>{itm.stock > 0 ? "InStock" : "NoStock"}</h4>
                           <h4 className='text-md font-semibold'>Price: <BiRupee className=' inline-block' />{itm.price}</h4>
                           </div>
                         </div>
                            <div className=''>
                               <select className='border p-1 dark:text-black' onChange={(e)=>quantityUpdateHandler(itm._id , e.target.value)}>
                                <option value={itm.quantity} selected disabled>{itm.quantity}</option>
                                 <option value='1'>1</option>
                                 <option value='2'>2</option>
                                 <option value='3'>3</option>
                                 <option value='4'>4</option>
                                 <option value='5'>5</option>
                               </select>
                            </div>
                           <div className='flex justify-between items-center p-2'> 
                           <button className={itm.isCartlist && 'bg-red-500 text-white font-serif p-1.5 rounded-md'} onClick={()=>deleteHandler1(itm.title)}>Remove Cart</button>
                          </div>
                   </div>
 
 
                  ))
                }
              </div>
                 <div>
                     <div className=' w-[20rem] p-2 bg-amber-300 shadow-lg'>
                       <h4 className='text-lg font-extralight'>SubTotal amount</h4>
                       <h4 className='text-md font-extralight'>Total products : {datacart?.data?.length >=1 ? datacart?.data?.length : 0}</h4>
                       <h2 className='text-md font-mono'>price : <BiRupee className=' inline-block'/>{ tAmount }</h2>
                     </div>

                     <button className='bg-red-500 p-0.5 px-2 text-white font-mono rounded-sm mt-2' onClick={()=>setAddress(true)}>PlaceOrder</button>
                </div>
                     {
              address && 
              <div className='absolute top-1 z-10'>
                  <div className='w-[90rem]'>
                     <div  className='w-[30rem] min-h-[25rem] m-auto bg-white shadow-lg p-5 dark:bg-slate-950 dark:text-white'>
                          <h4 className='text-2xl font-light'>Fill Your Address</h4>
                          <div>
                             <form onSubmit={handleSubmit}>
                                 <div className='flex flex-col'>    
                                    <label>UserName</label>
                                    <input className='form-input text-black' name='username' value={values.name} onChange={handleChange}/>
                                    { errors.username && <p className='text-red-600'>{errors.username}</p> }
                                 </div>
                                 <div className='flex flex-col'>
                                    <label>Email Address</label> 
                                    <input className='form-input text-black' name='email' value={values.email || User?.email}  readOnly onChange={handleChange}/> 
                                 </div>
                                 <div className='flex flex-col'>
                                    <label>Phone Number</label>
                                    <input className='form-input text-black' name='phonenumber' value={values.name} onChange={handleChange}/>
                                    { errors.phonenumber && <p className='text-red-600'>{errors.phonenumber}</p> }
                                 </div>
                                 <div className='flex flex-col'>
                                    <label>Pincode</label>
                                    <input className='form-input text-black' name='pincode' value={values.name} onChange={handleChange}/>
                                    { errors.pincode && <p className='text-red-600'>{errors.pincode}</p> }
                                 </div>
                                 <div className='flex flex-col'>
                                    <label>Address</label>
                                    <textarea className='form-input text-black' name='address' value={values.name} onChange={handleChange}/>
                                    { errors.address && <p className='text-red-600'>{errors.address}</p> }
                                 </div>
                                 <div className='text-end mt-2'>
                                    <button className='bg-red-500 text-lg font-thin rounded-md p-1 px-2 mr-1 text-white'>Save</button>
                                    <button className='bg-gray-400 text-lg font-thin rounded-md p-1 px-2 text-white' onClick={()=>setAddress(false)}>Cancel</button>
                                 </div>
                             </form>
                             <div className='w-[30rem]'>
                            
                              {
                                  Addr?.data?.map((itm)=>(
                                    <div className='w-[10rem] border flex items-start relative gap-1 p-1 m-1'>
                                          <input  type='checkbox' className='text-[2rem]' checked/>
                                          <div className='w-[9rem]'>
                                             <h4>{itm.username}</h4>
                                             <h4 className='truncate'>{itm.email}</h4>
                                             <h4>{itm.phoneNumber}</h4>
                                             <h4>{itm.pincode}</h4>
                                             <h4 className=' truncate'>{itm.address}</h4>
                                          </div>
                                          <button className='absolute right-0' onClick={addressDeleteHandler}><RxCross2 className='text-xl' /></button>
                                     </div>
                                  ))
                              }
                            </div>  
                              <button className='bg-red-500 rounded-md text-white p-1 text-end' onClick={()=>{setAddress(false); setPayment(true)}}   disabled={ Addr.data.length ? false :true}>{Addr.data.length ? "PayMentMethod": "Required Address please Enter"}</button>
       
                          </div>
                     </div>
                  </div>
             </div>
           }


           {
              payment && 
              <div className='absolute top-1 z-10'>
                  <div className='w-[90rem]'> 
                  
                     <div className='w-[30rem] m-auto bg-white shadow-lg p-5 flex flex-col gap-2 relative dark:bg-slate-950 dark:text-white'>
                         <h4 className='text-xl font-sans'>Choose Payment Mode</h4>
                         <div className='p-1 text-md font-thin border rounded-md'>
                           <h5>Cash Payment</h5>
                           <div>
                              <input  type='radio' name='payment'  onClick={()=>setPayMode("cash")}/>
                              <label>CashOn delivery</label>
                           </div>
                         </div>
                         <div className='p-1 text-md font-thin border rounded-md'>
                           <h5>OnlinePayment</h5>
                           <div>
                              <input  type='radio'  name='payment' onClick={()=>setPayMode("online")}/>
                              <label>RazorPay</label>
                           </div>
                         </div>                     
                         <button className='bg-red-500 text-white p-1 px-2' onClick={placeOrderCartHandler}>PlaceOrder</button>
                      <button className='absolute right-5' onClick={()=>setPayment(false)}><RxCross2 className='text-2xl' /></button>
                     </div>
                  </div>
               </div>
           }
                 
              </div>
                 :
               
               <div>
               
                <h1 className='text-xl font-bold text-center dark:text-white'>Empty Cart</h1>
               
               </div>

             }
          
          </div>
          <ToastContainer />
    </div>
    
  )
}

export default Cart