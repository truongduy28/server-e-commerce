import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { verifyToken } from "./src/middlewares/verifyToken";
import {
  categoryRouter,
  customerRouter,
  productRouter,
  promotionRouter,
  supplierRouter,
  userRouter,
} from "./src/routers";

dotenv.config();

const port = process.env.APP_PORT;
const dbUrl = process.env.DATABASE_URL;

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
app.use("/customer", customerRouter);
app.use(verifyToken);
app.use("/category", categoryRouter);
app.use("/supplier", supplierRouter);
app.use("/product", productRouter);
app.use("/promotion", promotionRouter);

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
