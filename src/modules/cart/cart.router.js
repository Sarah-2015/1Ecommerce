import { Router } from "express";
import * as cartController from './cart.controller.js'
import { asyncHandler } from "../../middleware/asyncHandler.js";
import auth from '../../middleware/auth.js'
import { endPoint } from "./cart.endPoint.js";
const cartRouter = Router()




cartRouter.post('/',
auth(endPoint.createCart),
asyncHandler(cartController.addToCart) )

cartRouter.patch('/remove',
auth(endPoint.createCart),
asyncHandler(cartController.removeItemsFromCart) )





export default cartRouter