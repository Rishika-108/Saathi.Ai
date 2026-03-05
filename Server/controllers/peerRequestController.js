import PeerRequest from "../model/PeerRequestModel.js";
import { generateRoomId } from "../utils/room.js";

export const selectPeer = async (req, res) => {
  try {
    const fromUser = req.user.id;
    const { targetUserId } = req.body;

    if (fromUser === targetUserId) {
      return res.status(400).json({
        message: "Cannot match with yourself"
      });
    }

    // check if reverse request exists
    const reverse = await PeerRequest.findOne({
      fromUser: targetUserId,
      toUser: fromUser,
      status: "pending"
    });

    if (reverse) {

      reverse.status = "matched";
      await reverse.save();
      const roomId = generateRoomId(fromUser, targetUserId);

      return res.json({
        matched: true,
        roomId,
        users: [fromUser, targetUserId],
        message: "Mutual match!"
      });
    }

    // create pending request
    await PeerRequest.create({
      fromUser,
      toUser: targetUserId
    });

    return res.json({
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

    await PeerRequest.findOneAndUpdate(
      { fromUser: targetUserId, toUser: userId },
      { status: "declined" }
    );

    res.json({ success: true });

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

    res.json({
      success: true,
      requests
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch incoming requests"
    });
  }
};