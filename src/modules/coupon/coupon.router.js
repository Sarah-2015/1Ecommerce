import { Router } from "express";
import * as couponController from './coupon.controller.js'
import { fileUpload, fileValidation } from "../../utils/multer.js";
import auth from '../../middleware/auth.js'
import { endPoints } from "./coupon.endPoint.js";

const couponRouter = Router()



couponRouter.post('/',auth(endPoints.createCoupon),
fileUpload(fileValidation.image).single('image'),
couponController.createCoupon)

couponRouter.put('/:couponId',auth(endPoints.updatecoupon),
fileUpload(fileValidation.image).single('image'),
couponController.updateCoupon)



.delete(couponController.deletecoupon)

export default couponRouter