import jwt from 'jsonwebtoken'

export const generateToken = ({payload={},signature= process.env.TOKEN_SIGNATURE}={})=>{
const token= jwt.sign(payload,signature,{ expiresIn: 60 * 60 })
return token;

}

export const verifyToken = (token,signature=process.env.TOKEN_SIGNATURE)=>{
    const decoded = jwt.verify(token,signature)
    return decoded;
}