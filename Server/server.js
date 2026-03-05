import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { redisClient,initRedis } from "../Server/config/redisClient.js";
import { connectDB } from "../Server/config/db.js";
import userRouter from "../Server/routes/userRoutes.js";
import journalRouter from '../Server/routes/journalRoutes.js' 
import peerRoutes from "../Server/routes/peerRequestRoutes.js"; 
import sessionRouter from "../Server/routes/socketRoute.js";
dotenv.config();


const app = express();

connectDB(); //Connect Database
await initRedis();
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

//API Endpoint to connect to user
app.use("/api/user", userRouter);
app.use("/api/journal", journalRouter);
app.use("/api/peers", peerRoutes);
// app.use("/api/session", sessionRouter);

app.get("/", (req, res) => {
  res.send("API is running...");
});
// Start Redis
// const server = http.createServer(app);
// initWebSocket(server);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// startServer();
