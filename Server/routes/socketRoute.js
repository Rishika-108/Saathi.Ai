import express from "express";
import { v4 as uuidv4 } from "uuid";
import { sessions } from "../controllers/websocket.js";

const router = express.Router();

router.post("/create", (req, res) => {
  const { userA, userB, messageLimit = 30 } = req.body;
  const roomId = uuidv4();

  // Store in-memory
  sessions[roomId] = {
    users: [userA, userB],
    messageCount: 0,
    messageLimit,
    state: "ACTIVE",
    escalationTriggered: false,
  };

  res.json({ roomId, messageLimit });
});

export default router;