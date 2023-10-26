import { apiSlice } from "../api/apiSlice";


const userApi  = apiSlice.injectEndpoints({
       
    endpoints:builders=>({
        
        getAllUsers : builders.query({
            query:()=>'/users',
            providesTags:['users']
        }),

        getSignInUser : builders.mutation({
           query: (data) => ({
               url: '/signin',
               method: 'POST',
               body: data,
             }),
            invalidatesTags:['users']
        }),
         
        getVerifyUser : builders.mutation({   
            query: ()=>({
               url:'/verifyuser',
               method: 'POST',
            }), 
            invalidatesTags:['users']
        }), 


        createUser : builders.mutation({
            query:(data)=>({
                 url:'/signup',
                 method: 'POST',
                 body : data
            })
        }),

        googleSignUp : builders.mutation({
               query: ()=>({
                     url:"/googlesignup",
                     method:"POST",
               })
        }),


        googleSignIn : builders.mutation({
             query:()=>({
                  url:"/googlesignin",
                  method:"POST"
             }),
        }),

        getUserUpdateProfile : builders.mutation({
            query : ({id , data} ) =>({    
              url:`/users/${id}`,
                 method:"PATCH",
                 body: data 
            }),
            invalidatesTags:['users']
            
      }),

      
      getUserAddress : builders.query({
        query : (mail)=>({
         url:`/address/${mail}`,
         method:'GET'
        }),
        providesTags:['address']
 }),

 addUserAddress : builders.mutation({
      query : (data)=>({
         url:'/address',
         method:"POST",
         body : { data }
      }),
      invalidatesTags:['address']
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
        invalidatesTags:['address']
})

       })
})


export const {         useGetAllUsersQuery,
                       useGetSignInUserMutation,  
                       useGetVerifyUserMutation,
                       useCreateUserMutation , 
                       useGoogleSignUpMutation , 
                       useGoogleSignInMutation,  
                       useGetUserUpdateProfileMutation,
                       useAddUserAddressMutation,
                       useGetUserAddressQuery,   
                       useGetforgetPasswordMutation ,
                        useAddResetPasswordMutation ,
                        useGetVerifymailAfterMutation,
                          useGetVerifyMailMutation,
                          useGetDeleteAddressMutation
                       } = userApi



export default userApi
