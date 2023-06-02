
export const globalErrorHandling = (err,req,res,next)=>{
    let code= err.statusCode || 500
   return res.status(code).json({message:err.message, statusCode:code})
}