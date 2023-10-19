import * as Yup from 'yup'


export const validationSignUp = Yup.object({
     username:Yup.string().min(5).max(30).required("Required username"),
     email:Yup.string().email().required("Required Email"),
     password:Yup.string().min(8).required("Required Password").matches("^[A-Z]+[a-z]+[^a-zA-Z0-9]+[0-9]+","Atleast one number,Uppercase,Lowercase,special characters"),
     reenterPassword:Yup.string().required("Required reenterpassword").oneOf([ Yup.ref('password') , null ], "mismatch password")   
})


export const validationSignIn = Yup.object({
     email:Yup.string().email().required("Required email"),
     password:Yup.string().required("Required password")
})



export const validationAddress = Yup.object({
     username:Yup.string().min(5).max(30).required("Required username"),
     phonenumber:Yup.string().matches("^[6-9]{1}[0-9]{9}", "valid phone number").max(10).required('Required Number'),
     pincode:Yup.number().min(6).required("required pincode"),
     address:Yup.string().required("required address")
})   


export const validationResetPassword = Yup.object({
     password:Yup.string().min(8).required("Required Password").matches("^[A-Z]+[a-z]+[^a-zA-Z0-9]+[0-9]+","Atleast one number,Uppercase,Lowercase,special characters"),
     repassword:Yup.string().required("Required reenterpassword").oneOf([ Yup.ref('password') , null ], "mismatch password")   
})