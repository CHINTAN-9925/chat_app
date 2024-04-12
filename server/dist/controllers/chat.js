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
exports.joinGroup = exports.leaveGroup = exports.renameGroup = exports.createGroupChat = exports.fetchChats = exports.accessChat = void 0;
const chatModels_1 = __importDefault(require("../models/chatModels"));
const userModels_1 = __importDefault(require("../models/userModels"));
//@description     Create or fetch One to One Chat
//@route           POST /api/chat/
//@access          Protected
const accessChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { userId } = req.body;
    console.log("userId from access all chats route", userId);
    if (!userId) {
        return res.status(400).json({
            message: "Please add a user ID",
            status: 400
        });
    }
    let isChat = yield chatModels_1.default.find({
        isGroupChat: false,
        users: {
            $all: [req.user._id, userId]
        }
    })
        .populate("users", "-password")
        .populate("latestMessage");
    isChat = yield userModels_1.default.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email",
    });
    if (isChat.length > 0) {
        res.send(isChat[0]);
    }
    else {
        let chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId],
        };
        try {
            const createdChat = yield chatModels_1.default.create(chatData);
            const FullChat = yield ((_a = chatModels_1.default.findOne({ _id: createdChat._id }).populate("users", "-password")) === null || _a === void 0 ? void 0 : _a.populate("latestMessage"));
            return res.status(200).json({
                message: "New Chat Created",
                status: 200,
                data: FullChat
            });
        }
        catch (error) {
            res.status(500).json({
                message: error.message,
                status: 500
            });
        }
    }
});
exports.accessChat = accessChat;
//@description     Fetch all chats for a user
//@route           GET /api/chat/
//@access          Protected
const fetchChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        chatModels_1.default.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .then((results) => __awaiter(void 0, void 0, void 0, function* () {
            results = yield userModels_1.default.populate(results, {
                path: "latestMessage.sender",
                select: "name pic email",
            });
            res.status(200).send(results);
        }));
    }
    catch (error) {
        return res.status(500).json({
            message: error.message,
            status: 500
        });
    }
});
exports.fetchChats = fetchChats;
//@description     Create New Group Chat
//@route           POST /api/chat/group
//@access          Protected
const createGroupChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please Fill all the feilds" });
    }
    let users = JSON.parse(req.body.users);
    if (users.length < 2) {
        return res
            .status(400)
            .send("More than 2 users are required to form a group chat");
    }
    users.push(req.user);
    try {
        const groupChat = yield chatModels_1.default.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        });
        const fullGroupChat = yield chatModels_1.default.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");
        return res.status(200).json({
            message: "Group Chat Created Successfully",
            status: 200,
            data: fullGroupChat
        });
    }
    catch (error) {
        return res.status(500).json({
            message: error.message,
            status: 500
        });
    }
});
exports.createGroupChat = createGroupChat;
// @desc    Rename Group
// @route   PUT /api/chat/rename
// @access  Protected
const renameGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId, chatName } = req.body;
    try {
        const updatedChat = yield chatModels_1.default.findByIdAndUpdate(chatId, {
            chatName: chatName,
        }, {
            new: true,
        })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");
        if (!updatedChat) {
            return res.json({
                message: "Chat Not Found",
                status: 404
            });
        }
        else {
            return res.status(200).json({
                message: "Group Chat Renamed Successfully",
                status: 200,
                data: updatedChat
            });
        }
    }
    catch (error) {
        return res.json({
            message: error.message,
            status: 500
        });
    }
});
exports.renameGroup = renameGroup;
// @desc    Remove user from Group
// @route   PUT /api/chat/groupremove
// @access  Protected
const leaveGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId, userId } = req.body;
    console.log(chatId, userId);
    try {
        const chat = yield chatModels_1.default.findById(chatId);
        if (!chat) {
            return res.json({
                message: "Chat Not Found",
                status: 404
            });
        }
        const removed = yield chatModels_1.default.findByIdAndUpdate(chatId, {
            $pull: { users: userId },
        }, {
            new: true,
        })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");
        if (!removed) {
            return res.json({
                message: "Chat Not Found",
                status: 404
            });
        }
        else {
            return res.status(200).json({
                message: "User Removed From Group",
                status: 200,
                data: removed
            });
        }
    }
    catch (error) {
        return res.json({
            message: error.message,
            status: 500
        });
    }
});
exports.leaveGroup = leaveGroup;
// @desc    Add user to Group / Leave
// @route   PUT /api/chat/groupadd
// @access  Protected
const joinGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId, userId } = req.body;
    // check if the requester is admin
    try {
        const chat = yield chatModels_1.default.findById(chatId);
        if (!chat) {
            return res.json({
                message: "Chat Not Found",
                status: 404
            });
        }
        const added = yield chatModels_1.default.findByIdAndUpdate(chatId, {
            $push: { users: userId },
        }, {
            new: true,
        })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");
        if (!added) {
            return res.json({
                message: "Chat Not Found",
                status: 404
            });
        }
        else {
            return res.status(200).json({
                message: "User Added To Group",
                status: 200,
                data: added
            });
        }
    }
    catch (error) {
        return res.json({
            message: error.message,
            status: 500
        });
    }
});
exports.joinGroup = joinGroup;
