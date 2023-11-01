import Video from "../models/Video.js";
import { createError } from "../error.js";
import User from "../models/User.js";
import { getChunkProps } from "../utils/index.js";
import https from "https";
import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import os from 'os';
import path from "path";
import fs from 'fs'

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

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
      return next(createError(404, "Video not found!"));
    }

    return res.status(200).json(updatedVideo);
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

export const getVideoChunk = async (req, res, next) => {
  const video = await Video.findById(req.params.id);

  const fileSize = video.size;
  const resolvedPath = video.videoUrl;

  const requestRangeHeader = req.headers.range;

  try {
    if (!requestRangeHeader) {
      res.writeHead(200, {
        "Content-Length": fileSize,
        "Content-Type": "video/mp4",
      });

      https.get(resolvedPath, (stream) => {
        stream.pipe(res);
      });
    } else {
      const { start, end, chunkSize } = getChunkProps(
        requestRangeHeader,
        fileSize,
      );

      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": "video/mp4",
      });

      const options = {
        headers: {
          Range: `bytes=${start}-${end}`,
        },
      };

      https.get(resolvedPath, options, (stream) => {
        stream.pipe(res);
      });
    }
  } catch (e) {
    next(e);
  }
};

export const getVideoSegmentList = async (req, res, next) => {
  const video = await Video.findById(req.params.id);

  const resolvedPath = video.videoUrl;

  const subFolderPath = 'segments'
  const tmpDir = os.tmpdir()

  const fullPath = path.join(tmpDir, subFolderPath)
  console.log("fullPath", fullPath)

  if (!fs.existsSync(fullPath)){
    fs.mkdirSync(fullPath);
  }

  const command = ffmpeg(resolvedPath, { timeout: 432000 })
    .addOption([
      "-profile:v baseline",
      "-f segment",
      "-level 3.0",
      "-start_number 0",
      "-hls_base_url segments/",
      "-hls_segment_filename ".concat(path.join(fullPath,"file%03d.ts")), //../../assets/segments/file%03d.ts
      "-hls_time 6",
      "-hls_list_size 0",
      "-f hls",
    ])
      // "../../assets/segments/output.m3u8"
    .output(path.join(fullPath, "output.m3u8"))
    .on("end", (stdout, stderr) => {
      console.log("Transcoding succeeded !");
      process.exit(1);
    })
    .on("start", (commandLine) => {
      console.log("start", commandLine);
    })
    .on("codecData", (data) => {
      console.log(
        "Input is " + data.audio + " audio " + "with " + data.video + " video",
      );
    })
    .on("progress", function (progress) {
      console.log("Processing. Timemark: -> " + progress.timemark);
    })
    .on("stderr", function (stderrLine) {
      // do nothing
    })
    .on("error", function (err, stdout, stderr) {
      console.log("Cannot process video: " + err.message);
      console.log("stdout:\n" + stdout);
      console.log("stderr:\n" + stderr);
      process.exit(1);
    })
    .on("data", function (chunk) {
      console.log("ffmpeg just wrote " + chunk.length + " bytes");
    });

  command.run();
};


/*
export const getVideoSegmentList = async (req, res, next) => {

  const subFolderPath = 'segments'
  const tmpDir = os.tmpdir()

  const fullPath = path.join(tmpDir, subFolderPath)
  console.log("fullPath", fullPath)

  res.sendFile(fullPath);
}
*/
