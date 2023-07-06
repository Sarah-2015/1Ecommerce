import { Schema, Types, model } from "mongoose";

const subCategorySchema = new Schema({
    name:{
        type:String,
        unique:true,
        trim:true,
        required:true,

    },
    slug:{
        type:String,
        lowercase:true,
        required:true

    },
    image:{type:Object,required:true},
    categoryId:{
        type:Types.ObjectId,
        ref:'category'
    },
    createdBy:{
        type:Types.ObjectId,
        ref:"user",
        required:false
    }
},{
    timestamps: true
})

const subCategoryModel= model('subCategory',subCategorySchema)

export default subCategoryModel