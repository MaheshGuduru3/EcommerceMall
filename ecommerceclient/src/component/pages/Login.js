import React from 'react'
import { FcGoogle } from 'react-icons/fc'
import { NavLink  , useNavigate} from 'react-router-dom'
import { useFormik } from 'formik'
import { validationSignIn } from '../../formValidateSchema/forms'
import { useDispatch } from 'react-redux'
import {  setGoogle, setToken } from '../../features/userInfo/UserSlice'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { app } from '../../firebase/config/firebase.config'
import { toast  , ToastContainer} from 'react-toastify'
import { useGetSignInUserMutation } from '../../features/userInfo/userApi'

const Login = () => {
   const navigate = useNavigate() 
   const dispatch = useDispatch()    
   const [userSignIn , { isLoading}] = useGetSignInUserMutation()  
   
   
    

    const  { values , errors , handleChange , handleSubmit} = useFormik({
       initialValues:{
          email:"",
          password:""
         },
         validationSchema:validationSignIn,
         onSubmit: async (data1)=>{
            try{
               dispatch(setGoogle(false))
               const res = await userSignIn(data1).unwrap()
             
               dispatch(setToken(res.token)) 
               navigate('/')
          
            }
            catch(err){
   
               if(err.status === 404){
                   return toast.error(err.data.message)
               }

               if(err.status === "FETCH_ERROR"){
                  return toast.error("server not found")
               }
            }
           
         }
      })



  const loginGoogle = async ()=>{
      dispatch(setGoogle(true))
       const  firebaseAuth = getAuth(app)
       const googleProvide =  new GoogleAuthProvider()
       try{
         const resultGoogleLogin = await signInWithPopup(firebaseAuth , googleProvide) 
         dispatch(setToken(resultGoogleLogin.user.accessToken))
         navigate('/')
       }
       catch(err){
         return  toast.error("Please check your internet connection")
       }

  }
   
  return (
    <div className='w-[100%]'>
       <div className='max-w-[96rem] m-auto flex justify-center items-center min-h-[100vh] xs:bg-black dark:bg-slate-800'>
            <div className='w-[85%] sm:w-[27rem] shadow-lg p-7 rounded-lg dark:bg-slate-900 dark:text-white'>
                 <h4 className='text-2xl  font-semibold text-center'>MyZoneMall</h4>
                 <div className='min-h-[15rem] flex flex-col justify-center items-center gap-2'>
                    <h6 className='text-lg p-2'>Login</h6>
                    <form className='flex flex-col gap-2 sm:w-96 w-[100%]'  onSubmit={handleSubmit}>
                        <input className='form-input  rounded-md dark:text-black' type='email'  placeholder='Email Address'  name='email'  value={values.name}    onChange={handleChange} />
                        {errors.email && <span className='text-red-500'>{errors.email}</span>}
                        <input className='form-input  rounded-md dark:text-black' type='password' placeholder='Password' name='password'  value={values.name} onChange={handleChange} />
                        {errors.password && <span className='text-red-500'>{errors.password}</span>}
                        <button className='form-input text-md text-white font-medium bg-blue-700' type='submit'>
                        { isLoading ?
                         <span className='flex justify-center'>
                            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                               <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                               <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                             </svg>
                             <span>Processing...</span>
                           </span> :
                           "Login"}

                        </button>
                        <NavLink to='/forgetpassword' className='text-md font-thin p-1 text-blue-700 text-center'>Forget Password?</NavLink>
                    </form>
                    <h6 className='text-md font-bold'>or</h6>
                 </div>

                 <div className='border text-center'>
                    <button className='w-[100%] sm:w-96 h-[3rem] flex items-center justify-center' onClick={loginGoogle}>
                        <span className='text-2xl'><FcGoogle/></span>
                        <span className='text-xl'>Login With Google</span> 
                    </button>
                 </div>
                
                 <h4 className='text-center mt-2'>Don't have an account?<NavLink to='/register' className='text-blue-500'>Register</NavLink></h4>
            </div>
       </div>
       <ToastContainer />
    </div>
  )
}

export default Login