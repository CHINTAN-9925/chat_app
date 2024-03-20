import express, { Express, Request, Response, Application } from 'express';
import dotenv from 'dotenv';
import { connectToDb } from './config/db';
import userRoutes from './routes/user';
import chatRoutes from './routes/chat';
import messageRoutes from './routes/message';

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 4000;

connectToDb();

app.use(express.json()); // to accept json data



app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
