import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth";
import Chat from "../models/chatModels";
import User from "../models/userModels";

//@description     Create or fetch One to One Chat
//@route           POST /api/chat/
//@access          Protected
export const accessChat = async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.body;
    console.log("userId from access all chats route", userId)
    if (!userId) {
        return res.status(400).json({
            message: "Please add a user ID",
            status: 400
        });
    }

    let isChat: any = await Chat.find({
        isGroupChat: false,
        users: {
            $all: [req.user._id, userId]
        }
    })
        .populate("users", "-password")
        .populate("latestMessage");

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email",
    });

    if (isChat.length > 0) {
        res.send(isChat[0]);
    } else {
        let chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId],
        };

        try {
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
                "users",
                "-password"
            );
            return res.status(200).json({
                message: "New Chat Created",
                status: 200,
                data: FullChat
            });
        } catch (error: any) {
            res.status(500).json({
                message: error.message,
                status: 500
            });
        }
    }
};

//@description     Fetch all chats for a user
//@route           GET /api/chat/
//@access          Protected
export const fetchChats = async (req: AuthenticatedRequest, res: Response) => {
    try {
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .then(async (results: any) => {
                results = await User.populate(results, {
                    path: "latestMessage.sender",
                    select: "name pic email",
                });
                res.status(200).send(results);
            });
    } catch (error: any) {
        return res.status(500).json({
            message: error.message,
            status: 500
        });
    }
};

//@description     Create New Group Chat
//@route           POST /api/chat/group
//@access          Protected
export const createGroupChat = async (req: AuthenticatedRequest, res: Response) => {
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
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        });

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        return res.status(200).json({
            message: "Group Chat Created Successfully",
            status: 200,
            data: fullGroupChat
        });
    } catch (error: any) {
        return res.status(500).json({
            message: error.message,
            status: 500
        });
    }
};

// @desc    Rename Group
// @route   PUT /api/chat/rename
// @access  Protected
export const renameGroup = async (req: AuthenticatedRequest, res: Response) => {
    const { chatId, chatName } = req.body;

    try {
        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            {
                chatName: chatName,
            },
            {
                new: true,
            }
        )
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        if (!updatedChat) {
            return res.status(404).json({
                message: "Chat Not Found",
                status: 404
            })
        } else {
            return res.status(200).json({
                message: "Group Chat Renamed Successfully",
                status: 200,
                data: updatedChat
            });
        }
    } catch (error: any) {
        return res.status(500).json({
            message: error.message,
            status: 500
        })
    }
};

// @desc    Remove user from Group
// @route   PUT /api/chat/groupremove
// @access  Protected
export const leaveGroup = async (req: AuthenticatedRequest, res: Response) => {
    const { chatId, userId } = req.body;

    try {

        const chat: any = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({
                message: "Chat Not Found",
                status: 404
            })
        }
        if (!chat.musers.includes(userId)) {
            return res.status(400).json({
                message: "User Not Found In Chat",
                status: 400
            })
        }
        if (chat.groupAdmin.toString() === userId.toString()) {

            const usersWithoutAdmin = chat.users.filter((user: any) => user.toString() !== userId.toString());
            const randomIndex = Math.floor(Math.random() * usersWithoutAdmin.length);
            const newGroupAdmin = usersWithoutAdmin[randomIndex];
            chat.groupAdmin = newGroupAdmin;
            chat.save();

        }

        const removed = await Chat.findByIdAndUpdate(
            chatId,
            {
                $pull: { users: userId },
            },
            {
                new: true,
            }
        )
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        if (!removed) {
            return res.status(404).json({
                message: "Chat Not Found",
                status: 404
            });
        } else {
            return res.status(200).json({
                message: "User Removed From Group",
                status: 200,
                data: removed
            });
        }
    } catch (error: any) {
        return res.status(500).json({
            message: error.message,
            status: 500
        })
    }
};

// @desc    Add user to Group / Leave
// @route   PUT /api/chat/groupadd
// @access  Protected
export const joinGroup = async (req: AuthenticatedRequest, res: Response) => {
    const { chatId, userId } = req.body;

    // check if the requester is admin

    try {
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({
                message: "Chat Not Found",
                status: 404
            })
        }

        if (chat.users.includes(userId)) {
            return res.status(400).json({
                message: "User Already In Group",
                status: 400
            })
        }

        const added = await Chat.findByIdAndUpdate(
            chatId,
            {
                $push: { users: userId },
            },
            {
                new: true,
            }
        )
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        if (!added) {
            return res.status(404).json({
                message: "Chat Not Found",
                status: 404
            })
        } else {
            return res.status(200).json({
                message: "User Added To Group",
                status: 200,
                data: added
            });
        }
    } catch (error: any) {
        return res.status(500).json({
            message: error.message,
            status: 500
        })
    }
};
