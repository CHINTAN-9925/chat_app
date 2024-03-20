import { connect } from "mongoose";
import env from "dotenv";

env.config();
export const connectToDb = async () => {
    try {
        const conn = await connect(process.env.MONGO_URI!)
        console.log(`MongoDB Connected: ${conn.connection.host}`);

    } catch (error: any) {
        console.log(`error occured while connecting to database${error.message}`);
        process.exit(1);
    }
}