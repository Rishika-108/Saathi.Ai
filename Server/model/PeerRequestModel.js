import mongoose from "mongoose";

const peerRequestSchema = new mongoose.Schema({
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  roomId: {
    type: String,
    unique: true
  },
  status: {
    type: String,
    enum: ["pending", "matched", "declined"],
    default: "pending"
  }
}, { timestamps: true });

peerRequestSchema.index({ fromUser: 1, toUser: 1 }, { unique: true });

const PeerRequest =
  mongoose.models.PeerRequest ||
  mongoose.model("PeerRequest", peerRequestSchema);

export default PeerRequest;