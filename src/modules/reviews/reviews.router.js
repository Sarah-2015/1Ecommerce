import { Router } from "express";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import * as reviewController from './review.controller.js'
import { validation } from "../../middleware/validation.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import * as validators from './reviews.validation.js'
import auth from '../../middleware/auth.js'
import { endPoints } from "./reviews.endPoint.js";

const reviewRouter = Router({mergeParams:true})

reviewRouter.post('/',auth(endPoints.createProduct),asyncHandler(reviewController.createReview))
reviewRouter.put('/reviewId',auth(endPoints.updateProduct),asyncHandler(reviewController.createReview))



export default reviewRouter