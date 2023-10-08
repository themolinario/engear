import { useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addView, findVideoById, updateStreamedTimeTotal } from "../api/videos.ts";
import { PageLoader } from "../components/basic/PageLoader.tsx";
import { OnProgressProps } from "react-player/base";
import { formatTime } from "../utils/utils.ts";
import { useEffect, useRef, useState } from "react";
import { updateStreamedTimeByUser } from "../api/user.ts";

function VideoDetail() {
  const { videoId } = useParams();
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const playedSecondsRef = useRef(0);
  const playedSecondsByUserRef = useRef(0);
  const [views, setViews] = useState(0);

  const { data: video, isLoading } = useQuery({
    queryKey: [videoId],
    queryFn: () => findVideoById(videoId || ""),
    cacheTime: 0
  });

  const updateViewsMutation = useMutation({ mutationFn: addView });
  const updateStreamedTimeTotalMutation = useMutation({ mutationFn: updateStreamedTimeTotal });
  const updateStreamedTimeByUserMutation = useMutation({ mutationFn: updateStreamedTimeByUser });

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

      playedSecondsByUserRef.current = state.playedSeconds;
      console.log("playedSeconds", playedSecondsByUserRef.current)

    }
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
          controls />
      </div>
      <h2>Views: {views}</h2>
      <h2>Streamed time total: {formatTime(playedSeconds)}</h2>
    </div>
  );
}

export default VideoDetail;