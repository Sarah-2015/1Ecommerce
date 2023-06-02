import { roles } from "../../middleware/auth.js";

export const endPoints= {

    createProduct:[roles.user],
    updateProduct:[roles.user]
}