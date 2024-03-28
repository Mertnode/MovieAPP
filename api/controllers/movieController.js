import asyncHandler from "express-async-handler";
import Movie from "../models/moviesSchema.js";
import {moviesData} from "../data/movieData.js";



export const importMovies = asyncHandler(async (req,res) => {
    try {

    } catch (e) {
        res.status(400).json({message: e.message})
    }
    await  Movie.deleteMany({});

    const movies = await Movie.insertMany(moviesData)
    res.status(201).json(movies)
})


export const getMovies = asyncHandler(async (req,res) => {
    try {
        const {category, time, language, rate, year,search} = req.query;

        let query = {
            ...(category && {category}),
            ...(time && {time}),
            ...(language && {language}),
            ...(rate && {rate}),
            ...(year && {year}),
            ...(search && {name: {$regex: search, $options: "i"}})
        }

        // load more movies functionality

        const page  = Number(req.query.pageNumber) || 1;
        const limit = 2;
        const skip = (page - 1) * limit

        // find movies by query, skip and limit

        const movies = await Movie.find(query)
            .sort({createdAt: 1})
            .skip(skip)
            .limit(limit)

        // get total number of movies

        const count  = await Movie.countDocuments(query)

        // send response with movies and total number of movies

        res.json({
            movies,
            page,
            pages: Math.ceil(count / limit),
            totalMovies: count
        })
    } catch (e) {
        res.status(400).json({message: e.message})
    }

})

export const getMovieById = asyncHandler(async (req,res) => {
    try {
        const movie = await Movie.findById(req.params.id);

        if (movie) {
            res.json(movie)
        } else {
            res.status(404)
            throw new Error("Movie not found")
        }
    } catch (e) {
        res.status(400).json({message: e.message})
    }
})

export const getTopRateMovies = asyncHandler(async (req,res) => {
    try {
        const movies = await  Movie.find({}).sort({rate: -1})
        res.json(movies)
    } catch (e) {
        res.status(400).json({message: e.message})
    }
})

export const getRandomMovies = asyncHandler(async (req,res) => {
    try {
    const movies = await Movie.aggregate([{$sample: {size: 8}}]);
    res.json(movies)
    } catch (e) {
        res.status(400).json({message: e.message})
    }
})

export const createMovieReview =  asyncHandler(async (req,res) => {
    const {rating,comment} = req.body;
    try {
        const movie = await Movie.findById(req.params.id);

        if (movie) {
            const alreadyReviewed = movie.reviews.find(
                (r) => r.userId.toString() === req.user._id.toString()
            )
            if (alreadyReviewed) {
                res.status(400);
                throw new Error("You already reviewed this movie ")
            }

            const review = {
                userName: req.user.fullName,
                userId: req.user._id,
                userImage: req.user.image,
                rating: Number(rating),
                comment,
            }

            movie.reviews.push(review)

            movie.numberOfReviews = movie.reviews.length;

            movie.rate = movie.reviews.reduce((acc,item) => item.rating + acc, 0) / movie.reviews.length;

            await movie.save()
            res.status(201).json({
                message: "Review added",
            })
        } else {
            res.status(404)
            throw new Error("Movie not found")
        }


    } catch (e) {
        res.status(400).json({message: e.message})
    }
})