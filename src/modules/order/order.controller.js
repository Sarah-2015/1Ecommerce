import cartModel from "../../../DB/model/cart.model.js"
import productModel from "../../../DB/model/product.model.js"
import couponModel from "../../../DB/model/coupon.model.js"
import orderModel from "../../../DB/model/order.model.js"
import { ResError } from "../../utils/ResError.js"
import { createInvoice } from "../../utils/pdf.js"
import sendEmail from "../../utils/email.js"

 export const createOrder=async (req,res,next)=>{
    const {couponCode,address,phone,note,paymentType}=req.body

    const cart= await cartModel.findOne({createdBy:req.user._id})
    if(!cart?.req.body.products?.length){
        return next(new ResError("empty cart  ",400))
    }
    req.body.req.body.products=cart.req.body.products

    const coupon= await couponModel.findOne({code:couponCode.toLowerCase(),usedBy:{$nin:req.user._id}})
    if(!coupon || coupon.expire.getTime()<Date.now()){
        return next(new ResError("invalid coupon or expired ",400))
    }
    req.body.coupon=coupon

    const finalProductList=[]
    let subtotal=0
    const productIds=[]


  req.body.products.forEach(async product => {
    const checkedProduct= await productModel.findOne({
        _id:product.productId,
        stock:{$gte:product.quantity},
        isDeleted:false

        
    })
    if(!checkedProduct){
        return next(new ResError(`invalid product with id ${product.productId}`,400))
    }
    product= product.toObject()
    product.name= checkedProduct.name
    product.itemPrice=checkedProduct.finalPrice
    product.totalPrice=checkedProduct.finalPrice.toFixed(2) * product.quantity
    finalProductList.push(product)
    subtotal+=product.totalPrice

  });
 const order= await orderModel.create({
    userId:req.user._id,
    address,
    phone,
    note,
    products:finalProductList,
    paymentType,
    status:paymentType=='card'?'waitingPayment':'placed',
    subtotal,
    coupon:req.body.coupon._id,
    totalPrice:subtotal-(subtotal* ((req.body.coupon?.discount ||0)/100)).toFixed(2)
 })

 //decrease stock

 req.body.products.forEach(async product => {
     await productModel.updateOne({ _id:product.productId},{$inc:{stock:-parseInt(product.quantity)}})
   });

   //push userid in coupon usedby

   if(req.body.coupon){
    await couponModel.updateOne({_id:req.body.coupon._id},{ $addToSet: { usedBy:req.user._id } })
}

//clear from cart

await cartModel.updateOne({createdBy:req.user._id},{products:[]})

//generate invoice pdf


const invoice = {
  shipping: {
    name: req.user.userName,
    address:order.address,
    city: "Cairo",
    state: "Cairo",
    country: "Egypt",
    postal_code: 94111
  },
  items:order.products,
  subtotal:subtotal,
  total: order.totalPrice,
  invoice_nr: order._id,
  date:order.createdAt
};

 await createInvoice(invoice, "invoice.pdf");

 //sendEmail
 await sendEmail({to:user.email, subject:'Invoice',attachments:[
    {
        path:"invoice.pdf",
        contentType:"application/pdf"
    }
 ]})



 return res.status(201).json({message:'done',data:order})

}




export const cancelOrder = async(req,res,next)=>{

    const orderId=req.params
    const {cancellationReason}=req.body
    const order= await orderModel.findOne({_id:orderId,userId:req.user._id})
    if((!order?.status !='placed'&& order.paymentType=='cach')||(!order?.status !='waitPayment'&& order.paymentType=='card')){
        return next(new ResError(`can't cancel your order after it has been changed to ${order.status} `,400))
    }
   const cancelOrder= await orderModel.updateOne({_id:orderId},{status:'canceled',cancellationReason,updatedBy:req.user._id})
   if(!cancelOrder.matchedCount){
    return next(new ResError(`fail to cancel your order`,400))
   }

   //increase product stock
   order.products.forEach(async product => {
    await productModel.updateOne({ _id:product.productId},{$inc:{stock:parseInt(product.quantity)}})
  });

  if(order.coupon){
    await couponModel.updateOne({_id:order.coupon._id},{ $pull: { usedBy:req.user._id } })
}

return res.status(200).json({message:'done'})

}

export const updateOrderByAdmin = async(req,res,next)=>{

    const orderId=req.params
    const {status}=req.body
    const order= await orderModel.findOne({_id:orderId})
    if((!order?.status !='delivered'&& order.paymentType=='cach')||(!order?.status !='waitPayment'&& order.paymentType=='card')){
        return next(new ResError(`can't cancel your order after it has been changed to ${order.status} `,400))
    }
   const updatedOrder= await orderModel.updateOne({_id:orderId},{status})
   if(!updatedOrder.matchedCount){
    return next(new ResError(`fail to cancel your order`,400))
   }

    return res.status(200).json({message:'done'})

}