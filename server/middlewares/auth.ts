import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import User from "../models/userModels";


export interface AuthenticatedRequest extends Request {
    user?: any;
}
export const validateUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {

            token = req.headers.authorization.split(" ")[1];
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET_KEY!);
            req.user = await User.findById(decoded.id).select("-password");
            next();

        } catch (error) {
            return res.status(401).json({
                message: "Not authorized, token failed",
                status: 401,
            });
        }
    }

    if (!token) {
        return res.status(401).json({
            message: "Not authorized, no token",
            status: 401,
        })
    }
};
