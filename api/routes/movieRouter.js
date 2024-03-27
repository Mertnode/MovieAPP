import express from "express";
import {getMovies, importMovies} from "../controllers/movieController.js";

const router = express.Router();

router.post("/import",importMovies)
router.get("/",getMovies)

export default router;