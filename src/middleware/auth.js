import jwt from "jsonwebtoken";
import userModel from "../../DB/model/user.model.js";
import { asyncHandler } from "./asyncHandler.js";
import { ResError } from "../utils/ResError.js";

 export const roles={
    admin:'admin',
    user:'user'
}

const auth = (roles=[]) => {
    return asyncHandler( async (req, res, next) => {
        
            const { authorization } = req.headers;
           
            if (!authorization?.startsWith(process.env.BEARER_KEY)) {
                return next(new ResError("In-valid bearer key",400)) 
            }
            const token = authorization.split(process.env.BEARER_KEY)[1]
          
            if (!token) {
                return next(new ResError("In-valid token",400)) 
            }
    
            const decoded = jwt.verify(token, process.env.TOKEN_SIGNATURE)
            if (!decoded?.id) {
                return next(new ResError("In-valid token payload",400)) 
            }

            const user = await userModel.findById(decoded.id).select('userName email role _id ')
            if (!user) {
                return next(new ResError("Not registered account",401)) 
            }
            if(parseInt(user.changePasswordTime?.getTime()/1000) > decoded.iat){
                return next(new ResError("Expired Token",403))

            }

            if(!roles.includes(user.role)){
                return next(new ResError("Not authorized account",403))
            }
            req.user = user;
            return next()
        
    })
}

export default auth