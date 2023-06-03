import userModel from "../../../../DB/model/user.model.js";
import { ResError } from "../../../utils/ResError.js";
import sendMail from "../../../utils/email.js";
import { generateToken, verifyToken } from "../../utils/GenerateAndVerifyToken.js";
import { compare, hash } from "../../utils/HashAndCompare.js";






export const signup = async (req, res, next) => {
   

        const { email, userName, password, repassword,mobileNumber,role } = req.body;
    

        const checkUser = await userModel.findOne({ email:email.toLowerCase() })
        if (checkUser) {
            return next( new ResError("Email Exist",409) )
          
        }
        const hashPassword = hash({ plaintext: password })
        const token =generateToken({payload:{ email }})
       const html= `<a target="_blank" href="http://localhost:5000/auth/verifyMail/${token}">verify your mail</a>`
        sendMail({email,html,subject: "Verify Email ✔"})
        const user = await userModel.create({ userName, email, password: hashPassword,mobileNumber,role })
        return res.status(201).json({ message: "Done", user })

}


export const login = async (req, res, next) => {


const { email, password } = req.body;

const user = await userModel.findOne({email:email.toLowerCase()})
if (!user) {
    return next(new ResError("In-valid Email",400)) 
}
if(!user.confirmedEmail==true)
{
    return next(new ResError("verify your email first",400)) 
}


const match = compare({ plaintext: password, hashValue: user.password })


if (!match) {
    return next(new ResError("In-valid password",400))  
}


const token =   generateToken({payload:{ id: user._id, name:user.userName, email:user.email }})
return res.status(200).json({ message: "Done", token })

}



 export const verifyMail= async(req,res,next)=>{

    const {token}= req.params
    const decoded = verifyToken(token)
    const user= await userModel.findOneAndUpdate({email:decoded.email},{confirmedEmail:true},{new:true})
   
      return user?  res.status(200).json({message:"Done"})
      :next(new ResError("In-valid mail",400))
   
 }



 //forget password controllers

 export const forgetPassword = async (req, res, next) => {

        const { email } = req.body;
        const user = await userModel.findOne({email:email.toLowerCase() });
        if (!user) {
            return next(new ResError("the email provided was not found",400))
          }
          const token = generateToken({payload:{email}})
          const html=`<a target="_blank" href="http://localhost:5000/auth/resetPassword/${token}">reset password</a>`
          sendMail({email:user.email,subject: "RESET YOUR PASSWORD",html})
        
        return res.status(200).json({message: `a link to reset your password has been sent to: ${user.email}`,});
   
}



export const saveResetPassword = async (req, res,next) => {
   
    const {  token } = req.params;
    const {newPassword,repassword}= req.body
    const decoded = verifyToken(token);
  
    const  hashPassword =hash({ plaintext: newPassword }) ;
    const user = await userModel.findOne({email:decoded.email});
  
    user.password=hashPassword
    await  user.save()
    
        return res.status(200).json({message:"Done",user})
   
    }
 