import React from 'react'
import { useParams } from 'react-router-dom'
import { BiRupee } from 'react-icons/bi'
import { useGetUserOrdersQuery } from '../../features/products/productApi'

const YourOrder = () => {

  const param = useParams()

  const { data , isLoading} = useGetUserOrdersQuery(param.email)
  
   console.log(isLoading)  
  
  return (
    <div className='max-w-[96rem] m-auto relative top-14 p-2 mobile dark:bg-slate-950'>
    
             {
                
                data?.data?.length > 0 ?
                <div className='flex gap-10 '>
                <div className='w-full flex flex-col  items-center gap-5'> 
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
                            
                {
                  data?.data?.map((itm , index)=>(
 
                   <div className='w-full md:w-[50rem] min-h-48 shadow-md p-2 border  flex  gap-2 flex-col  md:flex-row md:items-center md:justify-evenly dark:bg-slate-900 dark:text-white dark:border-slate-500' key={index}>
                         <div>
                           <h4 className='p-2 text-md font-light'>Date Of Order  : {(itm.createdAt)}</h4>
                           <img  src={itm?.products[0]?.thumbnail} alt='thumbnail' className='w-full  md:w-[15rem] h-44'/>
                         </div>
                         <div className='w-full md:w-[20rem]'>
                           <h4 className='text-lg font-mono truncate'>{itm?.products[0]?.title}</h4>
                           <h4 className='text-md font-extralight'>quantity:{itm.quantity}</h4>
                           <div className='flex flex-col justify-between sm:flex-row p-0.5'>
                           <h4 className={itm.ispaid ? "text-green-500 font-mono text-lg" : ""}>{itm.ispaid ? "Paid" : "not paid"}</h4>
                           <h4 className='text-md font-semibold'>Price: <BiRupee className=' inline-block' />{itm.amount}</h4>
                           <h4 className='text-md font-semibold'>TotalAmount: <BiRupee className=' inline-block' />{itm.tamount}</h4>

                           </div>
                         </div>
                           <div className='flex justify-between items-center p-2'> 
                           <button className={'bg-green-500 text-white font-serif p-1.5 rounded-md'}>status : {itm.status}</button>
                          </div>
                   </div>
 
 
                  ))
               }
               </div>
              </div>
              :
              <div>
               
              <h1 className='text-xl font-bold text-center dark:text-white'>Empty Orders</h1>
             
             </div>
          }
    </div> 
  )
}

export default YourOrder