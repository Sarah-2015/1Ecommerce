export const asyncHandler=(controller)=>{

    return (req,res,next)=>{
        try {
            controller(req,res,next)

        
        } catch (error) {
            return next(error)
        }
    }

}