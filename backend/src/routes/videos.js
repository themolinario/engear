import express from "express";
import { verifyToken } from "../verifyToken.js";
import {
  addVideo,
  addView,
  updateStreamedTimeTotal,
  deleteVideo,
  getByTag,
  getVideo,
  random,
  search,
  sub,
  trend,
  updatedVideo,
  getVideoChunk, getVideoSegmentList
} from "../controllers/video.js";

const router = express.Router();

router.post("/", verifyToken, addVideo);
router.put("/:id", verifyToken, updatedVideo);
router.delete("/:id", verifyToken, deleteVideo);
router.get("/find/:id", getVideo);
router.post("/view/:id", addView);
router.put("/streamedTimeTotal/:id", updateStreamedTimeTotal);
router.get("/trend", trend);
router.get("/random", random);
router.get("/sub", verifyToken, sub);
router.get("/tags", getByTag);
router.get("/search", search);
router.get("/video-chunk/:id", getVideoChunk);
router.get("/video-segment-list/:id", getVideoSegmentList)

export default router;