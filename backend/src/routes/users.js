import express from "express";
import {
  deleteUser,
  dislike,
  getCurrentUser,
  getUser,
  like,
  subscribe,
  unsubscribe, updateRebufferingEvents, updateRebufferingTime,
  // update,
  updateStreamedTimeByUser
} from "../controllers/user.js";
import {verifyToken} from "../verifyToken.js";


const router = express.Router();

// router.put("/:id", verifyToken, update);

router.delete("/:id", verifyToken, deleteUser);

router.get("/find/:id", getUser);

router.get("/currentUser", verifyToken, getCurrentUser);

router.put("/sub/:id", verifyToken, subscribe);

router.put("/unsub/:id", verifyToken, unsubscribe);

router.put("/like/:videoId", verifyToken, like);

router.put("/dislike/:videoId", verifyToken, dislike);

router.put("/streamedTimeTotal", verifyToken, updateStreamedTimeByUser);

router.put("/rebufferingEvents", verifyToken, updateRebufferingEvents);

router.put("/updateRebufferingTime", verifyToken, updateRebufferingTime)

export default router;