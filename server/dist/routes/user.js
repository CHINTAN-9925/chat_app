"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../controllers/user");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.route("/").get(auth_1.validateUser, user_1.allUsers);
router.route("/register").post(user_1.register);
router.route("/picupdate").put(user_1.addPicUrl);
router.post("/login", user_1.login);
exports.default = router;
