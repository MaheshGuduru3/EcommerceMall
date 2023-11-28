import { useEffect } from "react";
import { useSelector } from "react-redux";
import { lazy , Suspense  } from "react";
import { useGetLatestProdsQuery } from "./features/products/productApi";
import server from './assests/servererror.gif'
import { BrowserRouter , Routes , Route} from 'react-router-dom'
const Header = lazy(()=> import("./component/header/Header"));
const Cart = lazy(()=> import("./component/pages/Cart"));
const Login = lazy(()=> import("./component/pages/Login"));
const Register = lazy(()=> import  ("./component/pages/Register"));
const VerifyAccount = lazy(()=> import("./component/pages/VerifyAccount"));
const Home = lazy(()=> import("./component/Home"));
const WishList = lazy(()=> import ("./component/pages/WishList"));
const Products = lazy(()=> import("./component/pages/Products"));
const SingleProduct = lazy(()=> import ("./component/pages/SingleProduct"));
const FilterCategoriesName = lazy(()=> import("./component/pages/FilterCategoriesName"));
const SearchProduct = lazy(()=> import("./component/pages/SearchProduct"));
const Profile = lazy(()=> import ("./component/pages/Profile"));
const Success = lazy(()=> import("./component/pages/Success"));
const YourOrder = lazy(()=>import("./component/pages/YourOrder"));
const ForgetPassword = lazy(()=> import("./component/pages/ForgetPassword"));
const NewPassword = lazy(()=> import("./component/pages/NewPassword"));
const NotFound = lazy(()=> import ("./component/pages/NotFound"));

function App() {
   
  const { theme , User } = useSelector(state=>state.userslice)

 console.log(User)        

  const {isError } = useGetLatestProdsQuery()
      
 
  useEffect(()=>{  

     if(theme){
      document.documentElement.classList.add("dark")
      localStorage.setItem('Mode', JSON.stringify(true))
     }
     else{
      document.documentElement.classList.remove('dark')
      localStorage.setItem('Mode' , JSON.stringify(false)) 
     }



  },[theme])

 

  return (
    
    <div className="w-full">  
      
      {
          isError ? 
          <div className="max-w-[96rem] m-auto flex flex-col items-center">
           <img  src={server} className=" w-[10rem] sm:w-[20rem]" alt="server-side-error"/>
           <h4 className="text-lg font-mono">500 server side error</h4>
          </div>
       : 
      <>
       <BrowserRouter>
        <Suspense fallback={ <div className='w-full h-screen flex justify-center items-center dark:text-white'>
                        <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                </div>}>
       <Routes>
      
       
            <Route  path="/login" element={<Login />}/>
            <Route  path="/register" element={<Register />} /> 


        <Route  path="/forgetpassword"  element={<ForgetPassword />}/>
        <Route  path="/createpassword/:token"  element={<NewPassword />}/>
         <Route path="/" element={<Header />}>
            <Route index path="/" element={<Home />} />
            <Route  path="/products"  element={<Products />}/> 
            <Route  path="/singleproduct/:id" element={<SingleProduct />}/>
            <Route  path="/category/:id"  element={<FilterCategoriesName />}/>
            <Route  path="/searchedproduct/:search" element={<SearchProduct />}/>
        
            {  User && User.length === undefined ?     
               <Route path="/">  
                 <Route  path="/profile/:id"  element={<Profile />} />
                 <Route  path="/purchased" element={<Success />}/>
                  <Route  path="/cart/:email"  element={<Cart />} />
                 <Route  path="/wishlist/:email" element={<WishList />}/>
                 <Route  path="/orderitems/:email"  element={<YourOrder />}/>  
                 <Route  path="/verifyaccount/:token" element={<VerifyAccount />} />
               </Route>
           :
           
         ""
          }
          
          <Route  path="*"  element={<NotFound />}/>
        </Route>
       </Routes>
        </Suspense>
       </BrowserRouter>
       </>
      }
      

    </div>
  );
}

export default App;
   