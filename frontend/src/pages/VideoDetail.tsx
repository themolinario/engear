import { useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addView, findVideoById, getSegments, /*getSegments,*/ updateStreamedTimeTotal } from "../api/videos.ts";
import { PageLoader } from "../components/basic/PageLoader.tsx";
import { OnProgressProps } from "react-player/base";
import { formatBytes, formatTime, millisToMinutesAndSeconds } from "../utils/utils.ts";
import { useEffect, useRef, useState } from "react";
import {
  updateRebufferingEvents,
  updateRebufferingTime,
  updateStreamedData,
  updateStreamedTimeByUser
} from "../api/user.ts";
import { useSetAtom } from "jotai";
import { metricUserAtom } from "../atoms/metricsAtom.ts";
import { IMetricUser } from "../types/Metrics.ts";
import Button from "@mui/material/Button";

const BAND_WIDTH = {
  "240p": 376304,
  "360p": 602669,
  "480p": 1000545,
  "720p": 2132636
};

function VideoDetail() {
  const { videoId } = useParams();
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const playedSecondsRef = useRef(0);
  const playedSecondsByUserRef = useRef(0);
  const bufferingTimeRef = useRef(0);
  const setMetrics = useSetAtom(metricUserAtom);
  const [baseURL, setBaseURL] = useState("");
  const [infoLevels, setInfoLevels] = useState({
    activeLevels: false,
    numberLevels: 0,
    showLevels: false
  });
  const [bandWidth, setBandWidth] = useState("");
  const apiCallsRef = useRef([""]);
  const countRef = useRef(0);
  const [isLoadingVideo, setIsLoadingVideo] = useState(true);

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
    updateStreamedData: useMutation(
      {
        mutationFn: updateStreamedData,
        onSuccess: (res) =>
          setMetrics((prev: IMetricUser) => ({ ...prev, streamedData: res.data?.streamedData }))
      }),
    updateRebufferingEvents: useMutation({ mutationFn: updateRebufferingEvents }),
    updateRebufferingTime: useMutation({ mutationFn: updateRebufferingTime })
  };

  const { data: dataVideo, isLoading } = useQuery({
    queryKey: ["video", videoId],
    queryFn: () => findVideoById(videoId || ""),
    onSuccess: ({ data }) => {
      videoMutations.updateViews.mutate(videoId);
      setPlayedSeconds(data?.streamedTimeTotal ?? 0);
      setBaseURL(data.videoUrl.replace("https://firebasestorage.googleapis.com", "https://ik.imagekit.io/mmolinari"));
    },
    enabled: !isLoadingVideo,
    refetchOnWindowFocus: false
  });

  useQuery({
    queryKey: ["segments"],
    queryFn: () => getSegments(baseURL.replace("?", "/ik-master.m3u8?tr=sr-240_360_480_720&")),
    refetchInterval: (data) => {
      if (data?.status === 202) {
        return 5000;
      } else {
        setIsLoadingVideo(false);
        return false;
      }

    },
    enabled: baseURL != "",
    cacheTime: 0,
    refetchOnWindowFocus: false
  });

  useEffect(() => {

    if (infoLevels.activeLevels) {
      console.log("apiCallRef", apiCallsRef.current);

      const segments = getSegmentsLevels(apiCallsRef.current);
      console.log("segments", segments);

      const bandWidth = getBandWidthDistribution(segments);
      setBandWidth(formatBytes(bandWidth));

      setInfoLevels(prevState =>
        ({ ...prevState, numberLevels: getLevelsNumber(segments), showLevels: true }));

      infoLevels.activeLevels = false;

    }

  }, [infoLevels.activeLevels]);

  const updateStreamedDataTotal = () => {
    const segments = getSegmentsLevels(apiCallsRef.current);

    const bandWidth = getBandWidthDistribution(segments);

    console.log("bandWidth mutation", bandWidth);

    userMutations.updateStreamedData.mutate(bandWidth);

  };

  const setApiXmlHttpRequest = () => {
    // let apiCalls: string[] = [];

    const observer = new PerformanceObserver((list) => {

      // @ts-ignore
      list.getEntries().forEach(({ initiatorType, name }) => {
        if (initiatorType === "xmlhttprequest") {
          apiCallsRef.current.push(name);
        }
      });
    });

    observer.observe({ type: "resource", buffered: true });

    // return apiCalls;

  };

  const getSegmentsLevels = (apiCallsResult: string[]) => {
    const regex = /\/(\d+p)-segs/;
    let segments = [];

    for (const apiCall of apiCallsResult) {
      const matchResult = apiCall.match(regex);
      if (matchResult) {
        segments.push(matchResult[1]);
      }
    }

    return segments;

  };

  const getBandWidthDistribution = (segments: string[]): number => {
    let bandWidthTotal = 0;

    for (const segment of segments) {
      bandWidthTotal += BAND_WIDTH[segment as keyof typeof BAND_WIDTH];
    }

    return bandWidthTotal;
  };

  const getLevelsNumber = (segments: string[]) => {
    return countUniqueString(segments);
  };

  const countUniqueString = (array: string[]) => {
    const uniqueStrings: any = {};

    array.forEach((item: string) => {
      uniqueStrings[item] = true;
    });

    return Object.keys(uniqueStrings).length;
  };

  const activeLevels = () => {
    setInfoLevels(prevState => ({ ...prevState, activeLevels: true }));
  };

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
    if (countRef.current === 0) {
      setApiXmlHttpRequest();
    }

    console.log("mount", videoId);
    const handleBeforeUnLoad = () => {
      updateStreamedTime();
    };

    window.addEventListener("beforeunload", handleBeforeUnLoad);

    return () => {
      // umount

      console.log("unmount", playedSecondsRef.current);

      window.removeEventListener("beforeunload", handleBeforeUnLoad);

      if (countRef.current === 1) {
        updateStreamedDataTotal();

        updateStreamedTime();
      }

      countRef.current = 1;
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

  if (isLoading || isLoadingVideo) return <PageLoader />;
  console.log("isLoading", isLoading)
  console.log("isLoadingVideo", isLoadingVideo)
  const videoUrlKit =
    baseURL.replace("?", "/ik-master.m3u8?tr=sr-240_360_480_720&");

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
      {/*<h2>Levels: {showLevels && (segments?.data.match(/EXTINF/g) || []).length}</h2>*/}
      {/*<Button variant="contained" onClick={() => setShowLevels(true)}>Show Levels</Button>*/}
      <h2>Levels: {infoLevels.showLevels && infoLevels.numberLevels}</h2>
      <h2>BandWidth: {infoLevels.showLevels && bandWidth}</h2>

      <Button variant="contained" onClick={() => activeLevels()}>Show Levels</Button>

    </div>
  );
}

export default VideoDetail;