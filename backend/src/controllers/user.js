import { createError } from "../error.js";
import User from "../models/User.js";
import Video from "../models/Video.js";
import { addSuffix } from "yarn/lib/cli.js";
import FastSpeedtest from "fast-speedtest-api";

export const update = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        {
          new: true,
        },
      );
      res.status(200).json(updatedUser);
    } catch (e) {
      next(e);
    }
  } else {
    return next(createError(403, "You can update only your account!"));
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User has been deleted!");
    } catch (e) {
      next(e);
    }
  } else {
    return next(createError(403, "You can delete only your account!"));
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (e) {
    next(e);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (e) {
    next(e);
  }
};

export const subscribe = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $push: { subscribedUsers: req.params.id },
    });
    await User.findByIdAndUpdate(req.params.id, {
      $inc: { subscribers: 1 },
    });
    res.status(200).json("Subscription successful.");
  } catch (e) {
    next(e);
  }
};

export const unsubscribe = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { subscribedUsers: req.params.id },
    });
    await User.findByIdAndUpdate(req.params.id, {
      $inc: { subscribers: -1 },
    });
    res.status(200).json("Unsubscription successful.");
  } catch (e) {
    next(e);
  }
};

export const like = async (req, res, next) => {
  const id = req.user.id;
  const videoId = req.params.videoId;

  try {
    await Video.findByIdAndUpdate(videoId, {
      $addToSet: {
        likes: id,
      },
      $pull: {
        dislikes: id,
      },
    });
    res.status(200).json("The video has been liked.");
  } catch (e) {
    next(e);
  }
};

export const dislike = async (req, res, next) => {
  const id = req.user.id;
  const videoId = req.params.videoId;

  try {
    await Video.findByIdAndUpdate(videoId, {
      $addToSet: {
        dislikes: id,
      },
      $pull: {
        likes: id,
      },
    });
    res.status(200).json("The video has been disliked.");
  } catch (e) {
    next(e);
  }
};

export const updateStreamedTimeByUser = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { playedSeconds } = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      { $inc: { streamedTimeTotal: playedSeconds } },
      { new: true },
    );

    if (!user) {
      return next(createError(404, "User not found!"));
    }

    res.status(200).json(user);
  } catch (e) {
    next(e);
  }
};

export const updateRebufferingEvents = async (req, res, next) => {
  try {
    const { id } = req.user;

    const user = await User.findByIdAndUpdate(id, {
      $inc: { rebufferingEvents: 1 },
    });

    if (!user) {
      return next(createError(404, "User not found!"));
    }

    res.status(200).json("Success");
  } catch (e) {
    next(e);
  }
};

export const updateRebufferingTime = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { rebufferingTime } = req.body;

    const user = await User.findByIdAndUpdate(id, {
      $inc: { rebufferingTime: rebufferingTime },
    });

    if (!user) {
      return next(createError(404, "User not found!"));
    }

    res.status(200).json(user);
  } catch (e) {
    next(e);
  }
};

export const getSpeedTest = async (req, res, next) => {
  try {
    const speedTest = new FastSpeedtest({
      token: "YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm", // required
      unit: FastSpeedtest.UNITS.Mbps,
    });

    const downloadSpeed = await speedTest.getSpeed();

    if (!downloadSpeed) {
      return next(createError(500, "Error during speed test!"));
    }

    res.json({ downloadSpeed: downloadSpeed });
  } catch (error) {
    next(error);
  }
};
