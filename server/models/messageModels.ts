import mongoose from "mongoose";

type MessageType = {
    sender: mongoose.Schema.Types.ObjectId;
    content: string;
    chat: mongoose.Schema.Types.ObjectId;
    readBy?: [];
}

const messageSchema = new mongoose.Schema<MessageType>(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Message = mongoose.model<MessageType>("Message", messageSchema);
export default Message