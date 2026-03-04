import mongoose from 'mongoose'

const TrajectorySchema = new mongoose.Schema({
    weighted_sentiment: Number,
    dominant_emotion: String,
    emotion_vector: {
        type: Map,
        of: Number
    },
    volatility: Number,
    stability_score: Number,
    risk_score: Number,
    risk_level: String,
    risk_momentum: Number,
    memory_decay_lambda: Number,
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, { _id: false })

const userSchema = new mongoose.Schema({
    name : {type: String, required: true, unique: true},
    email : {type: String, required: true, unique: true},
    password: {type: String, required: true},
    trajectory: {
        type: TrajectorySchema,
        default: null
    }
})
userSchema.index({ "trajectory.dominant_emotion": 1 })
userSchema.index({ "trajectory.weighted_sentiment": 1 })
userSchema.index({ "trajectory.risk_momentum": 1 })

const userModel = mongoose.models.user || mongoose.model('user', userSchema)

export default userModel;