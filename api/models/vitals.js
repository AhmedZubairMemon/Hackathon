import mongoose from "mongoose";

const vitalsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    bp: String,
    sugar: String,
    weight: String,
    notes: String,
  },
  { timestamps: true }
);

export default mongoose.model("Vitals", vitalsSchema);