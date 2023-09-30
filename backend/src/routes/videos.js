import express from "express";
import {verifyToken} from "../verifyToken.js";
import {
    addVideo,
    addView,
    deleteVideo,
    getByTag,
    getVideo,
    random, search,
    sub,
    trend,
    updatedVideo
} from "../controllers/video.js";


const router = express.Router();

router.post("/", verifyToken, addVideo);
router.put("/:id", verifyToken, updatedVideo);
router.delete("/:id", verifyToken, deleteVideo);
router.get("/find/:id", getVideo);
router.post("/view/:id", addView);
router.get("/trend", trend);
router.get("/random", random);
router.get("/sub", verifyToken, sub);
router.get("/tags", getByTag);
router.get("/search", search);


export default router;