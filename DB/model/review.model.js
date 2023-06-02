
import { Schema, Types, model } from "mongoose";

const reviewSchema = new Schema({
    comment:{
        type:String,
        trim:true,
        required:true,
    },
    rating:{
        type:Number,
        max:5,
        min:1,
        required:true

    },
    createdBy:{
        type:Types.ObjectId,
        ref:"user",
        required:true
    },
    productId:{
        type:Types.ObjectId,
        ref:"product",
        required:true
    },
    orderId:{
        type:Types.ObjectId,
        ref:"order",
        required:true
    },
   
    
},{
    timestamps: true
})

const reviewModel= model('review',reviewSchema)

export default reviewModel