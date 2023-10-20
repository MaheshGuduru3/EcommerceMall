import React from 'react'
import { BiRupee } from 'react-icons/bi'
import { NavLink } from 'react-router-dom'
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai'
import { useGetOfferProductsQuery } from '../features/products/productApi'

const OfferProducts = () => {
    const { data , isLoading } = useGetOfferProductsQuery()
  
         
    const slide1 = document.querySelector('.slide-img1')

    const rightScrollHandler1 = ()=>{ 
       slide1.scrollLeft = slide1.scrollLeft + slide1.clientWidth  
    }
    const leftScrollHandler1 = ()=>{
       slide1.scrollLeft = slide1.scrollLeft - slide1.clientWidth
    }

    return (
    <div>    
       <div className='p-6 relative'>   
        <h4 className='max-w-[96rem] m-auto text-3xl mb-5 font-thin dark:text-white'>Offer Products</h4>
        <div className='min-h-[20rem] flex bg-slate-200 rounded-lg overflow-hidden scroll-smooth slide-img1 dark:bg-slate-800'>
             <div className='p-6'>
                <div className='flex gap-5'>                
                {
                         isLoading  &&
                      
                        <div className='flex justify-center dark:text-white'>
                          <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span className='font-mono text-xl'>Loding...</span>
                      </div>
                }
               {
                 data?.data?.map((itm , index)=>(

                  <NavLink  to={`/singleproduct/${itm._id}`} className='w-[15rem] min-h-60 shadow-md p-2 border  flex flex-col gap-2 dark:bg-slate-900 dark:text-white dark:border-slate-500' key={index}>
                        <div>
                          <img  src={itm.thumbnail} alt='thumbnail' className="w-full h-32"/>
                        </div>
                        <div className=''>
                          <h4 className='text-lg font-mono truncate'>{itm.title}</h4>
                          <h4 className='text-md font-extralight'>Rating:{itm.rating}</h4>
                          <div className='flex justify-between p-0.5'>
                          <h4 className={itm.stock > 0 ? "text-green-500 font-mono text-lg" : ""}>{itm.stock > 0 ? "InStock" : "NoStock"}</h4>
                          <h4 className='text-md font-semibold line-through'><BiRupee className='inline-block' />{Math.ceil(itm.price + 20)}</h4> 
                          </div>     
                          <div className='text-center p-2'> 
                          <h4 className='text-md font-semibold mb-2'><BiRupee className='inline-block' />{Math.ceil(itm.price)}</h4>
                          <button className='bg-blue-500 text-white font-serif p-1.5 px-4 rounded-md'>Buy</button>
                         </div>
                        </div>
                  </NavLink> 
                 ))
               }    
             </div>
             </div>
            <div className='w-[92%] md:w-[96%] absolute top-44 flex  justify-between '>
               <button className='text-[2.5rem] bg-blue-200 rounded-sm' onClick={leftScrollHandler1}><AiOutlineLeft /></button>
               <button className='text-[2.5rem] bg-blue-200 rounded-sm' onClick={rightScrollHandler1}><AiOutlineRight /></button>
             </div>
        </div>
       </div>
     </div>
  )
}

export default OfferProducts