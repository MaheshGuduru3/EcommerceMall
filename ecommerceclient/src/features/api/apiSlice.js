import { createApi  , fetchBaseQuery  } from '@reduxjs/toolkit/query/react'

export const apiSlice =  createApi({
        reducerPath:'api',
        baseQuery:fetchBaseQuery({
           baseUrl:'http://localhost:3007/api',
           prepareHeaders: (headers, { getState }) => {
               const token = (getState()).userslice.token;  
               if (token) {
                   headers.set('authorization', `Bearer ${token}`);
               }
               return headers
           },
       }),
       tagTypes:['users', 'cartlist', 'wishlist' , 'order' ],
       endpoints : (builders)=>({}) 
})

