import { Schema, Types, model } from "mongoose";

const productSchema = new Schema({
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
    price:{
        type:Number,
        required:[true,'price is required'],
        min:0

    },
    discount:{
        type:Number,
        default:0

    },
    finalPrice:{
        type:Number,
        min:0

    },
    ratingAvg:{
        type:Number,
        required:true,
        min:[1,"rating average must be greater than or equal 1"],
        max:[5,"rating average mustn't be greater than 5"],
       

    },
    description:{
        type:String,
        required:true,
        minLength:[5,"too short description"],
        maxLength:[300,"too long description"],
        trim:true

    },
    colors:[String],
    sizes:{
        type:[String],
        enum:['s','m','lg','xl']
    }
    ,
    stock:{
        type:Number,
        required:true,
        min:0,
        default:0

    },
    sold:{
        type:Number,
        default:0,
        min:0
    },

    mainImage:{
        type:String,
        required:true
    },
    subImages:[String],
    review:[{type:Types.ObjectId,ref:'review',}]
,
    category:{
        type:Types.ObjectId,
        ref:'category',
        required:true
    },
    subcategory:{
        type:Types.ObjectId,
        ref:'subCategory',
        required:true
    },
    brand:{
        type:Types.ObjectId,
        ref:'brand',
        required:true
    },
    createdBy:{
        type:Types.ObjectId,
        ref:"user",
        required:true
    },
    updatedBy:{
        type:Types.ObjectId,
        ref:"user",
       
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
},{
    timestamps: true
})

const productModel= model('product',productSchema)

export default productModel