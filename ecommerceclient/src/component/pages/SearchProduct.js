import React, { useEffect } from 'react'
import { useParams, NavLink} from 'react-router-dom'
import { BiRupee } from 'react-icons/bi'
import { AiFillStar } from 'react-icons/ai'
import { useGetFilterTitleMutation } from '../../features/products/productApi'
import { toast } from 'react-toastify'

const SearchProduct = () => {

    const param = useParams()
    const [filterNames , { data }] = useGetFilterTitleMutation()

    const gettingData = async()=>{
         try{
             const result = await filterNames(param.search).unwrap()
             if(result){
                
             }
         }
         catch(err){
            toast.error(err.message)
         }
    }
  
    useEffect(()=>{
      gettingData()
    },[param.search])

  return (
    <div>
        <div className='max-w-[96rem] m-auto relative top-14 mobile p-4 dark:bg-slate-950'> 
        <div className=' flex  flex-wrap  gap-5'>                
               {
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
                        </div>
                  </div>
                 ))
               }
             </div>
        </div>
    </div>
  )
}

export default SearchProduct