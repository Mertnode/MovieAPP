import asyncHandler from "express-async-handler";
import Movie from "../models/moviesSchema.js";
import {moviesData} from "../data/movieData.js";



export const importMovies = asyncHandler(async (req,res) => {
    await  Movie.deleteMany({});

    const movies = await Movie.insertMany(moviesData)
    res.status(201).json(movies)
})