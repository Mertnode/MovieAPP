import express from "express";
import {
  createMovie,
  createMovieReview,
  deleteAllMovies,
  deleteMovie,
  getMovieById,
  getMovies,
  getRandomMovies,
  getTopRateMovies,
  importMovies,
  updateMovie,
} from "../controllers/movieController.js";
import { admin, protect } from "../middlewares/Auth.js";

const router = express.Router();

router.post("/import", importMovies);
router.get("/", getMovies);
router.get("/rated/top", getTopRateMovies);
router.get("/:id", getMovieById);
router.get("/random/all", getRandomMovies);

router.post("/:id/reviews", protect, createMovieReview);
router.put("/:id", protect, admin, updateMovie);
router.delete("/:id", protect, admin, deleteMovie);
router.delete("/", protect, admin, deleteAllMovies);
router.post("/", protect, admin, createMovie);
export default router;
