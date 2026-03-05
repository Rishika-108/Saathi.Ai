import userModel from "../model/userModel.js";
import JournalModel from "../model/journalModel.js";

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