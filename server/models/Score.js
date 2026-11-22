import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema({
  player: String,
  score: Number,
  date: { type: Date, default: Date.now }
});

export default mongoose.model("Score", scoreSchema);
