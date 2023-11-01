import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema({
        userId: {
            type: String,
            required: true,
            unique: true
        },
        title: {
            type: String,
            required: true
        },
        desc: {
            type: String,
            required: true
        },
        imgUrl: {
            type: String,
            required: true
        },
        videoUrl: {
            type: String,
            required: true
        },
        views: {
            type: Number,
            default: 0
        },
        streamedTimeTotal: {
            type: Number,
            default: 0
        },
        tags: {
            type: [String],
            default: []
        },
        likes: {
            type: [String],
            default: []
        },
        dislikes: {
            type: [String],
            default: []
        },
        size: {
          type: Number,
          default: 0
        }

    }, {timestamps: true}
);

export default mongoose.model("Video", VideoSchema);