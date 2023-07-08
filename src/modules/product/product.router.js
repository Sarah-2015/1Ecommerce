import { Router } from "express";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import * as productController from './product.controller.js'
import { validation } from "../../middleware/validation.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import * as validators from './product.validation.js'
import auth from '../../middleware/auth.js'
import { endPoints } from "./product.endPoint.js";
import reviewRouter from "../reviews/reviews.router.js";

const productRouter = Router()

productRouter.get('/',asyncHandler(productController.getAllProducts))
productRouter.get('/:subcategory',asyncHandler(productController.getProducts))

productRouter.post('productId/review',reviewRouter)

productRouter.post('/',auth(endPoints.createProduct) , fileUpload(fileValidation.image).fields(
    [
        {name:'mainImage',maxCount:1},
        {name:'subImages',maxCount:5}
    ]
),asyncHandler(productController.createProduct) )

productRouter.put('/:id',auth(endPoints.createProduct) , fileUpload(fileValidation.image).fields(
    [
        {name:'mainImage',maxCount:1},
        {name:'subImages',maxCount:5}
    ]
),asyncHandler(productController.updateProduct) )

productRouter.patch('/:productId/wishlist',auth(endPoints.updateProduct),asyncHandler(productController.AddToWishList))
productRouter.patch('/:productId/wishlist/remove',auth(endPoints.wishlist),asyncHandler(productController.removeFromWishList))




export default productRouter