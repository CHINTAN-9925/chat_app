import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config();

const generateToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY!, {
        expiresIn: process.env.JWT_EXPIRATION_TIME
    })
}
export default generateToken;