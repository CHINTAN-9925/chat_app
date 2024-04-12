"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const chat_1 = require("../controllers/chat");
const router = express_1.default.Router();
router.use(auth_1.validateUser);
router.route("/").post(chat_1.accessChat);
router.route("/").get(chat_1.fetchChats);
router.route("/group").post(chat_1.createGroupChat);
router.route("/rename").put(chat_1.renameGroup);
router.route("/leave").put(chat_1.leaveGroup);
router.route("/join").put(chat_1.joinGroup);
exports.default = router;
