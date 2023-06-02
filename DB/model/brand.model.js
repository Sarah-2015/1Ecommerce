
import { Schema, model ,Types} from "mongoose";

const brandSchema = new Schema({
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
    image:Object,
    createdBy:{
        type:Types.ObjectId,
        ref:"user",
        required:false
    },
    updatedBy:{
        type:Types.ObjectId,
        ref:"user",
       
    },
    isDeleted:{type:Boolean,default:false}
},{
    timestamps: true
})

const brandModel= model('brand',brandSchema)

export default brandModel