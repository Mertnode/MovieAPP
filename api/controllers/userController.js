import asyncHandler from "express-async-handler";
import User from "../models/userSchema.js"
import bcrypt from "bcryptjs"
import {generateToken} from "../middlewares/Auth.js";


 export const registerUser = asyncHandler(async (req,res) => {
    const {fullName, email, password,image} = req.body;

    try {
        const userExists = await User.findOne({email})
        if (userExists) {
            res.status(400)
            throw new Error("User already exists")
        }
        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt)

        //create user db
        const user = await User.create({
            fullName,
            email,
            password:hashedPassword,
            image
        })

        // if user created successfully
        if (user) {
            res.status(200).json({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id)

            })
        } else {
            res.status(400)
            throw new Error("Invalid user data")
        }
    } catch (e) {
        res.status(400).json({message: e.message})
    }
})


export const loginUser = asyncHandler(async (req,res) => {
    const {email,password} = req.body;
    try {
        const user  = await User.findOne({email});

        if (user && (await bcrypt.compare(password,user.password))) {
            res.json({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id)
            })
        } else {
            res.status(401);
            throw  new Error("Invalid email or password")
        }
    } catch (e) {
        res.status(400).json({message: e.message})
    }
})


const updateUserProfile = asyncHandler(async (req,res) => {
    const {fullName,email, image} = req.body;
    try {
        const user = await User.findById(req.user._id)
        if (user) {

        }
    } catch (e) {
        res.status(400).json({message: e.message})
    }
})