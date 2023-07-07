import slugify from "slugify"
import { ResError } from "../../utils/ResError.js"
import subCategoryModel from "../../../DB/model/subcategory.model.js"
import categoryModel from "../../../DB/model/category.model.js"
import cloudinary from "../../utils/cloudinary.js"


export const createSubCategory =async(req,res,next)=>{
    const {categoryId}=req.params
    const category= await categoryModel.findById(categoryId)
    if(!category){
        return next(new ResError("invalid category id",400))
    }

    const {name}= req.body
    const{secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/Category/${categoryId}`})
    const subCategory = await subCategoryModel.create({name,slug:slugify(name),image:{secure_url,public_id},categoryId})
    if(!subCategory){
        await cloudinary.uploader.destroy(public_id)
        return next(new ResError("failed to create this subcategory",400))
    }

    res.json({message:"success",subCategory})

}
export const updateSubCategory =async(req,res,next)=>{

    const {categoryId,subcategoryId}= req.params
    const {name,category}=req.body
    const subcategory= await subCategoryModel.findOne({_id:subcategoryId,categoryId})
    if(!subcategory){
        return next(new ResError("invalid subcategory id",400))
    }

    if(req.body.name){
        subcategory.name=req.body.name
        subcategory.slug=slugify(name)
    }

    if(req.file){
        const{secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/Category/${categoryId}`})
        await cloudinary.uploader.destroy(subcategory.image.public_id)
        subcategory.image={secure_url,public_id}

    }
    await subcategory.save()

  return res.status(200).json({message:"success",data:subcategory})
   
}

export const getAllSubCategories =async(req,res,next)=>{

   
        const subCategories= await subCategoryModel.find().populate([{
            path:"categoryId"
        }])
       
      return  res.status(200).json({message:"success",data:subCategories})
        
    
    

}

export const getSubCategory =async(req,res,next)=>{

    const {id}= req.params
    const result= await subCategoryModel.find({category:id})
    
    result ? res.json({message:"success",result}):
    next(new ResError("subcategory is not found",404))
  

}



export const deleteSubCategory =async(req,res,next)=>{

    const {id}= req.params
    const result= await subCategoryModel.findByIdAndDelete(id)

    result ? res.json({message:"success",result}):
    next(new ResError("subcategory is not found",404))

}