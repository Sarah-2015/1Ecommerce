import { roles } from "../../middleware/auth.js";

export const endPoints= {

    createBrand:[roles.admin],
    updateBrand:[roles.admin],
   
}