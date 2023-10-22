import React, { useEffect, useState } from 'react'
import { useParams , NavLink , useNavigate} from 'react-router-dom'
import { AiFillStar } from 'react-icons/ai'
import { BiRupee } from 'react-icons/bi'
import {  useSelector } from 'react-redux'   
import { toast , ToastContainer } from 'react-toastify'
import { useFormik } from 'formik'
import { validationAddress } from '../../formValidateSchema/forms'
import { RxCross2 } from 'react-icons/rx'
import { useAddOrdersProductMutation, useGetCartlistQuery, useGetDeleteWishlistMutation, useGetMailOrderedProductsMutation, useGetNamedCategoryallQuery, useGetPaymentOrderMutation, useGetPaymentVerifyMutation, useGetSingleproductQuery, useGetWishListQuery, useGetaddCartlistMutation, useGetdeleteCartlistMutation, useGetmakeWishListMutation } from '../../features/products/productApi'
import { useAddUserAddressMutation, useGetDeleteAddressMutation, useGetUserAddressQuery } from '../../features/userInfo/userApi'


const SingleProduct = () => {    
  
   const { User } =  useSelector((state)=>state.userslice) 
  const param = useParams()

  const  { data ,  isLoading } = useGetSingleproductQuery(param.id)
     
  const  {data:data1 } = useGetNamedCategoryallQuery(param.id)

  const [order , {isLoading:orderload}] = useGetPaymentOrderMutation()
  const [verify] = useGetPaymentVerifyMutation()
  const [orderProds] = useAddOrdersProductMutation()

 
    
  const [addAddr] = useAddUserAddressMutation()
  const { data:Addr } = useGetUserAddressQuery(User?.email)
  const [imgslide , setImgslide] = useState(0)
  const [quantity , setQuantity] = useState(1)
  const [payment1 , setPayment1] = useState(false)
  const [payMode1 , setPayMode1 ]  =useState('')

  
  const initialInfo = {
     username : '',
     email: User?.email,   
     pincode:'',
     phonenumber:'',
     address:''
  }
  
   const [address1 , setAddress1] = useState(false)
   const [mailOrdered , { isLoading:load }] = useGetMailOrderedProductsMutation()
  
   const  navigate = useNavigate()

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

   

   const BuyingHandler = ()=>{
 
        if(User.length === undefined  && User ){  
              setAddress1(true)
        }
        else{
             navigate('/login')
        }
   }   
   const placeOrderHandler = async ()=>{
      
        if(payMode1 === "cash"){
      
           try{
            const Data = data?.data
            const email = User.email
            const res = await orderProds({ Data  , email , payMode1 , quantity}).unwrap()
           
            if(res.message === "success"){
               const data = res.data
               const payment = res.payment
               const payMode = payMode1

               const mailOrder = await mailOrdered({ data , payMode , payment , email  }).unwrap()     
               if(mailOrder){
                  
                   toast.success(mailOrder.mail)
                 
               } 
                 navigate(`/purchased`)
             }
        }
        catch(err){
         
             toast.error(err)
        }
        }
        if(payMode1 === "online"){
          
            try{
                 const result = await order((data?.data?.price * quantity)).unwrap()
                  if(result){
                     

                     const options = {
            "key": process.env.REACT_APP_RAZORPAY_KEYID , 
            "amount": result?.data?.amount, 
            "currency": "INR",
            "name": "MyZone Mall",
            "description": "Test Transaction",
            "order_id": result?.data?.id, 
            
             "handler": async function (response){
                  try{
                      const result1 = await verify(response).unwrap()
                      if(result1.message === "success"){
                      
                  
                        try{
                           const Data = data?.data
                           const results = result1?.data
                           const email = User.email
                           const res = await orderProds({ Data , results  , email , payMode1 , quantity}).unwrap()
                       
                           if(res.message === "success"){
                              const data = res.data
                              const payment = res.payment
                              const payMode = payMode1
                              const mailOrder = await mailOrdered({ data , payMode , payment , email  }).unwrap()     
                              if(mailOrder){
                                 
                                  toast.success(mailOrder.mail)
                                
                              } 
                                navigate(`/purchased`)
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

   if(payMode1 === ''){
      toast.warning("Choose payment method")
   }
}


const { data:data3}  = useGetWishListQuery(User.email)
const [makeWish] = useGetmakeWishListMutation() 
const [deleteWish] = useGetDeleteWishlistMutation()
// All the send and delete cartlist prods api
const {data:data2} = useGetCartlistQuery(User.email)
const [addCart]  = useGetaddCartlistMutation()
const [deleteCart] = useGetdeleteCartlistMutation()

const  makeWishlistHandler = async(itm)=>{    
     const { title , description , price , rating , stock , category , thumbnail }  = itm     
     const sendWishServer = {
       email :User.email,
       title,
       description,
       price,
       rating,
       stock,
       category,
       thumbnail,
    } 

try{
  const result = await makeWish(sendWishServer).unwrap()
  if(result){
     toast.success(result.message) 
  }
} 
catch(err){
   toast.error(err)
}
} 
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

const deleteWishHandler = async (title)=>{
try{
  const result = await deleteWish(title).unwrap()
  if(result){
     toast.error(result.message)
  }
}
catch(err){
   toast.error(err)
}
}

const  addCartHandler = async(itm)=>{    
const { title , description , price , rating , stock , category , thumbnail  }  = itm     
const sendCartServer = {
  email : User.email,
  title,
  description,
  price,
  rating,
  stock,
  category,
  thumbnail,
} 

try{
const result = await addCart(sendCartServer).unwrap()
if(result){
toast.success(result.message) 
}
} 
catch(err){
toast.error(err)
}
} 


const deleteCartHandler = async (title)=>{
try{
  const result = await deleteCart(title).unwrap()
  if(result){
     toast.error(result.message)
  }
}
catch(err){
   toast.error(err)
}
}



   useEffect(()=>{
       
   },[payMode1])
      
    return (
    <div className='max-w-[96rem] m-auto relative top-14 mobile dark:bg-slate-950'>
         <div className=' p-1'>
            
      

            {
               isLoading ?               
                <div className='w-full flex justify-center dark:text-white'>
                  <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className='font-mono text-xl'>Loding...</span>
              </div>
             :
            <>
            <div className='flex justify-center flex-col items-center md:flex-row'>
             <div className='w-full sm:w-[40rem] border h-[35rem] p-4  dark:text-white'>
                <div>  
                    <img  src={data?.data?.images[imgslide]} alt='image'  className='w-full h-[25rem] rounded-md'/>
                </div>  
                <div className='flex mt-2 gap-2 justify-center' >
                {
                    data?.data?.images.map((itm , index)=>(
                        
                           <button key={index} className={ imgslide === index ? "border border-blue-500 p-1":""} onClick={()=>setImgslide(index)}>
                            <img  className='w-[5rem] h-[5rem]' src={itm} />
                           </button>
                        
                    ))
                }
                </div>
             </div>
             <div className='w-full sm:w-[40rem] p-4 dark:text-white'>
                  <div className='flex flex-col  gap-2'>
                    <div>
                        <h6 className='text-5xl font-semibold'>{data?.data.title}</h6>
                    </div>
                    <div>
                        <h5 className='text-lg font-light'>{data?.data.description}</h5>
                    </div>
                    <div>
                        <h5 className='text-lg font-mono'><BiRupee className='inline-block' />{data?.data?.price}</h5>
                    </div>
                    <div className='flex gap-4'>
                        <h4 className='flex items-center bg-green-400 p-0.5 px-1 rounded-md'>{data?.data.rating} <AiFillStar className=' text-amber-400'/></h4>
                        <h4 className={data?.data.stock > 0 &&  quantity <=  data?.data?.stock ? "bg-green-500 py-0.5 rounded-md text-white font-mono px-2" : "bg-red-500 py-0.5 rounded-md text-white font-mono px-2"}>{data?.data.stock > 0 && quantity <=  data?.data?.stock ? "InStock" : "OutofStock"}</h4>
                    </div>
                    <div className='flex dark:text-black'>
                        <button className='border bg-white font-bold px-2.5' onClick={()=>{ quantity <= 1 ? setQuantity(1) : setQuantity(quantity-1)}}>-</button>
                        <h4 className='p-1 text-md font-mono dark:text-white'>{quantity}</h4>
                        <button className='border bg-white font-bold px-2.5' onClick={()=>{ quantity >= 5 ? setQuantity(1) : setQuantity(quantity+1)}}>+</button>
                    </div>       
                      <div className='w-full sm:w-[20rem] flex flex-col gap-1'>
                        <button className='bg-blue-400 p-1 rounded-md text-white font-semibold w-full' onClick={()=>{if(User.length === undefined  && User){BuyingHandler()}else{navigate('/login')}}} disabled={ quantity >  data?.data?.stock ? true : false}>Buy</button>
                        
                          <button className={data?.data?.typeofProduct === 'offerproduct' ? 'hidden':'text-white font-serif w-full'}>
                            {
                                data2?.data?.find((val)=> (val.title === data?.data?.title && val.email ===  User.email)) ?
                                 <button className='bg-red-500 p-1.5 rounded-md w-full' onClick={()=>deleteCartHandler(data?.data?.title)}>Remove Cart</button>
                                 :
                                 <button className='bg-blue-500 p-1.5 rounded-md w-full' onClick={()=>{ if(User.length === undefined  && User) {addCartHandler(data?.data)} else{ navigate('/login')}}}>Add to Cart</button>
                            }
                          </button>
                          <button className={data?.data?.typeofProduct === 'offerproduct' ? 'hidden':'text-white font-serif w-full'}>
                                {
                                 data3?.data?.find((val)=> (val.title === data?.data?.title && val.email ===  User.email)) ?
                                  <button className='bg-red-500 w-full rounded-md p-1.5' onClick={()=>deleteWishHandler(data?.data?.title)} > Remove from wish</button>   
                                   :
                                  <button className='bg-blue-500 w-full rounded-md p-1.5' onClick={()=>{ if(User.length === undefined  && User) {makeWishlistHandler(data?.data)} else{ navigate('/login')}}} >Add to wish</button>
                               } 
                           </button>
                           </div>
                    </div>
                  </div>
             </div>
          


          <div className='p-2 dark:text-white'>
            <h4 className='text-2xl font-thin'>similar products</h4>
            <div className='flex flex-wrap gap-3 sm:justify-start'>  
               {
                 data1?.data?.length === 0 && <div>Not Found</div>   
               }
               

               {
                  data1?.data?.map((itm , index)=>(

                     <div className='w-[15rem] min-h-60 shadow-md p-2 border  flex flex-col gap-2 dark:bg-slate-900 dark:text-white dark:border-slate-500' key={index}>
                           <NavLink to={`/singleproduct/${itm._id}`}>
                             <img  src={itm.thumbnail} alt='thumbnail' className={"w-full h-32"}/>
                           </NavLink>
                           <div>
                             <h4 className='text-lg font-mono truncate'>{itm.title}</h4>
                             <h4 className='text-md font-extralight flex items-center bg-green-400 w-14 px-2 py-0.5 rounded-md'>{itm.rating} <span><AiFillStar className=' text-amber-500'/></span></h4>
                             <div className='flex justify-between p-0.5'>
                             <h4 className={itm.stock > 0 ? "text-green-500 font-mono text-lg" : ""}>{itm.stock > 0 ? "InStock" : "NoStock"}</h4>
                             <h4 className='text-md font-semibold'><BiRupee className='inline-block' />{itm.price}</h4>
                             </div>     
                             
                           </div>
                     </div>
                    ))
               }
             </div>

          </div>
          </>
          }    
         </div>
           {
              address1 && 
              <div className='absolute top-[50%] left-[50%] z-10' style={{transform:'translate(-50%,-50%)'}}>
                  <div>
                     <div  className='w-[20rem] sm:w-[30rem] min-h-[25rem]  m-auto bg-white shadow-lg p-5 dark:bg-slate-950 dark:text-white'>
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
                                    <input className='form-input text-black' name='email' value={values.email || User?.email}  onChange={handleChange}/> 
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
                                    <button className='bg-gray-400 text-lg font-thin rounded-md p-1 px-2 text-white' onClick={()=>setAddress1(false)}>Cancel</button>
                                 </div>
                             </form>
                             <div className='sm:w-[30rem]'>
                            
                              {
                                  Addr?.data?.map((itm , index)=>(
                                    <div className='w-[10rem] border flex items-start relative  gap-1 p-1 m-1' key={index}>
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
                              <button className='bg-red-500 rounded-md text-white p-1 text-end' onClick={()=>{setAddress1(false); setPayment1(true)}} disabled={ Addr.data.length ? false :true}>{Addr.data.length ? "PayMentMethod": "Required Address please Enter"}</button>
       
                          </div>
                     </div>
                  </div>
             </div>
           }


           {
              payment1 && 
              <div className='absolute top-[50%] left-[50%] z-10' style={{transform:'translate(-50%,-50%)'}}>
                  <div> 
                  
                     <div className='w-[20rem] sm:w-[30rem] m-auto bg-white shadow-lg p-5 flex flex-col gap-2 relative dark:bg-slate-950 dark:text-white'>
                         <h4 className='text-xl font-sans'>Choose Payment Mode</h4>
                         <div className='p-1 text-md font-thin border rounded-md'>
                           <h5>Cash Payment</h5>
                           <div>
                              <input  type='radio' name='payment'  onClick={()=>setPayMode1("cash")}/>
                              <label>CashOn delivery</label>
                           </div>
                         </div>
                         <div className='p-1 text-md font-thin border rounded-md'>
                           <h5>OnlinePayment</h5>
                           <div>
                              <input  type='radio'  name='payment' onClick={()=>setPayMode1("online")}/>
                              <label>RazorPay</label>
                           </div>
                         </div>
                         <div className='p-1 text-md font-thin border rounded-md'>
                           <h4>Product Detail</h4>
                           <h4>Productname:{data?.data?.title}</h4>
                           <h4>quanity:{quantity}</h4>
                           <h4>TotalAmount:{data?.data?.price * quantity}</h4>  
                         
                         </div>
                     
                         <button className='bg-red-500 text-white p-1 px-2' onClick={placeOrderHandler}>PlaceOrder</button>
                      <button className='absolute right-5' onClick={()=>setPayment1(false)}><RxCross2  className='text-2xl'/></button>
                      {
                orderload && 
               <div className='absolute   top-28 w-full flex justify-center z-20 dark:text-white'>  
               <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                 <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                 <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
               <span className='font-mono text-xl '>Loding...</span>
               </div>
            }
            
            
            
            {
                load && 
               <div className='absolute   top-28 w-full flex justify-center z-20 dark:text-white'>  
               <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                 <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                 <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
               <span className='font-mono text-xl '>Loding...</span>
               </div>
            }
                     
                     </div>
                  </div>
               </div>
           }
         <ToastContainer />
    </div>
  )
}

export default SingleProduct