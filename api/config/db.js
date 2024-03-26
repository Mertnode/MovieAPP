import mongoose, {connections, mongo} from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env["MONGO_URL"])
        console.log(`Mongo db connected to`,mongoose.connection.host)
    } catch (e) {
        console.log(`Error: ${e.message}` )
        process.exit(1)
    }
}