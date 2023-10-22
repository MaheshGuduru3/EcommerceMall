import React, { useEffect, useState } from 'react'
import { MdPersonAdd } from 'react-icons/md'
import { useSelector } from 'react-redux'
import {  ref , uploadBytes , getDownloadURL  }  from 'firebase/storage'
import { storage } from '../../firebase/config/firebase.config'
import { useGetUserUpdateProfileMutation, useGetVerifymailAfterMutation } from '../../features/userInfo/userApi'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

const Profile = () => { 
    const param = useParams()
    const id = param.id
    const { User }  = useSelector((state)=>state.userslice)
  
    const [profilePic  , setProfilePic] = useState("")
    
    const [updateName , setUpdateName] = useState('')
    const [UpdateNumber , setUpdateNumber] = useState('')
   
    const [updateinfo ,{isLoading}] = useGetUserUpdateProfileMutation()

    const [loading , setLoading] = useState(false)

    const UpdateImg = async (e)=>{
     
        if(e.target.files[0].name.split('.')[1] === 'png' || e.target.files[0].name.split('.')[1] === 'jpg'){
            setLoading(true)
          const fireref = ref(storage , `images/ ${ e.target.files[0].name +  new Date().getTime() }`)   
          await uploadBytes(fireref , e.target.files[0]).then((res)=>{
              getDownloadURL(fireref).then((url)=>{ 
                  setProfilePic(url)
                  setLoading(false)
              })
          })      
         
        }
        else{
          toast.warning("invalid input")
        }    
    
    }

    const updateHandlers = async(e)=>{
        e.preventDefault()
        const data = {
            profile: profilePic ? profilePic : User.profile,
            username: updateName ? updateName : User.username,
            phonenumber: UpdateNumber ? UpdateNumber : User.phonenumber
        }

       try{
        const result = await updateinfo({ id  , data}).unwrap()
        if(result){
           toast.success("Updated Profile success, refresh the page")
        }
       } 
       catch(err){
         toast.error(err)  
       }
    }  

    const [mailafter] = useGetVerifymailAfterMutation()

    const mailverifyHandler = async ()=>{
         try{
               const email = User?.email
               const result = await mailafter(email).unwrap() 
               if(result.status){
                   toast.success(result.mail)
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
         }
    }

  useEffect(()=>{
     
  },[profilePic])
 
   return (
    <div className='max-w-[96rem] m-auto relative top-14 p-4 mobile dark:bg-slate-950 dark:text-white'>
          <div className='shadow-md p-2 flex flex-col gap-2 items-center'> 
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
             
               <div>
                <h4>Update Your Profile</h4>
               </div>
               <div className='flex flex-col sm:items-center'>
                <button className='text-3xl sm:w-20 p-1'>
                    {
                        loading ? 
                       <div  className='w-full sm:w-20 flex'>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className='text-sm'>Wait...</span>
                       </div>
                      :
                        User.profile || profilePic ? <img  src={ profilePic ? profilePic : User.profile } alt='profile' className='w-22 h-16 rounded-full'/> :
                        <div><MdPersonAdd  className='text-slate-800'/>      
                        </div>     
                    }
                </button>     
                <button className='sm:w-20'> 
                  <input  type='file' accept='.png,.jpeg,.jpg' className='text-transparent text-xs outline-none'   onChange={(e)=>UpdateImg(e)} />
                </button>
               </div> 
               <div>
                
               {User.isVerfied ? ' ' : <><span className='mr-2 p-1'>Please Verify Your Email</span> <button className=' w-20 p-1 mt-1 text-white border bg-red-500' onClick={mailverifyHandler}>Verify</button></>}
                <form className='grid gap-3' onSubmit={updateHandlers}>
                   <div className='flex flex-col'>
                     <label>Email</label>
                     <input  type='email' className={User.isVerfied ? 'form-input h-8  w-full sm:w-[25rem] border-green-500 text-black' :'form-input h-8 w-full sm:w-[25rem] border-red-500 text-black'}  value={User?.email} readOnly/>     
                   </div>    
                   <div className='flex flex-col'>
                     <label>UserName</label>
                     <input  type='text' className='form-input h-8 text-black' value={ updateName ? updateName : User?.username} onChange={(e)=>setUpdateName(e.target.value)}/>
                   </div>
                   <div className='flex flex-col'>
                     <label>PhoneNumber</label>
                     <input  type='number' className='form-input h-8 appearance-none text-black' value={UpdateNumber? UpdateNumber : User?.phonenumber} pattern='/\b^[7-9]{1}[0-9]{9}\b/gm'  onChange={(e)=>setUpdateNumber(e.target.value)}/>
                   </div>
                   <button type='submit' className='border p-1 bg-green-400 rounded-md text-white font-mono'>Update</button>
                </form>
               </div>

          </div>
    </div>
  )
}

export default Profile