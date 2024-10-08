import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRouter from "./src/routers/user";
import cors from "cors";

dotenv.config();

const port = process.env.APP_PORT || 3005;
const dbUrl = process.env.DATABASE_URL || 'mongodb+srv://truongduydev2:Zozxmsto50wHV1ZF@cluster0.7fylm.mongodb.net';

const app = express();

app.use(express.json());
app.use(cors());

const connectDB = async () => {
  try {
    await mongoose.connect(dbUrl as string);
    console.log("Connect to DB Successfully !!!");
  } catch (error) {
    console.log("Error when try connect to DB: ", error);
  }
};

app.use("/auth", userRouter);

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
