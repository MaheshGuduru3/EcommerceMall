const express = require('express')
const route = express.Router()
const { normalCheck , userSignUp, AllUserSignUp, userSignIn, verifyAndGetUser, sendingMailVerifyAccount, googleSignUp, googleSignIn, UpdateUserInfo, forgetPasswords, sendingMailForgetPassword, resetPasswords, mailverificationAfter, VerifyAccount, gettingUser, sendingMailOrderedProducts } = require('../controllers/controllerTarget')
const { wishlistProd, wishlistaddProd, wishlistdeleteProd } = require('../controllers/wishlistController')
const { cartlistaddProd, cartlistProd, cartlistdeleteProd, cartUpdateQuantity, cartlistAllDelete } = require('../controllers/cartlistController')
const { addManyProducts, getproducts, getCatergory, singleProd, getsingleCategoryProds, getLatestProds, filterCategories, productTitleName } = require('../controllers/allProductController')
const { getOfferProd, offerAddProduct } = require('../controllers/offerProdController')
const { categorySchemaAllProductsPost, categorySchemaAllProductsGet } = require('../controllers/categoryController')
const { addAddress, getAddress, deleteAddress } = require('../controllers/addressController')
const { orderCreation, verifypaymentOrder } = require('../controllers/paymentController')
const { ordersAdd, orderSingleUser, ordersCartAdd, orderproductDelete } = require('../controllers/orderController')

route.get('/', normalCheck)

/********** USER AUTH API *************/
route.get('/users', AllUserSignUp)
route.patch('/users/:id' , UpdateUserInfo )
route.post('/signup' , userSignUp , sendingMailVerifyAccount)
route.post('/signin', userSignIn)
route.post('/verifyuser' , verifyAndGetUser , gettingUser)       
route.post('/googlesignup' , googleSignUp)
route.post('/googlesignin' , googleSignIn)

    
/************** forgot password ************/   
route.post('/forgetpassword' , forgetPasswords,sendingMailForgetPassword)
route.post('/resetpassword' , resetPasswords)

/*************** mail verify************** */
route.post('/mailverify' , mailverificationAfter,sendingMailVerifyAccount)
route.post('/verifymailconfrom' , VerifyAccount)    
route.post('/orderedmail' , sendingMailOrderedProducts)   

/*********** ALL INSIDE  LATEST PRODS AVAILABLE  ********/
route.get('/newproducts' , getLatestProds)

/*********** WISHLIST PRODS API ********/
route.get('/wishlist/:email' , wishlistProd)
route.post('/wishlist' , wishlistaddProd)
route.delete('/wishlist', wishlistdeleteProd)

/*********** CARTLIST PRODS API ********/
route.get('/cartlist/:email' , cartlistProd)
route.post('/cartlist' , cartlistaddProd)
route.delete('/cartlist' , cartlistdeleteProd)
route.patch('/cartlist' , cartUpdateQuantity)

route.delete('/cart' , cartlistAllDelete)  



/*********** ALL  PRODUCTS API ********/
route.post('/products' , addManyProducts)
route.get('/products' , getproducts)
route.get('/products/:id' , singleProd)
route.post('/prodtitle' , productTitleName)




/********  Category  ******* */
route.get('/category' , getCatergory) // this is the group category list of contains in it
route.get('/category/:id' , getsingleCategoryProds) 
route.get('/filtercategory/:category' , filterCategories)

/**********category schema */
route.post('/categoryschema' , categorySchemaAllProductsPost)
route.get('/categoryschema' , categorySchemaAllProductsGet)



/*********** OFFER PRODS  ************* */
route.get('/offerproducts', getOfferProd)
route.post('/offerproducts' , offerAddProduct)



/********* Address ***************/
route.post('/address' , addAddress)
route.get('/address/:mail' , getAddress)
route.delete('/address' , deleteAddress)


/********** Payment ************ */
route.post('/payment' , orderCreation)
route.post('/verifypayment' , verifypaymentOrder)

/********** order ****************/
route.post('/orderscart' , ordersCartAdd)
route.post('/order', ordersAdd)
route.get('/order/:email' , orderSingleUser)
route.delete('/order' , orderproductDelete)

module.exports = route