import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import userRouter from "./routes/userRoutes.js";
import journalRouter from './routes/journalRoutes.js' 
dotenv.config();

const app = express();
//Connect Database
connectDB();

app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

//API Endpoint to connect to user
app.use("/api/user", userRouter);
app.use("/api/journal", journalRouter);

app.get("/", (req, res) => {
  res.send("API is running...");
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
