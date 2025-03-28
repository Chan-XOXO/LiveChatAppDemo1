import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import messagesRoutes from "./routes/MessagesRoutes.js";


dotenv.config();
const app = express();
const port = process.env.PORT || 7001;

app.use(cors({ origin: process.env.ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());


app.use("/api/messages", messagesRoutes);

mongoose.connect(process.env.DATABASE_URL)
    .then(() => console.log("Auth DB connected"))
    .catch(err => console.log(err));

app.listen(port, () => console.log(`Auth Service läuft auf Port ${port}`));