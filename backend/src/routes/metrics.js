import express from "express";
import { addMetrics, getAllMetrics } from "../controllers/metrics.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

router.post("/", addMetrics);
router.get("/general", getAllMetrics);

export default router;
