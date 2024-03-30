import express from "express";
import {
  addLikeMovie,
  changeUserPassword,
  deleteLikedMovies,
  deleteUser,
  deleteUserProfile,
  getLikedMovies,
  getUsers,
  loginUser,
  registerUser,
  updateUserProfile,
} from "../controllers/userController.js";
import { protect, admin } from "../middlewares/Auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.put("/", protect, updateUserProfile);
router.delete("/", protect, deleteUserProfile);
router.put("/password", protect, changeUserPassword);
router.get("/favorites", protect, getLikedMovies);
router.post("/favorites", protect, addLikeMovie);
router.post("/favorites", protect, addLikeMovie);
router.delete("/favorites", protect, deleteLikedMovies);

/*ADMIN ROUTES*/
router.get("/", protect, admin, getUsers);
router.delete("/:id", protect, admin, deleteUser);

export default router;
