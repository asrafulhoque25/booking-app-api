import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import authRoute from './routes/auth.js';
import usersRoute from "./routes/users.js";
import hotelsRoute from "./routes/hotel.js";
import roomsRoute from './routes/room.js'




const port = process.env.PORT || 5000 ;


const app = express();
dotenv.config();


const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to mongoDB.");
    } catch (error) {
        throw error;
    }
};

mongoose.connection.on("disconnected", () => {
    console.log("mongoDB disconnected!");
});



//middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}))
app.use(express.json());



// Routes 
app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/rooms", roomsRoute);



// Error Handler 
app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack,
    });
});


app.get("/", (req, res) => {
    res.send("Booking App Server is Running");
});


app.listen(port, () => {
  connect();
  console.log("Connected to backend.");
});
