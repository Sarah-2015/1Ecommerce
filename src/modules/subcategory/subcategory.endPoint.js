import { roles } from "../../middleware/auth.js";

export const endPoints= {

    createSubCategory:[roles.admin],
    updateSubCategory:[roles.admin]
}