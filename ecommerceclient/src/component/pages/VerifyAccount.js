import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useGetVerifyMailMutation } from '../../features/userInfo/userApi'
import { ToastContainer, toast } from 'react-toastify'

const VerifyAccount = () => {
     const param = useParams()
    const token = param.token
      
    const [mailS] = useGetVerifyMailMutation()
    
    const mailHandler = async ()=>{
                try{
                    const result = await mailS(token).unwrap()
                    
                    if(result.message === "verified Success"){
                        toast.success(result.message)
                    }
                    
                }
                catch(err){
                  console.log(err)   
                  if(err.status === 'FETCH_ERROR'){
                    toast.error("Server side Error")
                  }
                  if(err.status === 404){
                    toast.error(err?.data?.message)
                  }  
                  if(err.status === 500){
                      toast.error(err.data.message) 
                  }  
                }
    }

    useEffect(()=>{

    },[mailHandler])
  return (
    <div className='m-auto w-[96rem] relative top-14 h-screen dark:bg-slate-800'>
          <div className='w-[30rem]  p-10 m-auto shadow-lg bg-white dark:bg-slate-900 dark:text-white'>       
               <div className='text-center font-mono mb-2'>
                <h4  className='font-bold'>MyZoneMall</h4>
                <h3  className=''>Verify Account</h3>
                
                <button className=' bg-green-500  p-3.5 mt-2 text-white font-mono border-0' onClick={mailHandler}>Verify Email</button>
               </div>
           
             
          </div> 
          <ToastContainer />    
    </div>
  )
}

export default VerifyAccount