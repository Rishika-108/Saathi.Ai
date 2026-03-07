import express from "express";
import cors from "cors";
import dotenv from "dotenv";
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
