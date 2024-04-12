import dotenv from 'dotenv';
import express, { Application } from 'express';
import cors from 'cors';
import { connectToDb } from './config/db';
import chatRoutes from './routes/chat';
import messageRoutes from './routes/message';
import userRoutes from './routes/user';
import http from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 4000;
const server = http.createServer(app);
connectToDb();

app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}))

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);


const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }
})

io.on("connection", (socket) => {
  console.log("Connected to socket.io")
  socket.on("setup", (userData) => {
    console.log(userData._id)
    socket.join(userData._id)
    socket.emit("connected")
  })
  socket.on("join chat", (room) => {
    socket.join(room)
    console.log("User Joined Room: " + room)
  })
  socket.on("new message", (newMessageRecieved) => {
    let chat = newMessageRecieved.chat
    console.log("inside new message")
    if (!chat.users) return console.log("chat.users not defined")
    console.log(chat.users)
    console.log({ newMessageRecieved })
    chat.users.forEach((user: { _id: string, name: string, email: string, pic: string }) => {
      if (user._id === newMessageRecieved.sender._id) return
      socket.in(user._id).emit("message received", newMessageRecieved)
    })
  })
  socket.on("typing", (room) => {
    console.log("inside typing")
    socket.in(room).emit("typing")
  })
  socket.on("stop typing", (room) => {
    console.log("inside stop typing")     
    socket.in(room).emit("stop typing")
  })
  socket.off("setup", (userData) => {
    console.log("USER DISCONNECTED")
    socket.leave(userData._id)
  })
})

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});