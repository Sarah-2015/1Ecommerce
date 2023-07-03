import {Router} from 'express'
import { validation } from '../../middleware/validation.js';

import { forgetPasswordSchema, loginSchema, resetPasswordSchema, signupSchema } from './auth.validation.js';
import * as authController from  './auth.controller.js'
import { asyncHandler } from '../../middleware/asyncHandler.js';

const authRouter = Router();

authRouter.post('/signup' ,validation(signupSchema),asyncHandler(authController.signup))
authRouter.post('/login' ,validation(loginSchema),asyncHandler(authController.login))

//forget password
authRouter.patch('/forgetPassword',validation(forgetPasswordSchema),asyncHandler(authController.forgetPassword) )
authRouter.put("/resetPassword",  asyncHandler(authController.saveResetPassword));
authRouter.get('/verifyMail/:token' ,asyncHandler(authController.verifyMail))
authRouter.get('/reVerifyMail/:refToken', asyncHandler(authController.reVerifyMail))



export default  authRouter