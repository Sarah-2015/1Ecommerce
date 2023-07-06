import { Router } from "express";
import * as subCategoryController from './subcategory.controller.js'
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import auth from '../../middleware/auth.js'
import { endPoints } from "./subcategory.endPoint.js";



const subCategoryRouter = Router({mergeParams:true})



subCategoryRouter.get('/',asyncHandler(subCategoryController.getAllSubCategories))

subCategoryRouter.post('/',auth(endPoints.createSubCategory),
fileUpload(fileValidation.image).single('image'),
asyncHandler(subCategoryController.createSubCategory))

subCategoryRouter.put('/:subcategoryId',auth(endPoints.updateSubCategory),
fileUpload(fileValidation.image).single('image'),
asyncHandler(subCategoryController.updateSubCategory))


subCategoryRouter
.route('/:id')
.get(asyncHandler(subCategoryController.getSubCategory))
.put(asyncHandler(subCategoryController.updateSubCategory))
.delete(asyncHandler(subCategoryController.deleteSubCategory))

export default subCategoryRouter