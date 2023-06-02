import { roles } from "../../middleware/auth.js";

export const endPoints= {

    createProduct:[roles.admin],
    updateProduct:[roles.admin],
    wishlist:[roles.user]
}