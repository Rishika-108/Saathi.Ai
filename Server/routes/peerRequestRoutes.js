import express from "express";
import { selectPeer, declinePeer, getIncomingRequests, getActiveChats } from "../controllers/peerRequestController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/select", authMiddleware, selectPeer);
router.post("/decline", authMiddleware, declinePeer);
router.get("/incoming", authMiddleware, getIncomingRequests);
router.get("/active-chats", authMiddleware, getActiveChats);

export default router;