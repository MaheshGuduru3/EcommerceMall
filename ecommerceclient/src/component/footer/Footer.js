import React from 'react'

const Footer = () => {
  return (
    <div>
        <div className='max-w-[96rem] m-auto min-h-[20rem] bg-slate-700'>
             <div> 
                <div className='text-white flex justify-evenly gap-8 flex-wrap  p-7'>
                   <div>
                        <h4 className='text-xl'>Get to Know Us</h4>
                        <h4 className=' font-thin hover:translate-x-2 cursor-pointer'>About Us</h4>
                        <h4 className='font-thin hover:translate-x-2 cursor-pointer'>Careers</h4>
                        <h4 className='font-thin hover:translate-x-2 cursor-pointer'>Press Releases</h4>
                        <h4 className='font-thin hover:translate-x-2 cursor-pointer'>Amazon Science</h4>
                   </div>
                   <div>
                        <h4 className='text-xl'>Connect with Us</h4>
                        <h4 className='font-thin hover:translate-x-2 cursor-pointer'>FaceBook</h4>
                        <h4 className='font-thin hover:translate-x-2 cursor-pointer'>GitHub</h4>
                        <h4 className='font-thin hover:translate-x-2 cursor-pointer'>Instagram</h4>
                        <h4 className='font-thin hover:translate-x-2 cursor-pointer'>Twitter</h4> 
                   </div>
                   <div>
                        <h4 className='text-xl'>Let Us Help You</h4>
                        <h4 className='font-thin hover:translate-x-2 cursor-pointer'>COVID-19</h4>
                        <h4 className='font-thin hover:translate-x-2 cursor-pointer'>Help Center</h4>
                        <h4 className='font-thin hover:translate-x-2 cursor-pointer'>Your Account</h4>
                        <h4 className='font-thin hover:translate-x-2 cursor-pointer'>Discussion</h4> 
                   </div>
                </div>
                <div className='text-white text-center p-4'>
                    <h2 className='text-3xl font-sans'>MyZoneMall</h2>
                    <h4 className='font-thin'>2023@Copyrights Reserved</h4>
                </div>
              
             </div>
        </div>
    </div>
  )
}

export default Footer