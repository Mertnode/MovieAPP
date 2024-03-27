import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {connectDB} from "./config/db.js";
import {errorHandler} from "./middlewares/errorMiddleware.js";
import userRouter from "./routes/userRoutes.js"
dotenv.config();
connectDB()

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req,res) => {
    res.send("API is running ...")
})


app.use(errorHandler)

app.use("/api/user",userRouter)


const PORT = process.env["PORT"];
app.listen(PORT, () => {
    console.log(`Server is runing in http://localhost:${PORT}`)
})