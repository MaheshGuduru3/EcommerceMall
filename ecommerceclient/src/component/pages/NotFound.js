import React from 'react'
import not from '../../assests/NotFoundPage.gif'
const NotFound = () => {
  return (
    <div className='w-[96rem] m-auto relative  top-14 dark:bg-slate-950 dark:text-white'>
         <div className='w-[90rem] m-auto flex flex-col items-center'>
             <img  src={not} />
             <h1 className='p-4 text-xl'>Page Not Found Error.</h1>
         </div>
    </div>
  )
}

export default NotFound