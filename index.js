// server/index.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import errorHandler from "./middlewares/errorMiddleware.js";
import connectDB from "./config/db.js";

//import routes
 import userRouter from './routes/userRoute.js';


dotenv.config();
const port = process.env.PORT || 8000;
connectDB();
const app = express();

app.use(cors());

//you use these inorder to use the body data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Routes
app.use("/api/user", userRouter);

app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
