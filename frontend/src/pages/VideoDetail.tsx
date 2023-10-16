import { useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addView, findVideoById, updateStreamedTimeTotal } from "../api/videos.ts";
import { PageLoader } from "../components/basic/PageLoader.tsx";
import { OnProgressProps } from "react-player/base";
import { formatTime, millisToMinutesAndSeconds } from "../utils/utils.ts";
import { useEffect, useRef, useState } from "react";
import { updateRebufferingEvents, updateRebufferingTime, updateStreamedTimeByUser } from "../api/user.ts";
import { useSetAtom } from "jotai";
import { metricsAtom } from "../atoms/metricsAtom.ts";

function VideoDetail() {
  const { videoId } = useParams();
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const playedSecondsRef = useRef(0);
  const playedSecondsByUserRef = useRef(0);
  const [views, setViews] = useState(0);
  const bufferingTimeRef = useRef(0);
  const setMetrics = useSetAtom(metricsAtom);

  const { data: video, isLoading } = useQuery({
    queryKey: [videoId],
    queryFn: () => findVideoById(videoId || ""),
    cacheTime: 0
  });

  const updateViewsMutation = useMutation({ mutationFn: addView });
  const updateStreamedTimeTotalMutation = useMutation({ mutationFn: updateStreamedTimeTotal });
  const updateStreamedTimeByUserMutation = useMutation(
    {
      mutationFn: updateStreamedTimeByUser,
      onSuccess: (res) => setMetrics(prev => ({...prev, streamedTime: res.data.totalStreamedTime.toString()}))
    });
  const updateRebufferingEventsMutation = useMutation({ mutationFn: updateRebufferingEvents });
  const updateRebufferingTimeMutation = useMutation({mutationFn: updateRebufferingTime})

  useEffect(() => {
    if (!isLoading) {
      console.log("isLoading", isLoading);
      updateViewsMutation.mutate(videoId);
      setViews(((video?.data?.views) ?? 0) + 1);
      setPlayedSeconds(video?.data?.streamedTimeTotal ?? 0);
    }
  }, [isLoading]);

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

  const updateStreamedTime = () => {
    if (playedSecondsRef.current) {
      updateStreamedTimeTotalMutation.mutate({ id: videoId, playedSeconds: playedSecondsRef.current });
      console.log("unmount update", playedSecondsRef.current);
    }

    if (playedSecondsByUserRef.current) {
      updateStreamedTimeByUserMutation.mutate(playedSecondsByUserRef.current);
    }
  };

  const handleProgress = (state: OnProgressProps) => {
    if (state.played) {
      setPlayedSeconds(prev => prev + 1);
      playedSecondsRef.current = playedSeconds + 1;
      console.log("progress video: ", playedSecondsRef.current);

      playedSecondsByUserRef.current += 1;
      console.log("playedSeconds", playedSecondsByUserRef.current);

    }
  };

  // Gestire il numero di rebuffering per tutta l'applicazione

  const handleBuffer = () => {
    console.log("buffer events triggered")
    bufferingTimeRef.current = Date.now()
    updateRebufferingEventsMutation.mutate()
  };

  const handleBufferEnd = () => {
    const bufferingTimeEnd = Date.now()
    bufferingTimeRef.current = bufferingTimeEnd - bufferingTimeRef.current

    updateRebufferingTimeMutation.mutate(bufferingTimeRef.current) // to go when left component
    console.log("Rebuffering time: ", bufferingTimeRef.current)
    console.log("Result of format of rebuffering:",  millisToMinutesAndSeconds( bufferingTimeRef.current))
  };


  if (isLoading) return <PageLoader />;

  return (
    <div>
      <h1>{video?.data.title}</h1>
      <div style={{ width: "100%", height: 500, position: "relative" }}>
        <ReactPlayer
          width={"100%"}
          height="100%"
          url={video?.data.videoUrl}
          onProgress={handleProgress}
          onBuffer={handleBuffer}
          onBufferEnd={handleBufferEnd}
          controls />
      </div>
      <h2>Views: {views}</h2>
      <h2>Streamed time total: {formatTime(playedSeconds)}</h2>
    </div>
  );
}

export default VideoDetail;