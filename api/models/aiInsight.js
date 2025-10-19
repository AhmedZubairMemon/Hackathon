import mongoose from "mongoose";

const aiInsightSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      ref: "User",
      required: false,
    },
    fileId: {
      type: String,
      ref: "File",
      required: false,
    },
    englishSummary: {
      type: String,
      required: true,
    },
    romanUrduSummary: {
      type: String,
      required: true,
    },
    doctorQuestions: {
      type: [String], // Gemini se aane wale sawalat
    },
  },
  { timestamps: true }
);

export default mongoose.model("AiInsight", aiInsightSchema);