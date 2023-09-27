import "./VideoList.css";
import {Link} from "react-router-dom";
import {IVideo} from "../../../types/Video.ts";

interface VideoListProps {
    videos: IVideo[]
}
const VideoList = (props: VideoListProps) => {

    return (
        <div className="video-list">
            {props.videos.map((video) => (
                <Link to={`/${video._id}`} className="video-item" key={video._id} >
                    <img src={video.imgUrl} alt={video.title} />
                    <div className="video-info">
                        <h2>{video.title}</h2>
                        <p>{video.desc}</p>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default VideoList;
