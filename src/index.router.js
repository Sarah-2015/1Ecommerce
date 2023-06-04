import morgan from 'morgan'
import connectDB from '../DB/connection.js'
import authRouter from './modules/auth/auth.router.js'
import brandRouter from './modules/brand/brand.router.js'
import cartRouter from './modules/cart/cart.router.js'

import couponRouter from './modules/coupon/coupon.router.js'
import orderRouter from './modules/order/order.router.js'
import productRouter from './modules/product/product.router.js'
import reviewsRouter from './modules/reviews/reviews.router.js'
import userRouter from './modules/user/user.router.js'
import subCategoryRouter from './modules/subcategory/subcategory.router.js'
import { ResError } from './utils/ResError.js'
import { globalErrorHandling } from './middleware/globalErrorHandling.js'
import cors from 'cors'
import categoryRouter from './modules/category/category.router.js'




const initApp = (app, express) => {

    app.use(cors({}))
    
    //convert Buffer Data
    app.use(express.json({}))
    // HTTP Logger 
    if(process.env.MOOD='DEV')
    {
        app.use(morgan('dev'))
    }
    else{
        app.use(morgan('combined'))
    }
    
    //Setup API Routing 

    app.use(`/auth`, authRouter)
    app.use(`/user`, userRouter)
    app.use(`/product`, productRouter)
    app.use(`/category`, categoryRouter)
    app.use(`/subCategory`, subCategoryRouter)
    app.use(`/reviews`, reviewsRouter)
    app.use(`/coupon`, couponRouter)
    app.use(`/cart`, cartRouter)
    app.use(`/order`, orderRouter)
    app.use(`/brand`, brandRouter)

    app.all('*', (req, res, next) => {
        next( new ResError("In-valid Routing Plz check url  or  method",404))
    })
    //global Error Handling
    app.use(globalErrorHandling)
    process.on('unhandledRejection',(err)=>{
        console.log('unhandledRejection',err);
    })
    connectDB()

}



export default initApp