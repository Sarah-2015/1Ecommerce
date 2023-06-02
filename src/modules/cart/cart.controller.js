import cartModel from "../../../DB/model/cart.model.js"
import productModel from "../../../DB/model/product.model.js"
import { ResError } from "../../utils/ResError.js"

export const addToCart= async(req,res,next)=>{
    const {productId,quantity}=req.body
    const product=await productModel.findById(productId)
    if(!product){
        return next(new ResError("invalid product id ",400))
    }
    if(quantity>product.stock){
        return next(new ResError("invalid quantity ",400))
    }

    //check cart exist
    const cart= await cartModel.findOne({createdBy:req.user._id})
    if(!cart){
        const newCart= await cartModel.create({createdBy:req.user._id,products:[{productId,quantity}]})
        return res.status(201).json({message:'success',newCart})
    }
    //update cart
    let matchProduct=false
    for (let i = 0; i < cart.products.length; i++) {
        if(cart.products[i].productId.toString()==productId){
            cart.products[i].quantity=quantity
            matchProduct=true
            break
        }
        
    }

    //push to cart
    if(!matchProduct)
    {
        cart.products.push({productId,quantity})
    }

    await cart.save()
    return res.status(200).json({message:'done',cart})
    

}
export const removeSelectedItems= async(req,res,next)=>{
    const {productIds}=req.body
    
    const cart =  await cartModel.updateOne({createdBy:req.user._id},
        {
        products:{
            $pull:{$in:{productIds}}
}
})
    return res.status(200).json({message:'done',cart})
}

export const clearCart= async(req,res,next)=>{
    
    await cartModel.updateOne({createdBy:req.user._id},{products:[]})
    return res.status(200).json({message:'done'})
    

}
