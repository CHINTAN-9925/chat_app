"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./config/db");
const chat_1 = __importDefault(require("./routes/chat"));
const message_1 = __importDefault(require("./routes/message"));
const user_1 = __importDefault(require("./routes/user"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 4000;
const server = http_1.default.createServer(app);
(0, db_1.connectToDb)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use("/api/user", user_1.default);
app.use("/api/chat", chat_1.default);
app.use("/api/message", message_1.default);
const io = new socket_io_1.Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
    }
});
io.on("connection", (socket) => {
    console.log("Connected to socket.io");
    socket.on("setup", (userData) => {
        console.log(userData._id);
        socket.join(userData._id);
        socket.emit("connected");
    });
    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
    });
    socket.on("new message", (newMessageRecieved) => {
        let chat = newMessageRecieved.chat;
        console.log("inside new message");
        if (!chat.users)
            return console.log("chat.users not defined");
        console.log(chat.users);
        console.log({ newMessageRecieved });
        chat.users.forEach((user) => {
            if (user._id === newMessageRecieved.sender._id)
                return;
            socket.in(user._id).emit("message received", newMessageRecieved);
        });
    });
    socket.on("typing", (room) => {
        console.log("inside typing");
        socket.in(room).emit("typing");
    });
    socket.on("stop typing", (room) => {
        console.log("inside stop typing");
        socket.in(room).emit("stop typing");
    });
    socket.off("setup", (userData) => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
});
server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
