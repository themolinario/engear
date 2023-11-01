import Video from "../models/Video.js";
import { createError } from "../error.js";
import User from "../models/User.js";
import { imagekit, WEBHOOK_EXPIRY_DURATION, WEBHOOK_SECRET } from "../config/imageKit.js";

export const addVideo = async (req, res, next) => {
  const newVideo = new Video({
    userId: req.user.id,
    ...req.body,
  });
  try {
    const savedVideo = await newVideo.save();
    res.status(200).json(savedVideo);
  } catch (e) {
    next(e);
  }
};

export const updatedVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return next(createError(404, "Video not found!"));
    if (req.user.id === video.userId) {
      const updatedVideo = await Video.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        {
          new: true,
        },
      );
      res.status(200).json(updatedVideo);
    } else {
      return next(createError(403, "You can update only your videos!"));
    }
  } catch (e) {
    next(e);
  }
};

export const deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return next(createError(404, "Video not found!"));
    if (req.user.id === video.userId) {
      await Video.findByIdAndDelete(req.params.id);
      res.status(200).json("Video deleted");
    } else {
      return next(createError(403, "You can delete only your videos!"));
    }
  } catch (e) {
    next(e);
  }
};

export const getVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    res.status(200).json(video);
  } catch (e) {
    next(e);
  }
};

export const addView = async (req, res, next) => {
  try {
    await Video.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 },
    });
    res.status(200).json("Views increased");
  } catch (e) {
    next(e);
  }
};

export const updateStreamedTimeTotal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { playedSeconds } = req.body;

    const updatedVideo = await Video.findByIdAndUpdate(
      id,
      { streamedTimeTotal: playedSeconds },
      { new: true },
    );

    if (!updatedVideo) {
      return next(createError(404, "Video not found!"))
    }

    return res.status(200).json(updatedVideo)

  } catch (e) {
    next(e);
  }
};

export const random = async (req, res, next) => {
  try {
    const videos = await Video.aggregate([{ $sample: { size: 40 } }]);
    res.status(200).json(videos);
  } catch (e) {
    next(e);
  }
};

export const trend = async (req, res, next) => {
  try {
    const videos = await Video.find().sort({
      views: -1,
    });
    res.status(200).json(videos);
  } catch (e) {
    next(e);
  }
};

export const sub = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const subscribedChannels = user.subscribedUsers;

    const list = await Promise.all(
      subscribedChannels.map((channelId) => {
        return Video.find({ userId: channelId });
      }),
    );

    res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt));
  } catch (e) {
    next(e);
  }
};

export const getByTag = async (req, res, next) => {
  const tags = req.query.tags.split(",");

  try {
    const videos = await Video.find({
      tags: {
        $in: tags,
      },
    }).limit(20);
    res.status(200).json(videos);
  } catch (e) {
    next(e);
  }
};

export const search = async (req, res, next) => {
  const query = req.query.q;
  try {
    const videos = await Video.find({
      title: {
        $regex: query,
        $options: "i",
      },
    }).limit(40);
    res.status(200).json(videos);
  } catch (e) {
    next(e);
  }
};

export const videoImageKitWebhook = async(req, res, next) => {
  const signature = req.headers["x-ik-signature"];
  const requestBody = req.body;

  let webhookResult;
  try {
    webhookResult = imagekit.verifyWebhookEvent(JSON.stringify(requestBody), signature, WEBHOOK_SECRET);
  } catch (e) {
    // `verifyWebhookEvent` method will throw an error if signature is invalid
    console.log(e);
    res.status(400).send(`Webhook Error`);
  }

  const { timestamp, event } = webhookResult;

  // Check if webhook has expired
  if (timestamp + WEBHOOK_EXPIRY_DURATION < Date.now()) {
    res.status(400).send(`Webhook Error`);
  }

  // Handle webhook
  switch (event.type) {
    case 'video.transformation.accepted':
      console.log("video.transformation.accepted")
      // It is triggered when a new video transformation request is accepted for processing. You can use this for debugging purposes.
      break;
    case 'video.transformation.ready':
      console.log("video.transformation.ready")
      // It is triggered when a video encoding is finished, and the transformed resource is ready to be served. You should listen to this webhook and update any flag in your database or CMS against that particular asset so your application can start showing it to users.
      break;
    case 'video.transformation.error':
      console.log("video.transformation.error")
      // It is triggered if an error occurs during encoding. Listen to this webhook to log the reason. You should check your origin and URL-endpoint settings if the reason is related to download failure. If the reason seems like an error on the ImageKit side, then raise a support ticket at support@imagekit.io.
      break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}`);
      return res.status(400).end();
  }

// Return a 200 response to acknowledge receipt of the event
  res.status(200).json({received: true});

}



