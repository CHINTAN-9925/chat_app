import dotenv from 'dotenv';
import express, { Application } from 'express';
import cors from 'cors';
import { connectToDb } from './config/db';
import chatRoutes from './routes/chat';
import messageRoutes from './routes/message';
import userRoutes from './routes/user';

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 4000;

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

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
