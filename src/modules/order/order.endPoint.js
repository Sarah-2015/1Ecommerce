import { roles } from "../../middleware/auth.js";

export const endPoints= {

    createOrder:[roles.user],
    updateOrder:[roles.admin]
}