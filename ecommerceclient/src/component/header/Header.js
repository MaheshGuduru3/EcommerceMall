import React, { useCallback, useEffect, useState } from 'react'
import { NavLink , Outlet, useNavigate } from 'react-router-dom'
import { MdLocationPin ,MdFavoriteBorder } from 'react-icons/md'
import { GoSearch } from 'react-icons/go'
import { BsCartCheck , BsFillSunFill ,BsMoonFill , BsPersonCircle} from 'react-icons/bs'
import { BiUserPin , BiLogOut, BiCartAdd} from 'react-icons/bi'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { LogOut, setCerdentials, setThemeMode } from '../../features/userInfo/UserSlice'
import {  useGetVerifyUserMutation, useGoogleSignInMutation } from '../../features/userInfo/userApi'
import { useGetCartlistQuery, useGetFilterTitleMutation, useGetWishListQuery } from '../../features/products/productApi' 


const Header = () => {
  
  const dispatch = useDispatch()
  //useState for getting the pincode and store in these state.
  const [pincode , setPincode] = useState('')
  const [searching, setSearching ] = useState('')
  
  const navigate = useNavigate()
  
  const [filtername , { data:data1 }] = useGetFilterTitleMutation() 

  const {  User , theme  , token , google}  = useSelector(state=>state.userslice)
         
   
  const [verify] = useGetVerifyUserMutation()          

  //usestate for toggle the window to enter the pincode 
  const [togglePincode , setTogglePincode] = useState(false)
 
  //usestate for the toggle the window of the signin/up
  const [sign, setSign] = useState(false)

  //usestate for profile toggle 
  const [profileToggle , setProfileToggle] = useState(false)


  //
  const { data } = useGetCartlistQuery(User.email)  
  
  const { data:wish } = useGetWishListQuery(User.email)    


  const [googleSignIn ] = useGoogleSignInMutation()
   
  //handler function the getting the pincode and set the pincode state
  const handlerSubmitPincode = (e)=>{  
           e.preventDefault() 
           setPincode('')
  }

  //handle function filter pincode 
  const handlerFilterPincode = async()=>{
     try{
        const result = await axios( process.env.REACT_APP_LOCATION_PINCODE + pincode)
        if( result.data[0].Status === "Success"){ 
          window.localStorage.setItem("ecommerce_location" , JSON.stringify([result.data[0].PostOffice[0].Division , pincode]))
        }
        else{
          toast.error("Invalid Pincode")
        }
     }
     catch(err){   
       toast.error(err.message)
     }
    setTogglePincode(false)
   

  }

  const handlerSubmitTitle = (e)=>{
    e.preventDefault() 
    if(searching){
      navigate(`/searchedproduct/${searching}`)
      setSearching('')
    }
    else{
       toast.warning("please give the search data")
    }
    
}

 const handlerFilterTitle = async()=>{
      try{
        const resultNames = await filtername(searching).unwrap()
        if(resultNames){
           if(searching){
            navigate(`/searchedProduct/${searching}`)    
            setSearching('')
           }
           else{
            toast.warning("please give the search data")
           }
        }
      }
      catch(err){
        toast.error(err)
      }
   
 }

const filterTitleHandler = async (e)=>{
  setSearching(e.target.value)
  try{
     await filtername(searching).unwrap()
  }
  catch(err){
    toast.error(err)
  }
  
}




useEffect(()=>{
  const googlesignin = async()=>{
       
          try{
            const result = await googleSignIn().unwrap()
            if(result){
              dispatch(setCerdentials(result.data))
              toast.success("Logged In")
            }
  
        }
      catch(error){
        if(error.status === "FETCH_ERROR"){
          return toast.error("server not found")
        }
        if(error.data.message === 'Please register before login'){
          toast.error(error.data.message)
          navigate('/register') 
        }
        else{
          dispatch(setCerdentials([]))      
          toast.error("Session Expired, please login again.")
          navigate('/') 
        }
      }
  }   
  
       
  
    const res = async()=>{
           try{
              const result = await verify().unwrap()
              if(result){
                  toast.success(result.message)
                  dispatch(setCerdentials(result.data))  
              }
           }
           catch(err){
            dispatch(setCerdentials([]))      
            toast.error("Session Expired, please login again.")
            navigate('/')  
           }
   
    } 
  
 if(token){
    if(google){
       googlesignin()
    }
    else{
      res()
    }
 }
},[]) 

return (
    <div>
    <div className='w-full bg-blue-600  dark:bg-slate-900 fixed z-20'>
      <div className='h-[3.5rem] m-auto'>
          <div className='max-w-[96rem] m-auto md:bg-blue-600 flex items-center p-1 justify-evenly dark:bg-slate-900'>
              <div className='sm:w-[8rem] w-[5rem]'>
                <NavLink to='' className='text-white  sm:font-medium sm:text-[1.4rem] text-[0.85rem] font-bold'>MyZoneMall</NavLink>  
              </div>
              <div className='hidden md:block'>
                <button className=' text-white hover:border rounded-md min-w-[10rem] h-10' onClick={()=>setTogglePincode(!togglePincode)}>
                    <h6 className='text-xs font-light'> <span><MdLocationPin  style={{display:'inherit'}} className='text-sm'/></span> DeliverAddress</h6>
                    <h4 className='text-sm font-bold'>

                      {
                          
                             JSON.parse(window.localStorage.getItem('ecommerce_location')) ? 
                             <div className='flex gap-1 justify-center'>
                                  <h4>{JSON.parse(window.localStorage.getItem('ecommerce_location'))[0]}</h4>
                                  <h4>{JSON.parse(window.localStorage.getItem('ecommerce_location'))[1]}</h4>
                             </div> :
                             <h4>
                              Select Your Location
                             </h4> 
                          
                      }
                    </h4>
                </button>
                { togglePincode &&            
                <div className='absolute top-16  z-10'>
                    <div className='bg-white rounded-md w-[20rem] h-[10rem] m-auto dark:bg-slate-900'>
                      <div className='flex flex-col h-[10rem] justify-center gap-3 items-center '>
                        <h6 className='text-md font-semibold dark:text-white'>Enter Your Location Pincode</h6>
                        <form  onSubmit={handlerSubmitPincode}>
                          <input className='form-input' type='number' placeholder='Please Enter Pincode'  autoFocus value={pincode} onKeyDown={(e)=>{if(e.key === "Enter"){handlerFilterPincode()}}} onChange={(e)=>setPincode(e.target.value)}/>
                          <NavLink to='/' className='bg-red-600 text-white  p-2' type='submit' onClick={handlerFilterPincode} >Apply</NavLink>
                        </form>
                      </div>
                    </div>
                </div>   
                }
              </div>
              <div className='sm:w-[32%] w-[10rem] bg-black border'>
                <form className='flex' onSubmit={(e)=>handlerSubmitTitle(e)}>   
                    <input className='form-input sm:w-[29rem] w-full border-none focus:outline-none' type='search' value={searching} placeholder='searching' onKeyDown={(e)=>{if(e.key === "Enter"){handlerFilterTitle()}}} onChange={(e)=>filterTitleHandler(e)} />
                     <button className='form-input border-none'><GoSearch className=''/></button>
                </form>
                  {
                     data1?.data?.length === 0 && 
                     <div className='absolute mt-1 w-[31.8%] xl:w-[30.5rem] z-20'>
                     <div className='h-auto rounded-md p-2 w-full overflow-scroll dark:text-white'>
                           Not Found
                     </div>
                 </div> 
                  }
                  {
                      searching.length > 0 && 
                        <div className='absolute mt-1 w-[40%] xl:w-[30.5rem]'>
                          <div className='bg-white  h-44 rounded-md p-2 w-full overflow-scroll dark:bg-slate-900 dark:text-white'>
                            <ul>
                                {
                                data1?.data?.map((itm , index)=>(
                                  <li className='border-b-2 p-1 text-sm sm:text-lg font-mono w-full cursor-pointer' key={index} onClick={()=>setSearching(itm.title)}>{itm.title}</li>
                                ))
                                }
                            </ul>
                          </div>
                      </div> 
                  }
              </div>
              <div className='lg:w-[20rem] md:w-[12rem] sm:w-[12rem] w-[5rem] md:relative flex  justify-between sm:justify-evenly items-center'>
              <div className='hidden sm:w-[15%] sm:block'>         
                  <NavLink className='flex' to={User.length === undefined  && User ? `/cart/${User.email}` : '/login'}> 
                      <BsCartCheck  className='h-10 w-[1.4rem] text-white '/>
                      <span className='mt-[-0.5rem] text-white font-light'>{data?.data?.length >= 1 ? data?.data?.length : "" }</span>
                  </NavLink>
              </div>
             
              <div className='w-[10%]'> 
                <button onClick={()=>dispatch(setThemeMode())}> 
                   {    theme  ? <span><BsMoonFill  className='text-white'  /></span> : 
                                 <span><BsFillSunFill className='text-white'  /></span>
                    } 
                </button>
              </div>
            {
                  User.length === undefined  && User ?  
                  <div>
           
                   <button className='w-[5rem] h-10' onClick={()=>setProfileToggle(!profileToggle)}>
                      {User.profile ? <img  src={User.profile} alt='images' className='w-7 h-7 sm:w-10 sm:h-10 rounded-3xl' referrerPolicy='no-referrer' /> :
                        <div><BsPersonCircle className='text-3xl text-white' /></div>
                      }
                     
                   </button>
                  
                   {
                      profileToggle && 
                      <div className='absolute z-10 top-16 right-0 md:left-11' >
                       <div className= 'bg-white rounded-md  w-[12rem] h-96 p-5 shadow-lg dark:bg-slate-950'> 
                            <div className='flex flex-col justify-between h-80'>
                              <div className='flex flex-col gap-2 dark:text-white'>
                                <NavLink to={`/profile/${User._id}`} className='flex items-center gap-3 text-lg' onClick={()=>setProfileToggle(false)}>
                                    <BiUserPin className='text-2xl text-blue-500' />
                                  <h4 className='font-medium hover:-translate-y-2'>Myprofile</h4>
                                 </NavLink>
                                 <NavLink to={`/wishlist/${User.email}`} className='flex items-center gap-3 text-lg' onClick={()=>setProfileToggle(false)}>
                                   <MdFavoriteBorder className='text-2xl text-blue-500' />
                                   <h4 className='font-medium hover:-translate-y-2'>My Wishlist <span className='text-red-200  px-1 py-0.5 text-sm  rounded-lg bg-red-500'>{wish?.data?.length >= 1 ? wish?.data?.length : "0" }</span></h4>
                                 </NavLink>
                                 <NavLink to={`/orderitems/${User.email}`} className='flex items-center gap-3 text-lg' onClick={()=>setProfileToggle(false)}>
                                   <BiCartAdd className='text-2xl text-blue-500' />
                                  <h4 className='font-medium hover:-translate-y-2'>Your order</h4>
                                 </NavLink>
                                 <NavLink className='flex items-center gap-3 text-lg sm:hidden' to={User.length === undefined  && User ? `/cart/${User.email}` : '/login'} onClick={()=>setProfileToggle(false)}> 
                                    <BsCartCheck  className='text-2xl text-blue-500'/>
                                    <h4 className='font-medium hover:-translate-y-2'>Cart <span className='text-red-200  px-1 py-0.5 text-sm  rounded-lg bg-red-500'>{data?.data?.length >= 1 ? data?.data?.length : "0" }</span></h4>
                                </NavLink>
                              </div>
          
                               <div className='flex flex-col gap-2 dark:text-white'>
                                <hr />
                                 <button className='flex items-center gap-3 text-lg' onClick={()=>{ toast.warning("Logged Out") ; dispatch(LogOut()) ; setProfileToggle(false)}}>
                                    <BiLogOut className='text-2xl' />
                                    <h4 className='font-bold hover:-translate-y-2'>Sign Out</h4>
                                  </button>
                                  <hr />
                                  <div>
                                  <button className='w-[5rem] h-10'>
                                      {User.profile ? <img  src={User.profile} alt='images' className='w-10 h-10 rounded-3xl' referrerPolicy='no-referrer' /> :
                                        <div><BsPersonCircle className='text-3xl text-white' /></div>
                                      }
                                    
                                  </button>
                                    <div>
                                      <h4>{User.username}</h4>
                                      <h6 className='truncate'>{User.email}</h6>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                      </div>

                   }

                  </div>
                :
                <div>
                <button className='text-white hover:border  rounded-md  w-[3rem] sm:w-[5rem] h-10' onClick={()=>setSign(!sign)}>
                    <h6 className='text-xs font-bold'>Hello!</h6>
                    <h4 className='text-xs sm:text-sm font-thin'>SignIn/Up</h4>
                </button>
                {sign && 
                
                <div className='absolute top-16 z-10'>
                     <div className='bg-white w-[5rem] p-3 rounded-sm mt-1'>
                          <NavLink to='/login' ><button className='text-md font-medium hover:font-light'>SignIn</button></NavLink>
                          <NavLink to='/register'><button className='text-md font-medium hover:font-light'>SignUp</button></NavLink>
                     </div>
                </div>
                }
                
              </div>
          }    
              </div>
          </div>
      </div>
      <ToastContainer />
     </div>
     <Outlet />
    </div>
  )
}

export default Header