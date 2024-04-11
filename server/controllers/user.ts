import { Request, Response } from "express";
import env from "dotenv";
import User from "../models/userModels";
import generateToken from "../config/generateToken";
import { AuthenticatedRequest } from "../middlewares/auth";

env.config();

//@description     Get or Search all users
//@route           GET /api/user?search=
//@access          Public
export const allUsers = async (req: AuthenticatedRequest, res: Response) => {
    const keyword = req.query.search
        ? {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } },
            ],
        }
        : {};

    try {
        const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
        console.log("into allusers")
        return res.status(200).json({
            message: "user data fetched successfully",
            status: 200,
            data: users,
        });
    } catch (error: any) {
        return res.json({
            message: error.message,
            status: 500,
        });
    }
};

//@description     Register new user
//@route           POST /api/user/
//@access          Public
// export const register = async (req: AuthenticatedRequest, res: Response) => {
//     const { name, email, password, pic} = req.body;
//     console.log(name, email, password, pic);
//     if (!name || !email || !password) {
//         return res.json({
//             message: "plaese enter all the required fields",
//             status: 400,
//         });
//     }

//     try {
//         const userExists = await User.findOne({ email });

//         if (userExists) {
//             return res.json({
//                 message: "user already exists",
//                 status: 409,
//             });
//         }

//         const user: any = await User.create({
//             name,
//             email,
//             password,
//             pic,
//         });

//         if (user) {
//             res.status(201).json({
//                 message: "user created successfully",
//                 status: 201,
//                 data: {
//                     _id: user._id,
//                     name: user.name,
//                     email: user.email,
//                     isAdmin: user.isAdmin,
//                     pic: user.pic,
//                     token: generateToken(user._id),
//                 }
//             });
//         } else {
//             return res.json({
//                 message: "user not created",
//                 status: 400,
//             });
//         }
//     } catch (error: any) {
//         if (error.code === 11000) {
//             return res.json({
//                 message: "user already exists",
//                 status: 409,
//             });
//         }
//         return res.json({
//             message: error.message,
//             status: 500,
//         })
//     }
// };
export const register = async (req: AuthenticatedRequest, res: Response) => {
    const { name, email, password, pic } = req.body;
    console.log(name, email, password, pic);

    if (!name || !email || !password) {
        return res.status(400).json({
            message: "Please enter all the required fields",
            status: 400,
        });
    }

    try {
        const userExists = await User.findOne({ email });
        console.log("userExists", userExists)
        if (userExists) {
            console.log("user already exists");
            return res.json({
                message: "User already exists",
                status: 409,
            });
        }

        let picUrl: string | undefined;
        if (typeof pic === 'object' && pic !== null) {
            picUrl = pic.toString();
        } else {
            picUrl = pic; 
        }

        const user: any = await User.create({
            name,
            email,
            password,
            pic: picUrl, 
        });

        if (user) {
            res.status(201).json({
                message: "User created successfully",
                status: 201,
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    pic: user.pic,
                    token: generateToken(user._id),
                }
            });
        } else {
            return res.status(400).json({
                message: "User not created",
                status: 400,
            });
        }
    } catch (error: any) {
        console.log({error})
        if (error.code === 11000) {
            return res.json({
                message: "User already exists",
                status: 409,
            });
        }
        return res.status(500).json({
            message: error.message,
            status: 500,
        })
    }
};


//@description     Auth the user
//@route           POST /api/users/login
//@access          Public
export const login = async (req: AuthenticatedRequest, res: Response) => {
    const { email, password } = req.body;
    console.log(email, password);
    try {
        const user: any = await User.findOne({ email });
        if (!user) {
            return res.json({
                message: "user not found",
                status: 404,
            });
        }

        if (user && (await user.matchPassword(password))) {
            res.status(200).json({
                message: "user logged in successfully",
                status: 200,
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    pic: user.pic,
                    token: generateToken(user._id),
                }
            });
        } else {
            return res.json({
                message: "Invalid creadentials",
                status: 400,
            })
        }
    } catch (error: any) {
        return res.json({
            message: error.message,
            status: 500,
        })
    }
};

export const addPicUrl = async (req: AuthenticatedRequest, res: Response) => {
    const { id, pic } = req.body;
    console.log("addPicUrl", id, typeof id, pic, typeof pic);
    try {
        const user: any = await User.findById(id);
        if (!user) {
            return res.json({
                message: "User not found",
                status: 404,
            });
        }
        const userUpdated = await User.findByIdAndUpdate(id, {
            $set: {
                pic: pic
            }
        })
        return res.status(200).json({
            message: "User updated successfully",
            status: 200,
            data: userUpdated
        });
    } catch (error: any) {
        return res.json({
            message: error.message,
            status: 500,
        });
    }
};


