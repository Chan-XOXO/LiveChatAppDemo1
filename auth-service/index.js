import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 5001;

app.use(cors({ origin: process.env.ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());


app.use("/api/auth", authRoutes);

mongoose.connect(process.env.DATABASE_URL)
    .then(() => console.log("Auth DB connected"))
    .catch(err => console.log(err));

app.listen(port, () => console.log(`Auth Service läuft auf Port ${port}`));