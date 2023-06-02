import { Schema, Types, model } from "mongoose";

const orderSchema = new Schema({
    userId:{type:Types.ObjectId,ref:'user',required:true},
    updatedBy:{type:Types.ObjectId,ref:'user',required:true},
    address:{type:String,required:true},
    phone:[{type:String,required:true}],
    note:String,
    products:[{
    name:{type:String,required:true},
    productId:{type:Types.ObjectId,ref:'product',required:true},
    quantity:{type:Number,default:1,required:true},
    itemPrice:{type:Number,default:1,required:true},
    finalPrice:{type:Number,default:1,required:true}
    }
],
subtotal:{type:Number,default:1,required:true},
coupon:{type:Types.ObjectId,ref:'coupon',required:true,},
totalPrice:{type:Types.ObjectId,ref:'coupon',required:true,},
paymentType:{
    type:String,
    enum:['cash','card'],
    default:'cash'
},
status:{
    type:String,
    enum:['placed','onWay','waitingPayment','rejected','canceled','delivered'],
    default:'placed'
},
cancellationReason:String
},{
    timestamps: true
})

const orderModel= model('order',orderSchema)


export default orderModel