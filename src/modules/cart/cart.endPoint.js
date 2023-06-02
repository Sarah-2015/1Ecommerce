import { roles } from "../../middleware/auth.js";
export const endPoint={
    createCart:[roles.user],
    updateCart:[roles.user]
}