
import userModel from "../../../DB/model/user.model.js";
import sendMail from '../../utils/email.js'
import { generateToken, verifyToken } from "../../utils/GenerateAndVerifyToken.js";
import { compare, hash } from "../../utils/HashAndCompare.js";
import { ResError } from "../../utils/ResError.js";


export const signup = async (req, res, next) => {
   

        const { email, userName, password, repassword,mobileNumber,role } = req.body;
    

        const checkUser = await userModel.findOne({ email:email.toLowerCase() })
        if (checkUser) {
            return next( new ResError("Email Exist",409) )
          
        }
        const hashPassword = hash({ plaintext: password })
        const token =generateToken({payload:{ email },expiresIn: 60 * 60})
        const refToken =generateToken({ payload: { email },expiresIn: 60 * 60 * 24 * 30 })
        const link = `${req.protocol}://${req.headers.host}/auth/verifyMail/${token}`
        const refLink =`${req.protocol}://${req.headers.host}/auth/reVerifyMail/${refToken}`
        const html = ` <html>
                <head>
                    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
                <style type="text/css">
                body{background-color: #88BDBF;margin: 0px;}
                </style>
                <body style="margin:0px;"> 
                <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
                <tr>
                <td>
                <table border="0" width="100%">
                <tr>
                <td>
                <h1>
                    <img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/>
                </h1>
                </td>
                <td>
                <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none;">View In Website</a></p>
                </td>
                </tr>
                </table>
                </td>
                </tr>
                <tr>
                <td>
                <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
                <tr>
                <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
                <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
                </td>
                </tr>
                <tr>
                <td>
                <h1 style="padding-top:25px; color:#630E2B">Email Confirmation</h1>
                </td>
                </tr>
                <tr>
                <td>
                <p style="padding:0px 100px;">
                </p>
                </td>
                </tr>
                <tr>
                <td>
                <a href="${link}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Verify your Email </a>
                <a href="${refLink}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Ask for new request</a>
                </td>
                </tr>
                </table>
                </td>
                </tr>
                <tr>
                <td>
                <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
                <tr>
                <td>
                <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
                </td>
                </tr>
                <tr>
                <td>
                <div style="margin-top:20px;">

                <a href="https://ar-ar.facebook.com/" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
                <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" width="50px" hight="50px"></span></a>
                
                <a href="https://www.instagram.com/" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
                <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" width="50px" hight="50px"></span>
                </a>
                
              `
       
       if (! await sendMail({email,html,subject: "Verify Email ✔"})) {

            return next(new ResError('Failed to send this email', 400))

        }
        
        const user = await userModel.create({ userName, email, password: hashPassword,mobileNumber,role })
        return res.status(201).json({ message: "Done", user })

}


export const login = async (req, res, next) => {


const { email, password } = req.body;

const user = await userModel.findOne({email:email.toLowerCase()})
if (!user) {
    return next(new ResError("Not registered account",400)) 
}
if(!user.isVerified)
{
    return next(new ResError("verify your email first",400)) 
}


const match = compare({ plaintext: password, hashValue: user.password })


if (!match) {
    return next(new ResError("In-valid login data",400))  
}


const token =   generateToken({payload:{ id: user._id, name:user.userName, email:user.email }})
const refresh_token = generateToken({payload:{ id: user._id, name:user.userName, email:user.email }, expiresIn: 60 * 60 * 24 * 365 })
return res.status(200).json({ message: "Done", token,refresh_token })

}



 export const verifyMail= async(req,res,next)=>{

    const {token}= req.params
    const decoded = verifyToken(token)
    if(!email){
        return next(new ResError('in_valid token payload', 400))
    }
    const user= await userModel.findOneAndUpdate({email:decoded.email},{isVerified:true},{new:true})
   
      return user?  res.status(200).redirect("https://linkitqa.netlify.app/#/login")
      :next(new ResError("Not registered account",400))
   
 }

 export const reVerifyMail= async(req,res,next)=>{
    
    const { refToken } = req.params
    const { email } = verifyToken(refToken)

    if (!email) {
        return next(new ResError('in_valid token payload', 400))
    }
    const user = await userModel.findOne({ email })

    
    if (!user) {
        return next(new ResError(' not registered account', 404))
    }
    if (user.isVerified) {

        return res.redirect('https://linkitqa.netlify.app/#/login')
    }

    const newToken = generateToken({ payload: { email }, expiresIn: 60 * 3 })
    const link = `${req.protocol}://${req.headers.host}/auth/verifyMail/${newToken}`
    const refLink =`${req.protocol}://${req.headers.host}/auth/reVerifyMail/${refToken}`

    const html = ` <html>
              <head>
                  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
              <style type="text/css">
              body{background-color: #88BDBF;margin: 0px;}
              </style>
              <body style="margin:0px;"> 
              <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
              <tr>
              <td>
              <table border="0" width="100%">
              <tr>
              <td>
              <h1>
                  <img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/>
              </h1>
              </td>
              <td>
              <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none;">View In Website</a></p>
              </td>
              </tr>
              </table>
              </td>
              </tr>
              <tr>
              <td>
              <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
              <tr>
              <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
              <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
              </td>
              </tr>
              <tr>
              <td>
              <h1 style="padding-top:25px; color:#630E2B">Email Confirmation</h1>
              </td>
              </tr>
              <tr>
              <td>
              <p style="padding:0px 100px;">
              </p>
              </td>
              </tr>
              <tr>
              <td>
              <a href="${link}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Verify Email address</a>
              <a href="${refLink}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">ask for new requist</a>
              </td>
              </tr>
              </table>
              </td>
              </tr>
              <tr>
              <td>
              <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
              <tr>
              <td>
              <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
              </td>
              </tr>
              <tr>
              <td>
              <div style="margin-top:20px;">

              <a href="https://ar-ar.facebook.com/" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
              <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" width="50px" hight="50px"></span></a>
              
              <a href="https://www.instagram.com/" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
              <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" width="50px" hight="50px"></span>
              </a>
              
            `


    if (! await sendMail({ to: email, html, subject: "Verify Email ✔" })) {

        return next(new Error('Failed to send this email'))

    }

    return res.status(200).send(` <h1>New Verification Email has been sent to: ${user.email}</h1>` )
   
 }



 //forget password controllers

 export const forgetPassword = async (req, res, next) => {

        const { email } = req.body;
        const resetPasswordCode = Math.floor(Math.random() * (9999-1000+1) + 1000)
        const user = await userModel.findOneAndUpdate({email:email.toLowerCase() },{resetPasswordCode});
        if (!user) {
            return next(new ResError("the email provided was not found",400))
          }

        const html=`<h1>Password Reset Code</h1>
                        <p>${code}</p>`
        await sendMail({email,subject: "RESET YOUR PASSWORD",html})
        
        return res.status(200).json({message: `a link to reset your password has been sent to: ${user.email}`});
   
}



export const saveResetPassword = async (req, res,next) => {
   
    const { email,forgetPasswordCode,newPassword,repassword}= req.body
    
    const hashPassword = hash({ plaintext: newPassword }) ;
    const user = await userModel.findOneAndUpdate({email:email.toLowerCase()});
    if (!user) {
        return next(new ResError("the email provided was not found",400))
      }
    if(user.forgetPasswordCode == parseInt(forgetPasswordCode)){
        user.password=hashPassword
        user.forgetPasswordCode==null
        await  user.save()
    }
   
    return res.status(200).json({message:"Done",user})
   
}
 