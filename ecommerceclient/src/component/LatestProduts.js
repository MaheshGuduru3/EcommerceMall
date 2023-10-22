import React, { useEffect } from 'react'
import {MdFavoriteBorder , MdOutlineFavorite} from 'react-icons/md'
import { AiFillStar , AiOutlineRight , AiOutlineLeft } from 'react-icons/ai'
import { BiRupee} from 'react-icons/bi'
import { useSelector } from 'react-redux'
import { toast , ToastContainer} from 'react-toastify'
import { NavLink, useNavigate } from 'react-router-dom'
import { useGetCartlistQuery, useGetDeleteWishlistMutation, useGetLatestProdsQuery, useGetWishListQuery, useGetaddCartlistMutation, useGetdeleteCartlistMutation, useGetmakeWishListMutation ,} from '../features/products/productApi'


const LatestProduts = () => {
  
const navigate = useNavigate()

const slide = document.querySelector('.slide-img')

const rightScrollHandler = ()=>{
   slide.scrollLeft = slide.scrollLeft + slide.clientWidth  
}
const leftScrollHandler = ()=>{
   slide.scrollLeft = slide.scrollLeft - slide.clientWidth
} 

  const { User } = useSelector(state=>state.userslice)
  // All latest prods getting data api 
  const { data , isLoading} = useGetLatestProdsQuery()
  
  // All the send and delete wishlist prods api
  const { data:data1}  = useGetWishListQuery(User.email)
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
   if(User.email){
   
   }
},[User.email])

return (
   <div className='w-full'>
    <div className='max-w-[96rem] m-auto  dark:bg-slate-950'>
      <div className='p-7 relative'>
        <h4 className='text-xl sm:text-3xl mb-5 font-thin dark:text-white dark:bg-slate-950'>Latest Products</h4>
          <div className='sm:min-h-[15rem] m-auto overflow-hidden  slide-img scroll-smooth flex'>
             
             
             
             {
                isLoading &&
                <div className='w-full flex justify-center dark:text-white'>
                        <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className='font-mono text-xl'>Loding...</span>
                </div>
             }    
             
                
             
             <div className='flex gap-5'> 
              {
                 data?.data?.map((itm , index)=>(   
                   
                  <div className='w-[20rem] sm:w-[15rem] min-h-44 sm:min-h-60 shadow-md p-2 border flex  sm:flex-col gap-2 dark:bg-slate-900 dark:text-white dark:border-slate-500' key={index}>
                        <NavLink to={`/singleproduct/${itm._id}`}>
                          <img  src={itm?.thumbnail} alt='thumbnail' className="w-[10rem] sm:w-full h-32"/>
                        </NavLink>
                        <div className='w-[10rem] sm:w-auto'>
                          <h4 className='text-lg font-mono truncate'>{itm.title}</h4>
                          <h4 className='text-md font-extralight flex items-center bg-green-400 w-14 px-2 py-0.5 rounded-md'>{itm.rating} <span><AiFillStar className=' text-amber-500'/></span></h4>
                          <div className='flex justify-between p-0.5'>
                          <h4 className={itm.stock > 0 ? "text-green-500 font-mono text-lg" : ""}>{itm.stock > 0 ? "InStock" : "NoStock"}</h4>
                          <h4 className='text-md font-semibold'><BiRupee className='inline-block' />{itm.price}</h4>
                          </div>     
                          <div className='flex justify-between items-center p-2'> 
                          <button className='text-white font-serif'>
                            {
                                data2?.data?.find((val)=> (val.title === itm.title && val.email ===  User.email)) ?
                                 <button className='bg-red-500 p-1.5 rounded-md animate-pulse' onClick={()=>deleteCartHandler(itm.title)}>Remove Cart</button>
                                 :
                                 <button className='bg-blue-500 p-1.5 rounded-md' onClick={()=>{ if(User.length === undefined  && User) {addCartHandler(itm)} else{ navigate('/login')}}}>Add to Cart</button>
                            }
                          </button>
                          <button className='text-2xl'>
                                {
                                 data1?.data?.find((val)=> (val.title === itm.title && val.email ===  User.email)) ?
                                  <MdOutlineFavorite className='text-red-500  animate-bounce' onClick={()=>deleteWishHandler(itm.title)} />    
                                   :
                                  <MdFavoriteBorder className='text-blue-500' onClick={()=>{ if(User.length === undefined  && User) {makeWishlistHandler(itm)} else{ navigate('/login')}}} />
                               } 
                            </button>
                         </div>
                        </div>
                  </div>
                 ))
               }
             </div>
             <div className={isLoading ? "hidden" : 'w-[92%] sm:w-[95%] absolute  top-36 sm:top-44 flex  justify-between '}>
               <button className='text-xl sm:text-[2.5rem] bg-blue-200 rounded-sm' onClick={leftScrollHandler}><AiOutlineLeft /></button>
               <button className='text-xl sm:text-[2.5rem] bg-blue-200 rounded-sm' onClick={rightScrollHandler}><AiOutlineRight /></button>
             </div>
          </div>
      </div>
      <ToastContainer />
    </div>
    </div>
  )
}

export default LatestProduts