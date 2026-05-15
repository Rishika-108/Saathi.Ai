import userModel from "../model/userModel.js";
import JournalModel from "../model/journalModel.js";
import { generateInsights } from "../config/ai.js";

export const getUserTrajectory = async (req, res) => {
  try {

    const userID = req.user.id;

    const user = await userModel.findById(
      userID,
      { trajectory: 1 }
    ).lean();

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      trajectory: user.trajectory
    });

  } catch (error) {
    console.error("Error fetching trajectory:", error);
    return res.status(500).json({
      message: "Failed to fetch trajectory"
    });
  }
};
export const getUserAnalysis = async (req, res) => {
  try {
    const userId = req.user.id; // or req.params.userId

    const journals = await JournalModel.find({ userID: userId })
      .select("analysis createdAt")
      .sort({ createdAt: 1 });

    const analysisList = journals.map(journal => ({
      ...journal.analysis,
      createdAt: journal.createdAt
    }));

    res.status(200).json({
      analysis: analysisList
    });

  } catch (error) {
    console.error("Error fetching analysis:", error);
    res.status(500).json({
      message: "Failed to fetch analysis"
    });
  }
};
export const getUserPersonalityCard = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user"
      });
    }

    // 1️⃣ Fetch user
    const user = await userModel
      .findById(userId)
      .select("name email trajectory")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // 2️⃣ Fetch latest journal
    const lastJournal = await JournalModel
      .findOne({ userID: userId })
      .sort({ createdAt: -1 })
      .select("text createdAt insight")
      .lean();

    if (!lastJournal) {
      return res.status(200).json({
        success: true,
        personalityCard: {
          user: {
            name: user.name,
            email: user.email
          },
          insight: null,
          latestJournal: null,
          emotionalState: user.trajectory ?? null,
          metadata: {
            generatedAt: new Date()
          }
        }
      });
    }

    const personalityCard = {
      user: {
        name: user.name,
        email: user.email
      },

      insight: lastJournal.insight ?? null,

      latestJournal: {
        text: lastJournal.text,
        createdAt: lastJournal.createdAt
      },

      emotionalState: user.trajectory ?? null,

      metadata: {
        generatedAt: new Date(),
        journalTimestamp: lastJournal.createdAt
      }
    };

    return res.status(200).json({
      success: true,
      personalityCard
    });

  } catch (error) {
    console.error("Personality Card Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate personality card"
    });
  }
};