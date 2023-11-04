import { IUpdateStreamDataTotalVariables, IVideo } from "../types/Video.ts";
import axios from "axios";

export function getRandomVideos() {
  return axios.get<IVideo[]>("videos/random");
}

export function getVideosByQuery(query: string) {
  return axios.get<IVideo[]>(`videos/search?q=${query}`);
}

export function findVideoById(_id: IVideo["_id"]) {
  return axios.get<IVideo>(`videos/find/${_id}`);
}

export function updateVideoById(video: Partial<IVideo>) {
  return axios.put(`videos/${video._id}`, video);
}

export function postVideo(video: Partial<IVideo>) {
  return axios.post<IVideo>("videos", video);
}

export function addView(_id: IVideo["_id"]) {
  return axios.post(`videos/view/${_id}`);
}

export function updateStreamedTimeTotal({ id, playedSeconds }: IUpdateStreamDataTotalVariables) {
  return axios.put(`videos/streamedTimeTotal/${id}`, { playedSeconds: playedSeconds });
}

export function getSegments(url: string) {
  return axios.get<string>(url);
}