import  { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import  usersliceReducer from '../features/userInfo/UserSlice'
import { apiSlice } from '../features/api/apiSlice'

export const store = configureStore({
     reducer:{  
          [apiSlice.reducerPath] : apiSlice.reducer,
          userslice:usersliceReducer
     },
     middleware:(getDefaultMiddleware)=> getDefaultMiddleware().concat(apiSlice.middleware)   
})