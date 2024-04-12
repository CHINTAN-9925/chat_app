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
exports.sendMessage = exports.allMessages = void 0;
const messageModels_1 = __importDefault(require("../models/messageModels"));
const chatModels_1 = __importDefault(require("../models/chatModels"));
const userModels_1 = __importDefault(require("../models/userModels"));
//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
const allMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messages = yield messageModels_1.default.find({ chat: req.params.chatId })
            .populate("sender", "name pic email")
            .populate("chat");
        return res.status(200).json({
            message: "group deatils fetched successfully",
            status: 200,
            data: messages,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: error.message,
            status: 500,
        });
    }
});
exports.allMessages = allMessages;
//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { content, chatId } = req.body;
    if (!content || !chatId) {
        return res.status(400).json({
            message: "Invalid data passed into request",
            status: 400,
        });
        ;
    }
    let newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    };
    try {
        let message = yield messageModels_1.default.create(newMessage);
        message = yield message.populate("sender", "name pic");
        message = yield message.populate("chat");
        message = yield userModels_1.default.populate(message, {
            path: "chat.users",
            select: "name pic email",
        });
        yield chatModels_1.default.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
        return res.status(200).json({
            message: "message sent successfully",
            status: 200,
            data: message,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: error.message,
            status: 500,
        });
    }
});
exports.sendMessage = sendMessage;
