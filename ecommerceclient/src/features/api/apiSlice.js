import { createApi  , fetchBaseQuery  } from '@reduxjs/toolkit/query/react'

export const apiSlice =  createApi({
        reducerPath:'api',
        baseQuery:fetchBaseQuery({
           baseUrl:`${process.env.REACT_APP_HOSTNAMED}/api`,
           prepareHeaders: (headers, { getState }) => {
            const token = (getState()).userslice.token;
            if (token) {
              headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
          },
       }),
       tagTypes:['Users', 'cartlist', 'wishlist' , 'order' ],
       endpoints : (builders)=>({})   
})

