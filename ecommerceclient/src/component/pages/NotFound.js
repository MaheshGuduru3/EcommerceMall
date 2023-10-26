import React from 'react'
import not from '../../assests/NotFoundPage.gif'
import { NavLink } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className='max-w-[96rem] m-auto relative  mobile top-14 dark:bg-slate-950 dark:text-white'>
         <div className='flex flex-col items-center'>
             <img  src={not}  className='w-96' alt='not-found'/>
             <h1 className='p-4 text-xl'>Page Not Found Error.</h1>
             <NavLink to='/' className='bg-red-500 p-1 rounded-md px-2 text-white font-light'>Back To Home</NavLink>
         </div>
    </div>
  )
}

export default NotFound