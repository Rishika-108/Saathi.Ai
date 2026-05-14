import PeerRequest from "../model/PeerRequestModel.js";
import userModel from "../model/userModel.js";
import { generateAlias } from "../utils/aliasGenerator.js";
import { generateMatchReason } from "../utils/matchReason.js";
import { generateRoomId } from "../utils/room.js";
import { userSockets } from "../socket/socketServer.js";

export const selectPeer = async (req, res) => {
  try {
    const fromUser = req.user.id;
    const { targetUserId } = req.body;
    console.log("BODY:", req.body)
console.log("USER:", req.user)

    if (fromUser === targetUserId) {
      return res.status(400).json({
        message: "Cannot match with yourself"
      });
    }

    const existing = await PeerRequest.findOne({
      $or: [
        { fromUser, toUser: targetUserId },
        { fromUser: targetUserId, toUser: fromUser }
      ]
    });

    // mutual match
    if (existing && existing.fromUser.toString() === targetUserId && existing.status === "pending") {

      const roomId = generateRoomId(fromUser, targetUserId);

      existing.status = "matched";
      existing.roomId = roomId;

      await existing.save();

      // Notify the other user via socket
      const otherUserSocketId = userSockets.get(targetUserId);
      if (otherUserSocketId) {
        req.io.to(otherUserSocketId).emit("peer_matched", {
          roomId,
          matchedBy: fromUser
        });
      }

      return res.json({
        success: true,
        status: "matched",
        matched: true,
        roomId,
        users: [fromUser, targetUserId],
        message: "Mutual match!"
      });
    }

    // already requested
    if (existing) {
      return res.json({
        success: true,
        status: existing.status,
        matched: existing.status === "matched",
        message: "Request already exists"
      });
    }

    const request = await PeerRequest.create({
      fromUser,
      toUser: targetUserId,
      status: "pending"
    });

    return res.json({
      success: true,
      status: request.status,
      matched: false,
      message: "Request sent. Waiting for other user."
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Peer selection failed"
    });
  }
};

export const declinePeer = async (req, res) => {
  try {
    const userId = req.user.id;
    const { targetUserId } = req.body;

  const request = await PeerRequest.findOneAndUpdate(
      { fromUser: targetUserId, toUser: userId },
      { status: "declined" },
      { new: true }
    );

    res.json({ success: true, status: request?.status});

  } catch (error) {
    res.status(500).json({ message: "Decline failed" });
  }
};

export const getIncomingRequests = async (req, res) => {
  try {

    const userId = req.user.id;

    const requests = await PeerRequest.find({
      toUser: userId,
      status: "pending"
    }).select("fromUser createdAt");

    if (!requests.length) {
      return res.json({
        success: true,
        requests: []
      });
    }

    const userIds = requests.map(r => r.fromUser);

    const users = await userModel.find(
      { _id: { $in: userIds } },
      { trajectory: 1 }
    ).lean();

    const userMap = {};
    users.forEach(u => {
      userMap[u._id.toString()] = u;
    });

    const enrichedRequests = requests.map(reqItem => {

      const user = userMap[reqItem.fromUser.toString()];
      const dominantEmotion = user?.trajectory?.dominant_emotion;

      const reason = generateMatchReason(
        null, // no breakdown available
        dominantEmotion
      );

      return {
        request_id: reqItem._id,
        user_id: reqItem.fromUser,

        alias: generateAlias(),

        dominant_emotion: dominantEmotion,
        stability_score: user?.trajectory?.stability_score,

        reason,

        createdAt: reqItem.createdAt
      };
    });

    res.json({
      success: true,
      requests: enrichedRequests
    });

  } catch (error) {

    console.error("Error fetching incoming requests:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch incoming requests"
    });
  }
};