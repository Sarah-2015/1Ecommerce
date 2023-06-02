import { Router } from "express";
import * as subCategoryController from './subcategory.controller.js'
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import auth from '../../middleware/auth.js'



const subCategoryRouter = Router({mergeParams:true})



subCategoryRouter.get('/',asyncHandler(subCategoryController.getAllSubCategories))

subCategoryRouter.post('/',auth(),
fileUpload(fileValidation.image).single('image'),
asyncHandler(subCategoryController.createSubCategory))

subCategoryRouter.put('/:subcategoryId',auth(),
fileUpload(fileValidation.image).single('image'),
asyncHandler(subCategoryController.updateSubCategory))


subCategoryRouter
.route('/:id')
.get(asyncHandler(subCategoryController.getSubCategory))
.put(asyncHandler(subCategoryController.updateSubCategory))
.delete(asyncHandler(subCategoryController.deleteSubCategory))

export default subCategoryRouter