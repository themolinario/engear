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
import { metricUserAtom } from "../atoms/metricsAtom.ts";
import { IMetricUser } from "../types/Metrics.ts";

function VideoDetail() {
  const { videoId } = useParams();
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const playedSecondsRef = useRef(0);
  const playedSecondsByUserRef = useRef(0);
  const bufferingTimeRef = useRef(0);
  const setMetrics = useSetAtom(metricUserAtom);

  const queryOptions = { refetchOnWindowFocus: false };

  const updateViewsMutation = useMutation({ mutationFn: addView });
  const { data: datVideo, isLoading } = useQuery({
    queryKey: [videoId],
    queryFn: () => findVideoById(videoId || ""),
    onSuccess: () => {
      updateViewsMutation.mutate(videoId);
    },
    cacheTime: 0,
    ...queryOptions
  });


  const updateStreamedTimeByVideoMutation = useMutation({ mutationFn: updateStreamedTimeTotal });
  const updateStreamedTimeByUserMutation = useMutation(
    {
      mutationFn: updateStreamedTimeByUser,
      onSuccess: (res) =>
        setMetrics((prev: IMetricUser) => ({ ...prev, streamedTimeTotal: res.data?.streamedTimeTotal }))
    });
  const updateRebufferingEventsMutation = useMutation({ mutationFn: updateRebufferingEvents });
  const updateRebufferingTimeMutation = useMutation({ mutationFn: updateRebufferingTime });

  useEffect(() => {
    if (!isLoading) {
      setPlayedSeconds(datVideo?.data?.streamedTimeTotal ?? 0);
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
      updateStreamedTimeByVideoMutation.mutate({ id: videoId, playedSeconds: playedSecondsRef.current });
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
    console.log("buffer events triggered");
    bufferingTimeRef.current = Date.now();
    updateRebufferingEventsMutation.mutate();
  };

  const handleBufferEnd = () => {
    const bufferingTimeEnd = Date.now();
    if (bufferingTimeRef.current) {
      bufferingTimeRef.current = bufferingTimeEnd - bufferingTimeRef.current;
      updateRebufferingTimeMutation.mutate(bufferingTimeRef.current); // to go when left component
    }
    console.log("Rebuffering time: ", bufferingTimeRef.current);
    console.log("Result of format of rebuffering:", millisToMinutesAndSeconds(bufferingTimeRef.current));
  };


  if (isLoading) return <PageLoader />;

  return (
    <div>
      <h1>{datVideo?.data.title}</h1>
      <div style={{ width: "100%", height: 500, position: "relative" }}>
        <ReactPlayer
          width={"100%"}
          height="100%"
          url={datVideo?.data.videoUrl}
          onProgress={handleProgress}
          onBuffer={handleBuffer}
          onBufferEnd={handleBufferEnd}
          controls />
      </div>
      <h2>Views: {datVideo?.data.views}</h2>
      <h2>Streamed time total: {formatTime(playedSeconds)}</h2>
    </div>
  );
}

export default VideoDetail;