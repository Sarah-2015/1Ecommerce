import { roles } from "../../middleware/auth.js";

export const endPoints= {

    createCoupon:[roles.admin],
    updateCoupon:[roles.admin],
   
}