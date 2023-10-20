import React from 'react'
import { FcGoogle } from 'react-icons/fc'
import { NavLink, useNavigate } from 'react-router-dom'
import { useFormik  } from 'formik'
import {  validationSignUp } from "../../formValidateSchema/forms"
import { useCreateUserMutation, useGoogleSignUpMutation } from '../../features/userInfo/userApi'
import {  ToastContainer , toast} from 'react-toastify'
import { getAuth , GoogleAuthProvider , signInWithPopup} from 'firebase/auth'
import { app } from '../../firebase/config/firebase.config'
import { useDispatch } from 'react-redux'
import { setToken } from '../../features/userInfo/UserSlice'

const initialdata = {
   username:"",
   email:"",
   password:"",
   reenterPassword:""
}
// codium => testing purpose extension
const Register = () => {
    const  dispatch = useDispatch()
    const [signUp , {isLoading}] = useCreateUserMutation()
    const [googleSignReg ] = useGoogleSignUpMutation()
    const navigate = useNavigate()

    const {  values , errors , handleChange , handleSubmit} = useFormik({
        initialValues:initialdata,
        validationSchema:validationSignUp,
        onSubmit: async (data)=>{
            try{
                const res = await signUp(data).unwrap()
                console.log(res)
                if(res.status === true){
                   toast.success(res.mail)
                   navigate('/login')
                }
            }
            catch(err){
               if(err.status === 403 ){
                  toast.error(err.data.message)
               }
               else{
                  toast.error("server not Found")
               }
            }
        }
    })
   
    const firebaseAuth = getAuth(app)
    const provider = new GoogleAuthProvider()
    const  registerWithGoogle = async ()=>{
         try{
            const data1 =  await signInWithPopup(firebaseAuth , provider)
            dispatch(setToken(data1.user.accessToken))
            try{
                  const getSignUpData = await googleSignReg().unwrap()
                  if(getSignUpData){
                     toast.success(getSignUpData.message)
                     navigate('/login')
                  }
               }
               catch(err){
                   if(err.status === "FETCH_ERROR"){
                    return  toast.error("server Not Found..")
                   }
                   if(err.status === 403){
                    return  toast.error(err.data.message)
                   }
               }
         }
         catch(error){
            return  toast.error("Please check your internet connection")
         }
         
    }
   
  return (
    <div className='w-[100%]'>  
       <div className='max-w-[96rem] m-auto flex justify-center items-center min-h-[100vh] dark:bg-slate-800'>
            <div className='w-[100%] sm:w-[27rem] shadow-lg p-7 rounded-lg dark:bg-slate-900 dark:text-white'>
                 <h4 className='text-2xl  font-semibold text-center'>MyZoneMall</h4>
                 <div className='min-h-[22rem] flex flex-col justify-center items-center gap-2'>
                    <h6 className='text-lg p-2'>Register</h6>
                    <form className='flex flex-col gap-2  sm:w-96 w-[100%] dark:text-black' onSubmit={handleSubmit}>
                        <input className='form-input   rounded-md' type='text' name='username'  value={values.name} placeholder='User Name' onChange={handleChange} />
                         { errors.username && <p className='text-red-600'>{errors.username}</p> }
                        <input className='form-input  rounded-md' type='email' name='email' value={values.name} placeholder='Email Address' onChange={handleChange} />
                        { errors.email && <p className='text-red-600'>{errors.email}</p> }
                        <input className='form-input  rounded-md' type='password'  name='password' value={values.name} placeholder='Password' onChange={handleChange} />
                        { errors.password && <p className='text-red-600'>{errors.password}</p> }
                        <input className='form-input  rounded-md' type='password' name='reenterPassword' value={values.name} placeholder='ReEnter Password' onChange={handleChange} />
                        { errors.reenterPassword && <p className='text-red-600'>{errors.reenterPassword}</p> }
                        <button className='form-input text-md text-white font-medium bg-blue-700' type='submit'>{ isLoading ?
                         <span className='flex justify-center'>
                            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                               <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                               <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                             </svg>
                             <span>Processing...</span>
                           </span> :
                           "Register"}
                        </button>
                    </form>
                    <h6 className='text-md font-bold'>or</h6>
                 </div>

                 <div className='border text-center'>
                    <button className='w-[100%] sm:w-96 h-[3rem] flex items-center justify-center' onClick={registerWithGoogle}>
                        <span className='text-2xl'><FcGoogle/></span>
                        <span className='text-xl'>Login With Google</span> 
                    </button>
                 </div>

                 <h4 className='text-center mt-2'>Already have an account?<NavLink to='/login' className='text-blue-500'>Login</NavLink></h4>
            </div>
       </div>
       <ToastContainer  />
    </div>
  )
}

export default Register