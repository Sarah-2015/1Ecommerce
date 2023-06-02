
import couponModel from "../../../DB/model/coupon.model.js"
import { ResError } from "../../utils/ResError.js"
import cloudinary from "../../utils/cloudinary.js"


export const createCoupon =async(req,res,next)=>{

    //const {code,discount,expireDate}=req.body
    const code=req.body.code.toLowerCase()
    if(await couponModel.findOne({code})){
        return next(new ResError("Duplicated coupon code",409))
    }

    if(req.file){
        const{secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/coupon/`})
        req.body.image={secure_url,public_id}

    }
    req.body.expireDate=new Date(req.body.expireDate)
    req.body.createdBy=req.user._id
    const coupon= await couponModel.create(req.body)
    if(!coupon){
        return next(new ResError("failed to create this coupon",400))
    }

 

    return res.status(201).json({message:"success",data:coupon})

}

export const updateCoupon =async(req,res,next)=>{

    const {couponId}= req.params
    
    const coupon= await couponModel.findById(couponId)
    if(!coupon){
        return next(new ResError("invalid coupon name",400))
    }

    if(req.body.code){
        req.body.code=req.body.code.toLowerCase()
        if(coupon.code===req.body.code){
            return next(new ResError("same old code",409))
        }
        if(await couponModel.findOne({code:req.body.code})){
            return next(new ResError("Duplicated coupon code",409))
        }
        
    }
    if(req.body.expireDate){
        req.body.expireDate=new Date(req.body.expireDate)
    }

    if(req.file){
    const{secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/coupon/`})
    if(coupon.image)
        await cloudinary.uploader.destroy(coupon.image.public_id)
        req.body.image={secure_url,public_id}
    }
    req.body.updatedBy=req.user._id
    await couponModel.updateOne({_id:couponId},req.body)

   

    return res.status(200).json({message:"success",coupon})
   
}



export const getcoupon =async(req,res,next)=>{

    const {id}= req.params
    const result= await couponModel.findById(id)
    
    result ? res.json({message:"success",result}):
    next(new ResError("coupon is not found",404))
  

}



export const deletecoupon =async(req,res,next)=>{

    const {id}= req.params
    const result= await couponModel.findByIdAndDelete(id)

    result ? res.json({message:"success",result}):
    next(new ResError("coupon is not found",404))

}