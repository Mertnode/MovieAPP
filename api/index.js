import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {connectDB} from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import movieRoutes from "./routes/movieRouter.js";

dotenv.config();
connectDB()

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req,res) => {
    res.send("API is running ...")
})


app.use("/api/user/",userRoutes)
app.use("/api/movies/",movieRoutes)




const PORT = process.env["PORT"];
app.listen(PORT, () => {
    console.log(`Server is runing in http://localhost:${PORT}`)
})

