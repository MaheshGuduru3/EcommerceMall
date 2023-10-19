import React from 'react'
import {  useNavigate, useParams } from 'react-router-dom'
import { MdOutlineFavorite } from 'react-icons/md'
import { toast , ToastContainer } from 'react-toastify'
import { useSelector } from 'react-redux'
import { useGetCartlistQuery, useGetDeleteWishlistMutation, useGetWishListQuery, useGetaddCartlistMutation, useGetdeleteCartlistMutation } from '../../features/products/productApi'

const WishList = () => {
   const param = useParams()
   const { data } = useGetWishListQuery(param.email) 
   const navigate = useNavigate()
   
   const { User } = useSelector(state=>state.userslice)

   const [deleteWish1] = useGetDeleteWishlistMutation()
   const deleteWishHandler1 = async (title)=>{
    
     try{
       const result = await deleteWish1(title).unwrap()
       if(result){
          toast.error(result.message)
       }
     }
     catch(err){
        toast.error(err)
     }
   }

   const {data:data2} = useGetCartlistQuery(User.email)
   const [addCart]  = useGetaddCartlistMutation()
   const [deleteCart] = useGetdeleteCartlistMutation()



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

 return (
    <div className=''>
        <div className='w-[96rem] m-auto relative top-14 p-2 dark:bg-slate-950'>
            
             {
                
                data?.data?.length > 0 ?
                <div className='w-[96rem] m-auto  flex  flex-wrap  gap-5'>                
                {
                  data?.data?.map((itm , index)=>(
 
                   <div className='w-[15rem] min-h-60 shadow-md p-2 border  flex flex-col gap-2 dark:bg-slate-900 dark:text-white dark:border-slate-500' key={index}>
                         <div>
                           <img  src={itm.thumbnail} alt='thumbnail' className='w-full h-32'/>
                         </div>
                         <div className=''>
                           <h4 className='text-lg font-mono truncate'>{itm.title}</h4>
                           <h4 className='text-md font-extralight'>Rating:{itm.rating}</h4>
                           <div className='flex justify-between p-0.5'>
                           <h4 className={itm.stock > 0 ? "text-green-500 font-mono text-lg" : ""}>{itm.stock > 0 ? "InStock" : "NoStock"}</h4>
                           <h4 className='text-md font-semibold'>Price:${itm.price}</h4>
                           </div>
                           <div className='flex justify-between items-center p-2'> 
                           <button className='text-white font-serif'>
                            {
                                data2?.data?.find((val)=> (val.title === itm.title && val.email ===  User.email)) ?
                                 <button className='bg-red-500 p-1.5 rounded-md animate-pulse' onClick={()=>deleteCartHandler(itm.title)}>Remove Cart</button>
                                 :
                                 <button className='bg-blue-500 p-1.5 rounded-md' onClick={()=>{ if(User.length === undefined  && User) {addCartHandler(itm)} else{ navigate('/login')}}}>Add to Cart</button>
                            }
                          </button>                           <button className='text-2xl' onClick={()=>{deleteWishHandler1(itm.title)}}>
                              {
                                  itm.isWishlist && <MdOutlineFavorite className='text-red-500' />
                              }
                            </button>
                          </div>
                         </div>
                   </div>
 
 
                  ))
                }
              </div>
                 :
               
                 <div>
               
                 <h1 className='text-xl font-bold text-center dark:text-white'>Empty WishList</h1>
                
                </div>




             }

             

            
          </div>
          <ToastContainer />
    </div>
  )
}

export default WishList