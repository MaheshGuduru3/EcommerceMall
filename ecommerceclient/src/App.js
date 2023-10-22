import Header from "./component/header/Header";
import { BrowserRouter , Routes , Route} from 'react-router-dom'
import Cart from "./component/pages/Cart";
import Login from "./component/pages/Login";
import Register from "./component/pages/Register";
import VerifyAccount from "./component/pages/VerifyAccount";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Home from "./component/Home";
import WishList from "./component/pages/WishList";
import Products from "./component/pages/Products";
import SingleProduct from "./component/pages/SingleProduct";
import FilterCategoriesName from "./component/pages/FilterCategoriesName";
import SearchProduct from "./component/pages/SearchProduct";
import Profile from "./component/pages/Profile";
import Success from "./component/pages/Success";
import YourOrder from "./component/pages/YourOrder";
import ForgetPassword from "./component/pages/ForgetPassword";
import NewPassword from "./component/pages/NewPassword";
import NotFound from "./component/pages/NotFound";
import { useGetLatestProdsQuery } from "./features/products/productApi";
import server from './assests/servererror.gif'
function App() {
   
  const { theme } = useSelector(state=>state.userslice)

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
        
            {  localStorage.getItem('token') ?     
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
       </BrowserRouter>
       </>
      }
      

    </div>
  );
}

export default App;
   