import {Router} from 'express'
import { validation } from '../../middleware/validation.js';

import { forgetPasswordSchema, loginSchema, resetPasswordSchema, signupSchema } from './auth.validation.js';
import * as authController from  './registration.js'
import { asyncHandler } from '../../middleware/asyncHandler.js';

const authRouter = Router();

authRouter.post('/signup' ,validation(signupSchema),asyncHandler(authController.signup))
authRouter.post('/login' ,validation(loginSchema),asyncHandler(authController.login))

//forget password
authRouter.post('/forgetPassword',validation(forgetPasswordSchema),asyncHandler(authController.forgetPassword) )
authRouter.post("/resetPassword/:token",  asyncHandler(authController.saveResetPassword));
authRouter.get('/verifyMail/:token' ,asyncHandler(authController.verifyMail))



export default  authRouter