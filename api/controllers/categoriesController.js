import asyncHandler from "express-async-handler";
import Categories from "../models/categoriesSchema";


const getCategories = asyncHandler(async (req,res) => {
    try {
        const categories = await Categories.find({})
        res.json(categories)
    } catch (e) {
        res.status(400).json({message: e.message})
    }
})