import { Schema, Types, model } from "mongoose";

const cartSchema = new Schema({
    createdBy:{
        type:Types.ObjectId,
        ref:'user',
        required:true,
        unique:true
    },
    products:[{
    productId:{type:Types.ObjectId,ref:'product',required:true},
    quantity:{type:Number,default:1,required:true}
    }
],
  isDeleted:{
    type:Boolean,
    default:false
  }
},{
    timestamps: true
})

const cartModel= model('cart',cartSchema)


export default cartModel