import mongoose from "mongoose";

const MetricsSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    userAgent: {
      type: String,
      required: true,
    },
    streamedTime: {
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
    views: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Metrics", MetricsSchema);
