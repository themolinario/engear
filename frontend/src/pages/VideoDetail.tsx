import { useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addView, findVideoById, getSegments, updateStreamedTimeTotal } from "../api/videos.ts";
import { PageLoader } from "../components/basic/PageLoader.tsx";
import { OnProgressProps } from "react-player/base";
import { formatTime, millisToMinutesAndSeconds } from "../utils/utils.ts";
import { useEffect, useRef, useState } from "react";
import { updateRebufferingEvents, updateRebufferingTime, updateStreamedTimeByUser } from "../api/user.ts";
import { useSetAtom } from "jotai";
import { metricUserAtom } from "../atoms/metricsAtom.ts";
import { IMetricUser } from "../types/Metrics.ts";
import Button from "@mui/material/Button";

function VideoDetail() {
  const { videoId } = useParams();
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const playedSecondsRef = useRef(0);
  const playedSecondsByUserRef = useRef(0);
  const bufferingTimeRef = useRef(0);
  const setMetrics = useSetAtom(metricUserAtom);
  const [baseURL, setBaseURL] = useState("");
  const [showLevels, setShowLevels] = useState(false);

  const {data: segments} = useQuery({
    queryKey: ["segments"],
    queryFn: () => getSegments(baseURL.replace("?","/240p-pl.m3u8?tr=sr-240_360_480_720&")),
    enabled: baseURL != "" && showLevels,
    refetchOnWindowFocus: false
  });

  const videoMutations = {
    updateViews: useMutation({ mutationFn: addView }),
    updateStreamedTimeByVideo: useMutation({ mutationFn: updateStreamedTimeTotal })
  };

  const userMutations = {
    updateStreamedTimeByUser: useMutation(
      {
        mutationFn: updateStreamedTimeByUser,
        onSuccess: (res) =>
          setMetrics((prev: IMetricUser) => ({ ...prev, streamedTimeTotal: res.data?.streamedTimeTotal }))
      }),
    updateRebufferingEvents: useMutation({ mutationFn: updateRebufferingEvents }),
    updateRebufferingTime: useMutation({ mutationFn: updateRebufferingTime })
  };

  const { data: dataVideo, isLoading } = useQuery({
    queryKey: ["video",videoId],
    queryFn: () => findVideoById(videoId || ""),
    onSuccess: ({ data }) => {
      videoMutations.updateViews.mutate(videoId);
      setPlayedSeconds(data?.streamedTimeTotal ?? 0);
      setBaseURL(data.videoUrl.replace("https://firebasestorage.googleapis.com","https://ik.imagekit.io/mmolinari"))
    },
    refetchOnWindowFocus: false
  });

  const updateStreamedTime = () => {
    if (playedSecondsRef.current) {
      videoMutations.updateStreamedTimeByVideo.mutate({ id: videoId, playedSeconds: playedSecondsRef.current });
      console.log("unmount update", playedSecondsRef.current);
    }

    if (playedSecondsByUserRef.current) {
      userMutations.updateStreamedTimeByUser.mutate(playedSecondsByUserRef.current);
    }
  };
  useEffect(() => {
    // mount
    console.log("mount", videoId);
    const handleBeforeUnLoad = () => {
      updateStreamedTime();
    };

    window.addEventListener("beforeunload", handleBeforeUnLoad);

    return () => {
      // umount
      console.log("unmount", playedSecondsRef.current);

      window.removeEventListener("beforeunload", handleBeforeUnLoad);
      updateStreamedTime();

    };
  }, []);


  const handleProgress = (state: OnProgressProps) => {
    if (state.played) {
      updateStreamVideoTimeByVideo();
      updateStreamVideoTimeByUser();
    }
  };

  const updateStreamVideoTimeByVideo = () => {
    setPlayedSeconds(prev => prev + 1);
    playedSecondsRef.current = playedSeconds + 1;
    console.log("progress video: ", playedSecondsRef.current);
  };

  const updateStreamVideoTimeByUser = () => {
    playedSecondsByUserRef.current += 1;
    console.log("playedSeconds", playedSecondsByUserRef.current);
  };

  const handleBuffer = () => {
    console.log("buffer events triggered");
    bufferingTimeRef.current = Date.now();
    userMutations.updateRebufferingEvents.mutate();
  };

  const handleBufferEnd = () => {
    const bufferingTimeEnd = Date.now();
    if (bufferingTimeRef.current) {
      bufferingTimeRef.current = bufferingTimeEnd - bufferingTimeRef.current;
      userMutations.updateRebufferingTime.mutate(bufferingTimeRef.current); // to go when left component
    }
    console.log("Rebuffering time: ", bufferingTimeRef.current);
    console.log("Result of format of rebuffering:", millisToMinutesAndSeconds(bufferingTimeRef.current));
  };

  if (isLoading) return <PageLoader />;
  const videoUrlKit =
    baseURL.replace("?","/ik-master.m3u8?tr=sr-240_360_480_720&");

  return (
    <div>
      <h1>{dataVideo?.data.title}</h1>
      <div style={{ width: "100%", height: 500, position: "relative" }}>
          <ReactPlayer
          width={"100%"}
          height="100%"
          url={videoUrlKit}
          onProgress={handleProgress}
          onBuffer={handleBuffer}
          onBufferEnd={handleBufferEnd}
          controls
        />

      </div>
      <h2>Views: {dataVideo?.data.views}</h2>
      <h2>Streamed time total: {formatTime(playedSeconds)}</h2>
      <h2>Levels: {showLevels && (segments?.data.match(/EXTINF/g) || []).length}</h2>
      <Button variant="contained" onClick={() => setShowLevels(true)}>Show Levels</Button>
    </div>
  );
}

export default VideoDetail;