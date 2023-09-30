import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/users.js";
import videoRoutes from "./routes/videos.js";
import commentRoutes from "./routes/comments.js";
import authRoutes from "./routes/auth.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport";
import {utils} from "./utils/index.js";
import {auth} from "./strategies/auth.js";

const app = express();
const PORT = 80

dotenv.config();

app.use(cors());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(passport.initialize({}));
passport.use('jwt', auth);

app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/auth", authRoutes);

app.use((err, req, res, next) => {
    console.log("arrivato" + err)
    const status = err.status || 500;
    const message = err.message || "Something went wrong!";
    return res.status(status).json({
        success: false,
        status: status,
        message: message
    })
})

const connect = () => {
    mongoose.connect(process.env.MONGO).then(() => {
        utils.logger.info("Connected to DB");
    }).catch(err => utils.logger.error(err));
};

app.listen(PORT, () => {
    connect();
    console.log("Server is listening to port " + PORT)
})