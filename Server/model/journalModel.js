import mongoose, { Schema } from 'mongoose'

const AnalysisSchema = new Schema({
    emotion: {
        vector: { type: Map, of: Number },
        dominant: String,
        intensity: Number,
        entropy: Number,
        stability_index: Number
    },
    sentiment: {
        score: Number,
        label: String
    },
    theme: {
        primary: String,
        primary_confidence: Number,
        secondary: String,
        secondary_confidence: Number,
        all_detected: [{
            theme: String,
            confidence: Number
        }]
    },
    growth_signal: Number,
    risk: {
        score: Number,
        level: {
            type: String,
            enum: ['low', 'moderate', 'high']
        }
    },
    metadata: {
        word_count: Number,
        timestamp: String
    },
    model_version: String
}, { _id: false })
const InsightSchema = new Schema({
  title: String,
  narrative: String
}, { _id: false })

const JournalEntrySchema = new mongoose.Schema({
    userID : {type: Schema.Types.ObjectId, required: true, ref: 'user'},
    text : {type: String, required: true},
     analysis: {
        type: AnalysisSchema,
        required: true // change it to true, after checking that model gives output
    },
    insight: InsightSchema,
    createdAt: {type: Date, default: Date.now}
})
JournalEntrySchema.index({ userID: 1, createdAt: -1 })

const JournalModel = mongoose.models.journal || mongoose.model ('journal', JournalEntrySchema)

export default JournalModel