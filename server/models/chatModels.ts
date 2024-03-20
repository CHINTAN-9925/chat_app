import mongoose from "mongoose";

type ChatType = {
    chatName: string;
    isGroupChat: boolean;
    users: [mongoose.Schema.Types.ObjectId];
    latestMessage: mongoose.Schema.Types.ObjectId;
    groupAdmin: mongoose.Schema.Types.ObjectId;
}

const chatModel = new mongoose.Schema<ChatType>(
    {
        chatName: { type: String, trim: true },
        isGroupChat: { type: Boolean, default: false },
        users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        latestMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
        },
        groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

const Chat = mongoose.model<ChatType>("Chat", chatModel);
export default Chat