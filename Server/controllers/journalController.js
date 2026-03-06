import mongoose from "mongoose";
import userModel from "../model/userModel.js";
import JournalModel from "../model/journalModel.js";
import { getPeerMatches } from "../utils/service.js";
import { generateAlias } from "../utils/aliasGenerator.js";
import { generateMatchReason } from "../utils/matchReason.js";
import PeerRequestModel from "../model/peerRequestModel.js";
import axios from "axios";

const createJournalEntry = async (req, res) => {
  try {
    const userID = req.user.id;
    const { text } = req.body;

    if (!userID || !text) {
      return res.status(400).json({ message: "userID and text are required" });
    }

    const cleanText = text.replace(/\r/g, "").trim();
    const analysisResponse = await axios.post(
      `${process.env.PYTHON_SERVICE_URL}/analyze`,
      { text: cleanText}
    );
    const analysis = analysisResponse.data;

    const newJournal = new JournalModel({
      userID,
      text,
      analysis
    });
    await newJournal.save();
    // Update the trajectory immediately
    const updatedTrajectory = await updateUserTrajectory(userID);

    return res.status(201).json({
      success: true,
      message: "Journal entry created successfully",
      journal: newJournal,
      trajectory: updatedTrajectory
    });

  } catch (error) {
    console.error("Error creating journal entry:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export async function updateUserTrajectory(userID) {
  try {
    // 1️⃣ Fetch last 2 journal entries
    const entries = await JournalModel.find({ userID })
      .sort({ createdAt: -1 }) // newest first
      .limit(2)
      .lean();

    if (!entries || entries.length === 0) {
      console.log("No journal entries found for user, setting default trajectory.");
      // Default trajectory if no entries
      const defaultTrajectory = {
        weighted_sentiment: 0.0,
        dominant_emotion: "neutral",
        emotion_vector: {},
        volatility: 0.0,
        stability_score: 1.0,
        risk_momentum: 0.0,
        memory_decay_lambda: 0.7
      };

      await userModel.findByIdAndUpdate(userID, { trajectory: defaultTrajectory });
      return defaultTrajectory;
    }

    // 2️⃣ Reverse to oldest → newest for trajectory calculation
    const orderedEntries = entries.reverse().map(e => e.analysis);

    // 3️⃣ Call the Python /trajectory endpoint
    const trajectoryResponse = await axios.post(
      `${process.env.PYTHON_SERVICE_URL}/trajectory`,
      { entries: orderedEntries }
    );

    const trajectory = trajectoryResponse.data;

    // 4️⃣ Update the user's trajectory in MongoDB
    await userModel.findByIdAndUpdate(userID, { trajectory }, { new: true });

    console.log("Trajectory updated successfully for user:", userID);
    return trajectory;

  } catch (error) {
    console.error("Error updating trajectory:", error);
    throw error;
  }
}

//const [sent, setSent] = useState(match.requestStatus === "pending");
export const fetchPeerMatches = async (req, res) => {
  try {

    const userID = req.user.id;

    const matches = await getPeerMatches(userID, 3);

    if (!matches || matches.length === 0) {
      return res.status(200).json({
        success: true,
        matches: []
      });
    }

    const matchIDs = matches.map(m => m.user_id);
    const existingRequests = await PeerRequest.find({
    $or: [
    { fromUser: userID, toUser: { $in: matchIDs } },
    { fromUser: { $in: matchIDs }, toUser: userID }
  ]
}).lean();

const requestMap = {};

existingRequests.forEach(req => {

  const otherUser =
    req.fromUser.toString() === userID
      ? req.toUser.toString()
      : req.fromUser.toString();

  requestMap[otherUser] = req.status;

});

    const users = await userModel.find(
      { _id: { $in: matchIDs } },
      { trajectory: 1 }
    ).lean();

    const userMap = {};
    users.forEach(u => {
      userMap[u._id.toString()] = u;
    });

    const enrichedMatches = matches.map(match => {

      const user = userMap[match.user_id];

      const compatibility =
        match.match_score > 0.85
          ? "Highly Compatible"
          : match.match_score > 0.7
          ? "Good Match"
          : "Potential Match";

      const dominantEmotion = user?.trajectory?.dominant_emotion;

      const reason = generateMatchReason(
        match.breakdown,
        dominantEmotion
      );

      return {
        user_id: match.user_id,
        alias: generateAlias(),

        compatibility,
        match_score: match.match_score,

        dominant_emotion: dominantEmotion,
        stability_score: user?.trajectory?.stability_score,

        reason,
        requestStatus: requestMap[match.user_id] || null
      };

    });

    return res.status(200).json({
      success: true,
      matches: enrichedMatches
    });

  } catch (error) {
    console.error("Error fetching peer matches:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch peer matches"
    });
  }
};

//To get the list of all Journals written by the User - For Frontend display 
const getUserJournal = async (req, res) => {
    try {
        const userID = req.user.id;
        if (!userID) {
            return res.status(400).json({ message: "userID is required" });
        }
        const journals = await JournalModel.find({ userID }).sort({ createdAt: -1 })
        return res.status(200).json({
            count: journals.length, journals,
        });

    } catch (error) {
        console.error("Error fetching user journals: ", error);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

// To get a particular Journal of  User - For Frontend display when user clicks on a particular Journal from the list of Journals
const getUserJournalByID = async (req, res) => {
    try {
        const userID = req.user.id;
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid journal ID." });
        }

        const journal = await JournalModel.findOne({ _id: id, userID });

        if (!journal) {
            return res.status(404).json({ message: "Journal not found." });
        }

        return res.status(200).json(journal);
    } catch (error) {
        console.error("Error fetching journal by ID:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export { createJournalEntry, getUserJournal, getUserJournalByID};