import joi from "joi"


export const signupSchema = joi.object({
    userName:joi.string().min(3).max(10).required(),
    email:joi.string().email({tlds: { allow: ['com', 'net','org'] }}).required(),
    mobileNumber:joi.string().pattern(/^01[0125][0-9]{8}$/).required(),
    password:joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
    repassword:joi.string().valid(joi.ref('password')).required(),
   


}).required()

export const loginSchema = joi.object({
  
    email:joi.string().email({tlds: { allow: ['com', 'net','org'] }}).required(),
    password:joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),


}).required()


export const resetPasswordSchema=joi.object({
   
    newPassword:joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
    repassword:joi.string().valid(joi.ref('newPassword')).required(),
    token:joi.string().required()

}).required()

export const forgetPasswordSchema = joi.object({
  
    email:joi.string().email({tlds: { allow: ['com', 'net','org'] }}).required(),
}).required()