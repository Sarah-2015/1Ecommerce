import { Router } from "express";
import * as brandController from './brand.controller.js'
import { fileUpload, fileValidation } from "../../utils/multer.js";
import auth from '../../middleware/auth.js'
import { endPoints } from "./brand.endPoint.js";

const brandRouter = Router()

brandRouter.get('/',auth(),brandController.getAllBrands)

brandRouter.post('/',auth(endPoints.createBrand),
fileUpload(fileValidation.image).single('image'),
brandController.createBrand)

brandRouter.put('/:brandId',auth(endPoints.updatebrand),
fileUpload(fileValidation.image).single('image'),
brandController.updateBrand)
brandRouter.delete('/:id',auth(endPoints.createBrand),brandController.deletebrand)

export default brandRouter