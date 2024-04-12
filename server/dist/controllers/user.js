"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPicUrl = exports.login = exports.register = exports.allUsers = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const userModels_1 = __importDefault(require("../models/userModels"));
const generateToken_1 = __importDefault(require("../config/generateToken"));
dotenv_1.default.config();
//@description     Get or Search all users
//@route           GET /api/user?search=
//@access          Public
const allUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const keyword = req.query.search
        ? {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } },
            ],
        }
        : {};
    try {
        const users = yield userModels_1.default.find(keyword).find({ _id: { $ne: req.user._id } });
        console.log("into allusers");
        return res.status(200).json({
            message: "user data fetched successfully",
            status: 200,
            data: users,
        });
    }
    catch (error) {
        return res.json({
            message: error.message,
            status: 500,
        });
    }
});
exports.allUsers = allUsers;
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
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, pic } = req.body;
    console.log(name, email, password, pic);
    if (!name || !email || !password) {
        return res.status(400).json({
            message: "Please enter all the required fields",
            status: 400,
        });
    }
    try {
        const userExists = yield userModels_1.default.findOne({ email });
        console.log("userExists", userExists);
        if (userExists) {
            console.log("user already exists");
            return res.json({
                message: "User already exists",
                status: 409,
            });
        }
        let picUrl;
        if (typeof pic === 'object' && pic !== null) {
            picUrl = pic.toString();
        }
        else {
            picUrl = pic;
        }
        const user = yield userModels_1.default.create({
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
                    token: (0, generateToken_1.default)(user._id),
                }
            });
        }
        else {
            return res.status(400).json({
                message: "User not created",
                status: 400,
            });
        }
    }
    catch (error) {
        console.log({ error });
        if (error.code === 11000) {
            return res.json({
                message: "User already exists",
                status: 409,
            });
        }
        return res.status(500).json({
            message: error.message,
            status: 500,
        });
    }
});
exports.register = register;
//@description     Auth the user
//@route           POST /api/users/login
//@access          Public
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    console.log(email, password);
    try {
        const user = yield userModels_1.default.findOne({ email });
        if (!user) {
            return res.json({
                message: "user not found",
                status: 404,
            });
        }
        if (user && (yield user.matchPassword(password))) {
            res.status(200).json({
                message: "user logged in successfully",
                status: 200,
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    pic: user.pic,
                    token: (0, generateToken_1.default)(user._id),
                }
            });
        }
        else {
            return res.json({
                message: "Invalid creadentials",
                status: 400,
            });
        }
    }
    catch (error) {
        return res.json({
            message: error.message,
            status: 500,
        });
    }
});
exports.login = login;
const addPicUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, pic } = req.body;
    console.log("addPicUrl", id, typeof id, pic, typeof pic);
    try {
        const user = yield userModels_1.default.findById(id);
        if (!user) {
            return res.json({
                message: "User not found",
                status: 404,
            });
        }
        const userUpdated = yield userModels_1.default.findByIdAndUpdate(id, {
            $set: {
                pic: pic
            }
        });
        return res.status(200).json({
            message: "User updated successfully",
            status: 200,
            data: userUpdated
        });
    }
    catch (error) {
        return res.json({
            message: error.message,
            status: 500,
        });
    }
});
exports.addPicUrl = addPicUrl;
