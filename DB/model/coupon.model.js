
import { Schema, Types, model } from "mongoose";

const couponSchema = new Schema({
    code:{
        type:String,
        trim:true,
        required:true,
        unique:true
    },
    discount:{
        type:Number,
        min:1,
        required:true

    },
    expireDate:{
        type:Date,
        required:true
       
    },
    image:Object,
    createdBy:{
        type:Types.ObjectId,
        ref:"user",
        required:false
    },
    createdBy:{
        type:Types.ObjectId,
        ref:"user",
        required:false
    },
    updatedBy:{
        type:Types.ObjectId,
        ref:"user",
        required:false
    },
    usedBy:[{type:Types.ObjectId,ref:'user'}],
    isDeleted:{type:Boolean,default:false}
    
   
    
},{
    timestamps: true
})

const couponModel= model('coupon',couponSchema)

export default couponModel