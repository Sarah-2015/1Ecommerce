import { roles } from "../../middleware/auth.js";

export const endPoints= {

    createCategory:[roles.admin],
    updateCategory:[roles.admin]
}