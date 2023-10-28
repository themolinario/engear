import moongose from "mongoose";
import Metrics from "../models/Metrics.js";

export const addMetrics = async (req, res, next) => {
  let oldMetrics;
  try {
    oldMetrics = await Metrics.findOne({
      userId: new moongose.Types.ObjectId(req.user.id),
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Could not find metrics" });
  }

  const newMetrics = new Metrics({
    userId: new moongose.Types.ObjectId(req.user.id),
    ...req.body,
  });

  let savedMetrics;

  if (!oldMetrics) {
    try {
      savedMetrics = await newMetrics.save();
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Could not save metrics" });
    }
  } else {
    try {
      await Metrics.findOneAndDelete({ _id: oldMetrics._id });
      savedMetrics = await newMetrics.save();
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Could not find and update metrics" });
    }
  }

  try {
    res.status(200).json(savedMetrics);
  } catch (e) {
    next(e);
  }
};

export const getAllMetrics = async (req, res, next) => {
  try {
    const metrics = await Metrics.find();
    res.status(200).json(metrics);
  } catch (e) {
    next(e);
  }
};
