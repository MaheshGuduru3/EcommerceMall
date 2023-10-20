import React, { useEffect } from 'react'
import log from '../../assests/animation_lkwflcqg_small.gif' 
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useGetcartlistDeleteAfterOrderMutation } from '../../features/products/productApi'


const Success = () => {

  const { User } = useSelector(state=>state.userslice)
  

  const [orderedAfter] = useGetcartlistDeleteAfterOrderMutation()    

  useEffect(()=>{

       const  after = async()=>{
              const email = User.email
             try{
              const result = await orderedAfter(email).unwrap()
              if(result){
                // success case
              }
             }
             catch(err){
                // failure case
             }
       }
       after()
  },[])
      

    return (
    <div className='max-w-[96rem] m-auto relative top-14 mobile dark:bg-slate-950 p-4 dark:text-white'>
      <div className='flex flex-col items-center gap-2'>
        <img  src={log}  alt='successlog' className=' w-[30rem] h-[20rem]' /> 
        <h2 className='text-2xl font-bold'>Thank You</h2>
        <h3 className='text-lg font-extralight'>Your order has been placed Successfully 🎉</h3>
        <div className='sm:flex-row flex flex-col gap-2'>
          <NavLink className='bg-blue-500 font-mono text-md p-2 rounded-md mr-2 text-white' to='/'> Continue Your Shopping</NavLink>    
          <NavLink className='bg-blue-500 font-mono text-md p-2 rounded-md mr-2 text-white' to={`/orderitems/${User.email}`}>View Your Orders</NavLink>
        </div>
      </div>
    </div>
  )
}

export default Success