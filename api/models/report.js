import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  fileUrl: {
    type: String,
    required: true,
  },
  englishSummary: {
    type: String,
    required: false,
  },
  romanUrduSummary: {
    type: String,
    required: false,
  },
});

export default mongoose.model("Report", reportSchema)