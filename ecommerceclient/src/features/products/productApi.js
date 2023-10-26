import { apiSlice } from "../api/apiSlice";

  
const productApi  = apiSlice.injectEndpoints({
      endpoints:builders=>({
                   getLatestProds : builders.query({
                           query:()=>({
                              url:"/newproducts"
                           })
                     }),
                     
                     getOfferProducts : builders.query({
                             query:()=>'/offerproducts'
                     }),
            
                     getWishList : builders.query({
                         query:(email)=>({
                             url:`/wishlist/${email}`,
                             method:"GET",
                            }),
                        providesTags:['wishlist']
                    }),
            
                    getmakeWishList : builders.mutation({
                         query:(data)=>({
                             url:"/wishlist",
                             method:"POST",
                             body:data
                         }),
                         invalidatesTags:['wishlist']
                    }),
                    
                    getDeleteWishlist : builders.mutation({
                         query:(title)=>({
                             url:`/wishlist`,
                             method:"DELETE",
                             body: { title }
                         }),
                         invalidatesTags:['wishlist']
                    }),
            
                    getCartlist : builders.query({
                          query:(email)=>({
                               url:`/cartlist/${email}`,
                               method:'GET'
                          }),
                          providesTags:['cartlist']
                    }) ,
            
                    getaddCartlist : builders.mutation({
                         query:(data)=>({
                            url:'/cartlist',
                            method:'POST',
                            body:data
                         }),
                         invalidatesTags:['cartlist']  
                    }),
            
                    getdeleteCartlist : builders.mutation({
                          query:(title)=>({
                             url:`/cartlist`,
                             method:'DELETE',
                             body:{title}
                          }),
                          invalidatesTags:['cartlist'] 
                    }),
                    getUpdateQuantityCartlist : builders.mutation({
                          query : ({ id , value })=>({
                              url:'/cartlist',
                              method:'PATCH',
                              body: { id , value }
                          }),
                          invalidatesTags : ['cartlist']
                    }),
            
                    getAllProducts : builders.query({
                         query:(data)=>({
                             url:`/products?page=${data}` 
                         }),
                         providesTags:['products']
                    }),
                    
                    getSingleproduct : builders.query({
                          query:(id)=>({
                             url:`/products/${id}`,
                             method:'GET'
                          }),
                          invalidatesTags:['products']
                    }),
            
                    getCatergoriesNames : builders.query({
                          query : ()=>'/category' 
                    }),
            
                    getNamedCategoryall : builders.query({
                         query :(id)=>({
                             url:`/category/${id}`,
                             method:'GET'
                         })
                    }),
            
                    getCategorySchemaNames : builders.query({
                         query:()=>'/categoryschema'
                    }),
            
                    getFilterCategories : builders.query({
                          query:(category)=>({
                              url:`/filtercategory/${category}`,
                              method:'GET'
                          })
                    }),
            
                    getFilterTitle : builders.mutation({
                          query:(titles)=>({
                             url:'/prodtitle',
                             method:'POST',
                             body : { titles }
                          })
                    }),
            
            
                    getPaymentOrder : builders.mutation({
                         query:(amount)=>({
                             url:'/payment',
                             method:'POST',
                             body: {amount}
                         })
                    }),
            
                    getPaymentVerify : builders.mutation({
                           query:(data)=>({
                             url:'/verifypayment',
                             method:'POST',
                             body : {data}
                           })
                    }),
            
                    addOrdersProduct : builders.mutation({
                          query:({Data , results , email , payMode , quantity})=>({
                             url:'/order',
                             method:'POST',
                             body: { Data , results , email  , payMode , quantity}
                          }),
                          invalidatesTags:['order']
                    }),
            
                    addorderscartproducts : builders.mutation({
                         query: ({Data, payMode, results , tAmount , email})=>({
                            url:'/orderscart',
                            method:'POST',
                            body: { Data, payMode , results , tAmount , email}
                         }),
                         invalidatesTags:['order']
                    }),
            
                    getUserOrders : builders.query({
                        query : (email)=>({
                            url: `/order/${email}`,
                            method:'GET'
                        }),
                        providesTags:['order'] 
                    }),

                    getMailOrderedProducts : builders.mutation({
                           query : ({ data , payMode , payment , email})=>({
                                url:'/orderedmail',   
                                method:'POST',
                                body:{ data , payMode , payment , email}   
                           }) 
                    }),
                   
                 getcartlistDeleteAfterOrder : builders.mutation({
                      query:(email)=>({
                        url:'/cart',
                        method:'DELETE',
                        body:{ email }
                      }),
                      invalidatesTags:['cartlist']

                 })
                  
      })    
})

export const {   useGetLatestProdsQuery,
           useGetWishListQuery,   
           useGetmakeWishListMutation,
           useGetDeleteWishlistMutation,
           useGetCartlistQuery,
           useGetaddCartlistMutation, 
           useGetdeleteCartlistMutation,
           useGetUpdateQuantityCartlistMutation,
           useGetAllProductsQuery,
           useGetSingleproductQuery,
           useGetNamedCategoryallQuery,
           useGetCatergoriesNamesQuery,
           useGetOfferProductsQuery,
           useGetCategorySchemaNamesQuery,
           useGetFilterCategoriesQuery,
           useGetFilterTitleMutation,
            useGetPaymentOrderMutation,
            useGetPaymentVerifyMutation,
            useAddOrdersProductMutation,
            useAddorderscartproductsMutation,
            useGetUserOrdersQuery,
            useGetMailOrderedProductsMutation,
            useGetcartlistDeleteAfterOrderMutation
           
        } = productApi

export default productApi
