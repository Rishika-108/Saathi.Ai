import mongoose from "mongoose";
import JournalModel from "../model/journalModel.js";

// Get Feed of personality cards of all users in the DB
export const getFeed = async (req, res) => {

  try {

    const journals = await JournalModel
      .find({})
      .sort({ createdAt: -1 })
      .limit(20)
      .populate("userID", "name trajectory publicUndercurrent")
      .select("text createdAt insight userID")
      .lean()

    const feed = journals.map(journal => {
      const traj = journal.userID.trajectory || {};
      const undercurrent = journal.userID.publicUndercurrent || "Navigating a quiet period of inner reflection.";

      return {
        user: {
          id: journal.userID._id,
          name: journal.userID.name,
          trajectory: traj
        },
        publicSummary: undercurrent,
        latestJournal: {
          createdAt: journal.createdAt
        }
      };
    })

    return res.status(200).json({
      success: true,
      count: feed.length,
      feed
    })

  } catch (error) {

    console.error("Feed Error:", error)

    return res.status(500).json({
      success: false,
      message: "Failed to load feed"
    })

  }

}

// Get the personality card of an individual user by their ID
export const getIndividualPersonalityCard = async (req, res) => {

  try {

    const { id } = req.params

    const journal = await JournalModel
      .findOne({ userID: id })
      .sort({ createdAt: -1 })
      .populate("userID", "name trajectory publicUndercurrent")
      .lean()

    if (!journal) {
      return res.status(404).json({
        success: false,
        message: "No journal found"
      })
    }

    const traj = journal.userID.trajectory || {};
    const summary = journal.userID.publicUndercurrent || "Navigating a quiet period of inner reflection.";

    return res.status(200).json({
      success: true,
      personalityCard: {
        user: {
          id: journal.userID._id,
          name: journal.userID.name
        },
        emotionalState: {
          dominantEmotion: traj.dominant_emotion || "neutral",
          stability: traj.stability_score || 0,
          vector: traj.emotion_vector || {}
        },
        publicSummary: summary,
        latestJournal: {
          createdAt: journal.createdAt
        }
      }
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      success: false,
      message: "Failed to load personality card"
    })

  }

}

