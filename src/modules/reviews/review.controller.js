import orderModel from "../../../DB/model/order.model.js"
import productModel from "../../../DB/model/product.model.js"
import reviewModel from "../../../DB/model/review.model.js"
import { ResError } from "../../utils/ResError.js"

export const createReview = async(req,res,next)=>{
    const {productId}= req.params
    const{comment,rating}=req.body
    const order = await orderModel.findOne({
        userId:req.user._id,
        status:'delivered',
        'products.productId':productId

    })
    if(!order){
        return next(new ResError('can not make a review before you recieve it ',400))
    }
     
    if(await reviewModel.findOne({createdBy:req.user._id,orderId:order._id,productId})){
       return next(new ResError('already reviewed',400))
    }

     await reviewModel.create({
        comment,
        rating,
        createdBy:req.user._id,
        productId,
        orderId:order._id})
        return res.status(201).json({message:'Done'})
}

export const updateReview = async(req,res,next)=>{
    const {productId,reviewId}= req.params
    //const{comment,rating}=req.body

    await reviewModel.updateOne({productId,_id:reviewId},req.body)
      
    return res.status(200).json({message:'Done'})
}

    
