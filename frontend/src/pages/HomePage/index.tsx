import VideoList from "./components/VideoList.tsx";
import {useMutation} from "@tanstack/react-query";
import {getRandomVideos} from "../../api/videos.ts";
import {useAtomValue} from "jotai";
import {videosAtom} from "../../atoms/videosAtom.ts";
import {useSetAtom} from "jotai";
import {useEffect} from "react";
import {PageLoader} from "../../components/basic/PageLoader.tsx";
import { userAtom } from "../../atoms/userAtom.ts";

function Home (){
    const setVideos = useSetAtom(videosAtom);
    const userData = useAtomValue(userAtom);

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
            <h2>Benvenuto {userData.name.substring(0,1).toUpperCase() + userData.name.substring(1, userData.name.length).toLowerCase()}</h2>
            <VideoList videos={videos}/>
        </div>
    )
}

export default Home;