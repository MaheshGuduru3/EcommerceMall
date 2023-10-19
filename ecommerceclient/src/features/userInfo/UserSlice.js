import { createSlice } from "@reduxjs/toolkit";

const initialState = {
     User: [],
     order : [],
     token: localStorage.getItem('token') && localStorage.getItem('token'),
     theme : localStorage.getItem('Mode') ? JSON.parse(localStorage.getItem('Mode')) : false,
     google : localStorage.getItem('google')? JSON.parse(localStorage.getItem('google')): false
}


const UserSlice = createSlice({
    name:'userslice',
    initialState,
    reducers:{
        setToken:(state,action)=>{
            state.token = action.payload
            localStorage.setItem('token' ,action.payload) 
        
        },
        setCerdentials:(state,action)=>{
             state.User = action.payload
         },

         setThemeMode  : (state)=>{
             state.theme = !state.theme
         },
         LogOut : (state)=>{
             localStorage.removeItem("token")
             setTimeout(() => {
                window.location.reload()
             }, 2000);
         },
         setGoogle : (state,action)=>{
             state.google = action.payload
             localStorage.setItem('google' , JSON.stringify(state.google))
         }
    }
})

export const { setToken , setCerdentials , LogOut , setThemeMode , setGoogle } = UserSlice.actions

export default UserSlice.reducer 