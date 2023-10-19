import React, { useEffect, useState } from 'react'
import { MdFavoriteBorder,MdOutlineFavorite } from 'react-icons/md'
import { AiFillStar } from 'react-icons/ai'
import { toast } from 'react-toastify'
import { NavLink } from 'react-router-dom' 
import { useSelector } from 'react-redux'
import { useGetAllProductsQuery, useGetCartlistQuery, useGetDeleteWishlistMutation, useGetWishListQuery, useGetaddCartlistMutation, useGetdeleteCartlistMutation, useGetmakeWishListMutation } from '../../features/products/productApi'

const Products = () => {
    const [page , setPage] = useState(1)
    const [pageNumber, setPageNumber] = useState(0)

    
    const { User } = useSelector(state=>state.userslice)

  
    const { data , isLoading} = useGetAllProductsQuery()
 
    
    const { data:data1} = useGetWishListQuery(User.email)
    const { data:data2} = useGetCartlistQuery(User.email)


    const [productsWish]  = useGetmakeWishListMutation()
    const [productsCart]  = useGetaddCartlistMutation()

    const [deleteProductWish] = useGetDeleteWishlistMutation()
    const [deleteProductCart] = useGetdeleteCartlistMutation()
     

         

   const  productAllAddCartHandler = async(itm)=>{   
        const { title , description , price , rating , stock , category , thumbnail , images  }  = itm     
        const sendCartServer = {
        email : User.email,
        title,
        description,
        price, 
        rating,
        stock,
        category,
        thumbnail,
        images
     } 

       
    try{
        const result = await productsCart(sendCartServer).unwrap()
        if(result){
            toast.success(result.message)
        }
    }
    catch(err){
         toast.error(err)
    }
 }
   
   const productAllAddWishHandler = async(itm)=>{

    const { title , description , price , rating , stock , category , thumbnail , images  }  = itm     
    const sendWishServer = {
      email : User.email,
      title,
      description,
      price,
      rating,
      stock,
      category,
      thumbnail,
      images
   }     
  

    try{
        const result = await productsWish(sendWishServer).unwrap()
        if(result){
            toast.success(result.message)
        }
    }
    catch(err){
         toast.error(err)
    }

}


const prodDeleteCartHandler = async (title)=>{
       
   try{
       const result = await deleteProductCart(title).unwrap()
       if(result){
         toast.success(result.message)
       }
   }
   catch(err){
     toast.error(err)
   }

}

const prodDeleteWishHandler = async (title)=>{
    try{
        const result = await deleteProductWish(title).unwrap()
        if(result){
          toast.success(result.message)
        }
    }
    catch(err){
      toast.error(err)
    }
}  




useEffect(()=>{
  if(data?.data?.length > 0){   
    setPageNumber(Math.ceil(data?.data?.length/15))     
  }
},[data?.data])
return (
    <div className='w-[100%] relative top-14'>
        <div className='max-w-[96rem] m-auto'>
            <div className=''>
                 
                  <div className='w-[90rem]  m-auto'>
                      <h4 className='text-3xl font-semibold'>products</h4>
                      <div className='flex flex-wrap justify-center  p-2 gap-5'>                
                      {
                        isLoading &&
                        <div className='w-[90rem] flex justify-center'>
                                <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span className='font-mono text-xl'>Loding...</span>
                        </div>
                      }
                     {
                        data?.data?.slice(((page-1)*15),((page)*15)).map((itm , index)=>(

                        <div className='w-[15rem] min-h-60 bg-white p-2 border  flex flex-col gap-2 dark:bg-slate-900 dark:text-white dark:border-slate-500' key={index}>
                                <NavLink to={`/singleproduct/${itm._id}`}> 
                                <img  src={itm.thumbnail} alt='thumbnail' className={"w-full h-32"}/>
                                </NavLink>
                                <div className=''>
                                <h4 className='text-lg font-mono truncate'>{itm.title}</h4>
                                <h4 className='text-md font-extralight flex items-center bg-green-400 w-14 px-2 py-0.5 rounded-md'>{itm.rating} <span><AiFillStar className=' text-amber-500'/></span></h4>
                                <div className='flex justify-between p-0.5'>
                                <h4 className={itm.stock > 0 ? "text-green-500 font-mono text-lg" : ""}>{itm.stock > 0 ? "InStock" : "NoStock"}</h4>
                                <h4 className='text-md font-semibold'>Price:${itm.price}</h4>
                                </div>     
                                <div className='flex justify-between items-center p-2'> 
                                <button className='text-white font-serif'>
                                    {
                                        data2?.data?.find((val)=> (val.title === itm.title && val.email === User.email)) ?
                                        <button className='bg-red-500 p-1.5 rounded-md animate-pulse' onClick={()=>prodDeleteCartHandler(itm.title)}>Remove Cart</button>
                                        :
                                        <button className='bg-blue-500 p-1.5 rounded-md' onClick={()=>productAllAddCartHandler(itm)}>Add to Cart</button>
                                    }
                                </button>
                                <button className='text-2xl'>
                                      
                                    {
                                       data1?.data?.find((val)=> (val.title === itm.title && val.email === User.email)) ?

                                      <MdOutlineFavorite className='text-red-500  animate-bounce' onClick={()=>prodDeleteWishHandler(itm.title)} />    
                                       :
                                        <MdFavoriteBorder className='text-blue-500' onClick={()=>productAllAddWishHandler(itm)} />
                                    }
                                </button>
                            </div>
                        </div>
                    </div> 
                        ))
                    }
                    </div>

                    <div className='text-center mt-4'>
                        <button className='border p-1 px-2' onClick={()=> page === 1 ? setPage(1) : setPage(page-1)}>Prev</button>  
                         {
                            [...Array(pageNumber)].map((it,index)=>(
                                <button className={page === index+1 ? 'border py-1 px-3 text-md text-white font-bold mx-0.5 bg-red-400': 'border py-1 px-3 text-md text-white font-bold mx-0.5 bg-blue-400'} onClick={()=>{setPage(index+1)}}>{index+1}</button>     
                            )) 
                         }
                        <button className='border p-1 px-2' onClick={()=> page >= pageNumber  ? setPage(1) : setPage(page+1)}>Next</button>
                    </div>       
                  </div>
            </div>
        </div>
    </div>  
  )
}

export default Products