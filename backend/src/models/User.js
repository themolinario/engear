import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    img: {
      type: String,
    },
    subscribers: {
      type: Number,
      default: 0,
    },
    subscribedUsers: {
      type: [String],
    },
    streamedTimeTotal: {
      type: Number,
      default: 0,
    },
    streamedData: {
      type: Number,
      default: 0,
    },
    rebufferingEvents: {
      type: Number,
      default: 0,
    },
    rebufferingTime: {
      type: Number,
      default: 0,
    },
    roles: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("User", UserSchema);
