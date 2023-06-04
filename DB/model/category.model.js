import { Schema, Types, model } from "mongoose";

const categorySchema = new Schema({
    name:{
        type:String,
        unique:[true,'name is already existed'],
        trim:true,
        required:true,
    },
    slug:{
        type:String,
        lowercase:true,
        required:true

    },
    image:{type:Object,required:true},
    createdBy:{
        type:Types.ObjectId,
        ref:"user",
        required:false
    }
},{
    timestamps: true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})

categorySchema.virtual('subcategory',{
    localField:"_id",
    foreignField:"categoryId",
    ref:"subCategory"
})

const categoryModel= model('category',categorySchema)

export default categoryModel