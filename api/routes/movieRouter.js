import express from "express";
import {importMovies} from "../controllers/movieController.js";

const router = express.Router();

router.post("/import",importMovies)

export default router;