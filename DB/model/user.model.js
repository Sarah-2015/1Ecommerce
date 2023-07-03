import { Schema, Types, model } from "mongoose";


const userSchema = new Schema({

    userName: {
        type: String,
        required: [true, 'userName is required'],
        min: [2, 'minimum length 2 char'],
        max: [20, 'max length 20 char'],
        lowercase:true

    },
    email: {
        type: String,
        unique: [true, 'email must be unique value'],
        required: [true, 'email is required'],
        lowercase:true
    },
    password: {
        type: String,
        required: [true, 'password is required'],
        min: [8, 'minimum length 8 char'],
    },
    phone: {
        type: String,
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin']
    },

    isActive: {
        type: Boolean,
        default: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },

    profilePic: String,
    forgetPasswordCode:{
        type:Number,
        default:null
    },
    changePasswordTime:Date,
    wishlist:[{type:Types.ObjectId,ref:'product'}]

 
}, {
    timestamps: true
})


const userModel = model('User', userSchema)
export default userModel