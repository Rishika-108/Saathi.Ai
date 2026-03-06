

// Get Feed of personality cards of all users in the DB
export const getFeed = async (req, res) => {

  try {

    const journals = await JournalModel
      .find({})
      .sort({ createdAt: -1 })
      .limit(20)
      .populate("userID", "name")
      .select("text createdAt insight userID")
      .lean()

    const feed = journals.map(journal => ({
      user: {
        id: journal.userID._id,
        name: journal.userID.name
      },

      insight: journal.insight ?? null,

      latestJournal: {
        text: journal.text,
        createdAt: journal.createdAt
      }
    }))

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

    const { userId } = req.params

    const journal = await JournalModel
      .findOne({ userID: userId })
      .sort({ createdAt: -1 })
      .populate("userID", "name")
      .lean()

    if (!journal) {
      return res.status(404).json({
        success: false,
        message: "No journal found"
      })
    }

    return res.status(200).json({
      success: true,
      personalityCard: {

        user: {
          id: journal.userID._id,
          name: journal.userID.name
        },

        insight: journal.insight,

        latestJournal: {
          text: journal.text,
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

