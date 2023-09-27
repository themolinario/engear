import VideoList from "./components/VideoList.tsx";
import {useMutation} from "@tanstack/react-query";
import {getRandomVideos} from "../../api/videos.ts";
import {useAtomValue} from "jotai";
import {videosAtom} from "../../atoms/videosAtom.ts";
import {useSetAtom} from "jotai";
import {useEffect} from "react";
import {PageLoader} from "../../components/basic/PageLoader.tsx";

function Home (){
    const setVideos = useSetAtom(videosAtom);

    const randomMutation = useMutation({
        mutationFn: getRandomVideos,
        onSuccess: (res) => {
            setVideos(res.data)
        }
    });

    useEffect(() => {
        randomMutation.mutate()
    }, []);

    const videos = useAtomValue(videosAtom);

    if (randomMutation.isLoading) return <PageLoader />

    return (
        <div>
            <VideoList videos={videos}/>
        </div>
    )
}

export default Home;