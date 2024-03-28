import express from "express";
import {
    createMovieReview,
    getMovieById,
    getMovies,
    getRandomMovies,
    getTopRateMovies,
    importMovies
} from "../controllers/movieController.js";
import {protect} from "../middlewares/Auth.js";

const router = express.Router();

router.post("/import",importMovies)
router.get("/",getMovies)
router.get("/rated/top",getTopRateMovies)
router.get("/:id",getMovieById)
router.get("/random/all",getRandomMovies)


router.post("/:id/reviews",protect,createMovieReview)
export default router;