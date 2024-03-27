import express from "express";
import {
    changeUserPassword,
    deleteUser,
    loginUser,
    registerUser,
    updateUserProfile
} from "../controllers/userController.js";
import {protect} from "../middlewares/Auth.js";

const router = express.Router()

router.post("/register",registerUser)
router.post("/login",loginUser)


router.put("/",protect,updateUserProfile)
router.delete("/",protect,deleteUser)
router.put("/password",protect,changeUserPassword)

export default router