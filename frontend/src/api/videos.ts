import { IUpdateStreamDataTotalVariables, IVideo } from "../types/Video.ts";
import axios from "axios";

const baseURL = "http://localhost:80/api";
const headers = {Authorization: `Bearer ${window.sessionStorage.getItem('token')}`}
export function getRandomVideos () {
    return axios.get<IVideo[]>('videos/random', {baseURL});
}

export function getVideosByQuery(query: string) {
  return axios.get<IVideo[]>(`videos/search?q=${query}`, { baseURL });
}

export function findVideoById(_id: IVideo["_id"]) {
  return axios.get<IVideo>(`videos/find/${_id}`, { baseURL });
}

export function updateVideoById(video: Partial<IVideo>) {
  return axios.put(`videos/${video._id}`, video, { baseURL });
}

export function postVideo(video: Partial<IVideo>) {
  return axios.post<IVideo>("videos", video, { baseURL, headers });
}

export function addView(_id: IVideo["_id"]) {
  return axios.post(`videos/view/${_id}`, {}, { baseURL });
}

export function updateStreamedTimeTotal({ id, playedSeconds }: IUpdateStreamDataTotalVariables) {
  return axios.put(`videos/streamedTimeTotal/${id}`, { playedSeconds: playedSeconds }, { baseURL });
}

export function getSegments(url: string) {
  return axios.get<string>(url);
}