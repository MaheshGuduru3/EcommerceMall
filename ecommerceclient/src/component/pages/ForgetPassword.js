import React, { useState } from 'react'
import { useGetforgetPasswordMutation } from '../../features/userInfo/userApi'
import { toast  , ToastContainer } from 'react-toastify'
import { NavLink } from 'react-router-dom'



const ForgetPassword = () => {

  const [forgotPass , setForgotPass] = useState('')
  const [forget] = useGetforgetPasswordMutation()

  const forgetPasswordHandler = async (e)=>{
         e.preventDefault()
         try{
           const result = await forget(forgotPass).unwrap()
           if(result){
             console.log(result)
             if(result?.status){
                toast.success(result?.mail)
             }
           }
         }
         catch(err){
           console.log(err , "forget opass")
             if(err.status === 'FETCH_ERROR'){
               toast.error("Server side Error")
             }
             if(err.status === 404){
                 toast.error(err?.data?.message)
             }
         }
  }

  return (
    <div className='max-w-[96rem] m-auto dark:bg-slate-800 mobile dark:text-white'>
       <div>
            <div className='sm:w-[30rem]  shadow-lg m-auto p-7'>
                <div className='text-center'>
                    <h4  className='font-bold text-lg'>MyZoneMall</h4>
                    <h3  className=' font-extralight'>Forget Password</h3>
                </div>   
               <form className='flex flex-col gap-3 sm:w-44 w-[100%] p-1 mt-2'>  
                      <input  type='email' className='form-input sm:w-96 dark:text-black' placeholder='Enter Email Address'  onChange={(e)=>setForgotPass(e.target.value)} /> 
                      <button className={ forgotPass ? 'form-input bg-green-500 text-white font-mono border-0' :'form-input bg-green-100 text-white font-mono border-0'} onClick={(e)=>forgetPasswordHandler(e)} disabled={forgotPass ? false : true}>  Submit </button>      
               </form>
              <NavLink to='/' className='text-center font-medium'>Back Home</NavLink> 
            </div>
       </div>
       <ToastContainer />
    </div>
  )
}

export default ForgetPassword