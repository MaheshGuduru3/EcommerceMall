import React from 'react'
import { NavLink} from 'react-router-dom'
import { AiOutlineArrowRight } from 'react-icons/ai'
import { useGetCategorySchemaNamesQuery } from '../features/products/productApi'


const Categories = () => {

   const { data  , isLoading} = useGetCategorySchemaNamesQuery()
  return (
    <div>
       <div className='p-7'>
       <div className='w-[90rem] flex justify-between'>
          <h4 className='text-3xl mb-5 font-thin dark:text-white'>Categories</h4>
          <NavLink className='px-10 text-xl font-serif hover:text-blue-400' to='/products' >Allproducts<AiOutlineArrowRight className='inline-block mx-1'/></NavLink>
       </div>
       <div className='w-[90rem] m-auto'> 
             <div className='h-[15rem] shadow-xl overflow-scroll flex'>
                 <div className='flex p-2'>
                   {
                          isLoading  &&
                      
                          <div className='w-[90rem] flex justify-center dark:text-white'>
                            <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className='font-mono text-xl'>Loding...</span>
                        </div>
                   }
                    {
                         data?.data.map((itm , index)=>(
                             <NavLink to={`/category/${itm.category}`} key={index} className='w-[12rem] flex flex-col items-center gap-1'>
                              <img src={itm.thumbnails}  className=' w-44  h-44 rounded-full' />
                              <h6 className='text-lg font-mono'>{itm.category}</h6>
                             </NavLink>
                         ))
                    }
                 </div>   
             </div>
        </div>
       </div>
    </div>
  )
}

export default Categories