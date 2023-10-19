import React from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { BiRupee } from 'react-icons/bi'
import { AiFillStar } from 'react-icons/ai'
import { MdOutlineFavorite, MdOutlineFavoriteBorder } from 'react-icons/md'
import { useSelector } from 'react-redux'
import { toast , ToastContainer } from 'react-toastify'
import { useGetCartlistQuery, useGetDeleteWishlistMutation, useGetFilterCategoriesQuery, useGetWishListQuery, useGetaddCartlistMutation, useGetdeleteCartlistMutation, useGetmakeWishListMutation } from '../../features/products/productApi'

const FilterCategoriesName = () => {
   
    const param = useParams()
  

     const navigate = useNavigate()   

    const { data  , isLoading} = useGetFilterCategoriesQuery(param.id)
 
    
    const { User } = useSelector(state=>state.userslice)

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
 


  return (
    <div className='relative  top-14'>
        <div className='w-[96rem] m-auto p-5 dark:bg-slate-950'>
          <div className='w-[95rem] m-auto flex gap-5'>   
                {
                    
                    isLoading ?
                   
                      <div className='w-[95rem] flex justify-center dark:text-white'>
                        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className=''>Loding...</span>
                     </div>
                  
                    :


                    data?.data?.map((itm , index)=>(

                      <div className='w-[15rem] min-h-60 shadow-md p-2 border  flex flex-col gap-2 dark:bg-slate-900 dark:text-white dark:border-slate-500' key={index}>
                            <NavLink to={`/singleproduct/${itm._id}`}>
                              <img  src={itm.thumbnail} alt='thumbnail' className={"w-full h-32"}/>
                            </NavLink>
                            <div className=''>
                              <h4 className='text-lg font-mono truncate'>{itm.title}</h4>
                              <h4 className='text-md font-extralight flex items-center bg-green-400 w-14 px-2 py-0.5 rounded-md'>{itm.rating} <span><AiFillStar className=' text-amber-500'/></span></h4>
                              <div className='flex justify-between p-0.5'>
                              <h4 className={itm.stock > 0 ? "text-green-500 font-mono text-lg" : ""}>{itm.stock > 0 ? "InStock" : "NoStock"}</h4>
                              <h4 className='text-md font-semibold'><BiRupee className='inline-block' />{itm.price}</h4>
                              </div>     
                              <div className='flex justify-between items-center p-2'> 
                               <button className='text-white font-serif'>
                                {
                                    data2?.data?.find((val)=> (val.title === itm.title && val.email === itm.email)) ?
                                     <button className='bg-red-500 p-1.5 rounded-md animate-pulse' onClick={()=>deleteCartHandler(itm.title)}>Remove Cart</button> 
                                     :
                                     <button className='bg-blue-500 p-1.5 rounded-md' onClick={()=>{if(User.length === undefined  && User){ addCartHandler(itm) } else{ navigate('/login') }}}>Add to Cart</button>
                                }
                              </button>
                              <button className='text-2xl'>
                                    {
                                     data1?.data?.find((val)=> (val.title === itm.title && val.email === itm.email)) ?
                                      <MdOutlineFavorite className='text-red-500  animate-bounce' onClick={()=>deleteWishHandler(itm.title)} />    
                                       :
                                      <MdOutlineFavoriteBorder className='text-blue-500' onClick={()=>{ if(User.length === undefined  && User) {makeWishlistHandler(itm)} else{ navigate('/login')}}} />
                                   } 
                                </button> 
                             </div>
                            </div>
                      </div>
                     ))
                }
             </div>
        </div>
        <ToastContainer />
    </div>
  )
}

export default FilterCategoriesName