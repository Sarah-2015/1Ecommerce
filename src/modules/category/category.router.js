import { Router } from "express";
import * as categoryController from './category.controller.js'
import subCategoryRouter from '../subcategory/subcategory.router.js'
import { fileUpload, fileValidation } from "../../utils/multer.js";
import auth from '../../middleware/auth.js'
import { endPoints } from "./category.endPoint.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
const categoryRouter = Router()

categoryRouter.get('/',asyncHandler(categoryController.getAllCategories))
categoryRouter.use('/:categoryId/subcategory',subCategoryRouter)

categoryRouter.post('/',auth(endPoints.createCategory),
fileUpload(fileValidation.image).single('image'),
categoryController.createCategory)

categoryRouter.put('/:id',auth(endPoints.updateCategory),
fileUpload(fileValidation.image).single('image'),
categoryController.updateCategory)

categoryRouter
.route('/:id')
.get(categoryController.getCategory)

.delete(categoryController.deleteCategory)

export default categoryRouter