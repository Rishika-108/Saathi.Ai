import mongoose from "mongoose";
import JournalModel from "../model/journalModel.js";
import { analyzeJournal } from "../config/ai.js";


// To save the written Journal of the User in the database
const createJournalEntry = async (req, res) => {
    try {
        const userID = req.user.id;
        const { text } = req.body;
        if (!userID || !text) {
            return res.status(400).json({ message: "userID and text are required" })
        }
        const newJournal = new JournalModel({
            userID,
            text,
        })
        await newJournal.save();
        return res.status(201).json({ success: true, message: "Journal entry created successfully", journal: newJournal })
    } catch (error) {
        console.error("Error creating journal entry: ", error);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

//To get the list of all Journals written by the User
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

// To get a particular Journal of  User

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

// To analyse the Journal of the User - this may change if our model changes
const runAnalyser = async (req, res) => {
    try {
        const { id } = req.params;
        const userID = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid journal ID." });
        }

        // Fetch the journal for this user
        const journal = await JournalModel.findOne({ _id: id, userID });
        if (!journal) {
            return res.status(404).json({ message: "Journal not found or unauthorized." });
        }

        // 1️⃣ Call AI service
        const parsedCards = await analyzeJournal(journal.text);

        // 2️⃣ Map AI response to schema
        const triggers = parsedCards.map((card) => ({
            triggerID: new mongoose.Types.ObjectId(),
            triggerPoint: card.Trigger,
            triggerScene: card.Scene,
        }));

        // const solutions = parsedCards.map((card, index) => ({
        //   triggerID: triggers[index]?.triggerID.toString(),
        // //   suggestionText: Array.isArray(card.Solution) ? card.Solution.join(" ") : card.Solution,
        // steps: Array.isArray(card.Solution)
        // ? card.Solution.map((text, i) => ({
        //     stepNumber: i + 1,
        //     description: text
        //   }))
        // : [
        //     {
        //       stepNumber: 1,
        //       description: card.Solution || "No suggestion provided"
        //     }
        //   ],
        //   status: "pending",
        // }));
        const solutions = parsedCards.map((card, index) => {
            // 1️⃣ Normalize solution text to a single string
            let solutionText = "";

            if (Array.isArray(card.Solution)) {
                solutionText = card.Solution.join(" "); // if AI returned an array
            } else if (typeof card.Solution === "string") {
                solutionText = card.Solution; // if AI returned a single string
            } else {
                solutionText = ""; // fallback if undefined or invalid
            }

            // 2️⃣ Split steps safely
            const stepTexts = solutionText.split(/Step \d+: /).filter(Boolean);

            // 3️⃣ Map into step objects
            const steps = stepTexts.map((text, i) => ({
                stepNumber: i + 1,
                description: text.trim()
            }));

            return {
                triggerID: triggers[index]?.triggerID.toString(),
                steps: steps.length > 0 ? steps : [{ stepNumber: 1, description: "No suggestion available" }],
                status: "pending"
            };
        });


        // 3️⃣ Save into MongoDB
        journal.triggers = triggers;
        journal.solutions = solutions;
        await journal.save();

        res.status(200).json({
            message: "AI analysis completed successfully",
            triggers,
            solutions,
        });
    } catch (err) {
        console.error("❌ runAnalyser Error:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export { createJournalEntry, getUserJournal, getUserJournalByID, runAnalyser };