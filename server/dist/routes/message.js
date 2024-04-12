"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const message_1 = require("../controllers/message");
const router = express_1.default.Router();
router.use(auth_1.validateUser);
router.route("/:chatId").get(message_1.allMessages);
router.route("/").post(message_1.sendMessage);
exports.default = router;
