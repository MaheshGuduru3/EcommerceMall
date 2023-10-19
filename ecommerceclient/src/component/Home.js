import React, { useEffect, useRef, useState } from 'react'
import { AiOutlineRight , AiOutlineLeft} from 'react-icons/ai'
import ban1 from '../assests/amazon_BannerSize1.jpg'
import ban2 from '../assests/amazon_BannerSize2.jpg'
import ban3 from '../assests/amazon_BannerSize3.jpg'
import ban4 from '../assests/amazon_BannerSize4.jpg'
import LatestProduts from './LatestProduts'
import OfferProducts from './OfferProducts'
import Categories from './Categories'
import Footer from './footer/Footer'


const imgs = [
 
     {
       id:0,
       img:ban1,
     },
     
     {
      id:1,
      img:ban2,
    },
    
    {
      id:2,
      img:ban3,
    },  
    {
      id:3,
      img:ban4,
    }
]

const Home = () => {

  const [count , setCount] = useState(0)
  const time = useRef(null)
  useEffect(()=>{
     time.current = setTimeout(()=>{
               if(count >= imgs.length-1 ){
                setCount(0)
               }
               else{
                setCount(count+1)
               }
     },2000)
   return ()=>clearTimeout(time.current)  
  })

return (
    <div>
    <div className='max-w-[96rem] m-auto dark:bg-slate-950'>  
      <div className='w-[96rem]  m-auto relative  top-14 dark:bg-slate-950'>
          <div>
              <div className='w-[96rem] m-auto relative' style={{zIndex:'1'}}>
                   <div className='w-full'>
                    <img src={imgs[count].img} className='w-full h-[30rem]'  />
                   </div>
                   <div className='w-full  absolute  top-28  flex justify-between px-5' >   
                       <button className='text-4xl' onClick={()=>count <= 0 ? setCount(imgs.length-1): setCount(count-1)}><AiOutlineLeft /></button>
                       <button className='text-4xl' onClick={()=>count >= imgs.length-1 ? setCount(0) : setCount(count+1)}><AiOutlineRight /></button>   
                   </div>

                   <div className='w-[100%] absolute bottom-5 flex gap-2 justify-center '>  
                      {
                        imgs.map((itm, index)=>(
                            <button key={index} className={itm.id === count ? "w-2.5 h-1.5 bg-black rounded-2xl transition-all":" w-1.5 h-1.5 bg-white rounded-2xl"} onClick={()=>setCount(itm.id)}></button>
                        ))
                      }
                   </div>
              </div>
          </div>
          <div>
             <LatestProduts />

          </div>
          <div>
            <OfferProducts />
          </div>
           <div>
            <Categories />
          </div>
          
          <div>
             <Footer /> 
          </div> 
      </div>
    </div>
  </div>
  )
}

export default Home    