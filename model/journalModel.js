import mongoose, { Schema } from 'mongoose'

// We may need to remove this
const TriggerSchema = new mongoose.Schema({
    triggerID : {type: Schema.Types.ObjectId},
    triggerPoint : {type : String, required: true},
    triggerScene : {type: String, required: true},
})

// We may need to remove this
const SolutionSchema = new mongoose.Schema({
    triggerID: {type: String, required: true},
    // suggestionText : {type: String, required: true},
    steps: [
    {
      stepNumber: { type: Number, required: true },
      description: { type: String, required: true }
    }
  ],
    status : {type: String, enum: ['pending', 'completed', 'dismissed'], default: 'pending'}
})

const JournalEntrySchema = new mongoose.Schema({
    userID : {type: Schema.Types.ObjectId, required: true, ref: 'user'},
    text : {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    // triggers: [TriggerSchema],
    // solutions: [SolutionSchema]
})

const JournalModel = mongoose.model.journal || mongoose.model ('journal', JournalEntrySchema)

export default JournalModel