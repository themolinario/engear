import mongoose from "mongoose";

const MetricsSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      required: true,
    },
    streamedTimeTotal: {
      type: String,
      required: true,
    },
    rebufferingEvents: {
      type: String,
      required: true,
    },
    rebufferingTime: {
      type: String,
      required: true,
    },
    speedTest: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Metrics", MetricsSchema);
