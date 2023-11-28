import { createSlice } from "@reduxjs/toolkit";

const initialState = {
     User: [],
     order : [],
     theme : localStorage.getItem('Mode') ? JSON.parse(localStorage.getItem('Mode')) : false,
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
    }
})

export const { setToken , setCerdentials , LogOut , setThemeMode , setGoogle } = UserSlice.actions

export default UserSlice.reducer 