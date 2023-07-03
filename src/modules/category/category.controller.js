import slugify from "slugify"
import categoryModel from "../../../DB/model/category.model.js"
import { ResError } from "../../utils/ResError.js"
import cloudinary from "../../utils/cloudinary.js"


export const createCategory =async(req,res,next)=>{

    const {name}= req.body
    const{public_id,secure_url}=await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/Category`})
    const category= await categoryModel.create({
        name,
        slug:slugify(name),
        image:{secure_url,public_id},
        createdBy:req.user._id
    })
    if(!category){
        await cloudinary.uploader.destroy(public_id)
        return next(new ResError("failed to create this category",400))
    }
 

    res.json({message:"Done",category})

}

export const updateCategory =async(req,res,next)=>{

    const {id}= req.params
    const {name}=req.body
    const category= await categoryModel.findById(id)
    if(!category){
        return next(new ResError("invalid category name",400))
    }

    if(req.body.name){
        category.name=name
        category.slug=slugify(name)

    }

    if(req.file){
    const{secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/Category/`})
        await cloudinary.uploader.destroy(category.image.public_id)
        category.image={secure_url,public_id}
    }
    await category.save()

   

    return res.status(200).json({message:"success",category})
   
}

export const getAllCategories =async(req,res,next)=>{

    const categories= await categoryModel.find().populate([{
       path: "subcategory"
    }])
   
    res.json({message:"Done",data:categories})

}

export const getCategory =async(req,res,next)=>{

    const {id}= req.params
    const result= await categoryModel.findById(id)
    
    result ? res.json({message:"success",result}):
    next(new ResError("category is not found",404))
  

}
export const deleteCategory =async(req,res,next)=>{

    const {id}= req.params
    const result= await categoryModel.findByIdAndDelete(id)

    result ? res.json({message:"success",result}):
    next(new ResError("category is not found",404))

}