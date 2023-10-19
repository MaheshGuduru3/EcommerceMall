import { useFormik } from 'formik'
import React from 'react'
import {  useParams } from 'react-router-dom'
import { toast  , ToastContainer} from 'react-toastify'
import { validationResetPassword } from '../../formValidateSchema/forms'
import { useAddResetPasswordMutation } from '../../features/userInfo/userApi'

const initial = {
     password : '',
     repassword : ''
}

const NewPassword = () => {
   
     const param = useParams()
     const token = param.token
     const [reset] = useAddResetPasswordMutation()  

     const  { values  ,  handleChange , handleSubmit , errors} = useFormik({
          initialValues : initial,
          validationSchema : validationResetPassword,
          onSubmit : async (data)=>{
               try{
                     const result = await reset({token , data}).unwrap()
                     if(result)
                     {
                        if(result.status){
                          toast.success(result.message)
                        }
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
     })
     
 
 
  return (
    <div className='w-[96rem] m-auto  dark:bg-slate-950 dark:text-white'>
    <div className='w-[90rem]  m-auto'>
         <div className='w-[30rem]  shadow-lg m-auto p-7'>
             <div className='text-center'>
                 <h4  className='font-bold text-lg'>MyZoneMall</h4>
                 <h3  className=' font-extralight'>create new Password</h3>
             </div>   
            <form className='flex flex-col gap-3 sm:w-44 w-[100%] p-1 mt-2' onSubmit={handleSubmit}>  
                   <input  type='password' className='form-input w-96 dark:text-black ' placeholder='Enter New Password' onChange={handleChange} name='password' value={values.password} /> 
                   {errors.password && <span className='text-red-500'>{errors.password}</span>}
                   <input  type='password' className='form-input w-96 dark:text-black' placeholder='ReEnter New Password' onChange={handleChange} name='repassword' value={values.repassword} />
                   {errors.repassword && <span className='text-red-500'>{errors.repassword}</span>}
                   <button className='form-input bg-green-500 text-white font-mono border-0'> Submit </button>      
            </form>
         </div>
    </div>
    <ToastContainer />
 </div>
  )
}

export default NewPassword