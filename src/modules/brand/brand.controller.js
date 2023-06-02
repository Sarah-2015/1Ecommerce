import slugify from "slugify"
import brandModel from "../../../DB/model/brand.model.js"
import { ResError } from "../../utils/ResError.js"
import cloudinary from "../../utils/cloudinary.js"


export const createBrand =async(req,res,next)=>{

    const {name}= req.body
    if(await brandModel.findOne({name:name.toLowerCase()})){
        return next(new ResError("Duplicated brand",409))

    }
    const{secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/brand/`})
    const brand= await brandModel.create({
        name,
        slug:slugify(name),
        image:{secure_url,public_id},
        //createdBy:req.user._id
    })

    if(!brand){
        await cloudinary.uploader.destroy(public_id)
        return next(new ResError("failed to create this brand",400))
    }
 

    res.json({message:"success",brand})

}

export const updateBrand =async(req,res,next)=>{

    const {brandId}= req.params
    const {name}=req.body
    const brand= await brandModel.findById(brandId)
    if(!brand){
        return next(new ResError("invalid brand name",400))
    }

    if(req.body.name){
        req.body.name=req.body.name.toLowerCase()
        if(req.body.name==brand.name){
            return next(new ResError("old name brand",400))
    
        }

        if(await brandModel.findOne({name:req.body.name})){
            return next(new ResError("Duplicated brand",409))
    
        }
        brand.name=name
        brand.slug=slugify(name)

    }

    if(req.file){
    const{secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/brand/`})
    if(brand.image){
        await cloudinary.uploader.destroy(brand.image.public_id)
        brand.image={secure_url,public_id}
    }

    }
    brand.updatedBy=req.user._id
    await brand.save()
    return res.status(200).json({message:"success",brand})
   
}

export const getAllBrands =async(req,res,next)=>{

    const result= await brandModel.find({isDeleted:false})
   
    res.json({message:"success",result})

}

export const getbrand =async(req,res,next)=>{

    const {id}= req.params
    const result= await brandModel.findById(id)
    
    result ? res.json({message:"success",result}):
    next(new ResError("brand is not found",404))
  

}



export const deletebrand =async(req,res,next)=>{

    const {id}= req.params
    const result= await brandModel.findByIdAndDelete(id)

    result ? res.json({message:"success",result}):
    next(new ResError("brand is not found",404))

}