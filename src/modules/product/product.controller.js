import slugify from "slugify"
import brandModel from "../../../DB/model/brand.model.js"
import subCategoryModel from "../../../DB/model/subcategory.model.js"
import { ResError } from "../../utils/ResError.js"
import productModel from "../../../DB/model/product.model.js"
import cloudinary from "../../utils/cloudinary.js"
import { nanoid } from "nanoid"
import { paginate } from "../../utils/paginate.js"
import userModel from "../../../DB/model/user.model.js"
import ApiFeatures from "../../utils/ApiFeatures.js"



export const createProduct =async(req,res,next)=>{
    const {name,category,brand,subcategory,price,discount}= req.body

    if(! await subCategoryModel.findOne({_id:subcategory,category}))
    {
       return next(new ResError('invalid subcategory id',400))
    }
    if(! await brandModel.findOne({_id:brand}))
    {
       return next(new ResError('invalid brand id',400))
    }

    req.body.slug= slugify(name)
    req.body.finalPrice=Number.parseFloat(price- price*((discount || 0) /100)).toFixed(2)
     req.body.customId=nanoid()
    
    const {secure_url,public_id}= await cloudinary.uploader.upload(req.files.mainImage[0].path,{folder:`${process.env.APP_NAME}/product/${req.body.customId}`})
    req.body.mainImage={secure_url,public_id}

    if(req.files?.subImages?.length)
    {
        req.body.subImages=[]
        for (const image of req.files.subImages) {

            const {secure_url,public_id}= await cloudinary.uploader.upload(image.path,{folder:`${process.env.APP_NAME}/product/${req.body.customId}/subImages`})

            req.body.subImages.push({secure_url,public_id})
        }
    }
   req.body.createdBy= req.user._id

    const product=  await productModel.create(req.body)
   

   return res.status(201).json({message:'success',product})

}

export const updateProduct =async(req,res,next)=>{
    const {id}= req.params
    const {name,category,brand,subcategory,price,discount}= req.body
    const product= await productModel.findById(id)

    if(!product)
    {
       return next(new ResError('invalid product id',400))
    }
    if(category&&subcategory){
        if(! await subCategoryModel.findOne({_id:subcategory,category}))
        {
           return next(new ResError('invalid subcategory id',400))
        }

    }
   if(brand)
   {
    if(! await brandModel.findOne({_id:brand}))
    {
       return next(new ResError('invalid brand id',400))
    }
   }
   if(name){
    req.body.slug= slugify(name)
   }
   if(price&&discount)
   {
    req.body.finalPrice=Number.parseFloat(price- price*((discount) /100)).toFixed(2)
   }
   else if(price){
    req.body.finalPrice=Number.parseFloat(price- price*((product.discount || 0) /100)).toFixed(2)
   }
   else if(discount){
    req.body.finalPrice=Number.parseFloat(product.price- product.price*((discount) /100)).toFixed(2)
   }

    if(req.files?.mainImage?.length)
    {
        const {secure_url,public_id}= await cloudinary.uploader.upload(req.files.mainImage[0].path,{folder:`${process.env.APP_NAME}/product/${product.customId}`})
        await cloudinary.uploader.destroy(product.mainImage.public_id)
        req.body.mainImage={secure_url,public_id}
    }
    
    if(req.files?.subImages?.length)
    {
        req.body.subImages=[]
        for (const image of req.files.subImages) {

            const {secure_url,public_id}= await cloudinary.uploader.upload(image.path,{folder:`${process.env.APP_NAME}/product/${req.body.customId}/subImages`})

            req.body.subImages.push({secure_url,public_id})

            //product.subImages.push({secure_url,public_id})
            //req.body.subImages= product.subImages
        }
    }
   req.body.updatedBy= req.user._id

    
   await productModel.updateOne({_id:id},req.body)

   return res.status(201).json({message:'success',product})

}

export const getAllProducts =async(req,res,next)=>{
 


  const apiFeatures= new ApiFeatures(productModel.find().populate([
    {
        path:'review'
    }
])
,req.query).paginate().sort().search().select()
  const products = await apiFeatures.mongooseQuery
  
   

for (let i = 0; i < products.length; i++) {
    let calcRating=0
    for (let j = 0; j < products[i].review.length; j++) {
        calcRating += products[i].review[j].rating; 
    }
    let ratingAvg= calcRating/products[i].review.length
    const product = products[i].toObject()
    product.ratingAvg=ratingAvg
    products[i]=product
    
}
   

   return res.status(200).json({message:'success', page,products})

}


//Add to wishlist
export const AddToWishList =async(req,res,next)=>{

    if(!await productModel.findById(req.params.productId))
    {
        return next(new ResError('invalid product id',400))
    }
    await userModel.updateOne({_id:req.user._id},{$addToSet:{wishlist:req.params.productId}})

  
  
     return res.status(200).json({message:'success'})
  
  }
  //remove from wishlist

  export const removeFromWishList =async(req,res,next)=>{

    if(!await productModel.findById(req.params.productId))
    {
        return next(new ResError('invalid product id',400))
    }
    await userModel.updateOne({_id:req.user._id},{$pull:{wishlist:req.params.productId}})

  
  
     return res.status(200).json({message:'success'})
  
  }
