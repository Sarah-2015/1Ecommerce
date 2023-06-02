import jwt from "jsonwebtoken";
import userModel from "../../DB/model/user.model.js";
import { asyncHandler } from "./asyncHandler.js";

 export const roles={
    admin:'admin',
    user:'user'
}

const auth = (roles=[])=>{
    return asyncHandler( async (req, res, next) => {
        try {
            const { authorization } = req.headers;
           
            if (!authorization?.startsWith(process.env.BEARER_KEY)) {
                return res.json({ message: "In-valid bearer key" })
            }
            const token = authorization.split(process.env.BEARER_KEY)[1]
          
            if (!token) {
                return res.json({ message: "In-valid token" })
            }
    
            const decoded = jwt.verify(token, process.env.TOKEN_SIGNATURE)
            if (!decoded?.id) {
                return res.json({ message: "In-valid token payload" })
            }
            const user = await userModel.findById(decoded.id).select('userName email role')
            if (!user) {
                return res.json({ message: "Not register account" })
            }
            if(!roles.includes(user.role))
            req.user = user;
            return next()
        } catch (error) {
            return res.json({ message: "Catch error" , err:error?.message })
        }
    })
}

export default auth