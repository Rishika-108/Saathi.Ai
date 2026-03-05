import axios from "axios";
import userModel from "../models/userModel.js";

export const getPeerMatches = async (userID, topN = 3) => {
  try {
    const users = await userModel.find(
     { _id: { $ne: userID }, trajectory: { $ne: null } },
     { trajectory: 1 }
     ).lean();

    if (!users || users.length === 0) {
      return [];
    }

    // 2️⃣ Format users for Python service
    const formattedUsers = users.map(u => ({
      id: u._id.toString(),
      trajectory: u.trajectory
    }));

    // 3️⃣ Call Python matching service
    const response = await axios.post(
      `${process.env.PYTHON_SERVICE_URL}/matching`,
      {
        users: formattedUsers,
        current_user_id: userID,
        top_n: topN
      }
    );

    return response.data.matches;

  } catch (error) {
    console.error("Peer matching failed:", error.message);
    throw error;
  }
};