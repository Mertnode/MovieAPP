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


export const updateUserProfile = asyncHandler(async (req, res) => {
    const { fullName, email, image } = req.body;
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            // Kullanıcıya 3 güncelleme hakkı sağlama
            if (fullName !== undefined) {
                user.fullName = fullName.trim();
            }
            if (email !== undefined) {
                const sanitizedEmail = email.trim().toLowerCase();

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(sanitizedEmail)) {
                    res.status(400);
                    throw new Error("Geçersiz e-posta adresi");
                }

                user.email = sanitizedEmail;
            }
            if (image !== undefined) {
                user.image = image;
            }

            const updatedUser = await user.save();

            // Kullanıcıya geri bildirim sağlama
            res.json({
                _id: updatedUser._id,
                email: updatedUser.email,
                image: updatedUser.image,
                isAdmin: updatedUser.isAdmin,
                token: generateToken(updatedUser._id),
                message: "Profil başarıyla güncellendi"
            });
        } else {
            res.status(404);
            throw new Error("Kullanıcı bulunamadı");
        }
    } catch (e) {
        res.status(400).json({message: e.message})
    }
});

export const deleteUser = asyncHandler(async (req,res) => {
   try {
    const user = await User.findById(req.user._id)

       if (!user) {
           res.status(404)
           throw new Error("User not found")
       }
       if (user.isAdmin) {
           res.status(403)
           throw new Error("Cant delete admin user")
       }
       await user.deleteOne()
       res.json({message:"User delete successfully"})
   } catch (e) {
       res.status(400).json({message: e.message})
   }
})

export const changeUserPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            res.status(404);
            throw new Error("Kullanıcı bulunamadı");
        }

        // Eski şifrenin doğruluğunu kontrol etme
        const passwordMatch = await bcrypt.compare(oldPassword, user.password);
        if (!passwordMatch) {
            res.status(400);
            throw new Error("Eski şifre yanlış");
        }

        // Yeni şifrenin hashlenmesi ve kullanıcıya atanması
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        await user.save();

        res.json({ message: "Şifre başarıyla değiştirildi" });
    } catch (e) {
        res.status(400).json({message: e.message})
    }
});

export const getLikedMovies = asyncHandler(async (req,res) => {
    try {
        const user = await User.findById(req.user.id).populate("likedMovies")
        if (user) {
            res.json(user.likedMovies)
        } else {
            res.status(404)
            throw new Error("user not found")
        }
    } catch (e) {
        res.status(400).json({message: e.message})
    }
})

export const addLikeMovie = asyncHandler(async (req, res) => {
   const {movieId} = req.body;
   try {
       const user = await User.findById(req.user._id)

       if (user) {
           if (user.likedMovies.includes(movieId)) {
               res.status(400)
               throw new Error("Movie already liked")
           }
           user.likedMovies.push(movieId)
           await user.save()
       } else {
           res.status(404);
           throw new Error("Movie not found")
       }

   } catch (e) {
       res.status(400).json({message: e.message})
   }
});

export const deleteLikedMovie = asyncHandler(async (req,res) => {

})

const deleteLikedMovies = asyncHandler(async (req,res) => {
    try {
        const user = await User.findById(req.user._id)

        if (user) {
            user.likedMovies = []
            await user.save()
            res.json({message: "all liked movies deleted successfully" })
        } else {
            res.status(404)
            throw new Error("User not found")
        }

    } catch (e) {
        res.status(400).json({message: e.message})
    }
})