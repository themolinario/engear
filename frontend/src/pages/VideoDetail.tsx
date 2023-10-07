import {useParams} from "react-router-dom";
import ReactPlayer from "react-player";
import {useMutation, useQuery} from "@tanstack/react-query";
import {addView, findVideoById } from "../api/videos.ts";
import {PageLoader} from "../components/basic/PageLoader.tsx";

function VideoDetail () {
    const {videoId}  = useParams();


    const updateViewsMutation = useMutation({
        mutationFn: addView
    });

    const { data: video, isLoading} = useQuery({
        queryKey: [videoId],
        queryFn: () => findVideoById(videoId || ""),
        onSuccess: () => {
            updateViewsMutation.mutate(videoId)
        }
    });

    if (isLoading) return <PageLoader />;


    return (
        <div>
            <h1>{video?.data.title}</h1>
            <div style={{width: '100%', height: 500, position: "relative"}}>
                <ReactPlayer width={'100%'} height='100%' url={video?.data.videoUrl} controls/>
            </div>
            <h2>Views: {video?.data.views}</h2>
        </div>
    )
}

export default VideoDetail;