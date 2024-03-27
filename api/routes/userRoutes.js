import express from "express";
import {deleteUser, loginUser, registerUser, updateUserProfile} from "../controllers/userController.js";
import {protect} from "../middlewares/Auth.js";

const router = express.Router()

router.post("/register",registerUser)
router.post("/login",loginUser)


router.put("/",protect,updateUserProfile)
router.delete("/",protect,deleteUser)

export default router