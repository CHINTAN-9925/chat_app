import { Request, Response } from "express";

import Message from "../models/messageModels";
import Chat from "../models/chatModels";
import User from "../models/userModels";
import { AuthenticatedRequest } from "../middlewares/auth";

//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
export const allMessages = async (req: Request, res: Response) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
            .populate("sender", "name pic email")
            .populate("chat");
        return res.status(200).json({
            message: "group deatils fetched successfully",
            status: 200,
            data: messages,
        });
    } catch (error: any) {
        return res.status(500).json({
            message: error.message,
            status: 500,
        });
    }
};

//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
export const sendMessage = async (req: AuthenticatedRequest, res: Response) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        return res.status(400).json({
            message: "Invalid data passed into request",
            status: 400,
        });;
    }

    let newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    };

    try {
        let message: any = await Message.create(newMessage);

        message = await message.populate("sender", "name pic");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: "chat.users",
            select: "name pic email",
        });

        await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

        return res.status(200).json({
            message: "message sent successfully",
            status: 200,
            data: message,
        })
    } catch (error: any) {
        return res.status(500).json({
            message: error.message,
            status: 500,
        });
    }
};

