import { apiSlice } from "../api/apiSlice";


const userApi  = apiSlice.injectEndpoints({
       
    endpoints:builders=>({
        
        getAllUsers : builders.query({
            query:()=>'/users',
            providesTags:['Users']
        }),

        getSignInUser : builders.mutation({
           query: (data) => ({
               url: '/signin',
               method: 'POST',
               body: data,
             }),
            invalidatesTags:['Users']
        }),
         
        getVerifyUser : builders.query({   
            query: ()=>({
               url:'/verifyuser',
               method: 'GET',
            }), 
            providesTags:['Users']
        }), 


        createUser : builders.mutation({
            query:(data)=>({
                 url:'/signup',
                 method: 'POST',
                 body : data
            }),
            invalidatesTags:['Users']
        }),

        googleSignUp : builders.mutation({
               query: ()=>({
                     url:"/auth/google",
                     method:"POST",
               }),
             invalidatesTags:['Users']
        }),


        googleSignIn : builders.query({
             query:()=>({
                  url:"/auth/google",
                  method:"GET"
             }),
             providesTags:['Users']
        }),

        getUserUpdateProfile : builders.mutation({
            query : ({id , data} ) =>({    
              url:`/users/${id}`,
                 method:"PATCH",
                 body: data 
            }),
         invalidatesTags:['Users']            
      }),

      
      getUserAddress : builders.query({
        query : (mail)=>({
         url:`/address/${mail}`,
         method:'GET'
        }),
        providesTags:['Address']
 }),

 addUserAddress : builders.mutation({
      query : (data)=>({
         url:'/address',
         method:"POST",
         body : { data }
      }),
      invalidatesTags:['Address']
 }),


     getforgetPassword : builders.mutation({
           query:(email)=>({
               url:'/forgetpassword',
               method:'POST',
               body: { email }
           })
     }),

     addResetPassword : builders.mutation({
            query:({token , data})=>({
                  url:'/resetpassword',
                  method:'POST',
                  body:{ token , data}
            })
     })  ,

     getVerifymailAfter : builders.mutation({
            query : (email)=>({
                 url:'/mailverify',  
                 method:'POST',
                 body:{ email }
            })
     }),  

     getVerifyMail : builders.mutation({
          query: (token)=>({
              url:'/verifymailconfrom',
              method:'POST',
              body:{ token } 
          })
     })   ,
     getDeleteAddress : builders.mutation({
        query:(email)=>({
           url:'/address',
           method:'DELETE',
           body : { email }
        }),
        invalidatesTags:['Address']
     }),


     logOutUser : builders.mutation({
          query :(data)=>({
             url:'/logout',
             method:'POST',
             body:{data} 
          })
     })

       })
})


export const {         useGetAllUsersQuery,
                       useGetSignInUserMutation,  
                       useGetVerifyUserQuery,
                       useCreateUserMutation , 
                       useGoogleSignUpMutation , 
                       useGoogleSignInQuery,  
                       useGetUserUpdateProfileMutation,
                       useAddUserAddressMutation,
                       useGetUserAddressQuery,   
                       useGetforgetPasswordMutation ,
                        useAddResetPasswordMutation ,
                        useGetVerifymailAfterMutation,
                          useGetVerifyMailMutation,
                          useGetDeleteAddressMutation,
                          useLogOutUserMutation
                         
                       } = userApi



export default userApi
