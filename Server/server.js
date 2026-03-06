import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import { connectDB } from "../Server/config/db.js";
import userRouter from "../Server/routes/userRoutes.js";
import journalRouter from '../Server/routes/journalRoutes.js' 
import peerRoutes from "../Server/routes/peerRequestRoutes.js"; 
import http from "http"
import { Server } from "socket.io"
import socketServer from "../Server/socket/socketServer.js";
import feedRouter from "./routes/feedRoute.js";
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors:{ 
        origin: "http://localhost:5173", // Restrict to Client URL
        methods: ["GET", "POST"]
    }
});

connectDB(); //Connect Database

// Security Middleware
app.use(helmet()); // Set standard secure HTTP headers
app.use(mongoSanitize()); // Prevent NoSQL Injection

// Rate Limiting Middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again after 15 minutes"
});
app.use("/api", limiter); // Apply to API routes

// Stricter CORS
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

//API Endpoint to connect to user
app.use("/api/user", userRouter);
app.use("/api/journal", journalRouter);
app.use("/api/peers", peerRoutes);
app.use("/api/feed", feedRouter);


app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
socketServer(io)

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
