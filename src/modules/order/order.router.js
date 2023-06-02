import { Router } from "express";
const orderRouter = Router()
import * as orderController from './order.controller.js'
import auth from '../../middleware/auth.js'
import { endPoints } from "./order.endPoint.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";





orderRouter.post('/',auth(endPoints.createOrder), asyncHandler(orderController.createOrder))
orderRouter.patch('/orderId',auth(endPoints.createOrder), asyncHandler(orderController.cancelOrder))
orderRouter.patch('/orderId/admin',auth(endPoints.updateOrder), asyncHandler(orderController.updateOrderByAdmin))



export default orderRouter